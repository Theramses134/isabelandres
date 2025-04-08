const form = document.getElementById('thought-form');
const thoughtText = document.getElementById('thought-text');
const authorSelect = document.getElementById('author');
const thoughtsList = document.getElementById('thoughts-list');
const statusFill = document.getElementById('status-fill');
const countdownDisplay = document.getElementById('countdown');

let thoughts = JSON.parse(localStorage.getItem('thoughts')) || [];
let reactions = JSON.parse(localStorage.getItem('reactions')) || [];

function saveData() {
    localStorage.setItem('thoughts', JSON.stringify(thoughts));
    localStorage.setItem('reactions', JSON.stringify(reactions));
}

function getAverageReaction() {
    if (reactions.length === 0) return 0.5;
    const total = reactions.reduce((a, b) => a + b, 0);
    return total / (reactions.length * 4);
}

function updateStatusBar() {
    const avg = getAverageReaction();
    statusFill.style.width = (avg * 100) + '%';
    const color = avg < 0.25 ? 'red' : avg < 0.5 ? 'orange' : avg < 0.75 ? 'yellowgreen' : 'green';
    statusFill.style.background = color;
}

function groupThoughtsByDate() {
    return thoughts.reduce((acc, t) => {
        const date = t.date.split(' ')[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(t);
        return acc;
    }, {});
}

function renderThoughts() {
    thoughtsList.innerHTML = '';
    const sortedThoughts = [...thoughts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const grouped = groupThoughtsByDate();

    Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a)).forEach(date => {
        const section = document.createElement('section');
        const toggle = document.createElement('h3');
        toggle.textContent = date;
        toggle.className = 'collapsible';
        toggle.onclick = () => content.classList.toggle('hidden');

        const content = document.createElement('div');
        content.className = 'thought-group';

        grouped[date].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).forEach((t, index) => {
            content.appendChild(createThoughtElement(t, index));
        });

        section.appendChild(toggle);
        section.appendChild(content);
        thoughtsList.appendChild(section);
    });
}

function createThoughtElement(t, index) {
    const div = document.createElement('div');
    div.className = 'thought';
    div.innerHTML = `<strong>${t.author}:</strong> <p>${t.text}</p><small>${t.date}</small>`;

    const reactionsDiv = document.createElement('div');
    reactionsDiv.className = 'reactions';

    if (t.reacted) {
        reactionsDiv.innerHTML = `<p><em>Ya reaccionaste a esta publicación.</em></p>`;
    } else {
        ['😠','😢','😐','🙂','😍'].forEach((emoji, i) => {
            const btn = document.createElement('span');
            btn.className = 'reaction-btn';
            btn.textContent = emoji;
            btn.onclick = () => {
                reactions.push(i);
                thoughts.find(th => th.timestamp === t.timestamp).reacted = true;
                saveData();
                renderThoughts();
                updateStatusBar();
            };
            reactionsDiv.appendChild(btn);
        });
    }

    div.appendChild(reactionsDiv);
    return div;
}

form.onsubmit = e => {
    e.preventDefault();
    const now = new Date();
    const dateString = now.toLocaleDateString('es-ES') + ' ' + now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    thoughts.push({ author: authorSelect.value, text: thoughtText.value, date: dateString, timestamp: now.toISOString(), reacted: false });
    thoughtText.value = '';
    saveData();
    renderThoughts();
};

// Cuenta regresiva de 31 días desde el 7 de abril de 2025
function updateCountdown() {
    const startDate = new Date('2025-04-07T00:00:00');
    const now = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 31);

    const diffTime = endDate - now;
    if (diffTime <= 0) {
        countdownDisplay.textContent = "¡El tiempo terminó!";
        return;
    }

    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diffTime / (1000 * 60)) % 60);

    countdownDisplay.textContent = `Quedan ${days} días, ${hours} horas y ${minutes} minutos.`;
}

setInterval(updateCountdown, 60000);
updateCountdown();
renderThoughts();
updateStatusBar();
