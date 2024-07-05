import "./vacation_request.css";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export function loadVacationRequest() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="vacation-container-unique">
        <h1>
            <img src="/images/vacation.png" alt="Vacation Icon" class="vacation-icon-unique">
            휴가 신청
        </h1>
        <div class="both-container-unique">
            <div class="vacation-process-container-unique">
                <h2>휴가 신청 프로세스</h2>
                <div class="process-list-unique">
                    <h3>1. 운영 매니저 상담</h3>
                    <p>휴가 사용 2주 전, 운영 매니저와 상담하여 휴가 사용 여부 확인</p>
                    <h3>2. 필요 자료 제작</h3>
                    <p>
                        <a href="/images/프론트엔드 개발 부트캠프_4기(DEV_FE1) 출석대장.docx" download>
                            <span class="material-symbols-outlined-unique">download</span>
                            출석 입력 대장 다운로드
                        </a><br>
                        작성 후 PDF 파일로 변환<br>
                        파일명: <span class="ex-unique">'날짜_과정명_성함(출석 입력 대장)'</span>
                    </p>
                    <p>
                        <a href="/images/[KDT] 휴가 사용 계획서_김패캠의 사본 - (시트 복제 후 사용)상담일자_휴가사용일자.docx" download>
                            <span class="material-symbols-outlined-unique">download</span>
                            휴가 계획서 다운로드
                        </a><br>
                        작성 후 PDF 파일로 변환<br>
                        파일명: <span class="ex-unique">'날짜_과정명_성함(휴가 계획서)'</span>
                    </p>
                    <h3>3. 필요 자료 폴더링</h3>
                    <p>
                        출석 입력 대장과 휴가 계획서를 하나의 폴더에 포함 및 압축<br>
                        압축 폴더명: <span class="ex-unique">'날짜_과정명_이름(휴가)'</span>
                    </p>
                </div>
            </div>

            <div class="right-container-unique">
                <div class="vacation-status-container-unique">
                    <div class="vacation-status-header-unique">
                        <span><span class="red-dot-unique"></span>신청 현황</span>
                        <div class="vacation-status-date-range-unique">
                            <input type="date" id="search-start-date-unique" class="date-input-unique">
                            ~
                            <input type="date" id="search-end-date-unique" class="date-input-unique">
                        </div>
                    </div>
                    <table class="status-table-unique">
                        <thead>
                            <tr>
                                <th>상태</th>
                                <th>신청 종류</th>
                                <th>제출 일자</th>
                                <th>비고</th>
                            </tr>
                        </thead>
                        <tbody id="status-table-body-unique">
                            <!-- 자바스크립트로 내용 추가 -->
                        </tbody>
                    </table>
                    <div id="pagination-unique" class="pagination-container-unique">
                        <!-- 자바스크립트로 페이지네이션 추가 -->
                    </div>
                </div>

                <button id="openModalBtn-unique" class="vacation-btn-unique">신청서 작성</button>

                <div id="modal-unique" class="modal-unique">
                    <div class="modal-content-unique">
                        <span class="close-btn-unique">&times;</span>
                        <div class="vacation-form-container-unique" id="vacationFormContainer">
                            <h2>신청서 제출</h2>
                                <div class="submit-section-unique">
                                    <div class="submit-subsection-unique">
                                        <div class="submit-container-unique">
                                            <input type="file" id="wordFile-unique" name="wordFile" accept=".doc,.docx" required>
                                            <input type="date" id="vacationDate" required>
                                            <button type="button" id="convertToPDFBtn-unique" class="convertpdf-unique">PDF 변환</button>
                                        </div>
                                    </div>
                                    <div class="submit-subsection-unique">
                                        <div class="submit-container-unique">
                                            <input type="file" id="fileInput-unique" name="fileInput" multiple required>
                                            <button type="button" id="createZipBtn-unique" class="createzip-unique">ZIP 압축</button>
                                        </div>
                                    </div>
                                </div>
                              <form id="submitForm-unique" action="관리자용" method="post" enctype="multipart/form-data" class="form-box-unique">
                                <div class="submit-all-section-unique">
                                    <label for="attendance_sheet-unique">파일 첨부</label>
                                    <input type="file" id="submit_file-unique" name="submit_file" required>
                                </div>
                                <button type="submit" class="vacation-btn-unique">제출</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `;

  // 모달 열기 및 닫기 기능 추가
  const modal = document.getElementById("modal-unique");
  const openModalBtn = document.getElementById("openModalBtn-unique");
  const closeModalBtn = document.getElementsByClassName("close-btn-unique")[0];

  openModalBtn.onclick = function() {
    modal.style.display = "block";
  }

  closeModalBtn.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  // 데이터 초기화
  let requestData = [
    { status: 'pending', type: '연차', date: '2024-06-05', remark: '' },
    { status: 'approved', type: '연차', date: '2024-06-10', remark: '' },
    { status: 'rejected', type: '연차', date: '2024-06-15', remark: '서류 미비' },
    { status: 'pending', type: '연차', date: '2024-06-20', remark: '' },
    { status: 'approved', type: '연차', date: '2024-06-25', remark: '' },
    { status: 'pending', type: '연차', date: '2024-07-01', remark: '' },
    { status: 'rejected', type: '연차', date: '2024-07-05', remark: '사유 불충분' },
    { status: 'approved', type: '연차', date: '2024-07-10', remark: '' },
    { status: 'pending', type: '연차', date: '2024-07-15', remark: '' },
    { status: 'approved', type: '연차', date: '2024-07-20', remark: '' }
  ];

  const tableBody = document.getElementById("status-table-body-unique");
  const pagination = document.getElementById("pagination-unique");
  const searchStartDate = document.getElementById("search-start-date-unique");
  const searchEndDate = document.getElementById("search-end-date-unique");

  let currentPage = 1;
  const itemsPerPage = 4;

  // 최신순으로 정렬
  requestData.sort((a, b) => new Date(b.date) - new Date(a.date));

  function displayData() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = requestData.slice(start, end);

    tableBody.innerHTML = '';
    pageData.forEach((item, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><span class="status-${item.status}-unique">${getStatusText(item.status)}</span></td>
        <td>${item.type}</td>
        <td>${item.date}</td>
        <td>
          ${item.remark}
          ${item.status === 'pending' ? `<button class="cancel-button-unique" data-index="${start + index}">취소</button>` : ''}
        </td>
      `;
      tableBody.appendChild(row);
    });

    // 취소 버튼 이벤트 리스너 추가
    document.querySelectorAll('.cancel-button-unique').forEach(button => {
      button.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        requestData.splice(index, 1);
        displayData();
      });
    });

    displayPagination();
  }

  function displayPagination() {
    const totalPages = Math.ceil(requestData.length / itemsPerPage);
    pagination.innerHTML = '';

    const createArrow = (direction, disabled) => {
      const arrow = document.createElement('button');
      arrow.textContent = direction === 'left' ? '<' : '>';
      arrow.classList.add('page-arrow-unique');
      if (disabled) {
        arrow.classList.add('page-arrow-disabled-unique');
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
      pageButton.classList.add('page-button-unique');
      if (i === currentPage) {
        pageButton.classList.add('page-button-active-unique');
      }
      pageButton.addEventListener('click', () => {
        currentPage = i;
        displayData();
      });
      pagination.appendChild(pageButton);
    }

    pagination.appendChild(createArrow('right', currentPage === totalPages));
  }

  function getStatusText(status) {
    switch(status) {
      case 'pending': return '대기중';
      case 'approved': return '승인';
      case 'rejected': return '반려';
      default: return '';
    }
  }

  function searchByDateRange(startDate, endDate) {
    const filteredData = requestData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    });
    requestData = filteredData.length > 0 ? filteredData : [];
    currentPage = 1;
    displayData();
  }

  searchStartDate.addEventListener('input', () => {
    const startDate = searchStartDate.value;
    const endDate = searchEndDate.value || startDate;
    if (startDate) {
      searchByDateRange(startDate, endDate);
    } else {
      requestData.sort((a, b) => new Date(b.date) - new Date(a.date));
      displayData();
    }
  });

  searchEndDate.addEventListener('input', () => {
    const startDate = searchStartDate.value || searchEndDate.value;
    const endDate = searchEndDate.value;
    if (endDate) {
      searchByDateRange(startDate, endDate);
    } else {
      requestData.sort((a, b) => new Date(b.date) - new Date(a.date));
      displayData();
    }
  });

  displayData();

  document.getElementById("convertToPDFBtn-unique").addEventListener("click", () => {
    const file = document.getElementById("wordFile-unique").files[0];
    const vacationDate = document.getElementById("vacationDate").value;

    if (!vacationDate) {
      alert("휴가 날짜를 입력하세요.");
      return;
    }

    // 과정명 고정값
    const courseName = '데브캠프:프론트엔드 개발 4기(DEV_FE1)';

    // localStorage에서 로그인된 사용자 이름 가져오기
    const userName = localStorage.getItem('userName');
    if (!userName) {
      alert("로그인된 사용자 이름을 찾을 수 없습니다.");
      return;
    }

    // 서버에서 사용자 데이터 가져오기
    fetch('/api/users.json')
      .then(response => response.json())
      .then(data => {
        // 사용자 데이터 확인
        console.log("Fetched user data:", data);

        // data가 배열인지 확인하고, 배열로 변환
        const users = Array.isArray(data.data) ? data.data : [];

        const user = users.find(u => u.name === userName);

        if (user) {
          // 파일명 생성
          let suffix = "";

          if (file.name.includes("출석대장")) {
            suffix = "(출석 입력 대장)";
          } else if (file.name.includes("휴가 사용 계획서")) {
            suffix = "(휴가 계획서)";
          } else {
            suffix = "(기타)";
          }

          const fileName = `${vacationDate}_${courseName}_${user.name}${suffix}.pdf`;

          if (file) {
            const formData = new FormData();
            formData.append("wordFile", file);
            formData.append("fileName", fileName); // 파일명을 폼 데이터에 추가

            fetch("/convert", {
              method: "POST",
              body: formData,
            })
              .then(response => {
                if (response.ok) {
                  return response.blob();
                } else {
                  throw new Error("PDF 변환에 실패했습니다.");
                }
              })
              .then(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName; // 다운로드 시 파일명 지정
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

  document.getElementById("createZipBtn-unique").addEventListener("click", async () => {
    const files = document.getElementById('fileInput-unique').files;
    const vacationDate = document.getElementById("vacationDate").value;

    if (!vacationDate) {
      alert("휴가 날짜를 입력하세요.");
      return;
    }

    // 과정명 고정값
    const courseName = '데브캠프:프론트엔드 개발 4기(DEV_FE1)';

    // localStorage에서 로그인된 사용자 이름 가져오기
    const userName = localStorage.getItem('userName');
    if (!userName) {
      alert("로그인된 사용자 이름을 찾을 수 없습니다.");
      return;
    }

    // 서버에서 사용자 데이터 가져오기
    fetch('/api/users.json')
      .then(response => response.json())
      .then(data => {
        // 사용자 데이터 확인
        console.log("Fetched user data:", data);

        // data가 배열인지 확인하고, 배열로 변환
        const users = Array.isArray(data.data) ? data.data : [];

        const user = users.find(u => u.name === userName);

        if (user) {
          // 파일명 생성
          const fileName = `${vacationDate}_${courseName}_${user.name}(휴가).zip`;

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
}
