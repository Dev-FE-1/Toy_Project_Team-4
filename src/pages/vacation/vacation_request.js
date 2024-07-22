import "./vacation_request.css"
import JSZip from "jszip"
import { saveAs } from "file-saver"

export function loadVacationRequest() {
  const app = document.getElementById("app")

  app.innerHTML = `
    <div class="vacation-container">
      <h1><img src="/icon/vacation.png" alt="Vacation Icon" class="vacation-icon">휴가 신청</h1>
      <div class="vacation-both-container">
        <div class="vacation-process-container">
          <div class="vacation-process-list">
            <h3>1. 운영 매니저 상담</h3>
            <p>휴가 사용 2주 전, 운영 매니저와 상담하여 휴가 사용 여부 확인</p><br>
            <h3>2. 필요 자료 제작</h3>
            <div class="download-link-container">
              <span class="material-symbols-outlined download-icon">download</span>
              <a href="/document/프론트엔드 개발 부트캠프_4기(DEV_FE1) 출석대장.docx" download class="download-link">출석대장 다운로드</a>
            </div>
            <p>
              작성 후 PDF 파일로 변환<br>
              파일명: <span class="ex">'휴가 예정 날짜_데브캠프 : 프론트엔드 개발 4회차_성함(출석대장)'</span>
            </p>
            <div class="download-link-container">
              <span class="material-symbols-outlined download-icon">download</span>
              <a href="/images/[KDT] 휴가 사용 계획서_김패캠의 사본 - (시트 복제 후 사용)상담일자_휴가사용일자.docx" download class="download-link">
                휴가계획서 다운로드
              </a>
            </div>
            <p>
              작성 후 PDF 파일로 변환<br>
              파일명: <span class="ex">'휴가 예정 날짜_데브캠프 : 프론트엔드 개발 4회차_성함(휴가계획서)'</span>
            </p><br>
            <h3>3. 필요 자료 폴더링</h3>
            <p>
              출석대장과 휴가계획서를 하나의 폴더에 포함 및 압축<br>
              폴더명: <span class="ex">'휴가 예정 날짜_데브캠프 : 프론트엔드 개발 4회차_이름(휴가)'</span>
            </p>
          </div>
        </div>
        <div class="vacation-status-container">
          <div class="vacation-status-content">
            <div class="vacation-status-header">
              <span><span class="red-dot"></span>신청 현황</span>
            </div>
            <div class="status-table-container">
              <table class="status-table">
                <thead>
                  <tr>
                    <th>상태</th>
                    <th>신청 종류</th>
                    <th>제출 일자</th>
                    <th>사유</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody id="status-table-body">
                  <!-- 자바스크립트로 내용 추가 -->
                </tbody>
              </table>
            </div>
            <div class="vacation-pagination-container">
              <button class="prev-button"><</button>
              <div class="number-btn-wrapper"></div>
              <button class="next-button">></button>
            </div>
            <div class="vacation-modal-btn-container">
              <button id="vacationModalBtn" class="vacation-modal-btn">휴가 신청</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="vacationModal" class="vacation-modal">
      <div class="vacation-modal-content">
        <span class="vacation-modal-close-btn">&times;</span>
        <div class="vacation-form-container" id="vacationFormContainer">
          <h2>휴가 신청</h2>
          <div class="vacation-submit-section">
            <div class="vacation-date-container">
              <label for="vacationDate">휴가 예정 날짜</label>
              <input type="date" id="vacationDate" name="vacationDate" required>
            </div>
            <div class="convert-press-container">
              <label for="convertpress">파일 변환</label>
              <div class="vacation-pdf-container">
                <input type="file" id="wordFile" name="wordFile" accept=".doc,.docx" required>
                <button type="button" id="convertToPDFBtn" class="convertpdf">PDF 변환</button>
              </div>
              <div class="vacation-zip-container">
                <input type="file" id="fileInput" name="fileInput" multiple required>
                <button type="button" id="createZipBtn" class="createzip">ZIP 압축</button>
              </div>
            </div>
          </div>
          <form id="vacationSubmitForm" action="/upload-vacation-request" method="post" enctype="multipart/form-data" class="vacationSubmitForm">
            <label for="vacation-file">파일 첨부</label>
            <div class="vacation-submit-all-section">
              <input type="file" id="vacation_submit_file" name="vacationFile" required>
            </div>
            <button type="submit" class="vacation-btn">제출</button>
          </form>
          <div class="loading-container hidden" id="loadingOverlay">
            <div class="loading-animation">
              <div class="loading-dot"></div>
              <div class="loading-dot"></div>
              <div class="loading-dot"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `

  const modal = document.getElementById("vacationModal")
  const openModalBtn = document.getElementById("vacationModalBtn")
  const closeModalBtn = document.getElementsByClassName("vacation-modal-close-btn")[0]

  openModalBtn.onclick = function() {
    modal.style.display = "block"
  }

  closeModalBtn.onclick = function() {
    modal.style.display = "none"
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none"
    }
  }

  let requestData = []
  let currentPage = 1
  const itemsPerPage = 5

  async function loadRequestData() {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      const response = await fetch(`/get-vacation-request?userName=${userInfo.userName}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (!Array.isArray(data)) {
        throw new Error('Received data is not an array')
      }
      requestData = data
      displayData()
    } catch (error) {
      console.error('Error loading vacation request:', error)
      alert('휴가 신청 데이터를 불러오는 데 실패했습니다. 오류: ' + error.message)
    }
  }

  function displayData() {
    const tableBody = document.getElementById("status-table-body");
  
    requestData.sort((a, b) => {
      const dateA = new Date(a.submitDate + "T" + a.submitTime);
      const dateB = new Date(b.submitDate + "T" + b.submitTime);
      return dateB - dateA; // 내림차순 정렬 (최신 순)
    });
  
    tableBody.innerHTML = '';
  
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = requestData.slice(start, end);
  
    pageData.forEach((item, index) => {
      const submitDateTime = `${item.submitDate} ${item.submitTime}`;
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><span class="status-${item.status}">${getStatusText(item.status)}</span></td>
        <td>${item.type}</td>
        <td>${submitDateTime}</td>
        <td>${item.reason || ''}</td>
        <td>
          ${item.status === 'rejected' || item.status === 'pending' ? `<button class="cancel-button" data-index="${start + index}">취소</button>` : ''}
        </td>
      `;
      tableBody.appendChild(row);
    });
  
    document.querySelectorAll('.cancel-button').forEach(button => {
      button.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        cancelRequest(requestData[index].id);
      });
    });
  
    setPageButtons();
  }
  
  function getStatusText(status) {
    switch(status) {
      case 'pending': return '대기중';
      case 'approved': return '승인';
      case 'rejected': return '반려';
      default: return '';
    }
  }
  
  const setPageButtons = () => {
    const getTotalPageCount = Math.ceil(requestData.length / itemsPerPage)

    const numberBtnWrapper = document.querySelector(".number-btn-wrapper")
    if (numberBtnWrapper != null) {
      numberBtnWrapper.innerHTML = ""
      for (let i = 0; i < getTotalPageCount; i++) {
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

  const arrBtn = () => {
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
      const response = await fetch('/delete-vacation-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      await loadRequestData()
    } catch (error) {
      console.error('Error cancelling request:', error)
      alert("휴가 신청 취소 중 오류가 발생했습니다: " + error.message)
    }
  }

  const changeBtn = (clickBtnNum) => {
    const buttons = document.querySelectorAll('.pagebtn')
    buttons.forEach(button => {
      if (button.textContent === clickBtnNum) {
        button.classList.add('btnFocus')
      } else {
        button.classList.remove('btnFocus')
      }
    })
  }
  
  document.getElementById("convertToPDFBtn").addEventListener("click", () => {
    const file = document.getElementById("wordFile").files[0]
    const vacationDate = document.getElementById("vacationDate").value

    if (!vacationDate) {
      alert("휴가 날짜를 입력하세요.")
      return
    }

    const courseName = '데브캠프 : 프론트엔드 개발 4회차'

    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (!userInfo || !userInfo.userName) {
      alert("로그인된 사용자 정보를 찾을 수 없습니다.")
      return
    }

    const userName = userInfo.userName

    const loadingOverlay = document.getElementById("loadingOverlay");
    loadingOverlay.classList.remove("hidden"); 

    fetch('/api/users.json')
      .then(response => response.json())
      .then(data => {
        const users = Array.isArray(data.data) ? data.data : []

        const user = users.find(u => u.name === userName)

        if (user) {
          let suffix = ""

          if (file.name.includes("출석대장")) {
            suffix = "(출석대장)"
          } else if (file.name.includes("휴가 사용 계획서")) {
            suffix = "(휴가계획서)"
          } else {
            suffix = "(기타)"
          }

          const fileName = `${vacationDate}_${courseName}_${user.name}${suffix}.pdf`

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
                loadingOverlay.classList.add("hidden"); 
              })
              .catch(error => {
                console.error("Error:", error)
                alert("파일 업로드 중 오류가 발생했습니다.")
                loadingOverlay.classList.add("hidden"); 
              })
          }
        } else {
          alert('사용자를 찾을 수 없습니다.')
          loadingOverlay.classList.add("hidden"); 
        }
      })
      .catch(error => {
        console.error("Error fetching user data:", error)
        alert("사용자 정보를 가져오는 중 오류가 발생했습니다.")
        loadingOverlay.classList.add("hidden"); 
      })
  })

  document.getElementById("createZipBtn").addEventListener("click", async () => {
    const files = document.getElementById('fileInput').files
    const vacationDate = document.getElementById("vacationDate").value

    if (!vacationDate) {
      alert("휴가 날짜를 입력하세요.")
      return
    }

    const courseName = '데브캠프 : 프론트엔드 개발 4회차'

    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (!userInfo || !userInfo.userName) {
      alert("로그인된 사용자 정보를 찾을 수 없습니다.")
      return
    }

    const userName = userInfo.userName

    const loadingOverlay = document.getElementById("loadingOverlay");
    loadingOverlay.classList.remove("hidden"); 

    fetch('/api/users.json')
      .then(response => response.json())
      .then(data => {
        const users = Array.isArray(data.data) ? data.data : []

        const user = users.find(u => u.name === userName)

        if (user) {
          const fileName = `${vacationDate}_${courseName}_${user.name}(휴가).zip`

          const zip = new JSZip()
          for (let i = 0; i < files.length; i++) {
            const file = files[i]
            zip.file(file.name, file)
          }

          zip.generateAsync({ type: 'blob' })
            .then(function(content) {
              saveAs(content, fileName)
              loadingOverlay.classList.add("hidden"); 
            })
            .catch(function(error) {
              console.error("Error:", error)
              alert("ZIP 파일 생성 중 오류가 발생했습니다.")
              loadingOverlay.classList.add("hidden"); 
            })
        } else {
          alert('사용자를 찾을 수 없습니다.')
          loadingOverlay.classList.add("hidden"); 
        }
      })
      .catch(error => {
        console.error("Error fetching user data:", error)
        alert("사용자 정보를 가져오는 중 오류가 발생했습니다.")
        loadingOverlay.classList.add("hidden"); 
      })
  })

  document.getElementById("vacationSubmitForm").addEventListener("submit", function(event) {
    event.preventDefault()

    const vacationFile = document.getElementById("vacation_submit_file").files[0]
    const vacationDate = document.getElementById("vacationDate").value
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))
    if (!userInfo || !userInfo.userName) {
      alert("로그인된 사용자 정보를 찾을 수 없습니다.")
      return
    }
    const courseName = '데브캠프 : 프론트엔드 개발 4회차'
    const userName = userInfo.userName

    if (!vacationFile || !vacationDate) {
      alert("모든 필드를 입력하세요.")
      return
    }

    const formData = new FormData()
    formData.append("vacationFile", vacationFile)
    formData.append("date", vacationDate)
    formData.append("name", userName)
    formData.append("courseName", courseName)
    formData.append("userId", userInfo.id)

    const loadingOverlay = document.getElementById("loadingOverlay");
    loadingOverlay.classList.remove("hidden"); 

    fetch("/upload-vacation-request", {
      method: "POST",
      body: formData,
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(`HTTP error! status: ${response.status}, body: ${text}`)
        })
      }
      return response.json()
    })
    .then(data => {
      if (data.message === "File uploaded successfully") {
        alert("제출이 완료되었습니다.")
        modal.style.display = "none"
        loadRequestData()
        loadingOverlay.classList.add("hidden"); 
      } else {
        alert("제출이 실패했습니다.")
        loadingOverlay.classList.add("hidden"); 
      }
    })
    .catch(error => {
      console.error("Error:", error)
      alert("제출 도중 오류가 발생했습니다: " + error.message)
      loadingOverlay.classList.add("hidden"); 
    })
  })

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

  loadRequestData()
}
