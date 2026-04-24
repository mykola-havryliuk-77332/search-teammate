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

// РЕЄСТРАЦІЯ
document.getElementById('registration-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const nickname = document.getElementById('nickname').value;
    const email = document.getElementById('email').value;
    const errorSpan = document.getElementById('email-error');

    if (!email.includes('@') || !email.includes('.')) {
        errorSpan.textContent = "Please enter a valid email address with '@' and '.'";
        errorSpan.style.display = "block";
        return; 
    }

    errorSpan.style.display = "none";
    document.getElementById('player-display').innerHTML = `Player: <strong>${nickname}</strong>`;
    
    // Після реєстрації показуємо кнопку Settings
    document.getElementById('settings-btn').style.display = 'inline-block';

    document.getElementById('auth-modal').style.display = 'none';
    isUserRegistered = true;

    if (pendingTabId && pendingButton) {
        openTab(pendingButton, pendingTabId);
    }
});

// Закриття реєстрації при кліку поза вікном
const modalOverlay = document.getElementById('auth-modal');
modalOverlay.addEventListener('click', function(event) {
    if (!event.target.closest('.modal-box')) {
        modalOverlay.style.display = 'none';
        pendingTabId = null;
        pendingButton = null;
    }
});


// --- НОВА ЛОГІКА ДЛЯ НАЛАШТУВАНЬ ---

// Відкрити/Закрити праве меню
function openSettings() {
    document.getElementById('right-sidebar').classList.add('open');
}

function closeSettings() {
    document.getElementById('right-sidebar').classList.remove('open');
    // Очищаємо поля та помилки при закритті
    document.getElementById('settings-error').style.display = 'none';
    document.getElementById('change-nickname').value = '';
    document.getElementById('change-password').value = '';
    document.getElementById('confirm-password').value = '';
    document.getElementById('photo-upload').value = '';
}

// Збереження налаштувань
function saveSettings() {
    const newNickname = document.getElementById('change-nickname').value;
    const newPassword = document.getElementById('change-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const photoUpload = document.getElementById('photo-upload');
    const errorSpan = document.getElementById('settings-error');

    errorSpan.style.display = 'none'; // Скидаємо попередню помилку

    // 1. Перевірка паролів (якщо користувач щось ввів у ці поля)
    if (newPassword !== "" || confirmPassword !== "") {
        if (newPassword !== confirmPassword) {
            errorSpan.textContent = "Passwords do not match!";
            errorSpan.style.display = "block";
            return; // Зупиняємо функцію, якщо паролі не збігаються
        }
        // Тут могла б бути логіка відправки нового пароля на бекенд
    }

    // 2. Зміна нікнейму
    if (newNickname.trim() !== "") {
        document.getElementById('player-display').innerHTML = `Player: <strong>${newNickname}</strong>`;
    }

    // 3. Зміна фото профілю (читання файлу з комп'ютера)
    if (photoUpload.files && photoUpload.files[0]) {
        const reader = new FileReader();
        
        // Коли файл успішно прочитано
        reader.onload = function(e) {
            // e.target.result містить картинку у форматі Base64 (Data URL)
            document.getElementById('player-photo').src = e.target.result;
        }
        
        // Запускаємо читання обраного файлу
        reader.readAsDataURL(photoUpload.files[0]);
    }

    // Закриваємо панель після успішного збереження
    closeSettings();
}
