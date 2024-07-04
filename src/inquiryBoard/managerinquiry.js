import './InquiryBoard.css';
import './managerinquiry.css';
import { loadInquiries, toggleModal, inquiries, currentInquiryId, currentUser } from "./InquiryBoard.js";
import axios from 'axios';

export function managerloadInquiryBoard() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="borad">
      <div class="inquiry-board">
        <div class="header-section">
          <h1>문의 게시판</h1>
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
  
  document.getElementById('modal-list-button').addEventListener('click', () => toggleModal(false));
  document.getElementById('submit-comment-button').addEventListener('click', handleCommentSubmit);
  loadInquiries(true); // 관리자 모드로 loadInquiries 호출
}

function handleCommentSubmit() {
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
    "comment data": new Date().toLocaleString(),
    "manager profile": currentUser ? currentUser.profileImage : '',
    "manager name": currentUser ? currentUser.name : '관리자'
  };
  
  inquiry.comments = inquiry.comments || [];
  inquiry.comments.push(newComment);
  
  displayComments(inquiry.comments);
  commentInput.value = ''; // 입력 필드 비우기
}

function displayComments(comments) {
  const commentsList = document.getElementById('comments-list');
  commentsList.innerHTML = '';
  
  if (comments.length === 0) {
    commentsList.innerHTML = '<p>아직 댓글이 없습니다.</p>';
  } else {
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