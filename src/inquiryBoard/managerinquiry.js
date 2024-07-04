import './InquiryBoard.css';
import { loadInquiries, toggleModal } from "./InquiryBoard.js";
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
            <div id="inquirymodal-body"></div>
            <div id="modal-buttons-container" class="modal-buttons-container"> 
              <div id="listbutton" class="listbutton">
                <button id="modal-list-button">목록</button>
              </div>
            </div>
            <div id="comments-section" class="comments-section">
            <ul id="comments-list" class="comments-list"></ul>
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
  loadInquiries(true); // 관리자 모드로 loadInquiries 호출
}