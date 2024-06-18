import "./login.css";
import { onLoginSuccess } from "../main";
import { signup } from "./signup";
import axios from "axios";

export function loadLogin() {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = `
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
  `;

  const signupPageOpen = document.querySelector("#signupPage");
    signupPageOpen.addEventListener("click", (e) => {
      e.preventDefault();
      signup();
    });

  const loginBtn = document.querySelector('.loginBtn')
  loginBtn.addEventListener('click', handleLogin); // handleLogin 함수를 참조하도록 수정
  }
}
document.addEventListener("DOMContentLoaded", loadLogin);

async function handleLogin() { // async 키워드 추가
  const email = document.querySelector(".userId").value;
  const password = document.querySelector(".userPw").value;

  try {
    const response = await axios.get('/api/users.json');
    const users = response.data.data;

    let userFound = false;
    for (let user of users) {
      if (user.email === email) {
        userFound = true;
        if (user.pw === password) {
          alert("로그인 성공!");
          localStorage.setItem('isLoggedIn', 'true'); // 로그인 상태 저장
          localStorage.setItem('userEmail', email); // 사용자 이메일 저장
          onLoginSuccess(); // 로그인 성공 시 메인 페이지 로드
          return; // 로그인 성공 시 함수 종료
        } else {
          alert("비밀번호를 다시 입력해주세요.");
          return;
        }
      }
    }

    if (!userFound) {
      alert("회원 정보가 없습니다.");
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    alert("로그인 중 오류가 발생했습니다. 다시 시도해 주세요.");
  }
}