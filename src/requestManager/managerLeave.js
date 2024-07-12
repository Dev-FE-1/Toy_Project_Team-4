import "./managerLeave.css";

export function loadManagerLeaveRequests() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="manager-leave-container">
      <div class="manager-leave-header">
        <h1>외출 신청 관리</h1>
        <div class="manager-leave-search">
          <input type="text" id="student-name" placeholder="수강생 이름을 입력하세요">
          <button id="filter-button">검색</button>
        </div>
      </div>
      <table class="manager-leave-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>신청 종류</th>
            <th>제출 일자</th>
            <th>외출 예정일</th>
            <th>시작 시간</th>
            <th>종료 시간</th>
            <th>사유</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody id="manager-leave-table-body">
          <!-- 자바스크립트로 내용 추가 -->
        </tbody>
      </table>
      <div class="pagination" id="pagination">
        <!-- 페이지네이션 버튼 -->
      </div>
    </div>

    <div id="reasonModal" class="reason-modal">
      <div class="manager-leave-modal-content">
        <span class="manager-leave-modal-close-btn">&times;</span>
        <div class="reason-form-container" id="reasonFormContainer">
          <h2>반려 사유</h2>
          <textarea id="reasonText" rows="4" cols="50"></textarea>
          <button id="submitReasonBtn" class="submit-reason-btn">전송</button>
        </div>
      </div>
    </div>
  `;

  const tableBody = document.getElementById('manager-leave-table-body');
  const reasonModal = document.getElementById('reasonModal');
  const closeModalBtn = document.getElementsByClassName('manager-leave-modal-close-btn')[0];
  const submitReasonBtn = document.getElementById('submitReasonBtn');
  const filterButton = document.getElementById('filter-button');
  const paginationContainer = document.getElementById('pagination');
  let currentRequestId;
  let currentPage = 1;
  const itemsPerPage = 9;
  let filteredData = [];

  async function loadTableData(studentName = '') {
    try {
      const response = await fetch('/get-leave-request');
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
      displayPage(1);
    } catch (error) {
      console.error('Error loading leave requests:', error);
      alert('외출 신청 데이터를 불러오는 데 실패했습니다.');
    }
  }
  

  function displayPage(page) {
    currentPage = page;
    tableBody.innerHTML = '';
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);
  
    pageData.forEach((item) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name || 'N/A'}</td>
        <td>${item.type || '외출'}</td>
        <td>${item.submitDate || 'N/A'}</td>
        <td>${item.date || 'N/A'}</td>
        <td>${item.startTime || 'N/A'}</td>
        <td>${item.endTime || 'N/A'}</td>
        <td>${item.reason || 'N/A'}</td>
        <td><span class="status status-${item.status || 'unknown'}">${getStatusText(item.status)}</span></td>
        <td class="manager-leave-actions">
          ${item.status === 'pending' ? `
            <button class="leave-btn approve" data-id="${item.id}">승인</button>
            <button class="leave-btn reject" data-id="${item.id}">반려</button>
          ` : ''}
          ${item.status === 'rejected' ? `<span class="reject-reason">${item.rejectReason || ''}</span>` : ''}
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
  
    updatePagination();
  }

  function updatePagination() {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
    // 이전 버튼 추가
    const prevButton = document.createElement('button');
    prevButton.classList.add('page-arrow');
    prevButton.innerHTML = '&lt;';
    prevButton.addEventListener('click', () => displayPage(Math.max(1, currentPage - 1)));
    prevButton.disabled = currentPage === 1;
    paginationContainer.appendChild(prevButton);
  
    // 페이지 버튼 생성
    for (let page = 1; page <= totalPages; page++) {
      const button = document.createElement('button');
      button.classList.add('page-button');
      if (page === currentPage) {
        button.classList.add('active');
      }
      button.innerText = page;
      button.addEventListener('click', () => displayPage(page));
      paginationContainer.appendChild(button);
    }
  
    // 다음 버튼 추가
    const nextButton = document.createElement('button');
    nextButton.classList.add('page-arrow');
    nextButton.innerHTML = '&gt;';
    nextButton.addEventListener('click', () => displayPage(Math.min(totalPages, currentPage + 1)));
    nextButton.disabled = currentPage === totalPages;
    paginationContainer.appendChild(nextButton);
  }

  async function approveRequest(event) {
    const id = event.target.dataset.id;
    await updateRequestStatus(id, 'approved');
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
      const response = await fetch('/update-leave-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, rejectReason: reason })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // 서버로부터 업데이트된 데이터를 받아옵니다.
      await loadTableData('');
  
      // 현재 페이지를 다시 표시합니다.
      displayPage(currentPage);
    } catch (error) {
      console.error('Error updating request status:', error);
    }
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