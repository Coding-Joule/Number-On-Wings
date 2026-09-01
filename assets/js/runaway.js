/* NumberOnWings — the runaway button.
 *
 * The joke and the mathematics are the same thing. Each dodge is exactly
 * half the length of the one before, so the distances form a geometric
 * series: 140 + 70 + 35 + ... The button can dodge as often as it likes
 * and still never travel further than 280 px in total, which is why it
 * always gets caught. The tally in the corner is the partial sum, closing
 * on its limit in front of you.
 */

const FIRST_JUMP = 140;   /* a, the first term */
const RATIO = 0.5;        /* r, the shrink per dodge */
const GIVE_UP = 2;        /* below 2 px a dodge is not a dodge */
const LIMIT = FIRST_JUMP / (1 - RATIO);

const arena  = document.getElementById("arena");
const button = document.getElementById("runaway");
const tally  = document.getElementById("tally");
const prize  = document.getElementById("prize");
const again  = document.getElementById("again");

let dodges = 0;
let travelled = 0;
let caught = false;
let lastDodge = 0;

function nextDistance() {
    return FIRST_JUMP * Math.pow(RATIO, dodges);
}

function place(x, y) {
    button.style.left = x + "px";
    button.style.top = y + "px";
    button.style.transform = "translate(-50%, -50%)";
}

function centre() {
    const box = button.getBoundingClientRect();
    const field = arena.getBoundingClientRect();
    return {
        x: box.left - field.left + box.width / 2,
        y: box.top - field.top + box.height / 2
    };
}

/* Move a fixed distance in some direction that keeps the button inside
   the arena. The distance is never shortened to fit — if it were, the
   tally would stop matching the series it claims to be showing. */
function dodge(awayFromX, awayFromY) {
    const distance = nextDistance();
    const here = centre();
    const box = button.getBoundingClientRect();
    const field = arena.getBoundingClientRect();

    const padX = box.width / 2 + 8;
    const padY = box.height / 2 + 8;
    const minX = padX, maxX = field.width - padX;
    const minY = padY, maxY = field.height - padY;

    let base = Math.atan2(here.y - awayFromY, here.x - awayFromX);
    if (!Number.isFinite(base)) base = Math.random() * Math.PI * 2;

    /* Sweep outwards from "directly away" until a heading fits. */
    for (let step = 0; step < 24; step++) {
        const spread = (step % 2 ? -1 : 1) * Math.ceil(step / 2) * (Math.PI / 12);
        const angle = base + spread;
        const x = here.x + Math.cos(angle) * distance;
        const y = here.y + Math.sin(angle) * distance;

        if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
            place(x, y);
            dodges++;
            travelled += distance;
            update();
            return;
        }
    }

    /* Cornered: bounce back towards the middle, still the full distance. */
    const inward = Math.atan2(field.height / 2 - here.y, field.width / 2 - here.x);
    place(
        Math.min(maxX, Math.max(minX, here.x + Math.cos(inward) * distance)),
        Math.min(maxY, Math.max(minY, here.y + Math.sin(inward) * distance))
    );
    dodges++;
    travelled += distance;
    update();
}

function update() {
    tally.textContent =
        "dodges " + dodges +
        " · distance travelled " + travelled.toFixed(1) + " px" +
        " · it can never pass " + LIMIT + " px";
}

function canStillRun() {
    return !caught && nextDistance() >= GIVE_UP;
}

function reveal() {
    caught = true;
    button.textContent = "caught";
    button.disabled = true;

    const terms = [];
    for (let i = 0; i < Math.min(dodges, 5); i++) {
        terms.push(+(FIRST_JUMP * Math.pow(RATIO, i)).toFixed(2));
    }

    document.getElementById("prize-series").innerHTML =
        terms.join(" + ") + " + &hellip; &rarr; " + LIMIT + " px";

    document.getElementById("prize-limit").textContent = LIMIT + " px";

    document.getElementById("prize-terms").innerHTML =
        "<i>a</i> = " + FIRST_JUMP + " and <i>r</i> = &frac12;";

    prize.hidden = false;
    prize.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* Desktop: it flinches as the pointer closes in, before any click. */
arena.addEventListener("pointermove", function (event) {
    if (event.pointerType === "touch" || !canStillRun()) return;

    const field = arena.getBoundingClientRect();
    const px = event.clientX - field.left;
    const py = event.clientY - field.top;
    const here = centre();
    const gap = Math.hypot(px - here.x, py - here.y);

    const now = performance.now();
    if (gap < 90 && now - lastDodge > 140) {
        lastDodge = now;
        dodge(px, py);
    }
});

/* Touch, and any pointer that gets there anyway: the press itself is the
   thing it dodges, so a finger has the same chase as a mouse. */
button.addEventListener("click", function (event) {
    if (canStillRun()) {
        event.preventDefault();
        const field = arena.getBoundingClientRect();
        dodge(event.clientX - field.left, event.clientY - field.top);
        return;
    }
    reveal();
});

/* Keyboard: it dodges the same number of times, then yields. Refusing to
   open at all for a keyboard user would just be a broken page. */
button.addEventListener("keydown", function (event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    if (canStillRun()) {
        const here = centre();
        dodge(here.x - 1, here.y);
    } else {
        reveal();
    }
});

again.addEventListener("click", function () {
    dodges = 0;
    travelled = 0;
    caught = false;
    button.disabled = false;
    button.textContent = "Click me if you dare";
    button.style.left = "50%";
    button.style.top = "50%";
    prize.hidden = true;
    update();
    arena.scrollIntoView({ behavior: "smooth", block: "center" });
});

update();
