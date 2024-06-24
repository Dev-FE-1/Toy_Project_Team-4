import "./attendCheck.css";
import { createAttendanceChart } from './attendChart.js';


export function loadAttendCheck() {
  const attendanceCheck = document.getElementById('attendance-Check');
  if (attendanceCheck) {
    attendanceCheck.innerHTML = `
    <section id="attendCheck">
      <h4>출결 현황 확인</h4>
        <div class="attendance-canvas">
          <div id="attendance-chart" style="width: 200px; height: 200px;">
            <canvas id="attendanceCanvas"></canvas>
            <div class="chart-center-text" id="chart1-center-text"></div>
          </div>
          <ul>
            <li><span class="green"></span>출석<li>
            <li><span class="yellow"></span>조퇴<li>
            <li><span class="red"></span>결석<li>
          </ul>
        </div>
        <div class="attendance-result">
          <div class="result">
            <p><span></span>나의 출석률</p>
            <div class="result-chart"></div>
          </div>
          <div class="result">
            <p><span></span>과정 진행률</p>
            <div class="result-chart"></div>
          </div>
        </div>
    </section>
    `
    requestAnimationFrame(() => {
      const student = {
        totalDays: 30,
        attendanceDays: 27,
        earlyLeaveDays: 2,
        absentDays: 1
      };
      
      createAttendanceChart(student); 
    });
  }
}
