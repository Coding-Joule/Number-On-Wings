document.addEventListener("DOMContentLoaded",()=>{
 let s=NumberOnWingsSave.load();
 const check=document.getElementById("reduced");check.checked=!!s.settings.reducedMotion;
 document.getElementById("save-settings").onclick=()=>{s.settings.reducedMotion=check.checked;NumberOnWingsSave.save(s);alert("Settings saved.")};
 document.getElementById("reset-save").onclick=()=>{if(confirm("Reset all local NumberOnWings progress?")){localStorage.removeItem(NumberOnWingsSave.NOW_KEY);location.href="index.html"}};
});
