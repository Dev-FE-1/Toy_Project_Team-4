import "./main.css"
import "./styles/sidebar.css"
import "./styles/header.css"
import "./styles/home.css"
import { loadLogin } from "./login&signup/login.js"
import { mainHome } from "./components/home.js"
import { loadInquiryBoard } from "./messageBoard/InquiryBoard.js"
import { loadAttendRecord } from "./attendance/attendRecord.js"
import { loadOverlay } from "./attendance/overlay.js"
import { updateTime } from "./attendance/updateTime.js"
import { loadLeaveRequest } from "./request/leave_request.js"
import { loadOfficialLeaveRequest } from "./request/offical_leave_request.js"
import { loadOfficialLeaveSubmitDocument } from "./request/offical_leave_submit_document.js"
import { loadStatus } from "./request/status.js"
import { loadVacationRequest } from "./request/vacation_request.js"
import { loadGallery } from "./gallery/gallery.js"
import { profile } from "./page/profile.js"

const app = () => {
  init()
  route()
}

function init() {
  window.addEventListener("popstate", route)
  document.body.addEventListener("click", navPage)
}

function navPage(event) {
  const a = event.target.closest("a")

  if (a && a.href) {
    event.preventDefault()
    const path = a.getAttribute("href")
    history.pushState(null, null, path)
    route()
  }
}

export function route() {
  const path = location.pathname
  const app = document.querySelector("#app")

  if (!app) return

  app.innerHTML = "" // 기존 콘텐츠 삭제

  switch (path) {
    case "/user-profile":
      profile() // 프로필 관리 페이지
      break
    case "/":
      mainHome() // 메인 홈
      break
    case "/notice":
      app.innerHTML = `` // 공지사항
      break
    case "/inquiry-board":
      loadInquiryBoard() // 문의 게시판
      break
    case "/request":
      app.innerHTML = `` // 행정 자료 요청
      break
    case "/gallery":
      loadGallery() // 기업 공지 모음 갤러리
      break
    case "/attendance-record":
      loadAttendRecord() // 입퇴실 기록
      break
    case "/going-out":
      loadLeaveRequest() // 외출, 조퇴 신청
      break
    case "/vacation":
      loadVacationRequest() // 휴가 신청
      break
    case "/application-form":
      loadOfficialLeaveRequest() // 공가 신청
      break
    case "/document":
      loadOfficialLeaveSubmitDocument() // 서류 제출
      break
    case "/status":
      loadStatus() // 신청 현황
      break
  }
}

document.addEventListener("DOMContentLoaded", app)

// 페이지 로드 시 초기 콘텐츠 설정
document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn")
  if (isLoggedIn === "true") {
    onLoginSuccess() // 로그인 상태라면 메인 페이지를 로드합니다.
  } else {
    loadLogin() // 로그인 상태가 아니라면 로그인 페이지를 로드합니다.
  }
})

// 로그인 완료 후 메인 페이지 로드 함수
export function onLoginSuccess() {
  const app = document.getElementById("app")
  if (app) {
    app.innerHTML = "" // 기존 콘텐츠 삭제
    mainHome() // 메인 페이지 로드
  }
}
