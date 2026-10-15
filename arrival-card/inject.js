(function(){
  'use strict';
  if(window.BW_ARRIVAL_CARD_BOOTED)return;window.BW_ARRIVAL_CARD_BOOTED=true;
  const base=new URL('./',document.currentScript.src).href;
  if(location.pathname.replace(/\/+$/,'')==='/privacy-policy'){const script=document.createElement('script');script.src=base+'privacy.js';document.head.append(script);return;}
  let scope,scheduled=false,route='',observer,mounted=null,suppressed='';
  const residentPaths=["/post/apple-picking-near-berlin","/post/autumn-leaves-in-berlin","/post/balcony-solar-berlin","/post/berlin-bathing-season","/post/berlin-bridge-days-2027","/post/berlin-bulky-waste","/post/berlin-election-2026","/post/berlin-flat-notice-period","/post/berlin-heating-season","/post/berlin-hiking-trails","/post/berlin-housing-cooperative","/post/berlin-monthly-ticket","/post/berlin-nebenkostenabrechnung","/post/berlin-parking-zones","/post/berlin-public-libraries","/post/berlin-rent-increase","/post/berlin-rental-deposit","/post/berlin-school-registration","/post/berlin-snow-clearing-rules","/post/berlin-water-hardness","/post/berlin-zoo-annual-pass","/post/bike-lights-in-berlin","/post/bike-theft-in-berlin","/post/blood-donation-berlin","/post/bouldering-in-berlin","/post/buergeramt-berlin","/post/cargo-bike-berlin","/post/church-tax-berlin","/post/cranes-near-berlin","/post/dentist-in-berlin","/post/doctor-appointment-berlin","/post/dog-parks-in-berlin","/post/electricity-provider-berlin","/post/elterngeld-berlin","/post/flu-shot-in-berlin","/post/german-citizenship-berlin","/post/german-courses-in-berlin","/post/halteverbotszone-berlin","/post/health-insurance-in-berlin","/post/herbstferien-berlin","/post/home-insurance-in-berlin","/post/home-internet-berlin","/post/ice-skating-in-berlin","/post/indoor-playgrounds-in-berlin","/post/kaeltehilfe-berlin","/post/kindergeld-berlin","/post/kita-place-berlin","/post/kleingarten-berlin","/post/mieterverein-berlin","/post/milieuschutz-berlin","/post/missed-parcel-in-berlin","/post/mould-in-berlin-flats","/post/mushroom-picking-berlin","/post/pumpkin-patch-berlin","/post/repair-cafe-berlin","/post/rundfunkbeitrag-berlin","/post/second-home-tax-berlin","/post/sick-leave-in-berlin","/post/stargazing-in-berlin","/post/swimming-lessons-for-kids-in-berlin","/post/tax-return-in-berlin","/post/thermal-baths-near-berlin","/post/urban-sports-club-vs-gym-berlin","/post/vet-in-berlin","/post/wbs-berlin","/post/winter-swimming-in-berlin","/post/winter-tyres-berlin","/post/wohngeld-berlin"];
  const clean=p=>p.replace(/\/+$/,'')||'/';
  const visible=e=>e && e.getBoundingClientRect().height>0 && getComputedStyle(e).display!=='none';
  function all(selector,root=document){const found=[...root.querySelectorAll(selector)];for(const el of root.querySelectorAll('*'))if(el.shadowRoot)found.push(...all(selector,el.shadowRoot));return found;}
  function safeArticlePoint(){
    const article=document.querySelector('article');if(!article)return null;
    const excluded='aside,nav,[data-bw-blog-booking],[data-bw-date-check-card],[data-bw-blog-journey],[data-bw-blog-share-bar],[data-bw-blog-mobile-nav],bw-arrival-card';
    const blocks=[...article.querySelectorAll('h2,h3,p,blockquote')].filter(e=>visible(e)&&!e.closest(excluded)&&e.textContent.trim().length>20);
    if(blocks.length<4)return null;
    // Stop at the first wrapper with a following editorial sibling; never split
    // a paragraph, list, table, iframe, figure or source disclosure.
    let target=blocks[Math.floor(blocks.length/2)];
    if(target.tagName==='H2'||target.tagName==='H3')target=blocks[Math.max(0,Math.floor(blocks.length/2)-1)];
    if(target.closest('li,table,figure,details'))target=target.closest('ul,ol,table,figure,details');
    while(target.parentElement&&target.parentElement!==article&&!target.nextElementSibling)target=target.parentElement;
    if(!target.parentElement||!target.nextElementSibling)return null;
    return {parent:target.parentElement,before:target.nextElementSibling,placement:'article-middle'};
  }
  function normalPoint(){
    const main=document.querySelector('main');if(!main)return null;
    const faq=all('#faq,[data-bw-faq],bw-faq,.faq-section',main).find(visible);
    if(faq){return {parent:faq.parentNode,before:faq,placement:'pre-faq'};}
    const heading=all('h2,h3',main).find(h=>visible(h)&&/^(frequently asked questions|faq|quick questions|quick answers about the walk|questions(?: and answers)?)/i.test(h.textContent.trim()));
    if(heading){const section=heading.closest('section');const dedicated=section&&section!==main&&section.querySelector('h2,h3')===heading;const target=dedicated?section:(heading.closest('[data-breakout]')||heading);return {parent:target.parentNode,before:target,placement:'pre-faq'};}
    // Wix gives its page sections explicit grid rows while main is display:contents.
    // An appended main child can auto-place before the booking/related-tools rows.
    // Let the final visible native section grow instead, keeping the offer after
    // that section's existing content and before the separate site footer.
    const tail=[...main.children].filter(e=>e.tagName==='SECTION'&&visible(e)&&!e.hasAttribute('data-bw-arrival-offer')).at(-1);
    return {parent:tail||main,before:null,placement:'pre-footer'};
  }
  function mount(){
    scheduled=false;if(!scope)return;
    const path=clean(location.pathname);
    if(path!==route){document.querySelectorAll('[data-bw-arrival-offer]').forEach(e=>e.remove());all('bw-arrival-card').forEach(e=>e.closest('[data-bw-arrival-offer]')?.remove());route=path;suppressed='';}
    if(residentPaths.includes(path)||document.documentElement.getAttribute('data-bw-resident-post')===path.slice(6)){
      document.querySelectorAll('[data-bw-arrival-offer]').forEach(e=>e.remove());
      return;
    }
    if(!((path==='/'&&scope.home)||scope.postPaths.includes(path)||scope.toolPaths.includes(path)))return;
    // A page style that hides the card (Shell V3 tool pages) must not start a remove/re-insert loop.
    if(suppressed===path)return;
    // The card this script placed is still on screen: skip the full light+shadow DOM walk.
    if(mounted&&mounted.isConnected&&visible(mounted))return;
    const existing=all('bw-arrival-card');
    if(existing.some(visible))return;
    existing.forEach(e=>e.closest('[data-bw-arrival-offer]')?.remove());
    const point=path.startsWith('/post/')?safeArticlePoint():normalPoint();if(!point)return;
    const wrapper=document.createElement('section');wrapper.setAttribute('data-bw-arrival-offer',point.placement);wrapper.setAttribute('aria-label','Free Berlin Arrival Card');
    wrapper.style.cssText='display:block;box-sizing:border-box;width:100%;max-width:1280px;min-width:0;margin:40px auto;padding:0 20px;grid-column:1 / -1;';
    if(point.placement==='article-middle')wrapper.style.cssText='display:block;box-sizing:border-box;max-width:100%;width:100%;min-width:0;margin:36px 0;padding:0;';
    const card=document.createElement('bw-arrival-card');card.setAttribute('placement',point.placement);if(point.placement==='article-middle')card.setAttribute('compact','');wrapper.append(card);
    point.parent.insertBefore(wrapper,point.before);mounted=card;
    if(!visible(card))suppressed=path;
  }
  function schedule(){if(scheduled)return;scheduled=true;setTimeout(mount,150);}
  fetch(base+'scope.json',{credentials:'omit'}).then(r=>{if(!r.ok)throw Error('scope');return r.json();}).then(data=>{scope=data;const script=document.createElement('script');script.src=base+'arrival-card-element.js';script.onload=()=>{mount();observer=new MutationObserver(schedule);observer.observe(document.body,{childList:true,subtree:true});};document.head.append(script);}).catch(()=>{});
  window.addEventListener('popstate',schedule);window.addEventListener('load',schedule);
  // Wix client navigation does not emit popstate on every route transition.
  setInterval(()=>{if(route!==clean(location.pathname))schedule();},1500);
})();
