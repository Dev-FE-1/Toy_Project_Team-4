import "./gallery.css"

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

  const sortElement = document.getElementById("sort");
  sortElement.addEventListener("change", sortCards);
  sortElement.addEventListener("focus", function () {
    this.style.border = "2px solid #ED234B";
  });
  sortElement.addEventListener("blur", function () {
    this.style.border = "1px solid #ABABAB";
  });

  // 초기 카드 정렬 및 표시
  sortCards();
  displayCards(currentPage);
  setupPagination();
}

const cards = [
  {
    img: 'path/to/image1.jpg',
    title: '공지사항 1',
    desc: '공지사항 내용 1',
    date: '2023-06-01',
    popularity: 10
  },
  {
    img: 'path/to/image2.jpg',
    title: '공지사항 2',
    desc: '공지사항 내용 2',
    date: '2023-06-02',
    popularity: 20
  },
  {
    img: 'path/to/image3.jpg',
    title: '공지사항 3',
    desc: '공지사항 내용 3',
    date: '2023-06-03',
    popularity: 30
  },
  {
    img: 'path/to/image4.jpg',
    title: '공지사항 4',
    desc: '공지사항 내용 4',
    date: '2023-06-04',
    popularity: 40
  },
  {
    img: 'path/to/image5.jpg',
    title: '공지사항 5',
    desc: '공지사항 내용 5',
    date: '2023-06-05',
    popularity: 50
  },
  {
    img: 'path/to/image6.jpg',
    title: '공지사항 6',
    desc: '공지사항 내용 6',
    date: '2023-06-06',
    popularity: 60
  },
  {
    img: 'path/to/image7.jpg',
    title: '공지사항 7',
    desc: '공지사항 내용 7',
    date: '2023-06-07',
    popularity: 70
  },
  {
    img: 'path/to/image8.jpg',
    title: '공지사항 8',
    desc: '공지사항 내용 8',
    date: '2023-06-08',
    popularity: 80
  },
  {
    img: 'path/to/image9.jpg',
    title: '공지사항 9',
    desc: '공지사항 내용 9',
    date: '2023-06-09',
    popularity: 90
  },
  {
    img: 'path/to/image10.jpg',
    title: '공지사항 10',
    desc: '공지사항 내용 10',
    date: '2023-06-10',
    popularity: 100
  },
  {
    img: 'path/to/image11.jpg',
    title: '공지사항 11',
    desc: '공지사항 내용 11',
    date: '2023-06-11',
    popularity: 110
  },
  {
    img: 'path/to/image12.jpg',
    title: '공지사항 12',
    desc: '공지사항 내용 12',
    date: '2023-06-12',
    popularity: 120
  },
  {
    img: 'path/to/image13.jpg',
    title: '공지사항 13',
    desc: '공지사항 내용 13',
    date: '2023-06-13',
    popularity: 130
  },
  {
    img: 'path/to/image14.jpg',
    title: '공지사항 14',
    desc: '공지사항 내용 14',
    date: '2023-06-14',
    popularity: 140
  },
  {
    img: 'path/to/image15.jpg',
    title: '공지사항 15',
    desc: '공지사항 내용 15',
    date: '2023-06-15',
    popularity: 150
  },
  {
    img: 'path/to/image16.jpg',
    title: '공지사항 16',
    desc: '공지사항 내용 16',
    date: '2023-06-16',
    popularity: 160
  },
  {
    img: 'path/to/image17.jpg',
    title: '공지사항 17',
    desc: '공지사항 내용 17',
    date: '2023-06-17',
    popularity: 170
  },
  {
    img: 'path/to/image18.jpg',
    title: '공지사항 18',
    desc: '공지사항 내용 18',
    date: '2023-06-18',
    popularity: 180
  },
  {
    img: 'path/to/image19.jpg',
    title: '공지사항 19',
    desc: '공지사항 내용 19',
    date: '2023-06-19',
    popularity: 190
  },
  {
    img: 'path/to/image20.jpg',
    title: '공지사항 20',
    desc: '공지사항 내용 20',
    date: '2023-06-20',
    popularity: 200
  }
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
