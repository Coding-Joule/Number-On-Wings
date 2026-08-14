// =========================================================
// NumberOnWings Save Engine
// Round 2 — local profiles, coins, achievements, shop & settings
// No account. No Supabase. No XP.
// =========================================================

(() => {
    "use strict";

    const SAVE_KEY = "numberOnWingsSaveV2";
    const LEGACY_NAME_KEY = "puzzlePlayerName";
    const LEGACY_LEVEL_KEY = "puzzleMaxLevel";

    const ACHIEVEMENTS = {
        "first-flight": {
            title: "First Flight",
            description: "Solve your first Puzzle Arena problem.",
            icon: "🪽",
            reward: 10
        },
        "ten-solved": {
            title: "Double Digits",
            description: "Solve 10 Puzzle Arena problems.",
            icon: "🔟",
            reward: 25
        },
        "twenty-five-solved": {
            title: "Quarter Century",
            description: "Solve 25 Puzzle Arena problems.",
            icon: "🏁",
            reward: 50
        },
        "fifty-solved": {
            title: "Halfway to 100",
            description: "Solve 50 Puzzle Arena problems.",
            icon: "🚀",
            reward: 100
        },
        "coin-collector": {
            title: "Coin Collector",
            description: "Hold at least 100 coins at once.",
            icon: "🪙",
            reward: 20
        },
        "coin-vault": {
            title: "Tiny Vault",
            description: "Hold at least 500 coins at once.",
            icon: "🏦",
            reward: 75
        },
        "finance-starter": {
            title: "Finance Starter",
            description: "Complete your first Finance Center challenge.",
            icon: "💸",
            reward: 20
        },
        "theme-buyer": {
            title: "New Paint Job",
            description: "Buy your first theme from the shop.",
            icon: "🎨",
            reward: 15
        }
    };

    const THEMES = {
        midnight: {
            name: "Midnight",
            price: 0,
            icon: "🌙"
        },
        aurora: {
            name: "Aurora",
            price: 80,
            icon: "🌌"
        },
        violet: {
            name: "Violet",
            price: 120,
            icon: "🟣"
        },
        ember: {
            name: "Ember",
            price: 150,
            icon: "🔥"
        },
        solar: {
            name: "Solar",
            price: 200,
            icon: "☀️"
        }
    };

    function defaultSave() {
        return {
            version: 2,

            profile: {
                nickname: "",
                createdAt: new Date().toISOString()
            },

            coins: 0,

            stats: {
                puzzlesSolved: 0,
                financeChallengesCompleted: 0,
                totalCoinsEarned: 0,
                totalCoinsSpent: 0
            },

            puzzle: {
                maxUnlockedIndex: 0
            },

            achievements: [],

            rewardsClaimed: [],

            shop: {
                ownedThemes: ["midnight"],
                equippedTheme: "midnight"
            },

            settings: {
                sound: true,
                reducedMotion: false
            }
        };
    }

    function isPlainObject(value) {
        return value &&
            typeof value === "object" &&
            !Array.isArray(value);
    }

    function mergeDeep(base, incoming) {
        const output = { ...base };

        if (!isPlainObject(incoming)) {
            return output;
        }

        for (const [key, value] of Object.entries(incoming)) {
            if (
                isPlainObject(value) &&
                isPlainObject(output[key])
            ) {
                output[key] = mergeDeep(output[key], value);
            } else {
                output[key] = value;
            }
        }

        return output;
    }

    function normalizeSave(raw) {
        const save = mergeDeep(defaultSave(), raw);

        save.version = 2;

        save.profile.nickname =
            String(save.profile.nickname ?? "").slice(0, 30);

        save.coins = Math.max(
            0,
            Math.floor(Number(save.coins) || 0)
        );

        save.stats.puzzlesSolved = Math.max(
            0,
            Math.floor(Number(save.stats.puzzlesSolved) || 0)
        );

        save.stats.financeChallengesCompleted = Math.max(
            0,
            Math.floor(
                Number(save.stats.financeChallengesCompleted) || 0
            )
        );

        save.stats.totalCoinsEarned = Math.max(
            0,
            Math.floor(Number(save.stats.totalCoinsEarned) || 0)
        );

        save.stats.totalCoinsSpent = Math.max(
            0,
            Math.floor(Number(save.stats.totalCoinsSpent) || 0)
        );

        save.puzzle.maxUnlockedIndex = Math.max(
            0,
            Math.floor(
                Number(save.puzzle.maxUnlockedIndex) || 0
            )
        );

        save.achievements = Array.from(
            new Set(
                Array.isArray(save.achievements)
                    ? save.achievements.filter(id => ACHIEVEMENTS[id])
                    : []
            )
        );

        save.rewardsClaimed = Array.from(
            new Set(
                Array.isArray(save.rewardsClaimed)
                    ? save.rewardsClaimed.map(String)
                    : []
            )
        );

        const ownedThemes = Array.isArray(save.shop.ownedThemes)
            ? save.shop.ownedThemes.filter(id => THEMES[id])
            : [];

        save.shop.ownedThemes = Array.from(
            new Set(["midnight", ...ownedThemes])
        );

        if (
            !THEMES[save.shop.equippedTheme] ||
            !save.shop.ownedThemes.includes(save.shop.equippedTheme)
        ) {
            save.shop.equippedTheme = "midnight";
        }

        save.settings.sound = Boolean(save.settings.sound);
        save.settings.reducedMotion =
            Boolean(save.settings.reducedMotion);

        return save;
    }

    function readRaw() {
        try {
            const text = localStorage.getItem(SAVE_KEY);

            if (!text) {
                return null;
            }

            return JSON.parse(text);
        } catch (error) {
            console.error("Could not read NumberOnWings save:", error);
            return null;
        }
    }

    function migrateLegacySave() {
        const legacyName =
            localStorage.getItem(LEGACY_NAME_KEY) || "";

        const legacyLevel =
            Number(localStorage.getItem(LEGACY_LEVEL_KEY));

        const hasLegacy =
            legacyName.trim() !== "" ||
            Number.isFinite(legacyLevel);

        if (!hasLegacy) {
            return null;
        }

        const save = defaultSave();

        save.profile.nickname = legacyName.trim().slice(0, 30);

        if (Number.isFinite(legacyLevel) && legacyLevel > 0) {
            save.puzzle.maxUnlockedIndex =
                Math.floor(legacyLevel);

            save.stats.puzzlesSolved =
                Math.floor(legacyLevel);
        }

        return save;
    }

    function load() {
        const raw = readRaw();

        if (raw) {
            return normalizeSave(raw);
        }

        const migrated = migrateLegacySave();

        if (migrated) {
            write(migrated, {
                silent: true
            });

            return normalizeSave(migrated);
        }

        return defaultSave();
    }

    function dispatchChange(save) {
        window.dispatchEvent(
            new CustomEvent("now:save-changed", {
                detail: structuredCloneSafe(save)
            })
        );
    }

    function structuredCloneSafe(value) {
        if (typeof structuredClone === "function") {
            return structuredClone(value);
        }

        return JSON.parse(JSON.stringify(value));
    }

    function write(nextSave, options = {}) {
        const normalized = normalizeSave(nextSave);

        localStorage.setItem(
            SAVE_KEY,
            JSON.stringify(normalized)
        );

        applyTheme(normalized);
        applySettings(normalized);

        if (!options.silent) {
            dispatchChange(normalized);
        }

        return structuredCloneSafe(normalized);
    }

    function update(mutator) {
        const save = load();

        mutator(save);

        evaluateAchievements(save);

        return write(save);
    }

    function setNickname(nickname) {
        const clean =
            String(nickname ?? "")
                .trim()
                .slice(0, 30);

        return update(save => {
            save.profile.nickname = clean;
        });
    }

    function addCoins(amount) {
        const cleanAmount = Math.max(
            0,
            Math.floor(Number(amount) || 0)
        );

        if (cleanAmount === 0) {
            return load();
        }

        return update(save => {
            save.coins += cleanAmount;
            save.stats.totalCoinsEarned += cleanAmount;
        });
    }

    function spendCoins(amount) {
        const cleanAmount = Math.max(
            0,
            Math.floor(Number(amount) || 0)
        );

        const save = load();

        if (
            cleanAmount <= 0 ||
            save.coins < cleanAmount
        ) {
            return {
                ok: false,
                save
            };
        }

        save.coins -= cleanAmount;
        save.stats.totalCoinsSpent += cleanAmount;

        evaluateAchievements(save);

        return {
            ok: true,
            save: write(save)
        };
    }

    function completePuzzle(index) {
        const cleanIndex = Math.max(
            0,
            Math.floor(Number(index) || 0)
        );

        const save = load();

        if (cleanIndex !== save.puzzle.maxUnlockedIndex) {
            return {
                newlyCompleted: false,
                earnedCoins: 0,
                save
            };
        }

        save.puzzle.maxUnlockedIndex += 1;
        save.stats.puzzlesSolved =
            Math.max(
                save.stats.puzzlesSolved,
                save.puzzle.maxUnlockedIndex
            );

        let earnedCoins = 5;

        if (save.puzzle.maxUnlockedIndex % 10 === 0) {
            earnedCoins += 20;
        }

        save.coins += earnedCoins;
        save.stats.totalCoinsEarned += earnedCoins;

        evaluateAchievements(save);

        return {
            newlyCompleted: true,
            earnedCoins,
            save: write(save)
        };
    }

    function claimReward(key, amount) {
        const rewardKey = String(key);
        const cleanAmount = Math.max(
            0,
            Math.floor(Number(amount) || 0)
        );

        const save = load();

        if (save.rewardsClaimed.includes(rewardKey)) {
            return {
                claimed: false,
                earnedCoins: 0,
                save
            };
        }

        save.rewardsClaimed.push(rewardKey);
        save.coins += cleanAmount;
        save.stats.totalCoinsEarned += cleanAmount;

        evaluateAchievements(save);

        return {
            claimed: true,
            earnedCoins: cleanAmount,
            save: write(save)
        };
    }

    function completeFinanceChallenge(challengeId, reward = 12) {
        const rewardKey =
            `finance:${String(challengeId)}`;

        const save = load();

        if (save.rewardsClaimed.includes(rewardKey)) {
            return {
                claimed: false,
                earnedCoins: 0,
                save
            };
        }

        save.rewardsClaimed.push(rewardKey);
        save.stats.financeChallengesCompleted += 1;

        const cleanReward = Math.max(
            0,
            Math.floor(Number(reward) || 0)
        );

        save.coins += cleanReward;
        save.stats.totalCoinsEarned += cleanReward;

        if (!save.achievements.includes("finance-starter")) {
            unlockAchievement(
                save,
                "finance-starter"
            );
        }

        evaluateAchievements(save);

        return {
            claimed: true,
            earnedCoins: cleanReward,
            save: write(save)
        };
    }

    function unlockAchievement(save, id) {
        const definition = ACHIEVEMENTS[id];

        if (
            !definition ||
            save.achievements.includes(id)
        ) {
            return false;
        }

        save.achievements.push(id);

        const reward =
            Math.max(0, Number(definition.reward) || 0);

        save.coins += reward;
        save.stats.totalCoinsEarned += reward;

        return true;
    }

    function evaluateAchievements(save) {
        let changed = true;
        let guard = 0;

        while (changed && guard < 10) {
            changed = false;
            guard += 1;

            if (
                save.stats.puzzlesSolved >= 1 &&
                unlockAchievement(save, "first-flight")
            ) {
                changed = true;
            }

            if (
                save.stats.puzzlesSolved >= 10 &&
                unlockAchievement(save, "ten-solved")
            ) {
                changed = true;
            }

            if (
                save.stats.puzzlesSolved >= 25 &&
                unlockAchievement(save, "twenty-five-solved")
            ) {
                changed = true;
            }

            if (
                save.stats.puzzlesSolved >= 50 &&
                unlockAchievement(save, "fifty-solved")
            ) {
                changed = true;
            }

            if (
                save.coins >= 100 &&
                unlockAchievement(save, "coin-collector")
            ) {
                changed = true;
            }

            if (
                save.coins >= 500 &&
                unlockAchievement(save, "coin-vault")
            ) {
                changed = true;
            }
        }
    }

    function buyTheme(themeId) {
        const theme = THEMES[themeId];

        if (!theme) {
            return {
                ok: false,
                reason: "unknown-theme",
                save: load()
            };
        }

        const save = load();

        if (save.shop.ownedThemes.includes(themeId)) {
            return {
                ok: false,
                reason: "already-owned",
                save
            };
        }

        if (save.coins < theme.price) {
            return {
                ok: false,
                reason: "not-enough-coins",
                save
            };
        }

        save.coins -= theme.price;
        save.stats.totalCoinsSpent += theme.price;
        save.shop.ownedThemes.push(themeId);

        unlockAchievement(save, "theme-buyer");
        evaluateAchievements(save);

        return {
            ok: true,
            reason: "purchased",
            save: write(save)
        };
    }

    function equipTheme(themeId) {
        const save = load();

        if (
            !THEMES[themeId] ||
            !save.shop.ownedThemes.includes(themeId)
        ) {
            return {
                ok: false,
                save
            };
        }

        save.shop.equippedTheme = themeId;

        return {
            ok: true,
            save: write(save)
        };
    }

    function setSetting(key, value) {
        const allowed = new Set([
            "sound",
            "reducedMotion"
        ]);

        if (!allowed.has(key)) {
            return load();
        }

        return update(save => {
            save.settings[key] = Boolean(value);
        });
    }

    function applyTheme(save = load()) {
        const theme =
            THEMES[save.shop.equippedTheme]
                ? save.shop.equippedTheme
                : "midnight";

        document.documentElement.dataset.nowTheme =
            theme;
    }

    function applySettings(save = load()) {
        document.documentElement.dataset.reducedMotion =
            save.settings.reducedMotion
                ? "true"
                : "false";
    }

    function exportSave() {
        return JSON.stringify(load(), null, 2);
    }

    function importSave(jsonText) {
        let parsed;

        try {
            parsed = JSON.parse(jsonText);
        } catch {
            return {
                ok: false,
                reason: "invalid-json"
            };
        }

        if (
            !parsed ||
            typeof parsed !== "object"
        ) {
            return {
                ok: false,
                reason: "invalid-save"
            };
        }

        const normalized =
            normalizeSave(parsed);

        return {
            ok: true,
            save: write(normalized)
        };
    }

    function reset() {
        localStorage.removeItem(SAVE_KEY);
        localStorage.removeItem(LEGACY_NAME_KEY);
        localStorage.removeItem(LEGACY_LEVEL_KEY);

        const fresh = defaultSave();

        write(fresh);

        return fresh;
    }

    function hasReward(key) {
        return load().rewardsClaimed.includes(String(key));
    }

    const api = {
        SAVE_KEY,
        ACHIEVEMENTS,
        THEMES,

        load,
        write,
        update,

        setNickname,
        addCoins,
        spendCoins,

        completePuzzle,
        claimReward,
        completeFinanceChallenge,

        buyTheme,
        equipTheme,

        setSetting,

        applyTheme,
        applySettings,

        exportSave,
        importSave,
        reset,
        hasReward
    };

    window.NumberOnWingsSave = api;

    applyTheme();
    applySettings();

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            () => {
                applyTheme();
                applySettings();
            }
        );
    }
})();
