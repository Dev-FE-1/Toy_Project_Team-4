import axios from 'axios';
import Chart from 'chart.js/auto';
import 'chartjs-plugin-datalabels'

export function createAttendanceChart(student) {
  const ctx = document.getElementById('attendanceCanvas').getContext('2d');

  // 도넛 그래프 데이터 설정
  const chartData = {
    labels: ['출석', '조퇴', '결석'],
    datasets: [{
      data: [
        // parseInt(student.attendanceDays), 
        // parseInt(student.earlyLeaveDays), 
        // parseInt(student.absentDays) 
        27, 2, 1
      ],
      backgroundColor: ['#2ED47A', '#FFB946', '#ED234B'],
    }]
  };

  // 차트 옵션 설정
  const chartOptions = {
    responsive: true,
    cutout: '80%',
    plugins: {
      legend: {
        position: 'right',
      },
    },
    tooltip: {
      enabled: false,
    },
    datalabels: {
      color: '#2ED47A',
      font: {
        size: '30'
      }
    },
    formatter: (value, ctx) => {
      let sum = ctx.dataset.data.reduce((a, b) => a + b, 0);
      let percentage = ((value * 100) / sum).toFixed(2) + "%";
      return percentage;
    },
    display: true, // 데이터 레이블 표시
    anchor: 'center', // 텍스트 위치 설정 (중앙)
    align: 'center'
  };

  new Chart(ctx, {
    type: 'doughnut',
    data: chartData,
    options: chartOptions
  });

  console.log('Chart Data:', chartData);
}
