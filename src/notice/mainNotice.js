import axios from "axios"
import "./mainNotice.css"

let noticeList = []
const COUNT_PAGE = 3

export function mainNotice() {
  const calendar = document.querySelector(".calendar")
  if (calendar) {
    calendar.innerHTML = `
      <section id="mainNotice">
        <div class="calendar">
        </div>
        <div class="noticeForm">
          <ul class="noticelist"></ul>
          <div class="runNotice">
          <a href="/notice">Show more</a>
          </div>
        </div>
      </section>
    `
    getNoticeList()
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
              <p class="userName">${postData[i].userName}</p>
              <button class="complate">Complate</button>
            </div>
          </div>
        </li>
        `
    }
  }
  const complateBtns = document.querySelectorAll(".complate")
  complateBtns.forEach((complateBtn) => {
    complateBtn.addEventListener("click", () => {
      complateBtnChange(complateBtn)
    })
  })
}
// Complate버튼 누를때 text, color 바꾸기
function complateBtnChange(complateBtn) {
  if (complateBtn.textContent === "Complate") {
    complateBtn.textContent = "Not Complate"
    complateBtn.setAttribute("style", "background-color:#2ed47a")
  } else if (complateBtn.textContent === "Not Complate") {
    complateBtn.textContent = "Complate"
    complateBtn.setAttribute("style", "background-color:#ed234b")
  }
}
