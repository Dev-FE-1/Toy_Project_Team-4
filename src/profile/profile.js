import "./profile.css"
import axios from "axios"

export function profile() {
  const app = document.querySelector("#app")
  app.innerHTML = `
    <section id="profile-section">
      <div class="profileArea">
        <div class="profile-top">
          <div class="user-img"></div>
        </div>
        <div class="profile-bottom">
          <div>
            <span class="material-symbols-outlined"> person </span>
            <input id="userName" type="text" readonly=true/>
          </div>
          <div>
            <span class="material-symbols-outlined"> mail </span>
            <input id="userEmail" type="text" readonly=true/>
          </div>
          <div>
            <span class="material-symbols-outlined"> language </span>
            <input id="userUrl" type="text" />
          </div>
          <div>
            <span class="material-symbols-outlined"> campaign </span>
            <textarea id="userIntro" type="text" /></textarea>
          </div>
          <button>수정하기</button>
        </div>
      </div>
    </section>
    `
  getUserInfo()
  return app
}
// users.json에 입력된 배경이미지, 프로필사진, 이름, 이메일 가져오기
async function getUserInfo() {
  const userBgImage = document.querySelector(".profile-top")
  const userImage = document.querySelector(".user-img")
  const userEmail = document.querySelector("#userEmail")
  const userName = document.querySelector("#userName")

  const res = await axios.get("/api/users.json")
  const users = res.data.data

  // 로그인시 저장된 로컬스토리지 아이디
  const getlocalStorage = localStorage.getItem("userEmail")

  for (let user of users) {
    if (user.email == getlocalStorage) {
      if (userEmail != null) {
        userEmail.value = getlocalStorage
        userName.value = user.name
        userBgImage.setAttribute("style", `background-image : url("${user.background}")`)
        userImage.setAttribute("style", `background-image : url("${user.profileImage}")`)
        break
      }
    }
  }
}
