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

// Game State Tracking
let playerName = "";
let maxUnlockedIndex = 0; 
let currentIdx = 0;
let currentPuzzle = null; // Dynamically tracks the payload received from Gemini

// ⚙️ SERVER CONFIGURATION
// Replace these placeholders with your actual live Supabase credentials!
const SUPABASE_URL = "https://your-real-project-id.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-real-key-here";

const HEADERS = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json"
};

// Async Engine to query your secure Supabase Edge Function running Gemini
async function loadLevel(index) {
    currentIdx = index;
    
    inputEl.value = "";
    resultEl.classList.add('hidden');
    resultEl.innerText = "";
    
    // UI Feedback while the generative server is calculating values
    questionEl.innerHTML = "<div style='color: #8b949e; font-style: italic;'>🔮 AI is cooking up a custom problem...</div>";
    statusEl.innerText = `Quest Level ${index + 1} • Fetching from server...`;

    try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-puzzle`, {
            method: 'POST',
            headers: HEADERS,
            body: JSON.stringify({ level: index })
        });
        
        if (!response.ok) throw new Error("Server rejected request");
        
        // Destructures the standardized JSON packet: { topic, question, answer }
        currentPuzzle = await response.json();
        
        statusEl.innerText = `Quest Level ${index + 1} • [${currentPuzzle.topic}]`;
        questionEl.innerText = currentPuzzle.question;
        
        // Tells MathJax to compile and cleanly render the raw LaTeX string strings
        if (window.MathJax) {
            MathJax.typesetPromise([questionEl]);
        }
    } catch (e) {
        console.error("AI Generation Engine Error:", e);
        questionEl.innerText = "⚠️ Failed to summon the AI. Verify your Supabase Edge Function deployment or check console log.";
    }
}

// Compares answer strings and handles level-progression pipelines
function verifyAnswer() {
    if (!currentPuzzle) return;

    const userGuess = inputEl.value.trim().toUpperCase();
    const correctAns = currentPuzzle.answer.trim().toUpperCase();
    
    resultEl.classList.remove('hidden');
    
    if (userGuess === correctAns) {
        resultEl.style.color = "#2ea043";
        resultEl.innerText = "🎉 CORRECT! Syncing database and generating next layer...";
        
        if (currentIdx === maxUnlockedIndex) {
            maxUnlockedIndex++;
            updateGlobalScore(maxUnlockedIndex);
        }
        
        // Short intentional delay to give the player a sense of victory before the next load sequence
        setTimeout(() => {
            loadLevel(currentIdx + 1);
        }, 1500); 
        
    } else {
        resultEl.style.color = "#f85149";
        resultEl.innerText = "❌ Incorrect calculation! Check your work and try again.";
    }
}

// Database communication layer
async function updateGlobalScore(level) {
    if (!playerName) return;
    try {
        await fetch(`${SUPABASE_URL}/rest/v1/leaderboard`, {
            method: 'POST',
            headers: HEADERS,
            body: JSON.stringify({ name: playerName, score: level })
        });
        loadGlobalLeaderboard();
    } catch (e) {
        console.error("Database tracking error:", e);
    }
}

async function loadGlobalLeaderboard() {
    leaderboardList.innerHTML = "<p style='color: #8b949e;'>Connecting to global matrix...</p>";
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/leaderboard?order=score.desc&limit=10`, {
            method: 'GET',
            headers: HEADERS
        });
        const data = await response.json();
        leaderboardList.innerHTML = "";
        
        if (data.length === 0) {
            leaderboardList.innerHTML = "<p style='color: #8b949e;'>No scores posted yet. Be the first!</p>";
            return;
        }
        
        data.forEach((player, index) => {
            const row = document.createElement('div');
            row.className = "leaderboard-entry";
            row.style.display = "flex";
            row.style.justifyContent = "space-between";
            row.style.marginBottom = "5px";
            
            let medal = "";
            if (index === 0) medal = "🥇 ";
            else if (index === 1) medal = "🥈 ";
            else if (index === 2) medal = "🥉 ";

            row.innerHTML = `<span>${medal}<strong>${player.name}</strong></span><span>Level ${player.score}</span>`;
            leaderboardList.appendChild(row);
        });
    } catch (e) {
        leaderboardList.innerHTML = "<p style='color: #f85149;'>⚠️ Couldn't reach live global server.</p>";
    }
}

// Authentication submission trigger
if(saveNickBtn) {
    saveNickBtn.addEventListener('click', () => {
        if (nickInput.value.trim() !== "") {
            playerName = nickInput.value.trim();
            setupBox.classList.add('hidden');
            puzzleBox.classList.remove('hidden');
            leaderboardBox.classList.remove('hidden');
            loadGlobalLeaderboard();
            loadLevel(0); // Safely fires off level zero ONLY after a user logs in
        }
    });
}

// Submission Event Listeners
btnEl.addEventListener('click', verifyAnswer);
inputEl.addEventListener('keypress', (e) => { if (e.key === 'Enter') verifyAnswer(); });
