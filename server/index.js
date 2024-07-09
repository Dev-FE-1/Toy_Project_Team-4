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

const THRESHOLD = 2000
const port = process.env.PORT || 8080
const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const leaveRequestFilePath = path.join(__dirname, "data", "leave_request.json")
const vacationRequestFilePath = path.join(__dirname, "data", "vacation_request.json")

// LibreOffice 경로 설정
if (process.platform === "win32") {
  process.env.SOFFICE_PATH = "C:\\Program Files\\LibreOffice\\program\\soffice.exe"
} else {
  process.env.SOFFICE_PATH = "/Applications/LibreOffice.app/Contents/MacOS/soffice"
}

// 미들웨어
app.use(cors())
app.use(fileUpload())
app.use(morgan("dev"))
app.use(express.static("dist"))
app.use(express.static("public"))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
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

// 외출 신청
app.post("/upload-leave-request", async (req, res) => {
  const { name, leaveDate, startTime, endTime, reason } = req.body

  if (!name || !leaveDate || !startTime || !endTime || !reason) {
    return res.status(400).json({ error: "Missing required fields." })
  }

  const formattedDate = new Date(leaveDate).toISOString().split('T')[0]
  const now = new Date()
  const submitDate = now.toISOString().split('T')[0]
  const submitTime = now.toTimeString().split(':').slice(0, 2).join(':') // HH:MM 형식으로 저장

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
    submitTime
  }

  try {
    const data = await fs.promises.readFile(leaveRequestFilePath, 'utf8')
    const requests = JSON.parse(data)
    requests.request.push(newRequest)

    await fs.promises.writeFile(leaveRequestFilePath, JSON.stringify(requests, null, 2))

    res.json({ message: "Request submitted successfully", request: newRequest })
  } catch (err) {
    res.status(500).json({ error: "Request submission failed", details: err.message })
  }
})

app.get("/get-leave-request", async (req, res) => {
  const { userName } = req.query;

  try {
    const data = await fs.promises.readFile(leaveRequestFilePath, 'utf8')
    let requests = JSON.parse(data).request

    if (userName) {
      requests = requests.filter(request => request.name === userName)
    }

    res.json(requests)
  } catch (err) {
    res.status(500).json({ error: "Failed to read data", details: err.message })
  }
})

app.post("/update-leave-status", async (req, res) => {
  const { id, status, rejectReason } = req.body

  try {
    const data = await fs.promises.readFile(leaveRequestFilePath, 'utf8')
    const requests = JSON.parse(data)
    const requestIndex = requests.request.findIndex(req => req.id == id)

    if (requestIndex === -1) {
      return res.status(404).json({ error: "Request not found" })
    }

    requests.request[requestIndex] = {
      ...requests.request[requestIndex],
      status: status,
      rejectReason: status === 'rejected' ? rejectReason : undefined
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
    const data = await fs.promises.readFile(leaveRequestFilePath, 'utf8')
    const requests = JSON.parse(data)
    const requestIndex = requests.request.findIndex(req => req.id == id)

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
  const formattedDate = new Date(date).toISOString().split('T')[0];
  const submitDate = new Date(now.setDate(now.getDate() + 1)).toISOString().split("T")[0];
  const submitTime = now.toTimeString().split(':').slice(0, 2).join(':');
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
      userId
    };

    const data = await fs.promises.readFile(vacationRequestFilePath, 'utf8');
    const requests = JSON.parse(data);
    requests.request.push(newRequest);

    await fs.promises.writeFile(vacationRequestFilePath, JSON.stringify(requests, null, 2));

    res.json({ message: "File uploaded successfully", request: newRequest });
  } catch (err) {
    res.status(500).json({ error: "File upload failed", details: err.message });
  }
});

app.get("/get-vacation-request", async (req, res) => {
  const { userName, userType } = req.query;

  try {
    const data = await fs.promises.readFile(vacationRequestFilePath, 'utf8');
    let requests = JSON.parse(data).request;

    if (userName) {
      requests = requests.filter(request => request.name === userName);
    }

    if (userType) {
      requests = requests.filter(request => request.userType === userType);
    }

    requests = requests.map(request => ({
      ...request,
      fileUrl: request.filePath ? `http://localhost:8080/uploads/${path.basename(request.filePath)}` : null
    }));

    res.json(requests);
  } catch (err) {
    console.error('Failed to read data:', err);
    res.status(500).json({ error: "Failed to read data", details: err.message });
  }
});


app.post("/update-vacation-status", async (req, res) => {
  const { id, status, rejectReason } = req.body

  try {
    const data = await fs.promises.readFile(vacationRequestFilePath, 'utf8')
    const requests = JSON.parse(data)
    const requestIndex = requests.request.findIndex(req => req.id == id)

    if (requestIndex === -1) {
      return res.status(404).json({ error: "Request not found" })
    }

    requests.request[requestIndex] = {
      ...requests.request[requestIndex],
      status: status,
      rejectReason: status === 'rejected' ? rejectReason : undefined
    }

    await fs.promises.writeFile(vacationRequestFilePath, JSON.stringify(requests, null, 2))
    res.json({ message: "Status updated successfully" })
  } catch (err) {
    res.status(500).json({ error: "Failed to update status", details: err.message })
  }
})

app.post("/delete-vacation-request", async (req, res) => {
  const { id } = req.body

  try {
    const data = await fs.promises.readFile(vacationRequestFilePath, 'utf8')
    const requests = JSON.parse(data)
    const requestIndex = requests.request.findIndex(req => req.id == id)

    if (requestIndex === -1) {
      return res.status(404).json({ error: "Request not found" })
    }

    requests.request.splice(requestIndex, 1)

    await fs.promises.writeFile(vacationRequestFilePath, JSON.stringify(requests, null, 2))
    res.json({ message: "Request deleted successfully" })
  } catch (err) {
    res.status(500).json({ error: "Failed to delete request", details: err.message })
  }
})

// PDF 변환
app.post("/convert", async (req, res) => {
  if (!req.files?.wordFile)
    return res.status(400).send("No files were uploaded.")

  const wordFile = req.files.wordFile
  const filePath = path.join(__dirname, "uploads", wordFile.name)
  const pdfPath = filePath.replace(/\.docx?$/, ".pdf")

  if (!fs.existsSync(path.join(__dirname, "uploads")))
    fs.mkdirSync(path.join(__dirname, "uploads"))

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

app.get("/api/gallery.json", (req, res) => {
  fs.readFile("./server/data/gallery.json", "utf8", (err, data) => {
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

app.get("/api/counter", (req, res) => {
  const counter = Number(req.query.latest)

  if (Math.floor(Math.random() * 10) <= 3) {
    res.status(400).send({
      status: "Error",
      data: null,
    })
  } else {
    res.status(200).send({
      status: "OK",
      data: counter + 1,
    })
  }
})

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

app.listen(port, () => {
  console.log(`ready to ${port}`)
})