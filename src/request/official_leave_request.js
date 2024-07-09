import "./official_leave_request.css";

export function loadOfficialLeaveRequest() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="official-leave-container">
      <h1><img src="./images/official-leave.png" alt="Official Leave Icon" class="official-leave-icon">공가 신청&nbsp;-&nbsp;신청서 제출</h1>
      <div class="official-leave-both-container">
        <div class="official-leave-process-container">
          <h2>공가 신청 프로세스</h2>
          <div class="official-leave-process-list">
            <h3>1. 출석 인정 여부 확인</h3>
            <p>출석 인정 여부 모달</p>
            <h3>2. 필요 자료 제작</h3>
            <div class="download-link-container">
              <span class="material-symbols-outlined download-icon">download</span>
              <a href="/images/프론트엔드 개발 부트캠프_4기(DEV_FE1) 출석대장.docx" download class="download-link">
                출석 입력 대장 다운로드
              </a>
            </div>
            <p> 
              작성 후 PDF 파일로 변환<br>
              파일명: <span class="ex">'날짜_과정명_성함(출석 입력 대장)'</span>
            </p>
            <div class="download-link-container">
              <a href="https://www.notion.so/6cc37ff52d33470badc0b7d04f5c1ca1?pvs=21">
                필요 제출 서류
              </a>
            </div>
            <p>    
              작성 후 PDF 파일로 변환<br>
              파일명: <span class="ex">'날짜_과정명_성함(증빙서류)'</span>
            </p>
            <h3>3. 필요 자료 폴더링</h3>
            <p>
              출석 입력 대장과 증빙서류를 하나의 폴더에 포함 및 압축<br>
              압축 폴더명: <span class="ex">'날짜_과정명_이름(공)'</span>
            </p>
          </div>
        </div>
        <div class="official-leave-status-container">
          <div class="content">
            <div class="official-leave-status-header">
              <span><span class="red-dot"></span>신청 현황</span>
              <div class="official-leave-status-date-range">
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
            <div class="official-leave-modal-btn-container">
              <button id="officialLeaveModalBtn" class="official-leave-modal-btn">공가 신청</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="officialLeaveModal" class="official-leave-modal">
      <div class="official-leave-modal-content">
        <span class="official-leave-modal-close-btn">&times;</span>
        <div class="official-leave-form-container" id="officialLeaveFormContainer">
                <h2>서류 제출</h2>
                <form id="submitForm" action="관리자용" method="post" enctype="multipart/form-data" class="form-box">
                    <div class="submit-section">
                        <a href="/프론트엔드 개발 부트캠프_4기(DEV_FE1) 출석대장.docx" download class="download-link">출석대장 다운로드</a>
                        <div class="submit-subsection">
                            <div class="submit-container">
                                <input type="file" id="wordFile" name="wordFile" accept=".doc,.docx" required>
                                <button type="button" onclick="convertToPDF()" class="convertpdf">PDF 변환</button>
                            </div>
                        </div>
                        <div class="submit-subsection">
                            <div class="submit-container">
                                <input type="file" id="fileInput" name="fileInput" multiple required>
                                <button type="button" onclick="createZip()" class="createzip">ZIP 압축</button>
                            </div>
                        </div>
                    </div>
                    <div class="submit-all-section">
                        <label for="attendance_sheet">파일 첨부</label>
                        <input type="file" id="submit_file" name="submit_file" required>
                    </div>
                    <button type="submit" class="submit-center-btn">제출</button>
                </form>
        </div>
      </div>
    </div>
  `;

  const modal = document.getElementById("officialLeaveModal");
  const openModalBtn = document.getElementById("officialLeaveModalBtn");
  const closeModalBtn = document.getElementsByClassName("official-leave-modal-close-btn")[0];

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
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await fetch(`/get-official-leave-request?userName=${userInfo.userName}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Received data is not an array');
      }
      requestData = data;
      displayData();
    } catch (error) {
      console.error('Error loading official leave request:', error);
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
          ${item.status === 'approved' ? '승인됨' : ''}
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
    }

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
      const response = await fetch('/delete-official-leave-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await loadRequestData();
    } catch (error) {
      console.error('Error cancelling request:', error);
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

  document.getElementById("officialLeaveSubmitForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const startDate = document.getElementById("start_date").value;
    const endDate = document.getElementById("end_date").value;
    const reason = document.getElementById("reason").value;

    if (!startDate || !endDate || !reason) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.userName) {
      alert("로그인 정보를 찾을 수 없습니다.");
      return;
    }

    const requestData = {
      startDate,
      endDate,
      reason,
      name: userInfo.userName,
      userId: userInfo.id
    };

    try {
      const response = await fetch("/upload-official-leave-request", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
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
      console.error("Error:", error);
      alert("제출 도중 오류가 발생했습니다: " + error.message);
    }
  });

  loadRequestData();
}
