import "./document_request.css";

export function loadDocumentRequest() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="document-container">
      <h1><img src="./icon/document-request.png" alt="Document Icon" class="document-icon">문서 발급 요청</h1>
      <div class="document-both-container">
        <div class="document-process-container">
          <div class="document-process-list">
            <h3>1. 수강 증명서 발급 요청</h3>
            <p>수강생은 필요한 정보를 입력하여 수강 증명서 발급 요청서 제출</p>
            <p>관리자가 요청서를 검토한 후, 수강 증명서 양식을 수강생에게 발송</p>
            <p>수강생은 개인정보 및 출결 내역을 작성한 후 서명하여 제출</p>
            <p>관리자가 검토 완료 후 승인된 요청에 대해 수강 증명서 최종 발급</p>
            <br>
            <br>
            <br>
            <h3>2. 출석부 발급 요청</h3>
            <p>수강생은 필요한 정보를 입력하여 출석부 발급 요청서 제출</p>
            <p>관리자가 요청서를 검토한 후, 승인된 요청에 대해 출석부 발급</p>
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
                    <th>사유</th>
                    <th>관리</th>
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

    <div id="resubmitModal" class="resubmit-modal">
      <div class="resubmit-modal-content">
        <span class="resubmit-modal-close-btn">&times;</span>
        <div class="resubmit-form-container" id="resubmitFormContainer">
          <h2>문서 제출</h2>
          <form id="resubmit-form">
            <input type="file" id="resubmitFile" name="resubmitFile" accept=".pdf,.doc,.docx" required>
            <button type="submit" class="resubmit-btn">제출</button>
          </form>
        </div>
      </div>
    </div>
  `;

  const modal = document.getElementById("documentModal");
  const submitModal = document.getElementById("resubmitModal");
  const openModalBtn = document.getElementById("documentModalBtn");
  const closeModalBtns = document.getElementsByClassName("document-modal-close-btn");
  const closeResubmitModalBtns = document.getElementsByClassName("resubmit-modal-close-btn");

  openModalBtn.onclick = function() {
    modal.style.display = "block";
  };

  Array.from(closeModalBtns).forEach(btn => {
    btn.onclick = function() {
      modal.style.display = "none";
    };
  });

  Array.from(closeResubmitModalBtns).forEach(btn => {
    btn.onclick = function() {
      submitModal.style.display = "none";
    };
  });

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
    if (event.target == submitModal) {
      submitModal.style.display = "none";
    }
  };

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
  
    requestData.sort((a, b) => {
      const dateA = new Date(a.submitDate + "T" + (a.submitTime.length === 5 ? a.submitTime + ":00" : a.submitTime));
      const dateB = new Date(b.submitDate + "T" + (b.submitTime.length === 5 ? b.submitTime + ":00" : b.submitTime));
      return dateB - dateA; // 내림차순 정렬 (최신 순)
    });
  
    tableBody.innerHTML = '';
  
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = requestData.slice(start, end);
  
    pageData.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><span class="status-${item.status}">${getStatusText(item.status, item.documentType)}</span></td>
        <td>${getDocumentTypeText(item)}</td>
        <td>${item.submitDate} ${item.submitTime}</td>
        <td>${getRemark(item)}</td>
        <td>${getActionButtons(item)}</td>
      `;
      tableBody.appendChild(row);
    });
  
    addEventListeners();
    setPageButtons();
  }

  function getStatusText(status, documentType) {
    if (documentType === 'attendance-record' && status === 'pending') return '발급 대기중';
    switch(status) {
      case 'pending': return '대기중';
      case 'approved': return '양식 제출 대기중';
      case 'rejected': return '반려';
      case 'document_submitted': return '발급 대기중';
      case 'completed': return '발급 완료';
      default: return '알 수 없음';
    }
  }

  function getRemark(item) {
    if (item.status === 'rejected') {
      return item.rejectReason || 'N/A';
    }
    return item.reason || 'N/A';
  }
  
  function getDocumentTypeText(item) {
    switch(item.documentType) {
      case 'certificate-of-attendance': return '수강증명서';
      case 'attendance-record': return '출석부';
      default: return '';
    }
  }

  function getActionButtons(item) {
    if (item.documentType === 'attendance-record') {
      if (item.status === 'pending' || item.status === 'document_submitted') {
        return `<button class="cancel-button" data-id="${item.id}">취소</button>`; // 발급 대기중 상태에서 취소 버튼 추가
      }
      if (item.status === 'completed') {
        return `<button class="download-btn" data-url="${item.fileUrl}" data-filename="${item.originalFileName || '문서'}">파일 다운로드</button>`;
      }
      if (item.status === 'rejected') {
        return `<button class="cancel-button" data-id="${item.id}">취소</button>`;
      }
    } else {
      if (item.status === 'pending') {
        return `<button class="cancel-button" data-id="${item.id}">취소</button>`;
      }
      if (item.status === 'approved') {
        return `
          <button class="download-btn" data-url="${item.fileUrl}" data-filename="${item.originalFileName || '양식'}">양식 다운로드</button>
          <button class="submit-btn" data-id="${item.id}">제출</button>
        `;
      }
      if (item.status === 'document_submitted') {
        return `<button class="cancel-button" data-id="${item.id}">취소</button>`; // 발급 대기중 상태에서 취소 버튼 추가
      }
      if (item.status === 'completed') {
        return `<button class="download-btn" data-url="${item.fileUrl}" data-filename="${item.originalFileName || '문서'}">파일 다운로드</button>`;
      }
      if (item.status === 'rejected') {
        if (item.hasBeenSubmitted) { // 양식 제출 후 반려된 경우
          return `<button class="submit-btn" data-id="${item.id}">다시 제출</button>`;
        } else {
          return `<button class="cancel-button" data-id="${item.id}">취소</button>`;
        }
      }
    }
    return '';
  }
      
  function addEventListeners() {
    document.querySelectorAll('.cancel-button').forEach(btn => {
      btn.addEventListener('click', function() {
        cancelRequest(this.getAttribute('data-id'));
      });
    });
  
    document.querySelectorAll('.download-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const url = this.getAttribute('data-url');
        const filename = this.getAttribute('data-filename');
        if (url) {
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          alert("다운로드할 파일이 없습니다.");
        }
      });
    });
  
    document.querySelectorAll('.submit-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const currentRequestId = this.getAttribute('data-id'); 
        openSubmitModal(currentRequestId);
      });
    });
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
      const response = await fetch('/cancel-document-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "요청 취소 중 오류가 발생했습니다.");
      }
      await loadRequestData();
    } catch (error) {
      console.error("Error cancelling request:", error);
      alert(error.message);
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

  function openSubmitModal(id) {
    submitModal.style.display = "block";
    const submitForm = document.getElementById("resubmit-form");
    submitForm.onsubmit = async function(event) {
      event.preventDefault();
  
      const fileInput = document.getElementById('resubmitFile');
      const file = fileInput.files[0];
      if (!file) {
        alert("파일을 선택하세요.");
        return;
      }
  
      const formData = new FormData();
      formData.append('file', file);
      formData.append('id', id);
  
      try {
        const response = await fetch('/upload-document', {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const result = await response.json();
        await updateRequestStatus(id, 'document_submitted', result.fileUrl);
        alert("제출이 완료되었습니다.");
        submitModal.style.display = "none";
        fileInput.value = '';
        loadRequestData();
      } catch (error) {
        console.error('Error submitting document:', error);
        alert("제출 중 오류가 발생했습니다: " + error.message);
      }
    };
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

  async function updateRequestStatus(id, status, fileUrl = '') {
    try {
      const response = await fetch('/update-document-request-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, fileUrl })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      loadRequestData();
    } catch (error) {
      console.error('Error updating request status:', error);
      alert("상태 업데이트 중 오류가 발생했습니다: " + error.message);
    }
  }

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
