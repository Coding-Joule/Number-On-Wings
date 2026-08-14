// =========================================================
// NumberOnWings Puzzle Arena
// Round 2 — local progress + coins, no Supabase
// =========================================================

const statusEl =
    document.getElementById("puzzle-status");

const questionEl =
    document.getElementById("puzzle-question");

const inputEl =
    document.getElementById("puzzle-input");

const btnEl =
    document.getElementById("puzzle-btn");

const resultEl =
    document.getElementById("puzzle-result");

const setupBox =
    document.getElementById("player-setup");

const nickInput =
    document.getElementById("nickname-input");

const saveNickBtn =
    document.getElementById("save-nickname-btn");

const puzzleBox =
    document.getElementById("puzzle-box");

const levelMap =
    document.getElementById("level-map");

const playerLabel =
    document.getElementById("puzzle-player-label");

const arenaCoinCount =
    document.getElementById("arena-coin-count");


const PUZZLES = generatePuzzles(100);

let currentIdx = 0;
let currentPuzzle = null;
let maxUnlockedIndex = 0;


function getSave() {
    return window.NumberOnWingsSave.load();
}


function syncStateFromSave() {
    const save = getSave();

    maxUnlockedIndex =
        Math.min(
            PUZZLES.length,
            save.puzzle.maxUnlockedIndex
        );

    if (playerLabel) {
        playerLabel.textContent =
            save.profile.nickname ||
            "Explorer";
    }

    if (arenaCoinCount) {
        arenaCoinCount.textContent =
            save.coins;
    }

    return save;
}


function enterArena() {
    const save = syncStateFromSave();

    setupBox.classList.add("hidden");
    puzzleBox.classList.remove("hidden");

    currentIdx = Math.min(
        maxUnlockedIndex,
        PUZZLES.length - 1
    );

    if (maxUnlockedIndex >= PUZZLES.length) {
        currentIdx = PUZZLES.length;
    }

    renderLevelMap();
    loadLevel(currentIdx);

    if (
        save.profile.nickname &&
        nickInput
    ) {
        nickInput.value =
            save.profile.nickname;
    }
}


function loadLevel(index) {
    currentIdx = index;

    inputEl.value = "";
    inputEl.disabled = false;
    btnEl.disabled = false;

    resultEl.classList.add("hidden");
    resultEl.textContent = "";

    if (index >= PUZZLES.length) {
        currentPuzzle = null;

        statusEl.textContent =
            "🏆 Quest Complete";

        questionEl.textContent =
            "You solved all 100 Puzzle Arena levels.";

        inputEl.disabled = true;
        btnEl.disabled = true;

        renderLevelMap();

        return;
    }

    currentPuzzle = PUZZLES[index];

    statusEl.textContent =
        `Level ${index + 1} of ${PUZZLES.length} • ${currentPuzzle.topic}`;

    questionEl.textContent =
        currentPuzzle.question;

    renderLevelMap();

    if (
        window.MathJax &&
        typeof MathJax.typesetPromise === "function"
    ) {
        MathJax
            .typesetPromise([questionEl])
            .catch(error => {
                console.error(
                    "MathJax error:",
                    error
                );
            });
    }

    setTimeout(() => {
        inputEl.focus();
    }, 50);
}


function renderLevelMap() {
    if (!levelMap) {
        return;
    }

    levelMap.innerHTML = "";

    const visibleCount =
        Math.min(PUZZLES.length, 30);

    for (
        let index = 0;
        index < visibleCount;
        index++
    ) {
        const button =
            document.createElement("button");

        button.type = "button";
        button.className = "level-node";
        button.textContent = index + 1;

        if (index < maxUnlockedIndex) {
            button.classList.add(
                "unlocked",
                "completed"
            );
        } else if (
            index === maxUnlockedIndex &&
            index < PUZZLES.length
        ) {
            button.classList.add(
                "unlocked"
            );
        }

        if (index === currentIdx) {
            button.classList.add("current");
        }

        const canOpen =
            index <= maxUnlockedIndex;

        button.disabled = !canOpen;

        if (canOpen) {
            button.addEventListener(
                "click",
                () => loadLevel(index)
            );
        }

        levelMap.appendChild(button);
    }
}


function verifyAnswer() {
    if (!currentPuzzle) {
        return;
    }

    const userGuess =
        inputEl.value
            .trim()
            .toUpperCase();

    const correctAnswer =
        String(currentPuzzle.answer)
            .trim()
            .toUpperCase();

    resultEl.classList.remove("hidden");

    if (userGuess !== correctAnswer) {
        resultEl.style.color =
            "#fda4af";

        resultEl.textContent =
            "❌ Not quite. Check your work and try again.";

        return;
    }

    const completion =
        window.NumberOnWingsSave
            .completePuzzle(currentIdx);

    syncStateFromSave();

    if (completion.newlyCompleted) {
        maxUnlockedIndex =
            completion.save
                .puzzle
                .maxUnlockedIndex;

        resultEl.style.color =
            "#86efac";

        resultEl.innerHTML =
            `🎉 Correct! <span class="coin-reward">+${completion.earnedCoins} 🪙</span>`;
    } else {
        resultEl.style.color =
            "#86efac";

        resultEl.textContent =
            "🎉 Correct! You already earned the coins for this level.";
    }

    renderLevelMap();

    setTimeout(() => {
        const nextIndex =
            Math.min(
                currentIdx + 1,
                PUZZLES.length
            );

        loadLevel(nextIndex);
    }, 800);
}


if (saveNickBtn) {
    saveNickBtn.addEventListener(
        "click",
        () => {
            const name =
                nickInput.value.trim();

            if (!name) {
                nickInput.focus();
                return;
            }

            window.NumberOnWingsSave
                .setNickname(name);

            enterArena();
        }
    );
}


if (btnEl) {
    btnEl.addEventListener(
        "click",
        verifyAnswer
    );
}


if (inputEl) {
    inputEl.addEventListener(
        "keydown",
        event => {
            if (event.key === "Enter") {
                verifyAnswer();
            }
        }
    );
}


window.addEventListener(
    "now:save-changed",
    () => {
        syncStateFromSave();
    }
);


document.addEventListener(
    "DOMContentLoaded",
    () => {
        const save = syncStateFromSave();

        if (save.profile.nickname) {
            enterArena();
        }
    }
);
