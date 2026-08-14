function renderShop() {
    const api =
        window.NumberOnWingsSave;

    const save =
        api.load();

    document.getElementById(
        "shop-coins"
    ).textContent =
        save.coins;

    const grid =
        document.getElementById(
            "shop-grid"
        );

    grid.innerHTML =
        Object.entries(api.THEMES)
            .map(([id, theme]) => {
                const owned =
                    save.shop.ownedThemes
                        .includes(id);

                const equipped =
                    save.shop.equippedTheme === id;

                let buttonText =
                    `${theme.price} 🪙`;

                if (equipped) {
                    buttonText = "Equipped";
                } else if (owned) {
                    buttonText = "Equip";
                } else if (theme.price === 0) {
                    buttonText = "Free";
                }

                return `
                    <article class="shop-card">

                        <div
                            class="theme-preview ${id}"
                        >
                            ${theme.icon}
                        </div>

                        <h2>
                            ${escapeHtml(theme.name)}
                        </h2>

                        <p>
                            A complete NumberOnWings
                            color theme.
                        </p>

                        <div
                            class="shop-price"
                            style="margin-bottom: 14px;"
                        >
                            ${
                                owned
                                    ? "Owned"
                                    : `${theme.price} 🪙`
                            }
                        </div>

                        <button
                            class="action-btn"
                            data-theme-id="${id}"
                            ${
                                equipped
                                    ? "disabled"
                                    : ""
                            }
                        >
                            ${buttonText}
                        </button>

                    </article>
                `;
            })
            .join("");

    grid.querySelectorAll(
        "[data-theme-id]"
    ).forEach(button => {
        button.addEventListener(
            "click",
            () => {
                handleThemeAction(
                    button.dataset.themeId
                );
            }
        );
    });
}


function handleThemeAction(themeId) {
    const api =
        window.NumberOnWingsSave;

    const save =
        api.load();

    if (
        save.shop.ownedThemes
            .includes(themeId)
    ) {
        const result =
            api.equipTheme(themeId);

        if (result.ok) {
            toast("Theme equipped.");
        }

        renderShop();
        return;
    }

    const result =
        api.buyTheme(themeId);

    if (!result.ok) {
        if (
            result.reason ===
            "not-enough-coins"
        ) {
            toast(
                "Not enough coins yet."
            );
        }

        renderShop();
        return;
    }

    api.equipTheme(themeId);

    toast(
        "Theme purchased and equipped! 🎨"
    );

    renderShop();
}


function toast(message) {
    const old =
        document.querySelector(
            ".now-toast"
        );

    if (old) {
        old.remove();
    }

    const element =
        document.createElement("div");

    element.className = "now-toast";
    element.textContent = message;

    document.body.appendChild(element);

    setTimeout(() => {
        element.remove();
    }, 2300);
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
    renderShop
);

window.addEventListener(
    "now:save-changed",
    renderShop
);
