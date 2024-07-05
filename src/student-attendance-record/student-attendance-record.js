import "./student-attendance-record.css"
import Chart from "chart.js/auto"
import axios from "axios"
import { studentAttendanceRecordModal } from "./student-attendance-recordModal"

let students = []
const dates = []
const today = new Date()
for (let i = 6; i >= 0; i--) {
  const currentDate = new Date(today)
  currentDate.setDate(today.getDate() - i)
  dates.push(currentDate.toISOString().substring(5, 10))
}

export function studentAttendanceRecord() {
  const app = document.querySelector("#app")
  app.innerHTML = `
    <section id="studentAttendanceRecord">
    <h1>수강생 출결 현황</h1>
    <div class="chartArea">
    <canvas id="lineChart" ></canvas>
    </div>
    <div class="listArea">
    <div class="loading-container" id="loadingOverlay">
      <div class="loading-animation">
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
      </div>
    </div>
        <ul class="studentsListArea"></ul>
    </div>
    <div class="studentAttendanceModal"></div>
    </section>
    `
  getChart()
  studentList()
  studentAttendanceRecordModal()
  return app
}

// 주간 출결현황 그래프
const getChart = () => {
  const lineChart = document.querySelector("#lineChart")
  new Chart(lineChart, {
    type: "line",
    data: {
      labels: [dates[0], dates[1], dates[2], dates[3], dates[4], dates[5], dates[6]],
      datasets: [
        {
          data: [7, 9, 8, 9, 8, 8, 9],
          label: "출석 완료",
          borderColor: "#ed234b",
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        y: {
          min: 0,
          max: 10,
        },
      },
      title: {
        display: true,
        text: "",
      },
    },
  })
}
// 수강생 리스트 가져오기
const studentList = async () => {
  const ul = document.querySelector(".studentsListArea")
  const res = await axios.get("/api/users.json")
  const studentData = res.data.data
  const loadingContainer = document.querySelector("#loadingOverlay")
  loadingContainer.classList.add("hidden")
  function userType(element) {
    if (element.userType === "student") {
      return true
    }
  }
  students = studentData.filter(userType)

  ul.innerHTML = ""
  for (let i = 0; i < students.length; i++) {
    ul.innerHTML += `
          <li>
        <div>
          <div class="studentImage" style="background-image: url(${students[i].profileImage})"></div>
          <p>${students[i].name} </p>
        </div>
        <div>
          <button class="${students[i].id} openDetail">출결 상세 보기</button>
        </div>
      </li>
    `
  }

  const btn = document.querySelectorAll(".openDetail")
  btn.forEach((item) => {
    item.addEventListener("click", () => {
      getModal()
    })
  })
}

const getModal = () => {
  const modal = document.querySelector(".studentAttendanceModal")
  modal.classList.add("active")
}
