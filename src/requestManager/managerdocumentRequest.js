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
            <th>이메일</th>
            <th>필요 기간</th>
            <th>사유</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody id="manager-document-table-body">
          <!-- 자바스크립트로 내용 추가 -->
        </tbody>
      </table>
      <div class="manager-document-pagination-container">
        <button class="prev-button"><</button>
        <div class="number-btn-wrapper"></div>
        <button class="next-button">></button>
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

    <div id="uploadModal" class="upload-modal">
      <div class="manager-document-modal-content">
        <span class="manager-document-modal-close-btn">&times;</span>
        <div class="upload-form-container" id="uploadFormContainer">
          <h2>문서 업로드</h2>
          <input type="file" id="uploadFile" name="uploadFile" accept=".pdf,.doc,.docx" required>
          <button id="submitUploadBtn" class="submit-upload-btn">전송</button>
        </div>
      </div>
    </div>
  `;

  const tableBody = document.getElementById('manager-document-table-body');
  const reasonModal = document.getElementById('reasonModal');
  const uploadModal = document.getElementById('uploadModal');
  const closeModalBtns = document.getElementsByClassName('manager-document-modal-close-btn');
  const submitReasonBtn = document.getElementById('submitReasonBtn');
  const submitUploadBtn = document.getElementById('submitUploadBtn');
  const filterButton = document.querySelector('.filter-button');
  const paginationContainer = document.querySelector(".manager-document-pagination-container .number-btn-wrapper");

  let currentRequestId;
  let currentPage = 1;
  const itemsPerPage = 5;
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
        <td>${item.documentType === 'other' ? item.requiredDocument : getDocumentTypeText(item.documentType) || 'N/A'}</td>
        <td>${item.submitDate || 'N/A'}</td>
        <td>${item.email || 'N/A'}</td>
        <td>${item.startDate ? item.startDate + ' ~ ' + item.endDate : 'N/A'}</td>
        <td>${item.reason || 'N/A'}</td>
        <td><span class="status status-${item.status || 'unknown'}">${getStatusText(item)}</span></td>
        <td class="manager-document-actions">
          ${getActionButtons(item)}
        </td>
      `;
      tableBody.appendChild(row);
    });

    addEventListeners();
    displayPagination(filteredData.length);
  }

  function getStatusText(item) {
    if (item.status === 'pending') return '승인 대기';
    if (item.status === 'approved') return '승인';
    if (item.status === 'rejected') return '반려';
    return '알 수 없음';
  }

  function getDocumentTypeText(type) {
    switch(type) {
      case 'certificate-of-attendance': return '수강증명서';
      case 'attendance-record': return '출석부';
      case 'other': return '기타';
      default: return '알 수 없음';
    }
  }

  function getActionButtons(item) {
    if (item.status === 'pending') {
      return `
        <button class="manager-document-btn approve" data-id="${item.id}">승인</button>
        <button class="manager-document-btn reject" data-id="${item.id}">반려</button>
      `;
    }
    if (item.status === 'approved') {
      return `
        <button class="manager-document-btn upload" data-id="${item.id}">문서 업로드</button>
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
    document.querySelectorAll('.upload').forEach(button => {
      button.addEventListener('click', openUploadModal);
    });
  }

  function displayPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement('button');
      pageButton.textContent = i;
      pageButton.classList.add('page-button');
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

  function arrBtn() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const prevBtn = document.querySelector(".prev-button");
    const nextBtn = document.querySelector(".next-button");
  
    if (currentPage === 1) {
      prevBtn.disabled = true;
      prevBtn.classList.remove('color');
    } else {
      prevBtn.disabled = false;
      prevBtn.classList.add('color');
    }
  
    if (currentPage === totalPages) {
      nextBtn.disabled = true;
      nextBtn.classList.remove('color');
    } else {
      nextBtn.disabled = false;
      nextBtn.classList.add('color');
    }
  }

  async function approveRequest(event) {
    const id = event.target.dataset.id;
    await updateRequestStatus(id, 'approved');
  }

  function openReasonModal(event) {
    currentRequestId = event.target.dataset.id;
    reasonModal.style.display = 'block';
  }

  function openUploadModal(event) {
    currentRequestId = event.target.dataset.id;
    uploadModal.style.display = 'block';
  }

  Array.from(closeModalBtns).forEach(btn => {
    btn.onclick = function() {
      reasonModal.style.display = 'none';
      uploadModal.style.display = 'none';
      document.getElementById('reasonText').value = '';
      document.getElementById('uploadFile').value = '';
    };
  });

  window.onclick = function(event) {
    if (event.target == reasonModal || event.target == uploadModal) {
      reasonModal.style.display = 'none';
      uploadModal.style.display = 'none';
      document.getElementById('reasonText').value = '';
      document.getElementById('uploadFile').value = '';
    }
  };

  submitReasonBtn.onclick = async function() {
    const reason = document.getElementById('reasonText').value;
    await updateRequestStatus(currentRequestId, 'rejected', reason);
    reasonModal.style.display = 'none';
    document.getElementById('reasonText').value = '';
  };

  submitUploadBtn.onclick = async function() {
    const fileInput = document.getElementById('uploadFile');
    const file = fileInput.files[0];
    if (!file) {
      alert("파일을 선택하세요.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', currentRequestId);

    try {
      const response = await fetch('/upload-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("파일 업로드가 완료되었습니다.");
      uploadModal.style.display = 'none';
      fileInput.value = '';
      loadTableData(document.getElementById('student-name').value);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
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

function changeBtn(clickBtnNum) {
  const numberBtn = document.querySelectorAll('.page-button');
  numberBtn.forEach(button => {
    if (button.textContent === clickBtnNum) {
      button.classList.add('btnFocus');
    } else {
      button.classList.remove('btnFocus');
    }
  });
}
