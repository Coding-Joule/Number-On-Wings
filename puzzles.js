// Supabase configuration for storing leaderboard scores
const supabaseUrl = "https://thebbyhdswhldqaycieu.supabase.co";
const supabaseKey = "sb_publishable_RRrYnpGT8TSAG4WpO7vTEw_nomNPra6";

const supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

// ===== DOM Element References =====
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

// ===== Game State Variables =====
const PUZZLES = generatePuzzles(100); // Pre-generate 100 random puzzles
let playerName = "";           // Current player's nickname
let maxUnlockedIndex = 0;      // Highest level player has reached
let currentIdx = 0;            // Currently displayed puzzle index
let currentPuzzle = null;      // Current puzzle object

/**
 * Load and display a puzzle at the given index
 * @param {number} index - The puzzle index to load
 */
function loadLevel(index) {
    currentIdx = index;

    // Reset input field and result display
    inputEl.value = "";
    resultEl.classList.add("hidden");
    resultEl.innerText = "";

    // Check if all puzzles are solved
    if (index >= PUZZLES.length) {
        statusEl.innerText = "🏆 Quest Complete!";
        questionEl.innerText = "You solved every puzzle!";
        inputEl.disabled = true;
        btnEl.disabled = true;
        return;
    }

    currentPuzzle = PUZZLES[index];

    // Display current level and topic
    statusEl.innerText =
        `Quest Level ${index + 1} • [${currentPuzzle.topic}]`;

    questionEl.innerText = currentPuzzle.question;

    // Render mathematical expressions if MathJax is available
    if (window.MathJax) {
        MathJax.typesetPromise([questionEl]).catch((error) => {
            console.error("MathJax error:", error);
        });
    }
}

/**
 * Verify the player's answer against the correct answer
 * Updates progress and moves to next level on correct answer
 */
function verifyAnswer() {
    if (!currentPuzzle) return;

    const userGuess = inputEl.value.trim().toUpperCase();
    const correctAns = currentPuzzle.answer.trim().toUpperCase();

    resultEl.classList.remove("hidden");

    if (userGuess === correctAns) {
        resultEl.style.color = "#2ea043";
        resultEl.innerText = "🎉 CORRECT! Loading next level...";

        // If this is a new level reached, save progress
        if (currentIdx === maxUnlockedIndex) {
            maxUnlockedIndex++;

            saveProgress();
            saveGlobalScore();
        }

        // Move to next puzzle after brief delay
        setTimeout(() => {
            loadLevel(currentIdx + 1);
        }, 1000);
    } else {
        resultEl.style.color = "#f85149";
        resultEl.innerText =
            "❌ Incorrect! Check your work and try again.";
    }
}

/**
 * Save player's progress to browser localStorage
 * Allows progress to persist across sessions
 */
function saveProgress() {
    if (!playerName) return;

    localStorage.setItem("puzzlePlayerName", playerName);
    localStorage.setItem(
        "puzzleMaxLevel",
        String(maxUnlockedIndex)
    );
}

/**
 * Save player's score to Supabase leaderboard
 * Updates global leaderboard after new level reached
 */
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

/**
 * Fetch and display the top 20 players from Supabase leaderboard
 * Handles duplicate entries by keeping each player's best score
 */
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

    // Extract best score for each unique player
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

    // Display top 20 players
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

/**
 * Escape HTML special characters to prevent XSS attacks
 * @param {string} value - String to escape
 * @returns {string} Escaped HTML string
 */
function escapeHtml(value) {
    const element = document.createElement("div");
    element.textContent = String(value ?? "");
    return element.innerHTML;
}

// ===== Event Listeners =====

// Handle nickname setup and game start
if (saveNickBtn) {
    saveNickBtn.addEventListener("click", async () => {
        const enteredName = nickInput.value.trim();

        if (enteredName === "") {
            return;
        }

        playerName = enteredName;

        // Check if player has saved progress
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

        // Show puzzle interface, hide setup screen
        setupBox.classList.add("hidden");
        puzzleBox.classList.remove("hidden");
        leaderboardBox.classList.remove("hidden");

        await loadGlobalLeaderboard();
        loadLevel(maxUnlockedIndex);
    });
}

// Submit button click handler
if (btnEl) {
    btnEl.addEventListener("click", verifyAnswer);
}

// Allow Enter key to submit answer
if (inputEl) {
    inputEl.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            verifyAnswer();
        }
    });
}
