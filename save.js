const NOW_KEY="numberOnWingsSaveV3";
const defaultSave=()=>({
 version:3, coins:500, solved:{daily:{},weekly:{},alcumus:0},
 activity:[{text:"Welcome to NumberOnWings.",time:Date.now()}],
 trades:[], holdings:{}, purchases:[], equippedTheme:"midnight",
 profile:{nickname:"Pilot"}, settings:{reducedMotion:false},
 achievements:{firstPuzzle:false,century:false,firstTrade:false,collector:false}
});
function loadSave(){
 try{
   let raw=localStorage.getItem(NOW_KEY);
   if(raw)return Object.assign(defaultSave(),JSON.parse(raw));
   let old=localStorage.getItem("numberOnWingsSaveV2");
   if(old){let x=Object.assign(defaultSave(),JSON.parse(old));saveNow(x);return x}
 }catch(e){}
 return defaultSave();
}
function saveNow(s){localStorage.setItem(NOW_KEY,JSON.stringify(s));window.dispatchEvent(new CustomEvent("now:save-changed"))}
function addActivity(s,text){s.activity.unshift({text,time:Date.now()});s.activity=s.activity.slice(0,30)}
function earnCoins(s,n,reason){s.coins=Math.max(0,Math.floor(Number(s.coins)||0)+n);if(reason)addActivity(s,`${reason} ${n>=0?"+":""}${n} coins`);if(s.coins>=100)s.achievements.century=true}
window.NumberOnWingsSave={load:loadSave,save:saveNow,addActivity,earnCoins,NOW_KEY};
