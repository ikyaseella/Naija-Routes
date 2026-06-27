import { apiClient } from '../core/api.js';

let sessionId = null;
let msisdn = '0803' + Math.floor(10000000 + Math.random() * 90000000);
let waiting = false;

function appendDialog(text) {
  const el = document.getElementById('ussdDialog');
  el.textContent = text;
}

function showReply(text) {
  const el = document.getElementById('ussdReply');
  el.textContent = '→ ' + text;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 3000);
}

window.startSession = async function () {
  document.getElementById('startBtn').style.display = 'none';
  document.getElementById('backBtn').style.display = 'inline-block';
  document.getElementById('endBtn').style.display = 'inline-block';
  document.getElementById('ussdInput').disabled = false;
  document.getElementById('ussdSend').disabled = false;
  document.getElementById('ussdInput').focus();
  document.getElementById('dialCode').textContent = '📞 *347# · Connected';
  waiting = false;

  sessionId = 'ussd-' + Date.now();
  try {
    const res = await fetch(`http://localhost:3000/api/v1/ussd/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, msisdn, input: '' }),
    });
    const data = await res.json();
    appendDialog(data.text);
    waiting = !data.release;
  } catch (e) {
    appendDialog('Connection error. Make sure API is running on port 3000.');
  }
};

window.sendInput = async function (value) {
  const input = value || document.getElementById('ussdInput').value.trim();
  if (!input) return;
  document.getElementById('ussdInput').value = '';

  if (!waiting) {
    showReply('Session ended. Press Start to begin a new session.');
    return;
  }

  showReply('You: ' + input);

  try {
    const res = await fetch(`http://localhost:3000/api/v1/ussd/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, msisdn, input }),
    });
    const data = await res.json();
    appendDialog(data.text);
    waiting = !data.release;
    if (data.release) {
      document.getElementById('dialCode').textContent = '📞 *347# · Session ended';
      document.getElementById('ussdInput').disabled = true;
      document.getElementById('ussdSend').disabled = true;
      document.getElementById('startBtn').style.display = 'inline-block';
      document.getElementById('startBtn').textContent = '↻ New Session';
      document.getElementById('backBtn').style.display = 'none';
      document.getElementById('endBtn').style.display = 'none';
    }
  } catch (e) {
    appendDialog('Connection lost. Press Start to retry.');
    waiting = false;
  }
};

window.endSession = function () {
  waiting = false;
  sessionId = null;
  appendDialog('Session ended by user.\n\nDial *347# to start again.');
  document.getElementById('dialCode').textContent = '📞 *347#';
  document.getElementById('ussdInput').disabled = true;
  document.getElementById('ussdSend').disabled = true;
  document.getElementById('startBtn').style.display = 'inline-block';
  document.getElementById('startBtn').textContent = '▶ Start';
  document.getElementById('backBtn').style.display = 'none';
  document.getElementById('endBtn').style.display = 'none';
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('ussdInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') window.sendInput();
  });
  document.getElementById('ussdSend').addEventListener('click', () => window.sendInput());
});
