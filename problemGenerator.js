const SUBJECTS = {
    ALGEBRA: "Algebra",
    NUMBER_THEORY: "Number Theory",
    GEOMETRY: "Geometry",
    COUNTING: "Counting & Probability",
    LOGIC: "Logic",
    GRAPH_THEORY: "Graph Theory"
};

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatTerm(coef, variable) {
    if (coef === 0) return "";
    if (coef > 0) return `+ ${coef}${variable}`;
    return `- ${Math.abs(coef)}${variable}`;
}

function formatConstant(num) {
    if (num === 0) return "";
    if (num > 0) return `+ ${num}`;
    return `- ${Math.abs(num)}`;
}

function generateLinearEquation(level) {
    const x = randInt(-10, 10);

    const a = randInt(2, 6);
    const b = randInt(1, 10);
    const c = randInt(1, 10);
    const d = randInt(1, 5);

    const leftValue = a * (x + b) - c;
    const e = leftValue - d * x;

    return {
        topic: SUBJECTS.ALGEBRA,
        difficulty: 3,
        points: 30,
        xp: {
            [SUBJECTS.ALGEBRA]: 15
        },
        question: `Solve for x: ${a}(x + ${b}) - ${c} = ${d}x ${formatConstant(e)}`,
        answer: String(x)
    };
}

function generateFactorableQuadratic(level) {
    let r1 = randInt(-10, 10);
    let r2 = randInt(-10, 10);

    while (r1 === 0 || r2 === 0 || r1 === r2) {
        r1 = randInt(-10, 10);
        r2 = randInt(-10, 10);
    }

    const b = -(r1 + r2);
    const c = r1 * r2;

    const roots = [r1, r2].sort((a, b) => a - b);

    return {
        topic: SUBJECTS.ALGEBRA,
        difficulty: 4,
        points: 40,
        xp: {
            [SUBJECTS.ALGEBRA]: 20
        },
        question: `Solve for x: x² ${formatTerm(b, "x")} ${formatConstant(c)} = 0`,
        answer: roots.join(",")
    };
}

function generateExpandedCubic(level) {
    let r1 = randInt(-6, 6);
    let r2 = randInt(-6, 6);
    let r3 = randInt(-6, 6);

    while (
        r1 === 0 || r2 === 0 || r3 === 0 ||
        r1 === r2 || r1 === r3 || r2 === r3
    ) {
        r1 = randInt(-6, 6);
        r2 = randInt(-6, 6);
        r3 = randInt(-6, 6);
    }

    const a = -(r1 + r2 + r3);
    const b = r1 * r2 + r1 * r3 + r2 * r3;
    const c = -r1 * r2 * r3;

    const roots = [r1, r2, r3].sort((a, b) => a - b);

    return {
        topic: SUBJECTS.ALGEBRA,
        difficulty: 5,
        points: 50,
        xp: {
            [SUBJECTS.ALGEBRA]: 25
        },
        question: `Solve for x: x³ ${formatTerm(a, "x²")} ${formatTerm(b, "x")} ${formatConstant(c)} = 0`,
        answer: roots.join(",")
    };
}

function generateProblem(level) {
    const algebraGenerators = [
        generateLinearEquation,
        generateFactorableQuadratic,
        generateExpandedCubic
    ];

    const generator = algebraGenerators[randInt(0, algebraGenerators.length - 1)];
    return generator(level);
}
