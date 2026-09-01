/* NumberOnWings — the front door.
 *
 * You arrive and you are already playing. Twenty-one stones, take one to
 * three, whoever takes the last one wins.
 *
 * IrAcoNAl plays perfectly, and perfect play here is a single line: leave
 * a multiple of four behind you. Twenty-one is not a multiple of four, so
 * the game IS winnable from the start -- the visitor just has to find the
 * invariant. That is the whole point of putting it first. Nobody is told
 * anything; they lose a few times and go looking.
 */

/* Scoped: this page also runs problem.js, and top-level names would collide. */
(function () {

    const START = 21;
    const MAX_TAKE = 3;
    const STORE_KEY = "now.nim";

    const el = {
        stones:   document.getElementById("stones"),
        count:    document.getElementById("game-count"),
        controls: document.getElementById("game-controls"),
        status:   document.getElementById("game-status"),
        tally:    document.getElementById("game-tally"),
        again:    document.getElementById("game-again"),
        reveal:   document.getElementById("game-reveal"),
        solution: document.getElementById("game-solution")
    };

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let taken = [];      /* who took each stone, in order */
    let over = false;
    let busy = false;

    function loadTally() {
        try {
            const raw = localStorage.getItem(STORE_KEY);
            const t = raw ? JSON.parse(raw) : null;
            if (t && typeof t.you === "number" && typeof t.them === "number") return t;
        } catch (e) { /* storage off; the game still plays */ }
        return { you: 0, them: 0 };
    }

    function saveTally() {
        try {
            localStorage.setItem(STORE_KEY, JSON.stringify(tally));
        } catch (e) { /* nothing to do, and nothing worth breaking the page over */ }
    }

    let tally = loadTally();

    function left() {
        return START - taken.length;
    }

    /* Perfect play, in one line: leave a multiple of four. From a multiple of
       four there is no such move, so any move loses and it takes one. */
    function bestTake(remaining) {
        const move = remaining % (MAX_TAKE + 1);
        return move === 0 ? 1 : move;
    }

    function buildBoard() {
        el.stones.innerHTML = "";
        for (let i = 0; i < START; i++) {
            const stone = document.createElement("li");
            stone.className = "stone";
            el.stones.appendChild(stone);
        }
    }

    function paint() {
        const nodes = el.stones.children;
        for (let i = 0; i < START; i++) {
            /* Stones are taken from the end, so the ones still in play read
               left to right and the count stays easy to see. */
            const who = taken[START - 1 - i];
            if (who) nodes[i].setAttribute("data-by", who);
            else nodes[i].removeAttribute("data-by");
        }

        const remaining = left();
        el.count.textContent = remaining === 1 ? "1 stone left" : remaining + " stones left";

        Array.prototype.forEach.call(el.controls.children, function (button) {
            const n = Number(button.getAttribute("data-take"));
            button.disabled = over || busy || n > remaining;
        });

        el.tally.textContent = "you " + tally.you + " · IrAcoNAl " + tally.them;
        el.again.hidden = !over;
    }

    function say(text) {
        el.status.textContent = text;
    }

    function word(n) {
        return ["", "one", "two", "three"][n] || String(n);
    }

    function finish(winner) {
        over = true;
        if (winner === "you") {
            tally.you++;
            say("You took the last stone. You win — and if that felt like luck, try to do it again on purpose.");
        } else {
            tally.them++;
            say("IrAcoNAl took the last stone. It is not guessing.");
        }
        saveTally();
        paint();
    }

    function theirTurn() {
        const remaining = left();
        const n = Math.min(bestTake(remaining), remaining);

        for (let i = 0; i < n; i++) taken.push("them");

        if (left() === 0) { finish("them"); return; }

        busy = false;
        say("IrAcoNAl takes " + word(n) + ".");
        paint();
    }

    function yourTurn(n) {
        if (over || busy || n > left()) return;

        for (let i = 0; i < n; i++) taken.push("you");

        if (left() === 0) { finish("you"); return; }

        busy = true;
        say("You take " + word(n) + ".");
        paint();

        /* A beat before it answers, so it reads as an opponent rather than a
           calculation. Nothing is being computed in that time. */
        window.setTimeout(theirTurn, calm ? 0 : 420);
    }

    function reset() {
        taken = [];
        over = false;
        busy = false;
        say("Your move.");
        paint();
    }

    el.controls.addEventListener("click", function (event) {
        const button = event.target.closest("button[data-take]");
        if (button) yourTurn(Number(button.getAttribute("data-take")));
    });

    el.again.addEventListener("click", reset);

    el.reveal.addEventListener("click", function () {
        const hidden = el.solution.hidden;
        el.solution.hidden = !hidden;
        el.reveal.textContent = hidden ? "hide the working" : "how does it keep winning?";
    });

    buildBoard();
    reset();

}());
