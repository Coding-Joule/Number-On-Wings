
const BANK=[
 {q:"What is the remainder when 2¹⁰ is divided by 7?",a:"2",topic:"Number theory"},
 {q:"How many positive divisors does 360 have?",a:"24",topic:"Number theory"},
 {q:"A 12-gon has how many diagonals?",a:"54",topic:"Combinatorics"},
 {q:"If x + 1/x = 3, find x² + 1/x².",a:"7",topic:"Algebra"},
 {q:"Angles of a triangle are in ratio 2:3:4. Find the largest angle.",a:"80",topic:"Geometry"},
 {q:"How many 4-digit numbers have strictly increasing digits?",a:"126",topic:"Combinatorics"}
];
(()=>{
 let s=NOW.load(),day=Math.floor(Date.now()/86400000),week=Math.floor(Date.now()/604800000);
 function mount(id,p,key,reward,done){
   const el=document.querySelector("#"+id); if(!el)return;
   el.innerHTML=`<span class="tag">${p.topic}</span><span class="tag">${done?"SOLVED":"UNSOLVED"}</span>
   <p class="problem">${p.q}</p>
   <div class="answer"><input placeholder="answer" ${done?"disabled":""}><button class="button primary" ${done?"disabled":""}>${done?"DONE ✓":"CHECK"}</button></div>
   <div class="result">${done?"Reward already collected.":""}</div>`;
   if(done)return;
   const inp=el.querySelector("input"),btn=el.querySelector("button"),res=el.querySelector(".result");
   btn.addEventListener("click",()=>{
     if(inp.value.trim().toLowerCase()===p.a.toLowerCase()){
       res.textContent=`CORRECT. +${reward} coins.`;res.className="result good";
       if(key==="daily")s.solved.daily[day]=1;
       else if(key==="weekly")s.solved.weekly[week]=1;
       else s.solved.adaptive++;
       NOW.coins(s,reward);btn.disabled=inp.disabled=true;
       let win=document.createElement("img");win.src="../mascot-win.png";win.alt="Mascot celebrating";win.className="mascot-win-scene win-pop";el.appendChild(win);
     }else{
       res.textContent="NOPE. Rematch.";res.className="result bad";
       let old=el.querySelector(".wrong-art");if(old)old.remove();
       let wrong=document.createElement("img");wrong.src="../mascot-lose.png";wrong.alt="Mascot reacting to a wrong answer";wrong.className="wrong-art";el.appendChild(wrong);
     }
   });
 }
 mount("daily",BANK[day%BANK.length],"daily",25,!!s.solved.daily[day]);
 mount("weekly",BANK[(week+2)%BANK.length],"weekly",100,!!s.solved.weekly[week]);
 mount("adaptive",BANK[(s.solved.adaptive+4)%BANK.length],"adaptive",12,false);
})();
