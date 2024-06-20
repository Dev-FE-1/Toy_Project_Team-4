import { loadAttendRecord } from '../attendance/attendRecord.js';
import { loadAttendCheck } from '../attendance/attendCheck.js';
import { loadOverlay } from '../attendance/overlay.js';

export function createHomeContent() {
  const content = document.createElement('div');
  content.id = 'content';
  content.classList.add('content');
  content.innerHTML = `
    <div class="mainhome">
      <div class="calendar">Calendar</div>
      <div id="attendance"></div>
      <div id="attendance-Check"></div>
      <div class="overlay"></div>
    </div>
  `;

  document.addEventListener("DOMContentLoaded", () => {
    loadAttendRecord()
    loadAttendCheck()
    loadOverlay()
  })
  return content;
}