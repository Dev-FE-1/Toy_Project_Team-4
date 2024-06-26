import './attendConfirm.css'
//https://wehagothelp.zendesk.com/hc/ko/articles/5730890938905--%EA%B7%BC%ED%83%9C%EA%B4%80%EB%A6%AC-%EC%B6%9C%ED%87%B4%EA%B7%BC%EA%B8%B0%EB%A1%9D-%EB%A9%94%EB%89%B4-%EC%A1%B0%ED%9A%8C%ED%95%98%EA%B8%B0
export function loadAttendConfirm () {
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
                <input type="date" placeholder="Date" class="date-selector">
                <input type="date" placeholder="Date" class="date-selector">
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
        <div class="table-wrap">
          <table></table>
        </div>
      </div>
    </div>
  `
}