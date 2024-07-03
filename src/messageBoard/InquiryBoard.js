import './InquiryBoard.css';
import axios from 'axios';
// import { showLoading } from '../../loading-animation/loading-animation.js';


let inquiries = [];
const itemsPerPage = 5; //한 페이지에 5개씩 표시
let currentPage = 1;
let currentAction = ''; // action 값을 저장할 전역 변수 추가
let currentInquiryId = null; // 현재 수정 또는 삭제하려는 게시물의 ID
let currentUser = null; // 현재 사용자 정보를 저장할 변수 추가

document.addEventListener('DOMContentLoaded', async () => {
  loadInquiryBoard();
});


export function loadInquiryBoard() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="borad">
      <div class="inquiry-board">
        <div class="header-section">
          <h1>문의 게시판</h1>
          <button id="write-button">글쓰기</button>
        </div>
        <form id="inquiry-form">
          <h1>문의 게시판</h1>
          <div id="formlist" class="formlist">
            <label for="title">제목:</label>
            <input type="text" id="title" name="title" required>
            <br>
            <label for="message">문의 내용:</label>
            <textarea id="message" name="message" required></textarea>
            <br>
            <div class="form-buttons">
              <button type="button" id="cancel-button" class="cancel-button">취소</button>
              <button type="button" id="submit-button" class="submit-button">작성</button>
            </div>
          </div>
        </form>
        <ul id="inquiry-list">
          <li class="inquiry-title">
            <div><strong>글번호</strong></div>
            <div class="title"><strong>제목</strong></div>
            <div><strong>작성자</strong></div>
            <div><strong>작성일</strong></div>
          </li>
        </ul>
        <div id="pagination" class="pagination"></div>
        <div id="inquirymodal" class="inquirymodal">
          <div class="inquirymodal-content">
            <div id="inquirymodal-body"></div>
            <div id="modal-buttons-container" class="modal-buttons-container"> 
              <div id="listbutton" class="listbutton">
                <button id="modal-list-button">목록</button>
              </div>
              <div id="deletebutton" class="deletebutton">
                <button id="modal-modify-button">수정</button>
                <button id="modal-delete-button">삭제</button>
              </div>
            </div>
            <div id="comments-section" class="comments-section">
            <ul id="comments-list" class="comments-list"></ul>
          </div>
        </div>
        <div id="password-modal" class="password-modal">
          <div class="password-modal-content">
            <span class="close-password-modal" id="close-password-modal">&times;</span>
            <p id="password-modal-message"></p>
            <input type="password" id="password-input" placeholder="비밀번호를 입력하세요">
            <button id="confirm-password-button">확인</button>
          </div>
        </div>
      </div>
      <div class="loading-container" id="loadingOverlay">
          <div class="loading-animation">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
          </div>
        </div>
    </div>
  `;
  // 글쓰기, 취소, 작성 이벤트리스너
  document.getElementById('write-button').addEventListener('click', async () => {
    await loadCurrentUser(); // 현재 사용자 정보를 로드합니다.
    toggleForm(true);
  });
  document.getElementById('cancel-button').addEventListener('click', () => toggleForm(false));
  document.getElementById('submit-button').addEventListener('click', handleSubmit);
  // 글 내용 목록, 수정, 삭제 이벤트리스너
  document.getElementById('modal-list-button').addEventListener('click', () => toggleModal(false));
  document.getElementById('modal-modify-button').addEventListener('click', () => showPasswordModal('modify'));
  document.getElementById('modal-delete-button').addEventListener('click', () => showPasswordModal('delete'));
  // 수정 삭제 모달창 이벤트리스너
  document.getElementById('close-password-modal').addEventListener('click', () => togglePasswordModal(false));
  document.getElementById('confirm-password-button').addEventListener('click', handlePasswordConfirmation);

  // 비밀번호 입력 필드에서 Enter 키를 눌렀을 때 비밀번호 확인 로직 실행
  document.getElementById('password-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handlePasswordConfirmation();
    }
  });
  
  loadInquiries();
}

// 현재 사용자 정보를 로드하는 함수
async function loadCurrentUser() {
  try {
    // 로컬 스토리지에서 사용자 정보 가져오기
    const getuserInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!getuserInfo || !getuserInfo.userEmail) {
      console.error("User info not found in localStorage");
      alert("로그인 정보가 없습니다. 다시 로그인 해주세요.");
      window.location.href = '/login'; // 로그인 페이지로 리디렉션
      return;
    }

    // users.json에서 프로필 사진과 이름 가져오기
    const res = await axios.get("/api/users.json");
    const users = res.data.data;

    const user = users.find(user => user.email === getuserInfo.userEmail);

    if (user) {
      currentUser = user;
    } else {
      console.error("User not found in users.json");
      alert("사용자 정보를 찾을 수 없습니다.");
    }
  } catch (error) {
    console.error("Error fetching users data", error);
    alert("사용자 정보를 불러오는 중 오류가 발생했습니다.");
  }
}

// inquiry.json 데이터 가져오기
async function loadInquiries() {
  const loadingContainer = document.querySelector(".loading-container");
  if (!loadingContainer) {
    console.error("Loading container not found");
    return;
  }
  loadingContainer.classList.remove("hidden");
  try {
    const res = await axios.get("/api/inquiry.json");
    inquiries = res.data.data;
    displayInquiries();
  } catch (err) {
    console.error("error", err);
  } finally {
    loadingContainer.classList.add("hidden");
  }
}
// 글 목록 불러오기
function displayInquiries() {
  const inquiryList = document.getElementById('inquiry-list');
  inquiryList.innerHTML = `
    <li class="inquiry-title">
      <div><strong>글번호</strong></div>
      <div class="title"><strong>제목</strong></div>
      <div><strong>작성자</strong></div>
      <div><strong>작성일</strong></div>
    </li>
  `;

  const sortedInquiries = [...inquiries].reverse(); // 배열을 역순으로 정렬
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedInquiries.length);

  for (let i = startIndex; i < endIndex; i++) {
    const inquiry = sortedInquiries[i];
    const commentCount = inquiry.comments ? inquiry.comments.length : 0;
    const listItem = document.createElement('li');
    listItem.classList.add('inquirylist');
    listItem.innerHTML = `
      <div>${inquiry.id}</div>
      <div class="title">${inquiry.title}
        <div class="comment-count">
          <img src="/images/iconComment.svg" class="img" alt="댓글">
          <span>${commentCount}</span>
        </div>
      </div>
      <div class="userprofile"><img src="${inquiry.profileImage}" alt="Profile Image" class="profile-image">${inquiry.name}</div>
      <div>${inquiry.date}</div>
    `;
    listItem.addEventListener('click', () => {
      currentInquiryId = inquiry.id; // 현재 게시물 ID 저장
      toggleModal(true, inquiry);
    });
    inquiryList.appendChild(listItem);
  }

  displayPagination(inquiries.length);
}

function displayPagination(totalItems) {
  const pagination = document.getElementById('pagination');
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  pagination.innerHTML = '';

  // 화살표 페이지네이션 컴포넌트
  const createArrow = (direction, disabled) => {
    const arrow = document.createElement('button');
    arrow.textContent = direction === 'left' ? '<' : '>';
    arrow.classList.add('page-arrow');
    if (disabled) {
      arrow.classList.add('disabled');
    } else {
      arrow.addEventListener('click', () => {
        currentPage = direction === 'left' ? currentPage - 1 : currentPage + 1;
        loadInquiries();
      });
    }
    return arrow;
  };

  pagination.appendChild(createArrow('left', currentPage === 1));

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.classList.add('page-button');
    if (i === currentPage) {
      pageButton.classList.add('active');
    }
    pageButton.addEventListener('click', () => {
      currentPage = i;
      displayInquiries();
    });
    pagination.appendChild(pageButton);
  }

  pagination.appendChild(createArrow('right', currentPage === totalPages));
}

// 글쓰기 폼
function toggleForm(show) {
  const form = document.getElementById('inquiry-form');
  const inquiryList = document.getElementById('inquiry-list');
  const pagination = document.getElementById('pagination');

  form.style.display = show ? 'block' : 'none';
  inquiryList.style.display = show ? 'none' : 'block';
  pagination.style.display = show ? 'none' : 'flex';
}

// 글쓰기 작성
async function handleSubmit(e) {
  e.preventDefault();
  const titleElement = document.getElementById('title');
  const messageElement = document.getElementById('message');

  if (!titleElement || !messageElement) {
    console.error("Form elements not found");
    return;
  }

  const title = titleElement.value.trim();
  const message = messageElement.value.trim();
  
  if (title === '' || message === '') {
    alert('모든 필드를 채워주세요.');
    return;
  }

  if (!currentUser) {
    alert("로그인 정보가 없습니다. 다시 로그인 해주세요.");
    window.location.href = '/login'; // 로그인 페이지로 리디렉션
    return;
  }

  try {
    addInquiry(currentUser.name, title, message, currentUser);
    toggleForm(false); // 작성 후 폼 숨기기
  } catch (error) {
    console.error("Error adding inquiry", error);
    alert("문의 작성 중 오류가 발생했습니다.");
  }
}

// 글 추가
function addInquiry(name, title, message, userInfo) {
  const newInquiry = {
    id: inquiries.length + 1,
    title: title,
    name: name,
    date: new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' }),
    message: message,
    comments: [],
    profileImage: userInfo ? userInfo.profileImage : '', // 사용자 프로필 이미지
  };

  inquiries.push(newInquiry);
  displayInquiries();
}
//글 내용 보기
function toggleModal(show = true, inquiry = null) {
  const modal = document.getElementById('inquirymodal');
  const modalBody = document.getElementById('inquirymodal-body');

  if (!modal || !modalBody) {
    console.error('Modal elements not found');
    return;
  }

  if (show && inquiry) {
    currentInquiryId = inquiry.id; // 현재 게시물 ID 설정
    modalBody.innerHTML = `
      <h2>${inquiry.title}</h2>
      <div class="inquiry-details">
        <div class="inquiry-name">
          <img src="${inquiry.profileImage}" alt="Profile Image" class="profile-image">${inquiry.name}</div>
        <div class="inquiry-date"><span>${inquiry.date}</span></div>
      </div>
      <div class="inquiry-message"><span>${inquiry.message}</span></div>
    `;

    // 댓글 데이터를 사용하여 댓글 목록을 생성합니다.
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';
    const comments = inquiry.comments || [];

    if (comments.length === 0) {
      commentsList.innerHTML = '<p>아직 댓글이 없습니다.</p>';
    } else {
      // 여러 댓글을 처리하기 위해 배열로 가정
      // const comments = Array.isArray(inquiry.comments) ? inquiry.comments : [{ comment, "comment data": commentDate, "manager profile": managerprofile, "manager name": managerName }];
      const commentCount = comments.length;

      const commentHeader = document.createElement('div');
      commentHeader.classList.add('comment-header');
      commentHeader.innerHTML = `<img src="/images/iconComment.svg" class="img" alt="댓글"><span>댓글 ${commentCount}</span>`;
      commentsList.appendChild(commentHeader);

      comments.forEach(commentData => {
        const { comment, "comment data": commentDate, "manager profile": managerprofile, "manager name": managerName } = commentData;

        const commentDetail = document.createElement('div');
        commentDetail.innerHTML = `
          <div class="comment-detail">
            <div class="comment-name">
            <img src="${managerprofile}" alt="manager profile" class="manager-profile">${managerName}</div>
            <div class="comment-date"><span>${commentDate}</span></div>
          </div>
          <div class="comment-message"><span>${comment}</span></div>
        `;
        commentsList.appendChild(commentDetail);
      });
    }
  }
  modal.style.display = show ? 'block' : 'none';
}
// 글 내용에 있는 수정, 삭제 버튼 누를시 비밀번호 입력창
function showPasswordModal(action) {
  currentAction = action; // 전역 변수에 action 값 설정
  const passwordModal = document.getElementById('password-modal');
  const passwordModalMessage = document.getElementById('password-modal-message');

  if (action === 'modify') {
    passwordModalMessage.textContent = '수정하시겠습니까?';
  } else if (action === 'delete') {
    passwordModalMessage.textContent = '삭제하시겠습니까?';
  }

  passwordModal.style.display = 'block';
}

function togglePasswordModal(show) {
  const passwordModal = document.getElementById('password-modal');
  passwordModal.style.display = show ? 'block' : 'none';
  // 모달을 닫을 때 입력 필드를 비웁니다.
  if (!show) {
    document.getElementById('password-input').value = '';
  }
}

// 비밀번호 확인 로직
function handlePasswordConfirmation() {
  const passwordInputElement = document.getElementById('password-input');
  const passwordInput = passwordInputElement.value;

  if (passwordInput === '1234') {
    if (currentAction === 'modify') {
      togglePasswordModal(false);
      modifyContents();
    } else if (currentAction === 'delete') {
      setTimeout(() => {
        alert('게시물이 삭제되었습니다');
        togglePasswordModal(false);
        toggleModal(false);
      }, 1000);
    }
  } else if (passwordInput === '') {
    alert('비밀번호를 입력하세요!');
  } else {
    alert('비밀번호가 틀렸습니다');
  }
  passwordInputElement.value = ''; // 입력 필드를 비웁니다.
}

// 게시물 수정 로직
function modifyContents() {
  const modalBody = document.getElementById('inquirymodal-body');
  const modalButtonsContainer = document.getElementById('modal-buttons-container');
  const commentsSection = document.getElementById('comments-section');
  const inquiry = inquiries.find(inquiry => inquiry.id === currentInquiryId); // 현재 게시물 찾기

  if (!inquiry) {
    console.error('Inquiry not found');
    return;
  }

  // 기존 버튼 컨테이너와 댓글 섹션 숨기기
  modalButtonsContainer.style.display = 'none';
  commentsSection.style.display = 'none';

  modalBody.innerHTML = `
    <div id="modify-form">
      <label for="modify-title">제목:</label>
      <input type="text" id="modify-title" name="title" required value="${inquiry.title}">
      <br>
      <label for="modify-message">내용:</label>
      <textarea id="modify-message" name="message" required>${inquiry.message}</textarea>
      <br>
      <div class="form-buttons">
        <button type="button" id="cancel-modify-button" class="cancel-button">취소</button>
        <button type="button" id="submit-modify-button" class="submit-button">수정</button>
      </div>
    </div>
  `;

  document.getElementById('cancel-modify-button').addEventListener('click', () => {
    toggleModal(true, inquiry); // 글 내용을 다시 표시
    modalButtonsContainer.style.display = 'flex'; // 수정 폼을 닫을 때 버튼 컨테이너 다시 보이기
    commentsSection.style.display = 'block'; // 수정 폼을 닫을 때 댓글 섹션 다시 보이기
  });

  document.getElementById('submit-modify-button').addEventListener('click', () => {
    inquiry.title = document.getElementById('modify-title').value;
    inquiry.message = document.getElementById('modify-message').value;

    displayInquiries();
    toggleModal(true, inquiry); // 글 내용을 다시 표시
    modalButtonsContainer.style.display = 'flex'; // 수정 폼을 닫을 때 버튼 컨테이너 다시 보이기
    commentsSection.style.display = 'block'; // 수정 폼을 닫을 때 댓글 섹션 다시 보이기
  });
}
