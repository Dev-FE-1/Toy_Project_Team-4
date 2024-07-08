import { studentAttendanceRecordChart } from "./studentAttendChart.js"
import { managerHomeStudentList } from "./managerHomeStudentList.js"
import { createHeader, adjustHeaderWidth } from "../components/header.js"
import { loadManagerSidebar } from "./managerSidebar.js"
import { loadLogin } from "../login&signup/login.js"
import { todolist } from "./todolist.js"

function managerHomeContent() {
  const content = document.createElement("div")
  content.id = "content"
  content.classList.add("content")
  content.innerHTML = `
    <div class="mainhome">
      <div id="calendar"></div>
      <div id="attendSection">
        <div id="attendance"></div>
        <div id="attendance-Check"></div>
      </div>
      <div class="overlay"></div>
    </div>
  `

  // 브라우저의 렌더링이 완료된 후 함수 실행
  requestAnimationFrame(() => {
    studentAttendanceRecordChart()
    managerHomeStudentList()
    todolist()
  })

  return content
}

export function managerHome() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"))
  if (!userInfo) {
    loadLogin()
    return
  }

  // 헤더가 이미 존재하는지 확인
  if (!document.getElementById("header")) {
    const header = createHeader() // 헤더를 생성
    // document.body의 두 번째 자식 요소를 찾음
    const secondChild = document.body.children[1]

    // 두 번째 자식 요소 앞에 header를 삽입
    if (secondChild) {
      document.body.insertBefore(header, secondChild)
    } else {
      // 두 번째 자식 요소가 없으면 맨 끝에 추가
      document.body.appendChild(header)
    }

    // 초기 헤더 넓이 조정
    adjustHeaderWidth()
    window.addEventListener("resize", adjustHeaderWidth)
  }

  // 사이드바가 이미 존재하는지 확인
  if (!document.getElementById("sidebar")) {
    loadManagerSidebar() // 사이드바를 로드
  }

  const app = document.querySelector("#app")
  if (app) {
    app.innerHTML = "" // 기존 콘텐츠 삭제
    app.appendChild(managerHomeContent()) // 메인 홈 콘텐츠 로드
  }
}
