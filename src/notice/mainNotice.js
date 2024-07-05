import axios from "axios"
import "./mainNotice.css"
import { loadCalendar } from "../calendar/calendar.js"

let noticeList = []
const COUNT_PAGE = 3

export function mainNotice() {
  const calendar = document.getElementById("calendar")
  if (calendar) {
    calendar.innerHTML = `
      <section id="mainNotice">
        <div class="calendar"></div>
        <div class="noticeForm">
          <ul class="noticelist"></ul>
          <div class="loading-container" id="loadingOverlay">
          <div class="loading-animation">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
          </div>
        </div>
          <div class="runNotice">
          <a href="/notice">Show more</a>
          </div>
        </div>
      </section>
    `
    getNoticeList()
    loadCalendar()
    return calendar
  }
}
async function getNoticeList() {
  try {
    const res = await axios.get("/api/notice.json")
    noticeList = res.data.data
    // const getTotalPageCount = Math.ceil(noticeList.length / COUNT_PAGE)
    // setPageButtons(getTotalPageCount)
    if (document.querySelector(".noticelist") != null && document.querySelector(".noticelist").children.length < 3) {
      getPost(1, noticeList)
    }
  } catch (err) {
    console.error("error", err)
  }
}

const getPost = (pageNum, noticeList) => {
  const ul = document.querySelector(".noticelist")
  const start = (pageNum - 1) * COUNT_PAGE
  const end = pageNum * COUNT_PAGE
  const postData = noticeList.slice(start, end)

  if (postData.length > 0) {
    const loadingContainer = document.querySelector("#loadingOverlay")
    loadingContainer.classList.add("hidden")
    ul.innerHTML = ""
    for (let i = 0; i < postData.length; i++) {
      ul.innerHTML += `
        <li>
          <div class="post">
            <div class="post-top">
              <p class="post-title">${postData[i].title}</p>
              <p class="post-date">${postData[i].date}</p>
            </div>
            <div class="post-mid">
              <p class="post-content">${postData[i].content}</p>
            </div>
            <div class="post-bottom">
              <p class="userName"><span class="material-symbols-outlined">account_circle</span>${postData[i].userName}</p>
              <button class="Complete">Complete</button>
            </div>
          </div>
        </li>
        `
    }
  }
  const CompleteBtns = document.querySelectorAll(".Complete")
  CompleteBtns.forEach((CompleteBtn) => {
    CompleteBtn.addEventListener("click", () => {
      CompleteBtnChange(CompleteBtn)
    })
  })
}
// Complete버튼 누를때 text, color 바꾸기
function CompleteBtnChange(CompleteBtn) {
  if (CompleteBtn.textContent === "Complete") {
    CompleteBtn.textContent = "Not Complete"
    CompleteBtn.setAttribute("style", "background-color:#2ed47a")
  } else if (CompleteBtn.textContent === "Not Complete") {
    CompleteBtn.textContent = "Complete"
    CompleteBtn.setAttribute("style", "background-color:#ed234b")
  }
}
