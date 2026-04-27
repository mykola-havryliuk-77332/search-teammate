let isUserRegistered = false;
let pendingTabId = null;
let pendingButton = null;

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

// --- ЛОГІКА ПЕРЕМИКАННЯ ВХІД / РЕЄСТРАЦІЯ ---
function switchAuth(type) {
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('registration-form');
    const title = document.getElementById('auth-title');
    const subtitle = document.getElementById('auth-subtitle');
    
    document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));

    if (type === 'login') {
        document.getElementById('tab-login').classList.add('active');
        loginForm.style.display = 'block';
        regForm.style.display = 'none';
        title.textContent = 'Welcome Back';
        subtitle.textContent = 'Login to access game lobbies';
    } else {
        document.getElementById('tab-register').classList.add('active');
        loginForm.style.display = 'none';
        regForm.style.display = 'block';
        title.textContent = 'Registration';
        subtitle.textContent = 'Join to find your perfect squad';
    }
}

// --- ВХІД (LOGIN) ---
document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorSpan = document.getElementById('login-error');
    const submitBtn = this.querySelector('.submit-btn');

    errorSpan.style.display = "none";
    submitBtn.textContent = "Connecting...";

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('player-display').innerHTML = `Player: <strong>${data.user.username}</strong>`;
            successfulAuth();
        } else {
            const errorText = await response.text();
            errorSpan.textContent = "❌ " + errorText;
            errorSpan.style.display = "block";
        }
    } catch (error) {
        errorSpan.textContent = "❌ Server error. Make sure your Node.js backend is running!";
        errorSpan.style.display = "block";
    }
    submitBtn.textContent = "Login & Enter";
});

// --- РЕЄСТРАЦІЯ (REGISTER) ---
document.getElementById('registration-form').addEventListener('submit', async function(event) {
    event.preventDefault(); 
    const nickname = document.getElementById('nickname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorSpan = document.getElementById('email-error');
    const submitBtn = this.querySelector('.submit-btn');

    if (!email.includes('@') || !email.includes('.')) {
        errorSpan.textContent = "Please enter a valid email address";
        errorSpan.style.display = "block";
        return; 
    }

    errorSpan.style.display = "none";
    submitBtn.textContent = "Registering...";

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, username: nickname })
        });

        if (response.ok) {
            document.getElementById('player-display').innerHTML = `Player: <strong>${nickname}</strong>`;
            successfulAuth();
        } else {
            const errorText = await response.text();
            errorSpan.textContent = "❌ " + errorText;
            errorSpan.style.display = "block";
        }
    } catch (error) {
        errorSpan.textContent = "❌ Server error. Make sure your Node.js backend is running!";
        errorSpan.style.display = "block";
    }
    submitBtn.textContent = "Register & Enter";
});

function successfulAuth() {
    document.getElementById('settings-btn').style.display = 'inline-block';
    document.getElementById('auth-modal').style.display = 'none';
    isUserRegistered = true;

    if (pendingTabId && pendingButton) {
        openTab(pendingButton, pendingTabId);
    }
}

// Закриття авторизації при кліку поза вікном
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
    document.getElementById('settings-error').style.display = 'none';
    document.getElementById('change-nickname').value = '';
    document.getElementById('change-password').value = '';
    document.getElementById('confirm-password').value = '';
    document.getElementById('photo-upload').value = '';

    const fileNameDisplay = document.getElementById('file-name-display');
    if (fileNameDisplay) {
        fileNameDisplay.textContent = "No file chosen";
        fileNameDisplay.style.color = "#888";
    }
}

function saveSettings() {
    const newNickname = document.getElementById('change-nickname').value;
    const newPassword = document.getElementById('change-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const photoUpload = document.getElementById('photo-upload');
    const errorSpan = document.getElementById('settings-error');

    errorSpan.style.display = 'none';

    if (newPassword !== "" || confirmPassword !== "") {
        if (newPassword !== confirmPassword) {
            errorSpan.textContent = "Passwords do not match!";
            errorSpan.style.display = "block";
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
