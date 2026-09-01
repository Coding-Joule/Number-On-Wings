/* NumberOnWings — tools.
 *
 * Three independent machines sharing one page. Nothing here talks to
 * anything else, so each block can be lifted out on its own.
 */

const INK    = "#f0efec";
const ACCENT = "#e0a340";
const LINE   = "#22222a";
const FAINT  = "#7c7c85";
const SUNK   = "#08080a";

/* A canvas has two sizes: the CSS box it occupies and the pixel grid it
   draws on. Matching the second to the first times the device pixel ratio
   is the difference between crisp and smeared on a retina iPad. */
function fitCanvas(canvas) {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = Math.round(width * (canvas.height / canvas.width));

    if (canvas.width !== Math.round(width * ratio)) {
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
    }

    const ctx = canvas.getContext("2d");
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    return { ctx: ctx, w: width, h: height };
}

function debounce(fn, wait) {
    let timer = null;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(fn, wait);
    };
}


/* ═══ prime factoriser ═══════════════════════════════════════════════ */

(function () {
    const form   = document.getElementById("factor-form");
    const input  = document.getElementById("factor-input");
    const result = document.getElementById("factor-result");
    const note   = document.getElementById("factor-note");
    if (!form) return;

    const LIMIT = 1e12;   /* trial division to 10^6 stays instant */

    function factorise(n) {
        const factors = [];
        let rest = n;

        for (let d = 2; d * d <= rest; d += (d === 2 ? 1 : 2)) {
            while (rest % d === 0) {
                factors.push(d);
                rest /= d;
            }
        }
        /* Whatever survives the loop is larger than its own square root,
           so it cannot be split any further: it is prime. */
        if (rest > 1) factors.push(rest);
        return factors;
    }

    function group(factors) {
        const out = [];
        for (const p of factors) {
            const last = out[out.length - 1];
            if (last && last.p === p) last.k++;
            else out.push({ p: p, k: 1 });
        }
        return out;
    }

    function say(text, filled) {
        result.textContent = text;
        result.setAttribute("data-filled", filled ? "yes" : "no");
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const raw = input.value.trim();
        const n = Number(raw);

        if (raw === "" || !Number.isFinite(n) || !Number.isInteger(n)) {
            say("Whole numbers only — that is where primes live.", false);
            note.textContent = "";
            return;
        }
        if (n < 0) {
            say("Negatives factorise the same as their positive twin. Try " + (-n) + ".", false);
            note.textContent = "";
            return;
        }
        if (n > LIMIT) {
            say("That is past a trillion, and this factoriser divides one number at a time.", false);
            note.textContent = "Factoring genuinely large numbers is hard — which is exactly what public-key cryptography is built on.";
            return;
        }
        if (n === 0) {
            say("0 is divisible by everything, so it has no factorisation at all.", false);
            note.textContent = "";
            return;
        }
        if (n === 1) {
            say("1 = the empty product — no primes at all.", true);
            note.textContent = "This is why 1 is not counted as prime: unique factorisation only works if 1 stays out of it.";
            return;
        }

        const grouped = group(factorise(n));

        const pretty = grouped
            .map(function (g) { return g.k === 1 ? String(g.p) : g.p + "^" + g.k; })
            .join(" × ");

        say(n + " = " + pretty, true);

        if (grouped.length === 1 && grouped[0].k === 1) {
            note.textContent = n + " is prime. It has exactly 2 divisors: 1 and itself.";
        } else {
            /* The exponents already contain the divisor count — one is
               chosen independently for each prime. */
            const divisors = grouped.reduce(function (acc, g) { return acc * (g.k + 1); }, 1);
            const sum = grouped.map(function (g) { return "(" + g.k + "+1)"; }).join(" × ");
            note.textContent = "Divisor count: " + sum + " = " + divisors +
                ", because a divisor picks its own exponent for each prime.";
        }
    });
}());


/* ═══ fractal tree ═══════════════════════════════════════════════════ */

(function () {
    const canvas = document.getElementById("fractal-canvas");
    if (!canvas) return;

    const angleIn = document.getElementById("frac-angle");
    const scaleIn = document.getElementById("frac-scale");
    const windIn  = document.getElementById("frac-wind");
    const angleOut = document.getElementById("frac-angle-out");
    const scaleOut = document.getElementById("frac-scale-out");
    const windOut  = document.getElementById("frac-wind-out");
    const note = document.getElementById("fractal-note");

    /* Depth is capped rather than left to the shrink factor. At a shrink
       of 0.8 the branches would keep splitting past sixteen levels, and
       2^17 strokes a frame is not a tree, it is a stalled browser. */
    const MAX_DEPTH = 12;
    const MIN_LEN = 3;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let time = 0;
    let frame = null;

    function branch(ctx, x, y, len, angle, width, depth, wind) {
        const rad = angle * Math.PI / 180;
        const x2 = x + Math.sin(rad) * len;
        const y2 = y - Math.cos(rad) * len;

        /* Fade from ink at the trunk to the accent at the tips, so the
           depth of the recursion is visible as colour. */
        const t = depth / MAX_DEPTH;
        ctx.strokeStyle = depth === 0 ? INK : mix(INK, ACCENT, t);
        ctx.lineWidth = Math.max(0.6, width);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        if (depth >= MAX_DEPTH || len < MIN_LEN) {
            ctx.fillStyle = ACCENT;
            ctx.beginPath();
            ctx.arc(x2, y2, Math.max(1, width * 0.8), 0, Math.PI * 2);
            ctx.fill();
            return;
        }

        const spread = Number(angleIn.value);
        const shrink = Number(scaleIn.value) / 100;

        /* The sway grows with depth: the trunk is anchored, the tips move
           most. That is also how a real tree behaves in wind. */
        const sway = wind === 0 ? 0
            : Math.sin(time * 1.3 + depth * 0.55) * wind * (depth + 1) / MAX_DEPTH * 2.2;

        branch(ctx, x2, y2, len * shrink, angle + spread + sway, width * 0.72, depth + 1, wind);
        branch(ctx, x2, y2, len * shrink, angle - spread + sway, width * 0.72, depth + 1, wind);
    }

    function mix(a, b, t) {
        const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
        const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
        const c = pa.map(function (v, i) { return Math.round(v + (pb[i] - v) * t); });
        return "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
    }

    function draw() {
        const fit = fitCanvas(canvas);
        const ctx = fit.ctx;

        ctx.fillStyle = SUNK;
        ctx.fillRect(0, 0, fit.w, fit.h);

        const wind = calm ? 0 : Number(windIn.value);
        const trunk = Math.min(fit.h * 0.26, 150);

        branch(ctx, fit.w / 2, fit.h - 20, trunk, 0, Math.max(4, fit.w / 110), 0, wind);
    }

    function loop() {
        time += 0.016;
        draw();
        frame = requestAnimationFrame(loop);
    }

    function restart() {
        if (frame) cancelAnimationFrame(frame);
        frame = null;

        const moving = !calm && Number(windIn.value) > 0;
        if (moving) loop();
        else draw();
    }

    function readout() {
        angleOut.textContent = angleIn.value + "°";
        scaleOut.textContent = (Number(scaleIn.value) / 100).toFixed(2);
        windOut.textContent = windIn.value;

        /* Doubling every level: 2^0 + 2^1 + ... + 2^d = 2^(d+1) - 1. */
        const total = Math.pow(2, MAX_DEPTH + 1) - 1;
        note.textContent = MAX_DEPTH + " levels of splitting, so " +
            total.toLocaleString("en") + " branches — each one half the job of the level below it." +
            (calm ? " (Wind held still: your system asks for reduced motion.)" : "");
    }

    [angleIn, scaleIn, windIn].forEach(function (control) {
        control.addEventListener("input", function () {
            readout();
            restart();
        });
    });

    window.addEventListener("resize", debounce(restart, 150));

    readout();
    restart();
}());


/* ═══ equation grapher ═══════════════════════════════════════════════ */

(function () {
    const canvas = document.getElementById("graph-canvas");
    if (!canvas) return;

    const form   = document.getElementById("graph-form");
    const input  = document.getElementById("eq-input");
    const marks  = document.getElementById("label-roots");
    const result = document.getElementById("graph-result");

    /* ── a real parser, not eval ──────────────────────────────────────
       eval would run whatever the box contained. This reads the string
       into a tree of small functions instead, so the worst a visitor can
       type is a syntax error. */

    const FUNCS = {
        sin: Math.sin, cos: Math.cos, tan: Math.tan,
        asin: Math.asin, acos: Math.acos, atan: Math.atan,
        sqrt: Math.sqrt, abs: Math.abs, exp: Math.exp,
        ln: Math.log, log: Math.log10, sign: Math.sign,
        floor: Math.floor, ceil: Math.ceil, round: Math.round
    };

    const CONSTS = { pi: Math.PI, "π": Math.PI, e: Math.E, tau: Math.PI * 2 };

    function tokenise(src) {
        const tokens = [];
        let i = 0;
        const text = src.replace(/\s+/g, "").toLowerCase();

        while (i < text.length) {
            const c = text[i];

            if (/[0-9.]/.test(c)) {
                let j = i;
                while (j < text.length && /[0-9.]/.test(text[j])) j++;
                const value = Number(text.slice(i, j));
                if (!Number.isFinite(value)) throw new Error("'" + text.slice(i, j) + "' is not a number");
                tokens.push({ type: "num", value: value });
                i = j;
            } else if (/[a-zπ]/.test(c)) {
                let j = i;
                while (j < text.length && /[a-zπ]/.test(text[j])) j++;
                tokens.push({ type: "name", value: text.slice(i, j) });
                i = j;
            } else if ("+-*/^(),".indexOf(c) !== -1) {
                tokens.push({ type: c });
                i++;
            } else {
                throw new Error("I don't know what to do with '" + c + "'");
            }
        }
        return tokens;
    }

    function parse(src) {
        const tokens = tokenise(src);
        let pos = 0;

        const peek = function () { return tokens[pos]; };
        const eat = function (type) {
            if (!peek() || peek().type !== type) throw new Error("expected '" + type + "'");
            return tokens[pos++];
        };

        /* A factor can start here — used to spot implied multiplication,
           so that 3x and 2sin(x) mean what everyone expects. */
        function startsFactor(token) {
            return token && (token.type === "num" || token.type === "name" || token.type === "(");
        }

        function expression() {
            let left = term();
            while (peek() && (peek().type === "+" || peek().type === "-")) {
                const op = tokens[pos++].type;
                const right = term();
                const l = left, r = right;
                left = op === "+"
                    ? function (x) { return l(x) + r(x); }
                    : function (x) { return l(x) - r(x); };
            }
            return left;
        }

        function term() {
            let left = unary();
            while (peek()) {
                let op;
                if (peek().type === "*" || peek().type === "/") {
                    op = tokens[pos++].type;
                } else if (startsFactor(peek())) {
                    op = "*";                 /* implied multiplication */
                } else {
                    break;
                }
                const right = unary();
                const l = left, r = right;
                left = op === "*"
                    ? function (x) { return l(x) * r(x); }
                    : function (x) { return l(x) / r(x); };
            }
            return left;
        }

        function unary() {
            if (peek() && peek().type === "-") {
                pos++;
                const operand = unary();
                return function (x) { return -operand(x); };
            }
            if (peek() && peek().type === "+") {
                pos++;
                return unary();
            }
            return power();
        }

        function power() {
            const base = atom();
            if (peek() && peek().type === "^") {
                pos++;
                /* Right-associative, and the exponent may be signed, so
                   x^-2 and 2^3^2 both behave. */
                const exponent = unary();
                return function (x) { return Math.pow(base(x), exponent(x)); };
            }
            return base;
        }

        function atom() {
            const token = peek();
            if (!token) throw new Error("the expression stops early");

            if (token.type === "num") {
                pos++;
                return function () { return token.value; };
            }

            if (token.type === "(") {
                pos++;
                const inner = expression();
                eat(")");
                return inner;
            }

            if (token.type === "name") {
                pos++;
                const name = token.value;

                if (Object.prototype.hasOwnProperty.call(FUNCS, name)) {
                    eat("(");
                    const arg = expression();
                    eat(")");
                    const fn = FUNCS[name];
                    return function (x) { return fn(arg(x)); };
                }
                if (name === "x") return function (x) { return x; };
                if (Object.prototype.hasOwnProperty.call(CONSTS, name)) {
                    const value = CONSTS[name];
                    return function () { return value; };
                }
                throw new Error("'" + name + "' isn't something I know");
            }

            throw new Error("unexpected '" + token.type + "'");
        }

        const fn = expression();
        if (pos < tokens.length) throw new Error("there is leftover text at the end");
        return fn;
    }

    /* ── roots ────────────────────────────────────────────────────────
       Sample densely, and wherever the sign flips between neighbours,
       bisect down to the crossing. */
    function findRoots(f, from, to) {
        const STEPS = 2000;
        const step = (to - from) / STEPS;
        const roots = [];
        let prevX = from;
        let prevY = f(from);

        for (let i = 1; i <= STEPS; i++) {
            const x = from + i * step;
            const y = f(x);

            if (Number.isFinite(y) && Number.isFinite(prevY)) {
                if (y === 0) {
                    roots.push(x);
                } else if (prevY * y < 0) {
                    let lo = prevX, hi = x, loY = prevY;
                    for (let k = 0; k < 60; k++) {
                        const mid = (lo + hi) / 2;
                        const midY = f(mid);
                        if (loY * midY <= 0) { hi = mid; }
                        else { lo = mid; loY = midY; }
                    }
                    const root = (lo + hi) / 2;
                    /* A vertical asymptote also flips sign. A genuine root
                       has a small value there; a pole does not. */
                    if (Math.abs(f(root)) < 1e-6) roots.push(root);
                }
            }
            prevX = x;
            prevY = y;
        }

        /* Collapse duplicates that bisection found from both sides. */
        return roots.filter(function (r, i) {
            return i === 0 || Math.abs(r - roots[i - 1]) > 1e-7;
        });
    }

    /* Choosing the vertical window is the whole difficulty of plotting.
       Scaling to the extreme values lets one steep tail flatten everything
       worth looking at: on x^4 - 3x^2 + 1 the tails reach 625 while the
       part with the roots in it lives between -1.25 and 1.

       So the window is built from the curve's turning points, which is
       where the interesting behaviour is, and then clipped back to the
       values the function actually takes. */
    function yRange(f, from, to) {
        const N = 800;
        const ys = [];
        for (let i = 0; i <= N; i++) {
            ys.push(f(from + (to - from) * i / N));
        }

        const finite = ys.filter(Number.isFinite);
        if (!finite.length) return { lo: -5, hi: 5 };

        /* Trimmed extremes: one spike beside an asymptote is not scenery. */
        const sorted = finite.slice().sort(function (a, b) { return a - b; });
        const cut = Math.floor(sorted.length * 0.02);
        let lo = sorted[cut];
        let hi = sorted[sorted.length - 1 - cut];

        /* Local maxima and minima, from where the sampled slope turns. */
        const turns = [];
        for (let i = 1; i < ys.length - 1; i++) {
            const a = ys[i - 1], b = ys[i], c = ys[i + 1];
            if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c)) continue;
            if ((b >= a && b >= c) || (b <= a && b <= c)) turns.push(b);
        }

        if (turns.length) {
            const tLo = Math.min.apply(null, turns);
            const tHi = Math.max.apply(null, turns);
            const span = tHi - tLo;

            if (span > 1e-12) {
                /* Room to breathe around the features, but never wider than
                   the curve's own range — a function that fits already
                   should not be pushed away into the middle. */
                lo = Math.max(lo, tLo - span * 0.5);
                hi = Math.min(hi, tHi + span * 0.5);
            }
        }

        /* The axis itself is a feature: this page is about where f crosses it. */
        if (lo > 0) lo = 0;
        if (hi < 0) hi = 0;
        if (hi - lo < 1e-9) { lo -= 1; hi += 1; }

        const pad = (hi - lo) * 0.12;
        return { lo: lo - pad, hi: hi + pad };
    }

    function niceStep(span) {
        const rough = span / 8;
        const power = Math.pow(10, Math.floor(Math.log10(rough)));
        const norm = rough / power;
        const step = norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10;
        return step * power;
    }

    function label(value) {
        if (Math.abs(value) < 1e-10) return "0";
        const rounded = Math.round(value * 1000) / 1000;
        return String(rounded);
    }

    const X_FROM = -5;
    const X_TO = 5;
    let current = null;

    function render() {
        const fit = fitCanvas(canvas);
        const ctx = fit.ctx;
        const w = fit.w, h = fit.h;

        ctx.fillStyle = SUNK;
        ctx.fillRect(0, 0, w, h);
        if (!current) return;

        const f = current.f;
        const range = yRange(f, X_FROM, X_TO);

        const px = function (x) { return (x - X_FROM) / (X_TO - X_FROM) * w; };
        const py = function (y) { return h - (y - range.lo) / (range.hi - range.lo) * h; };

        /* grid */
        ctx.strokeStyle = LINE;
        ctx.lineWidth = 1;
        ctx.fillStyle = FAINT;
        ctx.font = "11px ui-monospace, Menlo, monospace";

        const xStep = niceStep(X_TO - X_FROM);
        for (let x = Math.ceil(X_FROM / xStep) * xStep; x <= X_TO; x += xStep) {
            ctx.beginPath();
            ctx.moveTo(px(x), 0);
            ctx.lineTo(px(x), h);
            ctx.stroke();
            if (Math.abs(x) > 1e-9) ctx.fillText(label(x), px(x) + 4, py(0) + 14);
        }

        const yStep = niceStep(range.hi - range.lo);
        for (let y = Math.ceil(range.lo / yStep) * yStep; y <= range.hi; y += yStep) {
            ctx.beginPath();
            ctx.moveTo(0, py(y));
            ctx.lineTo(w, py(y));
            ctx.stroke();
            /* Skip a label that would be sliced off by the top edge. */
            if (Math.abs(y) > 1e-9 && py(y) > 14) ctx.fillText(label(y), px(0) + 5, py(y) - 4);
        }

        /* axes */
        ctx.strokeStyle = "#3a3a45";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, py(0));
        ctx.lineTo(w, py(0));
        ctx.moveTo(px(0), 0);
        ctx.lineTo(px(0), h);
        ctx.stroke();

        /* curve */
        ctx.strokeStyle = ACCENT;
        ctx.lineWidth = 2;
        ctx.beginPath();

        let drawing = false;
        const samples = Math.max(600, Math.round(w * 2));
        let lastY = null;

        for (let i = 0; i <= samples; i++) {
            const x = X_FROM + (X_TO - X_FROM) * i / samples;
            const y = f(x);

            if (!Number.isFinite(y)) { drawing = false; lastY = null; continue; }

            /* Lift the pen across an asymptote instead of drawing the
               vertical line that is not part of the graph. */
            const jump = lastY !== null && Math.abs(y - lastY) > (range.hi - range.lo) * 1.5;
            const outside = y < range.lo - (range.hi - range.lo) || y > range.hi + (range.hi - range.lo);

            if (!drawing || jump) {
                ctx.moveTo(px(x), py(y));
                drawing = true;
            } else {
                ctx.lineTo(px(x), py(y));
            }
            lastY = outside ? null : y;
        }
        ctx.stroke();

        /* roots */
        const roots = findRoots(f, X_FROM, X_TO);

        if (marks.checked && roots.length) {
            ctx.fillStyle = INK;
            ctx.strokeStyle = INK;
            ctx.font = "12px ui-monospace, Menlo, monospace";

            roots.forEach(function (r) {
                ctx.beginPath();
                ctx.arc(px(r), py(0), 4.5, 0, Math.PI * 2);
                ctx.fillStyle = SUNK;
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.fillStyle = INK;
                ctx.fillText(label(r), px(r) + 8, py(0) - 10);
            });
        }

        if (roots.length) {
            result.textContent = "f(x) = 0 at x = " +
                roots.map(function (r) { return (Math.round(r * 10000) / 10000); }).join(",  ") +
                "   (between " + X_FROM + " and " + X_TO + ")";
        } else {
            result.textContent = "No sign changes between " + X_FROM + " and " + X_TO +
                " — the curve never crosses the axis here. A curve that only touches the axis " +
                "would also be missed: it has no sign change to find.";
        }
        result.setAttribute("data-filled", "yes");
    }

    function submit(event) {
        if (event) event.preventDefault();
        try {
            current = { f: parse(input.value) };
            /* Force one evaluation now: a bad function name should be
               reported before the whole canvas is redrawn. */
            current.f(1);
            render();
        } catch (error) {
            current = null;
            const fit = fitCanvas(canvas);
            fit.ctx.fillStyle = SUNK;
            fit.ctx.fillRect(0, 0, fit.w, fit.h);
            result.textContent = "I couldn't read that: " + error.message + ".";
            result.setAttribute("data-filled", "no");
        }
    }

    form.addEventListener("submit", submit);
    marks.addEventListener("change", function () { if (current) render(); });
    window.addEventListener("resize", debounce(function () { if (current) render(); }, 150));

    submit(null);
}());
