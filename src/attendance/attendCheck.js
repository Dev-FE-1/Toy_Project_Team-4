import "./attendCheck.css";
import { createAttendanceChart } from './attendChart.js';


export function loadAttendCheck() {
  const attendanceCheck = document.getElementById('attendance-Check');
  if (attendanceCheck) {
    attendanceCheck.innerHTML = `
    <section id="attendCheck">
      <h4>출결 현황 확인</h4>
        <div id="attendance-chart" style="width: 250px; height: 250px;">
          <canvas id="attendanceCanvas"></canvas>
        </div>
    </section>
    `
  createAttendanceChart()

  }
}
