import axios from "axios"
import "./notice.css"

let noticeList = []
const COUNT_PAGE = 3

export function loadNotice() {
  const app = document.getElementById("app")

  app.innerHTML = `
      <section id="notice-section">
        <div class="notice-top">
          <h1>공지사항</h1>
        </div>
        <div class="notice-bottom">
          <ul class="post-list"></ul>
          <div class="pagination-container">
            <div class="prev-button"><</div>
            <div class="number-btn-wrapper"></div>
            <div class="next-button">></div>
          </div>
        </div>
      </section>
  `

  setPageButtons()
  getNoticeList()
  return app
}

// notice.json 데이터 가져오기
async function getNoticeList() {
  try {
    const res = await axios.get("/api/notice.json")
    noticeList = res.data.data
    const getTotalPageCount = Math.ceil(noticeList.length / COUNT_PAGE)
    setPageButtons(getTotalPageCount)
    if (document.querySelector(".post-list") != null && document.querySelector(".post-list").children.length < 3) {
      getPost(1, noticeList)
    }
  } catch (err) {
    console.error("error", err)
  }
}

// 페이지네이션 버튼 생성 및 클릭이벤트
const setPageButtons = (getTotalPageCount) => {
  const numberBtnWrapper = document.querySelector(".number-btn-wrapper")
  if (numberBtnWrapper != null) {
    numberBtnWrapper.innerHTML = ""
    for (let i = 1; i <= getTotalPageCount; i++) {
      numberBtnWrapper.innerHTML += `<span class="number-btn">${i}</span>`
    }

    const pageNumberBtn = document.querySelectorAll(".number-btn")
    pageNumberBtn.forEach((btnItem) => {
      btnItem.addEventListener("click", () => {
        getPost(btnItem.textContent, noticeList)
      })
    })
  }
}

// 페이지 번호에 맞는 데이터 불러오기
const getPost = (pageNum, noticeList) => {
  if (document.querySelector(".number-btn") != null) {
    const ul = document.querySelector(".post-list")
    ul.innerHTML = ""
    const start = (pageNum - 1) * COUNT_PAGE
    const end = pageNum * COUNT_PAGE
    const postData = noticeList.slice(start, end)
    for (let i = 0; i < postData.length; i++) {
      ul.innerHTML += `
              <li>
            <div class="post-container">
              <p class="post-number">${postData[i].id}</p>
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
                  <button class="complate">complete</button>
                </div>
              </div>
            </div>
          </li>
  `
    }
  }
}
