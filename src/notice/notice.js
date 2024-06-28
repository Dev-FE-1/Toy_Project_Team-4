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
              <input
              type="search"
              class="form-control"
              style="margin-bottom: 5px"
              placeholder="원하는 키워드로 검색해보세요."
            />
        </div>
        <div class="notice-bottom">
          <ul class="post-list"></ul>
          <div class="pagination-container">
            <button class="prev-button"><</button>
            <div class="number-btn-wrapper"></div>
            <button class="next-button class">></button>
          </div>
        </div>
      </section>
  `
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

    const search = document.querySelector(".form-control")
    search.onkeydown = (e, textContent) => {
      if (e.keyCode == 13) {
        let regexp = new RegExp(textContent, "gi")
        let data = noticeList.filter(
          (item) =>
            regexp.test(item.id) ||
            regexp.test(item.date) ||
            regexp.test(item.title) ||
            regexp.test(item.content) ||
            regexp.test(item.userName)
        )
        getPost(1, data)
      }
    }

    if (document.querySelector(".post-list") != null && document.querySelector(".post-list").children.length < 3) {
      getPost(1, noticeList)
    }
  } catch (err) {
    console.error("error", err)
  }
}

// 페이지네이션 버튼 생성 및 클릭이벤트
const setPageButtons = (getTotalPageCount) => {
  const prevBtn = document.querySelector(".prev-button")
  const nextBtn = document.querySelector(".next-button")
  const numberBtnWrapper = document.querySelector(".number-btn-wrapper")
  if (numberBtnWrapper != null) {
    numberBtnWrapper.innerHTML = ""
    for (let i = 1; i <= getTotalPageCount; i++) {
      if (i === 1) {
        numberBtnWrapper.innerHTML += `<button class="btnFocus">${i}</button>`
      } else {
        numberBtnWrapper.innerHTML += `<button class="number-btn">${i}</button>`
      }
    }

    // 이벤트함수가 두번씩 실행되어 기존 이벤트 리스너 제거하고 새로운 버튼 생성함
    prevBtn.replaceWith(prevBtn.cloneNode(true))
    nextBtn.replaceWith(nextBtn.cloneNode(true))

    const newPrevBtn = document.querySelector(".prev-button")
    const newNextBtn = document.querySelector(".next-button")

    const pageNumberBtn = numberBtnWrapper.querySelectorAll("button")
    if (pageNumberBtn.length > 0) {
      pageNumberBtn.forEach((btnItem) => {
        btnItem.addEventListener("click", () => {
          getPost(btnItem.textContent, noticeList)
        })
      })
      newPrevBtn.addEventListener("click", () => {
        arrToChange("prev", pageNumberBtn)
      })
      newNextBtn.addEventListener("click", () => {
        arrToChange("next", pageNumberBtn)
      })
    }
  }
}

// 페이지 번호에 맞는 데이터 불러오기
const getPost = (pageNum, noticeList) => {
  const btnFocus = document.querySelector(".btnFocus")
  if (btnFocus != null) {
    const ul = document.querySelector(".post-list")
    const start = (pageNum - 1) * COUNT_PAGE
    const end = pageNum * COUNT_PAGE
    const postData = noticeList.slice(start, end)

    if (postData.length > 0) {
      ul.innerHTML = ""
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
              <button class="complate">Complate</button>
            </div>
          </div>
          </div>
        </li>
        `
      }
      changeBtn()
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

//페이지 번호 버튼 색상 바꾸기
const changeBtn = () => {
  const btnFocus = document.querySelector(".btnFocus")
  const nonFocusBtn = document.querySelectorAll(".number-btn")
  const numberBtnWrapper = document.querySelector(".number-btn-wrapper")
  const pageNumberBtn = numberBtnWrapper.querySelectorAll("button")
  const prevBtn = document.querySelector(".prev-button")
  const nextBtn = document.querySelector(".next-button")
  let btnNum = []
  for (let i = 0; i < pageNumberBtn.length; i++) {
    btnNum.push(pageNumberBtn[i].textContent)
  }
  let maxNum = Math.max(...btnNum)
  let minNum = Math.min(...btnNum)
  if (Number(btnFocus.textContent) == minNum) {
    nextBtn.classList.remove("color")
    prevBtn.classList.add("color")
  } else if (Number(btnFocus.textContent) == maxNum) {
    nextBtn.classList.add("color")
    prevBtn.classList.remove("color")
  }

  btnFocus.className = "number-btn"
  nonFocusBtn.forEach((nonFocusItem) => {
    nonFocusItem.className = "btnFocus"
  })
}

// 이전,이후 버튼 이벤트리스너
const arrToChange = (arrowType) => {
  const btnFocus = document.querySelector(".btnFocus")

  if (arrowType == "prev") {
    const prevNum = Number(btnFocus.textContent) - 1
    getPost(prevNum, noticeList)
  } else {
    const nextNum = Number(btnFocus.textContent) + 1
    getPost(nextNum, noticeList)
  }
}
