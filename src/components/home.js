export function createHomeContent() {
  const content = document.createElement('div');
  content.id = 'content';
  content.classList.add('content');
  content.innerHTML = `
    <div class="mainhome">
      <div class="calendar">Calendar</div>
      <div class="attendance">Attendance</div>
      <div class="attendance-Check">Attendance Check</div>
    </div>
  `;
  return content;
}