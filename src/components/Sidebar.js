import { route } from "../main" // navigate 함수를 main.js에서 가져옴
import { loadLogin } from "../login&signup/login"

export function loadSidebar() {
  const sidebar = createSidebar()
  document.body.insertBefore(sidebar, document.body.firstChild)

  // 사이드바 내부 클릭 이벤트 추가
  sidebar.addEventListener("click", function (event) {
    sidebar.classList.toggle("expanded")
  })

  // 사이드바 외부 클릭 이벤트 추가
  document.addEventListener("click", function (event) {
    if (!sidebar.contains(event.target)) {
      sidebar.classList.remove("expanded")
    }
  })

  function adjustHeaderWidth() {
    const header = document.querySelector("header") // 헤더 요소를 선택합니다.
    if (header) {
      const sidebar = document.getElementById("sidebar")
      if (sidebar) {
        header.style.width = `${window.innerWidth - sidebar.offsetWidth}px` // 사이드바 너비를 제외한 나머지 너비로 헤더 너비를 설정합니다.
      } else {
        header.style.width = "100%" // 사이드바가 없는 경우 전체 너비로 설정합니다.
      }
    }
  }

  // 초기 헤더 넓이 조정
  adjustHeaderWidth()
  window.addEventListener("resize", adjustHeaderWidth)

  sidebar.addEventListener("transitionend", adjustHeaderWidth) // 사이드바의 트랜지션 끝난 후 헤더 조정
}

function createSidebar() {
  const sidebar = document.createElement("div")
  sidebar.id = "sidebar"
  sidebar.classList.add("sidebar")

  sidebar.innerHTML = `
    <div class="sidebar-content">
      <ul>
        <li class="logo">
          <div class="logo-container">
            <img src="/images/fast_campus_logo_toggle.png" alt="Logo" class="logo-default">
            <img src="/images/fast_campus_logo.png" alt="Hover Logo" class="logo-hover">
          </div>
        </li>
        <li class="user-item">
          <a href="/user-profile">
            <img src="/images/user1.png" alt="User" class="user-icon">
            <img src="/images/iconsettings.svg" alt="Settings" class="hover-icon">
            <div class="text-container">
              <span class="text1">User</span>
              <span class="text2">helloworld@gmail.com</span>
            </div>
          </a>
        </li>
        <li>
          <a href="/home">
            <span class="icon">
              <img src="/images/iconHome.svg" alt="Home">
            </span>
            <span class="text">홈</span>
          </a>
        </li>
        <li>
          <a href="javascript:void(0);" class="has-submenu">
            <span class="icon">
              <img src="/images/iconBoard.svg" alt="게시판">
            </span>
            <span class="text">게시판</span>
          </a>
          <ul class="submenu visible">
            <li>
              <a href="/notice">
                <span class="sub-icon">
                  <img src="/images/category.svg" alt="공지사항">
                </span>
                <span class="sub-text">공지사항</span>
              </a>
            </li>
            <li>
              <a href="/inquiry-board">
                <span class="sub-icon">
                  <img src="/images/category.svg" alt="문의 게시판">
                </span>
                <span class="sub-text">문의 게시판</span>
              </a>
            </li>
            <li>
              <a href="/request">
                <span class="sub-icon">
                  <img src="/images/category.svg" alt="문서 발급">
                </span>
                <span class="sub-text">문서 발급</span>
              </a>
            </li>
            <li>
              <a href="/gallery">
                <span class="sub-icon">
                  <img src="/images/category.svg" alt="기업 공지 모음">
                </span>
                <span class="sub-text">기업 공지 모음</span>
              </a>
            </li>
          </ul>
        </li>
        <li>
          <a href="javascript:void(0);" class="has-submenu">
            <span class="icon">
              <img src="/images/iconCalendar.svg" alt="출결 관리">
            </span>
            <span class="text">출결 관리</span>
          </a>
          <ul class="submenu visible">
            <li>
              <a href="/attendance-record">
                <span class="sub-icon">
                  <img src="/images/category.svg" alt="입실/퇴실 기록">
                </span>
              <span class="sub-text">입실/퇴실 기록</span>
            </a>
          </li>
          <li>
            <a href="/going-out">
              <span class="sub-icon">
                <img src="/images/category.svg" alt="외출/조퇴 신청">
              </span>
              <span class="sub-text">외출/조퇴 신청</span>
            </a>
          </li>
          <li>
            <a href="/vacation">
              <span class="sub-icon">
                <img src="/images/category.svg" alt="휴가 신청">
              </span>
              <span class="sub-text">휴가 신청</span>
            </a>
          </li>
          <li>
          <a href="javascript:void(0);" class="has-submenu">
              <span class="sub-icon">
                <img src="/images/category.svg" alt="공가 신청">
              </span>
              <span class="sub-text">공가 신청</span>
            </a>
            <ul class="submenu visible">
              <li>
                <a href="/application-form">
                  <span class="subsub-icon">
                    <img src="/images/category2.svg" alt="신청서 제출">
                  </span>
                  <span class="subsub-text">신청서 제출</span>
                </a>
              </li>
              <li>
                <a href="/document">
                  <span class="subsub-icon">
                    <img src="/images/category2.svg" alt="서류 제출">
                  </span>
                  <span class="subsub-text">서류 제출</span>
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a href="/status">
              <span class="sub-icon">
                <img src="/images/category.svg" alt="신청 현황">
              </span>
              <span class="sub-text">신청 현황</span>
            </a>
          </li>
        </ul>
      </li>
      <li class="bottom">
        <a href="/">
          <span class="icon">
            <img src="/images/iconToggle.svg" alt="로그아웃">
          </span>
          <span class="text">로그아웃</span>
        </a>
      </li>
    </div>
  `

  // 모든 서브메뉴에서 visible 클래스 제거
  const submenus = sidebar.querySelectorAll(".submenu")
  submenus.forEach((submenu) => {
    submenu.classList.remove("visible")
  })

  // 로그아웃 클릭 이벤트 추가
  const logoutLink = sidebar.querySelector(".bottom a")
  if (logoutLink) {
    logoutLink.addEventListener("click", handleLogout)
  }

  // 모든 링크에 클릭 이벤트 추가
  const links = sidebar.querySelectorAll("a[href]")
  links.forEach((link) => {
    const icons = link.querySelectorAll("img")
    icons.forEach((icon) => {
      if (!icon.classList.contains("user-icon")) {
        addHoverEffect(link, icon)
      }
    })
    // 링크 클릭 시 페이지 네비게이션을 위한 이벤트 핸들러 추가
    // link.addEventListener("click", (e) => {
    //   e.preventDefault()
    //   const path = link.getAttribute("href")
    //   if (path && path !== "javascript:void(0);") {
    //     history.pushState(null, null, path)
    //     route() // 경로 변경 시 route 함수 호출
    //   }
    // })
  })

  // 서브메뉴 클릭 이벤트 추가
  const submenuParents = sidebar.querySelectorAll(".has-submenu")
  submenuParents.forEach((parent) => {
    parent.addEventListener("click", function (event) {
      event.preventDefault()
      const submenu = parent.nextElementSibling
      if (submenu && submenu.classList.contains("submenu")) {
        submenu.classList.toggle("visible")
        event.stopPropagation() // 이벤트 버블링 중지
      }
    })
  })

  return sidebar
}

function handleLogout(event) {
  event.preventDefault() // 기본 동작 막기
  localStorage.removeItem("userInfo")

  // 히스토리를 초기화하여 뒤로가기 시 이전 페이지로 가지 않도록 함
  history.pushState(null, null, "/")
  history.replaceState(null, null, "/")
  
  window.location.href = "http://localhost:5173" // 로그인 페이지의 URL
}

function addHoverEffect(element, iconElement) {
  if (iconElement.classList.contains("hover-icon")) {
    iconElement.addEventListener("mouseover", function () {
      iconElement.classList.add("icon-red-filter")
    })
    iconElement.addEventListener("mouseout", function () {
      iconElement.classList.remove("icon-red-filter")
    })
  } else {
    element.addEventListener("mouseover", function () {
      iconElement.classList.add("icon-red-filter")
    })
    element.addEventListener("mouseout", function () {
      iconElement.classList.remove("icon-red-filter")
    })
  }
}
