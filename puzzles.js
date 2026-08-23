document.addEventListener("DOMContentLoaded",()=>{
 let s=NumberOnWingsSave.load();
 const day=Math.floor(Date.now()/86400000), week=Math.floor(Date.now()/(7*86400000));
 const daily=NOWProblems.daily[day%NOWProblems.daily.length];
 const weekly=NOWProblems.weekly[week%NOWProblems.weekly.length];
 function render(id,p,key,reward){
  const box=document.getElementById(id); if(!box)return;
  const done=!!(key==="daily"?s.solved.daily[day]:s.solved.weekly[week]);
  box.innerHTML=`<div class="challenge"><div><div class="challenge-meta"><span class="pill">${key==="daily"?"Today":"This week"}</span><span class="pill">🪙 ${reward}</span></div><p class="problem">${p.q}</p><div class="answer-row"><input id="${id}-input" placeholder="Your answer" ${done?"disabled":""}><button class="btn btn-primary" id="${id}-btn" ${done?"disabled":""}>${done?"Solved ✓":"Submit"}</button></div><div class="result ${done?"good":""}" id="${id}-result">${done?"Already solved. Reward collected.":""}</div></div></div>`;
  if(done)return;
  document.getElementById(`${id}-btn`).onclick=()=>{
   const val=document.getElementById(`${id}-input`).value.trim();
   const res=document.getElementById(`${id}-result`);
   if(val.toLowerCase()===String(p.a).toLowerCase()){
     if(key==="daily")s.solved.daily[day]=true;else s.solved.weekly[week]=true;
     NumberOnWingsSave.earnCoins(s,reward,`${key==="daily"?"Daily":"Weekly"} challenge solved.`);
     s.achievements.firstPuzzle=true;NumberOnWingsSave.save(s);res.textContent=`Correct! +${reward} coins`;res.className="result good";
     document.getElementById(`${id}-btn`).disabled=true;document.getElementById(`${id}-input`).disabled=true;
   }else{res.textContent="Not quite. Try again.";res.className="result bad"}
  }
 }
 render("daily-box",daily,"daily",daily.coins);render("weekly-box",weekly,"weekly",weekly.coins);
 const idx=(s.solved.alcumus||0)%NOWProblems.alcumus.length,p=NOWProblems.alcumus[idx];
 document.getElementById("alcumus-box").innerHTML=`<span class="pill">Adaptive problem ${s.solved.alcumus+1}</span><p class="problem">${p.q}</p><div class="answer-row"><input id="alc-input" placeholder="Your answer"><button id="alc-btn" class="btn btn-primary">Check</button></div><div id="alc-result" class="result"></div>`;
 document.getElementById("alc-btn").onclick=()=>{
   const val=document.getElementById("alc-input").value.trim(),r=document.getElementById("alc-result");
   if(val.toLowerCase()===String(p.a).toLowerCase()){s.solved.alcumus++;NumberOnWingsSave.earnCoins(s,12,"Alcumus problem solved.");s.achievements.firstPuzzle=true;NumberOnWingsSave.save(s);r.textContent="Correct! +12 coins. Reload for the next problem.";r.className="result good"}else{r.textContent="Try again.";r.className="result bad"}
 };
});
