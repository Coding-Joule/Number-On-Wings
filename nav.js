
(()=>{
  const path=location.pathname.replace(/\\/g,"/");
  const inFolder=/\/(puzzles|finance|learn)\//.test(path);
  const root=inFolder?"../":"";
  const section=path.includes("/puzzles/")?"puzzles":path.includes("/finance/")?"finance":path.includes("/learn/")?"learn":"home";
  const groups=[
    {label:"Home",href:root+"index.html",key:"home"},
    {label:"Puzzles",href:root+"puzzles/index.html",key:"puzzles",items:[
      ["Daily Challenge",root+"puzzles/daily.html"],["Weekly Challenges",root+"puzzles/weekly.html"],["Adaptive",root+"puzzles/adaptive.html"]]},
    {label:"Finance",href:root+"finance/index.html",key:"finance",items:[
      ["Coins",root+"finance/coins.html"],["Recent Trades",root+"finance/trades.html"],["Stock Market",root+"finance/stock.html"],["Shop",root+"finance/shop.html"],["Leaderboard · later",root+"finance/leaderboard.html"]]},
    {label:"Learn",href:root+"learn/index.html",key:"learn",items:[["Videos",root+"learn/videos.html"]]}
  ];
  const html=groups.map(g=>{
    const active=section===g.key?" active":"";
    if(!g.items)return `<a class="navlink${active}" href="${g.href}">${g.label}</a>`;
    return `<div class="navgroup">
      <button class="navdrop-toggle${active}" type="button" aria-expanded="false">${g.label} <span class="chev">⌄</span></button>
      <div class="dropdown"><a href="${g.href}">Overview</a>${g.items.map(([n,h])=>`<a href="${h}">${n}</a>`).join("")}</div>
    </div>`;
  }).join("");
  document.querySelector("header").innerHTML=`<nav><a class="brand" href="${root}index.html">Number<b>OnWings</b></a>${html}<span class="coin">🪙 <b id="navcoins">${NOW.load().coins}</b></span></nav>`;
  const closeAll=except=>document.querySelectorAll(".navgroup.open").forEach(g=>{
    if(g!==except){g.classList.remove("open");g.querySelector(".navdrop-toggle")?.setAttribute("aria-expanded","false")}
  });
  document.querySelectorAll(".navdrop-toggle").forEach(btn=>btn.addEventListener("click",e=>{
    e.stopPropagation();const g=btn.closest(".navgroup"),open=!g.classList.contains("open");
    closeAll(g);g.classList.toggle("open",open);btn.setAttribute("aria-expanded",String(open));
  }));
  document.addEventListener("click",()=>closeAll());
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeAll()});
  const refresh=()=>{const n=document.querySelector("#navcoins");if(n)n.textContent=NOW.load().coins};
  addEventListener("now-save",refresh);addEventListener("storage",refresh);
})();
