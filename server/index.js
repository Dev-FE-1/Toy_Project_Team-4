import express from "express"
import morgan from "morgan"
import fs from "fs"
import path from "path" //추가된 코드
import multer from "multer" //추가된 코드
import cors from "cors" // 추가된 코드
import { fileURLToPath } from "url" // 추가된 코드
import db from "./database.js"

const THRESHOLD = 2000
const port = process.env.PORT || 8080
const app = express()

app.use(cors()) // 추가된 코드
app.use((req, res, next) => {
  const delayTime = Math.floor(Math.random() * THRESHOLD)

  setTimeout(() => {
    next()
  }, delayTime)
})

app.use(morgan("dev"))
app.use(express.static("dist"))
app.use(express.json())
app.use(express.urlencoded({ extended: true })) //추가된 코드

// __dirname 설정 (7.7 임효정/사진업로드 기능 관련 추가된 코드입니다)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// -------기업공지모음 갤러리 관리자 글작성 multer--------
const storage = multer.diskStorage({
  destination: path.join(__dirname, './uploads'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });

// 임시 데이터 저장소
const galleryDataFilePath = path.join(__dirname, './data/gallery.json');

// JSON 파일에서 데이터 읽기
function readGalleryData() {
  try {
    if (!fs.existsSync(galleryDataFilePath)) {
      fs.writeFileSync(galleryDataFilePath, JSON.stringify([]), 'utf8');
    }
    const data = fs.readFileSync(galleryDataFilePath, 'utf8');
    const parsedData = JSON.parse(data);
    return Array.isArray(parsedData) ? parsedData : [];
  } catch (error) {
    console.error("Error reading gallery data:", error);
    return [];
  }
}

// JSON 파일에 데이터 저장
function writeGalleryData(data) {
  try {
    fs.writeFileSync(galleryDataFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error("Error writing gallery data:", error);
  }
}

// 파일 업로드 라우트
app.post('/upload', upload.single('image'), (req, res) => {
  try {
    const newEntry = {
      img: `/uploads/${req.file.filename}`,
      title: req.body.title,
      desc: req.body.desc,
      date: new Date().toISOString().split('T')[0], // 현재 날짜
      popularity: 0 // 초기 인기 수치
    };
    const galleryData = readGalleryData();
    if (Array.isArray(galleryData)) {
      galleryData.push(newEntry);
      writeGalleryData(galleryData);
      res.status(200).json({ message: 'File uploaded successfully', filePath: `/uploads/${req.file.filename}` });
    } else {
      throw new Error('Gallery data is not an array');
    }
  } catch (error) {
    console.error("File upload failed:", error);  // 오류 메시지 출력
    res.status(500).json({ message: 'File upload failed', error });
  }
});

// 공지 목록을 반환하는 API
app.get('/api/gallery', (req, res) => {
  const galleryData = readGalleryData();
  res.status(200).json(galleryData);
});

// 정적 파일 제공
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
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
      console.error("Error reading JSON file:", err)
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
      console.error("Error parsing JSON file:", parseErr)
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
      console.error("Error reading JSON file:", err)
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
      console.error("Error parsing JSON file:", parseErr)
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
      console.error("Error reading JSON file:", err)
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
      console.error("Error parsing JSON file:", parseErr)
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
      console.error("Error reading JSON file:", err)
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
      console.error("Error parsing JSON file:", parseErr)
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
      console.error("Error reading JSON file:", err)
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
      console.error("Error parsing JSON file:", parseErr)
      return res.status(500).send({
        status: "Internal Server Error",
        message: parseErr,
        data: null,
      })
    }
  })
})

// app.get("/api/userInfo", (req, res) => {
//   const sql = "SELECT * FROM userInfo"

//   db.all(sql, [], (err, rows) => {
//     if (err) {
//       console.error(err.message)
//       res.status(500).json({
//         status: "ERROR",
//         message: "서버 오류가 발생했습니다.",
//       })
//       return
//     }
//     res.json({
//       status: "OK",
//       data: rows,
//     })
//   })
// })

// app.get("/api/userInfo", (req, res) => {
//   const sql = "SELECT * FROM userInfo"

//   db.all(sql, [], (err, rows) => {
//     if (err) {
//       return res.status(500).json({
//         status: "Error",
//         error: err.message,
//       })
//     }

//     res.json({
//       status: "OK",
//       data: rows,
//     })
//   })
// })

app.listen(port, () => {
  console.log(`ready to ${port}`)
})
