import "./signup.css"
import axios from "axios"

export class SignupPage {
  constructor() {
    this.render()
    this.addEventListeners()

    // 최종 가입하기 유효성 검사 변수
    this.emailValidation = false
    this.emailRegexValidation = false
    this.pwValidation = false
    this.usersNameValidation = false
    this.consentValidation = false
    this.codeValidation = false
    this.phoneValidation = false
  }

  render() {
    document.querySelector("body").innerHTML = `
      <section id="signup-main">
        <div class="wrapper">
          <div class="signupTop">
            <div class="logoNtext">
              <img src="../../../public/icon/fast_campus_logo.png" alt="페스트넷로고" />
              <div class="signupText1">회원가입</div>
            </div>
            <div class="signupText2">과정에 참여하신 것을 환영합니다 !</div>
          </div>
          <form action="" id="signupForm">
            <div class='choice'>
              <input type="radio" name="role" id="student" checked />수강생
              <input type="radio" name="role" id="manager" />매니저
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
          <div><span class="emailText">사용 할 수 없는 이메일입니다.</span></div>
          <div class="newUsersPw">
            <input
              type="password"
              id="usersPw1"
              placeholder="비밀번호 입력 (문자, 숫자, 특수문자 포함 8~12자)"
            />
            <span class="pwLength">12자 이내의 비밀번호를 입력해주세요.</span>
          </div>
          <div class="newUsersPw2">
            <input
              type="password"
              id="usersPw2"
              placeholder="비밀번호 재입력"
            />
            <span class="doNotPw">비밀번호가 일치하지 않습니다.</span>
          </div>
          <div class="phone">
            <input
              type="text"
              id="phone"
              placeholder="전화번호 입력"
            />
            <span class="phoneForm">010-0000-0000 형태로 입력해주세요.</span>
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
            <label for="notConsent"><input type="radio" name="consent" id="notConsent" checked/> 동의하지 않음</label>
            <label for="consent"><input type="radio" name="consent" id="consent" /> 동의함</label>
          </div>
          <div class="submitBtnArea">
            <button class="submitBtn" type="submit">가입하기</button>
          </div>
        </form>
      </div>
      </section>
    `
  }

  addEventListeners() {
    // 이름 빈값 확인
    const usersName = document.querySelector(".name")
    usersName.addEventListener("input", () => {
      if (usersName.value === "") {
        this.usersNameValidation = false
      } else {
        this.usersNameValidation = true
      }
    })

    // 수강생, 매니저 구분 체크박스
    const manager = document.querySelector("#manager")
    const student = document.querySelector("#student")
    manager.addEventListener("click", () => this.changeElement())
    student.addEventListener("click", () => this.changeElement())

    // 이메일 유효성 검사
    const usersEmail = document.querySelector("#usersEmail")
    const emailError = document.querySelector(".emailText")
    const emailBtn = document.querySelector(".emailbtn")

    usersEmail.addEventListener("input", () => {
      const emailValue = usersEmail.value
      const emailRegex = /^[a-zA-Z0-9]+@gmail\.com$/
      if (emailRegex.test(emailValue)) {
        emailError.textContent = "중복 확인을 해주세요."
        emailError.setAttribute("style", "color : #ed234b")
        this.emailRegexValidation = true
        this.emailValidation = false
      } else {
        emailError.textContent = "사용 할 수 없는 이메일입니다."
        emailError.setAttribute("style", "color : #ed234b")
        this.emailRegexValidation = false
        this.emailValidation = false
      }
    })

    // 이메일 중복확인 버튼 클릭시 database에 저장된 이메일 값과 비교하는 유효성검사
    const checkEmail = async (event) => {
      event.preventDefault()
      if (this.emailRegexValidation) {
        const res = await axios.get("/api/users")
        const users = res.data.data

        for (let user of users) {
          if (user.email === usersEmail.value) {
            emailError.textContent = "중복된 이메일입니다."
            emailError.setAttribute("style", "color : #ed234b")
            this.emailValidation = false
            break
          } else {
            emailError.textContent = "이메일이 확인 되었습니다."
            emailError.setAttribute("style", "color : green")
            this.emailValidation = true
          }
        }
      } else {
        alert("이메일 형식을 확인해주세요.")
      }
    }

    emailBtn.addEventListener("click", checkEmail)
    usersEmail.addEventListener("keyup", (event) => {
      if (event.keyCode === 13) {
        checkEmail(event)
      }
    })

    // 비밀번호 유효성 검사
    const usersPw = document.querySelector("#usersPw1")
    const pwLength = document.querySelector(".pwLength")
    usersPw.addEventListener("input", () => {
      const pwValue = usersPw.value
      const pwRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/
      if (pwRegex.test(pwValue)) {
        pwLength.textContent = "확인되었습니다."
        pwLength.setAttribute("style", "color : green")
      } else {
        pwLength.textContent = "12자 이내의 비밀번호를 입력해주세요."
        pwLength.setAttribute("style", "color : #ed234b")
      }
      this.pwEqual(usersPw, usersPw2, doNotPw)
    })

    // 2차 비밀번호 유효성 검사
    const usersPw2 = document.querySelector("#usersPw2")
    const doNotPw = document.querySelector(".doNotPw")
    usersPw2.addEventListener("input", () => {
      this.pwEqual(usersPw, usersPw2, doNotPw)
    })

    // 전화번호 유효성 검사
    const userPhone = document.querySelector("#phone")
    const phoneFormText = document.querySelector(".phoneForm")
    userPhone.addEventListener("input", () => {
      const phoneValue = userPhone.value
      const phoneRegex = /^010-\d{3,4}-\d{4}$/
      if (phoneRegex.test(phoneValue)) {
        phoneFormText.textContent = "확인되었습니다."
        phoneFormText.setAttribute("style", "color : green")
        this.phoneValidation = true
      } else {
        phoneFormText.textContent = "010-0000-0000 형태로 입력해주세요."
        phoneFormText.setAttribute("style", "color : #ed234b")
      }
    })

    // 개인정보 동의 여부 검사
    const notConsent = document.querySelector("#notConsent")
    const consent = document.querySelector("#consent")
    consent.addEventListener("click", () => {
      if (consent.checked) {
        this.consentValidation = true
      }
    })

    notConsent.addEventListener("click", () => {
      if (notConsent.checked) {
        this.consentValidation = false
      }
    })

    // 최종 가입하기 버튼 클릭시 유효성 검사
    const signupBtn = document.querySelector(".submitBtn")
    signupBtn.addEventListener("click", (event) => {
      event.preventDefault()
      if (
        this.emailValidation &&
        this.pwValidation &&
        this.usersNameValidation &&
        this.consentValidation &&
        this.phoneValidation
      ) {
        alert("가입이 완료되었습니다. 로그인 화면으로 이동합니다.")
        location.reload(true)
      } else {
        alert("양식의 검증이 완료되지 않았습니다. 회원가입 정보를 확인해주십시오.")
      }
    })
  }

  // 비밀번호 1차와 2차가 같은지 유효성 검사 함수
  pwEqual(usersPw, usersPw2, doNotPw) {
    if (usersPw.value != "" && usersPw2.value != "") {
      if (usersPw.value === usersPw2.value) {
        doNotPw.textContent = "확인되었습니다."
        doNotPw.setAttribute("style", "color : green")
        this.pwValidation = true
      } else {
        doNotPw.textContent = "비밀번호가 일치하지 않습니다."
        doNotPw.setAttribute("style", "color : #ed234b")
        this.pwValidation = false
      }
    } else {
      doNotPw.textContent = "비밀번호가 일치하지 않습니다."
      doNotPw.setAttribute("style", "color : #ed234b")
      this.pwValidation = false
    }
  }

  // 매니저 체크되면 input박스 생성
  changeElement() {
    const student = document.querySelector("#student")
    const managerCode = document.querySelector("#managerCode")

    if (student.checked) {
      managerCode.innerHTML = ""
    } else {
      managerCode.innerHTML = `<input type='text' id='code' placeholder='사내 인증코드'/>`
    }
    // 사내 인증코드 유효성 검사
    const code = document.querySelector("#code")
    if (code != null) {
      code.addEventListener("input", () => {
        if (code.value === "team4") {
          this.codeValidation = true
        } else {
          this.codeValidation = false
        }
      })
    }
  }
}
