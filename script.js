// Змінні для збереження стану
let isUserRegistered = false;
let pendingTabId = null;
let pendingButton = null;

// Функція, яка спрацьовує при кліку на гру в меню
function handleTabClick(btnElement, tabId) {
    if (!isUserRegistered) {
        pendingTabId = tabId;
        pendingButton = btnElement;
        document.getElementById('auth-modal').style.display = 'flex';
        return; 
    }
    openTab(btnElement, tabId);
}

// Функція відкриття вкладок (тільки візуальна частина)
function openTab(btnElement, tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active-tab'));

    const buttons = document.querySelectorAll('.menu-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabId).classList.add('active-tab');
    btnElement.classList.add('active');
}

// Обробка форми реєстрації
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
    document.getElementById('auth-modal').style.display = 'none';
    isUserRegistered = true;

    if (pendingTabId && pendingButton) {
        openTab(pendingButton, pendingTabId);
    }
});

// НОВЕ: Закриття модального вікна при кліку поза ним (на темний фон)
document.getElementById('auth-modal').addEventListener('click', function(event) {
    // Перевіряємо, чи клік був саме по темному фону (overlay), а не по самій формі
    if (event.target === this) {
        this.style.display = 'none';
        // Очищаємо дані про вкладку, щоб користувач не перейшов на неї випадково
        pendingTabId = null;
        pendingButton = null;
    }
});
