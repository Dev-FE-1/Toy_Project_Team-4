import "./todolist.css"
import { loadCalendar } from "../calendar/calendar.js"

export function todolist () {
  const calendar = document.getElementById("calendar")

  if (calendar) {
    calendar.innerHTML = `
      <section id="mainNotice">
        <div class="calendar"></div>
        <div class="todolist">
          <h4>오늘의 업무</h4>
          <div class="todolist-wrap">
            <div class="todo">
              <a href="/manager-going-out"></a>
              <div class="img-wrap">
                <img src="" alt="외출/조퇴" />
              </div>
              <p>대기 중인 외출/조퇴 신청 건이 <span class="case">03</span> 건 입니다.</p>
            </div>
            <div class="todo">
              <a href="/manager-vacation"></a>
              <div class="img-wrap">
                <img src="" alt="휴가" />
              </div>
              <p>대기 중인 휴가 신청 건이 <span class="case"></span> 건 입니다.</p>
            </div>
            <div class="todo">
              <a href="/manager-public-house"> </a>
              <div class="img-wrap">
                <img src="" alt="공가" />
              </div>
              <p>대기 중인 공가 신청 건이 <span class="case"></span> 건 입니다.</p>
            </div>
          </div>
        </div>
      </section>
    `
    loadCalendar()
    return calendar
  }
}