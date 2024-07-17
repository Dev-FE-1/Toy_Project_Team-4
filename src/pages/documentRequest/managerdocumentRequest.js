import "./managerdocumentRequest.css";

export function loadManagerDocumentRequests() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="manager-document-container">
      <h1>문서 발급 요청 관리</h1>
      <div class="manager-document-search">
        <input type="text" id="student-name" placeholder="수강생 이름을 입력하세요">
        <button class="filter-button">검색</button>
      </div>
      <table class="manager-document-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>신청 종류</th>
            <th>제출 일자</th>
            <th>필요 기간</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody id="manager-document-table-body">
          <!-- 자바스크립트로 내용 추가 -->
        </tbody>
      </table>
      <div id="pagination" class="pagination">
        <!-- 페이지네이션 버튼 -->
      </div>
    </div>

    <div id="reasonModal" class="reason-modal">
      <div class="manager-document-modal-content">
        <span class="manager-document-modal-close-btn">&times;</span>
        <div class="reason-form-container" id="reasonFormContainer">
          <h2>반려 사유</h2>
          <textarea id="reasonText" rows="4" cols="50"></textarea>
          <button id="submitReasonBtn" class="submit-reason-btn">전송</button>
        </div>
      </div>
    </div>
  `;

  const tableBody = document.getElementById('manager-document-table-body');
  const reasonModal = document.getElementById('reasonModal');
  const closeModalBtn = document.getElementsByClassName('manager-document-modal-close-btn')[0];
  const submitReasonBtn = document.getElementById('submitReasonBtn');
  const filterButton = document.querySelector('.filter-button');
  const paginationContainer = document.getElementById("pagination");

  let currentRequestId;
  let currentPage = 1;
  const itemsPerPage = 10;
  let filteredData = [];

  async function loadTableData(studentName = '') {
    try {
      const response = await fetch('/get-document-request');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Received data is not an array');
      }
      data.sort((a, b) => new Date(b.submitDate) - new Date(a.submitDate));
      filteredData = studentName ? data.filter(item => item.name.includes(studentName)) : data;
      displayPage(1);
    } catch (error) {
      console.error('Error loading document requests:', error);
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
        <td>${getDocumentTypeText(item.documentType) || 'N/A'}</td>
        <td>${item.submitDate || 'N/A'}</td>
        <td>${item.startDate} ~ ${item.endDate}</td>
        <td><span class="status status-${item.status || 'unknown'}">${getStatusText(item)}</span></td>
        <td class="manager-document-actions">
          ${getActionButtons(item)}
        </td>
      `;
      tableBody.appendChild(row);
    });

    addEventListeners();
    updatePagination();
  }

  function getStatusText(item) {
    if (item.status === 'pending') return '승인 대기';
    if (item.status === 'approved') return '승인';
    if (item.status === 'completed') return '완료';
    if (item.status === 'rejected') return '반려';
    return '알 수 없음';
  }

  function getDocumentTypeText(type) {
    switch(type) {
      case 'certificate-of-attendance': return '수강증명서';
      case 'certificate-of-participation': return '참가확인서';
      case 'attendance-record': return '출석부';
      case 'other': return '기타';
      default: return '알 수 없음';
    }
  }

  function getActionButtons(item) {
    if (item.status === 'pending') {
      return `
        <button class="document-btn approve" data-id="${item.id}">승인</button>
        <button class="document-btn reject" data-id="${item.id}">반려</button>
      `;
    }
    if (item.status === 'approved') {
      return `
        <button class="document-btn complete" data-id="${item.id}">완료</button>
      `;
    }
    return '';
  }

  function addEventListeners() {
    document.querySelectorAll('.approve').forEach(button => {
      button.addEventListener('click', approveRequest);
    });
    document.querySelectorAll('.reject').forEach(button => {
      button.addEventListener('click', openReasonModal);
    });
    document.querySelectorAll('.complete').forEach(button => {
      button.addEventListener('click', completeRequest);
    });
  }

  function updatePagination() {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
  }

  async function approveRequest(event) {
    const id = event.target.dataset.id;
    await updateRequestStatus(id, 'approved');
  }

  async function completeRequest(event) {
    const id = event.target.dataset.id;
    await updateRequestStatus(id, 'completed');
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

  async function updateRequestStatus(id, status, reason = '') {
    try {
      const response = await fetch('/update-document-request-status', {
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

  filterButton.addEventListener('click', () => {
    const studentName = document.getElementById('student-name').value;
    loadTableData(studentName);
  });

  loadTableData();
}