export function loadCheckInOut() {
  const toggleBtns = document.querySelectorAll(".attendance .toggle-btn");
  const overlay = document.querySelector(".overlay");
  const closeModalBtn = document.querySelector(".overlay .material-symbols-outlined");
  const submitModalYesBtn = document.getElementById('submitModal');
  const closeModalNoBtn = document.getElementById('closeModal');
  const checkText = document.querySelector(".overlay .check");

  checkText.textContent = "입실"

  
  toggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // overlay 표시
      overlay.classList.add("active");

      // .check의 텍스트 변경
      if (btn.classList.contains("checkin")) {
        checkText.textContent = "입실";
      } else if (btn.classList.contains("checkout")) {
        checkText.textContent = "퇴실";
      }
    });
  });

  submitModalYesBtn.addEventListener("click", () => {
    toggleBtns.forEach(btn => {
      // 현재 active 클래스를 가진 버튼의 active 클래스 제거
      if (btn.classList.contains("active")) {
        btn.classList.remove("active");
      } else {
        // 다른 버튼에 active 클래스 추가
        btn.classList.add("active");
      }
    });

    // overlay 닫기
    overlay.classList.remove("active");
  });

  closeModalBtn.addEventListener("click", () => {
    overlay.classList.remove("active");
  });
  closeModalNoBtn.addEventListener("click", () => {
    overlay.classList.remove("active")
  });
  

}