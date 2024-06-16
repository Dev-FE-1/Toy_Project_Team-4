export function loadHome() {
  // 이 함수에 대한 구현을 추가하세요
}

document.addEventListener('DOMContentLoaded', function() {
  const header = createHeader();
  const thirdChild = document.body.children[2]; // 세 번째 자식 요소를 찾음

  if (thirdChild) {
    document.body.insertBefore(header, thirdChild); // 세 번째 자식 요소 앞에 삽입
  } else {
    document.body.appendChild(header); // 세 번째 자식 요소가 없으면 맨 끝에 추가
  }
});

function createHeader() {

  const header = document.createElement('div');
  header.id = 'content';
  header.classList.add('content');
  header.innerHTML = `
    <div class="mainhome">
      <div class="calendar">Calendar</div>
      <div class="attendance">Attendance</div>
      <div class="attendance-Check">Attendance Check</div>
    </div>
  `;

  return header;
}
