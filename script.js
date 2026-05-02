let isUserRegistered = false;
let currentMode = 'reg'; 
let pendingTabId = null;
let pendingButton = null;

// Твоя нова адреса бекенду на Railway
const API_URL = 'https://havrs-finding-production.up.railway.app';

/**
 * Керування вкладками з перевіркою авторизації
 */
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

/**
 * Перемикання між Реєстрацією та Входом
 */
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

/**
 * Обробка відправки форми (Реєстрація / Логін)
 */
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

    // Формуємо шлях: /register або /login
    const path = currentMode === 'reg' ? 'register' : 'login';
    const finalUrl = `${API_URL}/${path}`;

    // Формуємо дані для відправки
    const body = currentMode === 'reg' 
        ? { email, password, username: nickname } 
        : { email, password };

    try {
        const res = await fetch(finalUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (res.ok) {
            // Успіх!
            isUserRegistered = true;
            
            // Відображаємо нікнейм (або з форми, або той, що повернув сервер)
            const displayName = nickname || data.user?.username || "Player";
            const playerDisplay = document.getElementById('player-display');
            if (playerDisplay) {
                playerDisplay.innerHTML = `Player: <strong>${displayName}</strong>`;
            }

            // Показуємо кнопку налаштувань та закриваємо модалку
            const settingsBtn = document.getElementById('settings-btn');
            if (settingsBtn) settingsBtn.style.display = 'inline-block';
            
            document.getElementById('auth-modal').style.display = 'none';
            
            // Якщо користувач хотів відкрити вкладку до реєстрації — відкриваємо її зараз
            if (pendingTabId && pendingButton) {
                openTab(pendingButton, pendingTabId);
            }
            
            console.log("✅ Авторизація успішна:", data.message);
        } else {
            // Помилка від сервера (наприклад, неправильний пароль)
            if (errorEl) {
                errorEl.textContent = "❌ " + (data.detail || "Error occurred");
                errorEl.style.display = 'block';
            }
        }
    } catch (err) {
        // Помилка з'єднання з сервером
        if (errorEl) {
            errorEl.textContent = "❌ Server is offline. Please try again later.";
            errorEl.style.display = 'block';
        }
        console.error("Fetch error:", err);
    } finally {
        submitBtn.textContent = currentMode === 'reg' ? 'Register & Enter' : 'Login & Enter';
    }
});

/**
 * Закриття модального вікна при кліку поза ним
 */
window.onclick = function(event) {
    const modal = document.getElementById('auth-modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};
