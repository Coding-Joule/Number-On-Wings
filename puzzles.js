const supabaseUrl = "https://thebbyhdswhldqaycieu.supabase.co";
const supabaseKey = "sb_publishable_RRrYnpGT8TSAG4WpO7vTEw_nomNPra6";

const supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

// DOM Element Selectors
const statusEl = document.getElementById("puzzle-status");
const questionEl = document.getElementById("puzzle-question");
const inputEl = document.getElementById("puzzle-input");
const btnEl = document.getElementById("puzzle-btn");
const resultEl = document.getElementById("puzzle-result");
const setupBox = document.getElementById("player-setup");
const nickInput = document.getElementById("nickname-input");
const saveNickBtn = document.getElementById("save-nickname-btn");
const leaderboardBox = document.getElementById("global-leaderboard");
const leaderboardList = document.getElementById("leaderboard-list");
const puzzleBox = document.getElementById("puzzle-box");

// Local Puzzle Bank
const PUZZLES = generatePuzzles(100);

// Game State
let playerName = "";
let maxUnlockedIndex = 0;
let currentIdx = 0;
let currentPuzzle = null;


// Load a puzzle
function loadLevel(index) {
    currentIdx = index;

    inputEl.value = "";
    resultEl.classList.add("hidden");
    resultEl.innerText = "";

    if (index >= PUZZLES.length) {
        statusEl.innerText = "🏆 Quest Complete!";
        questionEl.innerText = "You solved every puzzle!";
        inputEl.disabled = true;
        btnEl.disabled = true;
        return;
    }

    currentPuzzle = PUZZLES[index];

    statusEl.innerText =
        `Quest Level ${index + 1} • [${currentPuzzle.topic}]`;

    questionEl.innerText = currentPuzzle.question;

    if (window.MathJax) {
        MathJax.typesetPromise([questionEl]).catch((error) => {
            console.error("MathJax error:", error);
        });
    }
}


// Check the player's answer
function verifyAnswer() {
    if (!currentPuzzle) return;

    const userGuess = inputEl.value.trim().toUpperCase();
    const correctAns = currentPuzzle.answer.trim().toUpperCase();

    resultEl.classList.remove("hidden");

    if (userGuess === correctAns) {
        resultEl.style.color = "#2ea043";
        resultEl.innerText = "🎉 CORRECT! Loading next level...";

        if (currentIdx === maxUnlockedIndex) {
            maxUnlockedIndex++;

            saveProgress();

            // Save the new score online.
            saveGlobalScore();
        }

        setTimeout(() => {
            loadLevel(currentIdx + 1);
        }, 1000);
    } else {
        resultEl.style.color = "#f85149";
        resultEl.innerText =
            "❌ Incorrect! Check your work and try again.";
    }
}


// Save this player's personal progress on this device
function saveProgress() {
    if (!playerName) return;

    localStorage.setItem("puzzlePlayerName", playerName);
    localStorage.setItem(
        "puzzleMaxLevel",
        String(maxUnlockedIndex)
    );
}


// Save a score to Supabase
async function saveGlobalScore() {
    if (!playerName) return;

    const { error } = await supabaseClient
        .from("global_leaderboard")
        .insert({
            username: playerName,
            score: maxUnlockedIndex,
            country: null
        });

    if (error) {
        console.error("Could not save score:", error);
        return;
    }

    await loadGlobalLeaderboard();
}


// Load the global leaderboard from Supabase
async function loadGlobalLeaderboard() {
    leaderboardList.innerHTML = "Loading leaderboard...";

    const { data, error } = await supabaseClient
        .from("global_leaderboard")
        .select("username, score, country, created_at")
        .order("score", { ascending: false })
        .order("created_at", { ascending: true })
        .limit(100);

    if (error) {
        console.error("Could not load leaderboard:", error);
        leaderboardList.innerHTML =
            "Could not load the global leaderboard.";
        return;
    }

    if (!data || data.length === 0) {
        leaderboardList.innerHTML = "No scores yet.";
        return;
    }

    /*
      A new database row is currently created whenever someone
      reaches a new level. This keeps only each username's best
      score when displaying the leaderboard.
    */
    const bestScores = new Map();

    for (const entry of data) {
        const username = String(entry.username ?? "").trim();

        if (!username) continue;

        const existingEntry = bestScores.get(username);

        if (
            !existingEntry ||
            Number(entry.score) > Number(existingEntry.score)
        ) {
            bestScores.set(username, entry);
        }
    }

    const rankedEntries = Array.from(bestScores.values())
        .sort((a, b) => Number(b.score) - Number(a.score))
        .slice(0, 20);

    if (rankedEntries.length === 0) {
        leaderboardList.innerHTML = "No scores yet.";
        return;
    }

    leaderboardList.innerHTML = rankedEntries
        .map((entry, index) => {
            const safeUsername = escapeHtml(entry.username);
            const safeScore = Number(entry.score) || 0;

            return `
                <div
                    class="leaderboard-entry"
                    style="
                        display: flex;
                        justify-content: space-between;
                    "
                >
                    <span>
                        ${index + 1}. 👤
                        <strong>${safeUsername}</strong>
                    </span>

                    <span>Level ${safeScore}</span>
                </div>
            `;
        })
        .join("");
}


// Prevent a nickname from being interpreted as HTML
function escapeHtml(value) {
    const element = document.createElement("div");
    element.textContent = String(value ?? "");
    return element.innerHTML;
}


// Nickname setup
if (saveNickBtn) {
    saveNickBtn.addEventListener("click", async () => {
        const enteredName = nickInput.value.trim();

        if (enteredName === "") {
            return;
        }

        playerName = enteredName;

        const savedName =
            localStorage.getItem("puzzlePlayerName");

        const savedLevel =
            localStorage.getItem("puzzleMaxLevel");

        if (savedName === playerName && savedLevel !== null) {
            maxUnlockedIndex = Number(savedLevel);

            if (!Number.isFinite(maxUnlockedIndex)) {
                maxUnlockedIndex = 0;
            }
        } else {
            maxUnlockedIndex = 0;
        }

        setupBox.classList.add("hidden");
        puzzleBox.classList.remove("hidden");
        leaderboardBox.classList.remove("hidden");

        await loadGlobalLeaderboard();
        loadLevel(maxUnlockedIndex);
    });
}


// Submit button
if (btnEl) {
    btnEl.addEventListener("click", verifyAnswer);
}


// Enter key
if (inputEl) {
    inputEl.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            verifyAnswer();
        }
    });
}
