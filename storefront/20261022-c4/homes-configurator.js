import {HOMES_CONFIG,encodeHomes,checkedText} from './homes-encoding.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const isHomes=s=>[2,3].includes(Number(s.homesCount));
export function homesReady(s) {
  if(!isHomes(s)||s.homes?.length<Number(s.homesCount))return false;
  const homes=s.homes.slice(0,Number(s.homesCount));
  if(!homes.every(h=>h?.coverage==='ok'&&h.todayLoaded===true))return false;
  try{encodeHomes({homes,heading:s.heading,colour:s.colour||'sepia'});return true}catch{return false}
}
export function countChoice(host,state,api,remount) {
  const slot=host.querySelector('[data-ys-slot="search"]');if(!slot)return;
  slot.insertAdjacentHTML('afterbegin',`<fieldset class="homes-count"><legend>How many homes?</legend><div role="radiogroup" aria-label="How many homes?">${[1,2,3].map(n=>`<button class="outline" type="button" role="radio" data-home-count="${n}" aria-checked="${Number(state.homesCount||1)===n}">${n===1?'One home':n+' homes'}</button>`).join('')}</div>${isHomes(state)?'<p>Put the homes of your Berlin life on one print: your first flat, the one you live in now, your parents\' house. Each one in 1928 and today.</p><p class="homes-gift">A gift idea: the homes of your parents\' Berlin years.</p>':''}</fieldset>`);
  slot.querySelectorAll('[data-home-count]').forEach(b=>b.addEventListener('click',()=>{
    const n=Number(b.dataset.homeCount);if(n===Number(state.homesCount||1))return;
    api.cancelPhotos?.();api.homesCleanup?.();state.homesCount=n;
    state.homes=state.homes||[];while(state.homes.length<n)state.homes.push({});
    state.activeHome=Math.min(state.activeHome||0,n-1);
    if(!state.heading)state.heading=new URLSearchParams(location.search).get('lang')==='de'?'UNSERE BERLINER ADRESSEN':'OUR BERLIN HOMES';
    if(api.remount)api.remount();else remount();
  }));
}
export function mountHomes(host,state,api,H) {
  api.homesCleanup?.();api.cancelPhotos?.();
  const count=Number(state.homesCount),cfg=HOMES_CONFIG.geometry,g=cfg[count],L=HOMES_CONFIG.limits;
  state.homes=state.homes||Array.from({length:count},()=>({}));state.activeHome=Math.min(state.activeHome||0,count-1);
  state.heading=state.heading||(new URLSearchParams(location.search).get('lang')==='de'?'UNSERE BERLINER ADRESSEN':'OUR BERLIN HOMES');
  let active=state.activeHome,disposed=false,searchSeq=0,controller,timer;
  const colours=H.PRINT_OPTIONS.themes,stops=[];
  const $=name=>host.querySelector(`[data-home="${name}"]`),home=()=>state.homes[active];
  host.querySelector('[data-ys-slot="search"]').innerHTML=`<div class="homes-tabs" role="tablist" aria-label="Homes">${Array.from({length:count},(_,i)=>`<button type="button" role="tab" data-home-tab="${i}" aria-selected="${i===active}" aria-controls="home-panel" id="home-tab-${i}">Home ${i+1}<span data-home-check="${i}" aria-hidden="true"></span></button>`).join('')}</div><div id="home-panel" role="tabpanel" aria-labelledby="home-tab-${active}"><label class="ys-label" for="home-search">Find your home in 1928</label><div class="ys-search"><input id="home-search" type="search" data-home="search" maxlength="80" autocomplete="off" placeholder="e.g. Chamissoplatz"><button class="outline" type="button" data-home="go">Search</button></div><p class="ys-note" data-home="status" role="status"></p><div class="ys-resultswrap"><ul class="ys-results" data-home="results" hidden></ul></div></div>`;
  countChoice(host,state,api,()=>mountHomes(host,state,api,H));
  host.querySelector('[data-ys-slot="visual"]').innerHTML=`<div class="ys-visual"><div class="homes-sheet" data-home="sheet"><div data-home="photos"></div><svg data-home="type" viewBox="0 0 1800 2400" class="homes-type" aria-label="Text on the print"></svg></div><p class="ys-caption">Each home in 1928 and today. ${matchMedia('(pointer: fine)').matches?'Click':'Tap'} either photo to move the cross.</p><p data-home="coverage" class="homes-coverage" role="status"></p></div>`;
  const inputField=(label,key,max,placeholder='')=>`<label>${label}<input data-home="${key}" maxlength="${max}" ${placeholder?`placeholder="${esc(placeholder)}"`:''}><small data-home-counter="${key}"></small></label>`;
  host.querySelector('[data-ys-slot="form"]').innerHTML=`<div class="ys-form homes-form"><div class="homes-home-fields">${inputField('Title on the print','title',L.title)}${inputField('Area line','area',L.area)}${inputField('Years or words for this home (optional)','line',L.line,'2009–2014')}<p class="ys-hint">The house number is never printed.</p></div>${inputField('Heading on the print','heading',L.heading)}<p class="ys-hint">or MY BERLIN HOMES, or a family name</p><div class="ys-format"><span class="ys-label">What you get</span><div class="ys-sizes" role="radiogroup">${['poster','digital'].map(k=>`<button class="ys-size" role="radio" type="button" data-homes-format="${k}">${k==='poster'?'Printed poster':'Digital file'}</button>`).join('')}</div></div><div data-home="variants"><span class="ys-label">Size</span><div class="ys-sizes" role="radiogroup">${H.YS_SIZES.map(z=>`<button class="ys-size" role="radio" type="button" data-homes-size="${z}">${z}</button>`).join('')}</div><label>Paper<select data-home="paper">${H.YS_PAPERS.map(p=>`<option>${p.name}</option>`).join('')}</select></label></div><span class="ys-label">Colour</span><div class="ys-swatches" role="radiogroup">${Object.entries(colours).map(([key,t])=>`<button type="button" role="radio" data-homes-colour="${key}" title="${esc(t.name)}" aria-label="${esc(t.name)}" style="--swatch:rgb(${t.mid});--paper:rgb(${t.bg})"><span aria-hidden="true"></span></button>`).join('')}</div></div>`;
  function price(){return state.format==='digital'?24.9:H.ysPrice(state)}
  function refresh(){
    if(disposed||!host.isConnected)return;
    let error='';try{encodeHomes({homes:state.homes.slice(0,count),heading:state.heading,colour:state.colour||'sepia'})}catch{error='Check the text and character limits.'}
    const ready=homesReady(state),btn=host.querySelector('[data-ys-add]');if(btn){btn.disabled=!ready||api.busy();btn.textContent=`Add to cart · €${price().toFixed(2)}`}
    host.querySelector('[data-ys-why]').textContent=ready?'':(state.homes.slice(0,count).some(h=>h.coverage==='blank')?'There is no 1928 aerial photo for this spot':state.homes.slice(0,count).some(h=>!h.lat)?'Add the next home to continue.':error||'Checking the aerial photos…');
    host.querySelectorAll('[data-home-tab]').forEach((b,i)=>{b.setAttribute('aria-selected',String(i===active));b.querySelector('span').textContent=state.homes[i]?.coverage==='ok'?' ✓':state.homes[i]?.coverage==='blank'?' !':''});
    host.querySelectorAll('[data-homes-format]').forEach(b=>b.setAttribute('aria-checked',String(b.dataset.homesFormat===(state.format||'poster'))));
    host.querySelectorAll('[data-homes-size]').forEach(b=>b.setAttribute('aria-checked',String(b.dataset.homesSize===H.ysSize(state))));
    host.querySelectorAll('[data-homes-colour]').forEach(b=>b.setAttribute('aria-checked',String(b.dataset.homesColour===(state.colour||'sepia'))));
    $('variants').hidden=state.format==='digital';
    host.getRootNode().querySelectorAll('[data-ys-legal]').forEach(b=>b.hidden=b.dataset.ysLegal!==(state.format||'poster'));
    const pr=host.querySelector('.product-title .price');if(pr)pr.textContent=`€${price().toFixed(2)}`;
    const heading=host.querySelector('.product-title h1');if(heading)heading.textContent='Your Berlin Homes in 1928';
    const spec=host.querySelector('.ys-buy .spec');if(spec)spec.textContent=state.format==='digital'?'Digital file · JPG + PDF · 45 x 60 cm at 300 ppi':`${H.ysSize(state)} · ${H.ysPaper(state).name}`;
    for(const key of ['title','area','line','heading']){const el=$(key),v=el.value;host.querySelector(`[data-home-counter="${key}"]`).textContent=`${v.length}/${L[key]}`;try{checkedText(v,L[key],key!=='line');el.setCustomValidity('')}catch{el.setCustomValidity('Check the text and character limits.')}}
  }
  api.refresh=refresh;
  function fields(){for(const key of ['title','area','line'])$(key).value=home()[key]||'';$('heading').value=state.heading;$('search').value=home().query||'';$('paper').value=H.ysPaper(state).name;$('status').textContent='Type the address of a home, yours now or one from years ago, then tap it. The preview is free.';refresh()}
  const photoKey=h=>[count,h.lat,h.lon].join(':');
  const cache=new Map();
  state.homes.slice(0,count).forEach((h,i)=>{if(h.photoKey===photoKey(h)&&h.rawPhotos)h.rawPhotos.forEach((raw,j)=>{if(raw)cache.set(i+'-'+j,raw)})}); // Yalnız bu açılışta, adresler tarayıcıda kalıcı tutulmaz.
  function fit(text,font,size,min,max){const c=document.createElement('canvas').getContext('2d');while(size>min){c.font=`${size}px '${font}'`;if(c.measureText(text).width<=max)break;size-=2}return size}
  function draw(){
    if(disposed)return;
    const theme=colours[state.colour||'sepia'];$('sheet').style.background=`rgb(${theme.bg})`;
    let words='',photos='';
    state.homes.slice(0,count).forEach((h,i)=>{
      const y=g.rows[i],ph=g.photoHeight;
      for(let j=0;j<2;j++){
        const x=j?cfg.rightX:cfg.mat,r=26*cfg.photoWidth/g.ground,gap=r*.35,len=r*.75,cx=cfg.photoWidth/2,cy=ph/2;
        const lines=[[cx-len,cy,cx-gap,cy],[cx+gap,cy,cx+len,cy],[cx,cy-len,cx,cy-gap],[cx,cy+gap,cx,cy+len]].map(v=>`M${v[0]},${v[1]}L${v[2]},${v[3]}`).join('');
        photos+=`<button type="button" class="homes-photo" data-photo-home="${i}" data-photo-layer="${j}" aria-label="Home ${i+1}, ${j?'today':'1928'}" style="left:${x/18}%;top:${y/24}%;width:${cfg.photoWidth/18}%;height:${ph/24}%"><canvas width="680" height="${ph}" data-home-canvas="${i}-${j}"></canvas>${h.lat?`<svg viewBox="0 0 680 ${ph}" aria-hidden="true"><path d="${lines}" fill="none" stroke="#141414" stroke-width="4.4"/><path d="${lines}" fill="none" stroke="#faf7ee" stroke-width="2.4"/></svg>`:`<span>Home ${i+1}</span>`}</button>`;
        words+=`<text x="${x+340}" y="${y+ph+35}" font-family="Space Grotesk" font-size="22" letter-spacing="6" text-anchor="middle">${j?(new URLSearchParams(location.search).get('lang')==='de'?'HEUTE':'TODAY'):'1928'}</text>`;
      }
      const title=(h.title||`Home ${i+1}`).toUpperCase().replace(/ẞ/g,'SS'),line=(h.area||'Berlin')+(h.line?' · '+h.line:'');
      words+=`<text x="900" y="${y+ph+cfg.captionTitle}" text-anchor="middle" font-family="DM Serif Display" font-size="${fit(title,'DM Serif Display',70,34,1400)}">${esc(title)}</text><text x="900" y="${y+ph+cfg.captionLine}" text-anchor="middle" fill="rgb(${theme.ink})" font-family="Space Grotesk" font-size="${fit(line,'Space Grotesk',34,24,1400)}">${esc(line)}</text>`;
    });
    const heading=state.heading.toUpperCase().replace(/ẞ/g,'SS');words+=`<text x="900" y="${g.headingY??cfg.headingY}" text-anchor="middle" font-family="DM Serif Display" font-size="${fit(heading,'DM Serif Display',92,44,1400)}">${esc(heading)}</text>`;
    $('type').innerHTML=words;$('type').style.fill=`rgb(${theme.main})`;$('photos').innerHTML=photos;
    state.homes.slice(0,count).forEach((h,i)=>{for(let j=0;j<2;j++){const raw=cache.get(i+'-'+j);if(!raw)continue;const canvas=host.querySelector(`[data-home-canvas="${i}-${j}"]`);canvas.width=raw.width;canvas.height=raw.height;canvas.getContext('2d').putImageData(new ImageData(H.gradePixels(raw.data,theme,j===0),raw.width,raw.height),0,0)}});
    $('coverage').textContent=state.homes.slice(0,count).some(h=>h.coverage==='blank')?'There is no 1928 aerial photo for this spot':'';
    host.querySelectorAll('[data-photo-home]').forEach(b=>b.addEventListener('click',e=>{
      const i=Number(b.dataset.photoHome),h=state.homes[i];if(!h.lat)return;
      const box=b.getBoundingClientRect(),[cx,cy]=H.utm33(h.lat,h.lon),hm=g.ground*g.photoHeight/cfg.photoWidth;
      const [lat,lon]=H.fromUtm33(cx+((e.clientX-box.left)/box.width-.5)*g.ground,cy+(.5-(e.clientY-box.top)/box.height)*hm,[h.lat,h.lon]);
      if(!H.inBerlin(lat,lon))return;h.lat=Number(lat.toFixed(5));h.lon=Number(lon.toFixed(5));load(i);refresh();
    }));refresh();
  }
  // Geoportal, then my copy of the layers, then Geoportal once more (aerial-source.js, 10 Nov 2026).
  async function photo(url){const img=H.loadAerialImage?await H.loadAerialImage(url,{timeoutMs:12000,retryTimeoutMs:18000,track:step=>api.track?.(step)}):await new Promise((resolve,reject)=>{const i=new Image();i.crossOrigin='anonymous';const t=setTimeout(()=>reject(Error('FOTO_ZAMAN_ASIMI')),18000);i.onload=()=>{clearTimeout(t);resolve(i)};i.onerror=()=>{clearTimeout(t);reject(Error('FOTO_OKUNAMADI'))};i.src=url});const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);return ctx.getImageData(0,0,c.width,c.height)}
  async function load(i){
    const h=state.homes[i],token=(h.token||0)+1;h.token=token;h.photoKey=photoKey(h);h.rawPhotos=[];h.coverage='loading';h.todayLoaded=false;cache.delete(i+'-0');cache.delete(i+'-1');draw();
    const [x,y]=H.utm33(h.lat,h.lon),ph=g.photoHeight,wm=g.ground,hm=wm*ph/680;
    const urls=[H.wmsUrl('https://gdi.berlin.de/services/wms/luftbild_1928_04','c_luftbilder_1928_04_raster',x,y,wm,hm,680,ph),H.wmsUrl('https://gdi.berlin.de/services/wms/truedop_2026','truedop_2026',x,y,wm,hm,680,ph)];
    const raw=await Promise.allSettled(urls.map(photo));if(disposed||h.token!==token)return;
    raw.forEach((r,j)=>{if(r.status==='fulfilled'){cache.set(i+'-'+j,r.value);h.rawPhotos[j]=r.value}});
    if(raw[0].status==='fulfilled'){const d=raw[0].value.data;let empty=0;for(let p=0;p<d.length;p+=4)if(d[p+3]<10||(d[p]>=250&&d[p+1]>=250&&d[p+2]>=250))empty++;h.emptyShare=empty/(d.length/4);h.coverage=h.emptyShare>.02?'blank':'ok'}else h.coverage='error';
    h.todayLoaded=raw[1].status==='fulfilled';if(h.coverage==='ok'&&h.todayLoaded)api.track?.('preview');if(h.coverage==='error'||!h.todayLoaded)$('status').textContent='The aerial photo could not load. Search for the place again to retry.';
    draw();
  }
  async function search(){
    controller?.abort();controller=new AbortController();const seq=++searchSeq,i=active,q=$('search').value.trim();home().query=q;if(q.length<3)return;
    $('status').textContent='Searching…';api.track?.('search');
    try{const url='https://photon.komoot.io/api/?q='+encodeURIComponent(q)+'&limit=10&lang=de&bbox=13.0884,52.3383,13.7612,52.6755';let rows=[];try{const r=await fetch(url,{signal:controller.signal});if(!r.ok)throw Error();rows=(await r.json()).features.map(H.fromPhoton).filter(h=>h.city==='Berlin'&&H.inBerlin(h.lat,h.lon)).slice(0,5)}catch(e){if(e.name==='AbortError')throw e;}
      if(!rows.length){const wait=Math.max(0,(api.lastSearchAt||0)+1100-Date.now());if(wait)await new Promise(r=>setTimeout(r,wait));api.lastSearchAt=Date.now();const r=await fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&countrycodes=de&bounded=1&viewbox=13.0884,52.6755,13.7612,52.3383&q='+encodeURIComponent(q+', Berlin'),{signal:controller.signal});if(!r.ok)throw Error();rows=(await r.json()).map(r=>({...r,lat:Number(r.lat),lon:Number(r.lon)})).filter(h=>H.inBerlin(h.lat,h.lon));}if(disposed||i!==active||seq!==searchSeq)return;
      $('results').innerHTML=rows.map((r,n)=>`<li><button type="button" class="ys-pick" data-homes-pick="${n}">${esc(H.addressLabel(r))}</button></li>`).join('');$('results').hidden=!rows.length;$('status').textContent=rows.length?'Tap your place to put it on the poster:':'Nothing found in Berlin. Check the spelling, or try the street name with a house number.';
      $('results').querySelectorAll('[data-homes-pick]').forEach(b=>b.onclick=()=>{const r=rows[Number(b.dataset.homesPick)],h=state.homes[i];Object.assign(h,{lat:Number(r.lat.toFixed(5)),lon:Number(r.lon.toFixed(5)),title:H.titleFrom(r),area:H.areaFrom(r),query:q});$('results').hidden=true;fields();api.track?.('pick');load(i)});
    }catch(e){if(e.name!=='AbortError'&&seq===searchSeq)$('status').textContent='The address search did not answer. Try again in a moment.'}
  }
  $('go').onclick=search;$('search').oninput=()=>{clearTimeout(timer);timer=setTimeout(search,450)};$('search').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();clearTimeout(timer);search()}};
  host.querySelectorAll('[data-home-tab]').forEach(b=>b.onclick=()=>{controller?.abort();clearTimeout(timer);searchSeq++;active=Number(b.dataset.homeTab);state.activeHome=active;$('results').hidden=true;host.querySelector('#home-panel').setAttribute('aria-labelledby','home-tab-'+active);fields()});
  for(const key of ['title','area','line','heading'])$(key).oninput=()=>{if(key==='heading')state.heading=$(key).value;else home()[key]=$(key).value;draw()};
  $('paper').onchange=()=>{state.paper=$('paper').value;refresh()};
  host.querySelectorAll('[data-homes-size]').forEach(b=>b.onclick=()=>{state.size=b.dataset.homesSize;refresh()});
  host.querySelectorAll('[data-homes-format]').forEach(b=>b.onclick=()=>{state.format=b.dataset.homesFormat;refresh()});
  host.querySelectorAll('[data-homes-colour]').forEach(b=>b.onclick=()=>{state.colour=b.dataset.homesColour;draw()});
  api.homesCleanup=()=>{disposed=true;controller?.abort();clearTimeout(timer)};
  api.cancelPhotos=api.homesCleanup;
  fields();draw();state.homes.slice(0,count).forEach((h,i)=>{if(h.lat&&!(h.photoKey===photoKey(h)&&h.rawPhotos?.length===2))load(i)});
  Promise.all([document.fonts.load("70px 'DM Serif Display'"),document.fonts.load("34px 'Space Grotesk'")]).then(()=>{if(!disposed)draw()});
}
