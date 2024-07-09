import axios from "axios"
import "./mainNotice.css"
import { loadCalendar } from "../calendar/calendar.js"
import { findClickedP } from "./notice.js"

let noticeList = []
const COUNT_PAGE = 3

export function mainNotice() {
  const calendar = document.getElementById("calendar")
  if (calendar) {
    calendar.innerHTML = `
      <section id="mainNotice">
        <div class="calendar"></div>
        <div class="noticeForm">
                <div class="text">
        <span class="material-symbols-outlined">campaign</span>
        <h4>공지사항 클릭해서 펼쳐보기</h4>
        </div>
          <ul class="noticelist"></ul>
          <div class="loading-container" id="loadingOverlay">
          <div class="loading-animation">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
          </div>
        </div>
        </div>
        <div class="runNotice">
        <a href="/notice">Show more</a>
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
              <div class="writer">
                <div class="img-wrap">
                  <img src="${postData[i].userImg}" alt="매니저 이미지" />
                </div>
                <p class="userName">${postData[i].userName}</p>
              </div>
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

  document.querySelectorAll(".post-content").forEach((item) => {
    item.addEventListener("click", () => {
      findClickedP(item)
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
