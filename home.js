document.addEventListener("DOMContentLoaded",()=>{
 const s=NumberOnWingsSave.load();
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set("dash-coins",s.coins);
 set("dash-puzzles",Object.keys(s.solved.daily||{}).length+Object.keys(s.solved.weekly||{}).length+(s.solved.alcumus||0));
 set("dash-trades",s.trades.length);
 set("dash-items",s.purchases.length);
 set("hello",`Welcome back, ${s.profile?.nickname||"Pilot"}.`);
 const list=document.getElementById("activity");
 if(list)list.innerHTML=(s.activity||[]).slice(0,6).map(x=>`<div class="activity-item"><span>${x.text}</span><span class="muted">${new Date(x.time).toLocaleDateString()}</span></div>`).join("")||`<p class="muted">No activity yet.</p>`;
});
