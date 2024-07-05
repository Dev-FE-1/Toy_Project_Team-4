import axios from "axios"
import "./registerNotice.css"

let noticeList = []
const COUNT_PAGE = 4
let currentPage = 1
let currentNoticeId = null

export function registerNotice () {
  const app = document.getElementById("app")

  app.innerHTML =`
    <div id="registerNotice">
      <div class="title-wrap">
        <h2>공지사항</h2>
        <div class="btn-wrap">
          <a href="javascript:void(0)" class="registbtn">+ 새 공지 등록</a>
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
    <div class="regist-dimm">
      <div class="regist-modal">
        <div class="inner">
          <div class="title">
            <span class="material-symbols-outlined">arrow_back</span>
            <h2>공지글 등록</h2>
          </div>
          <form id="notice-form" style="display: block;">
            <div class="formlist">
              <label for="writer">작성자</label>
              <input type="text" id="writer" name="writer" required="">
            </div>
            <div class="formlist">
              <label for="email">이메일</label>
              <input type="text" id="email" name="email" required="">
            </div>
            <div class="formlist">
              <label for="title" class="required">제목</label>
              <input type="text" id="title" name="title" required="">
            </div>
            <div class="formlist alignTop">
              <label for="message" class="required">내용</label>
              <textarea id="message" name="message" required=""></textarea>
            </div>
            <div class="form-buttons">
              <button type="button" id="cancel-button" class="cancel-button">취소</button>
              <button type="button" id="submit-button" class="submit-button">작성</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="edit-dimm"></div>
    <div class="overlay delete-dimm"></div>
  `
  const loadingContainer = document.querySelector(".loading-container")

  getPosts(loadingContainer)
  registerModal()
}

async function getPosts (loadingContainer) {
  try {
    const res = await axios.get("api/notice.json")
    noticeList = res.data.data

    if(document.querySelector("#registerNotice .inner") !=null) {
      createPost(noticeList)
      loadingContainer.classList.add("hidden")
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

  postlist.slice(startIndex, endIndex).forEach((post) => {
    const postArea = document.createElement('div')
    postArea.classList.add('post-area')
    postArea.innerHTML = `
      <div class="p-top">
        <h4> 
          <span class="num">${post.id}</span>
          ${post.title}
        </h4>
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
  editModal()
  deletePost()
  
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

// 공지글 등록
function registerModal () {
  const registerNotice = document.getElementById("registerNotice")
  const registBtn = document.querySelector(".registbtn")
  const registerClosebtn1 = document.querySelector(".regist-modal .material-symbols-outlined")
  const registerClosebtn2 = document.querySelector(".regist-modal .cancel-button")
  const registerSubmitbtn = document.querySelector(".regist-modal .submit-button")

  registBtn.addEventListener('click', () => {
    registerNotice.classList.add("register")
    const getlocalStorage = JSON.parse(localStorage.getItem("userInfo"))
    const writerInput = document.querySelector(".regist-dimm #writer");
    const registEmail = document.querySelector(".regist-dimm #email")
    writerInput.value = getlocalStorage.userName
    registEmail.value = getlocalStorage.userEmail
    
  })
  registerClosebtn1.addEventListener('click', () => {
    registerNotice.classList.remove("register")
  })
  registerClosebtn2.addEventListener('click', () => {
    registerNotice.classList.remove("register")
  })

  registerSubmitbtn.addEventListener('click', () => {
    const getlocalStorage = JSON.parse(localStorage.getItem("userInfo"))
    const registInput = document.querySelectorAll(".regist-modal input")
    const titleInput = document.querySelector("#title");
    const registTextarea = document.querySelector(".regist-modal textarea")
    let allFilled = true;

    registInput.forEach((input) => {
      if(input.value === "" || registTextarea.value === "") {
        allFilled = false
      }
    })

    if(allFilled) {
      addNotice(noticeList.length + 1,getlocalStorage.userName, titleInput.value, registTextarea.value, getlocalStorage.userImage)
      registerNotice.classList.remove("register")
    } else {
      if (registTextarea.value === "") {
        alert('내용을 입력해주세요.')
      } else if (titleInput.value === "") {
        alert('제목을 입력해주세요.')
      }
    }
  })
}

function addNotice(id, name, title, message, img) {
  const newNotice = {
    userName: name,
    title: title,
    date: new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric'}),
    content: message,
    userImg: img,
    id : noticeList.length + 1
  }

  noticeList.unshift(newNotice)
  currentPage = 1
  createPost(noticeList)
}

// 공지글 수정
function editModal () {
  const registerNotice = document.getElementById("registerNotice")
  const editBtn = document.querySelectorAll("#registerNotice .edit")
  const editDimm = document.querySelector(".edit-dimm")

  editBtn.forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      currentNoticeId = noticeList[idx].id
      const editedNotice = noticeList.find(notice => notice.id === currentNoticeId)

      if(!editedNotice) {
        console.error("not found notice")
        return
      }

      editDimm.innerHTML = `
        <div class="regist-modal">
          <div class="inner">
            <div class="title">
              <span class="material-symbols-outlined">arrow_back</span>
              <h2>공지사항 수정</h2>
            </div>
            <form id="notice-form" style="display: block;">
              <div class="formlist">
                <label for="writer">작성자</label>
                <input type="text" id="writer" name="writer" required="" value="${editedNotice.userName}">
              </div>
              <div class="formlist">
                <label for="title" class="required">제목</label>
                <input type="text" id="title" name="title" required="" value="${editedNotice.title}">
              </div>
              <div class="formlist alignTop">
                <label for="message" class="required">내용</label>
                <textarea id="message" name="message" required="" value="${editedNotice.content}">${editedNotice.content}</textarea>
              </div>
              <div class="form-buttons">
                <button type="button" id="cancel-button" class="cancel-button edit-cancel-button">취소</button>
                <button type="button" id="submit-button" class="submit-button edit-submit-button">수정</button>
              </div>
            </form>
          </div>
        </div>
      `
      registerNotice.classList.add('edit')

      const EditUser = document.querySelector(".edit-dimm #writer")
      EditUser.setAttribute('readonly', 'true')

      const editCancelBtn = document.querySelector(".edit-dimm .cancel-button")
      const editCancelBtn2 = document.querySelector(".edit-dimm .material-symbols-outlined")
      const editSubmitBtn = document.querySelector(".edit-dimm .submit-button")

      editCancelBtn.addEventListener('click', () => {
        registerNotice.classList.remove('edit')
      })
      editCancelBtn2.addEventListener('click', () => {
        registerNotice.classList.remove('edit')
      })

      editSubmitBtn.addEventListener('click', () => {
        const titleInput = document.querySelector(".edit-dimm #title")
        const messageInput = document.querySelector(".edit-dimm #message")

        if (titleInput.value !== "" && messageInput.value !== "") {
          editedNotice.title = titleInput.value
          editedNotice.content = messageInput.value
          createPost(noticeList)
          registerNotice.classList.remove("edit")
          setTimeout(() => {
            alert("공지사항이 수정되었습니다.")
          }, 200)

          const postArea = document.querySelector(`.post-area[data-id="${editedNotice.id}"]`)
          if(postArea) {
            const postTitle = postArea.querySelector(".p-top h4")
            if (postTitle) {
              postTitle.textContent = editedNotice.title
            }
          }
          
        } else {
          alert('모든 필드를 입력해주세요.')
        }
      })
  
    })
  }) 
}

// 공지글 삭제
function deletePost () {
  const registerNotice = document.getElementById("registerNotice")
  const deleteDimm = document.querySelector(".overlay")
  const deleteBtn = document.querySelectorAll("#registerNotice .delete")

  deleteDimm.innerHTML = `
    <div class="modal">
      <p> 공지사항을 삭제하시겠습니까?</p>
      <div class="modal-wrap">
        <button id="submitModal">예</button>
        <button id="closeModal">아니오</button>
      </div>
    </div>
  `
  deleteBtn.forEach((btn, idx) => {
    btn.setAttribute('data-id', noticeList[idx].id)
    btn.addEventListener('click', (event) => {
      const button = event.currentTarget
      currentNoticeId = parseInt(button.getAttribute('data-id'))
      const deleteNotice = noticeList.find(notice => notice.id === currentNoticeId)

      if(!deleteNotice) {
        console.error("not found notice")
        return
      }
      registerNotice.classList.add("delete")

      const submitModal = document.querySelector('.delete-dimm #submitModal')
      const closeModal = document.querySelector('.delete-dimm #closeModal')
      
      submitModal.addEventListener('click', () => {
        noticeList = noticeList.filter(notice => notice.id !== currentNoticeId)
        createPost(noticeList)
        registerNotice.classList.remove("delete")
        setTimeout(() => {
          alert("공지사항이 삭제되었습니다.")
        }, 200)
      })

      closeModal.addEventListener('click', () => {
        registerNotice.classList.remove("delete")
      })
    })
      
  })
}


