import express from "express"
import morgan from "morgan"
import fs from "fs"
import fileUpload from "express-fileupload"
import path from "path"
import cors from "cors"
import { fileURLToPath } from "url"
import { dirname } from "path"
import libre from "libreoffice-convert"
import database from "./database.js"
import { v4 as uuidv4 } from "uuid"

const THRESHOLD = 2000
const port = process.env.PORT || 8080
const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const leaveRequestFilePath = path.join(__dirname, "data", "leave_request.json")
const vacationRequestFilePath = path.join(__dirname, "data", "vacation_request.json")
const officialLeaveRequestFilePath = path.join(__dirname, "data", "official_leave_request.json")
const attendanceCorrectionRequestFilePath = path.join(__dirname, "data", "attendance_correction_request.json")
const documentRequestFilePath = path.join(__dirname, "data", "document_request.json")
const galleryDataFilePath = path.join(__dirname, "data", "gallery.json")

// LibreOffice 경로 설정
if (process.platform === "win32") {
  process.env.SOFFICE_PATH = "C:\\Program Files\\LibreOffice\\program\\soffice.exe"
} else {
  process.env.SOFFICE_PATH = "/Applications/LibreOffice.app/Contents/MacOS/soffice"
}

// 미들웨어
app.use(cors())
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}))
app.use(morgan("dev"))
app.use(express.static("dist"))
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use((req, res, next) => {
  const delayTime = Math.floor(Math.random() * THRESHOLD)
  setTimeout(() => {
    next()
  }, delayTime)
})

// JSON 파일이 존재하지 않으면 초기화
if (!fs.existsSync(leaveRequestFilePath)) {
  fs.writeFileSync(leaveRequestFilePath, JSON.stringify({ request: [] }))
}

if (!fs.existsSync(vacationRequestFilePath)) {
  fs.writeFileSync(vacationRequestFilePath, JSON.stringify({ request: [] }))
}

if (!fs.existsSync(officialLeaveRequestFilePath)) {
  fs.writeFileSync(officialLeaveRequestFilePath, JSON.stringify({ request: [] }))
}

if (!fs.existsSync(attendanceCorrectionRequestFilePath)) {
  fs.writeFileSync(attendanceCorrectionRequestFilePath, JSON.stringify({ request: [] }))
}

if (!fs.existsSync(documentRequestFilePath)) {
  fs.writeFileSync(documentRequestFilePath, JSON.stringify({ request: [] }))
}

// ---------- 출결 정정 요청 ----------

app.post("/upload-attendance-correction-request", async (req, res) => {
  if (!req.files || !req.files.correctionFile) {
    return res.status(400).json({ error: "No files were uploaded." })
  }

  const correctionFile = req.files.correctionFile
  const { name, date, courseName, userId, reason } = req.body

  if (!name || !date || !courseName || !userId || !reason) {
    return res.status(400).json({ error: "Missing required fields." })
  }

  const now = new Date()
  const formattedDate = new Date(date).toISOString().split("T")[0]
  const submitDate = now.toISOString().split("T")[0]
  const submitTime = now.toTimeString().split(":").slice(0, 2).join(":")
  const fileName = `${formattedDate}_${courseName}_${name}(출결 정정).zip`
  const filePath = path.join(__dirname, "uploads", fileName)

  if (!fs.existsSync(path.join(__dirname, "uploads"))) {
    fs.mkdirSync(path.join(__dirname, "uploads"), { recursive: true })
  }

  try {
    await correctionFile.mv(filePath)

    const newRequest = {
      id: Date.now(),
      name,
      type: "출결정정",
      date: formattedDate,
      status: "pending",
      reason,
      filePath,
      submitDate,
      submitTime,
      userId,
    }

    let requests
    try {
      const data = await fs.promises.readFile(attendanceCorrectionRequestFilePath, "utf8")
      requests = JSON.parse(data)
    } catch (err) {
      requests = { request: [] }
    }

    requests.request.push(newRequest)

    try {
      await fs.promises.writeFile(attendanceCorrectionRequestFilePath, JSON.stringify(requests, null, 2))
      res.json({ message: "File uploaded successfully", request: newRequest })
    } catch (err) {
      res.status(500).json({ error: "Failed to save request", details: err.message })
    }
  } catch (err) {
    res.status(500).json({ error: "File upload failed", details: err.message })
  }
})

app.get("/get-attendance-correction-request", async (req, res) => {
  const { userName } = req.query

  try {
    const data = await fs.promises.readFile(attendanceCorrectionRequestFilePath, "utf8")
    let requests = JSON.parse(data).request

    if (userName) {
      requests = requests.filter((request) => request.name === userName)
    }

    requests = requests.map((request) => ({
      ...request,
      fileUrl: request.filePath ? `http://localhost:8080/uploads/${path.basename(request.filePath)}` : null,
    }))

    res.json(requests)
  } catch (err) {
    console.error("Failed to read data:", err)
    res.status(500).json({ error: "Failed to read data", details: err.message })
  }
})

app.post("/update-attendance-correction-status", async (req, res) => {
  const { id, status, rejectReason } = req.body

  try {
    const data = await fs.promises.readFile(attendanceCorrectionRequestFilePath, "utf8")
    const requests = JSON.parse(data)
    const requestIndex = requests.request.findIndex((req) => req.id == id)

    if (requestIndex === -1) {
      return res.status(404).json({ error: "Request not found" })
    }

    requests.request[requestIndex] = {
      ...requests.request[requestIndex],
      status: status,
      rejectReason: status === "rejected" ? rejectReason : undefined,
    }

    await fs.promises.writeFile(attendanceCorrectionRequestFilePath, JSON.stringify(requests, null, 2))
    res.json({ message: "Status updated successfully" })
  } catch (err) {
    res.status(500).json({ error: "Failed to update status", details: err.message })
  }
})

app.post("/delete-attendance-correction-request", async (req, res) => {
  const { id } = req.body

  try {
    const data = await fs.promises.readFile(attendanceCorrectionRequestFilePath, "utf8")
    const requests = JSON.parse(data)
    const requestIndex = requests.request.findIndex((req) => req.id == id)

    if (requestIndex === -1) {
      return res.status(404).json({ error: "Request not found" })
    }

    requests.request.splice(requestIndex, 1)

    await fs.promises.writeFile(attendanceCorrectionRequestFilePath, JSON.stringify(requests, null, 2))
    res.json({ message: "Request deleted successfully" })
  } catch (err) {
    res.status(500).json({ error: "Failed to delete request", details: err.message })
  }
})

// ---------- 외출 신청 ----------

app.post("/upload-leave-request", async (req, res) => {
  const { name, leaveDate, startTime, endTime, reason } = req.body

  if (!name || !leaveDate || !startTime || !endTime || !reason) {
    return res.status(400).json({ error: "Missing required fields." })
  }

  const now = new Date()
  const formattedDate = new Date(leaveDate).toISOString().split("T")[0]
  const submitDate = now.toISOString().split("T")[0]
  const submitTime = now.toTimeString().split(":").slice(0, 2).join(":") // HH:MM 형식으로 저장

  const newRequest = {
    id: Date.now(),
    name,
    type: "외출",
    date: formattedDate,
    startTime,
    endTime,
    status: "pending",
    reason,
    submitDate,
    submitTime,
  }

  try {
    const data = await fs.promises.readFile(leaveRequestFilePath, "utf8")
    const requests = JSON.parse(data)
    requests.request.push(newRequest)

    await fs.promises.writeFile(leaveRequestFilePath, JSON.stringify(requests, null, 2))

    res.json({ message: "Request submitted successfully", request: newRequest })
  } catch (err) {
    res.status(500).json({ error: "Request submission failed", details: err.message })
  }
})

app.get("/get-leave-request", async (req, res) => {
  const { userName } = req.query

  try {
    const data = await fs.promises.readFile(leaveRequestFilePath, "utf8")
    let requests = JSON.parse(data).request

    if (userName) {
      requests = requests.filter((request) => request.name === userName)
    }

    res.json(requests)
  } catch (err) {
    res.status(500).json({ error: "Failed to read data", details: err.message })
  }
})

app.post("/update-leave-status", async (req, res) => {
  const { id, status, rejectReason } = req.body

  try {
    const data = await fs.promises.readFile(leaveRequestFilePath, "utf8")
    const requests = JSON.parse(data)
    const requestIndex = requests.request.findIndex((req) => req.id == id)

    if (requestIndex === -1) {
      return res.status(404).json({ error: "Request not found" })
    }

    requests.request[requestIndex] = {
      ...requests.request[requestIndex],
      status: status,
      rejectReason: status === "rejected" ? rejectReason : undefined,
    }

    await fs.promises.writeFile(leaveRequestFilePath, JSON.stringify(requests, null, 2))
    res.json({ message: "Status updated successfully" })
  } catch (err) {
    res.status(500).json({ error: "Failed to update status", details: err.message })
  }
})

app.post("/delete-leave-request", async (req, res) => {
  const { id } = req.body

  try {
    const data = await fs.promises.readFile(leaveRequestFilePath, "utf8")
    const requests = JSON.parse(data)
    const requestIndex = requests.request.findIndex((req) => req.id == id)

    if (requestIndex === -1) {
      return res.status(404).json({ error: "Request not found" })
    }

    requests.request.splice(requestIndex, 1)

    await fs.promises.writeFile(leaveRequestFilePath, JSON.stringify(requests, null, 2))
    res.json({ message: "Request deleted successfully" })
  } catch (err) {
    res.status(500).json({ error: "Failed to delete request", details: err.message })
  }
})

// ---------- 휴가 신청 ----------

// 휴가 요청 업로드 
app.post("/upload-vacation-request", async (req, res) => {
  if (!req.files || !req.files.vacationFile) {
    return res.status(400).json({ error: "No files were uploaded." });
  }

  const vacationFile = req.files.vacationFile;
  const { name, date, courseName, userId } = req.body;

  if (!name || !date || !courseName || !userId) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const now = new Date();
  const formattedDate = new Date(date).toISOString().split("T")[0];
  const submitDate = now.toISOString().split("T")[0];
  const submitTime = now.toTimeString().split(":").slice(0, 2).join(":");
  const fileName = `${formattedDate}_${courseName}_${name}(휴가).zip`;
  const filePath = path.join(__dirname, "uploads", fileName);

  if (!fs.existsSync(path.join(__dirname, "uploads"))) {
    fs.mkdirSync(path.join(__dirname, "uploads"), { recursive: true });
  }

  try {
    await vacationFile.mv(filePath);

    const newRequest = {
      id: Date.now(),
      name,
      type: "휴가",
      date: formattedDate,
      status: "pending",
      reason: "",
      filePath,
      submitDate,
      submitTime,
      userId,
    };

    const data = await fs.promises.readFile(vacationRequestFilePath, "utf8");
    const requests = JSON.parse(data);
    requests.request.push(newRequest);

    await fs.promises.writeFile(vacationRequestFilePath, JSON.stringify(requests, null, 2));

    res.json({ message: "File uploaded successfully", request: newRequest });
  } catch (err) {
    res.status(500).json({ error: "File upload failed", details: err.message });
  }
});

// 휴가 요청 조회 
app.get("/get-vacation-request", async (req, res) => {
  const { userName } = req.query;

  try {
    const data = await fs.promises.readFile(vacationRequestFilePath, "utf8");
    let requests = JSON.parse(data).request;

    if (userName) {
      requests = requests.filter((request) => request.name === userName);
    }

    requests = requests.map((request) => ({
      ...request,
      fileUrl: request.filePath ? `http://localhost:8080/uploads/${path.basename(request.filePath)}` : null,
    }));

    res.json(requests);
  } catch (err) {
    console.error("Failed to read data:", err);
    res.status(500).json({ error: "Failed to read data", details: err.message });
  }
});

// 휴가 요청 상태 업데이트 
app.post("/update-vacation-status", async (req, res) => {
  const { id, status, rejectReason } = req.body;

  try {
    const data = await fs.promises.readFile(vacationRequestFilePath, "utf8");
    const requests = JSON.parse(data);
    const requestIndex = requests.request.findIndex((req) => req.id == id);

    if (requestIndex === -1) {
      return res.status(404).json({ error: "Request not found" });
    }

    requests.request[requestIndex] = {
      ...requests.request[requestIndex],
      status: status,
      rejectReason: status === "rejected" ? rejectReason : undefined,
    };

    await fs.promises.writeFile(vacationRequestFilePath, JSON.stringify(requests, null, 2));
    res.json({ message: "Status updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status", details: err.message });
  }
});

// 휴가 요청 삭제 
app.post("/delete-vacation-request", async (req, res) => {
  const { id } = req.body;

  try {
    const data = await fs.promises.readFile(vacationRequestFilePath, "utf8");
    const requests = JSON.parse(data);
    const requestIndex = requests.request.findIndex((req) => req.id == id);

    if (requestIndex === -1) {
      return res.status(404).json({ error: "Request not found" });
    }

    requests.request.splice(requestIndex, 1);

    await fs.promises.writeFile(vacationRequestFilePath, JSON.stringify(requests, null, 2));
    res.json({ message: "Request deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete request", details: err.message });
  }
});

// 공가 신청서 제출 및 서류 제출
app.post("/upload-official-leave-request", async (req, res) => {
  if (req.files && req.files.documents) {
    const { id } = req.body;
    const documents = req.files.documents;

    try {
      const data = await fs.promises.readFile(officialLeaveRequestFilePath, "utf8");
      const requests = JSON.parse(data);
      const requestIndex = requests.request.findIndex((req) => String(req.id) === String(id));

      if (requestIndex === -1) {
        return res.status(404).json({ error: "Request not found" });
      }

      const request = requests.request[requestIndex];
      const fileName = `${new Date().toISOString().split("T")[0]}_데브캠프 : 프론트엔드 개발 4회차_${request.name}(공가).zip`;
      const filePath = path.join(__dirname, "uploads", fileName);

      if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
      }

      await documents.mv(filePath);

      requests.request[requestIndex] = {
        ...request,
        documentSubmitted: true,
        documentPath: path.relative(__dirname, filePath),
        fileName: fileName,
        status: "finalPending", // 서류 제출 후 최종 승인 대기중 상태로 변경
      };

      await fs.promises.writeFile(officialLeaveRequestFilePath, JSON.stringify(requests, null, 2));

      const fileUrl = new URL(`/uploads/${fileName}`, `http://${req.headers.host}`).toString();

      res.json({
        message: "서류가 제출되었습니다. 최종 승인 대기중입니다.",
        fileName: fileName,
        fileUrl: `http://localhost:8080/uploads/${fileName}`,
      });
    } catch (err) {
      console.error("Error in document submission:", err);
      res.status(500).json({ error: "Failed to submit documents", details: err.message });
    }
  } else {
    const { name, startDate, endDate, reason } = req.body;

    if (!name || !startDate || !endDate || !reason) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const now = new Date();
    const submitDate = now.toISOString().split("T")[0];
    const submitTime = now.toTimeString().split(":").slice(0, 2).join(":");

    const newRequest = {
      id: uuidv4(),
      name,
      type: "공가",
      startDate,
      endDate,
      status: "pending", // 초기 상태는 임시 승인 대기중
      reason,
      submitDate,
      submitTime,
      documentSubmitted: false,
    };

    try {
      const data = await fs.promises.readFile(officialLeaveRequestFilePath, "utf8");
      const requests = JSON.parse(data);
      requests.request.push(newRequest);

      await fs.promises.writeFile(officialLeaveRequestFilePath, JSON.stringify(requests, null, 2));
      res.json({
        message: "Request submitted successfully",
        request: newRequest,
      });
    } catch (err) {
      console.error("Error in request submission:", err);
      res.status(500).json({ error: "Request submission failed", details: err.message });
    }
  }
});

// 공가 신청 요청 조회
app.get("/get-official-leave-request", async (req, res) => {
  const { userName } = req.query;

  try {
    const data = await fs.promises.readFile(officialLeaveRequestFilePath, "utf8");
    let requests = JSON.parse(data).request;

    if (userName) {
      requests = requests.filter((request) => request.name === userName);
    }

    requests = requests.map((request) => ({
      ...request,
      fileUrl: request.documentPath ? `http://localhost:8080/uploads/${path.basename(request.documentPath)}` : null,
    }));

    res.json(requests);
  } catch (err) {
    console.error("Failed to read data:", err);
    res.status(500).json({ error: "Failed to read data", details: err.message });
  }
});

// 공가 신청 상태 업데이트
app.post("/update-official-leave-status", async (req, res) => {
  const { id, status, rejectReason } = req.body;

  try {
    const data = await fs.promises.readFile(officialLeaveRequestFilePath, "utf8");
    const requests = JSON.parse(data);
    const requestIndex = requests.request.findIndex((req) => req.id === id);

    if (requestIndex === -1) {
      return res.status(404).json({ error: "Request not found" });
    }

    requests.request[requestIndex] = {
      ...requests.request[requestIndex],
      status: status,
      rejectReason: status === "rejected" ? rejectReason : undefined,
    };

    await fs.promises.writeFile(officialLeaveRequestFilePath, JSON.stringify(requests, null, 2));
    res.json({ message: "Status updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status", details: err.message });
  }
});

// 공가 신청 삭제
app.post("/delete-official-leave-request", async (req, res) => {
  const { id } = req.body;

  try {
    const data = await fs.promises.readFile(officialLeaveRequestFilePath, "utf8");
    const requests = JSON.parse(data);
    const requestIndex = requests.request.findIndex((req) => req.id === id);

    if (requestIndex === -1) {
      return res.status(404).json({ error: "Request not found" });
    }

    requests.request.splice(requestIndex, 1);

    await fs.promises.writeFile(officialLeaveRequestFilePath, JSON.stringify(requests, null, 2));
    res.json({ message: "Request deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete request", details: err.message });
  }
});

// ---------- 문서 발급 ----------

// 문서 업로드 처리
app.post("/upload-document", async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ error: "No files were uploaded." });
  }

  const file = req.files.file;
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const originalFileName = Buffer.from(file.name, 'latin1').toString('utf8');
  const fileExtension = path.extname(originalFileName);
  const fileName = `${uuidv4()}${fileExtension}`;
  const uploadPath = path.join(__dirname, "uploads", fileName);

  if (!fs.existsSync(path.join(__dirname, "uploads"))) {
    fs.mkdirSync(path.join(__dirname, "uploads"), { recursive: true });
  }

  try {
    // 임시 파일을 사용하여 파일 복사
    const tempPath = file.tempFilePath;
    await fs.promises.copyFile(tempPath, uploadPath);

    const data = await fs.promises.readFile(documentRequestFilePath, "utf8");
    const requests = JSON.parse(data);
    const requestIndex = requests.request.findIndex((req) => req.id === id);

    if (requestIndex === -1) {
      return res.status(404).json({ error: "Request not found" });
    }

    requests.request[requestIndex] = {
      ...requests.request[requestIndex],
      fileUrl: `/uploads/${fileName}`,
      originalFileName: originalFileName,
      hasBeenSubmitted: true,  // 이 줄을 추가
      status: 'document_submitted'  // 이 줄을 추가
    };

    await fs.promises.writeFile(
      documentRequestFilePath,
      JSON.stringify(requests, null, 2)
    );

    res.json({
      message: "File uploaded successfully",
      fileUrl: `/uploads/${fileName}`,
      originalFileName: originalFileName
    });
  } catch (err) {
    console.error("Error in file upload:", err);
    res.status(500).json({ error: "File upload failed", details: err.message });
  }
});

// 문서 발급 요청 제출
app.post("/upload-document-request", async (req, res) => {
  const { name, documentType, startDate, endDate, reason, email, requiredDocument } = req.body

  if (!name || !documentType || !startDate || !endDate || !email) {
    return res.status(400).json({ error: "Missing required fields." })
  }

  const now = new Date()
  const submitDate = now.toISOString().split("T")[0]
  const submitTime = now.toTimeString().split(":").slice(0, 2).join(":")
  const fullSubmitTime = now.toISOString()

  const newRequest = {
    id: uuidv4(),
    name,
    documentType,
    startDate,
    endDate,
    reason,
    email,
    requiredDocument,
    status: "pending",
    submitDate,
    submitTime,
    fullSubmitTime,
    hasBeenSubmitted: false  // 여기에 hasBeenSubmitted 플래그 추가
  }

  try {
    const data = await fs.promises.readFile(documentRequestFilePath, "utf8")
    const requests = JSON.parse(data)
    requests.request.unshift(newRequest) // 배열의 맨 앞에 추가

    await fs.promises.writeFile(documentRequestFilePath, JSON.stringify(requests, null, 2))
    res.json({
      message: "Request submitted successfully",
      request: newRequest,
    })
  } catch (err) {
    console.error("Error in request submission:", err)
    res.status(500).json({ error: "Request submission failed", details: err.message })
  }
})

// 문서 발급 요청 목록 조회
app.get("/get-document-request", async (req, res) => {
  const { userName } = req.query

  try {
    const data = await fs.promises.readFile(documentRequestFilePath, "utf8")
    let requests = JSON.parse(data).request

    if (userName) {
      requests = requests.filter((request) => request.name === userName)
    }

    res.json(requests)
  } catch (err) {
    console.error("Failed to read data:", err)
    res.status(500).json({ error: "Failed to read data", details: err.message })
  }
})

// 문서 발급 요청 상태 업데이트
app.post("/update-document-request-status", async (req, res) => {
  const { id, status, rejectReason } = req.body

  try {
    const data = await fs.promises.readFile(documentRequestFilePath, "utf8")
    const requests = JSON.parse(data)
    const requestIndex = requests.request.findIndex((req) => req.id === id)

    if (requestIndex === -1) {
      return res.status(404).json({ error: "Request not found" })
    }

    requests.request[requestIndex] = {
      ...requests.request[requestIndex],
      status: status,
      rejectReason: status === "rejected" ? rejectReason : undefined,
    }

    await fs.promises.writeFile(documentRequestFilePath, JSON.stringify(requests, null, 2))
    res.json({ message: "Status updated successfully" })
  } catch (err) {
    res.status(500).json({ error: "Failed to update status", details: err.message })
  }
})

// 문서 발급 요청 취소
app.post("/cancel-document-request", async (req, res) => {
  const { id } = req.body

  try {
    const data = await fs.promises.readFile(documentRequestFilePath, "utf8")
    const requests = JSON.parse(data)
    const requestIndex = requests.request.findIndex((req) => req.id === id)

    if (requestIndex === -1) {
      return res.status(404).json({ error: "Request not found" })
    }

    const request = requests.request[requestIndex]

    // 'pending' 또는 'rejected' 상태일 때 취소 가능하도록 수정
    if (request.status !== "pending" && request.status !== "rejected") {
      return res.status(400).json({ error: "Can only cancel pending or rejected requests" })
    }

    // 수강증명서의 경우, hasBeenSubmitted가 false일 때만 취소 가능
    if (request.documentType === 'certificate-of-attendance' && request.status === 'rejected' && request.hasBeenSubmitted) {
      return res.status(400).json({ error: "Cannot cancel this request" })
    }

    requests.request.splice(requestIndex, 1)

    await fs.promises.writeFile(documentRequestFilePath, JSON.stringify(requests, null, 2))
    res.json({ message: "Request cancelled successfully" })
  } catch (err) {
    res.status(500).json({ error: "Failed to cancel request", details: err.message })
  }
})

// ---------- PDF 변환 기능 ----------
app.post("/convert", async (req, res) => {
  if (!req.files?.wordFile) return res.status(400).send("No files were uploaded.")

  const wordFile = req.files.wordFile
  const filePath = path.join(__dirname, "uploads", wordFile.name)
  const pdfPath = filePath.replace(/\.docx?$/, ".pdf")

  if (!fs.existsSync(path.join(__dirname, "uploads"))) fs.mkdirSync(path.join(__dirname, "uploads"))

  wordFile.mv(filePath, async (err) => {
    if (err) return res.status(500).send(err)

    try {
      const docxBuf = await fs.promises.readFile(filePath)
      libre.convert(docxBuf, ".pdf", undefined, async (err, done) => {
        if (err) return res.status(500).send(`Error converting file: ${err}`)

        try {
          await fs.promises.writeFile(pdfPath, done)
          res.sendFile(pdfPath, async (err) => {
            if (err) return res.status(500).send(err)

            await fs.promises.unlink(filePath)
            await fs.promises.unlink(pdfPath)
          })
        } catch (err) {
          return res.status(500).send(err)
        }
      })
    } catch (err) {
      return res.status(500).send(err)
    }
  })
})

// ---------- 기업공지모음 갤러리 업로드 기능 ----------
app.post("/upload", (req, res) => {
  if (!req.files || !req.files.image) {
    console.error("No files were uploaded.")
    return res.status(400).send("No files were uploaded.")
  }

  const image = req.files.image
  const sanitizedFileName = `${uuidv4()}_${image.name.replace(/[^a-zA-Z0-9.]/g, "_")}`
  const uploadPath = path.join(__dirname, "uploads", sanitizedFileName)

  if (!fs.existsSync(path.dirname(uploadPath))) {
    fs.mkdirSync(path.dirname(uploadPath), { recursive: true })
  }

  image.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err)
    }

    const newEntry = {
      img: `server/uploads/${path.basename(uploadPath)}`, // 경로 수정
      title: req.body.title,
      desc: req.body.desc,
      date: new Date().toISOString().split("T")[0],
      popularity: 0,
    }

    const galleryData = readGalleryData()
    galleryData.push(newEntry)
    writeGalleryData(galleryData)

    res.status(200).json({ message: "File uploaded successfully", filePath: `/uploads/${path.basename(uploadPath)}` })
  })
})

// JSON 파일에서 데이터 읽기
function readGalleryData() {
  try {
    if (!fs.existsSync(galleryDataFilePath)) {
      // console.log("gallery.json file does not exist, creating new one.");
      fs.writeFileSync(galleryDataFilePath, JSON.stringify([]), "utf8")
    }
    const data = fs.readFileSync(galleryDataFilePath, "utf8")
    const parsedData = JSON.parse(data)
    return Array.isArray(parsedData.data) ? parsedData.data : []
  } catch (error) {
    console.error("Error reading gallery data:", error)
    return []
  }
}

// JSON 파일에 데이터 저장
function writeGalleryData(data) {
  try {
    const dataToWrite = { status: "OK", data: data } // 상태와 데이터를 함께 저장
    fs.writeFileSync(galleryDataFilePath, JSON.stringify(dataToWrite, null, 2), "utf8")
  } catch (error) {
    console.error("Error writing gallery data:", error)
  }
}

// 공지 목록을 반환하는 API
app.get("/api/gallery", (req, res) => {
  const galleryData = readGalleryData()
  res.status(200).json(galleryData)
})

// 정적 파일 제공
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use("/public", express.static(path.join(__dirname, "public")))

// 기존의 /api/gallery.json 엔드포인트 유지
app.get("/api/gallery.json", (req, res) => {
  const galleryData = readGalleryData()
  res.status(200).json(galleryData)
})

// ---------- 사용자 정보 불러오기 ----------
app.get("/api/users.json", (req, res) => {
  fs.readFile("./server/data/users.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).send({
        status: "Internal Server Error",
        message: err,
        data: null,
      })
    }

    try {
      const jsonData = JSON.parse(data)
      res.json(jsonData)
    } catch (parseErr) {
      return res.status(500).send({
        status: "Internal Server Error",
        message: parseErr,
        data: null,
      })
    }
  })
})

// ---------- 공지사항 정보 불러오기 ----------
app.get("/api/notice.json", (req, res) => {
  fs.readFile("./server/data/notice.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).send({
        status: "Internal Server Error",
        message: err,
        data: null,
      })
    }

    try {
      const json = JSON.parse(data)
      res.json(json)
    } catch (parseErr) {
      return res.status(500).send({
        status: "Internal Server Error",
        message: parseErr,
        data: null,
      })
    }
  })
})

// ---------- 입퇴실 정보 불러오기 ----------
app.get("/api/attendance.json", (req, res) => {
  fs.readFile("./server/data/attendance.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).send({
        status: "Internal Server Error",
        message: err,
        data: null,
      })
    }

    try {
      const json = JSON.parse(data)
      res.json(json)
    } catch (parseErr) {
      return res.status(500).send({
        status: "Internal Server Error",
        message: parseErr,
        data: null,
      })
    }
  })
})

// ---------- 입퇴실 시간 기록하기 ----------
app.post("/api/attendance", async (req, res) => {
  try {
    const { date, type, time } = req.body
    const filePath = path.join(__dirname, "data", "attendance.json")

    let data = await fs.promises.readFile(filePath, "utf8")
    data = JSON.parse(data)

    const existingEntryIndex = data.data.findIndex((entry) => entry.date === date)

    if (existingEntryIndex !== -1) {
      if (type === "in" && data.data[existingEntryIndex].in === "-") {
        data.data[existingEntryIndex].in = time
      } else if (type === "out" && data.data[existingEntryIndex].out === "-") {
        data.data[existingEntryIndex].out = time
        data.data[existingEntryIndex].time = calculateTime(data.data[existingEntryIndex].in, time)
        data.data[existingEntryIndex].status = "정상처리"
      } else {
        return res.status(400).json({ status: "error", message: "이미 기록이 존재합니다." })
      }
    } else {
      const newEntry = {
        id: data.data.length + 1,
        date,
        in: type === "in" ? time : "-",
        out: type === "out" ? time : "-",
        time: "-",
        status: "미처리",
      }
      data.data.push(newEntry)
    }

    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2))

    res.json({ status: "ok" })
  } catch (error) {
    console.error("Error:", error)
    res.status(500).json({ status: "error", message: error.message })
  }
})

function calculateTime(inTime, outTime) {
  const [inHours, inMinutes, inSeconds] = inTime.split(":").map(Number)
  const [outHours, outMinutes, outSeconds] = outTime.split(":").map(Number)

  let totalSeconds = outHours * 3600 + outMinutes * 60 + outSeconds - (inHours * 3600 + inMinutes * 60 + inSeconds)

  if (totalSeconds < 0) {
    totalSeconds += 24 * 3600 // 날짜가 바뀐 경우
  }

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

// ---------- 문의게시판 정보 불러오기 ----------
app.get("/api/inquiry.json", (req, res) => {
  fs.readFile("./server/data/inquiry.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).send({
        status: "Internal Server Error",
        message: err,
        data: null,
      })
    }

    try {
      const json = JSON.parse(data)
      res.json(json)
    } catch (parseErr) {
      return res.status(500).send({
        status: "Internal Server Error",
        message: parseErr,
        data: null,
      })
    }
  })
})

// ---------- database.js ----------
app.get("/api/users", (req, res) => {
  const sql = "SELECT * FROM users"

  database.all(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: "Error",
        message: err.message,
      })
    }

    res.json({
      status: "OK",
      data: rows,
    })
  })
})

// ---------- 마이페이지 프로필사진 업로드 ----------
const profileImgUploadPath = path.join(__dirname, "profileImgs")
if (!fs.existsSync(profileImgUploadPath)) {
  fs.mkdirSync(profileImgUploadPath)
}
const userJsonPath = path.join(__dirname, "data", "users.json")
app.post("/profileImgs/:id", (req, res) => {
  const userId = parseInt(req.params.id)
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("업로드된 파일이 존재하지 않습니다.")
  }
  const profileImage = req.files.profileImage
  const uploadFilePath = path.join(profileImgUploadPath, profileImage.name) //업로드한 파일 경로
  profileImage.mv(uploadFilePath, () => {
    fs.readFile(userJsonPath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).send("유저 정보를 불러오지 못했습니다.")
      }
      let users = JSON.parse(data)
      let userIdx = 0
      if (Array.isArray(users.data)) {
        userIdx = users.data.findIndex((item) => {
          return item.id === userId
        })
      }
      const oldProfileImagePath = users.data[userIdx].profileImage
      users.data[userIdx].profileImage = path.join("/server/profileImgs/", profileImage.name)
      fs.writeFile(userJsonPath, JSON.stringify(users, null, 2), (err) => {
        if (err) {
          return res.status(500).send("프로필 이미지 업데이트 실패")
        }
        if (oldProfileImagePath && fs.existsSync(oldProfileImagePath)) {
          fs.unlink(oldProfileImagePath, (err) => {
            if (err) {
              console.log("이전 프로필사진 삭제 실패 사유 :", err)
            }
          })
        }
        res.send("프로필 이미지 수정 성공.")
      })
    })
  })
})

app.listen(port, () => {
  console.log(`ready to ${port}`)
})
