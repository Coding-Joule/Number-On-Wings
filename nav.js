document.addEventListener("DOMContentLoaded",()=>{
 const header=document.querySelector("header"); if(!header)return;
 const current=location.pathname.split("/").pop()||"index.html";
 const groups=[
  {label:"Dashboard",href:"index.html",pages:["index.html"]},
  {label:"Puzzles",href:"puzzles.html",pages:["puzzles.html"],items:[["Daily Challenge","puzzles.html#daily"],["Weekly Challenges","puzzles.html#weekly"],["Alcumus","puzzles.html#alcumus"]]},
  {label:"Finance",href:"finance.html",pages:["finance.html","shop.html"],items:[["Coins","finance.html#coins"],["Recent Trades","finance.html#trades"],["Stock Market","finance.html#market"],["Shop","shop.html"],["Leaderboard · Later","finance.html#leaderboard"]]},
  {label:"Learn",href:"videos.html",pages:["videos.html"],items:[["Videos","videos.html"]]}
 ];
 const html=groups.map(g=>{
   const active=g.pages.includes(current)?" active":"";
   if(!g.items)return `<a class="hub-link${active}" href="${g.href}">${g.label}</a>`;
   return `<div class="hub-menu"><a class="hub-link${active}" href="${g.href}">${g.label}<span class="hub-chevron">⌄</span></a><div class="hub-dropdown">${g.items.map(([a,b])=>`<a href="${b}">${a}</a>`).join("")}</div></div>`
 }).join("");
 header.innerHTML=`<div class="nav-shell"><a class="logo" href="index.html"><span class="logo-mark">π</span><span>Number<span>OnWings</span></span></a><div class="app-nav-scroll"><nav>${html}</nav></div><div class="nav-actions"><a class="coin-pill" href="finance.html#coins">🪙 <span id="nav-coins">0</span></a><a class="profile-pill" href="profile.html">👤</a></div></div>`;
 function refresh(){document.getElementById("nav-coins").textContent=NumberOnWingsSave.load().coins}
 refresh();window.addEventListener("now:save-changed",refresh);window.addEventListener("storage",refresh);
});
