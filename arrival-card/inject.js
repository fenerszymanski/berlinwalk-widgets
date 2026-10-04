(function(){
  'use strict';
  if(window.BW_ARRIVAL_CARD_BOOTED)return;window.BW_ARRIVAL_CARD_BOOTED=true;
  const base=new URL('./',document.currentScript.src).href;
  if(location.pathname.replace(/\/+$/,'')==='/privacy-policy'){const script=document.createElement('script');script.src=base+'privacy.js';document.head.append(script);return;}
  let scope,scheduled=false,route='',observer;
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
    return {parent:main,before:null,placement:'pre-footer'};
  }
  function mount(){
    scheduled=false;if(!scope)return;
    const path=clean(location.pathname);
    if(path!==route){document.querySelectorAll('[data-bw-arrival-offer]').forEach(e=>e.remove());all('bw-arrival-card').forEach(e=>e.closest('[data-bw-arrival-offer]')?.remove());route=path;}
    if(!((path==='/'&&scope.home)||scope.postPaths.includes(path)||scope.toolPaths.includes(path)))return;
    const existing=all('bw-arrival-card');
    if(existing.some(visible))return;
    existing.forEach(e=>e.closest('[data-bw-arrival-offer]')?.remove());
    const point=path.startsWith('/post/')?safeArticlePoint():normalPoint();if(!point)return;
    const wrapper=document.createElement('section');wrapper.setAttribute('data-bw-arrival-offer',point.placement);wrapper.setAttribute('aria-label','Free Berlin Arrival Card');
    wrapper.style.cssText='display:block;box-sizing:border-box;width:100%;max-width:1280px;min-width:0;margin:40px auto;padding:0 20px;grid-column:1 / -1;';
    if(point.placement==='article-middle')wrapper.style.cssText='display:block;box-sizing:border-box;max-width:100%;width:100%;min-width:0;margin:36px 0;padding:0;';
    const card=document.createElement('bw-arrival-card');card.setAttribute('placement',point.placement);if(point.placement==='article-middle')card.setAttribute('compact','');wrapper.append(card);
    point.parent.insertBefore(wrapper,point.before);
  }
  function schedule(){if(scheduled)return;scheduled=true;setTimeout(mount,150);}
  fetch(base+'scope.json',{credentials:'omit'}).then(r=>{if(!r.ok)throw Error('scope');return r.json();}).then(data=>{scope=data;const script=document.createElement('script');script.src=base+'arrival-card-element.js';script.onload=()=>{mount();observer=new MutationObserver(schedule);observer.observe(document.body,{childList:true,subtree:true});};document.head.append(script);}).catch(()=>{});
  window.addEventListener('popstate',schedule);window.addEventListener('load',schedule);
  // Wix client navigation does not emit popstate on every route transition.
  setInterval(()=>{if(route!==clean(location.pathname))schedule();},1500);
})();
