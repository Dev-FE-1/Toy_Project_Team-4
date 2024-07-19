import "./managerAttendanceCorrection.css";

export function loadManagerAttendanceCorrectionRequests() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="manager-correction-container">
        <div class="manager-correction-header">
        <h1>출결 정정 요청 현황</h1>
        </div>
        <div class="manager-correction-search">
          <input type="text" id="student-name" placeholder="수강생 이름을 입력하세요">
          <button class="filter-button">검색</button>
        </div>
      <table class="manager-correction-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>신청 종류</th>
            <th>제출 일자</th>
            <th>정정 요청일</th>
            <th>사유</th>
            <th>상태</th>
            <th>관리</th>      
          </tr>
        </thead>
        <tbody id="manager-correction-table-body">
          <!-- 자바스크립트로 내용 추가 -->
        </tbody>
      </table>
      <div class="manager-correction-pagination-container">
        <button class="prev-button"><</button>
        <div class="number-btn-wrapper"></div>
        <button class="next-button">></button>
      </div>
    </div>

    <div id="reasonModal" class="reason-modal">
      <div class="manager-correction-modal-content">
        <span class="manager-correction-modal-close-btn">&times;</span>
        <div class="reason-form-container" id="reasonFormContainer">
          <h2>반려 사유</h2>
          <textarea id="reasonText" rows="4" cols="50"></textarea>
          <button id="submitReasonBtn" class="submit-reason-btn">전송</button>
        </div>
      </div>
    </div>
  `;

  const tableBody = document.getElementById('manager-correction-table-body');
  const reasonModal = document.getElementById('reasonModal');
  const closeModalBtn = document.getElementsByClassName('manager-correction-modal-close-btn')[0];
  const submitReasonBtn = document.getElementById('submitReasonBtn');
  const filterButton = document.querySelector('.filter-button');
  const paginationContainer = document.querySelector(".number-btn-wrapper");
  const prevBtn = document.querySelector(".prev-button");
  const nextBtn = document.querySelector(".next-button");

  let currentRequestId;
  let currentPage = 1;
  const itemsPerPage = 8;
  let filteredData = [];

  async function loadTableData(studentName = '') {
    try {
      const response = await fetch('/get-attendance-correction-request');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Received data is not an array');
      }
      // 제출일과 제출 시간을 기준으로 최신순 정렬
      data.sort((a, b) => {
        const dateA = new Date(a.submitDate + 'T' + a.submitTime);
        const dateB = new Date(b.submitDate + 'T' + b.submitTime);
        return dateB - dateA; // 내림차순 정렬 (최신 순)
      });
      filteredData = studentName ? data.filter(item => item.name.includes(studentName)) : data;
      displayPage(1);  // 페이지 번호 초기화
    } catch (error) {
      console.error('Error loading attendance correction requests:', error);
    }
  }

  function displayPage(page) {
    currentPage = page;  // 현재 페이지 업데이트
    tableBody.innerHTML = '';
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);
  
    pageData.forEach((item) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name || ''}</td>
        <td>${item.type || ''}</td>
        <td>${item.submitDate || ''} ${item.submitTime || ''}</td>
        <td>${item.date || ''}</td>
        <td>${item.reason || ''}</td>
        <td><span class="status status-${item.status || 'unknown'}">${getStatusText(item.status)}</span></td>
        <td class="manager-correction-actions">
          ${item.status === 'pending' ? `
            <button class="correction-btn approve" data-id="${item.id}">승인</button>
            <button class="correction-btn reject" data-id="${item.id}">반려</button>
          ` : ''}
          <button class="correction-btn download" data-url="${item.fileUrl}">파일 다운로드</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  
    document.querySelectorAll('.approve').forEach(button => {
      button.addEventListener('click', approveRequest);
    });
    document.querySelectorAll('.reject').forEach(button => {
      button.addEventListener('click', openReasonModal);
    });
    document.querySelectorAll('.download').forEach(button => {
      button.addEventListener('click', downloadFile);
    });
  
    updatePagination();
  }

  function updatePagination() {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.classList.add('pagebtn');
      if (i === currentPage) {
        button.classList.add('btnFocus');
      }
      button.addEventListener('click', function() {
        currentPage = parseInt(this.textContent);
        displayPage(currentPage);
        changeBtn(currentPage.toString());
        arrBtn();
      });
      paginationContainer.appendChild(button);
    }
    arrBtn();
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

  function arrBtn() {
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

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      displayPage(currentPage);
      changeBtn(currentPage.toString());
      arrBtn();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
      currentPage++;
      displayPage(currentPage);
      changeBtn(currentPage.toString());
      arrBtn();
    }
  });

  async function approveRequest(event) {
    const id = event.target.dataset.id;
    await updateRequestStatus(id, 'approved', '');
  }

  function openReasonModal(event) {
    currentRequestId = event.target.dataset.id;
    reasonModal.style.display = 'block';
  }

  closeModalBtn.onclick = function() {
    reasonModal.style.display = 'none';
    document.getElementById('reasonText').value = '';
  };

  window.onclick = function(event) {
    if (event.target == reasonModal) {
      reasonModal.style.display = 'none';
      document.getElementById('reasonText').value = '';
    }
  };

  submitReasonBtn.onclick = async function() {
    const reason = document.getElementById('reasonText').value;
    await updateRequestStatus(currentRequestId, 'rejected', reason);
    reasonModal.style.display = 'none';
    document.getElementById('reasonText').value = '';
  };

  async function updateRequestStatus(id, status, reason) {
    try {
      const response = await fetch('/update-attendance-correction-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, rejectReason: reason })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      loadTableData(document.getElementById('student-name').value);
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  }

  function downloadFile(event) {
    const url = event.target.dataset.url;
    if (!url) {
      console.error('Invalid file URL');
      return;
    }
    window.open(url, '_blank');
  }

  function getStatusText(status) {
    switch (status) {
      case 'pending': return '대기중';
      case 'approved': return '승인';
      case 'rejected': return '반려';
      default: return '알 수 없음';
    }
  }

  filterButton.addEventListener('click', () => {
    const studentName = document.getElementById('student-name').value;
    loadTableData(studentName);
  });

  loadTableData();
}

