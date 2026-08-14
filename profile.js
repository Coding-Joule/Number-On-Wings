function renderProfile() {
    const save =
        window.NumberOnWingsSave.load();

    document.getElementById(
        "profile-name"
    ).textContent =
        save.profile.nickname ||
        "Explorer";

    document.getElementById(
        "profile-coins"
    ).textContent =
        save.coins;

    document.getElementById(
        "profile-puzzles"
    ).textContent =
        save.stats.puzzlesSolved;

    document.getElementById(
        "profile-achievements"
    ).textContent =
        save.achievements.length;

    document.getElementById(
        "profile-finance"
    ).textContent =
        save.stats.financeChallengesCompleted;

    const puzzlePercent =
        Math.min(
            100,
            save.puzzle.maxUnlockedIndex
        );

    document.getElementById(
        "profile-puzzle-progress"
    ).style.width =
        `${puzzlePercent}%`;

    document.getElementById(
        "profile-puzzle-progress-text"
    ).textContent =
        `${save.puzzle.maxUnlockedIndex} / 100 levels`;
}

document.addEventListener(
    "DOMContentLoaded",
    renderProfile
);

window.addEventListener(
    "now:save-changed",
    renderProfile
);
