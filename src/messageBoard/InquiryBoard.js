import './InquiryBoard.css';

let inquiries = [
  { id: 1, title: '문의합니다', author: '임효정', date: '6월24일' },
  { id: 2, title: '문의합니다', author: '김수민', date: '6월24일' },
  { id: 3, title: '문의합니다', author: '김도형', date: '6월24일' },
  { id: 4, title: '문의합니다', author: '최원지', date: '6월24일' },
  { id: 5, title: '문의합니다', author: '임효정', date: '6월24일' },
  { id: 6, title: '문의합니다', author: '김수민', date: '6월25일' },
  { id: 7, title: '문의합니다', author: '김도형', date: '6월25일' },
  { id: 8, title: '문의합니다', author: '최원지', date: '6월25일' },
  { id: 9, title: '문의합니다', author: '임효정', date: '6월25일' },
  { id: 10, title: '문의합니다', author: '김수민', date: '6월26일' },
  { id: 11, title: '문의합니다', author: '김도형', date: '6월26일' },
  { id: 12, title: '문의합니다', author: '최원지', date: '6월26일' }
];

const itemsPerPage = 5; //한 페이지에 5개씩 표시
let currentPage = 1;

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
          <label for="name">작성자:</label>
          <input type="text" id="name" name="name" required>
          <br>
          <label for="message">문의 내용:</label>
          <textarea id="message" name="message" required></textarea>
          <br>
          <button type="submit">작성</button>
        </form>
        <ul id="inquiry-list">
          <li>
            <div><strong>글번호</strong></div>
            <div class="title"><strong>제목</strong></div>
            <div><strong>작성자</strong></div>
            <div><strong>작성일</strong></div>
          </li>
        </ul>
        <div id="pagination" class="pagination"></div>
      </div>
    </div>
  `;

  document.getElementById('write-button').addEventListener('click', () => {
    const form = document.getElementById('inquiry-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  });

  document.getElementById('inquiry-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;
    addInquiry(name, message);
  });

  loadInquiries();
}

function loadInquiries() {
  const inquiryList = document.getElementById('inquiry-list');
  inquiryList.innerHTML = `
    <li>
      <div><strong>글번호</strong></div>
      <div class="title"><strong>제목</strong></div>
      <div><strong>작성자</strong></div>
      <div><strong>작성일</strong></div>
    </li>
  `;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, inquiries.length);

  for (let i = startIndex; i < endIndex; i++) {
    const inquiry = inquiries[i];
    const listItem = document.createElement('li');
    listItem.classList.add('inquirylist');
    listItem.innerHTML = `
      <div>${inquiry.id}</div>
      <div class="title">${inquiry.title}</div>
      <div>${inquiry.author}</div>
      <div>${inquiry.date}</div>
    `;
    inquiryList.appendChild(listItem);
  }

  displayPagination(inquiries.length);
}

function displayPagination(totalItems) {
  const pagination = document.getElementById('pagination');
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  pagination.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.classList.add('page-button');
    if (i === currentPage) {
      pageButton.classList.add('active');
    }
    pageButton.addEventListener('click', () => {
      currentPage = i;
      loadInquiries();
    });
    pagination.appendChild(pageButton);
  }
}

function addInquiry(name, message) {
  const newInquiry = {
    id: inquiries.length + 1,
    title: '새 문의',
    author: name,
    date: new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
  };

  inquiries.push(newInquiry);
  loadInquiries();
}