(()=>{
'use strict';
const panels=[...document.querySelectorAll('.day-pane')];
const tabs=[...document.querySelectorAll('[data-day-tab]')];
function selectDay(id,focus=false){
 if(!panels.some(p=>p.id===id))return;
 panels.forEach(p=>{p.hidden=p.id!==id});
 tabs.forEach(t=>{const on=t.dataset.dayTab===id;t.classList.toggle('active',on);t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;if(on&&focus)t.focus()});
}
function reveal(){
 let id;try{id=decodeURIComponent(location.hash.slice(1))}catch(e){return}
 const node=id&&document.getElementById(id);if(!node)return;
 const panel=node.closest('.day-pane');if(panel)selectDay(panel.id);
 for(let p=node;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;
 requestAnimationFrame(()=>node.scrollIntoView({block:'start'}));
}
tabs.forEach((t,i)=>{
 t.addEventListener('click',()=>{selectDay(t.dataset.dayTab);history.replaceState(null,'','#'+t.dataset.dayTab)});
 t.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(i+1)%tabs.length;if(event.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();selectDay(tabs[next].dataset.dayTab,true);history.replaceState(null,'','#'+tabs[next].dataset.dayTab)}});
});
selectDay('walk-Day1');window.addEventListener('hashchange',reveal);if(location.hash)reveal();
document.querySelectorAll('[data-route-map]').forEach(map=>{
 const controls=[...map.querySelectorAll('[data-route-filter]')];
 controls.forEach(button=>button.addEventListener('click',()=>{
  const day=button.dataset.routeFilter;
  controls.forEach(control=>control.setAttribute('aria-pressed',String(control===button)));
  map.querySelectorAll('[data-map-day]').forEach(part=>part.classList.toggle('is-dimmed',day!=='all'&&part.dataset.mapDay!==day));
 }));
});
const checks=[...document.querySelectorAll('.stamp-check')];
const key='kumano-20261203-stamps-37';let saved={};try{saved=JSON.parse(localStorage.getItem(key)||'{}')||{}}catch(e){}
function updateProgress(){
 let total=0;const byDay={};
 checks.forEach(c=>{if(c.checked){total++;byDay[c.dataset.day]=(byDay[c.dataset.day]||0)+1}c.closest('.stamp-card').classList.toggle('checked',c.checked)});
 document.querySelectorAll('[data-stamp-total]').forEach(n=>n.textContent=total+' / 37');
 document.querySelectorAll('[data-day-progress]').forEach(n=>{const day=n.dataset.dayProgress;const max=checks.filter(c=>c.dataset.day===day).length;n.textContent=(byDay[day]||0)+' / '+max});
 document.querySelectorAll('[data-progress-bar]').forEach(n=>{const day=n.dataset.progressBar;const max=checks.filter(c=>c.dataset.day===day).length;n.style.width=((byDay[day]||0)/Math.max(1,max)*100)+'%'});
}
checks.forEach(c=>{c.checked=saved[c.dataset.number]===true;c.addEventListener('change',()=>{saved[c.dataset.number]=c.checked;try{localStorage.setItem(key,JSON.stringify(saved))}catch(e){}updateProgress()})});updateProgress();
const packingChecks=[...document.querySelectorAll('[data-packing-id]')];
const packingKey='kumano-20261204-packing-v1';let packed={};
try{const value=JSON.parse(localStorage.getItem(packingKey)||'{}');if(value&&typeof value==='object'&&!Array.isArray(value))packed=value}catch(e){}
function updatePackingProgress(){
 let total=0;const categories={};
 packingChecks.forEach(c=>{if(c.checked){total++;categories[c.dataset.packingCategory]=(categories[c.dataset.packingCategory]||0)+1}c.closest('.packing-item').classList.toggle('is-packed',c.checked)});
 document.querySelectorAll('[data-packing-total]').forEach(n=>n.textContent=total+' / '+packingChecks.length);
 document.querySelectorAll('[data-packing-category-progress]').forEach(n=>{const category=n.dataset.packingCategoryProgress;const max=packingChecks.filter(c=>c.dataset.packingCategory===category).length;n.textContent=(categories[category]||0)+' / '+max});
}
packingChecks.forEach(c=>{c.checked=packed[c.dataset.packingId]===true;c.addEventListener('change',()=>{packed[c.dataset.packingId]=c.checked;try{localStorage.setItem(packingKey,JSON.stringify(packed))}catch(e){}updatePackingProgress()})});updatePackingProgress();
const dialog=document.getElementById('image-viewer');let trigger;let zoom=1;
function setZoom(next){
 const canvas=dialog.querySelector('.lightbox-canvas');const image=dialog.querySelector('img');const old=zoom;
 const x=canvas.scrollLeft+canvas.clientWidth/2;const y=canvas.scrollTop+canvas.clientHeight/2;
 zoom=Math.max(1,Math.min(4,next));image.style.width=(zoom*100)+'%';
 dialog.querySelector('[data-zoom-label]').textContent=Math.round(zoom*100)+'%';
 canvas.scrollLeft=Math.max(0,x*zoom/old-canvas.clientWidth/2);canvas.scrollTop=Math.max(0,y*zoom/old-canvas.clientHeight/2);
}
document.querySelectorAll('[data-preview]').forEach(a=>a.addEventListener('click',event=>{
 if(!dialog||typeof dialog.showModal!=='function')return;
 event.preventDefault();trigger=a;
 const image=dialog.querySelector('img');image.src=a.dataset.preview;image.alt=a.dataset.title||'地图预览';
 zoom=1;image.style.width='100%';dialog.querySelector('[data-zoom-label]').textContent='100%';
 dialog.querySelector('[data-viewer-image]').href=a.dataset.preview;
 dialog.querySelector('[data-viewer-title]').textContent=a.dataset.title||'地图预览';
 const original=dialog.querySelector('[data-viewer-original]');original.href=a.href;original.textContent=a.dataset.kind==='photo'?'照片出处':a.dataset.kind==='overview'?'单独打开全程图':'打开完整PDF';
 dialog.showModal();const canvas=dialog.querySelector('.lightbox-canvas');canvas.scrollLeft=0;canvas.scrollTop=0;document.body.style.overflow='hidden';
}));
if(dialog){dialog.querySelector('button').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});dialog.addEventListener('close',()=>{document.body.style.overflow='';if(trigger)trigger.focus()})}
if(dialog)dialog.querySelectorAll('[data-zoom]').forEach(button=>button.addEventListener('click',()=>setZoom(button.dataset.zoom==='reset'?1:zoom+(button.dataset.zoom==='in' ? .75 : -.75))));
document.querySelectorAll('[data-load-pdf]').forEach(button=>button.addEventListener('click',()=>{
 const frame=document.getElementById(button.dataset.loadPdf);if(!frame)return;
 const visible=frame.hidden;frame.hidden=!visible;if(visible&&!frame.getAttribute('src'))frame.src=frame.dataset.src;
 button.textContent=visible?'收起时刻表':'展开时刻表';button.setAttribute('aria-expanded',String(visible));
}));
document.querySelector('[data-back-top]')?.addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'}));
let printState=[];let hiddenState=[];
window.addEventListener('beforeprint',()=>{printState=[...document.querySelectorAll('details')].map(n=>[n,n.open]);hiddenState=panels.map(n=>[n,n.hidden]);printState.forEach(([n])=>n.open=true);panels.forEach(n=>n.hidden=false)});
window.addEventListener('afterprint',()=>{printState.forEach(([n,state])=>n.open=state);hiddenState.forEach(([n,state])=>n.hidden=state)});
})();
