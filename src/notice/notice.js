import axios from "axios"
import "./notice.css"

let noticeList = [] // 전역 범위에 선언

export function loadNotice() {
  const app = document.getElementById("app")

  app.innerHTML = `
    <section id="notice-section">
      <div class="notice-top">
        <h1>공지사항</h1>
      </div>
      <div class="notice-bottom">
        <div>
          <input
            type="search"
            class="form-control"
            style="margin-bottom: 5px"
            onkeydown="doSearch(event, this.value)"
            placeholder="원하는 키워드로 검색해보세요."
          />
        </div>
        <table class="table">
          <thead>
            <tr>
              <td onclick="sort('id')">No.</td>
              <td onclick="sort('date')">날짜</td>
              <td onclick="sort('title')">제목</td>
              <td onclick="sort('content')">내용</td>
              <td onclick="sort('userName')">작성자</td>
            </tr>
          </thead>
          <tbody class="bodytable"></tbody>
        </table>
      </div>
    </section>
  `

  setTimeout(getNoticeList, 0)
  return app
}

// notice.json 데이터 가져오기
async function getNoticeList() {
  try {
    const res = await axios.get("/api/notice.json")
    noticeList = res.data.data

    renderTable(noticeList)
  } catch (err) {
    console.error("error", err)
  }
}

// 검색 필터
function doSearch(e, keyword) {
  if (e.keyCode == 13) {
    const regexp = new RegExp(keyword, "gi")
    const data = noticeList.filter(
      (item) =>
        regexp.test(item.id) ||
        regexp.test(item.date) ||
        regexp.test(item.title) ||
        regexp.test(item.content) ||
        regexp.test(item.userName)
    )
    renderTable(data)
  }
}

// td에 내용 넣기
function renderTable(noticeList) {
  const oTable = document.querySelector(".bodytable")
  if (!oTable) {
    console.error("Table body element not found")
    return
  }
  const h = []
  noticeList.forEach((data) => {
    h.push("<tr>")
    h.push(`<td>${data.id}</td>`)
    h.push(`<td>${data.date}</td>`)
    h.push(`<td>${data.title}</td>`)
    h.push(`<td>${data.content}</td>`)
    h.push(`<td>${data.userName}</td>`)
    h.push("</tr>")
  })
  oTable.innerHTML = h.join("")
}

// sort를 클릭했을 때 정렬
function sort(sortField) {
  const sortOption = {
    id: true,
    date: true,
    title: true,
    content: true,
    userName: true,
  }

  if (sortOption[sortField]) {
    noticeList = noticeList.sort((a, b) => (a[sortField] < b[sortField] ? -1 : a[sortField] > b[sortField] ? 1 : 0))
  } else {
    noticeList = noticeList.sort((a, b) => (a[sortField] < b[sortField] ? 1 : a[sortField] > b[sortField] ? -1 : 0))
  }
  sortOption[sortField] = !sortOption[sortField]
  renderTable(noticeList)
}

// 전역 범위에 함수를 할당하여 HTML에서 호출할 수 있도록 함
window.sort = sort
window.doSearch = doSearch
