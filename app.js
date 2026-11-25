const $=id=>document.getElementById(id);
let history=JSON.parse(localStorage.getItem("waVehicleHistory")||"[]");
let lastCandidates=[];
function setStatus(msg,error=false){$("status").textContent=msg;$("status").classList.remove("hidden","error");if(error)$("status").classList.add("error");}
function drivetrain(text){
 const s=(text||"").toUpperCase();
 // Match explicit labels only; do not infer 2WD from body style or engine.
 if(/\b(AWD|ALL[- ]WHEEL DRIVE)\b/.test(s))return ["AWD","All-wheel drive"];
 if(/\b(4WD|4X4|FOUR[- ]WHEEL DRIVE)\b/.test(s))return ["4WD","Four-wheel drive"];
 if(/\b(FWD|FRONT[- ]WHEEL DRIVE)\b/.test(s))return ["FWD","Front-wheel drive"];
 if(/\b(RWD|REAR[- ]WHEEL DRIVE)\b/.test(s))return ["RWD","Rear-wheel drive"];
 return ["Unknown","Not confirmed by source"];
}
function engineCode(text){
 const s=text||"";
 const m=s.match(/\b([A-Z0-9]{2,}(?:-[A-Z0-9]+)+)\b/);
 return m?m[1]:"";
}
function renderCandidate(v,plate,matchLabel){
 const detail=v.detailed_description||"";
 const [drive,explain]=drivetrain(detail+" "+(v.variant||"")+" "+(v.description||""));
 $("resultPlate").textContent=plate;
 $("vehicleName").textContent=[v.year_range,v.make,v.model].filter(Boolean).join(" ");
 $("vehicleYears").textContent=v.body||"";
 $("vehicleDesc").textContent=v.description||detail||"";
 $("engine").textContent=v.engine||((detail.match(/\b\d+(?:\.\d+)?\s*(?:L|litre|litres|cc)\b/i)||[])[0])||"Unknown";
 $("engineCode").textContent=engineCode(detail)?"Engine code: "+engineCode(detail):"Engine code not supplied";
 $("drive").textContent=drive;$("driveExplain").textContent=explain;
 $("matchTag").textContent=matchLabel||"PlateAPI result";
 $("raw").textContent=JSON.stringify(v,null,2);
 $("result").classList.remove("hidden");
}
function renderHistory(){
 const host=$("history");
 if(!history.length){host.innerHTML='<p class="muted">Your searches will appear here on this device.</p>';return;}
 host.innerHTML=history.map(p=>`<div class="historyitem"><b>${p}</b><button data-plate="${p}">Search again</button></div>`).join("");
 host.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>lookup(b.dataset.plate)));
}
async function lookup(raw){
 const plate=raw.toUpperCase().replace(/[^A-Z0-9]/g,"");
 if(!plate)return;
 $("plate").value=plate;$("search").disabled=true;$("search").textContent="Searching…";
 $("result").classList.add("hidden");$("alternativesWrap").classList.add("hidden");
 setStatus("Contacting the vehicle database…");
 try{
  const res=await fetch("/api/lookup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({plate})});
  const data=await res.json();
  if(!res.ok||!data.success)throw new Error(data.error||data.message||"Lookup failed. Please try again.");
  history=[plate,...history.filter(x=>x!==plate)].slice(0,20);localStorage.setItem("waVehicleHistory",JSON.stringify(history));renderHistory();
  lastCandidates=data.candidates||[data.vehicle];
  const label=data.match==="ambiguous"?"Multiple possible vehicles":data.match==="multiple"?"Multiple variants":"Matched vehicle";
  renderCandidate(data.vehicle,plate,label);
  if(lastCandidates.length>1){
   $("alternativesWrap").classList.remove("hidden");
   $("alternatives").innerHTML="";
   lastCandidates.forEach((v,i)=>{
    const b=document.createElement("button");b.className="candidate";
    b.innerHTML=`<b>${[v.year_range,v.make,v.model].filter(Boolean).join(" ")||"Vehicle candidate"}</b><small>${v.description||v.detailed_description||"Variant details unavailable"}</small>`;
    b.addEventListener("click",()=>renderCandidate(v,plate,"Selected candidate "+(i+1)));
    $("alternatives").appendChild(b);
   });
  }
  setStatus(data.sandbox?"Sandbox test result — not a real vehicle lookup.":"Lookup complete.");
  if(data.sandbox)$("status").classList.add("error");
  $("result").scrollIntoView({behavior:"smooth",block:"start"});
 }catch(e){setStatus(e.message,true);}
 finally{$("search").disabled=false;$("search").textContent="Search";}
}
$("lookupForm").addEventListener("submit",e=>{e.preventDefault();lookup($("plate").value);});
$("clear").addEventListener("click",()=>{history=[];localStorage.removeItem("waVehicleHistory");renderHistory();});
$("historyNav").addEventListener("click",()=>$("recent").scrollIntoView({behavior:"smooth"}));
$("plate").addEventListener("input",()=>{$("plate").value=$("plate").value.toUpperCase().replace(/[^A-Z0-9 ]/g,"");});
renderHistory();
if("serviceWorker"in navigator)navigator.serviceWorker.register("/sw.js").catch(()=>{});
