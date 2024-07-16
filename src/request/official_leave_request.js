import "./official_leave_request.css"
import JSZip from "jszip"
import { saveAs } from "file-saver"

export function loadOfficialLeaveRequest() {
  document.getElementById("app").innerHTML = `
    <div class="official-leave-container">
      <h1><img src="./images/official-leave.png" alt="Official Leave Icon" class="official-leave-icon">공가 신청</h1>
      <div class="official-leave-both-container">
        <div class="official-leave-process-container">
          <div class="official-leave-process-list">
                <h3>1. 공가 신청 프로세스</h3>
                <p>공가 신청서 제출 -> 임시 승인 -> 공가 종료 후 서류 제출 -> 최종 승인</P>
                <br>
                <a href="https://www.notion.so/6cc37ff52d33470badc0b7d04f5c1ca1?pvs=21" download class="official-link" target="_blank">출석 인정 사유 및 제출 서류</a>
                <br>
                <br>
                <h3>2. 필요 자료 제작</h3>
                <div class="download-link-container">
                    <span class="material-symbols-outlined download-icon">download</span>
                    <a href="/images/프론트엔드 개발 부트캠프_4기(DEV_FE1) 출석대장.docx" download class="download-link">출석대장 다운로드</a>
                </div>
                <p>작성 후 PDF 파일로 변환<br>파일명: <span class="ex">'공가 시작날짜_데브캠프 : 프론트엔드 개발 4회차_성함(출석대장)'</span></p>
                <br>
                <p>증빙 서류를 PDF 파일로 변환<br>파일명: <span class="ex">'날짜_데브캠프 : 프론트엔드 개발 4회차_성함(서류명)'</span></p>
                <br>
                <h3>3. 필요 자료 폴더링</h3>
                <p>출석대장과 증빙 서류를 하나의 폴더에 포함 및 압축<br>폴더명: <span class="ex">'공가 시작날짜_데브캠프 : 프론트엔드 개발 4회차_이름(공가)'</span></p>
          </div>
        </div>
        <div class="official-leave-status-container">
          <div class="official-leave-status-content">
            <div class="official-leave-status-header">
              <span><span class="red-dot"></span>신청 현황</span>
            </div>
            <div class="status-table-container">
              <table class="status-table">
                <thead>
                  <tr>
                    <th>상태</th>
                    <th>신청 종류</th>
                    <th>제출 일자</th>
                    <th>비고</th>
                  </tr>
                </thead>
                <tbody id="status-table-body">
                  <!-- 자바스크립트로 내용 추가 -->
                </tbody>
              </table>
            </div>
            <div class="official-leave-pagination-container">
              <button class="prev-button"><</button>
              <div class="number-btn-wrapper"></div>
              <button class="next-button">></button>
            </div>
            <div class="official-leave-modal-btn-container">
              <button id="officialLeaveRequestBtn" class="official-leave-modal-btn">공가 신청</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="officialLeaveModal" class="official-leave-modal">
      <div class="official-leave-modal-content">
        <span class="official-leave-modal-close-btn">&times;</span>
        <div class="official-leave-form-container" id="officialleaveFormContainer">
          <h2>신청서 제출</h2>
          <form id="officialLeaveForm">
            <div class="official-leave-all-section">
              <label for="startDate">시작일</label>
              <input type="date" id="startDate" name="startDate" required>
              <label for="endDate">종료일</label>
              <input type="date" id="endDate" name="endDate" required>
              <label for="reason">사유</label>
              <textarea id="reason" rows="6" name="reason" required></textarea>
            </div>
            <button type="submit" class="official-leave-btn">제출</button>
          </form>
        </div>
      </div>
    </div>

    <div id="documentSubmitModal" class="official-leave-modal">
      <div class="official-leave-modal-content">
        <span class="official-leave-modal-close-btn">&times;</span>
        <div class="official-leave-form-container" id="officialLeaveFormContainer">
          <h2>서류 제출</h2>
          <div class="convert-press-container">
            <label for="convertpress">파일 변환</label>
            <div class="official-leave-pdf-container">
              <input type="file" id="wordFile" name="wordFile" accept=".doc,.docx" required>
              <button type="button" id="convertToPDFBtn" class="convertpdf">PDF 변환</button>
            </div>
            <div class="official-leave-zip-container">
              <input type="file" id="fileInput" name="fileInput" multiple required>
              <button type="button" id="createZipBtn" class="createzip">ZIP 압축</button>
            </div>
          </div>
          <form id="documentSubmitForm">
            <label for="finalFile">파일 첨부</label>
            <div class="document-submit-all-section">
              <input type="file" id="documents" name="documents" required>
            </div>
            <button type="submit" class="document-submit-btn">제출</button>
          </form>
        </div>
      </div>
    </div>
  `;

  const modal = document.getElementById("officialLeaveModal")
  const documentModal = document.getElementById("documentSubmitModal")
  const openModalBtn = document.getElementById("officialLeaveRequestBtn")
  const closeBtns = document.getElementsByClassName("official-leave-modal-close-btn")

  openModalBtn.onclick = () => modal.style.display = "block"

  Array.from(closeBtns).forEach(btn => {
    btn.onclick = function() {
      modal.style.display = "none"
      documentModal.style.display = "none"
    }
  })

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none"
    }
    if (event.target == documentModal) {
      documentModal.style.display = "none"
    }
  }

  let requestData = []
  let currentPage = 1
  const itemsPerPage = 5
 

  async function loadRequestData() {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      let url = `/get-official-leave-request?userName=${userInfo.userName}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Received data is not an array');
      }
      requestData = data;
      displayData();
    } catch (error) {
      console.error('Error:', error);
      alert('공가 신청 데이터를 불러오는 데 실패했습니다: ' + error.message);
    }
  }

  function openDocumentSubmitModal(id) {
    const documentModal = document.getElementById("documentSubmitModal");
    documentModal.style.display = "block";
    document.getElementById('documentSubmitForm').setAttribute('data-id', id);
  }

  function displayData() {
    const tableBody = document.getElementById("status-table-body");
    tableBody.innerHTML = ""; // 기존 데이터를 지우고 새 데이터를 표시합니다.
  
    // 최신 항목이 위로 오도록 정렬
    const sortedData = requestData.slice().sort((a, b) => new Date(b.submitDate + 'T' + b.submitTime + 'Z') - new Date(a.submitDate + 'T' + a.submitTime + 'Z'));
  
    const pageData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    pageData.forEach((item, index) => {
      const row = document.createElement('tr');
  
      // submitDate와 submitTime을 로컬 시간으로 변환
      const submitDateTime = new Date(item.submitDate + 'T' + item.submitTime + 'Z');
      const kstSubmitDateTime = new Date(submitDateTime.getTime() + (9 * 60 * 60 * 1000));
      const localSubmitDate = kstSubmitDateTime.toLocaleDateString();
      const localSubmitTime = kstSubmitDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const formattedSubmitDate = `${localSubmitDate} ${localSubmitTime}`;
  
      row.innerHTML = `
        <td><span class="status-${item.status}">${getStatusText(item)}</span></td>
        <td>${item.type}</td>
        <td>${formattedSubmitDate}</td>
        <td>
          ${item.status === 'rejected' ? `
            ${item.rejectReason || ''}
            ${item.documentSubmitted ? 
              `<button class="submit-document-btn" data-id="${item.id}">서류 제출</button>` : 
              `<button class="cancel-btn" data-id="${item.id}">취소</button>`
            }
          ` : ''}
          ${item.status === 'pending' ? `<button class="cancel-btn" data-id="${item.id}">취소</button>` : ''}
          ${(item.status === 'approved' && !item.documentSubmitted) ? `<button class="submit-document-btn" data-id="${item.id}">서류 제출</button>` : ''}
          ${item.status === 'completed' ? '승인 완료' : ''}
        </td>
      `;
      tableBody.appendChild(row);
    });
  
    document.querySelectorAll('.cancel-btn').forEach(button => {
      button.addEventListener('click', function() {
        cancelRequest(this.getAttribute('data-id'));
      });
    });
  
    document.querySelectorAll('.submit-document-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        openDocumentSubmitModal(this.getAttribute('data-id'));
      });
    });
  
    setPageButtons();
  }
  
  function setPageButtons() {
    const totalPageCount = Math.ceil(requestData.length / itemsPerPage)

    const numberBtnWrapper = document.querySelector(".number-btn-wrapper")
    if (numberBtnWrapper != null) {
      numberBtnWrapper.innerHTML = ""
      for (let i = 0; i < totalPageCount; i++) {
        const button = document.createElement('button')
        button.textContent = i + 1
        button.classList.add('pagebtn')
        if (i === currentPage - 1) {
          button.classList.add('btnFocus')
        }
        button.addEventListener('click', function() {
          currentPage = parseInt(this.textContent)
          displayData()
          changeBtn(this.textContent)
          arrBtn()
        })
        numberBtnWrapper.appendChild(button)
      }
    }
    arrBtn()
  }

  function arrBtn() {
    const prevBtn = document.querySelector(".prev-button")
    const nextBtn = document.querySelector(".next-button")
    const btnFocus = document.querySelector(".btnFocus")
    const pageNumberBtn = document.querySelectorAll(".pagebtn")

    if (!btnFocus || pageNumberBtn.length === 0) {
      if (prevBtn) prevBtn.classList.remove("color")
      if (nextBtn) nextBtn.classList.remove("color")
      return
    }

    let btnNum = Array.from(pageNumberBtn).map(btn => btn.textContent)
    let maxNum = Math.max(...btnNum)
    let minNum = Math.min(...btnNum)

    if (Number(btnFocus.textContent) == minNum) {
      nextBtn.classList.add("color")
      prevBtn.classList.remove("color")
    } else if (Number(btnFocus.textContent) == maxNum) {
      nextBtn.classList.remove("color")
      prevBtn.classList.add("color")
    } else {
      nextBtn.classList.add("color")
      prevBtn.classList.add("color")
    }
  }

  async function cancelRequest(id) {
    try {
      const response = await fetch('/delete-official-leave-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      alert('공가 신청이 취소되었습니다.')
      await loadRequestData()
    } catch (error) {
      console.error('Error:', error)
      alert('공가 신청 취소 중 오류가 발생했습니다: ' + error.message)
    }
  }

  function changeBtn(clickBtnNum) {
    const buttons = document.querySelectorAll('.pagebtn')
    buttons.forEach(button => {
      if (button.textContent === clickBtnNum) {
        button.classList.add('btnFocus')
      } else {
        button.classList.remove('btnFocus')
      }
    })
  }

  function getStatusText(item) {
    if (item.status === "pending") return "임시 승인 대기중"
    if (item.status === "approved" && !item.documentSubmitted) return "임시 승인"
    if (item.status === "finalPending") return "최종 승인 대기중"
    if (item.status === "finalApproved") return "최종 승인"
    if (item.status === "completed") return "승인 완료"
    if (item.status === "rejected") return "반려"
    return "알 수 없음"
  }
  
  document.getElementById('documentSubmitForm').onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = e.target.getAttribute('data-id');
    formData.append('id', id);
    try {
      const response = await fetch('/upload-official-leave-request', {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      alert(result.message || '서류가 제출되었습니다. 최종 승인 대기중입니다.');
      documentModal.style.display = "none";
      await loadRequestData();
    } catch (error) {
      console.error('Error:', error);
      alert('서류 제출 중 오류가 발생했습니다: ' + error.message);
    }
  };

  document.getElementById('officialLeaveForm').onsubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())
    data.name = JSON.parse(localStorage.getItem('userInfo')).userName

    // startDate를 localStorage에 저장
    localStorage.setItem('leaveStartDate', data.startDate)

    try {
      const response = await fetch('/upload-official-leave-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      alert('공가 신청서가 제출되었습니다.')
      modal.style.display = "none"
      await loadRequestData()
    } catch (error) {
      console.error('Error:', error)
      alert('공가 신청서 제출 중 오류가 발생했습니다: ' + error.message)
    }
  }

  document.getElementById("convertToPDFBtn").addEventListener("click", () => {
    const file = document.getElementById("wordFile").files[0]
    const startDate = localStorage.getItem("leaveStartDate")

    const courseName = '데브캠프 : 프론트엔드 개발 4회차'

    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (!userInfo || !userInfo.userName) {
      alert("로그인된 사용자 정보를 찾을 수 없습니다.")
      return
    }

    const userName = userInfo.userName

    const fileName = `${startDate}_${courseName}_${userName}(출석대장).pdf`

    if (file) {
      const formData = new FormData()
      formData.append("wordFile", file)
      formData.append("fileName", fileName)

      fetch("/convert", {
        method: "POST",
        body: formData,
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.blob()
      })
      .then(blob => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      })
      .catch(error => {
        console.error('Error:', error);
        alert("파일 업로드 중 오류가 발생했습니다: " + error.message)
      })
    }
  })

  document.getElementById("createZipBtn").addEventListener("click", async () => {
    const files = document.getElementById('fileInput').files
    const startDate = localStorage.getItem("leaveStartDate")

    const courseName = '데브캠프 : 프론트엔드 개발 4회차'

    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (!userInfo || !userInfo.userName) {
      alert("로그인된 사용자 정보를 찾을 수 없습니다.")
      return
    }

    const userName = userInfo.userName

    const fileName = `${startDate}_${courseName}_${userName}(공가).zip`

    const zip = new JSZip()
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      zip.file(file.name, file)
    }

    zip.generateAsync({ type: 'blob' })
      .then(function(content) {
        saveAs(content, fileName)
      })
      .catch(function(error) {
        console.error('Error:', error);
        alert("ZIP 파일 생성 중 오류가 발생했습니다: " + error.message)
      })
  })

  loadRequestData()

  const prevBtn = document.querySelector(".prev-button")
  const nextBtn = document.querySelector(".next-button")
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--
      displayData()
      changeBtn(currentPage.toString())
      arrBtn()
    }
  })
  nextBtn.addEventListener("click", () => {
    if (currentPage < Math.ceil(requestData.length / itemsPerPage)) {
      currentPage++
      displayData()
      changeBtn(currentPage.toString())
      arrBtn()
    }
  })
}
