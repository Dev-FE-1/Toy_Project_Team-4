import "./gallery.css"
import "../inquiryBoard/InquiryBoard.css"
import { getgalleryList, displayCards, setupPagination, currentPage, cards } from "./gallery.js"

// DOMContentLoaded 이벤트 핸들러 내에서 초기화
document.addEventListener("DOMContentLoaded", () => {
  managerloadGallery()
})

// let currentPage = 1 // currentPage 변수를 이 파일 내에서 정의

export function managerloadGallery() {
  const app = document.getElementById("app")

  app.innerHTML = `
        <div class="gallery_container">
            <div class="gallery_header">
                <h2>기업 공지 모음</h2>
                <button id="write-button">공지 등록</button>
            </div>
            <div class="card-grid" id="card-grid">
                <!-- 카드 내용은 JavaScript를 통해 추가됨 -->
            </div>
            <div class="pagination" id="pagination">
                <!-- 페이지네이션 버튼이 여기에 추가됨 -->
            </div>
            <div class="loading-container" id="loadingOverlay">
              <div class="loading-animation">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
              </div>
            </div>
        </div>
        <div id="galleryModal" class="galleryModal">
            <div class="galleryModal-content">
                <span class="close" id="closeModal">&times;</span>
                <form id="gallery-form">
                  <div id="formlist" class="formlist">
                    <label for="title">제목:</label>
                    <input type="text" id="title" name="title" required>
                    <br>
                    <label for="desc">공지 내용:</label>
                    <textarea id="desc" name="desc" required></textarea>
                    <br>
                    <label for="image">이미지 업로드:</label>
                    <input type="file" id="image" name="image" accept="image/*" required>
                    <br>
                    <div class="form-buttons">
                      <button type="button" id="cancel-button" class="cancel-button">취소</button>
                      <button type="button" id="submit-button" class="submit-button">작성</button>
                    </div>
                  </div>
                </form>
            </div>
        </div>
        <div id="deleteModal" class="modal">
            <div class="modal-content">
                <p>정말로 삭제하시겠습니까?</p>
                <button id="confirmDelete">예</button>
                <button id="cancelDelete">아니오</button>
            </div>
        </div>
    `

  // 초기 카드 정렬 및 표시
  getgalleryList().then(cardsData => {
    cards.length = 0; // 기존 cards 배열 초기화
    cards.push(...cardsData); // 새로운 데이터로 cards 배열 갱신
    displayCards(cardsData, currentPage, true)
    setupPagination(cardsData, currentPage, true)
    addDeleteEventListeners() // 삭제 버튼 이벤트 리스너 추가
  }).catch(err => {
    // console.error("Error loading gallery list:", err)
  })
  setupModalEvents();
  setupFormEvents();
}

// 폼 관련 이벤트 설정 함수
function setupFormEvents() {
  const writeButton = document.getElementById('write-button');
  const galleryModal = document.getElementById('galleryModal');
  const closeModal = document.getElementById('closeModal');
  const cancelButton = document.getElementById('cancel-button');
  const submitButton = document.getElementById('submit-button');

  writeButton.addEventListener('click', () => {
    galleryModal.style.display = 'block';
  });

  closeModal.addEventListener('click', () => {
    galleryModal.style.display = 'none';
  });

  cancelButton.addEventListener('click', () => {
    galleryModal.style.display = 'none';
  });

  submitButton.addEventListener('click', handleFormSubmit);
}

// 폼 제출 이벤트 핸들러
async function handleFormSubmit() {
  // const galleryModal = document.getElementById('galleryModal');
  const title = document.getElementById('title').value;
  const desc = document.getElementById('desc').value;
  const image = document.getElementById('image').files[0];

  if (!title || !desc || !image) {
    alert('모든 필드를 채워주세요.');
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('desc', desc);
  formData.append('image', image);

  try {
    const response = await fetch('http://localhost:8080/upload', { // 서버 URL을 명확하게 지정
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('공지 등록 실패');
    }

    const result = await response.json();
    alert('공지 등록 완료');
    document.getElementById('galleryModal').style.display = 'none';
    managerloadGallery(); // 갤러리 다시 로드
  } catch (error) {
    console.error('Error:', error);
    alert('공지 등록 중 오류가 발생했습니다.');
  }
}

// 삭제 버튼 이벤트 리스너 추가 함수
function addDeleteEventListeners() {
  document.querySelectorAll('.delete-icon').forEach(icon => {
    icon.addEventListener('click', (event) => {
      const cardIndex = event.target.getAttribute('data-card-index');
      showDeleteModal(cardIndex);
    })
  })
}

// 삭제버튼 모달 관련 이벤트 설정
function setupModalEvents() {
  const modal = document.getElementById("deleteModal");
  const cancelButton = modal.querySelector("#cancelDelete");
  const confirmButton = modal.querySelector("#confirmDelete");

  cancelButton.onclick = closeDeleteModal;
  confirmButton.onclick = confirmDelete;
}

function showDeleteModal(index) {
  const modal = document.getElementById("deleteModal");
  modal.style.display = "block";
  modal.setAttribute('data-delete-index', index);
}

function closeDeleteModal() {
  const modal = document.getElementById("deleteModal");
  modal.style.display = "none";
  modal.removeAttribute('data-delete-index');
}

function confirmDelete() {
  const modal = document.getElementById("deleteModal");
  const cardIndex = modal.getAttribute('data-delete-index');
  deleteCard(cardIndex);
  closeDeleteModal();
}

// 삭제 함수
window.deleteCard = function (index) {
  cards.splice(index, 1)
  displayCards(cards, currentPage, true)
  setupPagination(cards, currentPage, true)
  addDeleteEventListeners() // 삭제 후 이벤트 리스너 다시 추가
}