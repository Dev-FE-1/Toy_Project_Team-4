import './main.css';
import './styles/sidebar.css';
import './styles/header.css';
import './styles/home.css';
import './styles/InquiryBoard.css';
import { loadLogin } from './login&signup/login.js';
import { loadSidebar } from './components/Sidebar.js';
import { createHeader } from './components/header.js';
import { createHomeContent } from './components/home.js';
import { loadInquiryBoard } from './components/InquiryBoard.js';


export function navigate(path) {
  const app = document.getElementById('app');
  if (path === '/inquiry-board') {
    loadInquiryBoard();
  } else {
    if (app) {
      app.innerHTML = ''; // 기존 콘텐츠 삭제
      const content = createHomeContent();
      app.appendChild(content);
    }
  }
}

function adjustHeaderWidth() {
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

function mainHome() {
  const header = createHeader(); // 헤더를 생성
  // document.body의 두 번째 자식 요소를 찾음
  const secondChild = document.body.children[1];

  // 두 번째 자식 요소 앞에 header를 삽입
  if (secondChild) {
    document.body.insertBefore(header, secondChild);
  } else {
    // 두 번째 자식 요소가 없으면 맨 끝에 추가
    document.body.appendChild(header);
  }

  // 초기 헤더 넓이 조정
  adjustHeaderWidth();
  window.addEventListener('resize', adjustHeaderWidth);

  loadSidebar(); // 사이드바를 로드
  navigate(location.pathname); // 현재 경로에 따라 페이지 로드
}

// 페이지 로드 시 초기 콘텐츠 설정
document.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (isLoggedIn === 'true') {
    onLoginSuccess(); // 로그인 상태라면 메인 페이지를 로드합니다.
  } else {
    loadLogin(); // 로그인 상태가 아니라면 로그인 페이지를 로드합니다.
  }
});

// 로그인 완료 후 메인 페이지 로드 함수
export function onLoginSuccess() {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = ''; // 기존 콘텐츠 삭제
    mainHome(); // 메인 페이지 로드

    // 네비게이션 링크 클릭 이벤트 설정
    const homeLink = document.querySelector('#sidebar-home-link');
    if (homeLink) {
      homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        history.pushState(null, '', '/');
        navigate('/');
      });
    }

    const inquiryLink = document.querySelector('#sidebar-inquiry-link');
    if (inquiryLink) {
      inquiryLink.addEventListener('click', (e) => {
        e.preventDefault();
        history.pushState(null, '', '/inquiry-board');
        navigate('/inquiry-board');
      });
    }

    // 브라우저 뒤로/앞으로 버튼 클릭 이벤트 처리
    window.addEventListener('popstate', () => {
      navigate(location.pathname);
    });
  }
}
