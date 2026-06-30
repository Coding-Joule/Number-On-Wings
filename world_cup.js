function toggleArticle() {
    const article = document.getElementById("article");

    if (article.style.display === "none") {
        article.style.display = "block";
        article.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
        article.style.display = "none";
    }
}

function toggleBracket() {
    const bracket = document.getElementById("bracket");

    if (bracket.style.display === "none") {
        bracket.style.display = "block";
        bracket.scrollIntoView({ behavior: "smooth", block: "start" });
        drawWorldCupBracket();
    } else {
        bracket.style.display = "none";
    }
}

const matches = [
    ["Canada", "South Africa", "Canada"],
    ["Netherlands", "Morocco", null],
    ["Brazil", "Japan", "Brazil"],
    ["Ivory Coast", "Norway", null],
    ["Paraguay", "Germany", "Paraguay"],
    ["France", "Sweden", null],
    ["Mexico", "Ecuador", null],
    ["England", "DR Congo", null],
    ["Spain", "Austria", null],
    ["Portugal", "Croatia", null],
    ["Belgium", "Senegal", null],
    ["United States", "Bosnia", null],
    ["Argentina", "Cape Verde", null],
    ["Australia", "Egypt", null],
    ["Switzerland", "Algeria", null],
    ["Colombia", "Ghana", null]
];

const flags = {
    Canada: "🇨🇦",
    "South Africa": "🇿🇦",
    Netherlands: "🇳🇱",
    Morocco: "🇲🇦",
    Brazil: "🇧🇷",
    Japan: "🇯🇵",
    "Ivory Coast": "🇨🇮",
    Norway: "🇳🇴",
    Paraguay: "🇵🇾",
    Germany: "🇩🇪",
    France: "🇫🇷",
    Sweden: "🇸🇪",
    Mexico: "🇲🇽",
    Ecuador: "🇪🇨",
    England: "🏴",
    "DR Congo": "🇨🇩",
    Spain: "🇪🇸",
    Austria: "🇦🇹",
    Portugal: "🇵🇹",
    Croatia: "🇭🇷",
    Belgium: "🇧🇪",
    Senegal: "🇸🇳",
    "United States": "🇺🇸",
    Bosnia: "🇧🇦",
    Argentina: "🇦🇷",
    "Cape Verde": "🇨🇻",
    Australia: "🇦🇺",
    Egypt: "🇪🇬",
    Switzerland: "🇨🇭",
    Algeria: "🇩🇿",
    Colombia: "🇨🇴",
    Ghana: "🇬🇭",
    TBD: ""
};

function drawWorldCupBracket() {
    const svg = document.getElementById("bracket-svg");
    if (!svg || svg.dataset.drawn === "true") return;

    svg.dataset.drawn = "true";

    svg.setAttribute("width", "1600");
    svg.setAttribute("height", "1900");
    svg.setAttribute("viewBox", "0 0 1600 1900");

    const x = [40, 360, 680, 1000, 1320];
    const y0 = 70;
    const gap = 105;
    const boxW = 230;
    const boxH = 86;

    const rounds = [];

    rounds[0] = matches.map((m, i) => ({
        top: m[0],
        bottom: m[1],
        winner: m[2],
        x: x[0],
        y: y0 + i * gap
    }));

    for (let r = 1; r < 5; r++) {
        rounds[r] = [];
        const count = Math.pow(2, 4 - r);

        for (let i = 0; i < count; i++) {
            const a = rounds[r - 1][i * 2];
            const b = rounds[r - 1][i * 2 + 1];

            const cy = (a.y + boxH / 2 + b.y + boxH / 2) / 2;

            rounds[r].push({
                top: getWinner(a),
                bottom: getWinner(b),
                winner: null,
                x: x[r],
                y: cy - boxH / 2
            });
        }
    }

    drawTitles(svg, x);

    rounds.forEach((round, r) => {
        round.forEach(match => {
            drawMatch(svg, match, boxW, boxH, r === 4);
        });
    });

    for (let r = 0; r < 4; r++) {
        for (let i = 0; i < rounds[r + 1].length; i++) {
            drawConnector(svg, rounds[r][i * 2], rounds[r][i * 2 + 1], rounds[r + 1][i], boxW, boxH);
        }
    }

    drawChampion(svg, x[4], rounds[4][0].y + 130);
}

function getWinner(match) {
    return match.winner || "TBD";
}

function drawTitles(svg, x) {
    const titles = ["Round of 32", "Round of 16", "Quarterfinals", "Semifinals", "Final"];

    titles.forEach((title, i) => {
        const text = createSVG("text", {
            x: x[i] + 115,
            y: 35,
            "text-anchor": "middle",
            fill: "#ffffff",
            "font-size": "22",
            "font-weight": "700"
        });

        text.textContent = title;
        svg.appendChild(text);
    });
}

function drawMatch(svg, match, boxW, boxH, isFinal) {
    const group = createSVG("g", {});

    const outer = createSVG("rect", {
        x: match.x,
        y: match.y,
        width: boxW,
        height: boxH,
        rx: 12,
        fill: "#161b22",
        stroke: isFinal ? "gold" : "#30363d",
        "stroke-width": isFinal ? 2 : 1
    });

    group.appendChild(outer);

    drawTeam(svg, group, match.top, match.winner, match.x + 12, match.y + 12, boxW - 24);
    drawTeam(svg, group, match.bottom, match.winner, match.x + 12, match.y + 48, boxW - 24);

    svg.appendChild(group);
}

function drawTeam(svg, group, team, winner, x, y, width) {
    const isWinner = winner === team;
    const isEliminated = winner && winner !== team && team !== "TBD";

    const rect = createSVG("rect", {
        x,
        y,
        width,
        height: 30,
        rx: 7,
        fill: "#0d1117",
        stroke: isWinner ? "#2ea043" : "none",
        "stroke-width": 1
    });

    group.appendChild(rect);

    const text = createSVG("text", {
        x: x + 10,
        y: y + 21,
        fill: isWinner ? "#7ee787" : isEliminated ? "#f85149" : "#ffffff",
        "font-size": "17",
        "font-weight": isWinner ? "700" : "400"
    });

    text.textContent = `${flags[team] || ""} ${team}`.trim();
    group.appendChild(text);

    if (isEliminated) {
        const line = createSVG("line", {
            x1: x + 8,
            y1: y + 15,
            x2: x + width - 8,
            y2: y + 15,
            stroke: "#f85149",
            "stroke-width": 2
        });

        group.appendChild(line);
    }
}

function drawConnector(svg, topMatch, bottomMatch, nextMatch, boxW, boxH) {
    const x1 = topMatch.x + boxW;
    const x2 = nextMatch.x;
    const midX = (x1 + x2) / 2;

    const y1 = topMatch.y + boxH / 2;
    const y2 = bottomMatch.y + boxH / 2;
    const yMid = nextMatch.y + boxH / 2;

    const path = createSVG("path", {
        d: `M ${x1} ${y1} H ${midX} V ${y2} H ${x1} M ${midX} ${yMid} H ${x2}`,
        fill: "none",
        stroke: "#8b949e",
        "stroke-width": 2
    });

    svg.appendChild(path);
}

function drawChampion(svg, x, y) {
    const rect = createSVG("rect", {
        x,
        y,
        width: 230,
        height: 54,
        rx: 12,
        fill: "#161b22",
        stroke: "gold",
        "stroke-width": 2
    });

    svg.appendChild(rect);

    const text = createSVG("text", {
        x: x + 115,
        y: y + 34,
        "text-anchor": "middle",
        fill: "gold",
        "font-size": "18",
        "font-weight": "700"
    });

    text.textContent = "🏆 Champion: TBD";
    svg.appendChild(text);
}

function createSVG(tag, attrs) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);

    Object.entries(attrs).forEach(([key, value]) => {
        el.setAttribute(key, value);
    });

    return el;
}
