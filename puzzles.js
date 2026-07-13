// DOM Element Selectors
const statusEl = document.getElementById('puzzle-status');
const questionEl = document.getElementById('puzzle-question');
const inputEl = document.getElementById('puzzle-input');
const btnEl = document.getElementById('puzzle-btn');
const resultEl = document.getElementById('puzzle-result');
const setupBox = document.getElementById('player-setup');
const nickInput = document.getElementById('nickname-input');
const saveNickBtn = document.getElementById('save-nickname-btn');
const leaderboardBox = document.getElementById('global-leaderboard');
const leaderboardList = document.getElementById('leaderboard-list');
const puzzleBox = document.getElementById('puzzle-box');

// Local Puzzle Bank
const PUZZLES = generatePuzzles(100);

// Game State
let playerName = "";
let maxUnlockedIndex = 0;
let currentIdx = 0;
let currentPuzzle = null;

// Load a puzzle locally
function loadLevel(index) {
    currentIdx = index;

    inputEl.value = "";
    resultEl.classList.add('hidden');
    resultEl.innerText = "";

    if (index >= PUZZLES.length) {
        statusEl.innerText = "🏆 Quest Complete!";
        questionEl.innerText = "You solved every puzzle!";
        inputEl.disabled = true;
        btnEl.disabled = true;
        return;
    }

    currentPuzzle = PUZZLES[index];

    statusEl.innerText = `Quest Level ${index + 1} • [${currentPuzzle.topic}]`;
    questionEl.innerText = currentPuzzle.question;

    if (window.MathJax) {
        MathJax.typesetPromise([questionEl]);
    }
}

// Check answer
function verifyAnswer() {
    if (!currentPuzzle) return;

    const userGuess = inputEl.value.trim().toUpperCase();
    const correctAns = currentPuzzle.answer.trim().toUpperCase();

    resultEl.classList.remove('hidden');

    if (userGuess === correctAns) {
        resultEl.style.color = "#2ea043";
        resultEl.innerText = "🎉 CORRECT! Loading next level...";

        if (currentIdx === maxUnlockedIndex) {
            maxUnlockedIndex++;
            saveProgress();
            loadLocalLeaderboard();
        }

        setTimeout(() => {
            loadLevel(currentIdx + 1);
        }, 1000);

    } else {
        resultEl.style.color = "#f85149";
        resultEl.innerText = "❌ Incorrect! Check your work and try again.";
    }
}

// Save progress locally in browser
function saveProgress() {
    if (!playerName) return;

    localStorage.setItem("puzzlePlayerName", playerName);
    localStorage.setItem("puzzleMaxLevel", maxUnlockedIndex);
}

// Local leaderboard
function loadLocalLeaderboard() {
    leaderboardList.innerHTML = `
        <div class="leaderboard-entry" style="display:flex; justify-content:space-between;">
            <span>👤 <strong>${playerName}</strong></span>
            <span>Level ${maxUnlockedIndex}</span>
        </div>
    `;
}

// Nickname setup
if (saveNickBtn) {
    saveNickBtn.addEventListener('click', () => {
        if (nickInput.value.trim() !== "") {
            playerName = nickInput.value.trim();

            const savedName = localStorage.getItem("puzzlePlayerName");
            const savedLevel = localStorage.getItem("puzzleMaxLevel");

            if (savedName === playerName && savedLevel) {
                maxUnlockedIndex = Number(savedLevel);
            }

            setupBox.classList.add('hidden');
            puzzleBox.classList.remove('hidden');
            leaderboardBox.classList.remove('hidden');

            loadLocalLeaderboard();
            loadLevel(maxUnlockedIndex);
        }
    });
}

// Submission Event Listeners
btnEl.addEventListener('click', verifyAnswer);

inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') verifyAnswer();
});
