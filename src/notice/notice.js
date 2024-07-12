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
          <div>
              <input
              type="search"
              class="form-control"
              placeholder="원하는 키워드로 검색해보세요."
            />
            <img src="/public/images/notice.svg" alt="공지사항 아이콘">
          </div>
        </div>
        <div class="notice-bottom">
        <div class="text">
        <span class="material-symbols-outlined">campaign</span>
        <h4>공지사항 클릭해서 펼쳐보기</h4>
        </div>
        <ul class="post-list"></ul>
        <div class="loading-container" id="loadingOverlay">
          <div class="loading-animation">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
          </div>
        </div>
        </div>
        <div class="pagination-container">
          <button class="prev-button"><</button>
          <div class="number-btn-wrapper"></div>
          <button class="next-button class">></button>
        </div>
      </section>
  `
  getNoticeList()
  const prevBtn = document.querySelector(".prev-button")
  const nextBtn = document.querySelector(".next-button")
  prevBtn.addEventListener("click", () => {
    arrToChange("prev")
  })
  nextBtn.addEventListener("click", () => {
    arrToChange("next")
  })
  const search = document.querySelector(".form-control")
  search.addEventListener("keydown", (e) => {
    if (e.keyCode == 13) {
      doSearch(e)
    }
  })
  return app
}

// notice.json 데이터 가져오기
async function getNoticeList() {
  try {
    const res = await axios.get("/api/notice.json")
    noticeList = res.data.data
    setPageButtons()
    getPost(1)
    arrBtn()
  } catch (err) {
    console.error("error", err)
  }
}

// 페이지네이션 버튼 생성 및 클릭이벤트
const setPageButtons = () => {
  const getTotalPageCount = noticeList.length / COUNT_PAGE

  const numberBtnWrapper = document.querySelector(".number-btn-wrapper")
  if (numberBtnWrapper != null) {
    numberBtnWrapper.innerHTML = ""
    for (let i = 0; i < getTotalPageCount; i++) {
      if (i === 0) {
        numberBtnWrapper.innerHTML += `<button class="pagebtn btnFocus">${i + 1}</button>`
      } else {
        numberBtnWrapper.innerHTML += `<button class="pagebtn number-btn">${i + 1}</button>`
      }
    }
    const btnFocus = document.querySelector(".btnFocus")
    btnFocus.addEventListener("click", function () {
      getPost(btnFocus.textContent)
      changeBtn(btnFocus.textContent)
      arrBtn()
    })

    const numberBtn = document.querySelectorAll(".number-btn")
    if (numberBtn.length > 0) {
      numberBtn.forEach((btnItem) => {
        btnItem.addEventListener("click", function () {
          getPost(btnItem.textContent)
          changeBtn(btnItem.textContent)
          arrBtn()
        })
      })
    }
  }
}

// 페이지 번호에 맞는 데이터 불러오기
const getPost = (pageNum) => {
  const start = (pageNum - 1) * COUNT_PAGE
  const end = pageNum * COUNT_PAGE
  const postData = noticeList.slice(start, end)
  if (postData.length > 0) {
    setPost(postData)
  }
}

// Complete버튼 누를때 text, color 바꾸기
function completeBtnChange(completeBtn) {
  if (completeBtn.textContent === "Complete") {
    completeBtn.textContent = "Not Complete"
    completeBtn.setAttribute("style", "background-color:#2ed47a")
  } else if (completeBtn.textContent === "Not Complete") {
    completeBtn.textContent = "Complete"
    completeBtn.setAttribute("style", "background-color:#ed234b")
  }
}

//페이지 번호 버튼 색상 바꾸기
const changeBtn = (clickBtnNum) => {
  const btnFocus = document.querySelector(".btnFocus")
  const nonFocusBtn = document.querySelectorAll(".number-btn")
  let findFocusBtn = []
  nonFocusBtn.forEach((item) => {
    findFocusBtn.push(item.textContent)
  })
  for (let i = 0; i < findFocusBtn.length; i++) {
    if (String(clickBtnNum) === findFocusBtn[i]) {
      btnFocus.className = "pagebtn number-btn"
      nonFocusBtn.forEach((nonFocusItem) => {
        if (nonFocusItem.textContent === findFocusBtn[i]) {
          nonFocusItem.className = "pagebtn btnFocus"
        }
      })
    }
  }
}

// 이전,이후 버튼 이벤트리스너
const arrToChange = (arrowType) => {
  const btnFocus = document.querySelector(".btnFocus")

  if (arrowType == "prev") {
    const prevNum = Number(btnFocus.textContent) - 1
    getPost(prevNum)
    changeBtn(prevNum)
  } else {
    const nextNum = Number(btnFocus.textContent) + 1
    getPost(nextNum)
    changeBtn(nextNum)
  }
  arrBtn()
}

// 페이지 번호 버튼에 맞게 이전,이후 버튼 스타일 수정
const arrBtn = () => {
  const prevBtn = document.querySelector(".prev-button")
  const nextBtn = document.querySelector(".next-button")
  const btnFocus = document.querySelector(".btnFocus")
  const pageNumberBtn = document.querySelectorAll(".pagebtn")
  let btnNum = []
  for (let i = 0; i < pageNumberBtn.length; i++) {
    btnNum.push(pageNumberBtn[i].textContent)
  }
  let maxNum = Math.max(...btnNum)
  let minNum = Math.min(...btnNum)
  if (Number(btnFocus.textContent) == minNum) {
    nextBtn.classList.add("color")
    prevBtn.classList.remove("color")
  } else if (Number(btnFocus.textContent) == maxNum) {
    nextBtn.classList.remove("color")
    prevBtn.classList.add("color")
  } else {
    nextBtn.classList.add("color")
    prevBtn.classList.add("color")
  }
}

// 검색 필터
function doSearch() {
  const searchValue = document.querySelector(".form-control").value
  let regexp = new RegExp(searchValue, "gi")
  let data = noticeList.filter(
    (item) =>
      regexp.test(item.id) ||
      regexp.test(item.date) ||
      regexp.test(item.title) ||
      regexp.test(item.content) ||
      regexp.test(item.userName)
  )
  if (data.length > 0) {
    setPost(data)
  }
}

// 공지사항 목록 생성
const setPost = (postData) => {
  const ul = document.querySelector(".post-list")
  const loadingContainer = document.querySelector("#loadingOverlay")
  loadingContainer.classList.add("hidden")
  ul.innerHTML = ""
  for (let i = 0; i < postData.length; i++) {
    if (i < COUNT_PAGE) {
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
                <div class="writer">
                  <div class="img-wrap">
                    <img src="${postData[i].userImg}" alt="매니저 이미지" />
                  </div>
                  <p class="userName">${postData[i].userName}</p>
                </div>
                <button class="complete">Complete</button>
              </div>
            </div>
            </div>
          </li>
          `
    }
  }
  const completeBtns = document.querySelectorAll(".complete")
  completeBtns.forEach((completeBtn) => {
    completeBtn.addEventListener("click", () => {
      completeBtnChange(completeBtn)
    })
  })

  document.querySelectorAll(".post-content").forEach((item) => {
    item.addEventListener("click", () => {
      findClickedP(item)
    })
  })
}

// 공지사항 열고 닫기
export const findClickedP = (item) => {
  if (item.classList.length < 2) {
    item.classList.add("changeDisplay")
  } else {
    item.classList.remove("changeDisplay")
  }
}
