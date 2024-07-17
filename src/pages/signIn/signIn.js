import "./signIn.css"
import { onLoginSuccess } from ".../main.js"
import { SignupPage } from "../signUp/signUp"
import axios from "axios"

export function loadLogin() {
  const app = document.getElementById("app")
  if (app) {
    app.innerHTML = `
  <section id="login-main">
  <form action="" id="loginForm">
        <div class="loginForm-top">
          <img src="../../../public/icon/fast_campus_logo.png" alt="페스트넷로고" />
          <div>로그인</div>
        </div>
        <div class="users-box">
          <span>이메일</span>
          <input
            type="text"
            placeholder="이메일 주소를 입력해 주세요."
            class="userId"
          />
        </div>
        <div class="users-box">
          <span>비밀번호</span>
          <input
            type="password"
            placeholder="비밀번호를 입력해 주세요."
            class="userPw"
          />
        </div>
        <div class="emailCheck">
          <label for="emailCheck">
            <input type="checkbox" id="emailCheck" checked/> 자동 로그인
            </label >
        </div>
        <div class="pageMove">
          <button id="pwFind">비밀번호 찾기</button>
          <button id="signupPage">회원가입</button>
        </div>
        <button type="submit" class="loginBtn">로그인</button>
      </form>
      </section>
  `
    const signupPageOpen = document.querySelector("#signupPage")
    signupPageOpen.addEventListener("click", (event) => {
      event.preventDefault()
      const signupPageInstance = new SignupPage()
    })

    const loginForm = document.querySelector("#loginForm")
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault()
      handleLogin()
    })

    const loginBtn = document.querySelector(".loginBtn")
    loginBtn.addEventListener("click", (event) => {
      event.preventDefault()
      handleLogin()
    })
  }
}

document.addEventListener("DOMContentLoaded", loadLogin)

// users.json에 입력된 이메일, 비밀번호와 비교 및 로컬스토리지에 이메일 저장
async function handleLogin() {
  const email = document.querySelector(".userId").value
  const password = document.querySelector(".userPw").value

  try {
    const res = await axios.get("/api/users.json")
    const users = res.data.data

    let userFound = false
    for (let user of users) {
      if (user.email === email) {
        userFound = true
        if (user.pw === password) {
          alert("로그인 성공!")
          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              userType: user.userType,
              userName: user.name,
              isLoggedIn: "true",
              userEmail: email,
              userUrl: "",
              userIntro: "",
              userImage: user.profileImage,
              userPhone: user.phone,
            })
          )
          onLoginSuccess()
          return
        } else {
          alert("비밀번호를 다시 입력해주세요.")
          return
        }
      }
    }

    if (!userFound) {
      alert("회원 정보가 없습니다.")
    }
  } catch (error) {
    console.error("Error fetching users:", error)
    alert("로그인 중 오류가 발생했습니다. 다시 시도해 주세요.")
  }
}
