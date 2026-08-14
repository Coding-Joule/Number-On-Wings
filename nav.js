// =========================================================
// NumberOnWings shared navigation
// Round 2 — app nav + local coin display
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    ensureAppStyles();

    const header = document.querySelector("header");

    if (!header) {
        return;
    }

    applyThemeFromStorage();

    const currentPage =
        window.location.pathname.split("/").pop() ||
        "index.html";

    const links = [
        {
            href: "index.html",
            label: "home"
        },
        {
            href: "videos.html",
            label: "learn"
        },
        {
            href: "tools.html",
            label: "tools"
        },
        {
            href: "puzzles.html",
            label: "puzzles"
        },
        {
            href: "finance.html",
            label: "finance"
        },
        {
            href: "shop.html",
            label: "shop"
        },
        {
            href: "dontclick.html",
            label: "don't click",
            dangerous: true
        }
    ];

    const profilePages = new Set([
        "profile.html",
        "achievements.html",
        "settings.html"
    ]);

    const navLinks = links
        .map(link => {
            const classes = [];

            if (currentPage === link.href) {
                classes.push("active");
            }

            if (link.dangerous) {
                classes.push("danger-zone");
            }

            const classAttribute =
                classes.length
                    ? ` class="${classes.join(" ")}"`
                    : "";

            return `
                <a href="${link.href}"${classAttribute}>
                    ${link.label}
                </a>
            `;
        })
        .join("");

    header.innerHTML = `
        <div class="nav-shell">

            <a
                class="logo"
                href="index.html"
                aria-label="NumberOnWings home"
            >
                <img
                    src="IMG_3098.png"
                    alt=""
                    class="logo-img"
                >

                <span>
                    Number<span>OnWings</span>
                </span>
            </a>

            <div class="app-nav-scroll">
                <nav aria-label="Main navigation">
                    ${navLinks}
                </nav>
            </div>

            <div class="nav-actions">

                <a
                    class="coin-pill"
                    id="nav-coin-pill"
                    href="shop.html"
                    title="Coins"
                    aria-label="Open shop"
                >
                    🪙
                    <span id="nav-coin-count">0</span>
                </a>

                <a
                    class="profile-pill ${
                        profilePages.has(currentPage)
                            ? "active"
                            : ""
                    }"
                    href="profile.html"
                    title="Profile"
                    aria-label="Open profile"
                >
                    👤
                </a>

            </div>

        </div>
    `;

    refreshNavCoins();

    window.addEventListener(
        "now:save-changed",
        refreshNavCoins
    );

    window.addEventListener(
        "storage",
        event => {
            if (
                event.key === "numberOnWingsSaveV2"
            ) {
                refreshNavCoins();
                applyThemeFromStorage();
            }
        }
    );
});

function ensureAppStyles() {
    if (
        document.querySelector(
            'link[href="app.css"]'
        )
    ) {
        return;
    }

    const link = document.createElement("link");

    link.rel = "stylesheet";
    link.href = "app.css";

    document.head.appendChild(link);
}

function readLocalSaveForNav() {
    if (
        window.NumberOnWingsSave &&
        typeof window.NumberOnWingsSave.load === "function"
    ) {
        return window.NumberOnWingsSave.load();
    }

    try {
        const raw =
            localStorage.getItem(
                "numberOnWingsSaveV2"
            );

        return raw
            ? JSON.parse(raw)
            : null;
    } catch {
        return null;
    }
}

function refreshNavCoins() {
    const coinCount =
        document.getElementById(
            "nav-coin-count"
        );

    if (!coinCount) {
        return;
    }

    const save = readLocalSaveForNav();

    coinCount.textContent =
        Math.max(
            0,
            Math.floor(
                Number(save?.coins) || 0
            )
        );
}

function applyThemeFromStorage() {
    const save = readLocalSaveForNav();

    const theme =
        save?.shop?.equippedTheme ||
        "midnight";

    document.documentElement.dataset.nowTheme =
        theme;

    document.documentElement.dataset.reducedMotion =
        save?.settings?.reducedMotion
            ? "true"
            : "false";
}
