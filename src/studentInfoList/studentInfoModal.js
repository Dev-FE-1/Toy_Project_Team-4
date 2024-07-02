import "./studentInfo.css"

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

// 프로필 모달 띄우기
export const loadstudentmodal = () => {
  const studentModal = document.querySelector(".studentModal")
  studentModal.classList.add("active")
}

const resetStudentInfoBtn = (studentModal) => {
  studentModal.classList.remove("active")
  const label = document.querySelectorAll("label")
  for (let i = 0; i < label.length; i++) {
    label[i].classList.remove("clickArea")
  }
}
