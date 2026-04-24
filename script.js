function openTab(evt, tabId) {
    // Знаходимо всі вкладки та ховаємо їх
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.classList.remove('active-tab');
    });

    // Знаходимо всі кнопки в меню і забираємо підсвітку
    const buttons = document.querySelectorAll('.menu-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Показуємо потрібну вкладку за ID
    document.getElementById(tabId).classList.add('active-tab');

    // Робимо натиснуту кнопку "активною"
    evt.currentTarget.classList.add('active');
}
