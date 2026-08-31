// The forbidden zone: a button that does not want to be pressed.
// It dodges the pointer on desktop and teleports out from under taps on
// touch screens. After enough dodges it runs out of stamina and gives up.

const TAUNTS = [
    "Don't click it!",
    "I warned you.",
    "Still here?",
    "This is a waste of both our time.",
    "You are more stubborn than I expected.",
    "Fine. Keep going. See what happens.",
    "I am running out of places to hide.",
    "...ok. You win."
];

// How close the pointer may get (in px) before the button bolts.
const PANIC_RADIUS = 90;
// Dodges the button has in it before it surrenders and lets itself be clicked.
const STAMINA = 12;

window.addEventListener("load", function() {
    const btn = document.getElementById("trap-btn");
    const zone = document.querySelector(".trap-container");
    const taunt = document.getElementById("taunt");
    if (!btn || !zone) return;

    let dodges = 0;
    let caught = false;

    // Freeze the button's current spot as an absolute position inside the
    // zone, so moving it later doesn't fight with the flexbox centering.
    function unpin() {
        const b = btn.getBoundingClientRect();
        const z = zone.getBoundingClientRect();
        zone.style.position = "relative";
        btn.style.position = "absolute";
        btn.style.left = (b.left - z.left) + "px";
        btn.style.top = (b.top - z.top) + "px";
        btn.style.margin = "0";
    }

    function say(i) {
        if (taunt) taunt.textContent = TAUNTS[Math.min(i, TAUNTS.length - 1)];
    }

    // Pick a landing spot that stays inside the zone and is far from the
    // pointer, so the button never dives straight back under the finger.
    function flee(pointerX, pointerY) {
        if (btn.style.position !== "absolute") unpin();

        const z = zone.getBoundingClientRect();
        const w = btn.offsetWidth;
        const h = btn.offsetHeight;

        // Keep clear of the taunt line so the button never covers it.
        let minY = 0;
        if (taunt) {
            const t = taunt.getBoundingClientRect();
            minY = Math.max(0, t.bottom - z.top + 24);
        }

        const maxX = Math.max(0, z.width - w);
        const maxY = Math.max(minY, z.height - h);

        let best = { x: 0, y: minY, dist: -1 };
        // Sample a handful of spots and keep whichever is furthest away.
        for (let i = 0; i < 12; i++) {
            const x = Math.random() * maxX;
            const y = minY + Math.random() * (maxY - minY);
            const cx = z.left + x + w / 2;
            const cy = z.top + y + h / 2;
            const dist = Math.hypot(cx - pointerX, cy - pointerY);
            if (dist > best.dist) best = { x: x, y: y, dist: dist };
        }

        btn.style.left = best.x + "px";
        btn.style.top = best.y + "px";

        dodges++;
        say(dodges);

        if (dodges >= STAMINA) {
            caught = true;
            btn.textContent = "...fine. Click me.";
            btn.classList.add("exhausted");
        }
    }

    function surrender() {
        btn.textContent = "You actually caught it.";
        btn.disabled = true;
        if (taunt) {
            taunt.textContent =
                "IrAcoNAl: you chased a button " + dodges + " times. " +
                "There was never anything here. That was the whole joke.";
        }
    }

    // Desktop: bolt when the cursor gets close, before a click can land.
    document.addEventListener("mousemove", function(e) {
        if (caught) return;
        const b = btn.getBoundingClientRect();
        const dx = e.clientX - (b.left + b.width / 2);
        const dy = e.clientY - (b.top + b.height / 2);
        if (Math.hypot(dx, dy) < PANIC_RADIUS) flee(e.clientX, e.clientY);
    });

    // Touch: there is no hover, so teleport on the tap itself. Using
    // touchstart means the button is gone before the tap becomes a click.
    btn.addEventListener("touchstart", function(e) {
        if (caught) return;
        e.preventDefault(); // stop this tap from turning into a click
        const t = e.touches[0];
        flee(t.clientX, t.clientY);
    }, { passive: false });

    btn.addEventListener("click", function() {
        if (caught) surrender();
    });

    // Keep the button on screen if the window or iPad orientation changes.
    window.addEventListener("resize", function() {
        if (btn.style.position !== "absolute") return;
        const z = zone.getBoundingClientRect();
        const maxX = Math.max(0, z.width - btn.offsetWidth);
        const maxY = Math.max(0, z.height - btn.offsetHeight);
        btn.style.left = Math.min(parseFloat(btn.style.left) || 0, maxX) + "px";
        btn.style.top = Math.min(parseFloat(btn.style.top) || 0, maxY) + "px";
    });
});
