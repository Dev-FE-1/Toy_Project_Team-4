import "./attendance_correction_request.css";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export function loadAttendanceCorrectionRequest() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="correction-container">
      <h1><img src="/images/attendance_correction_request.png" alt="attendance_correction_request Icon" class="attendance_correction_request-icon">출결 정정 요청</h1>
      <div class="correction-both-container">
        <div class="correction-process-container">
          <div class="correction-process-list">
              <h3>1. 운영 매니저에게 스크린샷 요청</h3>
              <p>입실 및 퇴실 시 각 1장씩 총 2장의 스크린샷 제출</p>
              <p>외출 정정 시: 외출 및 복귀 시 각 1장씩 총 4장의 스크린샷 제출 필요</p>
              <br>
              <h3>2. 스크린샷 준비 및 출석대장 작성</h3>
              <p>얼굴 전체, 이름, 당일 날짜 및 시간을 하이라이트 표기</p>
              <div class="download-link-container">
                  <span class="material-symbols-outlined download-icon">download</span>
                  <a href="/images/프론트엔드 개발 부트캠프_4기(DEV_FE1) 출석대장.docx" download class="download-link">
                      출석 대장 다운로드
                  </a>
              </div>
              <p>작성 후 PDF 파일로 변환.</p>
              <p>파일명: <span class="ex">'정정 희망 날짜_데브캠프 : 프론트엔드 개발 4회차_성함(출석대장)'</span></p>
              <br>
              <h3>3. 필요 자료 폴더링</h3>
              <p>출석 대장과 스크린샷을 하나의 폴더에 포함하여 압축</p>
              <p>폴더명: <span class="ex">'정정 희망 날짜_데브캠프 : 프론트엔드 개발 4회차_성함(출결 정정)'</span></p>
          </div>
        </div>
        <div class="correction-status-container">
          <div class="correction-status-content">
            <div class="correction-status-header">
              <span><span class="red-dot"></span>신청 현황</span>
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
            <div class="correction-pagination-container">
              <button class="prev-button"><</button>
              <div class="number-btn-wrapper"></div>
              <button class="next-button">></button>
            </div>
            <div class="correction-modal-btn-container">
              <button id="correctionModalBtn" class="correction-modal-btn">출결 정정 요청</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="correctionModal" class="correction-modal">
      <div class="correction-modal-content">
        <span class="correction-modal-close-btn">&times;</span>
        <div class="correction-form-container" id="correctionFormContainer">
          <h2>출결 정정 요청</h2>
          <div class="correction-submit-section">
            <div class="correction-date-container">
              <label for="correctionDate">정정 희망 날짜</label>
              <input type="date" id="correctionDate" name="correctionDate" required>
            </div>
            <div class="convert-press-container">
              <label for="convertpress">파일 변환</label>
              <div class="correction-pdf-container">
                <input type="file" id="wordFile" name="wordFile" accept=".doc,.docx" required>
                <button type="button" id="convertToPDFBtn" class="convertpdf">PDF 변환</button>
              </div>
              <div class="correction-zip-container">
                <input type="file" id="fileInput" name="fileInput" multiple required>
                <button type="button" id="createZipBtn" class="createzip">ZIP 압축</button>
              </div>
            </div>
          </div>
          <form id="correctionSubmitForm" action="/upload-attendance-correction-request" method="post" enctype="multipart/form-data" class="correctionSubmitForm">
            <label for="correction-file">파일 첨부</label>
            <div class="correction-submit-all-section">
              <input type="file" id="correction_submit_file" name="correctionFile" required>
            </div>
            <button type="submit" class="correction-btn">제출</button>
          </form>
        </div>
      </div>
    </div>
  `;

  // 모달 관련 코드
  const modal = document.getElementById("correctionModal");
  const openModalBtn = document.getElementById("correctionModalBtn");
  const closeModalBtn = document.getElementsByClassName("correction-modal-close-btn")[0];

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

  // PDF 변환 버튼 이벤트 리스너
  document.getElementById("convertToPDFBtn").addEventListener("click", () => {
    const file = document.getElementById("wordFile").files[0];
    const correctionDate = document.getElementById("correctionDate").value;

    if (!correctionDate) {
      alert("정정 요청 날짜를 입력하세요.");
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (correctionDate > today) {
      alert("미래 날짜는 선택할 수 없습니다.");
      return;
    }

    const courseName = '데브캠프 : 프론트엔드 개발 4회차';

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.userName) {
      alert("로그인된 사용자 정보를 찾을 수 없습니다.");
      return;
    }

    const userName = userInfo.userName;

    fetch('/api/users.json')
      .then(response => response.json())
      .then(data => {
        const users = Array.isArray(data.data) ? data.data : [];

        const user = users.find(u => u.name === userName);

        if (user) {
          const fileName = `${correctionDate}_${courseName}_${user.name}(출석대장).pdf`;

          if (file) {
            const formData = new FormData();
            formData.append("wordFile", file);
            formData.append("fileName", fileName);

            fetch("/convert", {
              method: "POST",
              body: formData,
            })
              .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.blob();
              })
              .then(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              })
              .catch(error => {
                console.error("Error:", error);
                alert("파일 업로드 중 오류가 발생했습니다.");
              });
          }
        } else {
          alert('사용자를 찾을 수 없습니다.');
        }
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
        alert("사용자 정보를 가져오는 중 오류가 발생했습니다.");
      });
  });

  // ZIP 압축 버튼 이벤트 리스너
  document.getElementById("createZipBtn").addEventListener("click", async () => {
    const files = document.getElementById('fileInput').files;
    const correctionDate = document.getElementById("correctionDate").value;

    if (!correctionDate) {
      alert("정정 요청 날짜를 입력하세요.");
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (correctionDate > today) {
      alert("미래 날짜는 선택할 수 없습니다.");
      return;
    }

    const courseName = '데브캠프 : 프론트엔드 개발 4회차';

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.userName) {
      alert("로그인된 사용자 정보를 찾을 수 없습니다.");
      return;
    }

    const userName = userInfo.userName;

    fetch('/api/users.json')
      .then(response => response.json())
      .then(data => {
        const users = Array.isArray(data.data) ? data.data : [];

        const user = users.find(u => u.name === userName);

        if (user) {
          const fileName = `${correctionDate}_${courseName}_${user.name}(출결 정정).zip`;

          const zip = new JSZip();
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            zip.file(file.name, file);
          }

          zip.generateAsync({ type: 'blob' })
            .then(function(content) {
              saveAs(content, fileName);
            })
            .catch(function(error) {
              console.error("Error:", error);
              alert("ZIP 파일 생성 중 오류가 발생했습니다.");
            });
        } else {
          alert('사용자를 찾을 수 없습니다.');
        }
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
        alert("사용자 정보를 가져오는 중 오류가 발생했습니다.");
      });
  });

  // 폼 제출 이벤트 리스너
  document.getElementById("correctionSubmitForm").addEventListener("submit", function(event) {
    event.preventDefault();
  
    const correctionFile = document.getElementById("correction_submit_file").files[0];
    const correctionDate = document.getElementById("correctionDate").value;
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo || !userInfo.userName) {
      alert("로그인된 사용자 정보를 찾을 수 없습니다.");
      return;
    }
    const courseName = '데브캠프 : 프론트엔드 개발 4회차';
    const userName = userInfo.userName;
  
    if (!correctionFile || !correctionDate) {
      alert("모든 필드를 입력하세요.");
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (correctionDate > today) {
      alert("미래 날짜는 선택할 수 없습니다.");
      return;
    }
  
    const formData = new FormData();
    formData.append("correctionFile", correctionFile);
    formData.append("date", correctionDate);
    formData.append("name", userName);
    formData.append("courseName", courseName);
    formData.append("userId", userInfo.id);
  
    fetch("/upload-attendance-correction-request", {
      method: "POST",
      body: formData,
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.message === "File uploaded successfully") {
        alert("제출이 완료되었습니다.");
        modal.style.display = "none";
        loadRequestData();
      } else {
        alert("제출이 실패했습니다: " + data.error);
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("제출 도중 오류가 발생했습니다: " + error.message);
    });
  });

  // 신청 현황 데이터 로드 및 표시 함수
  let requestData = [];
  let currentPage = 1;
  const itemsPerPage = 5;

  async function loadRequestData() {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await fetch(`/get-attendance-correction-request?userName=${userInfo.userName}`);
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
      console.error('Error loading correction request:', error);
    }
  }

  function displayData() {
    const tableBody = document.getElementById("status-table-body");
  
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
  
    setPageButtons();
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

    if (Number(btnFocus.textContent) == minNum) {
      nextBtn.classList.add("color");
      prevBtn.classList.remove("color");
    } else if (Number(btnFocus.textContent) == maxNum) {
      nextBtn.classList.remove("color");
      prevBtn.classList.add("color");
    } else {
      nextBtn.classList.add("color");
      prevBtn.classList.add("color");
    }
  }

  async function cancelRequest(id) {
    try {
      const response = await fetch('/delete-attendance-correction-request', {
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

  function getStatusText(status) {
    switch(status) {
      case 'pending': return '대기중';
      case 'approved': return '승인';
      case 'rejected': return '반려';
      default: return '';
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
