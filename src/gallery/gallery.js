import "./gallery.css";

export function loadGallery() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="gallery-container">
            <div class="gallery-header">
                <h2>기업 공지 모음</h2>
                <div class="sort-options">
                    <select id="sort">
                        <option value="latest">최신순</option>
                        <option value="popular">인기순</option>
                    </select>
                </div>
            </div>
            <div class="card-grid" id="card-grid">
                <!-- 카드 내용은 JavaScript를 통해 추가됩니다 -->
            </div>
            <div class="pagination" id="pagination">
                <!-- 페이지네이션 버튼이 여기에 추가됩니다 -->
            </div>
        </div>
    `;

    document.getElementById('sort').addEventListener('change', sortCards);

    sortCards();
    displayCards(currentPage);
    setupPagination();
}

const cards = [
    { img: 'image1.jpg', title: '동인종합건설(주)', desc: '건축시공/공무 경력직 채용', date: 'D-21', popularity: 5 },
    { img: 'image2.jpg', title: '한양이엔지(주)', desc: '신입사원 공개채용', date: 'D-4', popularity: 20 },
    { img: 'image3.jpg', title: '한국도로공사', desc: '한국도로공사 협력사 채용관', date: 'D-4', popularity: 15 },
    { img: 'image4.jpg', title: 'SK지오센트릭', desc: 'SK지오센트릭 협력회사 채용관', date: 'D-5', popularity: 10 },
    { img: 'image5.jpg', title: '소니세미컨덕터솔루션코리아(주)', desc: 'SONY 반도체 영업관리 / IT / 자금', date: 'D-4', popularity: 8 },
    { img: 'image6.jpg', title: '키움증권', desc: '2024년 상반기 대졸 신입 공개채용', date: 'D-4', popularity: 25 },
    { img: 'image7.jpg', title: '쿠팡풀필먼트서비스', desc: '[쿠팡CFS]인천11센터 현장관리자', date: 'D-5', popularity: 12 },
    { img: 'image8.jpg', title: '(주)좋은책신사고', desc: '직군별 신입 및 경력직원 채용', date: '오늘마감', popularity: 18 },
    { img: 'image9.jpg', title: '한국토지주택공사', desc: '2024년 신입사원(5,6급) 채용', date: 'D-1', popularity: 30 },
    { img: 'image10.jpg', title: '주식회사 에이프로젠바이오로직스', desc: '[바이오사업부문]안제의약품 생산', date: 'D-4', popularity: 22 },
    { img: 'image11.jpg', title: '제일약품(주)', desc: '제일약품/제일헬스사이언스 인재모집', date: '', popularity: 9 },
    { img: 'image12.jpg', title: '쿠팡풀필먼트서비스', desc: '물류 운영, 엔지니어,경영지원, EHS', date: 'D-11', popularity: 7 },
    { img: 'image13.jpg', title: '동인종합건설(주)', desc: '건축시공/공무 경력직 채용', date: 'D-21', popularity: 6 },
    { img: 'image14.jpg', title: '한양이엔지(주)', desc: '신입사원 공개채용', date: 'D-4', popularity: 13 },
    { img: 'image15.jpg', title: '한국도로공사', desc: '한국도로공사 협력사 채용관', date: 'D-4', popularity: 11 },
    { img: 'image16.jpg', title: 'SK지오센트릭', desc: 'SK지오센트릭 협력회사 채용관', date: 'D-5', popularity: 4 },
    { img: 'image17.jpg', title: '소니세미컨덕터솔루션코리아(주)', desc: 'SONY 반도체 영업관리 / IT / 자금', date: 'D-4', popularity: 17 },
    { img: 'image18.jpg', title: '키움증권', desc: '2024년 상반기 대졸 신입 공개채용', date: 'D-4', popularity: 1 },
    { img: 'image19.jpg', title: '쿠팡풀필먼트서비스', desc: '[쿠팡CFS]인천11센터 현장관리자', date: 'D-5', popularity: 3 },
    { img: 'image20.jpg', title: '(주)좋은책신사고', desc: '직군별 신입 및 경력직원 채용', date: '오늘마감', popularity: 2 }
];

const cardsPerPage = 8;
let currentPage = 1;
let currentSort = 'latest';

function displayCards(page) {
    const cardGrid = document.getElementById('card-grid');
    cardGrid.innerHTML = '';
    const start = (page - 1) * cardsPerPage;
    const end = page * cardsPerPage;
    const paginatedCards = cards.slice(start, end);
    paginatedCards.forEach(card => {
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
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    const pageCount = Math.ceil(cards.length / cardsPerPage);
    for (let i = 1; i <= pageCount; i++) {
        pagination.innerHTML += `
            <button class="${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>
        `;
    }
}

function sortCards() {
    const sortValue = document.getElementById('sort').value;
    if (sortValue === 'latest') {
        cards.sort((a, b) => b.date.localeCompare(a.date));
    } else if (sortValue === 'popular') {
        cards.sort((a, b) => b.popularity - a.popularity);
    }
    currentSort = sortValue;
    displayCards(currentPage);
    setupPagination();
}

window.goToPage = function(page) {
    currentPage = page;
    displayCards(currentPage);
    setupPagination();
};

document.addEventListener('DOMContentLoaded', () => {
    sortCards();
    displayCards(currentPage);
    setupPagination();
});
