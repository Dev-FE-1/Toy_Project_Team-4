document.addEventListener('DOMContentLoaded', function() {
  const header = createHeader();
  document.body.insertBefore(header, document.body.firstChild);

  // 초기 헤더 넓이 조정
  adjustHeaderWidth();
  window.addEventListener('resize', adjustHeaderWidth);
});

function createHeader() {
  const userInfo = {
    name: 'User',
    email: 'john.doe@example.com'
  };

  const header = document.createElement('div');
  header.id = 'content';
  header.classList.add('content');
  header.innerHTML = `
    <div class="header">
      <span class="user-info">
        <span>${userInfo.name} 님 안녕하세요!</span>
      </span>
      <span class="user-icons">
        <a href="#" target="_blank">
          <img class="user-icon" src="../../public/images/iconzoom.png" alt="User zoom">
        </a>
        <a href="#">
          <img class="user-icon" src="../../public/images/iconmessage.svg" alt="User message">
        </a>
        <a href="#">
          <img class="user-icon" src="../../public/images/iconbell.svg" alt="User bell">
        </a>
      </span>
    </div>
    <div class="mainhome">
      <div class="calendar">Calendar</div>
      <div class="attendance">Attendance</div>
      <div class="attendance-Check">Attendance Check</div>
    </div>
  `;

  return header;
}

function adjustHeaderWidth() {
  const home = document.getElementById('content');
  const sidebar = document.getElementById('sidebar');
  if (home && sidebar) {
    const sidebarWidth = sidebar.offsetWidth;
    home.style.width = `calc(100vw - ${sidebarWidth}px)`;
    home.style.left = `${sidebarWidth}px`;
  }
}
