function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }

    return a;
}

function lcm(a, b) {
    return (a / gcd(a, b)) * b;
}

function factorial(n) {
    let result = 1;

    for (let i = 2; i <= n; i++) {
        result *= i;
    }

    return result;
}

function simplifyFraction(a, b) {
    const g = gcd(a, b);
    return `${a / g}/${b / g}`;
}

function generatePuzzles(count = 100) {
    const puzzles = [];
    const used = new Set();

    function add(topic, question, answer) {
        if (used.has(question)) {
            return;
        }

        used.add(question);

        puzzles.push({
            topic,
            question,
            answer: String(answer)
        });
    }

    const generators = [
        () => {
            const a = randomInt(10, 99);
            const b = randomInt(10, 99);

            add(
                "Arithmetic",
                `What is ${a} + ${b}?`,
                a + b
            );
        },

        () => {
            const a = randomInt(50, 200);
            const b = randomInt(10, a);

            add(
                "Arithmetic",
                `What is ${a} - ${b}?`,
                a - b
            );
        },

        () => {
            const a = randomInt(3, 20);
            const b = randomInt(3, 20);

            add(
                "Arithmetic",
                `What is ${a} × ${b}?`,
                a * b
            );
        },

        () => {
            const b = randomInt(2, 15);
            const answer = randomInt(2, 20);
            const a = b * answer;

            add(
                "Arithmetic",
                `What is ${a} ÷ ${b}?`,
                answer
            );
        },

        () => {
            const x = randomInt(2, 30);
            const c = randomInt(2, 9);
            const k = randomInt(1, 20);

            add(
                "Algebra",
                `Solve for x: ${c}x + ${k} = ${c * x + k}`,
                x
            );
        },

        () => {
            const x = randomInt(2, 25);
            const c = randomInt(2, 8);
            const k = randomInt(1, 15);

            add(
                "Algebra",
                `Solve for x: ${c}x - ${k} = ${c * x - k}`,
                x
            );
        },

        () => {
            const side = randomInt(2, 30);

            add(
                "Geometry",
                `A square has side length ${side}. What is its area?`,
                side * side
            );
        },

        () => {
            const length = randomInt(3, 20);
            const width = randomInt(3, 20);

            add(
                "Geometry",
                `A rectangle is ${length} by ${width}. What is its perimeter?`,
                2 * (length + width)
            );
        },

        () => {
            const length = randomInt(3, 20);
            const width = randomInt(3, 20);

            add(
                "Geometry",
                `A rectangle is ${length} by ${width}. What is its area?`,
                length * width
            );
        },

        () => {
            const commonFactor = randomInt(2, 15);
            const a = commonFactor * randomInt(2, 15);
            const b = commonFactor * randomInt(2, 15);

            add(
                "Number Theory",
                `What is the greatest common divisor of ${a} and ${b}?`,
                gcd(a, b)
            );
        },

        () => {
            const a = randomInt(2, 20);
            const b = randomInt(2, 20);

            add(
                "Number Theory",
                `What is the least common multiple of ${a} and ${b}?`,
                lcm(a, b)
            );
        },

        () => {
            const divisor = randomInt(3, 15);
            const quotient = randomInt(2, 20);
            const remainder = randomInt(0, divisor - 1);
            const number = divisor * quotient + remainder;

            add(
                "Number Theory",
                `What is the remainder when ${number} is divided by ${divisor}?`,
                remainder
            );
        },

        () => {
            const n = randomInt(3, 8);

            add(
                "Combinatorics",
                `How many ways can ${n} different books be arranged on a shelf?`,
                factorial(n)
            );
        },

        () => {
            const n = randomInt(2, 8);
            const k = randomInt(1, n - 1);
            const combinations =
                factorial(n) / (factorial(k) * factorial(n - k));

            add(
                "Combinatorics",
                `How many subsets of size ${k} does a ${n}-element set have?`,
                combinations
            );
        },

        () => {
            const red = randomInt(1, 8);
            const blue = randomInt(1, 8);

            add(
                "Probability",
                `A bag has ${red} red balls and ${blue} blue balls. What is the probability of choosing a red ball? (fraction)`,
                simplifyFraction(red, red + blue)
            );
        },

        () => {
            const n = randomInt(2, 25);

            add(
                "Powers",
                `What is ${n}²?`,
                n * n
            );
        },

        () => {
            const n = randomInt(2, 10);

            add(
                "Powers",
                `What is ${n}³?`,
                n * n * n
            );
        },

        () => {
            const start = randomInt(1, 20);
            const difference = randomInt(2, 10);

            add(
                "Sequences",
                `What comes next? ${start}, ${start + difference}, ${start + 2 * difference}, ${start + 3 * difference}, ?`,
                start + 4 * difference
            );
        },

        () => {
            const sequences = [
                [1, 1, 2, 3, 5],
                [2, 3, 5, 8, 13],
                [3, 5, 8, 13, 21],
                [5, 8, 13, 21, 34],
                [8, 13, 21, 34, 55]
            ];

            const sequence =
                sequences[randomInt(0, sequences.length - 1)];

            add(
                "Sequences",
                `What comes next? ${sequence[0]}, ${sequence[1]}, ${sequence[2]}, ${sequence[3]}, ?`,
                sequence[4]
            );
        },

        () => {
            add(
                "Logic",
                "If all bloops are razzies and all razzies are zibs, are all bloops zibs? (yes/no)",
                "yes"
            );
        },

        () => {
            add(
                "Logic",
                "How many months have at least 28 days?",
                12
            );
        },

        () => {
            add(
                "Logic",
                "A farmer has 10 sheep. All but 3 run away. How many remain?",
                3
            );
        }
    ];

    while (puzzles.length < count) {
        const generator =
            generators[randomInt(0, generators.length - 1)];

        generator();
    }

    return puzzles;
}
