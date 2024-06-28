export function loadModal() {
  const profilemodal = document.querySelector(".profilemodal")
  if (profilemodal) {
    profilemodal.innerHTML = `
    <div class="profilemodalpage">
          <p>수정 하시겠습니까?</p>
          <div class="modal-wrap">
            <button id="submitModal">예</button>
            <button id="closeModal">아니오</button>
          </div>
        </div>
    `
  }
  return profilemodal
}
export const loadprofilemodal = () => {
  const profilemodal = document.querySelector(".profilemodalpage")
  const checkYes = document.querySelector("#submitModal")
  const checkNo = document.querySelector("#closeModal")
  profilemodal.classList.add("active")
  checkYes.addEventListener("click", setlocalStorage)
  checkNo.addEventListener("click", profilemodal.classList.remove("active"))
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
