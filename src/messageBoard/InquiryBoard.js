import './InquiryBoard.css';
import axios from 'axios';
// import { showLoading } from '../../loading-animation/loading-animation.js';


let inquiries = [];
const itemsPerPage = 5; //한 페이지에 5개씩 표시
let currentPage = 1;
let currentAction = ''; // action 값을 저장할 전역 변수 추가

document.addEventListener('DOMContentLoaded', () => {
  // showLoading();
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
            <label for="name">작성자:</label>
            <input type="text" id="name" name="name" required>
            <br>
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
    </div>
  `;

  document.getElementById('write-button').addEventListener('click', () => toggleForm(true));
  document.getElementById('cancel-button').addEventListener('click', () => toggleForm(false));
  document.getElementById('submit-button').addEventListener('click', handleSubmit);
  //모달 버튼 이벤트리스너
  document.getElementById('modal-list-button').addEventListener('click', () => toggleModal(false));
  document.getElementById('modal-modify-button').addEventListener('click', () => showPasswordModal('modify'));
  document.getElementById('modal-delete-button').addEventListener('click', () => showPasswordModal('delete'));

  document.getElementById('close-password-modal').addEventListener('click', () => togglePasswordModal(false));
  document.getElementById('confirm-password-button').addEventListener('click', handlePasswordConfirmation);

  loadInquiries();
}

function toggleForm(show) {
  const form = document.getElementById('inquiry-form');
  const inquiryList = document.getElementById('inquiry-list');
  const pagination = document.getElementById('pagination');

  form.style.display = show ? 'block' : 'none';
  inquiryList.style.display = show ? 'none' : 'block';
  pagination.style.display = show ? 'none' : 'flex';
}

function handleSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const title = document.getElementById('title').value.trim();
  const message = document.getElementById('message').value.trim();

  if (name === '' || title === '' || message === '') {
    alert('모든 필드를 채워주세요.');
    return;
  }

  addInquiry(name, title, message);
  toggleForm(false); // 작성 후 폼 숨기기
}

// inquiry.json 데이터 가져오기
async function loadInquiries() {
  try {
    const res = await axios.get("/api/inquiry.json")
    inquiries = res.data.data
    displayInquiries();
  } catch (err) {
    console.error("error", err)
  }
}

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
    listItem.addEventListener('click', () => toggleModal(true, inquiry)); //클릭하면 모달창생성
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

function addInquiry(name, title, message) {
  const newInquiry = {
    id: inquiries.length + 1,
    title: title,
    name: name,
    date: new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' }),
    message: message,
    comments: [] // 새로 추가된 문의에 대한 빈 댓글 배열
  };

  inquiries.push(newInquiry);
  displayInquiries();
}

function toggleModal(show, inquiry = null) {
  const modal = document.getElementById('inquirymodal');
  const modalBody = document.getElementById('inquirymodal-body');

  if (!modal || !modalBody) {
    console.error('Modal elements not found');
    return;
  }

  if (show && inquiry) {
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
      const comments = Array.isArray(inquiry.comments) ? inquiry.comments : [{ comment, "comment data": commentDate, "manager profile": managerprofile, "manager name": managerName }];
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