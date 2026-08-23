
const COS=[["PRIME","Prime Industries",41],["PI","π Labs",31.4],["FIB","Fibonacci Farms",55],["WING","Wings Aerospace",73]];
(()=>{
 let s=NOW.load(),sel=0,range=160;
 const series=(base,n,seed)=>{let a=[],v=base;for(let i=0;i<n;i++){v=Math.max(4,v*(1+Math.sin((i+seed)*1.77)*.011+Math.sin((i+seed)*.21)*.006));a.push(v)}return a};
 function current(i){let a=series(COS[i][2],320,i*13+Math.floor(Date.now()/3600000));return a[a.length-1]}
 function draw(){
  let [sym,name,base]=COS[sel],arr=series(base,320,sel*13+Math.floor(Date.now()/3600000)).slice(-range),c=document.querySelector("#chart"),x=c.getContext("2d"),W=c.width,H=c.height,p=25,min=Math.min(...arr),max=Math.max(...arr);x.clearRect(0,0,W,H);x.strokeStyle="#ded7c9";x.lineWidth=1;for(let i=0;i<6;i++){let y=p+i*(H-2*p)/5;x.beginPath();x.moveTo(p,y);x.lineTo(W-p,y);x.stroke()}x.strokeStyle="#2357ff";x.lineWidth=5;x.beginPath();arr.forEach((v,i)=>{let xx=p+i*(W-2*p)/(arr.length-1),yy=H-p-(v-min)/(max-min||1)*(H-2*p);i?x.lineTo(xx,yy):x.moveTo(xx,yy)});x.stroke();let price=arr[arr.length-1];document.querySelector("#sym").textContent=sym;document.querySelector("#company").textContent=name;document.querySelector("#price").textContent=price.toFixed(2);let ch=(price/base-1)*100,ce=document.querySelector("#change");ce.textContent=(ch>=0?"▲ ":"▼ ")+Math.abs(ch).toFixed(2)+"%";ce.className=ch>=0?"good":"bad";
 let mood=document.querySelector("#marketMood");
 if(!mood){mood=document.createElement("img");mood.id="marketMood";mood.className="market-mood-art";document.querySelector(".chart-paper").appendChild(mood)}
 mood.src=ch>=0?"../market-up.png":"../market-down.png";
 mood.alt=ch>=0?"Hand-drawn rising market line":"Hand-drawn falling market line";
 }
 function render(){
  document.querySelector("#cash").textContent=s.coins;document.querySelector("#ticker").innerHTML=COS.map((c,i)=>`<button data-i="${i}" class="${i===sel?"selected":""}">${c[0]} · ${current(i).toFixed(2)}</button>`).join("");document.querySelectorAll("#ticker button").forEach(b=>b.addEventListener("click",()=>{sel=+b.dataset.i;render();draw()}));document.querySelector("#holdings").innerHTML=COS.map(c=>s.stocks[c[0]]?`<div class="ledger-row"><span>${c[0]}</span><b>${s.stocks[c[0]]} shares</b></div>`:"").join("")||"<p>Nothing. Tragic.</p>";draw()
 }
 function trade(type){let q=Math.max(1,Math.floor(+document.querySelector("#qty").value||1)),sym=COS[sel][0],p=current(sel),cost=Math.round(p*q);if(type==="buy"){if(s.coins<cost)return alert("Not enough coins. Solve something.");s.coins-=cost;s.stocks[sym]=(s.stocks[sym]||0)+q}else{if((s.stocks[sym]||0)<q)return alert("You do not own that.");s.stocks[sym]-=q;s.coins+=cost}s.trades.unshift({type,sym,q,cost,t:Date.now()});NOW.save(s);render()}
 document.querySelector("#buy").addEventListener("click",()=>trade("buy"));document.querySelector("#sell").addEventListener("click",()=>trade("sell"));document.querySelectorAll("#ranges button").forEach(b=>b.addEventListener("click",()=>{range=+b.dataset.n;draw()}));render();
})();
