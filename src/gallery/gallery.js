import "./gallery.css"

// DOMContentLoaded 이벤트 핸들러 내에서 초기화
document.addEventListener("DOMContentLoaded", () => {
  loadGallery();
  sortCards();
  displayCards(currentPage);
  setupPagination();
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

  const sortElement = document.getElementById("sort");
  sortElement.addEventListener("change", sortCards);
  sortElement.addEventListener("focus", function () {
    this.style.border = "2px solid #ED234B";
  });
  sortElement.addEventListener("blur", function () {
    this.style.border = "1px solid #ABABAB";
  });

  // sortCards 함수는 로드 시점에서 한 번 호출
  sortCards();
  displayCards(currentPage);
  setupPagination();
}

const cards = [
  // 카드 데이터 배열
];

const cardsPerPage = 8;
let currentPage = 1;
let currentSort = "latest";

function displayCards(page) {
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
  for (let i = 1; i <= pageCount; i++) {
    pagination.innerHTML += `
            <button class="${i === currentPage ? "active" : ""}" onclick="goToPage(${i})">${i}</button>
        `;
  }
}

function sortCards() {
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
  displayCards(currentPage);
  setupPagination();
}

window.goToPage = function (page) {
  currentPage = page;
  displayCards(currentPage);
  setupPagination();
};

// DOMContentLoaded 이벤트가 발생한 후에 초기화 함수들을 호출
document.addEventListener("DOMContentLoaded", () => {
  loadGallery();
  sortCards();
  displayCards(currentPage);
  setupPagination();
});