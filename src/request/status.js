import "./status.css"

export function loadStatus() {
  const app = document.getElementById("app")

  app.innerHTML = `
        <div class="status_container">
            <h2>신청 현황</h2>
            <div class="tabs">
                <button class="tablink active" data-tab="leaveRequestStatus">외출/조퇴 신청</button>
                <button class="tablink" data-tab="vacationRequestStatus">휴가 신청</button>
                <button class="tablink" data-tab="officialLeaveRequestStatus">공가 신청</button>
            </div>
            <div id="content">
            </div>
        </div>
    `

  const content = document.getElementById("content")

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

  const vacationRequestData = [
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

  function renderVacationRequestStatus() {
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
                    ${populateTable(vacationRequestData)}
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
    } else if (tabName === "vacationRequestStatus") {
      renderVacationRequestStatus()
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
