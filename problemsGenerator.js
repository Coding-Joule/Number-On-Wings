function randomInt(min, max) { return Math.floor(Math.random() * (max -
min + 1)) + min; }

function gcd(a, b) { while (b !== 0) { [a, b] = [b, a % b]; } return a;
}

function lcm(a, b) { return a / gcd(a, b) * b; }

function factorial(n) { let r = 1; for (let i = 2; i <= n; i++) r *= i;
return r; }

function simplifyFraction(a, b) { const g = gcd(a, b); return
${a/g}/${b/g}; }

function generatePuzzles(count = 100) {

    const puzzles = [];
    const used = new Set();

    function add(topic, question, answer) {
        if (used.has(question)) return;
        used.add(question);
        puzzles.push({
            topic,
            question,
            answer: String(answer)
        });
    }

    const generators = [

        () => {
            const a=randomInt(10,99), b=randomInt(10,99);
            add("Arithmetic",`What is ${a} + ${b}?`,a+b);
        },

        () => {
            const a=randomInt(50,200), b=randomInt(10,a);
            add("Arithmetic",`What is ${a} - ${b}?`,a-b);
        },

        () => {
            const a=randomInt(3,20), b=randomInt(3,20);
            add("Arithmetic",`What is ${a} Ã ${b}?`,a*b);
        },

        () => {
            const a=randomInt(40,300), b=randomInt(2,15);
            if(a%b===0){
                add("Arithmetic",`What is ${a} Ã· ${b}?`,a/b);
            }
        },

        () => {
            const x=randomInt(2,30);
            const c=randomInt(2,9);
            const k=randomInt(1,20);
            add("Algebra",
                `Solve for x: ${c}x + ${k} = ${c*x+k}`,
                x);
        },

        () => {
            const x=randomInt(2,25);
            const c=randomInt(2,8);
            const k=randomInt(1,15);
            add("Algebra",
                `Solve for x: ${c}x - ${k} = ${c*x-k}`,
                x);
        },

        () => {
            const side=randomInt(2,30);
            add("Geometry",
                `A square has side length ${side}. What is its area?`,
                side*side);
        },

        () => {
            const l=randomInt(3,20), w=randomInt(3,20);
            add("Geometry",
                `A rectangle is ${l} by ${w}. What is its perimeter?`,
                2*(l+w));
        },

        () => {
            const l=randomInt(3,20), w=randomInt(3,20);
            add("Geometry",
                `A rectangle is ${l} by ${w}. What is its area?`,
                l*w);
        },

        () => {
            const g=randomInt(2,15);
            const a=g*randomInt(2,15);
            const b=g*randomInt(2,15);
            add("Number Theory",
                `What is the greatest common divisor of ${a} and ${b}?`,
                gcd(a,b));
        },

        () => {
            const a=randomInt(2,20), b=randomInt(2,20);
            add("Number Theory",
                `What is the least common multiple of ${a} and ${b}?`,
                lcm(a,b));
        },

        () => {
            const d=randomInt(3,15);
            const q=randomInt(2,20);
            const r=randomInt(0,d-1);
            add("Number Theory",
                `What is the remainder when ${d*q+r} is divided by ${d}?`,
                r);
        },

        () => {
            const n=randomInt(3,8);
            add("Combinatorics",
                `How many ways can ${n} different books be arranged on a shelf?`,
                factorial(n));
        },

        () => {
            const n=randomInt(2,8);
            const k=randomInt(1,n-1);
            add("Combinatorics",
                `How many subsets of size ${k} does a ${n}-element set have?`,
                factorial(n)/(factorial(k)*factorial(n-k)));
        },

        () => {
            const red=randomInt(1,8);
            const blue=randomInt(1,8);
            add("Probability",
                `A bag has ${red} red balls and ${blue} blue balls. What is the probability of choosing a red ball? (fraction)`,
                simplifyFraction(red,red+blue));
        },

        () => {
            const n=randomInt(2,25);
            add("Powers",
                `What is ${n}Â²?`,
                n*n);
        },

        () => {
            const n=randomInt(2,10);
            add("Powers",
                `What is ${n}Â³?`,
                n*n*n);
        },

        () => {
            const s=randomInt(1,20);
            const d=randomInt(2,10);
            add("Sequences",
                `What comes next? ${s}, ${s+d}, ${s+2*d}, ${s+3*d}, ?`,
                s+4*d);
        },

        () => {
            const seqs=[
                [1,1,2,3,5],
                [2,3,5,8,13],
                [3,5,8,13,21],
                [5,8,13,21,34],
                [8,13,21,34,55]
            ];
            const seq=seqs[randomInt(0,seqs.length-1)];
            add("Sequences",
                `What comes next? ${seq[0]}, ${seq[1]}, ${seq[2]}, ${seq[3]}, ?`,
                seq[4]);
        },

        () => {
            add("Logic",
                "If all bloops are razzies and all razzies are zibs, are all bloops zibs? (yes/no)",
                "yes");
        },

        () => {
            add("Logic",
                "How many months have at least 28 days?",
                12);
        },

        () => {
            add("Logic",
                "A farmer has 10 sheep. All but 3 run away. How many remain?",
                3);
        }
    ];

    while (puzzles.length < count) {
        generators[randomInt(0,generators.length-1)]();
    }

    return puzzles;

}
