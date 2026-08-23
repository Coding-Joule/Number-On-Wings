
const KEY="now-rebuild-v1";
const fresh=()=>({coins:314,solved:{daily:{},weekly:{},adaptive:0},stocks:{},trades:[],items:[],streak:0,discoveries:0});
function load(){try{return Object.assign(fresh(),JSON.parse(localStorage.getItem(KEY)||"{}"))}catch{return fresh()}}
function save(s){localStorage.setItem(KEY,JSON.stringify(s));window.dispatchEvent(new Event("now-save"))}
function coins(s,n){s.coins=Math.max(0,Math.round(s.coins+n));save(s)}
window.NOW={load,save,coins,KEY};
