let isUserRegistered = false;
let pendingTabId = null;
let pendingButton = null;

// Логіка перемикання вкладок
function handleTabClick(btnElement, tabId) {
    if (!isUserRegistered && tabId !== 'dashboard-tab') {
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

// Реєстрація
document.getElementById('registration-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const nickname = document.getElementById('nickname').value;
    const email = document.getElementById('email').value;
    const errorSpan = document.getElementById('email-error');

    if (!email.includes('@') || !email.includes('.')) {
        errorSpan.textContent = "INVALID LINK CREDENTIALS";
        errorSpan.style.display = "block";
        return; 
    }

    errorSpan.style.display = "none";
    
    // Оновлюємо ім'я у всіх місцях
    document.getElementById('sidebar-player-display').innerHTML = `Player : <strong>${nickname}</strong>`;
    document.getElementById('main-player-name').textContent = nickname;
    
    document.getElementById('auth-modal').style.display = 'none';
    isUserRegistered = true;

    if (pendingTabId && pendingButton) {
        openTab(pendingButton, pendingTabId);
    }
});

// Закриття модалки по кліку на фон
const modalOverlay = document.getElementById('auth-modal');
modalOverlay.addEventListener('click', function(event) {
    if (!event.target.closest('.glass-modal')) {
        modalOverlay.style.display = 'none';
        pendingTabId = null;
        pendingButton = null;
    }
});

// Завантаження Аватара прямо на Дашборді
document.getElementById('dashboard-photo-upload').addEventListener('change', function(event) {
    if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Змінюємо головне фото
            document.getElementById('main-avatar').src = e.target.result;
            
            // Якщо захочеш додати міні-фото в ліве меню, можна розкоментувати:
            // document.getElementById('sidebar-avatar').src = e.target.result;
        }
        
        reader.readAsDataURL(event.target.files[0]);
    }
});
