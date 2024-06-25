import "./attendRecord.css";
import { loadCheckInOut } from './checkInOut.js';
import { updateTime } from './updateTime.js';


export function loadAttendRecord() {
  const attendance = document.querySelector('#attendance');
  if (attendance) {
    attendance.innerHTML = `
    <h4>입퇴실 기록</h4>
          <p><span></span>현재 시각</p>
    <div class="info">

      <div class="inner">
        <div class="time"></div>
        <div class="btn-wrap">
          <a href="javascript:void(0)" class="toggle-btn checkin active">입실하기</a>
          <a href="javascript:void(0)" class="toggle-btn checkout">퇴실하기</a>
        </div>
      </div>
    </div>
  `
  requestAnimationFrame(() => {
    loadCheckInOut()
    updateTime()
  });
  }
}
