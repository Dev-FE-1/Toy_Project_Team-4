import './main.css';
import './styles/sidebar.css';
import './styles/header.css';
import './styles/home.css';
import './styles/InquiryBoard.css';
import { loadSidebar } from './components/Sidebar.js';
import { createHeader } from './components/header.js';
import { loadHome } from './components/home.js';
import { loadInquiryBoard } from './components/InquiryBoard.js';

function navigate(path) {
  if (path === '/inquiry-board') {
    loadInquiryBoard();
  } else {
    loadHome();
  }
}

// 페이지 로드 시 초기 콘텐츠 설정
export const mainPage = document.addEventListener('DOMContentLoaded', () => {
  loadSidebar(); // 사이드바를 페이지 로드 시점에 로드

  navigate(location.pathname);

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
});
