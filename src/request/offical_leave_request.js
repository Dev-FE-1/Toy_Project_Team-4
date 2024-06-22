import "./offical_leave_request.css"

export function loadOfficialLeaveRequest() {
  const app = document.getElementById("app")
  app.innerHTML = `
    <div class="offical_leave_request_container">
      <form id="officialLeaveForm" action="관리자용" method="post">
        <h2>공가 신청</h2>
        <label for="start_date">시작 날짜</label>
        <input type="date" id="start_date" name="start_date" required>
        <label for="end_date">종료 날짜</label>
        <input type="date" id="end_date" name="end_date" required>
        <label for="reason">사유</label>
        <textarea id="reason" name="reason" required></textarea>
        <button type="submit">신청서 제출</button>
      </form>
    </div>
  `
  document.getElementById("officialLeaveForm").addEventListener("submit", (event) => {
    event.preventDefault()
    const { start_date, end_date, reason } = event.target.elements
    app.innerHTML = `
      <h2>공가 신청</h2>
      <p>시작 날짜: ${start_date.value}</p>
      <p>종료 날짜: ${end_date.value}</p>
      <p>사유: ${reason.value}</p>
      <p>관리자의 임시 승인을 기다리는 중입니다...</p>
    `
  })
}
