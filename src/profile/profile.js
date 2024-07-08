import "./profile.css"
import axios from "axios"
import { loadModal, loadprofilemodal } from "./profileModal"

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
            <span class="material-symbols-outlined"> phone_iphone </span>
            <input id="userPhone" type="text" />
          </div>
          <div>
            <span class="material-symbols-outlined"> language </span>
            <input id="userUrl" type="text" placeholder="블로그 주소를 작성해주세요." />
          </div>
          <div>
            <span class="material-symbols-outlined"> campaign </span>
            <textarea id="userIntro" type="text" placeholder="간단한 자기소개를 작성해주세요." /></textarea>
          </div>
          <button id="localStorageBtn">수정하기</button>
        </div>
        <div class="profilemodal"></div>
        <div class="loading-container" id="loadingOverlay">
          <div class="loading-animation">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
        </div>
        </div>
      </div>
    </section>
    `
  getUserInfo()
  loadModal()
  const setlocalStorageBtn = document.querySelector("#localStorageBtn")
  setlocalStorageBtn.addEventListener("click", () => {
    loadprofilemodal()
  })
  return app
}

async function getUserInfo() {
  const userBgImage = document.querySelector(".profile-top")
  const userImage = document.querySelector(".user-img")
  const userEmail = document.querySelector("#userEmail")
  const userName = document.querySelector("#userName")
  const userPhone = document.querySelector("#userPhone")
  const userUrl = document.querySelector("#userUrl")
  const userIntro = document.querySelector("#userIntro")
  const loadingContainer = document.querySelector(".loading-container")

  // users.json에 입력된 배경이미지, 프로필사진 가져오기
  const res = await axios.get("/api/users.json")
  const users = res.data.data

  // 로그인시 저장된 로컬스토리지 값 가져오기
  const getlocalStorage = JSON.parse(localStorage.getItem("userInfo"))

  for (let user of users) {
    if (user.email == getlocalStorage.userEmail) {
      if (userEmail != null) {
        userEmail.value = getlocalStorage.userEmail
        userName.value = getlocalStorage.userName
        userPhone.value = getlocalStorage.userPhone
        userBgImage.setAttribute("style", `background-image : url("${user.background}")`)
        userImage.setAttribute("style", `background-image : url("${user.profileImage}")`)
        userUrl.value = getlocalStorage.userUrl
        userIntro.value = getlocalStorage.userIntro

        loadingContainer.classList.add("hidden")
        break
      }
    }
  }
}
