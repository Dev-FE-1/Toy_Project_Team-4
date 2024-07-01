import "./profile.css"

export function loadModal() {
  const profilemodal = document.querySelector(".profilemodal")
  if (profilemodal) {
    profilemodal.innerHTML = `
    <div class="profilemodalpage">
          <p>수정 하시겠습니까?</p>
          <div class="btnArea">
            <button id="submitModal">예</button>
            <button id="closeModal">아니오</button>
          </div>
        </div>
    `
  }
  const checkYes = document.querySelector("#submitModal")
  const checkNo = document.querySelector("#closeModal")
  checkYes.addEventListener("click", () => {
    setlocalStorage()
    profilemodal.classList.remove("active")
  })
  checkNo.addEventListener("click", () => {
    profilemodal.classList.remove("active")
  })
  return profilemodal
}

// 프로필 모달 띄우기
export const loadprofilemodal = () => {
  const profilemodal = document.querySelector(".profilemodal")
  profilemodal.classList.add("active")
}

// 유저 URL, Intro 로컬스토리지에 저장
const setlocalStorage = () => {
  const profilemodal = document.querySelector(".profilemodalpage")
  profilemodal.classList.remove("active")
  const userProfileInfo = {
    userUrl: document.querySelector("#userUrl").value,
    userIntro: document.querySelector("#userIntro").value,
  }
  const newUserInfo = Object.assign(JSON.parse(localStorage.getItem("userInfo")), userProfileInfo)
  localStorage.setItem("userInfo", JSON.stringify(newUserInfo))
}
