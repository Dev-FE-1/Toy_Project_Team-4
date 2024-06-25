import "./leave_request.css";

export function loadLeaveRequest() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="leave_request_container">
      <h2>외출/조퇴 신청</h2>
      <form id="leaveRequestForm" action="/submit_leave_early_request" method="post">
        <label for="reason">사유</label>
        <textarea id="reason" name="reason" required></textarea>
        <button type="submit">제출</button>
      </form>
    </div>
  `;

  document
    .getElementById("leaveRequestForm")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      app.innerHTML = `
      <h2>외출/조퇴 신청 완료</h2>
      <p>사유: ${document.getElementById("reason").value}</p>
    `;
    });
}
