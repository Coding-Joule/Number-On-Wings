document.addEventListener("DOMContentLoaded",()=>{
 let s=NumberOnWingsSave.load();
 const input=document.getElementById("nickname");input.value=s.profile?.nickname||"Pilot";
 document.getElementById("profile-coins").textContent=s.coins;
 document.getElementById("profile-puzzles").textContent=Object.keys(s.solved.daily||{}).length+Object.keys(s.solved.weekly||{}).length+(s.solved.alcumus||0);
 document.getElementById("profile-trades").textContent=s.trades.length;
 document.getElementById("save-profile").onclick=()=>{s.profile.nickname=input.value.trim()||"Pilot";NumberOnWingsSave.save(s);alert("Saved.")};
});
