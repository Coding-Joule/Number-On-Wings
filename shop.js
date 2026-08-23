const SHOP=[
 {id:"aurora",name:"Aurora Theme",base:180,emoji:"🌌"},
 {id:"golden",name:"Golden Wings",base:240,emoji:"🪽"},
 {id:"prime",name:"Prime Badge",base:130,emoji:"🔢"},
 {id:"graph",name:"Graph Paper Skin",base:160,emoji:"📈"},
 {id:"pi",name:"IrAcoNAl Pi Pin",base:314,emoji:"🥧"},
 {id:"nebula",name:"Nebula Card Pack",base:210,emoji:"✨"}
];
function shopMultiplier(){return .9+((Math.sin(Math.floor(Date.now()/3600000)*.73)+1)/2)*.3}
document.addEventListener("DOMContentLoaded",()=>{
 let s=NumberOnWingsSave.load();
 const m=shopMultiplier();document.getElementById("shop-index").textContent=(m*100).toFixed(1);
 function render(){
  document.getElementById("shop-coins").textContent=s.coins;
  document.getElementById("shop-grid").innerHTML=SHOP.map(item=>{
   const price=Math.round(item.base*m),owned=s.purchases.includes(item.id);
   return `<div class="shop-item"><div class="shop-preview" style="display:grid;place-items:center;font-size:2.3rem">${item.emoji}</div><h3>${item.name}</h3><p class="muted">Price moves with the NumberOnWings market index.</p><div class="shop-price">🪙 ${price}</div><div class="button-row"><button class="btn ${owned?"":"btn-primary"}" data-id="${item.id}" ${owned?"disabled":""}>${owned?"Owned ✓":"Buy"}</button></div></div>`
  }).join("");
  document.querySelectorAll("[data-id]").forEach(btn=>btn.onclick=()=>{
   const item=SHOP.find(x=>x.id===btn.dataset.id),price=Math.round(item.base*m);
   if(s.coins<price)return alert("Not enough coins.");
   s.coins-=price;s.purchases.push(item.id);s.achievements.collector=s.purchases.length>=3;
   NumberOnWingsSave.addActivity(s,`Bought ${item.name} for ${price} coins.`);NumberOnWingsSave.save(s);render();
  });
 }
 render();
});
