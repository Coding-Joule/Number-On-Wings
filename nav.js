
(()=>{
  const path = location.pathname.replace(/\\/g,"/");
  const inFolder = /\/(puzzles|finance|learn)\//.test(path);
  const root = inFolder ? "../" : "";
  const page = path.split("/").pop() || "index.html";
  const section = path.includes("/puzzles/") ? "puzzles" :
                  path.includes("/finance/") ? "finance" :
                  path.includes("/learn/") ? "learn" : "home";

  const groups = [
    {label:"Home", href:root+"index.html", key:"home"},
    {
      label:"Puzzles", href:root+"puzzles/index.html", key:"puzzles",
      items:[
        ["Daily Challenge", root+"puzzles/daily.html"],
        ["Weekly Challenges", root+"puzzles/weekly.html"],
        ["Adaptive", root+"puzzles/adaptive.html"]
      ]
    },
    {
      label:"Finance", href:root+"finance/index.html", key:"finance",
      items:[
        ["Coins", root+"finance/coins.html"],
        ["Recent Trades", root+"finance/trades.html"],
        ["Stock Market", root+"finance/stock.html"],
        ["Shop", root+"finance/shop.html"],
        ["Leaderboard · later", root+"finance/leaderboard.html"]
      ]
    },
    {
      label:"Learn", href:root+"learn/index.html", key:"learn",
      items:[["Videos",root+"learn/videos.html"]]
    }
  ];

  const nav = groups.map(g=>{
    const active = section===g.key ? " active" : "";
    if(!g.items) return `<a class="navlink${active}" href="${g.href}">${g.label}</a>`;
    return `<div class="navgroup">
      <a class="navlink${active}" href="${g.href}">${g.label} <span class="chev">⌄</span></a>
      <div class="dropdown">${g.items.map(([n,h])=>`<a href="${h}">${n}</a>`).join("")}</div>
    </div>`;
  }).join("");

  document.querySelector("header").innerHTML =
    `<nav>
      <a class="brand scribble" href="${root}index.html">Number<b>OnWings</b></a>
      ${nav}
      <span class="coin">🪙 <b id="navcoins">${NOW.load().coins}</b></span>
    </nav>`;

  const refresh=()=>{const n=document.querySelector("#navcoins");if(n)n.textContent=NOW.load().coins};
  addEventListener("now-save",refresh);
  addEventListener("storage",refresh);
})();
