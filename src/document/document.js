import "./document.css";

export function loadDocumentRequestForm() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
      <div class="document_container">
          <h2>문서 발급 요청</h2>
          <form id="document-form">
              <label for="document-type">문서 유형</label>
              <select id="document-type" name="document-type" onchange="toggleFields()">
                  <option value="certificate-of-attendance">수강증명서</option>
                  <option value="certificate-of-participation">참가확인서</option>
                  <option value="attendance-record">출석부</option>
                  <option value="other">기타</option>
              </select>
              <div id="additional-fields">
                  <div id="name-field">
                      <label for="name">이름</label>
                      <input type="text" id="name" name="name" required>
                  </div>
                  <div id="email-field">
                      <label for="email">이메일</label>
                      <input type="email" id="email" name="email" required>
                  </div>
                  <div id="period-field">
                      <label for="start-date">필요한 기간</label>
                      <div class="date-range">
                          <input type="date" id="start-date" name="start-date" required>
                          <span> ~ </span>
                          <input type="date" id="end-date" name="end-date" required>
                      </div>
                  </div>
                  <div id="other-document-fields" style="display: none;">
                      <label for="required-document">필요한 서류</label>
                      <input type="text" id="required-document" name="required-document">
                      <label for="reason">사유</label>
                      <textarea id="reason" name="reason" rows="5"></textarea>
                  </div>
              </div>
              <button type="submit" id="submit-button">제출</button>
          </form>
          <div id="follow-up-message" style="display: none;">
              <p id="follow-up-text"></p>
              <button id="next-step-button" style="display: none;" onclick="nextStep()">다음 단계</button>
          </div>
      </div>
  `;

  document.getElementById("document-form").addEventListener("change", toggleFields);
  document.getElementById("document-form").addEventListener("submit", handleSubmit);
}

function toggleFields() {
  const docType = document.getElementById("document-type").value;
  const fields = {
      nameField: document.getElementById("name-field"),
      emailField: document.getElementById("email-field"),
      periodField: document.getElementById("period-field"),
      otherDocFields: document.getElementById("other-document-fields")
  };

  if (docType === "other") {
      fields.nameField.style.display = "none";
      fields.emailField.style.display = "none";
      fields.periodField.style.display = "none";
      fields.otherDocFields.style.display = "block";
  } else {
      fields.nameField.style.display = "block";
      fields.emailField.style.display = "block";
      fields.periodField.style.display = "block";
      fields.otherDocFields.style.display = "none";
  }
}

function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = {};
  formData.forEach((value, key) => {
      data[key] = value;
  });

  document.getElementById("document-form").style.display = "none";
  document.getElementById("follow-up-message").style.display = "block";
  document.getElementById("follow-up-text").innerText = "문서 발급 요청이 성공적으로 제출되었습니다.";
  document.getElementById("next-step-button").style.display = "block";
}

function nextStep() {
  alert("다음 단계를 진행합니다.");
  // 다음 단계의 작업을 여기에 추가
}
