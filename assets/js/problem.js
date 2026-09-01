/* NumberOnWings — the problem on the front door.
 *
 * The homepage greets you and then hands you something to do. Everything
 * below is the machinery for that.
 *
 * Rule for this list: six problems, six genuinely different pieces of
 * mathematics. Not one template with the integers swapped — that is fake
 * variety, and anyone who solves two of them would notice.
 */

/* Scoped: this page also runs game.js, and top-level names would collide. */
(function () {

    const PROBLEMS = [
        {
            id: "factorial-zeros",
            field: "Number theory",
            statement:
                '100! means 1 &times; 2 &times; 3 &times; &hellip; &times; 100. ' +
                'Written out in full it runs to 158 digits. How many of those ' +
                'digits, at the very end, are zeros?',
            nudge: "You are not expected to multiply it out. That is the point.",
            answers: ["24"],
            solution:
                '<p>A zero on the end is a factor of ten, and <span class="math">10 = 2 &times; 5</span>. ' +
                'So the real question is how many times 10 divides 100!.</p>' +

                '<p>Every second number contributes a factor of 2, but only every fifth ' +
                'contributes a 5. The twos are abundant, the fives are scarce &mdash; so the ' +
                'fives are the bottleneck. Count the fives and you have counted the zeros.</p>' +

                '<p>Multiples of 5 up to 100: <span class="math">&lfloor;100/5&rfloor; = 20</span>. ' +
                'But 25, 50, 75 and 100 each carry a <em>second</em> factor of 5 that the first ' +
                'sweep only counted once, so add <span class="math">&lfloor;100/25&rfloor; = 4</span>. ' +
                'Then <span class="math">125 &gt; 100</span>, and there is nothing left to collect.</p>' +

                '<p><strong>20 + 4 = 24 zeros.</strong></p>',
            takeaway:
                'That is Legendre’s formula: the exponent of a prime <span class="var">p</span> ' +
                'in <span class="var">n</span>! is ' +
                '<span class="math">&lfloor;<i>n</i>/<i>p</i>&rfloor; + &lfloor;<i>n</i>/<i>p</i><sup>2</sup>&rfloor; + ' +
                '&lfloor;<i>n</i>/<i>p</i><sup>3</sup>&rfloor; + &hellip;</span> &mdash; a sum that looks infinite ' +
                'but stops itself the moment <span class="math"><i>p</i><sup>k</sup></span> overtakes ' +
                '<span class="var">n</span>.'
        },

        {
            id: "last-digit",
            field: "Modular arithmetic",
            statement:
                'What is the last digit of <span class="math">7<sup>2026</sup></span>?',
            nudge: "The number has 1713 digits. You only want the final one.",
            answers: ["9"],
            solution:
                '<p>The last digit of a product depends only on the last digits of the things ' +
                'you multiplied. Everything further left is irrelevant, so throw it away and ' +
                'work modulo 10.</p>' +

                '<div class="block-math">7, 49, 343, 2401, 16807, &hellip; &rarr; 7, 9, 3, 1, 7, &hellip;</div>' +

                '<p>The last digits cycle with period 4, and they will keep cycling forever: once ' +
                'a residue repeats, everything after it repeats too.</p>' +

                '<p>So only <span class="math">2026 mod 4</span> matters. ' +
                '<span class="math">2026 = 4 &times; 506 + 2</span>, which lands two steps into the ' +
                'cycle: <span class="math">7<sup>2026</sup> &equiv; 7<sup>2</sup> &equiv; 49 &equiv; 9</span> ' +
                '(mod 10).</p>' +

                '<p><strong>The last digit is 9.</strong></p>',
            takeaway:
                'Euler’s theorem says the period had to divide 4 before you computed a single ' +
                'power: <span class="math">&phi;(10) = 4</span>, so ' +
                '<span class="math"><i>a</i><sup>4</sup> &equiv; 1</span> (mod 10) for every ' +
                '<span class="var">a</span> coprime to 10.'
        },

        {
            id: "divisors-2026",
            field: "Divisors",
            statement:
                'How many positive whole numbers divide 2026 exactly, with nothing left over? ' +
                '(Count 1 and 2026 themselves.)',
            nudge: "Factorise first. Counting comes almost free after that.",
            answers: ["4"],
            solution:
                '<p>2026 is even, so <span class="math">2026 = 2 &times; 1013</span>. Now: is 1013 prime?</p>' +

                '<p>You only have to test primes <span class="var">p</span> with ' +
                '<span class="math"><i>p</i><sup>2</sup> &le; 1013</span> &mdash; because if 1013 had two ' +
                'factors both larger than its square root, their product would already exceed 1013. ' +
                'Since <span class="math">31<sup>2</sup> = 961</span> and ' +
                '<span class="math">37<sup>2</sup> = 1369</span>, the search stops at 31. None of ' +
                '2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31 divides 1013, so <strong>1013 is prime</strong>.</p>' +

                '<p>That gives <span class="math">2026 = 2<sup>1</sup> &times; 1013<sup>1</sup></span>. ' +
                'Building a divisor means choosing how many 2s to take (0 or 1) and how many 1013s ' +
                'to take (0 or 1), independently. Two choices times two choices:</p>' +

                '<p><strong>4 divisors &mdash; 1, 2, 1013 and 2026.</strong></p>',
            takeaway:
                'In general, if <span class="math"><i>n</i> = <i>p</i><sub>1</sub><sup><i>a</i></sup> ' +
                '<i>p</i><sub>2</sub><sup><i>b</i></sup> &hellip;</span> then <span class="math"><i>n</i></span> has ' +
                '<span class="math">(<i>a</i>+1)(<i>b</i>+1)&hellip;</span> divisors. The multiplication is there ' +
                'because the exponents are chosen independently &mdash; it is the same reasoning as ' +
                'counting outfits from shirts and trousers.'
        },

        {
            id: "board-parity",
            field: "Invariants",
            statement:
                'The numbers 1 to 100 are written on a board. Rub out any two of them and write ' +
                'down their difference (the positive one). Repeat until a single number is left. ' +
                'Is that final number odd or even?',
            nudge: "It does not depend on which pairs you pick. That is the whole point.",
            answers: ["even", "iseven", "it'seven"],
            solution:
                '<p>You cannot predict <em>which</em> number survives &mdash; different choices give ' +
                'different answers. So look for something the moves cannot change.</p>' +

                '<p>Replacing <span class="var">a</span> and <span class="var">b</span> with ' +
                '<span class="math">|<i>a</i> &minus; <i>b</i>|</span> changes the total on the board by</p>' +

                '<div class="block-math"><i>a</i> + <i>b</i> &minus; |<i>a</i> &minus; <i>b</i>| = 2 &times; min(<i>a</i>, <i>b</i>)</div>' +

                '<p>which is always even. So the <em>parity</em> of the sum is untouched by every ' +
                'legal move, however many you make and in whatever order.</p>' +

                '<p>The starting sum is <span class="math">1 + 2 + &hellip; + 100 = ' +
                '(100 &times; 101)/2 = 5050</span>, which is even. At the end only one number is ' +
                'left, so that number <em>is</em> the sum.</p>' +

                '<p><strong>The last number is even.</strong> Always.</p>',
            takeaway:
                'This is an invariant argument. You give up on predicting the outcome and instead ' +
                'find a quantity the rules cannot touch &mdash; then let it do the work. Knowing ' +
                'only the parity turns out to be enough to answer the question completely.'
        },

        {
            id: "telescope",
            field: "Series",
            statement:
                '<span class="math">1/(1&middot;2) + 1/(2&middot;3) + 1/(3&middot;4) + ' +
                '1/(4&middot;5) + &hellip;</span> , continuing forever. What does it add up to?',
            nudge: "Infinitely many positive terms. The total is still a very ordinary number.",
            answers: ["1", "1.0", "one"],
            solution:
                '<p>Each term splits in two:</p>' +

                '<div class="block-math">1/(<i>k</i>(<i>k</i>+1)) = 1/<i>k</i> &minus; 1/(<i>k</i>+1)</div>' +

                '<p>(check it by putting the right side over a common denominator). Now add the ' +
                'first <span class="var">n</span> terms and watch what happens:</p>' +

                '<div class="block-math">(1 &minus; &frac12;) + (&frac12; &minus; &#8531;) + ' +
                '(&#8531; &minus; &frac14;) + &hellip; + (1/<i>n</i> &minus; 1/(<i>n</i>+1))</div>' +

                '<p>Every interior fraction appears twice, once positive and once negative, and ' +
                'cancels. The whole sum collapses to its two ends:</p>' +

                '<div class="block-math">1 &minus; 1/(<i>n</i>+1)</div>' +

                '<p>As <span class="var">n</span> grows, <span class="math">1/(<i>n</i>+1)</span> shrinks ' +
                'towards nothing.</p>' +

                '<p><strong>The sum is exactly 1.</strong></p>',
            takeaway:
                'A telescoping series. Adding forever is not the same as adding up to infinity ' +
                '&mdash; the terms here shrink fast enough that the whole infinite pile fits inside 1. ' +
                'Change the terms to <span class="math">1/<i>k</i></span> and the same infinite pile ' +
                'becomes unbounded, which is worth sitting with.'
        },

        {
            id: "two-circles",
            field: "Geometry",
            statement:
                'A circle is drawn inside a square, touching all four sides. A second circle is ' +
                'drawn through the square’s four corners. The big circle’s area is how many ' +
                'times the small one’s?',
            nudge: "No size is given, because you do not need one.",
            answers: ["2", "2x", "twice", "two"],
            solution:
                '<p>No dimensions were given, so choose your own &mdash; let the square have side ' +
                '<span class="var">s</span>. The answer cannot depend on that choice, or the ' +
                'question would be unanswerable.</p>' +

                '<p>The inner circle touches opposite sides, so its diameter is ' +
                '<span class="var">s</span>: radius <span class="math"><i>r</i> = <i>s</i>/2</span>.</p>' +

                '<p>The outer circle passes through all four corners, so its diameter is the ' +
                'square’s diagonal, <span class="math"><i>s</i>&radic;2</span>: radius ' +
                '<span class="math"><i>R</i> = <i>s</i>&radic;2/2</span>.</p>' +

                '<p>So <span class="math"><i>R</i>/<i>r</i> = &radic;2</span>. Areas go as the square of lengths, ' +
                'and the <span class="math">&pi;</span> and the <span class="var">s</span> both ' +
                'cancel:</p>' +

                '<div class="block-math">&pi;<i>R</i><sup>2</sup> / &pi;<i>r</i><sup>2</sup> = ' +
                '(<i>R</i>/<i>r</i>)<sup>2</sup> = (&radic;2)<sup>2</sup> = 2</div>' +

                '<p><strong>Exactly twice, for every square there has ever been.</strong></p>',
            takeaway:
                'Lengths scale by <span class="var">k</span>, areas by ' +
                '<span class="math"><i>k</i><sup>2</sup></span>, volumes by ' +
                '<span class="math"><i>k</i><sup>3</sup></span>. A ratio question rarely needs real ' +
                'measurements &mdash; set the awkward length to 1 and let it cancel.'
        }
    ];

    const LINES = {
        right: [
            "IrAcoNAl nods once. That is the one.",
            "Correct — and IrAcoNAl is not easily impressed.",
            "Got it. That is exactly the number."
        ],
        wrong: [
            "Not that one. IrAcoNAl has seen far worse guesses.",
            "No — though a wrong answer is usually where the idea is hiding.",
            "Not yet. Nothing is stopping you from trying again."
        ],
        shown: "IrAcoNAl has seen this one before. Read it properly, then try the next.",
        idle: "IrAcoNAl is watching you think.",
        known: "You have already had this one. IrAcoNAl remembers."
    };

    const STORE_KEY = "now.solved";

    const el = {
        field:     document.getElementById("problem-field"),
        body:      document.getElementById("problem-body"),
        form:      document.getElementById("answer-form"),
        input:     document.getElementById("answer-input"),
        verdict:   document.getElementById("verdict"),
        solution:  document.getElementById("solution"),
        reveal:    document.getElementById("reveal-btn"),
        another:   document.getElementById("another-btn"),
        count:     document.getElementById("solved-count"),
        mascot:    document.getElementById("mascot-line")
    };

    /* Solved problems are remembered per browser. This is a memory, not a
       score: nothing is ranked and nothing is compared to anyone else. */
    function loadSolved() {
        try {
            const raw = localStorage.getItem(STORE_KEY);
            return new Set(raw ? JSON.parse(raw) : []);
        } catch (e) {
            return new Set();
        }
    }

    function saveSolved(set) {
        try {
            localStorage.setItem(STORE_KEY, JSON.stringify([...set]));
        } catch (e) {
            /* Private browsing, or storage switched off. The page still works. */
        }
    }

    let solved = loadSolved();
    let index = 0;

    /* "Today's problem" has to mean today's. Days since the epoch, in local
       time, so it turns over at the reader's midnight rather than UTC's. */
    function todayIndex() {
        const now = new Date();
        const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const day = Math.floor(midnight.getTime() / 86400000);
        return ((day % PROBLEMS.length) + PROBLEMS.length) % PROBLEMS.length;
    }

    function pick(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    /* Accept the answer a person would actually type: stray spaces, a capital
       letter, a trailing full stop, "24" written as "24.". */
    function normalise(text) {
        return String(text)
            .toLowerCase()
            .replace(/[\s,]/g, "")
            .replace(/\.$/, "")
            .trim();
    }

    function setVerdict(text, state) {
        el.verdict.textContent = text;
        if (state) {
            el.verdict.setAttribute("data-state", state);
        } else {
            el.verdict.removeAttribute("data-state");
        }
    }

    function updateCount() {
        el.count.textContent = solved.size
            ? solved.size + " of " + PROBLEMS.length + " solved"
            : "";
    }

    function showSolution(problem) {
        el.solution.innerHTML =
            "<h3>How it goes</h3>" +
            problem.solution +
            '<div class="takeaway"><p>' + problem.takeaway + "</p></div>";
        el.solution.hidden = false;
        el.reveal.textContent = "hide the working";
    }

    function hideSolution() {
        el.solution.hidden = true;
        el.reveal.textContent = "show me how it's done";
    }

    function render(i) {
        index = ((i % PROBLEMS.length) + PROBLEMS.length) % PROBLEMS.length;
        const p = PROBLEMS[index];

        el.field.textContent = p.field;
        el.body.innerHTML =
            '<p class="problem-statement" id="problem-statement">' + p.statement + "</p>" +
            (p.nudge ? '<p class="problem-statement">' + p.nudge + "</p>" : "");

        el.input.value = "";
        hideSolution();

        if (solved.has(p.id)) {
            setVerdict("Solved. The working is below if you want it again.", "right");
            el.mascot.textContent = LINES.known;
        } else {
            setVerdict("", null);
            el.mascot.textContent = LINES.idle;
        }

        updateCount();
    }

    el.form.addEventListener("submit", function (event) {
        event.preventDefault();
        const p = PROBLEMS[index];
        const given = normalise(el.input.value);

        if (!given) {
            setVerdict("Type something. A wrong answer beats an empty box.", null);
            return;
        }

        if (p.answers.some(function (a) { return normalise(a) === given; })) {
            setVerdict("Correct.", "right");
            el.mascot.textContent = pick(LINES.right);
            if (!solved.has(p.id)) {
                solved.add(p.id);
                saveSolved(solved);
                updateCount();
            }
            showSolution(p);
        } else {
            setVerdict("Not that. Try again — nothing is counting your attempts.", "wrong");
            el.mascot.textContent = pick(LINES.wrong);
        }
    });

    el.reveal.addEventListener("click", function () {
        const p = PROBLEMS[index];
        if (el.solution.hidden) {
            showSolution(p);
            if (!solved.has(p.id)) {
                setVerdict("Answer: " + p.answers[0] + ". Read the reasoning, not just the number.", null);
                el.mascot.textContent = LINES.shown;
            }
        } else {
            hideSolution();
        }
    });

    /* Move on to the next problem you have not solved. Once they are all
       solved it simply steps forward, so the button never dead-ends. */
    el.another.addEventListener("click", function () {
        for (let step = 1; step <= PROBLEMS.length; step++) {
            const candidate = (index + step) % PROBLEMS.length;
            if (!solved.has(PROBLEMS[candidate].id)) {
                render(candidate);
                el.input.focus();
                return;
            }
        }
        render(index + 1);
        el.input.focus();
    });

    render(todayIndex());

}());
