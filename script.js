let isUserRegistered = false;
let currentMode = 'reg'; 
let pendingTabId = null;
let pendingButton = null;

// Твоє посилання з Railway
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
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active-tab'));

    const buttons = document.querySelectorAll('.menu-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabId).classList.add('active-tab');
    btnElement.classList.add('active');
}

// Функція для перемикання між Login та Register
function switchAuth(mode) {
    currentMode = mode;
    const title = document.getElementById('auth-title');
    const nickGroup = document.getElementById('nick-group');
    const btn = document.getElementById('submit-btn');
    
    if (mode === 'reg') {
        title.textContent = 'Registration';
        if(nickGroup) nickGroup.style.display = 'block';
        btn.textContent = 'Register & Enter';
    } else {
        title.textContent = 'Welcome Back';
        if(nickGroup) nickGroup.style.display = 'none';
        btn.textContent = 'Login & Enter';
    }
}

// ОБРОБКА ФОРМИ (РЕЄСТРАЦІЯ ТА ВХІД)
document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const nickname = document.getElementById('nickname') ? document.getElementById('nickname').value : "";
    const errorEl = document.getElementById('error-msg') || document.getElementById('email-error');
    const submitBtn = document.getElementById('submit-btn');

    if (errorEl) errorEl.style.display = 'none';
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
            
            // Оновлюємо нікнейм у профілі
            const finalName = nickname || data.user.username || "Player";
            document.getElementById('player-display').innerHTML = `Player: <strong>${finalName}</strong>`;
            
            // Показуємо кнопку налаштувань та закриваємо вікно
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
            errorEl.textContent = "❌ Server error. Start your Railway backend!";
            errorEl.style.display = 'block';
        }
    } finally {
        submitBtn.textContent = currentMode === 'reg' ? 'Register & Enter' : 'Login & Enter';
    }
});

// Закриття модалки при кліку поза вікном
const modalOverlay = document.getElementById('auth-modal');
modalOverlay.addEventListener('click', function(event) {
    if (!event.target.closest('.modal-box')) {
        modalOverlay.style.display = 'none';
        pendingTabId = null;
        pendingButton = null;
    }
});

// --- НАЛАШТУВАННЯ ПРОФІЛУ ---
function openSettings() {
    document.getElementById('right-sidebar').classList.add('open');
}

function closeSettings() {
    document.getElementById('right-sidebar').classList.remove('open');
    const err = document.getElementById('settings-error');
    if(err) err.style.display = 'none';
    
    document.getElementById('change-nickname').value = '';
    document.getElementById('change-password').value = '';
    document.getElementById('confirm-password').value = '';
    document.getElementById('photo-upload').value = '';
}

function saveSettings() {
    const newNickname = document.getElementById('change-nickname').value;
    const newPassword = document.getElementById('change-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const photoUpload = document.getElementById('photo-upload');
    const errorSpan = document.getElementById('settings-error');

    if (errorSpan) errorSpan.style.display = 'none';

    if (newPassword !== "" || confirmPassword !== "") {
        if (newPassword !== confirmPassword) {
            if (errorSpan) {
                errorSpan.textContent = "Passwords do not match!";
                errorSpan.style.display = "block";
            }
            return; 
        }
    }

    if (newNickname.trim() !== "") {
        document.getElementById('player-display').innerHTML = `Player: <strong>${newNickname}</strong>`;
    }

    if (photoUpload.files && photoUpload.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('player-photo').src = e.target.result;
        }
        reader.readAsDataURL(photoUpload.files[0]);
    }

    closeSettings();
}

document.getElementById('photo-upload').addEventListener('change', function(event) {
    const fileNameDisplay = document.getElementById('file-name-display');
    if (event.target.files.length > 0) {
        fileNameDisplay.textContent = event.target.files[0].name;
        fileNameDisplay.style.color = "#ffffff"; 
    } else {
        fileNameDisplay.textContent = "No file chosen";
        fileNameDisplay.style.color = "#888";
    }
});
