function renderHome() {
    const api =
        window.NumberOnWingsSave;

    const save =
        api.load();

    const nickname =
        save.profile.nickname;

    document.getElementById(
        "dashboard-greeting"
    ).textContent =
        nickname
            ? `${nickname}'s progress`
            : "Your progress";

    document.getElementById(
        "home-coins"
    ).textContent =
        save.coins;

    document.getElementById(
        "home-puzzles"
    ).textContent =
        save.puzzle.maxUnlockedIndex;

    document.getElementById(
        "home-achievements"
    ).textContent =
        save.achievements.length;

    const theme =
        api.THEMES[
            save.shop.equippedTheme
        ];

    document.getElementById(
        "home-theme"
    ).textContent =
        theme?.name ||
        "Midnight";

    const action =
        document.getElementById(
            "home-primary-action"
        );

    if (
        save.puzzle.maxUnlockedIndex > 0
    ) {
        action.textContent =
            `🧩 Continue at Level ${Math.min(save.puzzle.maxUnlockedIndex + 1, 100)}`;
    }
}


document.addEventListener(
    "DOMContentLoaded",
    renderHome
);

window.addEventListener(
    "now:save-changed",
    renderHome
);
