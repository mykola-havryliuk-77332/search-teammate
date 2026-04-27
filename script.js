let isUserRegistered = false;
let currentMode = 'log'; // Початковий режим - вхід
let pendingTabId = null;
let pendingButton = null;

// Твоя адреса з Railway
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
    
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active-tab');
        btnElement.classList.add('active');
    }
}

// ФУНКЦІЯ ПЕРЕМИКАННЯ ВХІД / РЕЄСТРАЦІЯ
function switchAuth(mode) {
    currentMode = mode;
    
    // Елементи форми
    const title = document.getElementById('auth-title');
    const subtitle = document.getElementById('auth-subtitle');
    const nickGroup = document.getElementById('nick-group');
    const submitBtn = document.getElementById('submit-btn');
    
    // Кнопки-вкладки
    const tabLog = document.getElementById('tab-login');
    const tabReg = document.getElementById('tab-register');

    if (mode === 'reg') {
        // Активуємо вкладку Register
        tabReg.classList.add('active');
        tabLog.classList.remove('active');
        
        // Змінюємо текст та показуємо поле нікнейму
        title.textContent = 'Registration';
        subtitle.textContent = 'Join to access game lobbies';
        if (nickGroup) nickGroup.style.display = 'block';
        submitBtn.textContent = 'Register & Enter';
        
    } else {
        // Активуємо вкладку Login
        tabLog.classList.add('active');
        tabReg.classList.remove('active');
        
        // Змінюємо текст та ховаємо поле нікнейму
        title.textContent = 'Welcome Back';
        subtitle.textContent = 'Login to access game lobbies';
        if (nickGroup) nickGroup.style.display = 'none';
        submitBtn.textContent = 'Login & Enter';
    }
}

// ОБРОБКА ВІДПРАВКИ ФОРМИ
document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const nicknameInput = document.getElementById('nickname');
    const nickname = nicknameInput ? nicknameInput.value : "";
    const errorEl = document.getElementById('error-msg');
    const submitBtn = document.getElementById('submit-btn');

    if (errorEl) errorEl.style.display = 'none';
    const originalBtnText = submitBtn.textContent;
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
            
            // Відображаємо ім'я гравця
            const displayName = nickname || data.user.username || "Player";
            document.getElementById('player-display').innerHTML = `Player: <strong>${displayName}</strong>`;
            
            // Показуємо налаштування і закриваємо модалку
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
        submitBtn.textContent = originalBtnText;
    }
});

// Закриття модалки
window.onclick = function(event) {
    const modal = document.getElementById('auth-modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

// Функції налаштувань (Settings)
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
