export function createFooter() {
    const footer = document.createElement('footer');
    footer.id = 'footer';
    footer.classList.add('footer');
    footer.innerHTML = `
      <div class="footer-container">
        <div class="footer-center">
          <p>© 2024 FASTNET. All rights reserved.</p>
        </div>
      </div>
    `;
    return footer;
  }
  
  export function adjustFooterWidth() {
    const footer = document.querySelector('footer'); // 푸터 요소를 선택합니다.
    if (footer) {
      const sidebar = document.getElementById('sidebar');
      if (sidebar) {
        footer.style.width = `${window.innerWidth - sidebar.offsetWidth}px`; // 사이드바 너비를 제외한 나머지 너비로 푸터 너비를 설정합니다.
      } else {
        footer.style.width = '100%'; // 사이드바가 없는 경우 전체 너비로 설정합니다.
      }
    }
  }
  
  // 페이지 로드 시 푸터를 추가하고 너비를 조정
  document.addEventListener('DOMContentLoaded', function() {
    const existingFooter = document.getElementById('footer');
    if (!existingFooter) {
      const footer = createFooter();
      document.body.appendChild(footer);
      adjustFooterWidth();
      window.addEventListener('resize', adjustFooterWidth);
    }
  });
  