const DOT_URL = "https://online.transport.wa.gov.au/webExternal/registration/?0";
const REPCO_URL = "https://www.repco.com.au/";
const $ = (id) => document.getElementById(id);
const form = $("searchForm"), plateInput = $("plate"), results = $("results");
let history = JSON.parse(localStorage.getItem("waRegoHistory") || "[]");

function renderHistory(){
  const host = $("historyList");
  if(!history.length){host.innerHTML='<p class="muted">Your recent plates will appear here.</p>';return;}
  host.innerHTML = history.map((p,i)=>`<div class="historyitem"><span class="historyplate">${p}</span><button data-index="${i}">Search again</button></div>`).join("");
  host.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>runSearch(history[Number(b.dataset.index)])));
}
function runSearch(raw){
  const plate = raw.toUpperCase().replace(/[^A-Z0-9]/g,"");
  if(!plate){plateInput.focus();return;}
  plateInput.value=plate;
  $("currentPlate").textContent=plate;
  results.classList.remove("hidden");
  history=[plate,...history.filter(x=>x!==plate)].slice(0,15);
  localStorage.setItem("waRegoHistory",JSON.stringify(history));
  renderHistory();
  // Provider pages are loaded within the app where their security policy allows it.
  $("dotFrame").src=DOT_URL;
  $("repcoFrame").src=REPCO_URL;
  $("dotLink").href=DOT_URL;
  $("repcoLink").href=REPCO_URL;
  results.scrollIntoView({behavior:"smooth",block:"start"});
}
form.addEventListener("submit",e=>{e.preventDefault();runSearch(plateInput.value);});
$("newSearch").addEventListener("click",()=>{plateInput.value="";plateInput.focus();window.scrollTo({top:0,behavior:"smooth"});});
$("historyBtn").addEventListener("click",()=>$("historySection").scrollIntoView({behavior:"smooth"}));
$("navHistory").addEventListener("click",()=>$("historySection").scrollIntoView({behavior:"smooth"}));
$("clearHistory").addEventListener("click",()=>{history=[];localStorage.removeItem("waRegoHistory");renderHistory();});
plateInput.addEventListener("input",()=>{plateInput.value=plateInput.value.toUpperCase().replace(/[^A-Z0-9 ]/g,"");});
renderHistory();
if("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("./sw.js").catch(()=>{});
