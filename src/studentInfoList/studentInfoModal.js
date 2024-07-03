import "./studentInfo.css"
import { setStudentList } from "./studentInfo"

let students4Edit = []

export function loadModal() {
  const studentModal = document.querySelector(".studentModal")
  if (studentModal) {
    studentModal.innerHTML = `
    <div class="studentModalpage">
          <p>수정 하시겠습니까?</p>
          <div class="yesOrNoBtn">
            <button id="yesBtn">예</button>
            <button id="noBtn">아니오</button>
          </div>
        </div>
    `
  }
  const checkYes = document.querySelector("#yesBtn")
  const checkNo = document.querySelector("#noBtn")
  checkYes.addEventListener("click", () => {
    resetStudentInfoBtn(studentModal)
  })
  checkNo.addEventListener("click", () => {
    resetStudentInfoBtn(studentModal)
  })
  return studentModal
}

// 수강생 리스트페이지 모달 띄우기
export const loadstudentmodal = (students) => {
  const studentModal = document.querySelector(".studentModal")
  studentModal.classList.add("active")

  if (students.length > 0) {
    students4Edit = students
  }
}

// 수강생 리스트페이지 모달과 함께 버튼 + 선택한 수강생리스트 없애기
const resetStudentInfoBtn = (studentModal) => {
  const listEditBtn = document.querySelector(".listEditFinish")
  const label = document.querySelectorAll("label")
  const checkbox = document.querySelectorAll("input")
  let notDeleteList = []

  studentModal.classList.remove("active")
  listEditBtn.classList.add("listEditBtn")
  listEditBtn.classList.remove("listEditFinish")
  listEditBtn.textContent = "수강생 편집"
  for (let i = 0; i < label.length; i++) {
    label[i].classList.remove("clickArea")
  }
  for (let i = 1; i < checkbox.length; i++) {
    if (checkbox[i].checked == false) {
      notDeleteList.push(students4Edit[i - 1])
    }
    checkbox[i].checked = false
  }
  setStudentList(notDeleteList)
}
