import './attendConfirm.css'
//https://wehagothelp.zendesk.com/hc/ko/articles/5730890938905--%EA%B7%BC%ED%83%9C%EA%B4%80%EB%A6%AC-%EC%B6%9C%ED%87%B4%EA%B7%BC%EA%B8%B0%EB%A1%9D-%EB%A9%94%EB%89%B4-%EC%A1%B0%ED%9A%8C%ED%95%98%EA%B8%B0
let attends = [
  {
    id: 1,
    date: '2024-06-16',
    in: '09:58',
    out: '19:01',
    time: '09:03',
    status: '정상처리',
  },
  {
    id: 2,
    date: '2024-06-16',
    in: '09:58',
    out: '19:01',
    time: '09:03',
    status: '정상처리',
  },
  {
    id: 3,
    date: '2024-06-16',
    in: '09:58',
    out: '19:01',
    time: '09:03',
    status: '정상처리',
  },
  {
    id: 4,
    date: '2024-06-16',
    in: '09:58',
    out: '19:01',
    time: '09:03',
    status: '정상처리',
  },
  {
    id: 5,
    date: '2024-06-16',
    in: '09:58',
    out: '19:01',
    time: '09:03',
    status: '정상처리',
  },
  {
    id: 6,
    date: '2024-06-16',
    in: '09:58',
    out: '19:01',
    time: '09:03',
    status: '정상처리',
  },
  {
    id: 7,
    date: '2024-06-16',
    in: '09:58',
    out: '19:01',
    time: '09:03',
    status: '미처리',
  },
]

const itemsPerPage = 6 //한 페이지에 6개씩
let currentPage = 1

export function loadAttendConfirm() {
  const app = document.getElementById('app')

  app.innerHTML = `
    <div class="attendConfirmWrap">
      <div class="attend-Confirm">
        <div class="title-wrap">
          <h2>입퇴실 기록</h2>
          <div class="search-wrap">
            <a href="./" class="move-btn">신청하기 > </a>
            <div class="date-range">
              <span>기간</span>
              <div class="date-wrap">
                <input type="date" required >
                <span>~</span>
                <input type="date" required >
              </div>
            </div>
          </div>
        </div> 
        <div class="summary-wrap">
          <h4>입퇴실 Summary</h4>
          <div class="summary-btns">
            <div class="s-btn">
              <div class="icon"><span class="material-symbols-outlined">business_center</span></div>
              <div class="txt">전체</div>
            </div>
            <div class="s-btn active">
              <div class="icon"><span class="material-symbols-outlined">work_history</span></div> 
              <div class="txt">
                <p>정상출석일</p>
                <p><span class="num">17</span>일</p>
              </div>
            </div>
            <div class="s-btn">
              <div class="icon"><span class="material-symbols-outlined">unknown_5</span></div>
              <div class="txt">
                <p>미처리</p>
                <p><span class="num">3</span>일</p>
              </div>
            </div>
            <div class="s-btn">
              <div class="icon"><span class="material-symbols-outlined">business_center</span></div>
              <div class="txt">
                <p>실제 입퇴실 등록일</p>
                <p><span class="num">1</span>일</p>
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
  `
  loadAttend()
}

function attendPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const pagination = document.getElementById('pagination')
  pagination.innerHTML = ''

  const createPageButton = (page) => {
    const button = document.createElement('button')
    button.textContent = page
    button.classList.add('page-button')
    if (page === currentPage) {
      button.classList.add('active')
    }
    button.addEventListener('click', () => {
      currentPage = page
      loadAttend()
    })
    return button
  }

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
      loadAttend()
    })
  }
  return arrow
}

function loadAttend() {
  const attendTable = document.getElementById('table-body')
  attendTable.innerHTML = ''

  const sortedAttend = [...attends].reverse() // 배열을 역순으로 정렬
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, sortedAttend.length)

  sortedAttend.slice(startIndex, endIndex).forEach((attend) => {
    const trItem = document.createElement('tr')
    trItem.classList.add('attend-tr')
    trItem.innerHTML = `
      <td>${attend.id}</td>
      <td>${attend.date}</td>
      <td>${attend.in}</td>
      <td>${attend.out}</td>
      <td>${attend.time}</td>
      <td><span class="${attend.status === '미처리' ? 'notyet' : ''}">${attend.status}</span></td>
    `
    attendTable.appendChild(trItem)
  })

  attendPagination(attends.length)
}
