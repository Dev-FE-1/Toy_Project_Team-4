import axios from "axios"

async function sendAttendanceData(type) {
  const currentDate = new Date()
  const date = currentDate.toISOString().split('T')[0]
  const time = currentDate.toTimeString().split(' ')[0]

  const data = {
    date: date,
    type: type,
    time: time
  }

  console.log("Sending request:", data);

  try {
    const response = await axios.post('/api/attendance', data)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    return null;
  } 
}

export function loadCheckInOut() {
  const toggleBtns = document.querySelectorAll("#attendance .toggle-btn")
  const overlay = document.querySelector(".overlay")
  const submitModalYesBtn = document.getElementById("submitModal")
  const closeModalNoBtn = document.getElementById("closeModal")
  const checkText = document.querySelector(".overlay .check")
  const messageElement = document.createElement("p")
  messageElement.classList.add("message")
  overlay.appendChild(messageElement)

  toggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      overlay.classList.add("active")
      messageElement.textContent = "" // 메시지 초기화

      if (btn.classList.contains("checkin")) {
        checkText.textContent = "입실"
      } else if (btn.classList.contains("checkout")) {
        checkText.textContent = "퇴실"
      }
    })
  })

  submitModalYesBtn.addEventListener("click", async () => {
    const type = checkText.textContent === "입실" ? "in" : "out"
    submitModalYesBtn.disabled = true;  // 버튼 비활성화
    const result = await sendAttendanceData(type)
    submitModalYesBtn.disabled = false;  // 버튼 다시 활성화

    if (result.status === "ok") {
      toggleBtns.forEach(btn => {
        if (btn.classList.contains("active")) {
          btn.classList.remove("active")
        }
      })

      const checkinBtn = document.querySelector(".checkin")
      const checkoutBtn = document.querySelector(".checkout")

      if (type === "in") {
        checkinBtn.classList.remove("active")
        checkoutBtn.classList.add("active")
      } else {
        checkoutBtn.classList.remove("active")
        checkinBtn.classList.add("active")
      }

      overlay.classList.remove("active")
    } else {
      messageElement.textContent = result.message || "오류가 발생했습니다."
      messageElement.style.color = "red"
    }
  })

  closeModalNoBtn.addEventListener("click", () => {
    overlay.classList.remove("active")
  })
}