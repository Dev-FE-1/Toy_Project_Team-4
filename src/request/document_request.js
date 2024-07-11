import "./document_request.css";

export function loadDocumentRequest() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="document-container">
      <h1><img src="./images/document-request.png" alt="Document Icon" class="document-icon">문서 발급 요청</h1>
      <div class="document-both-container">
        <div class="document-process-container">
          <h2>문서 발급 프로세스</h2>
          <div class="document-process-list">
            <h3>1. 문서 발급 요청서 제출</h3>
            <p>필요한 문서 유형과 정보를 입력하여 요청서를 제출합니다.</p>
            <h3>2. 관리자 검토</h3>
            <p>제출된 요청서를 관리자가 검토합니다.</p>
            <h3>3. 문서 발급</h3>
            <p>승인된 요청에 대해 문서가 발급됩니다.</p>
            <h3>4. 문서 수령</h3>
            <p>발급된 문서를 수령합니다.</p>
          </div>
        </div>
        <div class="document-status-container">
          <div class="document-status-content">
            <div class="document-status-header">
              <span><span class="red-dot"></span>신청 현황</span>
              <div class="document-status-date-range">
                <input type="date" id="search-start-date" class="date-input">
                ~
                <input type="date" id="search-end-date" class="date-input">
              </div>
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
            <div id="pagination" class="pagination">
              <!-- 자바스크립트로 페이지네이션 추가 -->
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
                <option value="certificate-of-participation">참가확인서</option>
                <option value="attendance-record">출석부</option>
                <option value="other">기타</option>
              </select>

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

              <div id="other-document-fields" style="display: none;">
                <label for="required-document">필요한 서류</label>
                <input type="text" id="required-document" name="requiredDocument">
                <label for="reason">사유</label>
                <textarea id="reason" name="reason" rows="5"></textarea>
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
    const otherFields = document.getElementById("other-document-fields");
    if (this.value === "other") {
      otherFields.style.display = "block";
    } else {
      otherFields.style.display = "none";
    }
  });

  let requestData = [];
  let currentPage = 1;
  const itemsPerPage = 4;

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
        <td>${getDocumentTypeText(item.documentType)}</td>
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

    displayPagination();
  }

  function displayPagination() {
    const pagination = document.getElementById("pagination");
    const totalPages = Math.ceil(requestData.length / itemsPerPage);
    pagination.innerHTML = '';

    const createArrow = (direction, disabled) => {
      const arrow = document.createElement('button');
      arrow.textContent = direction === 'left' ? '<' : '>';
      arrow.classList.add('page-arrow');
      if (disabled) {
        arrow.classList.add('page-arrow-disabled');
      } else {
        arrow.addEventListener('click', () => {
          currentPage = direction === 'left' ? currentPage - 1 : currentPage + 1;
          displayData();
        });
      }
      return arrow;
    };

    pagination.appendChild(createArrow('left', currentPage === 1));

    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement('button');
      pageButton.textContent = i;
      pageButton.classList.add('page-button');
      if (i === currentPage) {
        pageButton.classList.add('page-button-active');
      }
      pageButton.addEventListener('click', () => {
        currentPage = i;
        displayData();
      });
      pagination.appendChild(pageButton);
    }

    pagination.appendChild(createArrow('right', currentPage === totalPages));
  }

  async function cancelRequest(id) {
    try {
      const response = await fetch('/cancel-document-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await loadRequestData();
    } catch (error) {
      alert('요청 취소 중 오류가 발생했습니다: ' + error.message);
    }
  }

  function getStatusText(status) {
    switch(status) {
      case 'pending': return '대기중';
      case 'approved': return '승인';
      case 'rejected': return '반려';
      default: return '';
    }
  }

  function getDocumentTypeText(type) {
    switch(type) {
      case 'certificate-of-attendance': return '수강증명서';
      case 'certificate-of-participation': return '참가확인서';
      case 'attendance-record': return '출석부';
      case 'other': return '기타';
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
}