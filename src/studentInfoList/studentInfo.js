import "./studentInfo.css"
import axios from "axios"
import { loadModal, loadstudentmodal } from "./studentInfoModal"

export function studentInfo() {
  const app = document.querySelector("#app")
  app.innerHTML = `
      <section id="studentList">
        <div class="studentListTop">
          <h1>수강생 리스트</h1>
          <div>
            <input type="search" class="form-search" placeholder="수강생 검색하기" />
            <button class="listEditBtn">수강생 편집</button>
          </div>
        </div>
        <div class="studentListBottom">
          <ul class="getStudentInfo">
          </ul>
          </div>
        <div class="studentModal"></div>
      </section>
    `
  getStudentInfo()
  loadModal()
  const studentSearch = document.querySelector(".form-search")
  studentSearch.addEventListener("keydown", (e) => {
    if (e.keyCode == 13) {
      getStudentInfo(e)
    }
  })
  const listEditBtn = document.querySelector(".listEditBtn")
  listEditBtn.addEventListener("click", () => {
    listEdit()
  })
  return app
}

async function getStudentInfo(e) {
  // users.json에 수강생 정보 가져오기
  const res = await axios.get("/api/users.json")
  const userData = res.data.data

  function userType(element) {
    if (element.userType === "student") {
      return true
    }
  }
  const students = userData.filter(userType)
  setStudentList(students)

  // 검색 필터
  if (e) {
    const searchValue = document.querySelector(".form-search").value
    let regexp = new RegExp(searchValue, "gi")
    let data = students.filter((item) => regexp.test(item.name) || regexp.test(item.email) || regexp.test(item.phone))
    if (data.length > 0) {
      setStudentList(data)
    }
  }
}

// 수강생 리스트 생성
const setStudentList = (students) => {
  const ul = document.querySelector(".getStudentInfo")
  ul.innerHTML = ""
  for (let i = 0; i < students.length; i++) {
    ul.innerHTML += `
                    <li>
              <div>
                <div class="studentProfileTop" style="background-image: url(${students[i].background})">
                  <div class="userPng" style="background-image: url(${students[i].profileImage})"></div>
                </div>
                <div class="studentInfo">
                  <p>${students[i].name}</p>
                  <p>${students[i].email}</p>
                  <p>${students[i].phone}</p>
                  <input type="checkbox" id="studentCheck${students[i].id}" />
                  <label for="studentCheck${students[i].id}"></label>
                </div>
              </div>
            </li>
        `
  }
}

const listEdit = () => {
  const listEditBtn = document.querySelector(".listEditBtn")
  const label = document.querySelectorAll("label")

  listEditBtn.classList.add("listEditFinish")
  listEditBtn.textContent = "선택한 수강생 삭제"
  for (let i = 0; i < label.length; i++) {
    label[i].classList.add("clickArea")
  }

  const listEditFinishBtn = document.querySelector(".listEditFinish")
  listEditFinishBtn.addEventListener("click", function () {
    loadstudentmodal()
  })
}
