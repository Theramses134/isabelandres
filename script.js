const form = document.getElementById('thought-form');
const thoughtText = document.getElementById('thought-text');
const authorSelect = document.getElementById('author');
const thoughtsList = document.getElementById('thoughts-list');
const statusFill = document.getElementById('status-fill');

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

function renderThoughts() {
    thoughtsList.innerHTML = '';
    thoughts.forEach((t, index) => {
        const div = document.createElement('div');
        div.className = 'thought';
        div.innerHTML = `<strong>${t.author}:</strong> <p>${t.text}</p>`;
        
        const reactionsDiv = document.createElement('div');
        reactionsDiv.className = 'reactions';
        ['😠','😢','😐','🙂','😍'].forEach((emoji, i) => {
            const btn = document.createElement('span');
            btn.className = 'reaction-btn';
            btn.textContent = emoji;
            btn.onclick = () => {
                reactions.push(i);
                saveData();
                updateStatusBar();
            };
            reactionsDiv.appendChild(btn);
        });

        div.appendChild(reactionsDiv);
        thoughtsList.appendChild(div);
    });
}

form.onsubmit = e => {
    e.preventDefault();
    thoughts.push({ author: authorSelect.value, text: thoughtText.value });
    thoughtText.value = '';
    saveData();
    renderThoughts();
};

renderThoughts();
updateStatusBar();
