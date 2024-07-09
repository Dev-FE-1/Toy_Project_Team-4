import express from "express"
import morgan from "morgan"
import fs from "fs"
import fileUpload from "express-fileupload"
import path from "path"
import cors from "cors"
import { fileURLToPath } from "url"
import { dirname } from "path"
import libre from "libreoffice-convert"
import multer from "multer" //추가된 코드
import database from "./database.js"

const THRESHOLD = 2000
const port = process.env.PORT || 8080
const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const leaveRequestFilePath = path.join(__dirname, "data", "leave_request.json")
const vacationRequestFilePath = path.join(__dirname, "data", "vacation_request.json")

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

app.use(morgan("dev"))
app.use(express.static("dist"))
app.use(express.json())
app.use(express.urlencoded({ extended: true })); // 추가된 코드


// -------기업공지모음 갤러리 관리자 글작성 multer--------
const storage = multer.diskStorage({
  destination: path.join(__dirname, "./uploads"),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// JSON 파일 경로
const galleryDataFilePath = path.join(__dirname, "./data/gallery.json");

// JSON 파일에서 데이터 읽기
function readGalleryData() {
  try {
    if (!fs.existsSync(galleryDataFilePath)) {
      console.log("gallery.json file does not exist, creating new one.");
      fs.writeFileSync(galleryDataFilePath, JSON.stringify([]), 'utf8');
    }
    const data = fs.readFileSync(galleryDataFilePath, 'utf8');
    const parsedData = JSON.parse(data);
    console.log("Read gallery data:", parsedData);
    return Array.isArray(parsedData.data) ? parsedData.data : [];
  } catch (error) {
    console.error("Error reading gallery data:", error);
    return [];
  }
}

// JSON 파일에 데이터 저장
function writeGalleryData(data) {
  try {
    const dataToWrite = { status: "OK", data: data }; // 상태와 데이터를 함께 저장
    fs.writeFileSync(galleryDataFilePath, JSON.stringify(dataToWrite, null, 2), 'utf8');
  } catch (error) {
    console.error("Error writing gallery data:", error);
  }
}

// 파일 업로드 라우트
app.post('/upload', upload.single('image'), (req, res) => {
  try {
    const newEntry = {
      img: `/server/uploads/${req.file.filename}`,  // 경로 앞에 /server 추가
      title: req.body.title,
      desc: req.body.desc,
      date: new Date().toISOString().split('T')[0],
      popularity: 0
    };
    const galleryData = readGalleryData();
    galleryData.push(newEntry);
    writeGalleryData(galleryData);
    console.log("File uploaded:", req.file); // 로그 추가
    res.status(200).json({ message: 'File uploaded successfully', filePath: `/uploads/${req.file.filename}` });
  } catch (error) {
    console.error("File upload failed:", error);
    res.status(500).json({ message: 'File upload failed', error });
  }
});

// 공지 목록을 반환하는 API
app.get("/api/gallery", (req, res) => {
  const galleryData = readGalleryData();
  console.log("Sending gallery data:", galleryData);
  res.status(200).json(galleryData);
});

// 정적 파일 제공
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/public", express.static(path.join(__dirname, "public")));

// 기존의 /api/gallery.json 엔드포인트 유지
app.get("/api/gallery.json", (req, res) => {
  const galleryData = readGalleryData();
  console.log("Sending gallery data via /api/gallery.json:", galleryData);
  res.status(200).json(galleryData);
});
// --------multer--------


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

// app.get("/api/gallery.json", (req, res) => {
//   fs.readFile("./server/data/gallery.json", "utf8", (err, data) => {
//     if (err) {
//       console.error("Error reading JSON file:", err)
//       return res.status(500).send({
//         status: "Internal Server Error",
//         message: err,
//         data: null,
//       })
//     }

  //   try {
  //     const json = JSON.parse(data)
  //     res.json(json)
  //   } catch (parseErr) {
  //     return res.status(500).send({
  //       status: "Internal Server Error",
  //       message: parseErr,
  //       data: null,
  //     })
  //   }
  // })

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