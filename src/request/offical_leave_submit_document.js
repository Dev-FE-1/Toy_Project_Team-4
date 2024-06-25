import "./offical_leave_submit_document.css";

export function loadOfficialLeaveSubmitDocument() {
  document.getElementById("app").innerHTML = `
    <div class="offical_leave_submit_document_container">
      <div class="form-container">
        <form id="officialLeaveForm" action="관리자용" method="post" enctype="multipart/form-data" class="form-box">
          <h2>서류 제출</h2>
          <div class="file-section">
            <a href="/attendance_sheet_template.pdf" download class="download-link">출석대장 다운로드</a>
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
          </div>
          <div class="file-section combined-section">
            <label for="attendance_sheet">파일 첨부</label>
            <input type="file" id="all_file" name="all_file" required>
          </div>
          <button type="submit" class="center-btn">서류 제출</button>
        </form>
      </div>
    </div>
  `;

  document
    .getElementById("officialLeaveForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      console.log(
        "PDF 변환 파일:",
        document.getElementById("convert_to_pdf").files[0]
      );
      console.log(
        "ZIP 압축 파일들:",
        document.getElementById("compress_to_zip").files
      );
      console.log("첨부 파일:", document.getElementById("all_file").files[0]);
    });

  window.convertToPDF = function () {
    alert("PDF 변환 기능은 나중에함.");
  };

  window.createZip = function () {
    alert("ZIP 압축 기능 나중에함");
  };
}
