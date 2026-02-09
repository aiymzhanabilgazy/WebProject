const messagesBox = document.getElementById('messages');
const form = document.getElementById('sendForm');
const input = document.getElementById('messageInput');

async function loadMessages() {
  const res = await fetch('/api/messages', { credentials: 'same-origin' });
  if (!res.ok) return;

  const messages = await res.json();
  messagesBox.innerHTML = '';

  if (messages.length === 0) {
    messagesBox.innerHTML = `
      <div class="empty-chat">
        <div class="empty-icon">💌</div>
        <p>No messages yet</p>
        <span>Start a conversation</span>
      </div>
    `;
    return;
  }

  messages.forEach(m => {
    const div = document.createElement('div');

    const isMine = m.from === currentUser?._id;
    div.className = `message ${isMine ? 'mine' : 'theirs'}`;

    const time = new Date(m.createdAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    div.innerHTML = `
      <div class="message-author">${m.sender.name || 'User'}</div>
      <div class="message-text">${m.text}</div>
      <div class="message-time">${time}</div>
    `;

    messagesBox.appendChild(div);
  });

  messagesBox.scrollTop = messagesBox.scrollHeight;
}


form.addEventListener('submit', async e => {
  e.preventDefault();

  await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({
      to: prompt('User ID to send'),
      text: input.value
    })
  });

  input.value = '';
  loadMessages();
});

loadMessages();
