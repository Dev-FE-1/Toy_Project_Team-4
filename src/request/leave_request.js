import "./leave_request.css"; 

export function loadLeaveRequest() {
  const app = document.getElementById("app"); 
  app.innerHTML = `
        <div class="container">
            <h2>외출/조퇴 신청</h2>
            <form id="leaveRequestForm" action="/submit_leave_early_request" method="post">
                <label for="reason">사유</label>
                <textarea id="reason" name="reason" required></textarea>
                <button type="submit">제출</button>
            </form>
        </div>
    `; 

  document
    .getElementById("leaveRequestForm") // leaveRequestForm 요소를 가져옴
    .addEventListener("submit", function (event) {
      // 폼 제출 이벤트 리스너 추가
      event.preventDefault(); // 폼 제출 기본 동작을 막음
      app.innerHTML = `
            <h2>외출/조퇴 신청 완료</h2>
            <p>사유: ${document.getElementById("reason").value}</p>
        `; // 제출 완료 메시지와 입력된 사유를 화면에 표시
    });
}
