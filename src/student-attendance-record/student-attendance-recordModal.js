import "./student-attendance-record.css"
import axios from "axios"

export function studentAttendanceRecordModal() {
  const studentAttendanceModal = document.querySelector(".studentAttendanceModal")
  if (studentAttendanceModal) {
    studentAttendanceModal.innerHTML = `
        <div class="studentAttendanceModalPage">
          <div>
            <table>
              <thead>
                <tr>
                  <td>날짜</td>
                  <td>출석 시간</td>
                  <td>퇴실 시간</td>
                  <td>학습 체류 시간</td>
                  <td>출석 상태</td>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
          <button class="modalClose">확인</button>
        </div>
    `
  }
  const modalCloseBtn = document.querySelector(".modalClose")
  modalCloseBtn.addEventListener("click", () => {
    closeModal()
  })
  renderTable()
  return studentAttendanceModal
}
async function renderTable() {
  const oTable = document.querySelector("table>tbody")
  try {
    const res = await axios.get("/api/attendance.json")
    const list = res.data.data

    const h = []
    list.forEach((item) => {
      h.push("<tr>")
      h.push(`<td>${item.date}</td>`)
      h.push(`<td>${item.in}</td>`)
      h.push(`<td>${item.out}</td>`)
      h.push(`<td>${item.time}</td>`)
      h.push(`<td>${item.status}</td>`)
      h.push("</tr>")
    })
    oTable.innerHTML = h.join("")
  } catch (err) {
    console.error("Error Cannot set data", err)
  }
}

const closeModal = () => {
  const studentAttendanceModal = document.querySelector(".studentAttendanceModal")
  studentAttendanceModal.classList.remove("active")
}
