import "./login.css"
import { mainPage } from "../main"
// import './main.css';
// import './styles/sidebar.css';
// import './styles/header.css';
// import './styles/home.css';
// import { loadSidebar } from './components/Sidebar.js';
// import { createHeader } from './components/header.js';
// import { loadHome } from './components/home.js';
import { signup } from "./signup"
import axios from "axios"

function login() {
  document.querySelector("body").innerHTML = `
  <section id="login-main">
  <form action="" id="loginForm">
        <div class="loginForm-top">
          <img src="./public/images/fast_campus_logo.png" alt="페스트넷로고" />
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
            <input type="checkbox" id="rememberEmail" /> 이메일 기억하기</label
          >
        </div>
        <div class="pageMove">
          <button id="pwFind">비밀번호 찾기</button>
          <button id="signupPage">회원가입</button>
        </div>
        <button type="button" class="loginBtn">로그인</button>
      </form>
      </section>
  `
  const signupPageOpen = document.querySelector("#signupPage")
  signupPageOpen.addEventListener("click", signup)
  const loginBtn = document.querySelector('.loginBtn')
loginBtn.addEventListener('click', getId)
}
document.addEventListener("DOMContentLoaded", login)


function getId(rows) {
    const getUsersId = async () => {
      let msg = "";
      const res = await axios.get(`/api/users.json?`)
      if( res.status === 200 ){
        rows = res.data.data
        const email = document.querySelector('.userId').value
        const pw = document.querySelector('.userPw').value
        
        for( let i = 0; i < rows.length; i++ ){
          if ( rows[i].email == email ){
            if( rows[i].pw == pw ) {
              document.addEventListener('DOMContentLoaded', mainPage)
              break
            } else{
              msg = "비밀번호를 다시 입력해주세요."
              break
            }
          } else {
            msg = "회원 정보가 없습니다."
            break
          }
        }

        alert(msg);
      }
      
      
      
      //   {
      //   console.log(rows[0].email, rows[1].email)
      // }
    }
    getUsersId()
  }