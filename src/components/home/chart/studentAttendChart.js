import Chart from "chart.js/auto"

const dates = []
const today = new Date()
for (let i = 6; i >= 0; i--) {
  const currentDate = new Date(today)
  currentDate.setDate(today.getDate() - i)
  dates.push(currentDate.toISOString().substring(8, 10))
}

export function studentAttendanceRecordChart() {
  const studentAttendanceChart = document.querySelector("#attendance")
  studentAttendanceChart.innerHTML = `
      <section id="studentAttendanceRecordChart" style="height: 100%;display: flex; justify-content: center;flex-direction:column;">
        <h4 style="font-weight:500;paddign:20px30px;border-bottom:1px solid #ebeff2">출결 현황 확인</h4>
        <canvas id="homeLineChart"></canvas>
      </section>
    `
  getHomeChart()

  return studentAttendanceChart
}

// 주간 출결현황 그래프
const getHomeChart = () => {
  const lineChart = document.querySelector("#homeLineChart")
  new Chart(lineChart, {
    type: "line",
    data: {
      labels: [dates[0], dates[1], dates[2], dates[3], dates[4], dates[5], dates[6]],
      datasets: [
        {
          data: [28, 30, 29, 30, 27, 28, 30],
          label: "출석 완료",
          borderColor: "#ed234b",
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        y: {
          min: 20,
          max: 32,
        },
      },
      title: {
        display: true,
        text: "",
      },
    },
  })
}
