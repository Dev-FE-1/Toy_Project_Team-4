import axios from "axios"
import "./registerNotice.css"

let noticeList = []
const COUNT_PAGE = 4
let currentPage = 1

export function registerNotice () {
  const app = document.getElementById("app")

  app.innerHTML =`
    <div id="registerNotice">
      <div class="title-wrap">
        <h2>공지사항</h2>
        <div class="btn-wrap">
          <a href="./" class="btn">+ 새 공지 등록</a>
        </div>
      </div>
      <div class="inner"></div>
      <div id="pagination" class="pagination"></div>
      <div class="loading-container" id="loadingOverlay">
          <div class="loading-animation">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
        </div>
      </div>
    </div>
  `
  getPosts()
}

async function getPosts () {
  try {
    const res = await axios.get("api/notice.json")
    noticeList = res.data.data

    if(document.querySelector("#registerNotice .inner") !=null) {
      createPost(noticeList)
    }
  } catch (err) {
    console.error("error", err)
  }
}

const createPost = (postlist) => {
  const notices = document.querySelector("#registerNotice .inner")
  notices.innerHTML = ''
  const startIndex = (currentPage - 1) * COUNT_PAGE
  const endIndex = Math.min(startIndex + COUNT_PAGE, postlist.length)

  postlist.slice().reverse().slice(startIndex, endIndex).forEach((post) => {
    const postArea = document.createElement('div')
    postArea.classList.add('post-area')
    postArea.innerHTML = `
      <div class="p-top">
        <h4>${post.title}</h4>
        <p>작성일: <span class="wDate">${post.date}</span></p>
      </div>
      <div class="p-middle">${post.content}</div>
      <div class="p-bottom">
        <div class="writer">
          <div class="img-wrap">
            <img src="${post.userImg}" alt="매니저 이미지" />
          </div>
          <span>${post.userName}</span>
        </div>
        <div class="btn-wrap">
          <a href="javascript:void(0)" class="edit"><span class="material-symbols-outlined">edit</span></a>
          <a href="javascript:void(0)" class="delete"><span class="material-symbols-outlined">delete</span></a>
        </div>
      </div>
    `
    notices.appendChild(postArea)
  })
  noticePagination(postlist.length)
}

function noticePagination(totalItems) {
  const totalPages = Math.ceil(totalItems / COUNT_PAGE)
  const pagination = document.getElementById('pagination')
  pagination.innerHTML = ''

  // 페이지 버튼 생성 함수
  const createPageButton = (page) => {
    const button = document.createElement('button');
    button.textContent = page;
    button.classList.add('page-button')
    if (page === currentPage) {
      button.classList.add('active')
    }
    button.addEventListener('click', () => {
      currentPage = page;
      createPost(noticeList)
    })
    return button
  }

  pagination.appendChild(pageArrow('left', currentPage === 1))

  for (let i = 1; i <= totalPages; i++) {
    pagination.appendChild(createPageButton(i))
  }

  pagination.appendChild(pageArrow('right', currentPage === totalPages))
}

function pageArrow(direction, disabled) {
  const arrow = document.createElement('button')
  arrow.textContent = direction === 'left' ? '<' : '>'
  arrow.classList.add('page-arrow')
  if (disabled) {
    arrow.classList.add('disabled')
  } else {
    arrow.addEventListener('click', () => {
      currentPage = direction === 'left' ? currentPage - 1 : currentPage + 1
      createPost(noticeList)
    })
  }
  return arrow
}