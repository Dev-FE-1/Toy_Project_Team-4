import "./studentInfo.css"
import axios from "axios"
import { loadModal, loadstudentmodal } from "./studentInfoModal"

let students = []

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
          <div class="loading-container" id="loadingOverlay">
            <div class="loading-animation">
              <div class="loading-dot"></div>
              <div class="loading-dot"></div>
              <div class="loading-dot"></div>
            </div>
          </div>
          <ul class="getStudentInfo"></ul>
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
    if (listEditBtn.className === "listEditBtn") {
      listEdit()
    } else {
      loadstudentmodal(students)
    }
  })
  return app
}

// users.json에 수강생 정보 가져오기
async function getStudentInfo(e) {
  const res = await axios.get("/api/users.json")
  const userData = res.data.data

  function userType(element) {
    if (element.userType === "student") {
      return true
    }
  }
  students = userData.filter(userType)
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
export const setStudentList = (studentsList) => {
  const loadingContainer = document.querySelector("#loadingOverlay")
  loadingContainer.classList.add("hidden")

  const ul = document.querySelector(".getStudentInfo")
  ul.classList.add("addHeight")

  ul.innerHTML = ""
  for (let i = 0; i < studentsList.length; i++) {
    ul.innerHTML += `
                    <li>
              <div>
                <div class="studentProfileTop" style="background-image: url(${studentsList[i].background})">
                  <div class="userPng" style="background-image: url(${studentsList[i].profileImage})"></div>
                </div>
                <div class="studentInfo">
                  <p>${studentsList[i].name}</p>
                  <p>${studentsList[i].email}</p>
                  <p>${studentsList[i].phone}</p>
                  <input type="checkbox" id="studentCheck${studentsList[i].id}" />
                  <label for="studentCheck${studentsList[i].id}"></label>
                </div>
              </div>
            </li>
        `
  }

  students = studentsList
}

// 수강생 리스트 선택박스 띄우기
const listEdit = () => {
  const listEditBtn = document.querySelector(".listEditBtn")
  const label = document.querySelectorAll("label")

  listEditBtn.classList.add("listEditFinish")
  listEditBtn.classList.remove("listEditBtn")
  listEditBtn.textContent = "선택한 수강생 삭제"
  for (let i = 0; i < label.length; i++) {
    label[i].classList.add("clickArea")
  }
}
