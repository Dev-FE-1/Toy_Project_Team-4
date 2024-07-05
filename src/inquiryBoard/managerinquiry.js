import './InquiryBoard.css';
import './managerinquiry.css';
import { displayInquiries, loadInquiries, toggleModal, inquiries, currentInquiryId, currentUser } from "./InquiryBoard.js";
// import axios from 'axios';

let filtered = false;

export function managerloadInquiryBoard() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="borad">
      <div class="inquiry-board">
        <div class="header-section">
          <h1>문의 게시판</h1>
          <button id="filter-button">처리하지 않은 게시물 보기</button>
          <button id="clear-filter-button" style="display: none; background-color: #2ed47a;">전체 게시물 보기</button>
        </div>
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
          <h1>문의 게시판</h1>
            <div id="inquirymodal-body"></div>
            <div id="modal-buttons-container" class="modal-buttons-container"> 
              <div id="listbutton" class="listbutton">
                <button id="modal-list-button">목록</button>
              </div>
            </div>
            <div id="comments-section" class="comments-section">
            <ul id="comments-list" class="comments-list"></ul>
            <div class="comment-form">
                <textarea id="comment-input" placeholder="댓글을 입력하세요"></textarea>
                <button id="submit-comment-button">댓글 작성</button>
              </div>
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
    </div>
  `;
  
  document.getElementById('modal-list-button').addEventListener('click', () => {
    toggleModal(false, null, true); // 관리자 모드 플래그 전달
    clearCommentInput(); // 댓글 입력 창 내용 초기화
  });
  document.getElementById('submit-comment-button').addEventListener('click', handleCommentSubmit);
  document.getElementById('comment-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit(e);
    }
  });

  // 댓글이 없는 게시물 필터 이벤트
  document.getElementById('filter-button').addEventListener('click', filterInquiries);
  document.getElementById('clear-filter-button').addEventListener('click', clearFilter);

  loadInquiries(true); // 관리자 모드로 loadInquiries 호출
}


// 댓글 작성 
function handleCommentSubmit(event) {
  if (event) {
    event.preventDefault();
  }
  const commentInput = document.getElementById('comment-input');
  const commentText = commentInput.value.trim();
  if (commentText === '') {
    alert('댓글을 입력하세요');
    return;
  }
  const inquiry = inquiries.find(inquiry => inquiry.id === currentInquiryId);
  if (!inquiry) {
    console.error('Inquiry not found');
    return;
  }

  const newComment = {
    comment: commentText,
    "comment data": new Date().toLocaleString('ko-KR', {
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true // 12시간제로 표시
    }),
    "manager profile": currentUser ? currentUser.profileImage : '',
    "manager name": currentUser ? currentUser.name : '관리자'
  };
  
  inquiry.comments = inquiry.comments || [];
  inquiry.comments.push(newComment);
  
  displayComments(inquiry.comments, true); // 관리자 모드로 댓글 표시
  commentInput.value = ''; // 입력 필드 비우기

  // 댓글 수 업데이트
  updateCommentCount(inquiry.id, inquiry.comments.length);
}

// 작성된 댓글 바로 업데이트 로직
export function displayComments(comments = [], forManager = false) {
  const commentsList = document.getElementById('comments-list');
  commentsList.innerHTML = '';
  
  if (comments.length === 0) {
    commentsList.innerHTML = '<p>아직 댓글이 없습니다.</p>';
  } else {
    const commentCount = comments.length;

    const commentHeader = document.createElement('div');
    commentHeader.classList.add('comment-header');
    commentHeader.innerHTML = `<img src="/images/iconComment.svg" class="img" alt="댓글"><span>댓글 ${commentCount}</span>`;
    commentsList.appendChild(commentHeader);

    comments.forEach((commentData, index) => {
      const { comment, "comment data": commentDate, "manager profile": managerprofile, "manager name": managerName } = commentData;
  
      const commentDetail = document.createElement('div');
      commentDetail.innerHTML = `
        <div class="comment-detail">
          <div class="comment-name">
            <img src="${managerprofile}" alt="manager profile" class="manager-profile">${managerName}</div>
          <div class="comment-date"><span>${commentDate}</span></div>
          ${forManager ? '<span class="material-symbols-outlined delete-icon" data-comment-index="' + index + '">delete</span>' : ''}
        </div>
        <div class="comment-message"><span>${comment}</span></div>
      `;
      commentsList.appendChild(commentDetail);
    });

    // 모든 삭제 아이콘에 이벤트 리스너 추가
    if (forManager) {
      document.querySelectorAll('.delete-icon').forEach(icon => {
        icon.addEventListener('click', handleCommentDelete);
      });
    }
  }
}

// 글 리스트에 있는 댓글 수 업데이트
function updateCommentCount(inquiryId, count) {
  const inquiryListItems = document.querySelectorAll('.inquirylist');
  inquiryListItems.forEach(item => {
    const idDiv = item.querySelector('div:first-child');
    if (idDiv && idDiv.textContent.trim() === String(inquiryId)) {
      const commentCountSpan = item.querySelector('.comment-count span');
      if (commentCountSpan) {
        commentCountSpan.textContent = count;
      }
    }
  });
}

// 댓글 입력 창 내용 초기화
function clearCommentInput() {
  const commentInput = document.getElementById('comment-input');
  if (commentInput) {
    commentInput.value = '';
  }
}

// 댓글 삭제 처리 함수
function handleCommentDelete(event) {
  const commentIndex = event.target.getAttribute('data-comment-index');
  const inquiry = inquiries.find(inquiry => inquiry.id === currentInquiryId);

  if (!inquiry || commentIndex === null) {
    console.error('댓글을 찾을 수 없습니다.');
    return;
  }

  inquiry.comments.splice(commentIndex, 1); // 해당 댓글 삭제
  displayComments(inquiry.comments, true); // 관리자 모드로 댓글 표시

  // 댓글 수 업데이트
  updateCommentCount(inquiry.id, inquiry.comments.length);
}

// 필터링된 게시물 표시
function filterInquiries() {
  filtered = true;
  displayFilteredInquiries();
  document.getElementById('filter-button').style.display = 'none';
  document.getElementById('clear-filter-button').style.display = 'block';
}

function displayFilteredInquiries() {
  const filteredInquiries = inquiries.filter(inquiry => !inquiry.comments || inquiry.comments.length === 0);
  displayInquiries(true, filteredInquiries); // 필터된 데이터 전달
}

// 필터 해제
function clearFilter() {
  filtered = false;
  displayInquiries(true); // 관리자 모드로 displayInquiries 호출
  document.getElementById('filter-button').style.display = 'block';
  document.getElementById('clear-filter-button').style.display = 'none';
}