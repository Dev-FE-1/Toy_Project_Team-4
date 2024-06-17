import "./signup.css"
// import { setupCounter } from "./counter.js"

export async function signup() {
  document.querySelector("body").innerHTML = `
  <section id="signup-main">
<div class="wrapper">
        <div class="signupTop">
          <div class="logoNtext">
            <img src="./public/images/fast_campus_logo.png" alt="페스트넷로고" />
            <div class="signupText1">회원가입</div>
          </div>
          <div class="signupText2">과정에 참여하신 것을 환영합니다 !</div>
        </div>
        <form action="" id="signupForm">
                    <div class='choice'>
              <input type="radio" name="gender" id="student" checked />수강생
              <input type="radio" name="gender" id="manager" />매니저
              <label id='managerCode'></label>
            </div>
          <div>
            <input type="text" placeholder="성명" class="name" />
            </div>
          
          <div class="newUsersEmail">
            <input
              type="email"
              id="usersEmail"
              placeholder="Google 이메일을 입력해주세요."
            />
            <button class="emailbtn">중복확인</button>
          </div>
          <div><span>사용 할 수 없는 이메일입니다.</span></div>
          <div class="newUsersPw">
            <input
              type="password"
              id="usersPw1"
              placeholder="비밀번호 입력 (문자, 숫자, 특수문자 포함 8~12자)"
            />
            <span>12자 이내의 비밀번호를 입력해주세요.</span>
          </div>
          <div class="newUsersPw2">
            <input
              type="password"
              id="usersPw2"
              placeholder="비밀번호 재입력"
            />
            <span class="doNotPw">비밀번호가 일치하지 않습니다.</span>
          </div>
          <label class="consent">개인정보 수집·이용 동의서</label>
          <div class="consentText">
            이와 관련하여 아래와 같이 귀하의 개인정보를 수집 및 이용 내용을
            개인정보보호법 제 15조(개인정보의 수집·이용)및 통계법(비밀의 보호
            등)에 의거하여 안내드리니 확인하여 주시기 바랍니다.<br />
            <br />
             개인정보의 수집·이용 목적 : 과정 안내를 위한 정보 수집<br />
             수집하려는 개인정보의 필수 항목 : 성명, 이메일<br />
             개인정보의 보유 및 이용 기간 : 과정 종료 후 6개월 이내 폐기<br />
            <br />
            ※ 개인정보보호법에 의거하여 개인정보 수집 및 이용에 따른 동의를
            거부할 수 있으나, 동의를 거부할 경우 과정 참여에 따르는 기타
            제공되는 헤택을 받을 수 없습니다.
          </div>
          <div class="consentCheck">
            <input
              type="radio"
              name="consent"
              id="notConsent"
              checked
            />동의하지 않음
            <input type="radio" name="consent" id="consent" />동의함
          </div>
          <div class="submitBtnArea">
            <button class="submitBtn" type="submit">가입하기</button>
          </div>
        </form>
      </div>
      </section>
  `
  const manager = document.querySelector('#manager')
  manager.addEventListener('click', changeElement)

}
document.addEventListener("DOMContentLoaded", signup)


function changeElement(){
  const student = document.querySelector('#student')
  const managerCode = document.querySelector('#managerCode')
  managerCode.innerHTML=`<input type='text' id='code' placeholder='사내 인증코드'/>`
  if(student.checked === true){
    managerCode.innerHTML=''
  }
  student.addEventListener('click',changeElement)
}



