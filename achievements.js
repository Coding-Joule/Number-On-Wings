document.addEventListener("DOMContentLoaded",()=>{
 const s=NumberOnWingsSave.load(),defs=[
  ["firstPuzzle","🧩","First Flight","Solve your first puzzle."],
  ["century","🪙","Coin Century","Reach 100 coins."],
  ["firstTrade","📈","Market Maker","Complete your first stock trade."],
  ["collector","🎨","Collector","Own three shop items."]
 ];
 document.getElementById("achievement-grid").innerHTML=defs.map(([k,e,n,d])=>`<div class="card ${s.achievements[k]?"":"locked"}"><div class="badge">${e}</div><h3>${n}</h3><p>${d}</p><span class="pill">${s.achievements[k]?"Unlocked":"Locked"}</span></div>`).join("");
});
