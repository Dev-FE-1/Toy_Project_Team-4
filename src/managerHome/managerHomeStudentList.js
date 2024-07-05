import axios from "axios"
import "./managerHomeStudentList.css"

let students = []

export function managerHomeStudentList() {
  const managerHomeStudentList = document.querySelector("#attendance-Check")
  managerHomeStudentList.innerHTML = `
  <h4>강의장 접속 현황</h4>
  <ul class='managerHomeStudentList'></ul>

    `
  studentList()

  return managerHomeStudentList
}
// 수강생 리스트 가져오기
const studentList = async () => {
  const ul = document.querySelector(".managerHomeStudentList")
  const res = await axios.get("/api/users.json")
  const studentData = res.data.data
  function userType(element) {
    if (element.userType === "student") {
      return true
    }
  }
  students = studentData.filter(userType)

  ul.innerHTML = ""
  for (let i = 0; i < students.length; i++) {
    let randomPercent = Math.floor(Math.random() * 100)
    let randomText =
      randomPercent < 80
        ? `<span class="material-symbols-outlined toggleOn">toggle_on</span>Online`
        : `<span class="material-symbols-outlined toggleOff">toggle_off</span>Offline`
    ul.innerHTML += `
          <li>
        <div>
          <div class="studentImage" style="background-image: url(${students[i].profileImage})"></div>
          <p>${students[i].name} </p>
        </div>
        <div>
          ${randomText}
        </div>
      </li>
    `
  }
}
