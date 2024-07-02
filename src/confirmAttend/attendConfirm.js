// //https://wehagothelp.zendesk.com/hc/ko/articles/5730890938905--%EA%B7%BC%ED%83%9C%EA%B4%80%EB%A6%AC-%EC%B6%9C%ED%87%B4%EA%B7%BC%EA%B8%B0%EB%A1%9D-%EB%A9%94%EB%89%B4-%EC%A1%B0%ED%9A%8C%ED%95%98%EA%B8%B0
import axios from "axios";
import './attendConfirm.css';

let attends = []
let filteredAttends = []
const itemsPerPage = 5 // 한 페이지에 6개씩
let currentPage = 1

export async function loadAttendConfirm() {
  try {
    const res = await axios.get('/api/attendance.json')
    attends = res.data.data
    filteredAttends = attends
    renderAttendConfirm()
    updateSummaryCounts()
  } catch (err) {
    console.error('Error fetching attendance data:', err)
  }
}

function renderAttendConfirm() {
  const app = document.getElementById('app')

  app.innerHTML = `
    <div class="attendConfirmWrap">
       <div class="attend-Confirm">
         <div class="title-wrap">
           <h2>입퇴실 기록</h2>
           <div class="search-wrap">
             <a href="./" class="move-btn">입/퇴실 등록하기 > </a>
           </div>
         </div> 
         <div class="summary-wrap">
           <h4>입퇴실 Summary</h4>
           <div class="summary-btns">
             <div class="s-btn whole active">
               <div class="icon"><span class="material-symbols-outlined">business_center</span></div>
               <div class="txt">전체</div>
             </div>
             <div class="s-btn done">
               <div class="icon"><span class="material-symbols-outlined">work_history</span></div> 
               <div class="txt">
                 <p>정상출석일</p>
                 <p><span class="num doneNum"></span>일</p>
               </div>
             </div>
             <div class="s-btn notYet">
               <div class="icon"><span class="material-symbols-outlined">unknown_5</span></div>
               <div class="txt">
                 <p>미처리</p>
                 <p><span class="num notYetNum"></span>일</p>
               </div>
             </div>
             <div class="s-btn eitherOne">
               <div class="icon"><span class="material-symbols-outlined">business_center</span></div>
               <div class="txt">
                 <p>실제 입퇴실 등록일</p>
                 <p><span class="num eitherNum"></span>일</p>
               </div>
             </div>
           </div>
         </div>
         <table id="table-wrap">
           <thead>
             <tr>
               <th>구분</th>
               <th>일자</th>
               <th>입실시간</th>
               <th>퇴실시간</th>
               <th>총 학습시간</th>
               <th>상태</th>
             </tr>
           </thead>
           <tbody id="table-body">
           </tbody>
         </table>
         <div id="pagination" class="pagination"></div>
       </div>
     </div>
  `;

  const wholeBtn = document.querySelector('.s-btn.whole')
  const doneBtn = document.querySelector('.s-btn.done')
  const notYetBtn = document.querySelector('.s-btn.notYet')
  const eitherBtn = document.querySelector('.s-btn.eitherOne')

  wholeBtn.addEventListener('click', () => {
    filterAttend('whole')
    setActiveBtn(wholeBtn)
  });
  doneBtn.addEventListener('click', () => {
    filterAttend('done')
    setActiveBtn(doneBtn)
});
  notYetBtn.addEventListener('click', () => {
    filterAttend('notYet')
    setActiveBtn(notYetBtn)
  });
  eitherBtn.addEventListener('click', () => {
    filterAttend('eitherOne')
    setActiveBtn(eitherBtn)
  });

  renderTable(filteredAttends)
}

function setActiveBtn(activeBtn) {
  document.querySelectorAll('.summary-btns .s-btn').forEach(btn => {
    btn.classList.remove('active')
  });

  activeBtn.classList.add('active')
}

function filterAttend(filterType) {
  currentPage = 1

  switch (filterType) {
    case 'whole':
      filteredAttends = attends
      break;
    case 'done':
      filteredAttends = attends.filter(attend => attend.in && attend.out)
      break;
    case 'notYet':
      filteredAttends = attends.filter(attend => !attend.in && !attend.out)
      break;
    case 'eitherOne':
      filteredAttends = attends.filter(attend => attend.in || attend.out)
      break;
    default:
      break;
  }

  renderTable(filteredAttends)
}

function renderTable(filteredAttend) {
  const attendTable = document.getElementById('table-body')
  attendTable.innerHTML = ''

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, filteredAttend.length)

  filteredAttend.slice().reverse().slice(startIndex, endIndex).forEach((attend) => {
    const trItem = document.createElement('tr');
    trItem.classList.add('attend-tr')
    trItem.innerHTML = `
      <td data-label="구분">${attend.id}</td>
      <td data-label="일자">${attend.date}</td>
      <td data-label="입실시간">${attend.in || '-'}</td>
      <td data-label="퇴실시간">${attend.out || '-'}</td>
      <td data-label="총 학습시간">${attend.time || '-'}</td>
      <td data-label="상태"><span class="${attend.status === '미처리' ? 'notyet' : ''}">${attend.status}</span></td>
    `
    attendTable.appendChild(trItem)
  });

  attendPagination(filteredAttend.length)
}

function attendPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const pagination = document.getElementById('pagination')
  pagination.innerHTML = '';

  // 페이지 버튼 생성 함수
  const createPageButton = (page) => {
    const button = document.createElement('button');
    button.textContent = page;
    button.classList.add('page-button')
    if (page === currentPage) {
      button.classList.add('active')
    }
    button.addEventListener('click', () => {
      currentPage = page;
      renderTable(filteredAttends)
    });
    return button;
  };

  pagination.appendChild(pageArrow('left', currentPage === 1))

  for (let i = 1; i <= totalPages; i++) {
    pagination.appendChild(createPageButton(i))
  }

  pagination.appendChild(pageArrow('right', currentPage === totalPages))
}

function pageArrow(direction, disabled) {
  const arrow = document.createElement('button')
  arrow.textContent = direction === 'left' ? '<' : '>'
  arrow.classList.add('page-arrow')
  if (disabled) {
    arrow.classList.add('disabled')
  } else {
    arrow.addEventListener('click', () => {
      currentPage = direction === 'left' ? currentPage - 1 : currentPage + 1
      renderTable(filteredAttends)
    });
  }
  return arrow;
}

function updateSummaryCounts() {
  const doneCount = attends.filter(attend => attend.in && attend.out).length;
  const notYetCount = attends.filter(attend => !attend.in && !attend.out).length;
  const eitherCount = attends.filter(attend => attend.in || attend.out).length;

  document.querySelector('.doneNum').textContent = doneCount;
  document.querySelector('.notYetNum').textContent = notYetCount;
  document.querySelector('.eitherNum').textContent = eitherCount;
}