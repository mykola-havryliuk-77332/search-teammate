let isUserRegistered = false;
let currentMode = 'log'; 
let pendingTabId = null;
let pendingButton = null;

const API_URL = 'https://st-backend-production.up.railway.app';

function handleTabClick(btnElement, tabId) {
    if (!isUserRegistered) {
        pendingTabId = tabId;
        pendingButton = btnElement;
        document.getElementById('auth-modal').style.display = 'flex';
        return; 
    }
    openTab(btnElement, tabId);
}

function openTab(btnElement, tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active-tab'));
    document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active-tab');
    btnElement.classList.add('active');
}

// ФУНКЦІЯ ПЕРЕМИКАННЯ ВХІД / РЕЄСТРАЦІЯ
function switchAuth(mode) {
    currentMode = mode;
    const title = document.getElementById('auth-title');
    const subtitle = document.getElementById('auth-subtitle');
    const nickGroup = document.getElementById('nick-group');
    const btn = document.getElementById('submit-btn');
    const tabLog = document.getElementById('tab-login');
    const tabReg = document.getElementById('tab-register');
    
    // Перемикання активного класу для кнопок
    if (mode === 'reg') {
        tabReg.classList.add('active');
        tabLog.classList.remove('active');
        title.textContent = 'Registration';
        subtitle.textContent = 'Join to access game lobbies';
        nickGroup.style.display = 'block';
        btn.textContent = 'Register & Enter';
    } else {
        tabLog.classList.add('active');
        tabReg.classList.remove('active');
        title.textContent = 'Welcome Back';
        subtitle.textContent = 'Login to access game lobbies';
        nickGroup.style.display = 'none';
        btn.textContent = 'Login & Enter';
    }
}

document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const nickname = document.getElementById('nickname').value;
    const errorEl = document.getElementById('error-msg');
    const submitBtn = document.getElementById('submit-btn');

    errorEl.style.display = 'none';
    submitBtn.textContent = "Connecting...";

    const path = currentMode === 'reg' ? '/register' : '/login';
    const body = currentMode === 'reg' ? { email, password, username: nickname } : { email, password };

    try {
        const res = await fetch(`${API_URL}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            const data = await res.json();
            isUserRegistered = true;
            document.getElementById('player-display').innerHTML = `Player: <strong>${nickname || data.user.username}</strong>`;
            document.getElementById('settings-btn').style.display = 'inline-block';
            document.getElementById('auth-modal').style.display = 'none';
            if (pendingTabId && pendingButton) openTab(pendingButton, pendingTabId);
        } else {
            const txt = await res.text();
            errorEl.textContent = "❌ " + txt;
            errorEl.style.display = 'block';
        }
    } catch (err) {
        errorEl.textContent = "❌ Server error. Check Railway!";
        errorEl.style.display = 'block';
    } finally {
        submitBtn.textContent = currentMode === 'reg' ? 'Register & Enter' : 'Login & Enter';
    }
});

// Функції налаштувань (Settings) залишаються без змін як у тебе були
function openSettings() { document.getElementById('right-sidebar').classList.add('open'); }
function closeSettings() { document.getElementById('right-sidebar').classList.remove('open'); }
