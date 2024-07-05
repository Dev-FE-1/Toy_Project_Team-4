import Chart from "chart.js/auto"

const dates = []
const today = new Date()
for (let i = 6; i >= 0; i--) {
  const currentDate = new Date(today)
  currentDate.setDate(today.getDate() - i)
  dates.push(currentDate.toISOString().substring(8, 10))
}

export function studentAttendanceRecordChart() {
  const attendance = document.querySelector("#attendance")
  attendance.innerHTML = `
      <section id="studentAttendanceRecordChart" style="display: flex; justify-content: center;flex-direction:column;">
      <h4 style="font-weight:500;paddign:20px30px;border-bottom:1px solid #ebeff2">출결 현황 확인</h4>
    <canvas id="lineChart"></canvas>
  </section>
    `
  getChart()

  return attendance
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
