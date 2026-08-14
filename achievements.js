function renderAchievements() {
    const api =
        window.NumberOnWingsSave;

    const save =
        api.load();

    const definitions =
        api.ACHIEVEMENTS;

    const entries =
        Object.entries(definitions);

    document.getElementById(
        "achievement-count"
    ).textContent =
        save.achievements.length;

    document.getElementById(
        "achievement-total"
    ).textContent =
        entries.length;

    const grid =
        document.getElementById(
            "achievement-grid"
        );

    grid.innerHTML = entries
        .map(([id, achievement]) => {
            const unlocked =
                save.achievements.includes(id);

            return `
                <article
                    class="achievement-card ${
                        unlocked
                            ? ""
                            : "locked"
                    }"
                >

                    <div class="achievement-icon">
                        ${
                            unlocked
                                ? achievement.icon
                                : "🔒"
                        }
                    </div>

                    <h3>
                        ${escapeHtml(achievement.title)}
                    </h3>

                    <p>
                        ${escapeHtml(achievement.description)}
                    </p>

                    <div class="achievement-reward">
                        ${
                            unlocked
                                ? "Unlocked"
                                : `Reward: +${achievement.reward} 🪙`
                        }
                    </div>

                </article>
            `;
        })
        .join("");
}


function escapeHtml(value) {
    const element =
        document.createElement("div");

    element.textContent =
        String(value ?? "");

    return element.innerHTML;
}


document.addEventListener(
    "DOMContentLoaded",
    renderAchievements
);

window.addEventListener(
    "now:save-changed",
    renderAchievements
);
