import axios from "axios"
import "./gallery.css"
import "../inquiryBoard/InquiryBoard.css"
import { addDeleteEventListeners } from "./managergallery.js";

export let cards = [] // 전역 변수로 선언
export let currentPage = 1

// DOMContentLoaded 이벤트 핸들러 내에서 초기화
document.addEventListener("DOMContentLoaded", () => {
  loadGallery()
})

export function loadGallery() {
  const app = document.getElementById("app")

  app.innerHTML = `
        <div class="gallery_container">
            <div class="gallery_header">
                <h2>기업 공지 모음</h2>
                <div class="sort-options">
                    <select id="sort">
                        <option value="latest">최신순</option>
                        <option value="popular">인기순</option>
                    </select>
                </div>
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
    `

  // 요소가 추가된 후 이벤트 리스너 등록
  initializeSortElement()

  // 초기 카드 정렬 및 표시
  getgalleryList().then(cardsData => {
    if (cardsData && cardsData.length > 0) {
      cards = cardsData; // cards 변수를 업데이트
      const sortElement = document.getElementById("sort")
      sortCards(cards, sortElement.value) // 초기 정렬 옵션에 맞게 정렬
    } else {
      console.error("No cards available to sort")
    }
  }).catch(err => {
    // console.error("Error loading gallery list:", err)
  })
}

export function initializeSortElement() {
  const sortElement = document.getElementById("sort")

  sortElement.addEventListener("change", () => sortCards(cards, sortElement.value))
  sortElement.addEventListener("focus", function () {
    this.style.border = "2px solid #ED234B"
  })
  sortElement.addEventListener("blur", function () {
    this.style.border = "1px solid #ABABAB"
  })
}

// gallery.json 데이터 가져오기
export async function getgalleryList() {
  const loadingContainer = document.querySelector(".loading-container");
  loadingContainer.classList.remove("hidden");

  try {
    const res = await axios.get("/api/gallery.json");

    // res.data가 배열인지 확인
    if (Array.isArray(res.data)) {
      return res.data
    } else if (res.data.data && Array.isArray(res.data.data)) {
      return res.data.data
    } else {
      throw new Error("Invalid data format")
    }
  } catch (err) {
    console.error("Error fetching gallery list:", err)
    return []
  } finally {
    loadingContainer.classList.add("hidden")
  }
}

const cardsPerPage = 8
let currentSort = "latest"

export function displayCards(cards, page, forManager = false) {
  const cardGrid = document.getElementById("card-grid");
  cardGrid.innerHTML = "";
  const start = (page - 1) * cardsPerPage;
  const end = page * cardsPerPage;
  const paginatedCards = cards.slice(start, end);
  paginatedCards.forEach((card, index) => {
    cardGrid.innerHTML += `
      <div class="card">
        <img src="${card.img}" alt="${card.title}" onerror="this.onerror=null;this.src='/uploads/default_image.jpg';">
        <h3>${card.title}</h3>
        <p>${card.desc}</p>
        <div class="card-footer">
          <span class="date">${card.date}</span>
          ${forManager ? `<span class="material-symbols-outlined delete-icon" data-card-index="${index + start}">delete</span>` : ''}
        </div>
      </div>
    `;
  });
  if (forManager) {
    addDeleteEventListeners(); // 관리자 모드일 때만 이벤트 리스너 추가
  }
}

export function setupPagination(cards, currentPage, forManager = false) {
  const pagination = document.getElementById("pagination")
  pagination.innerHTML = ""
  const pageCount = Math.ceil(cards.length / cardsPerPage)

  // 왼쪽 화살표 추가
  const leftArrow = createArrow("left", currentPage === 1, cards, currentPage, forManager)
  pagination.appendChild(leftArrow)

  for (let i = 1; i <= pageCount; i++) {
    const pageButton = document.createElement("button")
    pageButton.textContent = i
    pageButton.classList.add("page-button")
    if (i === currentPage) {
      pageButton.classList.add("active")
    }
    pageButton.addEventListener("click", () => {
      currentPage = i
      displayCards(cards, currentPage, forManager)
      setupPagination(cards, currentPage, forManager) // currentPage를 인자로 전달
    })
    pagination.appendChild(pageButton)
  }

  // 오른쪽 화살표 추가
  const rightArrow = createArrow("right", currentPage === pageCount, cards, currentPage, forManager)
  pagination.appendChild(rightArrow)
}

function createArrow(direction, disabled, cards, currentPage, forManager) {
  const arrow = document.createElement("button")
  arrow.textContent = direction === "left" ? "<" : ">"
  arrow.classList.add("page-arrow")
  if (disabled) {
    arrow.classList.add("disabled")
  } else {
    arrow.addEventListener("click", () => {
      currentPage = direction === "left" ? currentPage - 1 : currentPage + 1
      displayCards(cards, currentPage, forManager)
      setupPagination(cards, currentPage, forManager) // currentPage를 인자로 전달
    })
  }
  return arrow
}

export function sortCards(cards, sortBy = "latest") {
  if (!cards || cards.length === 0) {
    console.error("No cards available to sort")
    return
  }

  if (sortBy === "latest") {
    cards.sort((a, b) => b.date.localeCompare(a.date))
  } else if (sortBy === "popular") {
    cards.sort((a, b) => b.popularity - a.popularity)
  }

  displayCards(cards, currentPage)
  setupPagination(cards, currentPage)
}

window.goToPage = function (page) {
  currentPage = page
  displayCards(cards, currentPage)
  setupPagination(cards, currentPage)
}