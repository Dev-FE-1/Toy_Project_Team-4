import "./offical_leave_request.css"; 

export function loadOfficialLeaveRequest() {
  const app = document.getElementById("app"); 
  app.innerHTML = `
        <div class="container">
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
    `; 
  document
    .getElementById("officialLeaveForm") // 폼 요소를 가져옴
    .addEventListener("submit", function (event) {
      // 폼 제출 이벤트 리스너 추가
      event.preventDefault(); // 기본 폼 제출 동작을 막음
      const { start_date, end_date, reason } = event.target.elements; // 폼 요소에서 값 가져옴
      app.innerHTML = `
            <h2>공가 신청</h2>
            <p>시작 날짜: ${start_date.value}</p>
            <p>종료 날짜: ${end_date.value}</p>
            <p>사유: ${reason.value}</p>
            <p>관리자의 임시 승인을 기다리는 중입니다...</p>
        `; // 제출 후 확인 메시지 표시
    });
}
