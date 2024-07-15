import "./document_request.css";

export function loadDocumentRequest() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="document-container">
      <h1><img src="./images/document-request.png" alt="Document Icon" class="document-icon">문서 발급 요청</h1>
      <div class="document-both-container">
        <div class="document-process-container">
          <div class="document-process-list">
            <h3>1. 수강 증명서 발급 요청</h3>
            <p>훈련생은 필요한 정보를 입력하여 수강 증명서 발급 요청서 제출</p>
            <p>관리자가 요청서를 검토한 후, 수강 증명서 양식을 훈련생에게 발송</p>
            <p>훈련생은 개인정보 및 출결 내역을 작성한 후 서명하여 제출</p>
            <p>관리자가 검토 완료 후 승인된 요청에 대해 수강 증명서 최종 발급</p>
            <br>
            <h3>2. 출석부 발급 요청</h3>
            <p>훈련생은 필요한 정보를 입력하여 출석부 발급 요청서 제출</p>
            <p>관리자가 요청서를 검토한 후, 승인된 요청에 대해 출석부 발급</p>
            <br>
            <h3>3. 기타 문서 발급 요청</h3>
            <p>훈련생은 필요한 서류와 사유를 입력하여 기타 문서 발급 요청서 제출</p>
            <p>관리자가 요청서를 검토한 후, 문서 발급</p>
          </div>
        </div>
        <div class="document-status-container">
          <div class="document-status-content">
            <div class="document-status-header">
              <span><span class="red-dot"></span>신청 현황</span>
            </div>
            <div class="status-table-container">
              <table class="status-table">
                <thead>
                  <tr>
                    <th>상태</th>
                    <th>신청 종류</th>
                    <th>제출 일자</th>
                    <th>비고</th>
                  </tr>
                </thead>
                <tbody id="status-table-body">
                  <!-- 자바스크립트로 내용 추가 -->
                </tbody>
              </table>
            </div>
            <div class="document-pagination-container">
              <button class="prev-button"><</button>
              <div class="number-btn-wrapper"></div>
              <button class="next-button">></button>
            </div>
            <div class="document-modal-btn-container">
              <button id="documentModalBtn" class="document-modal-btn">문서 발급 요청</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="documentModal" class="document-modal">
      <div class="document-modal-content">
        <span class="document-modal-close-btn">&times;</span>
        <div class="document-form-container" id="documentFormContainer">
          <h2>문서 발급 요청</h2>
          <form id="document-form">
            <div class="document-submit-all-section">
              <label for="document-type">문서 유형</label>
              <select id="document-type" name="documentType" required>
                <option value="certificate-of-attendance">수강증명서</option>
                <option value="attendance-record">출석부</option>
                <option value="other">기타</option>
              </select>

              <div id="standard-fields">
                <label for="name">이름</label>
                <input type="text" id="name" name="name" required>

                <label for="email">이메일</label>
                <input type="email" id="email" name="email" required>

                <label for="start-date">필요한 기간</label>
                <div class="date-range">
                  <input type="date" id="start-date" name="startDate" required>
                  <span> ~ </span>
                  <input type="date" id="end-date" name="endDate" required>
                </div>
              </div>

              <div id="other-document-fields" style="display: none;">
                <label for="required-document">필요한 서류</label>
                <input type="text" id="required-document" name="requiredDocument">
              </div>

              <div id="reason-field">
                <label for="reason">사유</label>
                <textarea id="reason" name="reason" rows="4" required></textarea>
              </div>
            </div>
            <button type="submit" class="document-btn">제출</button>
          </form>
        </div>
      </div>
    </div>
  `;

  const modal = document.getElementById("documentModal");
  const openModalBtn = document.getElementById("documentModalBtn");
  const closeModalBtn = document.getElementsByClassName("document-modal-close-btn")[0];

  openModalBtn.onclick = function() {
    modal.style.display = "block";
  };

  closeModalBtn.onclick = function() {
    modal.style.display = "none";
  };

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  document.getElementById("document-type").addEventListener("change", function() {
    const standardFields = document.getElementById("standard-fields");
    const otherFields = document.getElementById("other-document-fields");
    const reasonField = document.getElementById("reason-field");

    if (this.value === "other") {
      standardFields.style.display = "none";
      otherFields.style.display = "block";
      reasonField.style.display = "block";
    } else {
      standardFields.style.display = "block";
      otherFields.style.display = "none";
      reasonField.style.display = "block";
    }
  });

  let requestData = [];
  let currentPage = 1;
  const itemsPerPage = 5;

  async function loadRequestData() {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.userName) {
        throw new Error('로그인 정보를 찾을 수 없습니다.');
      }
      const response = await fetch(`/get-document-request?userName=${userInfo.userName}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Received data is not an array');
      }
      requestData = data.filter(item => item.name === userInfo.userName);
      displayData();
    } catch (error) {
      alert(error.message);
    }
  }

  function displayData() {
    const tableBody = document.getElementById("status-table-body");

    requestData.sort((a, b) => new Date(b.submitDate) - new Date(a.submitDate));

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = requestData.slice(start, end);

    tableBody.innerHTML = '';
    pageData.forEach((item, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><span class="status-${item.status}">${getStatusText(item.status)}</span></td>
        <td>${getDocumentTypeText(item)}</td>
        <td>${item.submitDate}</td>
        <td>
          ${item.status === 'rejected' ? `${item.rejectReason || ''}` : ''}
          ${item.status === 'pending' ? `<button class="cancel-button" data-id="${item.id}">취소</button>` : ''}
        </td>
      `;
      tableBody.appendChild(row);
    });

    document.querySelectorAll('.cancel-button').forEach(btn => {
      btn.addEventListener('click', function() {
        cancelRequest(this.getAttribute('data-id'));
      });
    });

    setPageButtons();
  }

  function setPageButtons() {
    const totalPageCount = Math.ceil(requestData.length / itemsPerPage);

    const numberBtnWrapper = document.querySelector(".number-btn-wrapper");
    numberBtnWrapper.innerHTML = "";
    for (let i = 0; i < totalPageCount; i++) {
      const button = document.createElement('button');
      button.textContent = i + 1;
      button.classList.add('pagebtn');
      if (i === currentPage - 1) {
        button.classList.add('btnFocus');
      }
      button.addEventListener('click', function() {
        currentPage = parseInt(this.textContent);
        displayData();
        changeBtn(this.textContent);
        arrBtn();
      });
      numberBtnWrapper.appendChild(button);
    }
    arrBtn();
  }

  function arrBtn() {
    const prevBtn = document.querySelector(".prev-button");
    const nextBtn = document.querySelector(".next-button");
    const btnFocus = document.querySelector(".btnFocus");
    const pageNumberBtn = document.querySelectorAll(".pagebtn");

    if (!btnFocus || pageNumberBtn.length === 0) {
      if (prevBtn) prevBtn.classList.remove("color");
      if (nextBtn) nextBtn.classList.remove("color");
      return;
    }

    let btnNum = Array.from(pageNumberBtn).map(btn => btn.textContent);
    let maxNum = Math.max(...btnNum);
    let minNum = Math.min(...btnNum);

    if (Number(btnFocus.textContent) === minNum) {
      nextBtn.classList.add("color");
      prevBtn.classList.remove("color");
    } else if (Number(btnFocus.textContent) === maxNum) {
      nextBtn.classList.remove("color");
      prevBtn.classList.add("color");
    } else {
      nextBtn.classList.add("color");
      prevBtn.classList.add("color");
    }
  }

  async function cancelRequest(id) {
    try {
      const response = await fetch('/delete-document-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await loadRequestData();
    } catch (error) {
      alert("요청 취소 중 오류가 발생했습니다: " + error.message);
    }
  }

  function changeBtn(clickBtnNum) {
    const buttons = document.querySelectorAll('.pagebtn');
    buttons.forEach(button => {
      if (button.textContent === clickBtnNum) {
        button.classList.add('btnFocus');
      } else {
        button.classList.remove('btnFocus');
      }
    });
  }

  function getStatusText(status) {
    switch(status) {
      case 'pending': return '대기중';
      case 'approved': return '승인';
      case 'rejected': return '반려';
      default: return '';
    }
  }

  function getDocumentTypeText(item) {
    switch(item.documentType) {
      case 'certificate-of-attendance': return '수강증명서';
      case 'attendance-record': return '출석부';
      case 'other': return item.requiredDocument || '기타';
      default: return '';
    }
  }

  document.getElementById("document-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.userName) {
      alert("로그인 정보를 찾을 수 없습니다.");
      return;
    }
    formData.append('name', userInfo.userName);

    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/upload-document-request", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.message === "Request submitted successfully") {
        alert("문서 발급 요청이 완료되었습니다.");
        modal.style.display = "none";
        loadRequestData();
      } else {
        alert("문서 발급 요청이 실패했습니다.");
      }
    } catch (error) {
      alert("문서 발급 요청 중 오류가 발생했습니다: " + error.message);
    }
  });

  loadRequestData();

  const prevBtn = document.querySelector(".prev-button");
  const nextBtn = document.querySelector(".next-button");
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      displayData();
      changeBtn(currentPage.toString());
      arrBtn();
    }
  });
  nextBtn.addEventListener("click", () => {
    if (currentPage < Math.ceil(requestData.length / itemsPerPage)) {
      currentPage++;
      displayData();
      changeBtn(currentPage.toString());
      arrBtn();
    }
  });
}
