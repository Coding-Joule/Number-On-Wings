const problemBank = [
    { "topic": "Number Theory", "level": 1, "question": "What is the remainder when \\(2^{20} + 3\\) is divided by \\(5\\)?", "answer": "4" },
    { "topic": "Geometry", "level": 1, "question": "A right triangle has a hypotenuse of length \\(c = 13\\) and one leg of length \\(a = 5\\). Find its area.", "answer": "30" },
    { "topic": "Logic", "level": 1, "question": "I am a three-digit number. My tens digit is 5 more than my ones digit. My hundreds digit is 8 less than my tens digit. What number am I?", "answer": "194" },
    { "topic": "Cryptography", "level": 1, "question": "Using a Caesar Cipher with a shift of \\(3\\) (where A becomes D), decrypt the word: \\(\\text{KHOOR}\\).", "answer": "HELLO" },
    { "topic": "Analytic Geometry", "level": 2, "question": "Find the distance between the points \\((1, 2)\\) and \\((4, 6)\\) on a Cartesian plane.", "answer": "5" },
    { "topic": "Number Theory", "level": 2, "question": "Find the greatest common divisor (GCD) of \\(143\\) and \\(91\\).", "answer": "13" },
    { "topic": "Number Theory", "level": 2, "question": "How many positive factors does the number \\(120\\) have?", "answer": "16" },
    { "topic": "Geometry", "level": 2, "question": "The interior angles of a regular polygon add up to \\(1080^\\circ\\). How many sides does this polygon have?", "answer": "8" },
    { "topic": "Combinatorics", "level": 2, "question": "How many distinct arrangements can be made using all the letters in the word \\(\\text{MATH}\\)?", "answer": "24" },
    { "topic": "Algebra", "level": 2, "question": "If \\(x + y = 10\\) and \\(x - y = 4\\), find the value of \\(xy\\).", "answer": "21" },
    { "topic": "Cryptography", "level": 2, "question": "In the cryptarithm \\(A + A = B\\), if \\(B = 6\\), what digit does \\(A\\) represent?", "answer": "3" },
    { "topic": "Number Theory", "level": 3, "question": "Find the smallest positive integer \\(n\\) such that \\(n \\equiv 3 \\pmod 5\\) and \\(n \\equiv 4 \\pmod 7\\).", "answer": "18" },
    { "topic": "Number Theory", "level": 3, "question": "What is the units digit of \\(7^{2026}\\)?", "answer": "9" },
    { "topic": "Geometry", "level": 3, "question": "A circle is inscribed inside a square of area \\(64\\). What is the area of the circle? (Express in terms of pi, e.g., 16pi)", "answer": "16pi" },
    { "topic": "Geometry", "level": 3, "question": "In triangle \\(ABC\\), the ratio of the angles is \\(1:2:3\\). If the shortest side has length \\(4\\), what is the length of the longest side?", "answer": "8" },
    { "topic": "Analytic Geometry", "level": 3, "question": "Find the slope of a line that is perpendicular to the line passing through \\((2, 5)\\) and \\((-1, 9)\\). Express as a fraction like a/b.", "answer": "3/4" },
    { "topic": "Combinatorics", "level": 3, "question": "A committee of \\(3\\) students is to be chosen from a group of \\(7\\) students. How many unique committees can be formed?", "answer": "35" },
    { "topic": "Algebra", "level": 3, "question": "Find the sum of the solutions to the quadratic equation \\(2x^2 - 12x + 5 = 0\\).", "answer": "6" },
    { "topic": "Cryptography", "level": 3, "question": "In an Atbash cipher (where A=Z, B=Y, etc.), what does the letter \\(\\text{G}\\) encrypt to?", "answer": "T" },
    { "topic": "Number Theory", "level": 4, "question": "What is the largest prime factor of \\(2^{10} - 1\\)?", "answer": "11" },
    { "topic": "Number Theory", "level": 4, "question": "How many zeros are at the end of the decimal representation of \\(25!\\)?", "answer": "6" },
    { "topic": "Analytic Geometry", "level": 4, "question": "A circle is defined by the equation \\(x^2 + y^2 - 4x + 6y = 3\\). What is the radius of this circle?", "answer": "4" },
    { "topic": "Algebra", "level": 4, "question": "If \\(f(x) = 3x - 5\\), find the value of \\(f^{-1}(10)\\).", "answer": "5" },
    { "topic": "Combinatorics", "level": 4, "question": "How many diagonals does a regular octagon (8 sides) have?", "answer": "20" },
    { "topic": "Cryptography", "level": 4, "question": "In the cryptarithm \\(\\text{SEND} + \\text{MORE} = \\text{MONEY}\\), what digit does the letter \\(\\text{M}\\) absolutely have to represent?", "answer": "1" },
    { "topic": "Number Theory", "level": 5, "question": "Find the remainder when \\(3^{100}\\) is divided by \\(13\\).", "answer": "3" },
    { "topic": "Geometry", "level": 5, "question": "In a right triangle, the legs have lengths of \\(6\\) and \\(8\\). Find the length of the altitude drawn to the hypotenuse. Express as a decimal.", "answer": "4.8" }
];

const mapContainer = document.getElementById('level-map');
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

let playerName = "";
let maxUnlockedIndex = 0; 
let currentIdx = 0;

const SUPABASE_URL = "https://your-real-project-id.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-real-key-here";

const HEADERS = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json"
};

function verifyAnswer() {
    const currentPuzzle = problemBank[currentIdx];
    const userGuess = inputEl.value.trim().toUpperCase();
    const correctAns = currentPuzzle.answer.trim().toUpperCase();
    
    resultEl.classList.remove('hidden');
    
    if (userGuess === correctAns) {
        resultEl.style.color = "#2ea043";
        resultEl.innerText = "🎉 CORRECT! Level complete.";
        
        if (currentIdx === maxUnlockedIndex && maxUnlockedIndex < problemBank.length - 1) {
            maxUnlockedIndex++;
            updateGlobalScore(maxUnlockedIndex);
            setTimeout(() => {
                drawMap();
                loadLevel(maxUnlockedIndex);
            }, 1200); 
        } else if (currentIdx === problemBank.length - 1) {
            updateGlobalScore(maxUnlockedIndex + 1);
            resultEl.innerText = "🏆 HOOOLY MOLY! You have fully completed the final master puzzle!";
        }
    } else {
        resultEl.style.color = "#f85149";
        resultEl.innerText = "❌ Incorrect calculation! Back to the drawing board.";
    }
}

function drawMap() {
    mapContainer.innerHTML = "";
    
    problemBank.forEach((puzzle, index) => {
        const btn = document.createElement('button');
        btn.innerText = index + 1;
        btn.style.width = "40px";
        btn.style.height = "40px";
        btn.style.borderRadius = "8px";
        btn.style.fontSize = "1rem";
        btn.style.fontWeight = "bold";
        btn.style.border = "none";
        btn.style.cursor = "pointer";
        
        if (index < maxUnlockedIndex) {
            btn.style.backgroundColor = "#238636";
            btn.style.color = "white";
            btn.onclick = () => loadLevel(index);
        } else if (index === maxUnlockedIndex) {
            btn.style.backgroundColor = "#1f6feb";
            btn.style.color = "white";
            btn.style.boxShadow = "0 0 10px #1f6feb";
            btn.onclick = () => loadLevel(index);
        } else {
            btn.style.backgroundColor = "#21262d";
            btn.style.color = "#8b949e";
            btn.style.border = "1px solid #30363d";
            btn.innerText = "🔒";
            btn.style.cursor = "not-allowed";
        }
        
        mapContainer.appendChild(btn);
    });
}

function loadLevel(index) {
    currentIdx = index;
    const puzzle = problemBank[index];
    
    inputEl.value = "";
    resultEl.classList.add('hidden');
    resultEl.innerText = "";
    
    statusEl.innerText = `Quest Level ${index + 1} • [Tier ${puzzle.level} ${puzzle.topic}]`;
    questionEl.innerText = puzzle.question;
    
    if (window.MathJax) {
        MathJax.typesetPromise([questionEl]);
    }
}

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
    leaderboardList.innerHTML = "<p>Connecting to global server...</p>";
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

if(saveNickBtn) {
    saveNickBtn.addEventListener('click', () => {
        if (nickInput.value.trim() !== "") {
            playerName = nickInput.value.trim();
            setupBox.classList.add('hidden');
            puzzleBox.classList.remove('hidden');
            mapContainer.classList.remove('hidden');
            leaderboardBox.classList.remove('hidden');
            loadGlobalLeaderboard();
        }
    });
}

btnEl.addEventListener('click', verifyAnswer);
inputEl.addEventListener('keypress', (e) => { if (e.key === 'Enter') verifyAnswer(); });

drawMap();
loadLevel(0);
