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
    
    // Якщо реєстрація успішна - міняємо іконку профілю
    document.getElementById('player-photo').src = "photo.jpg"; 

    document.getElementById('auth-modal').style.display = 'none';
    isUserRegistered = true;

    if (pendingTabId && pendingButton) {
        openTab(pendingButton, pendingTabId);
    }
});

// ЗАКРИТТЯ ВІКНА ПРИ КЛІКУ ПОЗА НИМ
const modalOverlay = document.getElementById('auth-modal');

modalOverlay.addEventListener('click', function(event) {
    // Перевіряємо, чи клік був безпосередньо по темному фону (overlay), 
    // і чи НЕ був він по самій формі (.modal-box) або всередині неї.
    if (!event.target.closest('.modal-box')) {
        modalOverlay.style.display = 'none';
        
        // Очищаємо дані, щоб користувач не перейшов на вкладку випадково
        pendingTabId = null;
        pendingButton = null;
    }
});
