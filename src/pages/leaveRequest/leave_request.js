import "./leave_request.css";

export function loadLeaveRequest() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="leave-container">
      <h1><img src="./icon/leave.png" alt="Leave Icon" class="leave-icon">외출 신청</h1>
      <div class="leave-both-container">
        <div class="leave-process-container">
          <h2>외출 사용 프로세스</h2>
          <div class="leave-process-list">
            <h3>1. 외출 신청서 제출</h3>
            <p>외출 예정 1주일 전 신청서 제출</p>
            <h3>2. 외출 당일 QR 진행</h3>
            <p>4회 진행</p>
            <p>입실 - 외출 - 복귀 - 퇴실</p>
            <h3>3. 외출 당일 ZOOM 캡쳐</h3>
            <p>2회 진행</p>
            <p>입실/퇴실 - 운영진 진행</p>
            <p>외출/복귀 - 훈련생 진행 (외출 정정시 필요할 수 있음)</p>
          </div>
        </div>
        <div class="leave-status-container">
          <div class="leave-status-content">
            <div class="leave-status-header">
              <span><span class="red-dot"></span>신청 현황</span>
              <div class="leave-status-date-range">
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
            <div class="leave-modal-btn-container">
              <button id="leaveModalBtn" class="leave-modal-btn">외출 신청</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="leaveModal" class="leave-modal">
      <div class="leave-modal-content">
        <span class="leave-modal-close-btn">&times;</span>
        <div class="leave-form-container" id="leaveFormContainer">
          <h2>신청서 제출</h2>
          <form id="leaveSubmitForm">
            <div class="leave-submit-all-section">
              <label for="leaveDate">외출 예정일</label>
              <input type="date" id="leaveDate" name="leaveDate" required>
              
              <label for="startTime">시작 시간</label>
              <input type="time" id="startTime" name="startTime" required>
              
              <label for="endTime">종료 시간</label>
              <input type="time" id="endTime" name="endTime" required>
              
              <label for="reason">사유</label>
              <textarea id="reason" rows="6" name="reason" required></textarea>
            </div>
            <button type="submit" class="leave-btn">제출</button>
          </form>
        </div>
      </div>
    </div>
  `;

  const modal = document.getElementById("leaveModal");
  const openModalBtn = document.getElementById("leaveModalBtn");
  const closeModalBtn = document.getElementsByClassName("leave-modal-close-btn")[0];

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

  let requestData = [];
  let currentPage = 1;
  const itemsPerPage = 4;

  async function loadRequestData() {
    try {
      const userInfoString = localStorage.getItem('userInfo');
      if (!userInfoString) {
        throw new Error('로그인 정보를 찾을 수 없습니다.');
      }
      const userInfo = JSON.parse(userInfoString);
      if (!userInfo || !userInfo.userName) {
        throw new Error('유효하지 않은 사용자 정보입니다.');
      }
      const response = await fetch(`/get-leave-request?userName=${userInfo.userName}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Received data is not an array');
      }
      // 현재 로그인한 사용자의 데이터만 필터링
      requestData = data.filter(item => item.name === userInfo.userName);
      displayData();
    } catch (error) {
      alert(error.message);
    }
  }

  function displayData() {
    const tableBody = document.getElementById("status-table-body");
    const pagination = document.getElementById("pagination");
  
    requestData.sort((a, b) => {
      const dateA = new Date(a.submitDate + 'T' + a.submitTime);
      const dateB = new Date(b.submitDate + 'T' + b.submitTime);
      return dateB - dateA; // 내림차순 정렬 (최신 순)
    });
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = requestData.slice(start, end);
  
    tableBody.innerHTML = '';
    pageData.forEach((item, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><span class="status-${item.status}">${getStatusText(item.status)}</span></td>
        <td>${item.type}</td>
        <td>${item.submitDate}</td>
        <td>
          ${item.status === 'rejected' ? `${item.rejectReason || ''}` : ''}
          ${item.status === 'pending' ? `<button class="cancel-button" data-index="${start + index}">취소</button>` : ''}
          ${item.status === 'approved' ? '' : ''}
        </td>
      `;
      tableBody.appendChild(row);
    });
    
    document.querySelectorAll('.cancel-button').forEach(button => {
      button.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        cancelRequest(requestData[index].id);
      });
    });
  
    displayPagination(requestData.length);
  }

  function displayPagination(totalItems) {
    const pagination = document.getElementById("pagination");
    const totalPages = Math.ceil(totalItems / itemsPerPage);
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
      const response = await fetch('/delete-leave-request', {
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

  function getStatusText(status) {
    switch(status) {
      case 'pending': return '대기중';
      case 'approved': return '승인';
      case 'rejected': return '반려';
      case 'cancelled': return '취소됨';
      default: return '';
    }
  }

  document.getElementById("leaveSubmitForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const leaveDate = document.getElementById("leaveDate").value;
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;
    const reason = document.getElementById("reason").value;

    if (!leaveDate || !startTime || !endTime || !reason) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.userName) {
      alert("로그인 정보를 찾을 수 없습니다.");
      return;
    }

    const submitDate = new Date().toISOString().split('T')[0]; // 현재 날짜를 ISO 형식으로

    const requestData = {
      name: userInfo.userName,
      leaveDate,
      startTime,
      endTime,
      reason,
      submitDate
    };

    try {
      const response = await fetch("/upload-leave-request", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
      }
      const data = await response.json();
      if (data.message === "Request submitted successfully") {
        alert("제출이 완료되었습니다.");
        modal.style.display = "none";
        loadRequestData();
      } else {
        alert("제출이 실패했습니다.");
      }
    } catch (error) {
      alert("제출 도중 오류가 발생했습니다: " + error.message);
    }
  });

  loadRequestData();
}
