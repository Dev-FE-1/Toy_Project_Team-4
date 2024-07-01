// DOMContentLoaded 이벤트가 발생하면 실행되는 함수
document.addEventListener("DOMContentLoaded", () => {
    // loadButton과 loadingOverlay 요소를 가져옴
    const [button, loadingOverlay] = [
        "loadButton",
        "loadingOverlay",
    ].map((id) => document.getElementById(id));

    // 로딩 오버레이를 보여주는 함수
    const showLoading = () => {
        // hidden 클래스를 제거하여 로딩 오버레이를 표시
        loadingOverlay.classList.remove("hidden");
        // 1초 후에 hidden 클래스를 다시 추가하여 로딩 오버레이를 숨김
        setTimeout(() => loadingOverlay.classList.add("hidden"), 1000);
    };

    // 버튼 클릭 이벤트 리스너 추가
    button.addEventListener("click", (event) => {
        // 기본 동작(페이지 새로고침)을 막음
        event.preventDefault();
        // 로딩 오버레이를 보여줌
        showLoading();
        // 로그인 처리 후 페이지 이동 코드 추가 가능
    });
});
