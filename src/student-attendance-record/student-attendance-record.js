import "./student-attendance-record.css"
import Chart from "chart.js/auto"
import axios from "axios"

export function studentAttendanceRecord() {
  const app = document.querySelector("#app")
  app.innerHTML = `
    <section id="profile-section">
      <canvas id="line-chart" width="800" height="450"></canvas>
    </section>
    `
  getChart()
  return app
}
const getChart = () => {
  const cccc = document.querySelector("#line-chart").getContext("2d")
  const chart = new Chart(cccc, {
    type: "line",
    data: {
      labels: [1500, 1600, 1700, 1750, 1800, 1850, 1900, 1950, 1999, 2050],
      datasets: [
        {
          data: [282, 350, 411, 502, 635, 809, 947, 1402, 3700, 3000],
          label: "Asia",
          borderColor: "#8e5ea2",
          fill: false,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "수강생 주간 출결 현황",
      },
    },
  })
}
