export function loadInquiryBoard() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="inquiry-board">
      <h1>Inquiry Board</h1>
      <form id="inquiry-form">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
        <br>
        <label for="message">Message:</label>
        <textarea id="message" name="message" required></textarea>
        <br>
        <button type="submit">Submit</button>
      </form>
      <ul id="inquiry-list"></ul>
    </div>
  `;

  document.getElementById('inquiry-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;
    addInquiry(name, message);
  });

  loadInquiries();
}

function addInquiry(name, message) {
  const inquiries = JSON.parse(localStorage.getItem('inquiries')) || [];
  inquiries.push({ name, message, date: new Date().toLocaleString() });
  localStorage.setItem('inquiries', JSON.stringify(inquiries));
  loadInquiries();
}

function loadInquiries() {
  const inquiries = JSON.parse(localStorage.getItem('inquiries')) || [];
  const inquiryList = document.getElementById('inquiry-list');
  inquiryList.innerHTML = inquiries.map(inquiry => `
    <li>
      <strong>${inquiry.name}</strong> (${inquiry.date}): ${inquiry.message}
    </li>
  `).join('');
}
