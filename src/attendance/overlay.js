export function loadOverlay() {
  const overlay = document.querySelector('.overlay');
  if (overlay) {
    overlay.innerHTML = `
    <div class="modal">
      <p><span class="check"></span> 하시겠습니까?</p>
      <div class="modal-wrap">
        <button id="submitModal">예</button>
        <button id="closeModal">아니오</button>
      </div>
    </div>
    `
  }
}
