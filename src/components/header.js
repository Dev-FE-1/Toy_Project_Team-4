// document.addEventListener('DOMContentLoaded', function() {
//   const header = createHeader();
  
//   // document.body의 두 번째 자식 요소를 찾음
//   const secondChild = document.body.children[1];

//   // 두 번째 자식 요소 앞에 header를 삽입
//   if (secondChild) {
//     document.body.insertBefore(header, secondChild);
//   } else {
//     // 두 번째 자식 요소가 없으면 맨 끝에 추가
//     document.body.appendChild(header);
//   }

//   // 초기 헤더 넓이 조정
//   adjustHeaderWidth();
//   window.addEventListener('resize', adjustHeaderWidth);
// });

export function createHeader() {
  const userInfo = {
    name: 'User',
    email: 'john.doe@example.com'
  };

  const header = document.createElement('div');
  header.id = 'header';
  header.classList.add('header');
  header.innerHTML = `
    <div class="user-header">
      <span class="user-info">
        <span>${userInfo.name} 님 안녕하세요!</span>
      </span>
      <span class="user-icons">
        <a href="https://us06web.zoom.us/j/88141259246?pwd=Rt4lAS2tMOIVikKaxyshwv9B4NWe16.1" target="_blank">
          <img class="user-icon" src="/images/iconzoom.png" alt="User zoom">
        </a>
        <a href="#">
          <img class="user-icon" src="/images/iconmessage.svg" alt="User message">
        </a>
        <a href="#">
          <img class="user-icon" src="/images/iconbell.svg" alt="User bell">
        </a>
      </span>
    </div>
  `;

  return header;
}

export function adjustHeaderWidth() {
  const header = document.querySelector('header'); // 헤더 요소를 선택합니다.
  if (header) {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      header.style.width = `${window.innerWidth - sidebar.offsetWidth}px`; // 사이드바 너비를 제외한 나머지 너비로 헤더 너비를 설정합니다.
    } else {
      header.style.width = '100%'; // 사이드바가 없는 경우 전체 너비로 설정합니다.
    }
  }
}
