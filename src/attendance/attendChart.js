import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const currentDate = new Date();
const currentMonth = currentDate.getMonth(); // 현재 월 (0부터 시작)
const currentYear = currentDate.getFullYear(); // 현재 연도
const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate(); // 현재 월의 총 일수

export function createAttendanceChart(student) {
  const ctx = document.getElementById('attendanceCanvas').getContext('2d');
  
  // 출석 데이터 계산 및 텍스트로 표시할 값 설정
  const attendancePercentage = Math.round((parseInt(student.attendanceDays) / totalDays) * 100);
  document.getElementById('chart1-center-text').textContent = `${attendancePercentage}%`;

  // 도넛 그래프 데이터 설정
  const chartData = {
    // labels: ['출석', '조퇴', '결석'],
    datasets: [{
      data: [
        parseInt(student.attendanceDays), 
        parseInt(student.earlyLeaveDays), 
        parseInt(student.absentDays) 
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
      tooltip: {
        enabled: false,
      }
    }
  };

  new Chart(ctx, {
    type: 'doughnut',
    data: chartData,
    options: chartOptions,
    //plugins: [ChartDataLabels] // 플러그인 추가
  });
}
