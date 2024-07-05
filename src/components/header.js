export function createHeader() {
  const getlocalStorage = JSON.parse(localStorage.getItem("userInfo"))

  const header = document.createElement("div")
  header.id = "header"
  header.classList.add("header")
  header.innerHTML = `
    <div class="user-header">
      <span class="user-info">
        <span>${getlocalStorage.userName} 님 안녕하세요!</span>
      </span>
      <span class="user-icons">
        <button class="logoutBtn">로그아웃</button>
      </span>
    </div>
  `
  const logoutBtn = header.querySelector("button")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout)
  }
  return header
}

export function adjustHeaderWidth() {
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

const handleLogout = () => {
  localStorage.removeItem("userInfo")

  // 히스토리를 초기화하여 뒤로가기 시 이전 페이지로 가지 않도록 함
  history.pushState(null, null, "/")
  history.replaceState(null, null, "/")

  window.location.href = "http://localhost:5173" // 로그인 페이지의 URL
}
