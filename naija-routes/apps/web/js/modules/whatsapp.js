const API_BASE = '/api/v1/whatsapp';
const chatEl = document.getElementById('waChat');
const inputEl = document.getElementById('waInput');
const sendBtn = document.getElementById('waSendBtn');
const emptyEl = document.getElementById('waEmpty');
const typingEl = document.getElementById('waTyping');

function scrollToBottom() {
  chatEl.scrollTop = chatEl.scrollHeight;
}

function addMsg(text, role) {
  const div = document.createElement('div');
  div.className = `wa-msg ${role}`;
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  div.innerHTML = text.replace(/\n/g, '<br>') + `<span class="msg-time">${time}</span>`;
  chatEl.insertBefore(div, typingEl);
  scrollToBottom();
}

function setTyping(on) {
  typingEl.style.display = on ? 'flex' : 'none';
  scrollToBottom();
}

function setLoading(loading) {
  inputEl.disabled = loading;
  sendBtn.disabled = loading;
}

export async function sendWAMessage() {
  const text = inputEl.value.trim();
  if (!text) return;

  inputEl.value = '';
  addMsg(text, 'user');
  setLoading(true);
  setTyping(true);

  try {
    const res = await fetch(`${API_BASE}/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    });
    const data = await res.json();
    const reply = data?.data?.text || data?.text || 'No response';
    addMsg(reply, 'bot');
  } catch {
    addMsg('Sorry, I could not reach the server. Please try again later.', 'bot');
  } finally {
    setLoading(false);
    setTyping(false);
    inputEl.focus();
  }
}

export function startWAChat() {
  emptyEl.style.display = 'none';
  inputEl.disabled = false;
  sendBtn.disabled = false;
  inputEl.focus();
  addMsg('👋 *Welcome to Naija Routes!* 🚌\n\nReply with:\n1️⃣ *Book Trip*\n2️⃣ *Track Trip*\n3️⃣ *Routes*\n4️⃣ *Wallet*\n5️⃣ *Help*\n0️⃣ *Exit*', 'bot');
}

export function sendPredefined(val) {
  inputEl.value = val;
  sendWAMessage();
}

window.sendWAMessage = sendWAMessage;
window.startWAChat = startWAChat;
window.sendPredefined = sendPredefined;
