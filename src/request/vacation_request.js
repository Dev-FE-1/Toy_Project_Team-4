import "./vacation_request.css";

export function loadVacationRequest() {
  const app = document.getElementById("app"); // "app" 요소를 가져옴

  app.innerHTML = `
        <div class="container">
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
    `; // HTML 내용을 "app" 요소에 설정

  const handleFileChange = (id, callback) => {
    document.getElementById(id).addEventListener("change", function () {
      callback(this.files); // 파일이 변경될 때 콜백 함수 호출
    });
  };

  handleFileChange(
    "convert_to_pdf",
    (files) => console.log("Convert to PDF:", files[0]) // "convert_to_pdf" 파일 입력의 변경을 처리
  );
  handleFileChange(
    "compress_to_zip",
    (files) => console.log("Compress to ZIP:", files) // "compress_to_zip" 파일 입력의 변경을 처리
  );

  document
    .getElementById("vacationRequestForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // 폼 제출 기본 동작을 막음
      const formData = new FormData(this); // 폼 데이터를 FormData 객체로 생성
      app.innerHTML = `
            <h2>휴가 신청</h2>
            <p>휴가 신청이 성공적으로 제출되었습니다.</p>
        `; // 제출 성공 메시지를 표시
    });
}

