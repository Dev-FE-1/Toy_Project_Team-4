import "./managerofficialLeave.css";

export function loadManagerOfficialLeaveRequests() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="manager-official-leave-container">
      <div class="manager-leave-header">
        <h1>공가 신청 현황</h1>
      </div>
        <div class="manager-official-leave-search">
          <input type="text" id="student-name" placeholder="수강생 이름을 입력하세요">
          <button class="filter-button">검색</button>
        </div>
      <table class="manager-official-leave-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>신청 종류</th>
            <th>제출 일자</th>
            <th>공가 시작일</th>
            <th>공가 종료일</th>
            <th>사유</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody id="manager-official-leave-table-body">
          <!-- 자바스크립트로 내용 추가 -->
        </tbody>
      </table>
      <div class="manager-official-leave-pagination-container">
        <button class="prev-button">&lt;</button>
        <div class="number-btn-wrapper"></div>
        <button class="next-button">&gt;</button>
      </div>
    </div>

    <div id="reasonModal" class="reason-modal">
      <div class="manager-official-leave-modal-content">
        <span class="manager-official-leave-modal-close-btn">&times;</span>
        <div class="reason-form-container" id="reasonFormContainer">
          <h2>반려 사유</h2>
          <textarea id="reasonText" rows="5" cols="50"></textarea>
          <button id="submitReasonBtn" class="submit-reason-btn">전송</button>
        </div>
      </div>
    </div>
  `;

  const tableBody = document.getElementById('manager-official-leave-table-body');
  const reasonModal = document.getElementById('reasonModal');
  const closeModalBtn = document.getElementsByClassName('manager-official-leave-modal-close-btn')[0];
  const submitReasonBtn = document.getElementById('submitReasonBtn');
  const filterButton = document.querySelector('.filter-button');
  const paginationContainer = document.querySelector(".manager-official-leave-pagination-container .number-btn-wrapper");

  let currentRequestId;
  let currentPage = 1;
  const itemsPerPage = 8;
  let filteredData = [];

  async function loadTableData(studentName = '') {
    try {
      const response = await fetch('/get-official-leave-request');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Received data is not an array');
      }
      data.sort((a, b) => new Date(b.submitDate + 'T' + b.submitTime) - new Date(a.submitDate + 'T' + a.submitTime));
      filteredData = studentName ? data.filter(item => item.name.includes(studentName)) : data;
      displayPage(1);
    } catch (error) {
      console.error('Error loading official leave requests:', error);
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
      const submitDateTime = new Date(item.submitDate + 'T' + item.submitTime);
      const formattedSubmitDate = `${item.submitDate} ${submitDateTime.getHours().toString().padStart(2, '0')}:${submitDateTime.getMinutes().toString().padStart(2, '0')}`;
      row.innerHTML = `
        <td>${item.name || 'N/A'}</td>
        <td>${item.type || 'N/A'}</td>
        <td>${formattedSubmitDate}</td>
        <td>${item.startDate || 'N/A'}</td>
        <td>${item.endDate || 'N/A'}</td>
        <td>${item.reason || 'N/A'}</td>
        <td><span class="status status-${item.status || 'unknown'}">${getStatusText(item)}</span></td>
        <td class="manager-official-leave-actions">
          ${getActionButtons(item)}
        </td>
      `;
      tableBody.appendChild(row);
    });

    addEventListeners();
    displayPagination(filteredData.length);
  }

  function displayPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement('button');
      pageButton.textContent = i;
      pageButton.classList.add('button');
      if (i === currentPage) {
        pageButton.classList.add('btnFocus');
      }
      pageButton.addEventListener('click', () => {
        currentPage = i;
        displayPage(currentPage);
        changeBtn(currentPage.toString());
        arrBtn();
      });
      paginationContainer.appendChild(pageButton);
    }
    arrBtn();
  }

  function changeBtn(clickBtnNum) {
    const numberBtn = document.querySelectorAll('.button');
    numberBtn.forEach(button => {
      if (button.textContent === clickBtnNum) {
        button.classList.add('btnFocus');
      } else {
        button.classList.remove('btnFocus');
      }
    });
  }

  function arrBtn() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const prevBtn = document.querySelector(".prev-button");
    const nextBtn = document.querySelector(".next-button");

    if (currentPage === 1) {
      prevBtn.classList.remove('color');
      nextBtn.classList.add('color');
    } else if (currentPage === totalPages) {
      prevBtn.classList.add('color');
      nextBtn.classList.remove('color');
    } else {
      prevBtn.classList.add('color');
      nextBtn.classList.add('color');
    }
  }

  function getStatusText(item) {
    if (item.status === "pending" && !item.documentSubmitted) return "임시 승인 대기중";
    if (item.status === "approved" && !item.documentSubmitted) return "임시 승인";
    if (item.status === "finalPending") return "최종 승인 대기중";
    if (item.status === "finalApproved") return "최종 승인";
    if (item.status === "completed") return "승인 완료";
    if (item.status === "rejected") return "반려";
    return "알 수 없음";
  }

  function getActionButtons(item) {
    if (item.status === "pending") {
      return `
        <button class="official-leave-btn approve" data-id="${item.id}">승인</button>
        <button class="official-leave-btn reject" data-id="${item.id}">반려</button>
      `;
    }
    if (item.status === "finalPending") {
      return `
        <button class="official-leave-btn final-approve" data-id="${item.id}">승인</button>
        <button class="official-leave-btn reject" data-id="${item.id}">반려</button>
        <button class="official-leave-btn download-documents" data-id="${item.id}">첨부파일</button>
      `;
    }
    if (item.status === "finalApproved" || item.status === "completed") {
      return `
        <button class="official-leave-btn download-documents" data-id="${item.id}">첨부파일</button>
      `;
    }
    return "";
  }

  function addEventListeners() {
    document.querySelectorAll('.approve').forEach(button => {
      button.addEventListener('click', approveRequest);
    });
    document.querySelectorAll('.final-approve').forEach(button => {
      button.addEventListener('click', finalApproveRequest);
    });
    document.querySelectorAll('.reject').forEach(button => {
      button.addEventListener('click', openReasonModal);
    });
    document.querySelectorAll('.download-documents').forEach(button => {
      button.addEventListener('click', downloadDocuments);
    });
    document.querySelectorAll('.resubmit-documents').forEach(button => {
      button.addEventListener('click', resubmitDocuments);
    });
  }

  async function approveRequest(event) {
    const id = event.target.dataset.id;
    await updateRequestStatus(id, 'approved');
  }

  async function finalApproveRequest(event) {
    const id = event.target.dataset.id;
    await updateRequestStatus(id, 'finalApproved');
  }

  async function downloadDocuments(event) {
    const id = event.target.dataset.id;
    try {
      const response = await fetch(`/get-official-leave-request`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
      const data = await response.json();
      const request = data.find(item => String(item.id) === String(id));
      if (!request || !request.fileUrl) {
        throw new Error('File URL not found');
      }
      
      window.open(request.fileUrl, '_blank');
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('파일 다운로드 중 오류가 발생했습니다.');
    }
  }
  
  function openReasonModal(event) {
    currentRequestId = event.target.dataset.id;
    reasonModal.style.display = 'block';
  }

  function resubmitDocuments(event) {
    const id = event.target.dataset.id;
    openDocumentSubmitModal(id);
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
      const response = await fetch('/update-official-leave-status', {
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

  const prevBtn = document.querySelector(".prev-button");
  const nextBtn = document.querySelector(".next-button");
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
}

function openDocumentSubmitModal(id) {
  const documentModal = document.getElementById("documentSubmitModal");
  documentModal.style.display = "block";
  document.getElementById('documentSubmitForm').setAttribute('data-id', id);
}
