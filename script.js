let isUserRegistered = false;
let pendingTabId = null;
let pendingButton = null;

function handleTabClick(btnElement, tabId) {
    // Дозволяємо переходити на Головну (guest-hall) без реєстрації
    if (!isUserRegistered && tabId !== 'guest-hall') {
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

// РЕЄСТРАЦІЯ
document.getElementById('registration-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const nicknameInput = document.getElementById('nickname');
    const email = document.getElementById('email').value;
    const errorSpan = document.getElementById('email-error');

    if (!email.includes('@') || !email.includes('.')) {
        errorSpan.textContent = "Please enter a valid email address with '@' and '.'";
        errorSpan.style.display = "block";
        return; 
    }

    errorSpan.style.display = "none";
    
    // Якщо поле імені пусте, ставимо Nick
    const nickname = nicknameInput.value.trim() === "" ? "Nick" : nicknameInput.value.trim();

    // Оновлюємо імена всюди
    document.getElementById('player-display').innerHTML = `Player: <strong>${nickname}</strong>`;
    document.getElementById('dashboard-name').innerHTML = `Player: ${nickname}`;
    
    // Показуємо кнопку налаштувань
    document.getElementById('settings-btn').style.display = 'block';

    document.getElementById('auth-modal').style.display = 'none';
    isUserRegistered = true;

    if (pendingTabId && pendingButton) {
        openTab(pendingButton, pendingTabId);
    }
});

// ВИПРАВЛЕНО: Закриття реєстрації при кліку поза вікном
const modalOverlay = document.getElementById('auth-modal');
modalOverlay.addEventListener('click', function(event) {
    // Перевіряємо, чи клік був не по самій модальній коробці .modal-box
    if (!event.target.closest('.modal-box')) {
        modalOverlay.style.display = 'none';
        pendingTabId = null;
        pendingButton = null;
    }
});

// Плейсхолдер імені при завантаженні
document.addEventListener('DOMContentLoaded', () => {
    const nicknameInput = document.getElementById('nickname');
    if (nicknameInput) nicknameInput.value = 'Nick';
});

// --- НАЛАШТУВАННЯ ТА АВАТАР ---
function openSettings() { document.getElementById('right-sidebar').classList.add('open'); }

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
        fileNameDisplay.style.color = "#8b92a5";
    }
}

function saveSettings() {
    const newNickname = document.getElementById('change-nickname').value;
    const newPassword = document.getElementById('change-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const photoUpload = document.getElementById('photo-upload');
    const errorSpan = document.getElementById('settings-error');

    errorSpan.style.display = 'none';

    // Перевірка паролів
    if (newPassword !== "" || confirmPassword !== "") {
        if (newPassword !== confirmPassword) {
            errorSpan.textContent = "Passwords do not match!";
            errorSpan.style.display = "block";
            return; 
        }
    }

    // Зміна нікнейму
    if (newNickname.trim() !== "") {
        document.getElementById('player-display').innerHTML = `Player: <strong>${newNickname}</strong>`;
        document.getElementById('dashboard-name').innerHTML = `Player: ${newNickname}`;
    }

    // Зміна фото профілю у лівому меню та на головній
    if (photoUpload.files && photoUpload.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('sidebar-avatar').src = e.target.result;
            document.getElementById('main-avatar').src = e.target.result;
        }
        reader.readAsDataURL(photoUpload.files[0]);
    }

    closeSettings();
}

// Оновлення тексту при виборі файлу в налаштуваннях
document.getElementById('photo-upload').addEventListener('change', function(event) {
    const fileNameDisplay = document.getElementById('file-name-display');
    if (event.target.files.length > 0) {
        fileNameDisplay.textContent = event.target.files[0].name;
        fileNameDisplay.style.color = "#ece8e1"; 
    } else {
        fileNameDisplay.textContent = "No file chosen";
        fileNameDisplay.style.color = "#8b92a5";
    }
});
