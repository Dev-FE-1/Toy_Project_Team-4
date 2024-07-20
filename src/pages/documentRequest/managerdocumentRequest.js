import "./managerdocumentRequest.css";

export function loadManagerDocumentRequests() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="manager-document-container">
        <div class="manager-document-header">
          <h1>문서 발급 요청 현황</h1>
        </div>  
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
          <textarea id="reasonText" rows="5" cols="50"></textarea>
          <button id="submitReasonBtn" class="submit-reason-btn">전송</button>
        </div>
      </div>
    </div>

    <div id="uploadModal" class="upload-modal">
      <div class="manager-document-modal-content">
        <span class="manager-document-modal-close-btn">&times;</span>
        <div class="upload-form-container" id="uploadFormContainer">
          <h2>문서 전송</h2>
          <form class="upload-form">
            <input type="file" id="uploadFile" name="uploadFile" accept=".pdf,.doc,.docx" required>
            <button type="submit" id="submitUploadBtn" class="submit-upload-btn">전송</button>
          </form>
        </div>
      </div>
    </div>
  `;

  const tableBody = document.getElementById('manager-document-table-body');
  const reasonModal = document.getElementById('reasonModal');
  const uploadModal = document.getElementById('uploadModal');
  const closeModalBtns = document.getElementsByClassName('manager-document-modal-close-btn');
  const submitReasonBtn = document.getElementById('submitReasonBtn');
  const filterButton = document.querySelector('.filter-button');
  const paginationContainer = document.querySelector(".manager-document-pagination-container .number-btn-wrapper");

  let currentRequestId;
  let currentPage = 1;
  const itemsPerPage = 8;
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
        <td>${item.submitDate} ${item.submitTime || ''}</td>
        <td>${item.email || 'N/A'}</td>
        <td>${item.documentType === 'other' ? '-' : (item.startDate ? item.startDate + ' ~ ' + item.endDate : 'N/A')}</td>
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
    if (item.documentType === 'attendance-record' && item.status === 'pending') return '발급 대기중';
    if (item.status === 'pending') return '대기중';
    if (item.status === 'approved') return '양식 제출 대기중';
    if (item.status === 'rejected') return '반려';
    if (item.status === 'document_submitted') return '발급 대기중';
    if (item.status === 'completed') return '발급 완료';
    return '알 수 없음';
  }

  function getDocumentTypeText(type) {
    switch(type) {
      case 'certificate-of-attendance': return '수강증명서'
      case 'attendance-record': return '출석부'
      case 'other': return '기타'
      default: return '알 수 없음'
    }
  }

  function getActionButtons(item) {
    const { status, documentType, id, fileUrl, originalFileName } = item;
    if (documentType === "certificate-of-attendance") {
      if (status === "pending") {
        return `
          <button class="manager-document-btn approve" data-id="${id}">승인</button>
          <button class="manager-document-btn reject" data-id="${id}">반려</button>
        `;
      } else if (status === "approved") {
        return ""; // 버튼 없음, 서류 제출 대기중
      } else if (status === "document_submitted") {
        return `
          <button class="manager-document-btn approve" data-id="${id}">승인</button>
          <button class="manager-document-btn reject" data-id="${id}">반려</button>
          <button class="manager-document-btn download" data-url="${fileUrl}" data-filename="${
          originalFileName || "문서"
        }">첨부파일</button>
        `;
      } else if (status === "completed") {
        return `
          <button class="manager-document-btn download" data-url="${fileUrl}" data-filename="${
          originalFileName || "문서"
        }">첨부파일</button>
        `;
      }
    } else {
      // 출석부
      if (status === "pending") {
        return `
          <button class="manager-document-btn approve" data-id="${id}">승인</button>
          <button class="manager-document-btn reject" data-id="${id}">반려</button>
        `;
      } else if (status === "approved" || status === "completed") {
        return `
          <button class="manager-document-btn download" data-url="${fileUrl}" data-filename="${
          originalFileName || "문서"
        }">첨부파일</button>
        `;
      }
    }
    return "";
  }
  
  function addEventListeners() {
    document.querySelectorAll('.approve').forEach(button => {
      button.addEventListener('click', approveRequest)
    })
    document.querySelectorAll('.reject').forEach(button => {
      button.addEventListener('click', openReasonModal)
    })
    document.querySelectorAll('.download').forEach(button => {
      button.addEventListener('click', function(e) {
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
    })
  }
  
  async function approveRequest(event) {
    const id = event.target.dataset.id;
    const item = filteredData.find(item => item.id === id);
    if (item.documentType === 'certificate-of-attendance') {
      if (item.status === 'pending') {
        openUploadModal(id);
      } else if (item.status === 'document_submitted') {
        openUploadModal(id);
      }
    } else {
      openUploadModal(id);
    }
  }

  function openUploadModal(id) {
    currentRequestId = id;
    uploadModal.style.display = 'block';
  }
  
  Array.from(closeModalBtns).forEach(btn => {
    btn.onclick = function() {
      reasonModal.style.display = 'none';
      uploadModal.style.display = 'none';
    };
  });
  
  window.onclick = function(event) {
    if (event.target == reasonModal) {
      reasonModal.style.display = 'none';
    }
    if (event.target == uploadModal) {
      uploadModal.style.display = 'none';
    }
  };
  
  document.querySelector('.upload-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById('uploadFile');
    const file = fileInput.files[0];
    if (!file) {
      alert("파일을 선택하세요.");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('id', currentRequestId);

      const response = await fetch('/upload-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const item = filteredData.find(item => item.id === currentRequestId);
      if (item.documentType === 'certificate-of-attendance') {
        if (item.status === 'pending') {
          await updateRequestStatus(currentRequestId, 'approved', '', result.fileUrl, result.originalFileName);
        } else if (item.status === 'document_submitted') {
          await updateRequestStatus(currentRequestId, 'completed', '', result.fileUrl, result.originalFileName);
        }
      } else {
        await updateRequestStatus(currentRequestId, 'completed', '', result.fileUrl, result.originalFileName);
      }
      alert("파일 전송이 완료되었습니다.");
      uploadModal.style.display = 'none';
      fileInput.value = '';
      loadTableData(document.getElementById('student-name').value);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert("파일 전송 중 오류가 발생했습니다.");
    }
  });

  function openReasonModal(event) {
    currentRequestId = event.target.dataset.id;
    reasonModal.style.display = 'block';
  }

  submitReasonBtn.onclick = async function() {
    const reason = document.getElementById('reasonText').value;
    await updateRequestStatus(currentRequestId, 'rejected', reason);
    reasonModal.style.display = 'none';
    document.getElementById('reasonText').value = '';
  };

  async function updateRequestStatus(id, status, reason = '', fileUrl = '', originalFileName = '') {
    try {
      const response = await fetch('/update-document-request-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, rejectReason: reason, fileUrl, originalFileName })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      loadTableData(document.getElementById('student-name').value);
    } catch (error) {
      console.error('Error updating request status:', error);
    }
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