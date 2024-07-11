// import axios from "axios"

// async function sendAttendanceData(type) {
//   const currentDate = new Date()
//   const date = currentDate.toISOString().split('T')[0]
//   const time = currentDate.toTimeString().split(' ')[0]

//   const data = {
//     date: date,
//     type: type,
//     time: time
//   }

//   try {
//     const response = await axios.post('/api/attendance', data)
//     return response.data
//   } catch (error) {
//     console.error('Error:', error)
//     return null
//   }
// }

// export function loadCheckInOut() {
//   const toggleBtns = document.querySelectorAll("#attendance .toggle-btn")
//   const overlay = document.querySelector(".overlay")
//   const submitModalYesBtn = document.getElementById("submitModal")
//   const closeModalNoBtn = document.getElementById("closeModal")
//   const checkText = document.querySelector(".overlay .check")

//   toggleBtns.forEach(btn => {
//     btn.addEventListener("click", () => {
//       overlay.classList.add("active")

//       if (btn.classList.contains("checkin")) {
//         checkText.textContent = "입실"
//       } else if (btn.classList.contains("checkout")) {
//         checkText.textContent = "퇴실"
//       }
//     })
//   })

//   submitModalYesBtn.addEventListener("click", submitModalYesBtn._handler)
//   submitModalYesBtn._handler = async () => {
//     const type = checkText.textContent === "입실" ? "in" : "out"
//     const result = await sendAttendanceData(type)

//     if (result && result.status === "ok") {
//       toggleBtns.forEach(btn => {
//         if (btn.classList.contains("active")) {
//           btn.classList.remove("active")
//         }
//       })
//     }

//     const checkinBtn = document.querySelector(".checkin")
//     const checkoutBtn = document.querySelector(".checkout")

//     if (type === "in") {
//       checkinBtn.classList.remove("active")
//       checkoutBtn.classList.add("active")
//     } else {
//       checkoutBtn.classList.remove("active")
//       checkinBtn.classList.add("active")
//     }

//     overlay.classList.remove("active")
  
//   }
//   submitModalYesBtn.addEventListener("click", submitModalYesBtn._handler)

//   closeModalNoBtn.addEventListener("click", () => {
//     overlay.classList.remove("active")
//   })
// }

import axios from "axios"

let isRequesting = false;
let lastRequestTime = 0;
const DEBOUNCE_TIME = 1000; // 1초

async function sendAttendanceData(type) {
  const currentTime = Date.now();
  if (currentTime - lastRequestTime < DEBOUNCE_TIME) {
    console.log("Debounced request");
    return { status: "debounced", message: "요청이 너무 빠릅니다. 잠시 후 다시 시도해주세요." };
  }
  
  if (isRequesting) {
    console.log("Request already in progress");
    return { status: "error", message: "이전 요청이 처리 중입니다. 잠시 후 다시 시도해주세요." };
  }

  isRequesting = true;
  lastRequestTime = currentTime;

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
    console.log("Received response:", response.data);
    return response.data
  } catch (error) {
    console.error('Error:', error)
    if (error.response) {
      return { status: "error", message: error.response.data.message || "서버 에러가 발생했습니다." }
    } else if (error.request) {
      return { status: "error", message: "서버에 연결할 수 없습니다." }
    } else {
      return { status: "error", message: "요청을 보내는 중 오류가 발생했습니다." }
    }
  } finally {
    isRequesting = false;
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