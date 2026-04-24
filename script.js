// Змінні для збереження стану
let isUserRegistered = false;
let pendingTabId = null;
let pendingButton = null;

// Функція, яка спрацьовує при кліку на гру в меню
function handleTabClick(btnElement, tabId) {
    // Якщо користувач ще не зареєстрований
    if (!isUserRegistered) {
        // Запам'ятовуємо, куди він хотів перейти
        pendingTabId = tabId;
        pendingButton = btnElement;
        
        // Показуємо модальне вікно реєстрації (змінюємо display з none на flex)
        document.getElementById('auth-modal').style.display = 'flex';
        return; // Зупиняємо виконання, вкладку не відкриваємо
    }

    // Якщо вже зареєстрований — просто відкриваємо вкладку
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
    // Зупиняємо стандартне перезавантаження сторінки при відправці форми
    event.preventDefault(); 

    const nickname = document.getElementById('nickname').value;
    const email = document.getElementById('email').value;
    const errorSpan = document.getElementById('email-error');

    // Кастомна перевірка пошти на наявність @ та крапки
    if (!email.includes('@') || !email.includes('.')) {
        errorSpan.textContent = "Please enter a valid email address with '@' and '.'";
        errorSpan.style.display = "block";
        return; // Якщо пошта неправильна, зупиняємо реєстрацію
    }

    // Якщо все добре, прибираємо помилку (якщо вона була)
    errorSpan.style.display = "none";

    // Оновлюємо нікнейм у лівому меню
    document.getElementById('player-display').innerHTML = `Player: <strong>${nickname}</strong>`;

    // Закриваємо модальне вікно
    document.getElementById('auth-modal').style.display = 'none';

    // Встановлюємо статус "зареєстрований"
    isUserRegistered = true;

    // Відкриваємо вкладку, на яку користувач клікав до реєстрації
    if (pendingTabId && pendingButton) {
        openTab(pendingButton, pendingTabId);
    }
});
