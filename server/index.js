import express from "express";
import morgan from "morgan";
import fs from "fs";
import fileUpload from "express-fileupload";
import libre from "libreoffice-convert";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";

const port = process.env.PORT || 8080;
const app = express();

process.env.SOFFICE_PATH = "C:\\Program Files\\LibreOffice\\program\\soffice.exe";

app.use(cors());
app.use(fileUpload());
app.use(morgan("dev"));
app.use(express.static("dist"));
app.use(express.static("public")); // 추가: public 디렉토리에서 정적 파일 서빙
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// PDF 변환 기능 추가
app.post("/convert", async (req, res) => {
  if (!req.files?.wordFile)
    return res.status(400).send("No files were uploaded.");

  const wordFile = req.files.wordFile;
  const filePath = path.join(__dirname, "uploads", wordFile.name);
  const pdfPath = filePath.replace(/\.docx?$/, ".pdf");

  if (!fs.existsSync(path.join(__dirname, "uploads")))
    fs.mkdirSync(path.join(__dirname, "uploads"));

  wordFile.mv(filePath, async (err) => {
    if (err) return res.status(500).send(err);

    try {
      const docxBuf = await fs.promises.readFile(filePath);
      libre.convert(docxBuf, ".pdf", undefined, async (err, done) => {
        if (err) return res.status(500).send(`Error converting file: ${err}`);

        try {
          await fs.promises.writeFile(pdfPath, done);
          res.sendFile(pdfPath, async (err) => {
            if (err) return res.status(500).send(err);

            await fs.promises.unlink(filePath);
            await fs.promises.unlink(pdfPath);
          });
        } catch (err) {
          return res.status(500).send(err);
        }
      });
    } catch (err) {
      return res.status(500).send(err);
    }
  });
});

// 사용자 데이터 엔드포인트 추가
app.get("/api/users.json", (req, res) => {
  fs.readFile(path.join(__dirname, "data", "users.json"), "utf8", (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      return res.status(500).send({
        status: "Internal Server Error",
        message: err,
        data: null,
      });
    }

    try {
      const jsonData = JSON.parse(data);
      res.json({
        status: "OK",
        data: jsonData.data, // jsonData.data로 수정
      });
    } catch (parseErr) {
      console.error("Error parsing JSON file:", parseErr);
      return res.status(500).send({
        status: "Internal Server Error",
        message: parseErr,
        data: null,
      });
    }
  });
});

// 다른 JSON 데이터 엔드포인트
app.get("/api/notice.json", (req, res) => {
  fs.readFile(path.join(__dirname, "data", "notice.json"), "utf8", (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      return res.status(500).send({
        status: "Internal Server Error",
        message: err,
        data: null,
      });
    }

    try {
      const json = JSON.parse(data);
      res.json(json);
    } catch (parseErr) {
      console.error("Error parsing JSON file:", parseErr);
      return res.status(500).send({
        status: "Internal Server Error",
        message: parseErr,
        data: null,
      });
    }
  });
});

app.get("/api/attendance.json", (req, res) => {
  fs.readFile(path.join(__dirname, "data", "attendance.json"), "utf8", (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      return res.status(500).send({
        status: "Internal Server Error",
        message: err,
        data: null,
      });
    }

    try {
      const json = JSON.parse(data);
      res.json(json);
    } catch (parseErr) {
      console.error("Error parsing JSON file:", parseErr);
      return res.status(500).send({
        status: "Internal Server Error",
        message: parseErr,
        data: null,
      });
    }
  });
});

app.get("/api/gallery.json", (req, res) => {
  fs.readFile(path.join(__dirname, "data", "gallery.json"), "utf8", (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      return res.status(500).send({
        status: "Internal Server Error",
        message: err,
        data: null,
      });
    }

    try {
      const json = JSON.parse(data);
      res.json(json);
    } catch (parseErr) {
      console.error("Error parsing JSON file:", parseErr);
      return res.status(500).send({
        status: "Internal Server Error",
        message: parseErr,
        data: null,
      });
    }
  });
});

app.get("/api/inquiry.json", (req, res) => {
  fs.readFile(path.join(__dirname, "data", "inquiry.json"), "utf8", (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      return res.status(500).send({
        status: "Internal Server Error",
        message: err,
        data: null,
      });
    }

    try {
      const json = JSON.parse(data);
      res.json(json);
    } catch (parseErr) {
      console.error("Error parsing JSON file:", parseErr);
      return res.status(500).send({
        status: "Internal Server Error",
        message: parseErr,
        data: null,
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
