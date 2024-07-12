export function updateTime() {
  const timeEl = document.querySelector(".time")
  if(!timeEl) return; //.time 존재하지 않으면 함수 종료

  const now = new Date()
  let hours = now.getHours()
  const minutes = now.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'

  hours = hours % 12
  hours = hours ? hours : 12 //0시면 12시로 변경

  const fomattedTime = `${ampm} ${hours}:${minutes.toString().padStart(2, '0')}`

  timeEl.textContent = fomattedTime
}