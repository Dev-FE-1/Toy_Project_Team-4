import axios from "axios"
import "./gallery.css"
import "../messageBoard/InquiryBoard.css"

let cards = [];  // 전역 변수로 선언

// DOMContentLoaded 이벤트 핸들러 내에서 초기화
document.addEventListener("DOMContentLoaded", () => {
  loadGallery();
});

export function loadGallery() {
  const app = document.getElementById("app");

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
        </div>
    `;

  // 요소가 추가된 후 이벤트 리스너 등록
  initializeSortElement();


  // 초기 카드 정렬 및 표시
  getgalleryList();
}

function initializeSortElement() {
  const sortElement = document.getElementById("sort");

  sortElement.addEventListener("change", () => sortCards(cards));
  sortElement.addEventListener("focus", function () {
    this.style.border = "2px solid #ED234B";
  });
  sortElement.addEventListener("blur", function () {
    this.style.border = "1px solid #ABABAB";
  });
}

// gallery.json 데이터 가져오기
async function getgalleryList() {
  try {
    const res = await axios.get("/api/gallery.json")

    // res.data가 배열인지 확인
    if (Array.isArray(res.data)) {
      cards = res.data;
    } else if (res.data.data && Array.isArray(res.data.data)) {
      cards = res.data.data;
    } else {
      throw new Error("Invalid data format");
    }

    // 데이터가 로드된 후에 sortCards 호출
    document.addEventListener("DOMContentLoaded", () => {
      sortCards(cards);
    });
    } catch (err) {
    console.error("Error fetching gallery list:", err);
  }
}

const cardsPerPage = 8;
let currentPage = 1;
let currentSort = "latest";

function displayCards(cards, page) {
  const cardGrid = document.getElementById("card-grid");
  cardGrid.innerHTML = "";
  const start = (page - 1) * cardsPerPage;
  const end = page * cardsPerPage;
  const paginatedCards = cards.slice(start, end);
  paginatedCards.forEach((card) => {
    cardGrid.innerHTML += `
            <div class="card">
                <img src="${card.img}" alt="${card.title}">
                <h3>${card.title}</h3>
                <p>${card.desc}</p>
                <div class="card-footer">
                    <span class="date">${card.date}</span>
                </div>
            </div>
        `;
  });
}

function setupPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  const pageCount = Math.ceil(cards.length / cardsPerPage);
  
  // 왼쪽 화살표 추가
  const leftArrow = createArrow('left', currentPage === 1);
  pagination.appendChild(leftArrow);

  for (let i = 1; i <= pageCount; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.classList.add('page-button');
    if (i === currentPage) {
      pageButton.classList.add('active');
    }
    pageButton.addEventListener('click', () => {
      currentPage = i;
      displayCards(cards, currentPage);
      setupPagination();
    });
    pagination.appendChild(pageButton);
  }

  // 오른쪽 화살표 추가
  const rightArrow = createArrow('right', currentPage === pageCount);
  pagination.appendChild(rightArrow);
}

function createArrow(direction, disabled) {
  const arrow = document.createElement('button');
  arrow.textContent = direction === 'left' ? '<' : '>';
  arrow.classList.add('page-arrow');
  if (disabled) {
    arrow.classList.add('disabled');
  } else {
    arrow.addEventListener('click', () => {
      currentPage = direction === 'left' ? currentPage - 1 : currentPage + 1;
      displayCards(cards, currentPage);
      setupPagination();
    });
  }
  return arrow;
}

function sortCards(cards) {
  const sortElement = document.getElementById("sort");

  // document.getElementById("sort") 값이 null인지 확인
  if (!sortElement) {
    console.error("Sort element not found");
    return;
  }

  const sortValue = sortElement.value;
  if (sortValue === "latest") {
    cards.sort((a, b) => b.date.localeCompare(a.date));
  } else if (sortValue === "popular") {
    cards.sort((a, b) => b.popularity - a.popularity);
  }
  currentSort = sortValue;
  displayCards(cards, currentPage);
  setupPagination();
}

window.goToPage = function (page) {
  currentPage = page;
  displayCards(cards, currentPage);
  setupPagination();
};
