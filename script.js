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

    const nicknameInput = document.getElementById('nickname');
    const email = document.getElementById('email').value;
    const errorSpan = document.getElementById('email-error');

    // Кастомна перевірка пошти
    if (!email.includes('@') || !email.includes('.')) {
        errorSpan.textContent = "Please enter a valid email address with '@' and '.'";
        errorSpan.style.display = "block";
        return; 
    }

    errorSpan.style.display = "none";
    
    // Використовуємо 'Nick' як дефолтне ім'я, якщо інпут порожній
    const nickname = nicknameInput.value.trim() === "" ? "Nick" : nicknameInput.value.trim();

    // Оновлюємо ім'я у лівому меню
    document.getElementById('player-display').innerHTML = `Player : <strong>${nickname}</strong>`;

    document.getElementById('auth-modal').style.display = 'none';
    isUserRegistered = true;

    if (pendingTabId && pendingButton) {
        openTab(pendingButton, pendingTabId);
    }
});

// Закриття реєстрації при кліку поза вікном
const modalOverlay = document.getElementById('auth-modal');
modalOverlay.addEventListener('click', function(event) {
    if (!event.target.closest('.glass-panel')) {
        modalOverlay.style.display = 'none';
        pendingTabId = null;
        pendingButton = null;
    }
});

// Додаємо плейсхолдер 'Nick' до інпуту ніка при завантаженні
document.addEventListener('DOMContentLoaded', () => {
    const nicknameInput = document.getElementById('nickname');
    if (nicknameInput) nicknameInput.value = 'Nick';
});
