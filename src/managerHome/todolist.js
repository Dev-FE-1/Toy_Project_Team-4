import axios from 'axios'
import "./todolist.css"
import { loadCalendar } from "../calendar/calendar.js"

async function getLeaveList() {
  try {
    const res = await axios.get("/server/data/leave_request.json")
    let leaveRequestList = res.data.request

    const goingOutCaseElement = document.querySelector(".case-going-out")
    if (goingOutCaseElement) {
      if(leaveRequestList.length < 10) {

        goingOutCaseElement.textContent = '0' + leaveRequestList.length
      } else {
        goingOutCaseElement.textContent = leaveRequestList.length
      }
    }
  } catch (err) {
    console.error("error", err)
  }
}

 async function getVacationList() {
  try {
    const res = await axios.get("/server/data/vacation_request.json")
    let vacationRequestList = res.data.request
    console.log(vacationRequestList)

    const holidayCaseElement = document.querySelector(".case-holiday")
    if (holidayCaseElement) {
      if(vacationRequestList.length < 10) {

        holidayCaseElement.textContent = '0' + vacationRequestList.length
      } else {
        holidayCaseElement.textContent = vacationRequestList.length
      }
    }
  } catch (err) {
    console.error("error", err)
  }
}

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
                <img src="../public/images/todolist-1.png" alt="외출/조퇴" />
              </div>
              <p>대기 중인 외출/조퇴 신청 건이 <span class="case case-going-out"></span> 건 입니다.</p>
            </div>
            <div class="todo">
              <a href="/manager-vacation"></a>
              <div class="img-wrap">
                <img src="../public/images/todolist-2.png" alt="휴가" />
              </div>
              <p>대기 중인 휴가 신청 건이 <span class="case case-holiday"></span> 건 입니다.</p>
            </div>
            <div class="todo">
              <a href="/manager-public-house"> </a>
              <div class="img-wrap">
                <img src="../public/images/todolist-3.png" alt="공가" />
              </div>
              <p>대기 중인 공가 신청 건이 <span class="case case-official"></span> 건 입니다.</p>
            </div>
            <div class="todo">
              <a href="javascript:void(0)"> </a>
              <div class="img-wrap">
                <img src="../public/images/todolist-4.png" alt="출결 정정" />
              </div>
              <p>대기 중인 출결 정정 요청 건이 <span class="case case-revise"></span> 건 입니다.</p>
            </div>
            <div class="todo">
              <a href="javascript:void(0)"> </a>
              <div class="img-wrap">
                <img src="../public/images/todolist-5.png" alt="문서 발급" />
              </div>
              <p>대기 중인 문서 발급 요청 건이 <span class="case case-document"></span> 건 입니다.</p>
            </div>
          </div>
        </div>
      </section>
    `
    loadCalendar()
    getLeaveList()
    getVacationList()
    return calendar
    
  }
}

