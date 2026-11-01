/* Consented campaign funnel, no form contents. Attribution and IDs exist only after consent. */
(() => {
 'use strict';if(window.WobCampaignFunnel)return;
 const end=Date.parse('2026-11-17T00:00:00+01:00'),storageName='wob-campaign-journey-202611',sent=new Set();
 const edition=location.hostname==='editions.walkofberlin.com';
 const policy=()=>{if(navigator.globalPrivacyControl)return {};if(edition){try{const a=localStorage.getItem('wob-editions-consent-v1')==='accept';return {analytics:a,advertising:a};}catch{return {};}}try{return window.consentPolicyManager?.getCurrentConsentPolicy?.()?.policy||{};}catch{return {};}};
 function context(){if(Date.now()>=end||!policy().analytics){try{sessionStorage.removeItem(storageName);}catch{}return null;}let c;try{c=JSON.parse(sessionStorage.getItem(storageName)||'null');}catch{}const q=new URLSearchParams(location.search);const incoming=q.get('utm_campaign')==='gift-week-202611';if(c&&incoming&&q.get('utm_content')!==c.utm_content)c=null;
 if(!c){c={session:crypto.randomUUID().replace(/-/g,''),page:location.hostname+location.pathname+(q.get('lang')==='de'?'?lang=de':''),utm_campaign:incoming?'gift-week-202611':'',utm_source:incoming?q.get('utm_source')||'':'',utm_content:incoming?q.get('utm_content')||'':''};if(policy().advertising&&incoming&&q.get('utm_landing')){const land=q.get('utm_landing');if(/^(?:www\.)?walkofberlin\.com\/|^editions\.walkofberlin\.com\//.test(land))c.page=land;}try{sessionStorage.setItem(storageName,JSON.stringify(c));}catch{}}
 if(!policy().advertising)return {...c,utm_source:'',utm_content:'',utm_campaign:''};return c;}
 function emit(stage,event){const c=context();if(!c||c.utm_campaign!=='gift-week-202611')return;const id=stage+':'+location.pathname;if(sent.has(id))return;sent.add(id);fetch('https://editions.walkofberlin.com/api/funnel',{method:'POST',mode:'cors',credentials:'omit',keepalive:true,headers:{'Content-Type':'application/json'},body:JSON.stringify({...c,stage,event,analyticsConsent:true,advertisingConsent:policy().advertising===true})}).catch(()=>{});}
 function attribution(){const c=context();return c&&c.utm_campaign==='gift-week-202611'?{utm_source:c.utm_source,utm_campaign:c.utm_campaign,utm_content:c.utm_content,utm_landing:c.page,utm_journey:c.session}:{};}
 window.WobCampaignFunnel={emit,context,attribution};
 const initial=()=>emit('visits','page_view');initial();document.addEventListener('consentPolicyChanged',initial);document.addEventListener('consentPolicyInitialized',initial);document.addEventListener('wob-editions-consent',initial);
 document.addEventListener('click',ev=>{const path=ev.composedPath();const a=path.find(n=>n?.tagName==='A'&&n.href);if(a&&/\/product-page\/|\/products\/|editions\.walkofberlin.com/.test(a.href)){emit('interest','select_item');const c=attribution();if(c.utm_campaign){try{const u=new URL(a.href);if(/^(?:www\.)?walkofberlin\.com$|^editions\.walkofberlin\.com$/.test(u.hostname)){for(const[k,v]of Object.entries(c))u.searchParams.set(k,v);a.href=u.href;}}catch{}}}
 const button=path.find(n=>n?.dataset?.action||n?.dataset?.ys);const action=button?.dataset?.action||button?.dataset?.ys;if(action==='ys-search')emit('interest','street_search');
 },true);
})();
