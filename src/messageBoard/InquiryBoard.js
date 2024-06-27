import './InquiryBoard.css';

let inquiries = [
  { id: 1, title: '문의합니다', name: '임효정', date: '6월 24일' },
  { id: 2, title: '문의합니다', name: '김수민', date: '6월 24일' },
  { id: 3, title: '문의합니다', name: '김도형', date: '6월 24일' },
  { id: 4, title: '문의합니다', name: '최원지', date: '6월 24일' },
  { id: 5, title: '문의합니다', name: '임효정', date: '6월 24일' },
  { id: 6, title: '문의합니다', name: '김수민', date: '6월 25일' },
  { id: 7, title: '문의합니다', name: '김도형', date: '6월 25일' },
  { id: 8, title: '문의합니다', name: '최원지', date: '6월 25일' },
  { id: 9, title: '문의합니다', name: '임효정', date: '6월 25일' },
  { id: 10, title: '문의합니다', name: '김수민', date: '6월 26일' },
  { id: 11, title: '문의합니다', name: '김도형', date: '6월 26일' },
  { id: 12, title: '문의합니다', name: '최원지', date: '6월 26일' }
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
          <h1>문의 게시판</h1>
          <div id="formlist" class="formlist">
            <label for="name">작성자:</label>
            <input type="text" id="name" name="name" required>
            <br>
            <label for="title">제목:</label>
            <input type="text" id="title" name="title" required>
            <br>
            <label for="message">문의 내용:</label>
            <textarea id="message" name="message" required></textarea>
            <br>
            <div class="form-buttons">
              <button type="button" id="cancel-button" class="cancel-button">취소</button>
              <button type="button" id="submit-button" class="submit-button">작성</button>
            </div>
          </div>
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

  const writeButton = document.getElementById('write-button');
  const cancelButton = document.getElementById('cancel-button');
  const submitButton = document.getElementById('submit-button');
  const form = document.getElementById('inquiry-form');
  const inquiryList = document.getElementById('inquiry-list');
  const pagination = document.getElementById('pagination');

  const toggleForm = (show) => {
    form.style.display = show ? 'block' : 'none';
    inquiryList.style.display = show ? 'none' : 'block';
    pagination.style.display = show ? 'none' : 'flex';
  };

  writeButton.addEventListener('click', () => {
    toggleForm(true);
  });

  cancelButton.addEventListener('click', () => {
    toggleForm(false);
  });

  submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const title = document.getElementById('title').value.trim();
    const message = document.getElementById('message').value.trim();

    if (name === '' || title === '' || message === '') {
      alert('모든 필드를 채워주세요.');
      return;
    }
    addInquiry(name, title, message);
    toggleForm(false); // 작성 후 폼 숨기기 
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

  const sortedInquiries = [...inquiries].reverse(); // 배열을 역순으로 정렬
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedInquiries.length);

  for (let i = startIndex; i < endIndex; i++) {
    const inquiry = sortedInquiries[i];
    const listItem = document.createElement('li');
    listItem.classList.add('inquirylist');
    listItem.innerHTML = `
      <div>${inquiry.id}</div>
      <div class="title">${inquiry.title}</div>
      <div>${inquiry.name}</div>
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

  // 화살표 페이지네이션 컴포넌트
  const createArrow = (direction, disabled) => {
    const arrow = document.createElement('button');
    arrow.textContent = direction === 'left' ? '<' : '>';
    arrow.classList.add('page-arrow');
    if (disabled) {
      arrow.classList.add('disabled');
    } else {
      arrow.addEventListener('click', () => {
        currentPage = direction === 'left' ? currentPage - 1 : currentPage + 1;
        loadInquiries();
      });
    }
    return arrow;
  };

  pagination.appendChild(createArrow('left', currentPage === 1));

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

  pagination.appendChild(createArrow('right', currentPage === totalPages));
}

function addInquiry(name, title, message) {
  const newInquiry = {
    id: inquiries.length + 1,
    title: title,
    name: name,
    date: new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
  };

  inquiries.push(newInquiry);
  loadInquiries();
}