// Homepage: the best rational approximation to pi, for a denominator limit
// you control. It gets closer. It never arrives. That is the point.

// pi to 50 decimal places, held as an exact fraction so the continued
// fraction below is computed from real digits rather than a float.
const PI_DIGITS = "14159265358979323846264338327950288419716939937510";
const PI_NUM = BigInt("3" + PI_DIGITS);
const PI_DEN = 10n ** BigInt(PI_DIGITS.length);

const MAX_Q = 10000000; // ten million: still nowhere near enough
const SHOWN_DECIMALS = 24;

// --- exact arithmetic helpers -------------------------------------------

// Long division: p/q as a decimal string with `n` places, no float involved.
function decimals(p, q, n) {
    let out = (p / q).toString() + ".";
    let rem = p % q;
    for (let i = 0; i < n; i++) {
        rem *= 10n;
        out += (rem / q).toString();
        rem %= q;
    }
    return out;
}

const SUP = { "0":"⁰","1":"¹","2":"²","3":"³","4":"⁴",
              "5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","-":"⁻" };
function superscript(s) {
    return String(s).split("").map(c => SUP[c] || c).join("");
}

// |pi - p/q| rendered as d.dd x 10^-e, again without floats.
function errorText(p, q) {
    let num = PI_NUM * q - p * PI_DEN;
    if (num < 0n) num = -num;
    const den = PI_DEN * q;
    if (num === 0n) return "0"; // cannot happen, and that is the joke

    let e = 0;
    while (num < den) { num *= 10n; e++; }   // now num/den is in [1, 10)
    const lead = num / den;
    let rem = num % den;
    let frac = "";
    for (let i = 0; i < 2; i++) {
        rem *= 10n;
        frac += (rem / den).toString();
        rem %= den;
    }
    return lead + "." + frac + " × 10" + superscript(-e);
}

// --- best rational approximation ----------------------------------------

// Continued fraction of pi, and the convergents built from it.
function convergents() {
    let n = PI_NUM, d = PI_DEN;
    // h/k are numerators/denominators, two steps of history each
    let h0 = 0n, h1 = 1n, k0 = 1n, k1 = 0n;
    const list = [];
    for (let i = 0; i < 40 && d !== 0n; i++) {
        const a = n / d;
        const h = a * h1 + h0, k = a * k1 + k0;
        if (k > BigInt(MAX_Q) * 10n) break;
        list.push({ p: h, q: k, prevP: h1, prevQ: k1 });
        h0 = h1; h1 = h;
        k0 = k1; k1 = k;
        const r = n % d;
        n = d; d = r;
    }
    return list;
}
const CONV = convergents();

// Is |pi - a/b| smaller than |pi - c/d|? Cross-multiplied, so exact.
function closer(a, b, c, d) {
    let l = PI_NUM * b - a * PI_DEN; if (l < 0n) l = -l;
    let r = PI_NUM * d - c * PI_DEN; if (r < 0n) r = -r;
    return l * d < r * b; // compare l/b against r/d
}

// The genuinely best p/q with q <= limit. The convergents of the continued
// fraction are the classic answers, but between two of them a semiconvergent
// can do better, so the best of both is taken.
function bestApprox(limit) {
    const L = BigInt(limit);

    // last convergent that fits under the limit
    let best = { p: 3n, q: 1n }, prevP = 1n, prevQ = 0n;
    for (const c of CONV) {
        if (c.q > L) break;
        best = { p: c.p, q: c.q };
        prevP = c.prevP;
        prevQ = c.prevQ;
    }

    // the largest semiconvergent past it that still fits
    if (best.q > 0n) {
        const t = (L - prevQ) / best.q;
        if (t > 0n) {
            const cand = { p: t * best.p + prevP, q: t * best.q + prevQ };
            if (cand.q <= L && closer(cand.p, cand.q, best.p, best.q)) best = cand;
        }
    }
    return best;
}

// --- wiring --------------------------------------------------------------

window.addEventListener("load", function () {
    const slider = document.getElementById("q-slider");
    const fracEl = document.getElementById("frac");
    const piRow = document.getElementById("pi-row");
    const apRow = document.getElementById("approx-row");
    const errEl = document.getElementById("err");
    const limitEl = document.getElementById("limit");
    const matchEl = document.getElementById("matched");
    if (!slider) return;

    const PI_STR = "3." + PI_DIGITS.slice(0, SHOWN_DECIMALS);

    // Split a decimal string into the part matching pi and the part that
    // has already gone wrong.
    function split(s) {
        let i = 0;
        while (i < s.length && i < PI_STR.length && s[i] === PI_STR[i]) i++;
        return [s.slice(0, i), s.slice(i)];
    }

    function render() {
        // slider is linear in log space so small denominators stay reachable
        const t = Number(slider.value) / 1000;
        const limit = Math.max(1, Math.round(Math.pow(MAX_Q, t)));

        const { p, q } = bestApprox(limit);
        const approx = decimals(p, q, SHOWN_DECIMALS);
        const [good, bad] = split(approx);
        const digits = Math.max(0, good.replace("3.", "").length);

        fracEl.textContent = p + "/" + q;
        limitEl.textContent = limit.toLocaleString();
        piRow.innerHTML = '<span class="lit">' + PI_STR + "</span>";
        apRow.innerHTML = '<span class="lit">' + good + '</span><span class="dim">' + bad + "</span>";
        errEl.textContent = errorText(p, q);
        matchEl.textContent = digits + (digits === 1 ? " digit" : " digits");
    }

    slider.addEventListener("input", render);
    render();
});
