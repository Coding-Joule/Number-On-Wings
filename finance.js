const STOCKS=[
 {symbol:"PI",name:"Pi Labs",base:42.00},
 {symbol:"WNG",name:"Wings Aerospace",base:76.50},
 {symbol:"PRM",name:"Prime Systems",base:31.25},
 {symbol:"FIB",name:"Fibonacci Works",base:58.80}
];
function marketPrice(st){
 const hour=Math.floor(Date.now()/3600000),seed=st.symbol.charCodeAt(0)*17+hour;
 const wave=Math.sin(seed*.91)*.07+Math.sin(seed*.17)*.035;
 return Math.max(5,st.base*(1+wave));
}
document.addEventListener("DOMContentLoaded",()=>{
 let s=NumberOnWingsSave.load(),selected=STOCKS[0].symbol;
 const fmt=n=>Number(n).toFixed(2);
 function render(){
  document.getElementById("finance-coins").textContent=s.coins;
  const mv=Object.entries(s.holdings||{}).reduce((sum,[sym,q])=>sum+(marketPrice(STOCKS.find(x=>x.symbol===sym)||STOCKS[0])*q),0);
  document.getElementById("portfolio-value").textContent=`${fmt(mv)} coins`;
  document.getElementById("stock-grid").innerHTML=STOCKS.map(x=>{const p=marketPrice(x);return `<div class="stock-card ${selected===x.symbol?"selected":""}" data-symbol="${x.symbol}"><div class="stock-symbol">${x.symbol}</div><div class="stock-name">${x.name}</div><div class="stock-price">${fmt(p)}</div><div class="${p>=x.base?"good":"bad"}">${p>=x.base?"▲":"▼"} ${fmt(Math.abs((p/x.base-1)*100))}%</div></div>`}).join("");
  document.querySelectorAll(".stock-card").forEach(el=>el.onclick=()=>{selected=el.dataset.symbol;render()});
  document.getElementById("selected-stock").textContent=selected;
  document.getElementById("trade-list").innerHTML=(s.trades||[]).slice(0,8).map(t=>`<div class="trade-item"><span>${t.type.toUpperCase()} ${t.qty} ${t.symbol}</span><span>${fmt(t.total)} coins</span></div>`).join("")||`<p class="muted">No trades yet.</p>`;
 }
 function trade(type){
  const qty=Math.max(1,Math.floor(Number(document.getElementById("trade-qty").value)||1));
  const st=STOCKS.find(x=>x.symbol===selected),price=marketPrice(st),total=price*qty;
  if(type==="buy"){
   if(s.coins<total)return alert("Not enough coins.");
   s.coins-=Math.ceil(total);s.holdings[selected]=(s.holdings[selected]||0)+qty;
  }else{
   if((s.holdings[selected]||0)<qty)return alert("You do not own that many shares.");
   s.holdings[selected]-=qty;s.coins+=Math.floor(total);
  }
  s.trades.unshift({type,qty,symbol:selected,price,total,time:Date.now()});s.trades=s.trades.slice(0,50);
  s.achievements.firstTrade=true;NumberOnWingsSave.addActivity(s,`${type==="buy"?"Bought":"Sold"} ${qty} ${selected}.`);NumberOnWingsSave.save(s);render();
 }
 document.getElementById("buy-btn").onclick=()=>trade("buy");document.getElementById("sell-btn").onclick=()=>trade("sell");render();
});
