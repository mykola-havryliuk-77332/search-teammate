let isLogged = false;
function openTab(btnElement, tabId) {
    if (!isLogged && tabId !== 'welcome-tab') {
        openAuthModal();
        return;
    }
    
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active-tab'));
    document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active-tab');
    btnElement.classList.add('active');
}

// ДИНАМІЧНІ ФІЛЬТРИ ДЛЯ CS
function updateCSFilters() {
    const mode = document.getElementById('cs-mode').value;
    document.getElementById('filter-premier').style.display = 'none';
    document.getElementById('filter-faceit').style.display = 'none';
    document.getElementById('filter-mm').style.display = 'none';

    if (mode === 'premier') document.getElementById('filter-premier').style.display = 'block';
    if (mode === 'faceit') document.getElementById('filter-faceit').style.display = 'block';
    if (mode === 'mm') document.getElementById('filter-mm').style.display = 'block';
}

// ГЕНЕРАЦІЯ ФЕЙКОВИХ ГРАВЦІВ (Пошук)
function mockSearch(game) {
    const container = document.getElementById(`${game}-results`);
    container.innerHTML = '<p style="color: #aaa;">Searching database...</p>';
    
    // Імітація затримки мережі
    setTimeout(() => {
        const players = game === 'cs' 
            ? [
                { name: 'NatusVincere_Fan', info: 'Faceit Lvl 10 • Rifle' },
                { name: 'Blyatman', info: 'Premier 14,500 • AWP' },
                { name: 'ToxicAvenger', info: 'Global Elite • Entry Fragger' }
              ]
            : [
                { name: 'JettInstalock', info: 'Ascendant 2 • Duelist' },
                { name: 'SovaLineups', info: 'Diamond 3 • Initiator' },
                { name: 'SageHealMe', info: 'Platinum 1 • Sentinel' }
              ];
              
        container.innerHTML = ''; // Очистити "завантаження"
        
        players.forEach(p => {
            container.innerHTML += `
                <div class="player-card">
                    <div class="contact-avatar" style="margin: 0 auto 15px; width: 60px; height: 60px; font-size: 24px;">${p.name[0]}</div>
                    <h3>${p.name}</h3>
                    <p>${p.info}</p>
                    <button class="msg-btn" onclick="openChatWith('${p.name}')">Message</button>
                </div>
            `;
        });
    }, 800);
}

// ЛОГІКА ЧАТУ
function sendMessage() {
    const input = document.getElementById('msg-input');
    const text = input.value.trim();
    if (text === '') return;

    const chatBox = document.getElementById('chat-box');
    const msgElement = document.createElement('div');
    msgElement.className = 'msg-bubble sent';
    msgElement.textContent = text;
    
    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Скрол вниз
    input.value = '';
}

function handleChatEnter(e) {
    if (e.key === 'Enter') sendMessage();
}

function openChatWith(name) {
    // Шукаємо кнопку вкладки "Messages" і клікаємо її
    const msgBtn = Array.from(document.querySelectorAll('.menu-btn')).find(btn => btn.textContent.includes('Messages'));
    openTab(msgBtn, 'messages-tab');
    
    // Змінюємо заголовок чату
    document.querySelector('.chat-header h3').textContent = `Chat with ${name}`;
    document.getElementById('chat-box').innerHTML = `
        <div class="msg-bubble received">System: You started a new conversation with ${name}.</div>
    `;
}

// НАЛАШТУВАННЯ ТА АВТОРИЗАЦІЯ (МОКОВІ)
function openSettings() { document.getElementById('right-sidebar').classList.add('open'); }
function closeSettings() { document.getElementById('right-sidebar').classList.remove('open'); }
function openAuthModal() { document.getElementById('auth-modal').style.display = 'flex'; }

function mockLogin() {
    const nick = document.getElementById('dummy-nick').value || "Guest123";
    isLogged = true;
    document.getElementById('player-display').innerHTML = `Player: <strong>${nick}</strong>`;
    document.getElementById('auth-trigger-btn').style.display = 'none';
    document.getElementById('settings-btn').style.display = 'block';
    document.getElementById('auth-modal').style.display = 'none';
}

function saveSettings() {
    const nick = document.getElementById('change-nickname').value;
    if (nick) document.getElementById('player-display').innerHTML = `Player: <strong>${nick}</strong>`;
    closeSettings();
}
