import "./vacation_request.css"

export function loadVacationRequest() {
  const app = document.getElementById("app")

  app.innerHTML = `
    <div class="vacation_request_container">
      <h2>휴가 신청</h2>
      <form id="vacationRequestForm" action="/submit_vacation_request" method="post" enctype="multipart/form-data">
        <div class="downloads">
          <a href="/attendance_sheet_template.pdf" download class="download-link">출석대장 다운로드</a>
          <a href="/vacation_plan_template.pdf" download class="download-link">휴가계획서 다운로드</a>
        </div>
        <div class="file-subsection">
          <div class="file-input-container">
            <input type="file" id="convert_to_pdf" name="convert_to_pdf" accept=".docx" required>
            <button type="button" onclick="convertToPDF()" class="file-action-btn">PDF 변환</button>
          </div>
        </div>
        <div class="file-subsection">
          <div class="file-input-container">
            <input type="file" id="compress_to_zip" name="compress_to_zip" multiple required>
            <button type="button" onclick="createZip()" class="file-action-btn">ZIP 압축</button>
          </div>
        </div>
        <label for="all_file">파일 첨부</label>
        <input type="file" id="all_file" name="all_file" required>
        <button type="submit">휴가 신청 제출</button>
      </form>
    </div>
  `

  const handleFileChange = (id, callback) => {
    document.getElementById(id).addEventListener("change", function () {
      callback(this.files)
    })
  }

  handleFileChange("convert_to_pdf", (files) => console.log("Convert to PDF:", files[0]))
  handleFileChange("compress_to_zip", (files) => console.log("Compress to ZIP:", files))

  document.getElementById("vacationRequestForm").addEventListener("submit", function (event) {
    event.preventDefault()
    const formData = new FormData(this)
    app.innerHTML = `
      <h2>휴가 신청</h2>
      <p>휴가 신청이 성공적으로 제출되었습니다.</p>
    `
  })
}
