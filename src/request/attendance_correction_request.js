import "./attendance_correction_request.css"

export function loadStatus() {
  const app = document.getElementById("app")

  app.innerHTML = `
        <div class="attendance_correction_request-container">
      <h1><img src="/images/attendance_correction_request.png" alt="attendance_correction_request Icon" class="attendance_correction_request-icon">출결 정정 요청</h1>
      <div class="attendance_correction_request-both-container">
        <div class="attendance_correction_request-process-container">
          <h2>출결 정정 요청 프로세스</h2>
          <div class="attendance_correction_request-process-list">
            <h3>1. 운영 매니저 상담</h3>
            <p>휴가 사용 2주 전, 운영 매니저와 상담하여 휴가 사용 여부 확인</p>
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
              <span class="material-symbols-outlined download-icon">download</span>
              <a href="/images/[KDT] 휴가 사용 계획서_김패캠의 사본 - (시트 복제 후 사용)상담일자_휴가사용일자.docx" download class="download-link">
                휴가 계획서 다운로드
              </a>
            </div>
            <p>    
              작성 후 PDF 파일로 변환<br>
              파일명: <span class="ex">'날짜_과정명_성함(휴가 계획서)'</span>
            </p>
            <h3>3. 필요 자료 폴더링</h3>
            <p>
              출석 입력 대장과 휴가 계획서를 하나의 폴더에 포함 및 압축<br>
              압축 폴더명: <span class="ex">'날짜_과정명_이름(휴가)'</span>
            </p>
          </div>
        </div>
        <div class="attendance_correction_request-status-container">
          <div class="content">
            <div class="attendance_correction_request-status-header">
              <span><span class="red-dot"></span>신청 현황</span>
              <div class="attendance_correction_request-status-date-range">
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
            <div class="attendance_correction_request-modal-btn-container">
              <button id="AttendanceCorrectionRequestModalBtn" class="attendance_correction_request-modal-btn">휴가 신청</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="AttendanceCorrectionRequestModal" class="attendance_correction_request-modal">
      <div class="attendance_correction_request-modal-content">
        <span class="attendance_correction_request-modal-close-btn">&times;</span>
        <div class="attendance_correction_request-form-container" id="AttendanceCorrectionRequestFormContainer">
          <h2>휴가 신청</h2>
          <div class="attendance_correction_request-submit-section">
            <div class="attendance_correction_request-date-container">
              <label for="attendance_correction_requestDate">휴가 예정 날짜</label>
              <input type="date" id="AttendanceCorrectionRequestDate" name="attendance_correction_requestDate" required>
            </div>
            <div class="convert-press-container">
              <label for="convertpress">파일 변환</label>
              <div class="attendance_correction_request-pdf-container">
                <input type="file" id="wordFile" name="wordFile" accept=".doc,.docx" required>
                <button type="button" id="convertToPDFBtn" class="convertpdf">PDF 변환</button>
              </div>
              <div class="attendance_correction_request-zip-container">
                <input type="file" id="fileInput" name="fileInput" multiple required>
                <button type="button" id="createZipBtn" class="createzip">ZIP 압축</button>
              </div>
            </div>
          </div>
          <form id="AttendanceCorrectionRequestSubmitForm" action="/upload-attendance_correction_request-request" method="post" enctype="multipart/form-data" class="attendance_correction_requestSubmitForm">
            <label for="attendance_correction_request-file">파일 첨부</label>
            <div class="attendance_correction_request-submit-all-section">
              <input type="file" id="AttendanceCorrectionRequest_submitFile" name="AttendanceCorrectionRequest_submitFile" required>
            </div>
            <button type="submit" class="attendance_correction_request-btn">제출</button>
          </form>
        </div>
      </div>
    </div>
    `

  const content = document.querySelector(".content")

  const leaveRequestData = [
    { status: "대기중", submittedAt: "2024-06-01 10:00", reason: "개인 사유" },
    { status: "승인", submittedAt: "2024-06-02 12:00", reason: "병원 방문" },
  ]

  const officialLeaveRequestData = [
    { status: "대기중", submittedAt: "2024-06-03 09:00", reason: "면접" },
    { status: "승인", submittedAt: "2024-06-04 11:00", reason: "예비군" },
  ]

  const documentSubmissionData = [
    { status: "반려", submittedAt: "2024-06-07 10:00", remarks: "서류 미비" },
    { status: "승인", submittedAt: "2024-06-08 12:00", remarks: "완료" },
  ]

  const attendance_correction_requestRequestData = [
    { status: "승인", submittedAt: "2024-06-05 14:00", reason: "휴가" },
    { status: "대기중", submittedAt: "2024-06-06 16:00", reason: "그냥" },
  ]

  function populateTable(data, hasRemarks = false) {
    return data
      .map(
        (item) => `
            <tr>
                <td>${item.status}</td>
                <td>${item.submittedAt}</td>
                <td>${hasRemarks ? item.remarks : item.reason}</td>
            </tr>
        `
      )
      .join("")
  }

  function renderLeaveRequestStatus() {
    content.innerHTML = `
            <h3>외출/조퇴 신청 현황</h3>
            <table>
                <thead>
                    <tr>
                        <th>상태</th>
                        <th>제출 시각</th>
                        <th>사유</th>
                    </tr>
                </thead>
                <tbody>
                    ${populateTable(leaveRequestData)}
                </tbody>
            </table>
        `
  }

  function renderOfficialLeaveRequestStatus() {
    content.innerHTML = `
            <h3>공가 신청서 제출 현황</h3>
            <table>
                <thead>
                    <tr>
                        <th>상태</th>
                        <th>제출 시각</th>
                        <th>사유</th>
                    </tr>
                </thead>
                <tbody>
                    ${populateTable(officialLeaveRequestData)}
                </tbody>
            </table>
            <h3>서류 제출 현황</h3>
            <table>
                <thead>
                    <tr>
                        <th>상태</th>
                        <th>제출 시각</th>
                        <th>비고</th>
                    </tr>
                </thead>
                <tbody>
                    ${populateTable(documentSubmissionData, true)}
                </tbody>
            </table>
        `
  }

  function renderattendance_correction_requestRequestStatus() {
    content.innerHTML = `
            <h3>휴가 신청 현황</h3>
            <table>
                <thead>
                    <tr>
                        <th>상태</th>
                        <th>제출 시각</th>
                        <th>사유</th>
                    </tr>
                </thead>
                <tbody>
                    ${populateTable(attendance_correction_requestRequestData)}
                </tbody>
            </table>
        `
  }

  function openTab(event, tabName) {
    const tablinks = document.querySelectorAll(".tablink")

    tablinks.forEach((tablink) => {
      tablink.classList.remove("active")
    })

    event.currentTarget.classList.add("active")

    if (tabName === "leaveRequestStatus") {
      renderLeaveRequestStatus()
    } else if (tabName === "officialLeaveRequestStatus") {
      renderOfficialLeaveRequestStatus()
    } else if (tabName === "attendance_correction_requestRequestStatus") {
      renderattendance_correction_requestRequestStatus()
    }
  }

  const tablinks = document.querySelectorAll(".tablink")
  tablinks.forEach((tablink) => {
    tablink.addEventListener("click", function (event) {
      openTab(event, this.getAttribute("data-tab"))
    })
  })

  document.querySelector(".tablink.active").click()
}
