
(()=>{
 const orbit=document.querySelector("#orbit"),scoreEl=document.querySelector("#score"),foundEl=document.querySelector("#found"),timerEl=document.querySelector("#timer"),bubble=document.querySelector("#homebubble");
 let running=false,score=0,found=0,left=20,interval;
 const prime=n=>{if(n<2)return false;for(let i=2;i*i<=n;i++)if(n%i===0)return false;return true};
 function scatter(){
  orbit.querySelectorAll(".number-dot").forEach(x=>x.remove());
  const nums=Array.from({length:9},()=>2+Math.floor(Math.random()*47));
  nums.forEach((n,i)=>{let b=document.createElement("button");b.className="number-dot";b.textContent=n;b.style.left=(5+(i*37)%86)+"%";b.style.top=(8+(i*53)%72)+"%";b.addEventListener("click",()=>{if(!running)return;if(prime(n)){score++;found+=2;b.style.background="#a9f3d3";bubble.textContent=["PRIME! MINE.","YES. COINS.","MATHEMATICS!!!"][score%3]}else{score=Math.max(0,score-1);b.style.background="#ffb6b6";bubble.textContent="COMPOSITE. BETRAYAL.";};scoreEl.textContent=score;foundEl.textContent=found;b.disabled=true});orbit.appendChild(b)});
 }
 document.querySelector("#start").addEventListener("click",()=>{if(running)return;running=true;score=found=0;left=20;scoreEl.textContent=foundEl.textContent=0;orbit.querySelector(".orbit-center").textContent="PRIMES!";scatter();interval=setInterval(()=>{left--;timerEl.textContent=left+" sec";if(left%4===0)scatter();if(left<=0){
  clearInterval(interval);
  running=false;
  let s=NOW.load();
  NOW.coins(s,found);
  orbit.querySelectorAll(".number-dot").forEach(x=>x.disabled=true);
  orbit.querySelector(".orbit-center").textContent="+"+found+" COINS";
  bubble.textContent=score>=8?"I DESTROYED THE COMPOSITES.":"Again. I demand a rematch.";
  timerEl.textContent="DONE";

  if(found>0){
    let oldWin=document.querySelector(".mascot-win-scene");
    if(oldWin) oldWin.remove();
    let img=document.createElement("img");
    img.src="mascot-win.png";
    img.alt="Mascot celebrating a win with coins";
    img.className="mascot-win-scene win-pop";
    document.querySelector("#play").appendChild(img);
  }
}},1000)});
})();
