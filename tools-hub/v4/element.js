(()=>{function le(d,y,x){function S(e){try{let t=new URL(e);if(t.hostname!=="static.wixstatic.com")return e;let r=t.pathname.split("/v1/")[0];return t.origin+r+"/v1/fill/w_80,h_80,al_c,q_80,enc_avif,quality_auto/tool.avif"}catch{return e}}let k=24,B=d.hubCategories,E={TripPlans:"Trip plans & first day",Transport:"Transport & arrival",MoneyShopping:"Money & costs",Essentials:"Open today & essentials",WeatherOutdoor:"Weather & outdoors",FoodNightlife:"Food & nights out",EventsSports:"Events & festivals",CultureLandmarks:"History & culture"},O={TripPlans:"Trips",Transport:"Transport",MoneyShopping:"Money",Essentials:"Open today",WeatherOutdoor:"Weather",FoodNightlife:"Food",EventsSports:"Events",CultureLandmarks:"History"},K=new Set(["q","category","type","page"]),U=new Set(["a","an","and","are","around","at","be","berlin","berliner","by","can","do","does","for","from","get","go","how","i","in","into","is","it","me","my","near","of","on","or","should","the","there","this","to","use","what","whats","when","where","which","who","why","with","you","your"]),G=new Set(["ber","bvg","csd","ddr","fex","ice","ifa","ilb","omu","ov","sbahn","sim","sup","ubahn","ulb","ust","vat","vbb","wbs","wc","zlb","zob"]),P={flughafen:["ber","airport","airports","flight","layover","schonefeld","tegel"],airport:["ber","airport","airports","flight","layover"],airports:["ber","airport","airports","flight","layover"],ber:["ber","airport"],sbahn:["sbahn","ringbahn","rail","train","s41","s42"],ubahn:["ubahn","subway","underground","metro","u8","rail"],toilets:["toilet","toilets","wc","restroom","bathroom","loo"],toilet:["toilet","toilets","wc","restroom","bathroom","loo"],toilette:["toilet","toilets","wc"],klo:["toilet","toilets","wc"],wc:["toilet","toilets","wc"],restroom:["toilet","toilets"],bathroom:["toilet","toilets"],gepack:["luggage","baggage","locker","suitcase","bag"],koffer:["luggage","baggage","locker","suitcase"],schliessfach:["luggage","locker","bag"],baggage:["luggage","bag","suitcase","locker"],suitcase:["luggage","bag","locker"],lockers:["luggage","locker","bag"],locker:["luggage","locker","bag"],regen:["rain","rainy","rainfall","indoor","weather"],rainy:["rain","rainy","rainfall","indoor","weather"],rainfall:["rain","rainy","rainfall","weather"],fahrkarte:["ticket","tickets","fare","pass","bvg"],fahrschein:["ticket","tickets","fare","pass","bvg"],offnungszeiten:["open","today","hours","sunday","holiday","closed"],geoffnet:["open","today","sunday","holiday"],feiertag:["holiday","open","sunday","closed"],sonntag:["sunday","open","shopping","spati"],trinkgeld:["tip","tipping"],apotheke:["pharmacy","medical","medicine","doctor","emergency"],pfand:["pfand","bottle","deposit","refund"],spati:["spati","late","sunday","convenience"],kiosk:["spati","late","sunday"]},Y={ticket:{"transport-ticket-calculator":650,"berlin-phone-ticket-picker":520,"berlin-zone-ticket-decoder":480,"welcomecard-calculator":880,"berlin-ticket-machine-simulator":340,"berlin-deutschlandticket-checker":320,"berlin-pass-cost-comparison":300},open:{"whats-open-in-berlin-today":900,"berlin-sunday-shopping":760,"berlin-public-holiday-checker":720,"berlin-monday-plan-checker":680,"berlin-sunday-planner":520},museum:{"berlin-museums-map":650,"museum-island-one-pick":520,"berlin-museum-ticket-desk":480,"berlin-museum-three-slot-builder":340,"berlin-museum-bag-planner":320},toilet:{"berlin-public-toilets":450},rain:{"berlin-weather-by-month":420,"berlin-indoor-play-bill":360,"berlin-walking-kit":350,"berlin-family-day-planner":330,"berlin-attractions-worth-it-matcher":310,"berlin-museums-map":290},ber:{"berlin-ber-airport-departure-planner":450,"ber-dawn-departure-map":380,"berlin-airports":360,"berlin-layover-planner":340,"ber-flight-compensation-line":320},flughafen:{"berlin-ber-airport-departure-planner":450,"ber-dawn-departure-map":380,"berlin-airports":360,"berlin-layover-planner":340,"ber-flight-compensation-line":320},luggage:{"berlin-luggage-storage":450,"berlin-station-arrival-planner":320,"berlin-museum-bag-planner":300,"berlin-check-in-gap-planner":280},sbahn:{"berlin-ringbahn":420,"berlin-rail-decoder":380,"berlin-night-transport-checker":340,"berlin-zone-ticket-decoder":320,"transport-ticket-calculator":300}},V={"transport-ticket-calculator":["ticket","tickets","bvg ticket","public transport ticket","fare calculator","fahrkarte","fahrschein","s bahn ticket","u bahn ticket"],"berlin-phone-ticket-picker":["ticket","tickets","bvg app ticket","phone ticket","fahrkarte","s bahn ticket","u bahn ticket"],"berlin-zone-ticket-decoder":["ticket","tickets","ab abc ticket","zone ab abc","airport ticket","ber","flughafen","s bahn"],"welcomecard-calculator":["ticket","tickets","welcomecard","tourist pass","transport pass"],"berlin-pass-cost-comparison":["ticket","tickets","citytourcard","museum pass","welcomecard"],"berlin-deutschlandticket-checker":["ticket","tickets","deutschlandticket","63 euro ticket","ber","flughafen"],"berlin-ticket-machine-simulator":["ticket","tickets","bvg machine","validate ticket","fahrkarte"],"whats-open-in-berlin-today":["open","what is open today","whats open today","open today","open now","is berlin open today","sunday open","holiday open","offnungszeiten","geoffnet"],"berlin-sunday-shopping":["open","open today","what is open today","sunday open","supermarket open sunday","sonntag","offnungszeiten"],"berlin-public-holiday-checker":["open","open today","what is open today","holiday open","feiertag"],"berlin-monday-plan-checker":["open","open today","monday open","closed museums monday"],"berlin-sunday-planner":["open","sunday open","what is open on sunday"],"berlin-museums-map":["museum","museums","museum map","berlin museums","rain","rainy day"],"museum-island-one-pick":["museum","museums","museum island","museumsinsel"],"berlin-museum-ticket-desk":["museum","museums","museum ticket","museum price"],"berlin-museum-three-slot-builder":["museum","museums","museum planner"],"berlin-museum-closure-timeline":["museum","museums","pergamon closed","museum renovation"],"berlin-museum-bag-planner":["museum","museums","luggage","bag","cloakroom","locker"],"berlin-public-toilets":["toilet","toilets","public toilet","public toilets","wc","restroom","bathroom","loo","toilette","klo"],"berlin-weather-by-month":["rain","rainy","rainfall","weather","regen","temperature"],"berlin-indoor-play-bill":["rain","rainy","rainy day","indoor","regen"],"berlin-walking-kit":["rain","rainy","rain gear","weather forecast","regen"],"berlin-attractions-worth-it-matcher":["rain","rainy day","indoor attractions"],"berlin-family-day-planner":["rain","rainy day","kids rain"],"berlin-ber-airport-departure-planner":["ber","ber airport","flughafen","flughafen ber","airport departure","flight","fex","s9"],"ber-dawn-departure-map":["ber","ber airport","flughafen","flughafen ber","early flight","airport night train"],"berlin-airports":["ber","ber airport","flughafen","flughafen ber","tegel","schonefeld","tempelhof","airport"],"berlin-layover-planner":["ber","ber airport","flughafen","flughafen ber","airport layover","stopover"],"ber-flight-compensation-line":["ber","ber airport","flughafen","flight delay","airport compensation"],"berlin-luggage-storage":["luggage","baggage","suitcase","locker","lockers","bag drop","left luggage","gepack","koffer","schliessfach"],"berlin-station-arrival-planner":["luggage","baggage","arrival station","hauptbahnhof","s bahn"],"berlin-check-in-gap-planner":["luggage","suitcase","before check in"],"berlin-ringbahn":["sbahn","s bahn","s41","s42","ring line","circle line"],"berlin-rail-decoder":["sbahn","s bahn","ubahn","u bahn","s41","s42","u8","fex","re1"],"berlin-night-transport-checker":["sbahn","s bahn","ubahn","u bahn","night train","night bus"],"berlin-station-exit-map":["sbahn","s bahn","ubahn","u bahn","station exit"],"berlin-ubahn-etiquette":["ubahn","u bahn","sbahn","s bahn","subway rules"],"berlin-ghost-stations":["ubahn","u bahn","sbahn","s bahn","geisterbahnhofe"]};function J(e){return String(e||"").toLowerCase().replace(/ß/g,"ss").replace(/ä/g,"a").replace(/ö/g,"o").replace(/ü/g,"u").normalize("NFKD").replace(/[\u0300-\u036f]/g,"")}function s(e){return J(e).replace(/['’`]/g,"").replace(/\b([su])\s*-\s*bahn\b/g,"$1bahn").replace(/\b([su])\s+bahn\b/g,"$1bahn").replace(/[^a-z0-9]+/g," ").trim().replace(/\s+/g," ")}function i(e){let t=String(e||"").trim();return t.length<=3||G.has(t)?t:t==="rainy"||t==="rainfall"||t==="raining"||t==="rains"?"rain":t==="tipping"||t==="tips"?"tip":t==="opening"||t==="opened"||t==="opens"?"open":t==="ferries"?"ferry":t==="libraries"?"library":t==="families"?"family":t==="pharmacies"?"pharmacy":t==="cemeteries"?"cemetery":t==="embassies"?"embassy":t==="passes"?"pass":t==="buses"?"bus":t==="taxes"?"tax":t==="beaches"?"beach":t==="churches"?"church":t==="dishes"?"dish":t==="boxes"?"box":t.endsWith("ies")&&t.length>5?`${t.slice(0,-3)}y`:t.endsWith("s")&&!t.endsWith("ss")&&!t.endsWith("us")&&!t.endsWith("is")&&t.length>4?t.slice(0,-1):t}function u(e){let t=s(e);return t?t.split(" ").filter(Boolean):[]}function g(e,t){if(e===t)return!0;let r=e.length,a=t.length;if(Math.abs(r-a)>1||r<5||a<5||e[0]!==t[0])return!1;let n=0,p=0,c=0;for(;n<r&&p<a;){if(e[n]===t[p]){n+=1,p+=1;continue}if(c>=1)return!1;if(c+=1,n+1<r&&p+1<a&&e[n]===t[p+1]&&e[n+1]===t[p]){n+=2,p+=2;continue}r>a?n+=1:(a>r||(n+=1),p+=1)}return(n<r||p<a)&&(c+=1),c<=1}let f=new Set(Object.keys(P));function C(e){if(y[e.slug])return y[e.slug];let t=String(e.lead||"").trim().replace(/\btip-based walking tours\b/gi,"walking tours").replace(/\s*—\s*/g,", "),r=t.match(/^(.+?[.!?])(?:\s|$)/);return r?r[1]:t}function L(e,t){let r=s(e.title),a=s(e.slug.replace(/-/g," ")),n=(e.tags||[]).map(z=>s(z)).filter(Boolean),p=[...e.aliases||[],...V[e.slug]||[]].map(z=>s(z)).filter(Boolean),c=s(t),l=s(e.lead),o=u(r),h=u(a),m=n.flatMap(z=>u(z)),F=p.flatMap(z=>u(z)),X=[...u(c),...u(l)],_=new Set(o),ee=new Set(o.map(i)),j=new Set(h),te=new Set(h.map(i)),I=new Set(m),W=new Set(m.map(i)),v=new Set(F),R=new Set(F.map(i)),D=new Set(X),re=new Set(X.map(i)),Ce=new Set([..._,...j,...I,...v,...D]);for(let z of[..._,...j,...I,...v]){z.length>=5&&f.add(z);let se=i(z);se.length>=5&&f.add(se)}let Te=_.has("ber")||j.has("ber")||I.has("ber")||v.has("ber")||D.has("ber");return{titleNorm:r,slugNorm:a,tagsNorm:n,aliasesNorm:p,titleTokens:o,titleTokenSet:_,titleStemSet:ee,slugTokenSet:j,slugStemSet:te,tagTokenSet:I,tagStemSet:W,aliasTokenSet:v,aliasStemSet:R,leadTokenSet:D,leadStemSet:re,allTokens:Ce,hasExactBer:Te}}let T=d.tools.filter(e=>e.widgetUrl&&e.hidden!==!0&&e.published!==!1&&String(e.status||"").toLowerCase()!=="draft").map(e=>{let t=C(e);return{...e,shortLead:t,_idx:L(e,t)}}).sort((e,t)=>e.title.localeCompare(t.title,"en",{sensitivity:"base"})||e.slug.localeCompare(t.slug)),M=[...new Set(T.map(e=>e.type).filter(Boolean))].sort(),H=["transport-ticket-calculator","whats-open-in-berlin-today","berlin-first-day-planner","berlin-dates-check","berlin-luggage-storage","berlin-daily-budget"],A=H.map(e=>T.find(t=>t.slug===e)||T.find(t=>e==="berlin-dates-check"&&t.title==="Berlin Date Check")).filter(Boolean);function ne(e){if(e.length<5||G.has(e))return[];let t=[];for(let r of f)g(e,r)&&t.push(r);return t}function de(e){let t=i(e),r=[...P[e]||[],...P[t]||[]],a=new Set([e,t]),n=new Set;for(let p of r)for(let c of u(p))n.add(c),n.add(i(c));return{rawToken:e,stem:t,isBerToken:e==="ber",exactVariants:[...a],synonymVariants:[...n],typoCandidates:ne(e)}}function be(e){let t=s(e);if(!t)return null;let r=u(t);if(r.length===0)return null;let a=r.filter(c=>!U.has(c)),n=a.length>0?a:r.filter(c=>c!=="berlin"&&c!=="berliner"),p=n.length>0?n:r;return{rawQuery:String(e||"").trim(),normQuery:t,rawTokens:r,activeTokens:p,tokenGroups:p.map(de)}}function ge(e,t,r=!1){let{rawToken:a,isBerToken:n,exactVariants:p,synonymVariants:c}=t;if(n){if(!e.hasExactBer)return 0;let o=0;return(e.titleTokenSet.has("ber")||e.slugTokenSet.has("ber"))&&(o+=220),(e.aliasTokenSet.has("ber")||e.tagTokenSet.has("ber"))&&(o+=140),e.leadTokenSet.has("ber")&&(o+=45),(e.titleStemSet.has("airport")||e.slugStemSet.has("airport")||e.tagStemSet.has("airport"))&&(o+=95),o}let l=0;for(let o of p){if(o==="ber")continue;let h=0;(e.titleTokenSet.has(o)||e.titleStemSet.has(o))&&(h+=180),(e.slugTokenSet.has(o)||e.slugStemSet.has(o))&&(h+=130),(e.aliasTokenSet.has(o)||e.aliasStemSet.has(o))&&(h+=120),(e.tagTokenSet.has(o)||e.tagStemSet.has(o))&&(h+=105),(e.leadTokenSet.has(o)||e.leadStemSet.has(o))&&(h+=28),h>l&&(l=h)}if(l===0&&a.length>=4&&!G.has(a)){for(let o of e.titleTokens)o!=="berlin"&&o!=="berliner"&&o.startsWith(a)&&(l=Math.max(l,110));for(let o of e.tagTokenSet)o!=="berlin"&&o!=="berliner"&&o.startsWith(a)&&(l=Math.max(l,75));for(let o of e.aliasTokenSet)o!=="berlin"&&o!=="berliner"&&o.startsWith(a)&&(l=Math.max(l,80))}if(c.length>0){let o=0;for(let h of c){if(h==="ber"){if(e.hasExactBer){let F=0;(e.titleTokenSet.has("ber")||e.slugTokenSet.has("ber"))&&(F+=170),(e.aliasTokenSet.has("ber")||e.tagTokenSet.has("ber"))&&(F+=125),e.leadTokenSet.has("ber")&&(F+=35),o=Math.max(o,F)}continue}let m=0;(e.titleTokenSet.has(h)||e.titleStemSet.has(h))&&(m+=145),(e.slugTokenSet.has(h)||e.slugStemSet.has(h))&&(m+=110),(e.aliasTokenSet.has(h)||e.aliasStemSet.has(h))&&(m+=100),(e.tagTokenSet.has(h)||e.tagStemSet.has(h))&&(m+=85),(e.leadTokenSet.has(h)||e.leadStemSet.has(h))&&(m+=20),m>o&&(o=m)}o>l&&(l=o)}if(l===0&&r&&t.typoCandidates&&t.typoCandidates.length>0)for(let o of t.typoCandidates){let h=i(o),m=0;(e.titleTokenSet.has(o)||e.titleStemSet.has(h))&&(m+=70),(e.slugTokenSet.has(o)||e.slugStemSet.has(h))&&(m+=55),(e.aliasTokenSet.has(o)||e.aliasStemSet.has(h))&&(m+=50),(e.tagTokenSet.has(o)||e.tagStemSet.has(h))&&(m+=45),m>l&&(l=m)}return l}function ie(e,t,r=!1){if(!t)return 1;let a=e._idx;if(t.activeTokens.length===1&&(t.activeTokens[0]==="berlin"||t.activeTokens[0]==="berliner"))return a.allTokens.has("berlin")||a.allTokens.has("berliner")?10:0;let n=0;for(let l of t.tokenGroups){let o=ge(a,l,r);if(o<=0)return 0;n+=o}let p=t.normQuery,c=t.activeTokens.join(" ");if(a.titleNorm===p||a.slugNorm===p?n+=500:(a.titleNorm.startsWith(`${p} `)||a.titleNorm.endsWith(` ${p}`))&&(n+=260),c.length>=4&&c!=="ber"&&(a.titleNorm.includes(c)&&(n+=220),a.slugNorm.includes(c)&&(n+=180),a.aliasesNorm.some(l=>l===c||l===p||i(l)===c)?n+=280:a.aliasesNorm.some(l=>l.includes(c)||l.includes(p))&&(n+=160),a.tagsNorm.some(l=>l===c||l===p||i(l)===c)&&(n+=190)),t.rawTokens.length>=2){let l=0;for(let o of t.rawTokens){let h=i(o);(a.titleTokenSet.has(o)||a.titleStemSet.has(h)||a.slugTokenSet.has(o)||a.slugStemSet.has(h))&&(l+=1)}l>=2&&(n+=l*85)}for(let l of t.tokenGroups){let o=new Set([l.rawToken,l.stem,...r?l.typoCandidates||[]:[]]);for(let h of o){let m=Y[h];m&&m[e.slug]&&(n+=m[e.slug])}}return H.includes(e.slug)&&n>=180&&(n+=35),n}let N=new Map;function me(e){let t=s(e);if(N.has(t))return N.get(t);let r=be(e);if(!r)return{list:T,usedTypoFallback:!1};let a=[];for(let c of T){let l=ie(c,r,!1);l>0&&a.push({tool:c,score:l})}let n=!1;if(a.length===0&&r.tokenGroups.some(c=>c.typoCandidates&&c.typoCandidates.length>0)){for(let c of T){let l=ie(c,r,!0);l>0&&a.push({tool:c,score:l})}n=a.length>0}a.sort((c,l)=>l.score!==c.score?l.score-c.score:c.tool.title.localeCompare(l.tool.title,"en",{sensitivity:"base"})||c.tool.slug.localeCompare(l.tool.slug));let p={list:a.map(c=>c.tool),usedTypoFallback:n};return N.size>=32&&N.delete(N.keys().next().value),N.set(t,p),p}function q(e="",t="",r=""){let a=me(e);return{...a,list:a.list.filter(n=>(!t||(n.hubCategory||n.category)===t)&&(!r||n.type===r))}}function fe(e){if(!e)return"";let t=String(e).trim(),r=B.find(p=>p.key===t);if(r)return r.key;let a=t.toLowerCase(),n=B.find(p=>p.key.toLowerCase()===a||(E[p.key]||"").toLowerCase()===a||(O[p.key]||"").toLowerCase()===a);return n?n.key:""}function ye(e){if(!e)return"";let t=String(e).trim();if(M.includes(t))return t;let r=t.toLowerCase();return M.find(a=>a.toLowerCase()===r)||""}function we(e=""){let t=e instanceof URLSearchParams?e:new URLSearchParams(String(e).replace(/^\?/,"")),r=(t.get("q")||"").trim().slice(0,150),a=fe(t.get("category")),n=ye(t.get("type")),p=[];for(let[v,R]of t.entries())K.has(v)||p.push([v,R]);let{list:c,usedTypoFallback:l}=q(r,a,n),o=Math.max(1,Math.ceil(c.length/k)),h=Math.min(o,Math.max(1,Number.parseInt(t.get("page"),10)||1)),m=c.slice((h-1)*k,h*k),F=!r&&!a&&!n&&h===1,X=r?"Sorted by relevance":"Sorted A\u2013Z",_=q(r,a,"").list,ee=_.length,j=M.map(v=>({type:v,count:_.filter(R=>R.type===v).length,active:n===v})),te=q(r,"",n).list.length,I=Object.fromEntries(B.map(v=>[v.key,q(r,v.key,n).list.length])),W=null;if(c.length===0){let v=[];a&&v.push(E[a]||a),n&&v.push(n);let R=v.join(" \xB7 ")||"selected filters";if(r&&(a||n)){let D=q(r,"","").list.length;D>0&&(W={kind:"scoped-search",scopeLabel:R,globalMatches:D})}if(!W&&!r&&(a||n)){let D=a?q("",a,"").list.length:T.length,re=n?q("","",n).list.length:T.length;W={kind:"filter-combination",scopeLabel:R,categoryLabel:a?E[a]:"All tools",typeLabel:n,categoryOnlyCount:D,typeOnlyCount:re}}W||(W={kind:"global-search"})}return{q:r,category:a,type:n,extraParams:p,list:c,pages:o,page:h,items:m,showFeatured:F,sortLabel:X,usedTypoFallback:l,allTypesCount:ee,typeOptions:j,allCategoriesCount:te,categoryCounts:I,emptyState:W}}function w(e={},t={}){let r={...e,...t},a=new URLSearchParams;for(let p of["q","category","type"])r[p]&&a.set(p,r[p]);r.page>1&&a.set("page",String(r.page));let n=Array.isArray(r.extraParams)?r.extraParams:[];for(let[p,c]of n)K.has(p)||a.append(p,c);return"/berlin-tools"+(a.size?`?${a}`:"")}let b=e=>String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),$=e=>`<img class="ui-icon" src="${x}ui/${e}.svg" alt="" width="20" height="20">`;function oe(e,t,r=""){let a=e.href||`https://walkofberlin.com/tools/${e.slug}`;a=a.replace("https://www.berlinwalk.com","https://walkofberlin.com").replace("https://www.walkofberlin.com","https://walkofberlin.com");let n=e.shortLead||y[e.slug]||e.lead;return`<li class="tool-item ${r}"><a class="tool-row" href="${b(a)}" aria-label="${b(e.title)}" data-slug="${b(e.slug)}"><img class="tool-icon" src="${b(S(e.image))}" alt="" width="40" height="40" loading="${t<3?"eager":"lazy"}"><div class="row-copy"><div class="row-heading"><h3>${b(e.title)}</h3></div><p><strong class="type-prefix">${b(e.type||"Tool")}</strong><span class="type-sep" aria-hidden="true"> \xB7 </span>${b(n)}</p></div>${$("arrow-up-right")}</a></li>`}function Q(e,t=!1){return`<section class="suggestions ${t?"recovery":""}" aria-labelledby="suggestions-title"><h2 id="suggestions-title">${t?"Try one of these":"Start with these"}</h2><p class="section-intro">Useful tools for common Berlin questions.</p><ul class="tool-list">${e.map((r,a)=>oe(r,a,!t&&a>2?"extra-suggestion":"")).join("")}</ul>${t?"":'<button type="button" class="suggestion-toggle" aria-expanded="false">Show 3 more</button>'}</section>`}function ke(e){if(e.pages===1)return"";let t=[...new Set([1,e.page-1,e.page,e.page+1,e.pages])].filter(r=>r>0&&r<=e.pages).sort((r,a)=>r-a);return`<nav class="pagination" aria-label="Catalog pages"><span class="page-range">Showing ${(e.page-1)*k+1}\u2013${Math.min(e.page*k,e.list.length)} of ${e.list.length}</span><div class="page-controls">${e.page>1?`<a data-state href="${w(e,{page:e.page-1})}" rel="prev" aria-label="Previous page">${$("arrow-left")}<span>Previous</span></a>`:""}<span class="mobile-page">Page ${e.page} of ${e.pages}</span><span class="page-numbers">${t.map((r,a)=>(a&&r-t[a-1]>1?'<span class="ellipsis">\u2026</span>':"")+`<a data-state href="${w(e,{page:r})}" ${r===e.page?'aria-current="page"':""} aria-label="Page ${r}">${r}</a>`).join("")}</span>${e.page<e.pages?`<a data-state href="${w(e,{page:e.page+1})}" rel="next" aria-label="Next page"><span>Next</span>${$("arrow-right")}</a>`:""}</div></nav>`}function ve(e){let t=e.category?E[e.category]:"";if(e.q){let a=[t,e.type].filter(Boolean).join(" \xB7 ");return a?`Search results in ${a}`:"Search results"}let r=t||"All tools";return e.type?`${r} \xB7 ${e.type}`:r}function xe(e){let t=e.emptyState||{kind:"global-search"};if(t.kind==="scoped-search"){let r=t.globalMatches===1?"result":"results";return`<div class="empty" data-empty-kind="scoped-search"><h3>No results in ${b(t.scopeLabel)}.</h3><p>Your search matched ${t.globalMatches} ${r} outside this filter.</p><div class="empty-actions"><a data-state class="empty-btn empty-btn-primary" href="${w(e,{category:"",type:"",page:1})}">See ${t.globalMatches} ${r} in all tools</a><a data-state class="empty-btn" href="${w(e,{q:"",page:1})}">Clear search</a></div></div>${Q(A.slice(0,3),!0)}`}if(t.kind==="filter-combination"){let r=(t.typeLabel||"selected").toLowerCase();return`<div class="empty" data-empty-kind="filter-combination"><h3>No ${b(r)} tools in ${b(t.categoryLabel)}.</h3><p>There are ${t.categoryOnlyCount} tools in ${b(t.categoryLabel)} and ${t.typeOnlyCount} ${b(r)} ${t.typeOnlyCount===1?"tool":"tools"} across all categories.</p><div class="empty-actions">${e.category?`<a data-state class="empty-btn empty-btn-primary" href="${w(e,{type:"",page:1})}">Show all ${t.categoryOnlyCount} in ${b(t.categoryLabel)}</a>`:""}${e.type?`<a data-state class="empty-btn" href="${w(e,{category:"",page:1})}">Show all ${t.typeOnlyCount} ${b(t.typeLabel)} tools</a>`:""}</div></div>${Q(A.slice(0,3),!0)}`}return`<div class="empty" data-empty-kind="global-search"><h3>No tools found.</h3><p>Try a landmark, station, neighborhood, or practical topic such as tickets, museum, BER airport, Sunday, or luggage.</p><div class="empty-actions"><a data-state class="empty-btn empty-btn-primary" href="${w(e,{q:"",category:"",type:"",page:1})}">Clear search</a></div></div>${Q(A.slice(0,3),!0)}`}function Be(e){return`<noscript><nav class="type-fallback" aria-label="Filter by tool type">${[{type:"",count:e.allTypesCount},...e.typeOptions].map(r=>`<a href="${b(w(e,{type:r.type,page:1}))}" ${e.type===r.type?'aria-current="true"':""}>${b(r.type||"All types")} (${r.count})</a>`).join("")}</nav></noscript>`}function Se(e){let t=ve(e);return`<div class="heading-band"><div><p class="eyebrow">MAPS, CALCULATORS & LOCAL GUIDES</p><h1>Berlin Tools</h1><p class="total">${T.length} free tools for Berlin</p></div><form id="search-form" class="search-form" action="/berlin-tools" method="get" role="search"><label class="sr-only" for="search">Search Berlin tools</label>${$("search")}<input id="search" type="search" name="q" value="${b(e.q)}" placeholder="Search tickets, what's open, museum, BER, rain\u2026" autocomplete="off">${e.category?`<input type="hidden" name="category" value="${b(e.category)}">`:""}${e.type?`<input type="hidden" name="type" value="${b(e.type)}">`:""}${e.extraParams.map(([r,a])=>`<input type="hidden" name="${b(r)}" value="${b(a)}">`).join("")}${e.q?`<a data-state class="search-clear" href="${w(e,{q:"",page:1})}" aria-label="Clear search">${$("x")}</a>`:""}<button type="submit" aria-label="Search">${$("arrow-right")}</button></form></div><div class="catalog-layout"><aside class="sidebar"><nav aria-label="Tool categories" class="category-nav" data-category-nav><h2>Browse by topic</h2><a data-state data-category-key="" href="${w(e,{category:"",page:1})}" ${e.category?"":'aria-current="true"'}><span class="cat-label-desktop">All tools</span><span class="cat-label-mobile">All tools</span><span class="cat-count">${e.allCategoriesCount}</span></a>${B.map(r=>`<a data-state data-category-key="${b(r.key)}" href="${w(e,{category:r.key,page:1})}" ${e.category===r.key?'aria-current="true"':""}><span class="cat-label-desktop">${b(E[r.key])}</span><span class="cat-label-mobile">${b(O[r.key])}</span><span class="cat-count">${e.categoryCounts[r.key]??0}</span></a>`).join("")}</nav></aside><div class="content">${e.showFeatured?Q(A):""}<section class="results" aria-labelledby="results-title"><div class="results-heading"><div><h2 id="results-title" tabindex="-1">${b(t)}</h2><p class="result-meta" role="status">${e.list.length} ${e.list.length===1?"tool":"tools"} <span>${b(e.sortLabel)}</span></p></div><div class="type-filter" data-type-filter><button type="button" class="type-trigger${e.type?" is-filtered":""}" aria-haspopup="menu" aria-expanded="false" aria-controls="type-popover" data-type-trigger>${$("sliders-horizontal")}<span>Type: <strong>${b(e.type||"All")}</strong></span></button><div class="type-popover" id="type-popover" role="menu" aria-label="Filter by tool type" hidden data-type-popover><div class="type-popover-head" role="presentation"><span>Tool type</span></div><div class="type-options-list" role="none"><a data-state data-type-option role="menuitemradio" tabindex="-1" aria-checked="${e.type?"false":"true"}" class="type-option ${e.type?"":"is-active"}" href="${w(e,{type:"",page:1})}"><span>All types</span><span class="type-count">${e.allTypesCount}</span></a>${e.typeOptions.map(r=>`<a data-state data-type-option role="menuitemradio" tabindex="-1" aria-checked="${r.active?"true":"false"}" class="type-option ${r.active?"is-active":""}" href="${w(e,{type:r.type,page:1})}"><span>${b(r.type)}</span><span class="type-count">${r.count}</span></a>`).join("")}</div></div></div></div>${Be(e)}${e.q||e.category||e.type?`<div class="active-filters">${e.category?`<a data-state href="${w(e,{category:"",page:1})}">Category: ${b(O[e.category]||e.category)}${$("x")}</a>`:""}${e.type?`<a data-state href="${w(e,{type:"",page:1})}">Type: ${b(e.type)}${$("x")}</a>`:""}${e.q?`<a data-state href="${w(e,{q:"",page:1})}">Clear search${$("x")}</a>`:""}${e.category&&e.type||e.q&&(e.category||e.type)?`<a data-state href="${w(e,{q:"",category:"",type:"",page:1})}">Reset all${$("x")}</a>`:""}</div>`:""}${e.items.length?`<ul class="tool-list catalog-list">${e.items.map((r,a)=>oe(r,a)).join("")}</ul>${ke(e)}`:xe(e)}</section></div></div>`}return{PAGE_SIZE:k,categories:B,shortLabels:E,mobileLabels:O,tools:T,types:M,featured:A,normalizeText:s,stemToken:i,tokenize:u,searchAndRank:q,state:we,href:w,esc:b,render:Se}}function ce(d,y,x){let S=new AbortController,k=(s,i)=>document.addEventListener(s,i,{signal:S.signal}),B=(s,i)=>window.addEventListener(s,i,{signal:S.signal}),{state:E,render:O,href:K}=y,U=E(location.search);function G(s=null){let i=d.querySelector("[data-category-nav]");if(!i||(typeof s=="number"&&s>0&&(i.scrollLeft=s),i.scrollWidth<=i.clientWidth+2))return;let u=i.querySelector('a[aria-current="true"]');if(!u)return;let g=i.getBoundingClientRect(),f=u.getBoundingClientRect(),C=16;f.left<g.left+C?i.scrollLeft-=g.left+C-f.left:f.right>g.right-C&&(i.scrollLeft+=f.right-(g.right-C))}function P(s=!1){let i=d.querySelector("[data-type-filter]");if(!i)return;let u=i.querySelector("[data-type-trigger]"),g=i.querySelector("[data-type-popover]");!u||!g||g.hidden||(g.hidden=!0,u.setAttribute("aria-expanded","false"),i.classList.remove("is-open"),s&&u.focus({preventScroll:!0}))}function Y(s=!1){let i=d.querySelector("[data-type-filter]");if(!i)return;let u=i.querySelector("[data-type-trigger]"),g=i.querySelector("[data-type-popover]");if(!u||!g)return;g.hidden=!1,u.setAttribute("aria-expanded","true"),i.classList.add("is-open");let f=u.getBoundingClientRect(),C=window.visualViewport,L=C?.offsetTop||0,M=L+(C?.height||window.innerHeight)-f.bottom-12,H=f.top-L-12,A=M<Math.min(g.scrollHeight,280)&&H>M;i.classList.toggle("opens-up",A),g.style.maxHeight=`${Math.max(44,(A?H:M)-6)}px`,s&&(g.querySelector("[data-type-option].is-active")||g.querySelector("[data-type-option]"))?.focus({preventScroll:!0})}function V(s,{focus:i=!0,push:u=!0,focusTypeTrigger:g=!1}={}){let f=d.querySelector("[data-category-nav]"),C=f?f.scrollLeft:null;if(document.documentElement.classList.remove("search-focused"),u&&s!==location.pathname+location.search&&history.pushState({},"",s),U=E(location.search),d.innerHTML=O(U),J(),G(C),x?.(U),g)d.querySelector("[data-type-trigger]")?.focus({preventScroll:!0});else if(i){let L=d.querySelector("#results-title");L&&(L.focus({preventScroll:!0}),L.scrollIntoView({block:"start",behavior:"instant"}))}}function J(){d.querySelectorAll("[data-state]").forEach(s=>s.addEventListener("click",i=>{if(i.metaKey||i.ctrlKey||i.shiftKey||i.altKey||i.button!==0)return;i.preventDefault();let u=s.hasAttribute("data-type-option");V(s.getAttribute("href"),{focus:!u,push:!0,focusTypeTrigger:u})})),d.querySelector("[data-type-trigger]")?.addEventListener("click",s=>{s.preventDefault();let i=d.querySelector("[data-type-popover]");i&&i.hidden?Y(!0):P(!1)}),d.querySelector("#search-form")?.addEventListener("submit",s=>{s.preventDefault();let i=new FormData(s.currentTarget).get("q");V(K(U,{q:String(i||"").trim(),page:1}),{focus:!0,push:!0})}),d.querySelector(".suggestion-toggle")?.addEventListener("click",s=>{let i=s.currentTarget.getAttribute("aria-expanded")!=="true";s.currentTarget.setAttribute("aria-expanded",String(i)),s.currentTarget.textContent=i?"Show less":"Show 3 more",d.querySelector(".suggestions")?.classList.toggle("expanded",i)}),d.querySelector("#search")?.addEventListener("focus",()=>{matchMedia("(max-width: 700px)").matches&&(document.documentElement.classList.add("search-focused"),requestAnimationFrame(()=>d.querySelector("#search-form")?.scrollIntoView({block:"start",behavior:"instant"})))}),d.querySelector("#search")?.addEventListener("blur",()=>{document.documentElement.classList.remove("search-focused")})}return k("click",s=>{d.querySelector("[data-type-popover]:not([hidden])")&&!s.target.closest("[data-type-filter]")&&P(!1)}),k("focusin",s=>{s.target.closest("[data-type-filter]")||P(!1)}),k("keydown",s=>{let i=d.querySelector("[data-type-popover]:not([hidden])");if(!i){s.target.closest?.("[data-type-trigger]")&&(s.key==="ArrowDown"||s.key==="ArrowUp")&&(s.preventDefault(),Y(!0));return}if(!s.target.closest("[data-type-filter]")){P(!1);return}if(s.key==="Tab"){P(!0);return}if(s.key==="Escape"){s.preventDefault(),P(!0);return}if(["ArrowDown","ArrowUp","Home","End"].includes(s.key)){let u=[...i.querySelectorAll("[data-type-option]")];if(!u.length)return;s.preventDefault();let g=u.indexOf(document.activeElement),f=0;s.key==="Home"?f=0:s.key==="End"?f=u.length-1:s.key==="ArrowDown"?f=g>=0?(g+1)%u.length:0:s.key==="ArrowUp"&&(f=g>0?g-1:u.length-1),u[f]?.focus({preventScroll:!0})}}),d.querySelector("h1")||(d.innerHTML=O(U)),J(),G(),B("popstate",()=>{V(location.pathname+location.search,{focus:!1,push:!1})}),()=>{S.abort(),document.documentElement.classList.remove("search-focused")}}var pe={"berlin-sick-pay-clock":"See how Germany\u2019s 42-day sick-pay clock works.","berlin-german-course-ladder":"Compare Berlin German course paths and BAMF rules.","berlin-mushroom-forest-finder":"Compare ten mushroom forests on a VBB ticket.","berlin-crosswalk-standoff":"Test your street-crossing instincts at four corners.","hidden-berlin-photo-missions":"Follow a 10-card photo hunt across central Berlin.","spati-survival-checker":"Check if a Berlin Sp\xE4ti solves your late errand.","pharmacy-in-berlin-helper":"See if you need an Apotheke, night pharmacy, or 112.","vegan-berlin-locations-map":"Find vegan spots near your hotel on a Berlin map.","vegan-berlin-map":"Browse Berlin plant-based restaurants, cafes, and sweets.","watch-world-cup-2026-berlin":"Find Berlin screens and bars for the 2026 World Cup.","world-cup-2026-fixtures-berlin-time":"See every 2026 World Cup match in Berlin time.","basketball-worldcup-fixtures":"Check Berlin group-stage Basketball World Cup times.","basketball-worldcup-venues-map":"Map the two Berlin arenas, stations, and Wall sites.","berlin-pride-week-timeline":"Follow a day-by-day Berlin Pride and CSD timeline.","berlin-pride-parade-map":"Trace the Berlin Pride CSD parade route on July 25.","welcomecard-calculator":"Check if the Berlin WelcomeCard pays off for your stay.","transport-ticket-calculator":"Compare Berlin transit tickets, passes, and group fares.","berlin-deutschlandticket-checker":"See if the 63 EUR Deutschlandticket fits your trip.","berlin-zone-ticket-decoder":"Check whether Berlin AB or ABC covers your stops.","berlin-transport-backup-planner":"Get a backup move when a Berlin transit line fails.","berlin-public-transport-ferry-picker":"Choose the right BVG ferry route on a normal ticket.","berlin-bike-lane-reflex-checker":"Practice street reflexes around Berlin bike lanes.","berlin-daily-budget":"Estimate what a day in Berlin costs for your style.","berlin-tip-calculator":"Calculate normal Berlin tips for cafes, taxis, and tours.","best-month-to-visit-berlin":"Find the best month for your Berlin trip and pace.","berlin-weather-by-month":"See monthly Berlin temperatures, rain, and daylight.","what-to-pack-berlin":"Build a season-specific Berlin packing checklist.","berlin-daylight-hours":"Check sunrise, sunset, and daylight hours by month.","berlin-sunset-planner":"Check Berlin sunset times and free viewing spots.","compare-berlin-months":"Compare any two Berlin travel months side by side.","berlin-drinking-water":"Find the nearest free drinking fountain in Berlin.","berlin-public-toilets":"Find the nearest official public toilet in Berlin.","berlin-luggage-storage":"Find luggage lockers and bag drop spots in Berlin.","berlin-currywurst-finder":"Find the right Berlin currywurst stand by area.","berlin-sunday-shopping":"Find Sunday-open station supermarkets and Sp\xE4tis.","berlin-shopping-areas":"Compare Berlin areas for vintage, fashion, and markets.","berlin-landmarks-map":"Browse central Berlin landmarks with nearest stations.","unter-den-linden-walk-planner":"Build a practical Unter den Linden walking route.","medieval-berlin-mini-walk":"Trace medieval Berlin and C\xF6lln around Nikolaiviertel.","east-side-gallery-murals":"Explore the 12 best-known East Side Gallery murals.","berlin-day-trips-finder":"Pick the right day trip from Berlin by train time.","potsdam-day-trip-planner":"Plan a realistic Potsdam day trip from Berlin.","leipzig-day-trip-planner":"Compare ICE and regional routes for a Leipzig day trip.","tropical-islands-cost-planner":"Estimate Tropical Islands tickets and train costs.","technikmuseum-train-builder":"Build a focused route through the Technikmuseum.","karl-marx-allee-spotter":"Decode Karl-Marx-Allee architecture on street photos.","gemaldegalerie-highlights-walk":"Follow a focused route through the Gem\xE4ldegalerie.","whats-open-in-berlin-today":"Check today\u2019s Berlin holiday status and what is open.","ultimate-berlin-trip-planner":"Build a 1 to 7 day Berlin itinerary for your dates.","berlin-dates-check":"Check closures, booking windows, and daylight by date.","berlin-first-day-planner":"Build a realistic arrival-day Berlin plan by landing time.","berlin-hotel-location-checker":"Check how a Berlin hotel area fits transit and sights.","hackescher-after-tour-planner":"Pick what to do near Hackescher Markt after your tour.","free-berlin-audio-tour":"Take a 9-minute audio walk from Alex to Hackescher Markt.","berlin-free-things-to-do":"Find free sights, memorials, and walks in Berlin.","berlin-safety":"Check neighborhood safety notes and emergency numbers.","berlin-lakes":"Compare Berlin swimming lakes by transit and water.","berlin-pools":"Find the right Berlin indoor, outdoor, or lap pool.","east-or-west-1989":"See which side of the Wall any Berlin landmark stood on.","berlin-address-time-machine":"Check if any Berlin address stood in East or West in 1989.","berlin-3-day-itinerary":"Follow a neighborhood 3-day Berlin plan by a local guide.","alex-mistakes":"Avoid common tourist traps around Alexanderplatz.","alexanderplatz-parking-map":"Find garages and Park + Ride near Alexanderplatz.","berlin-parking-calculator":"Compare central garage rates with Park + Ride costs.","berlin-umweltzone-sticker-checker":"Check if your car needs a green emissions sticker.","berlin-connectivity-picker":"Compare eSIM, prepaid SIM, and free WiFi in Berlin.","berlin-club-picker":"Match your music taste and group to a Berlin club.","berlin-wall-remnants":"Find 8 original Berlin Wall sites with transit stops.","german-phrases-quiz":"Practice 10 everyday German phrases for Berlin.","are-you-ready-for-berlin-quiz":"Test your Berlin readiness in 10 quick questions.","berlin-beer-gardens-map":"Compare 12 Berlin beer gardens by shade and station.","christmas-markets-map":"Compare 15 Berlin Christmas markets by vibe and dates.","berlin-boat-tour-finder":"Match your day with the right Spree or canal cruise.","berlin-pfand-calculator":"Calculate your bottle deposit refund and return spot.","berlin-city-tax-calculator":"Estimate Berlin\u2019s 7.5% hotel and flat city tax.","berlin-tax-free-refund-calculator":"Estimate VAT refunds and check airport customs steps.","berlin-taxi-uber-cost-checker":"Compare Berlin taxi fares with Uber and transit.","berlin-ride-reckoner":"Compare Uber, Bolt, FreeNow taxis, and night transit.","berlin-public-holiday-checker":"Check if your dates hit a 2026 Berlin public holiday.","berlin-station-arrival-planner":"Get a clear first move at your Berlin arrival station.","berlin-family-day-planner":"Build a kid-friendly Berlin day by age and weather.","berlin-monday-plan-checker":"Build a Berlin Monday plan around closed museums.","berlin-mobility-app-picker":"Compare BVG, Jelbi, bikes, scooters, and car sharing.","berlin-night-transport-checker":"See which Berlin trains and night buses run late.","berlin-ber-airport-departure-planner":"Plan when to leave Berlin for your flight at BER.","berlin-flea-market-picker":"Choose the right Sunday flea market for your mood.","mauerpark-sunday-timeline":"Plan your Mauerpark Sunday market and karaoke timing.","charlottenburg-palace-visit-planner":"Plan Charlottenburg Palace rooms and free gardens.","traenenpalast-visit-planner":"Plan a free visit to the Tr\xE4nenpalast exhibition.","sachsenhausen-visit-planner":"Plan the train, ABC ticket, and time for Sachsenhausen.","topography-of-terror-visit-planner":"Plan your time at Topography of Terror and nearby stops.","berlin-lost-item-router":"Find the lost-property office for BVG, S-Bahn, or BER.","berlin-medical-help-router":"Find the right Berlin medical contact for your need.","berlin-street-sense-drill":"Practice calm first moves for Berlin street situations.","berlin-breakfast-clock":"Match your morning hour with bakeries, cafes, or brunch.","maybachufer-market-clock":"See what the Maybachufer market feels like by hour.","berlin-sign-decoder":"Decode German words on Berlin signs and ticket machines.","berlin-booking-deadline-planner":"See which Berlin sights need advance reservations.","berlin-museums-map":"Compare Berlin museums by open days, cost, and station.","hohenzollern-berlin-footprint-map":"Trace Prussian royal sights from Mitte to City West.","berlin-plug-adapter-checker":"Check if your chargers need a Type F plug adapter.","potsdamer-platz-time-layer-walk":"Choose a 20, 45, or 75 minute Potsdamer Platz walk.","tempelhof-field-planner":"Plan Tempelhofer Feld by gate, time, and weather.","berlin-step-free-planner":"Plan step-free Berlin routes for strollers or mobility.","victory-column-climb-planner":"Decide if climbing the 285 Victory Column steps fits.","berlin-restaurant-phrase-card":"Get German phrases for cafes, bakeries, and bills.","berlin-last-day-buffer-planner":"Plan what fits safely before your Berlin departure.","berlin-museum-bag-planner":"Check whether your bag needs a museum cloakroom.","bebelplatz-memory-lens":"Plan a focused stop at Bebelplatz and its memorial.","berlin-atm-fee-checker":"Find bank ATMs in Berlin and avoid high-fee machines.","holocaust-memorial-visit-planner":"Plan a respectful visit to the Holocaust Memorial.","berlin-train-station-first-move":"Get your first move when stepping off a Berlin train.","berlin-check-in-gap-planner":"Use the hours before check-in without dragging bags.","berliner-dom-visit-planner":"Plan tickets, the dome climb, and Berlin Cathedral.","berlin-ticket-fine-step-planner":"See what to do after a 60 EUR Berlin fare check.","berlin-e-scooter-rule-checker":"Check Berlin e-scooter rules, limits, and fines.","berlin-bike-rental-finder":"Compare nextbike, app bikes, and day-shop rentals.","ddr-museum-crowd-planner":"Pick the calmest window to visit the DDR Museum.","berlin-room-heat-check":"Check summer room heat and how to cool a Berlin flat.","jewish-museum-visit-sequence":"Follow a time-based route through the Jewish Museum.","memorial-church-visit-planner":"Check visiting hours for Memorial Church in City West.","berlin-rail-decoder":"Type any Berlin line like U8, S41, or FEX to decode it.","markthalle-neun-week-planner":"Check what runs at Markthalle Neun on each weekday.","berlin-money-exchange-reality-check":"Compare exchange booths, ATMs, and card pay in Berlin.","berlin-street-art-worth-the-trip":"Compare Berlin street art spots by travel time.","olympiastadion-visit-planner":"Check if the Olympiastadion is open or hosting an event.","berlin-viewpoint-finder":"Compare Berlin\u2019s five public viewpoints by price.","tiergarten-loop-planner":"Build a walking loop through Tiergarten by time.","teufelsberg-cross-section":"Explore the four historical layers of Teufelsberg.","berlin-name-pronouncer":"Hear simple pronunciations for Berlin station names.","berlin-layover-planner":"Calculate real city time left on your BER layover.","prenzlauer-berg-walk":"Follow a self-guided half-day Prenzlauer Berg walk.","berlin-phone-ticket-picker":"Find the exact Berlin ticket and fare in the BVG app.","berlin-train-announcements":"Decode German announcements on Berlin trains.","berlin-ringbahn":"Explore an interactive map of the S41 and S42 Ringbahn.","berlin-ticket-machine-simulator":"Practice buying tickets on a BVG machine simulator.","berlin-two-day-route-map":"Follow a two-day route linking Mitte, Wall, and Spree.","berlin-german-numbers":"Build German numbers from 0 to 100 and hear them.","berlin-natural-history-museum":"Plan a visit to the dinosaurs at Naturkundemuseum.","berlin-doner-order-builder":"Build your Berlin d\xF6ner order in clear German.","stasi-surveillance-scale":"See the documented scale of East Germany\u2019s Stasi.","treptower-memorial-walk":"Walk the Soviet War Memorial in Treptower Park.","friedrichshain-kiez-loop":"Plan a Friedrichshain walk around Boxhagener Platz.","neukolln-kiez-decoder":"Compare Neuk\xF6lln areas from Reuterkiez to Rixdorf.","one-day-berlin-planner":"Build an honest one-day Berlin route without rushing.","berlin-rooftop-bars":"Compare Berlin rooftop bars by sunset view and vibe.","mehringplatz-time-layer-viewer":"Compare four historical views of Mehringplatz.","berlin-hop-on-hop-off-decision":"Compare hop-on buses with Bus 100 and BVG transit.","how-many-days-in-berlin":"See how many Berlin days match your pace and plans.","halal-food-in-berlin":"Check practical tips and areas for halal food in Berlin.","berlin-entry-requirements":"Check passport and Schengen rules for a short stay.","berlin-airports":"See what BER, Tegel, Sch\xF6nefeld, and Tempelhof do now.","screen-mood-finder":"Match Berlin films and series to real city locations.","berlin-emergency-numbers":"Find the right Berlin emergency or urgent help number.","berlin-smoking-rules":"Check cigarette, vape, and cannabis rules in Berlin.","do-you-need-a-car-in-berlin":"Check if your Berlin plan is better by train or car.","is-berlin-walkable":"See which Berlin corridors work on foot vs transit.","berlin-ubahn-etiquette":"Learn unwritten Berlin U-Bahn and S-Bahn habits.","berlin-marathon-day":"Plan around Berlin Marathon Sunday closures and trains.","berlin-ghost-stations":"Trace the 16 Berlin ghost stations sealed by the Wall.","kurfurstendamm-walk":"Walk Kurf\xFCrstendamm from Wittenbergplatz to Uhlandstra\xDFe.","berlin-beer-season-calendar":"See which 2026 Berlin beer festivals fit your dates.","berliner-unterwelten-tour-board":"Compare Berliner Unterwelten bunker tours by topic.","spreewald-reach-map":"Compare L\xFCbbenau and L\xFCbben for a Spreewald day trip.","schoneberg-plaque-check":"Find Sch\xF6neberg house plaques for Bowie and Einstein.","dresden-day-clock":"Plan your Berlin-to-Dresden train and old-town walk.","stolperstein-reader":"Translate the inscriptions on Berlin\u2019s Stolpersteine.","berlin-matchday-board":"Compare ticket access for Hertha BSC and Union Berlin.","wannsee-shore-planner":"Choose the right Wannsee stop for lakes or history.","berlin-wall-trail-sections":"Pick the best Berliner Mauerweg section to walk or bike.","berlin-train-gateways-2026":"Check how the 2026 Stadtbahn closure shifts stops.","spandau-old-town-loop":"Walk Spandau\u2019s old town and Citadel on one loop.","koepenick-waterside-route":"Follow a waterside walk through K\xF6penick\u2019s old town.","baltic-beach-day-planner":"Compare Warnem\xFCnde, Usedom, and Binz for a sea trip.","berlin-bakery-counter":"Practice ordering bread and coffee at a German bakery.","oberbaumbruecke-crossing":"Walk across the Oberbaumbr\xFCcke stop by stop.","hamburg-day-fit":"Check how an ICE day trip to Hamburg fits one day.","berlin-courtyard-walk":"Explore the historic courtyards around Hackesche H\xF6fe.","german-time-dial":"See why German times like halb acht mean 7:30.","reichstag-read-the-building":"Read five eras of history on the Reichstag facade.","brandenburg-gate-before-after":"Compare historical eras at the Brandenburg Gate.","berlin-club-night-clock":"See how Berlin club weekend timelines run until Monday.","berlin-sunday-planner":"Build a Berlin Sunday plan around markets and parks.","berlin-late-night-food":"Find reliable late-night food after kitchens close.","berlin-vietnamese-food-finder":"Find Berlin spots for pho, vegan bowls, or Dong Xuan.","berlin-pass-cost-comparison":"Compare WelcomeCard, CityTourCard, and Museum Pass.","tour-two-hours-scrub":"Explore the Walk of Berlin route, stop by stop.","museum-island-one-pick":"Choose the single Museum Island museum that fits best.","wall-site-one-hour":"Compare the top three Berlin Wall stops for one hour.","reichstag-slot-window":"Check when free Reichstag dome booking windows open.","lights-route-order":"Plan a 5 km evening walk for the Festival of Lights.","east-west-street-tells":"Spot the street clues that reveal East vs West Berlin.","death-strip-layers":"Explore the layers of the Berlin Wall border system.","tour-value-reality":"See the stops and format of the Berlin walking tour.","family-walk-fit":"Check whether the Berlin walking tour fits your family.","rave-the-planet-day-fit":"Plan your Rave the Planet Saturday around Tiergarten.","museum-night-route-shaper":"Shape a realistic route for Long Night of Museums.","musikfest-evening-shape":"Plan a Musikfest concert evening around Philharmonie.","ifa-after-show-evening":"Plan dinner and an evening after IFA at Messe Berlin.","ilb-day-shape":"Pair a Literature Festival reading with nearby walks.","berlin-art-week-route-builder":"Build a one-district walk for Berlin Art Week.","open-monument-day-shortlist":"Build a 2 or 3 stop Open Monument Day shortlist.","innotrans-three-evening-board":"Plan three balanced evenings after InnoTrans days.","dinner-neighbourhood-picker":"Pick a compact Berlin dinner area near your hotel.","berlin-museum-three-slot-builder":"Spread three Berlin museums across your trip cleanly.","berlin-tour-time-window":"Check which Walk of Berlin start time fits your day.","berlin-first-walk-lens":"Read three historical layers around Humboldt Forum.","berlin-day-duet":"Combine two travelers\u2019 top Berlin wishes into one day.","berlin-private-route-brief":"Preview the stops of a private Walk of Berlin tour.","berlin-solo-day-path":"Build a well-paced solo day in central Berlin.","berlin-walking-kit":"Check your walking forecast and what layers to wear.","berlin-memorial-reading-order":"Arrange four central Berlin memorials in calm order.","berlin-bauhaus-lineage-map":"Connect three key Bauhaus and modernist stops.","berlin-landmark-window":"Pick a focused two-hour East or West landmark loop.","berlin-weekend-first-night":"Plan a calm Friday arrival that keeps Saturday fresh.","berlin-pace-passport":"Shape a calmer historic-center day in three steps.","berlin-spy-museum-mission-match":"Compare the Spy Museum with real Cold War sites.","berlin-pink-pipe-decoder":"See why bright pink pipes cross Berlin streets.","berlin-meal-wallet":"Check whether Berlin food spots take cards or cash.","berlin-address-compass":"Check Berlin street names, numbers, and postcodes.","berlin-plant-passport":"Plan a greenhouse or outdoor Botanic Garden visit.","berlin-concrete-clue-chain":"Compare four examples of post-war concrete in Berlin.","berlin-opera-house-reader":"Compare Berlin\u2019s three opera houses by repertoire.","berlin-reading-stop-line":"Pair an English bookshop stop with a nearby caf\xE9.","berlin-live-music-week":"Find recurring live jazz, indie, and classical nights.","berlin-vintage-district-router":"Pick the best Berlin district for vintage shopping.","brandenburg-gate-food-escape":"Walk 10 minutes from Brandenburg Gate for better food.","berlin-cinema-listing-decoder":"Decode OmU, OV, OmeU, and DF on cinema listings.","berlin-attractions-worth-it-matcher":"Check if commercial Mitte attractions fit your group.","berlin-reserve-or-walk-in":"See when to book a Berlin restaurant vs walk in.","berlin-museum-ticket-desk":"Check if you qualify for reduced museum tickets.","berlin-station-exit-map":"Pick the right street exit at major Berlin stations.","berlin-autumn-film-language-board":"Compare six autumn Berlin film festivals by language.","tempelhof-kite-day-approach":"Choose the best gate for the Festival of Giant Kites.","uber-arena-night-cost-clock":"Plan transit, bag rules, and food at Uber Arena.","berlin-double-closure-weekend":"Plan around Olympic Park closures on Pyronale nights.","clubkultur-week-door-free-finder":"Find daytime panels and nights for Tag der Clubkultur.","food-week-can-i-actually-go":"Check which Berlin Food Week events are open to all.","jazzfest-room-comparator":"Compare Jazzfest Berlin venues and schedule windows.","science-week-three-day-window":"Filter Berlin Science Week events by topic and time.","november-nine-hour-line":"Follow the confirmed November 9 Wall anniversary stops.","christmas-garden-closed-night-calendar":"Check open nights for Christmas Garden in Dahlem.","berlin-christmas-window-overlap":"See which December winter shows overlap your stay.","berlin-evening-cascade":"See what stays open in central Berlin after 18:00.","third-reich-berlin-what-survives":"See which Third Reich sites in Berlin survive today.","berlin-ticket-doors":"See which sights need free slots vs paid tickets.","berlin-palace-day-balance":"Compare a Charlottenburg half-day with Potsdam.","berlin-real-or-rebuilt":"Scrub from 1900 to today to see what was rebuilt.","berlin-world-heritage-time-check":"Compare Berlin\u2019s three UNESCO sights by transit time.","berlin-cemetery-map":"Compare five historic Berlin cemeteries and graves.","berlin-early-hours-board":"See what opens in central Berlin between 06:00 and 10:00.","berlin-market-week":"See which Berlin street markets run on each weekday.","berlin-ubahn-design-board":"Explore 13 striking U-Bahn stations by travel time.","kitkat-week-board":"Compare KitKatClub nights by music and dress rules.","berlin-sauna-cost-curve":"Compare Vabali, Liquidrom, and Stadtbad Neuk\xF6lln.","tempelhofer-feld-gate-clock":"Check monthly closing times at Tempelhofer Feld.","berlin-football-screen-board":"Compare eight Berlin football bars by leagues shown.","berlin-delay-payback-board":"Check DB train delay refund rules out of Berlin.","berlin-twin-city-map":"See why division left Berlin with two of everything.","berlin-oldest-rooms-timeline":"Explore ten of Berlin\u2019s oldest taverns and restaurants.","berlin-new-year-midnight-planner":"Compare five realistic Berlin New Year\u2019s Eve plans.","berlin-last-entry-times":"Check real last-admission cutoffs at 13 Berlin sights.","berlin-water-access-map":"See where to rent kayaks, SUPs, or boats in Berlin.","berlin-bus-arrival-map":"See all nine Berlin coach stops and U-Bahn links.","berlin-unity-day-board":"See what closes in Berlin on 3 October Unity Day.","berlin-laundry-planner":"Compare self-service Waschsalons and drop-off laundry.","berlin-night-train-board":"Compare the six night train routes leaving Berlin.","berlin-cruise-day-window":"See how much Berlin time a Warnem\xFCnde cruise gives.","berlin-classical-ticket-ladder":"See nine ways into Berlin\u2019s classical concert halls.","berlin-english-stage-map":"Find nine Berlin stages with English-friendly shows.","berlin-run-loop-map":"Compare six Berlin running loops by distance and water.","szczecin-day-fit-map":"Check buses and trains for a Szczecin day trip.","berlin-day-trip-ticket-curves":"Compare individual fares with regional group tickets.","wittenberg-reformation-mile":"Walk Wittenberg\u2019s 1.9 km Reformation Mile from Berlin.","berlin-day-four-tradeoff":"Compare eight ways to spend a spare day in Berlin.","berlin-busy-week-calendar":"Check 2026 trade fairs and marathons raising hotel rates.","berlin-stay-cost-grid":"Compare Berlin hotel, flat, and hostel costs by group.","berlin-allergen-menu-matrix":"Decode the 14 German allergen codes on Berlin menus.","berlin-war-scars-map":"Find 17 Berlin buildings with visible WWII marks.","berlin-season-board":"See when Berlin ferries, fountains, and beer gardens run.","berlin-quiet-clock":"Check Berlin night quiet hours and Sunday noise laws.","berlin-prague-route-board":"Plan a Berlin-to-Prague rail trip with 2026 notes.","berlin-park-and-ride-map":"Compare Berlin\u2019s 49 free Park + Ride lots by line.","ber-flight-compensation-line":"Check EU261 delay compensation for BER flights.","hohenschonhausen-tour-reach":"Plan tram access and English tours at Hohensch\xF6nhausen.","berlin-second-city-board":"Compare German cities by direct ICE time from Berlin.","berlin-museum-closure-timeline":"See which Berlin museums are closed for renovation.","berlin-camera-kit-check":"Check tripod and camera rules at 14 Berlin sights.","berlin-club-door-map":"Map 12 Berlin clubs with night stations and door notes.","berlin-leave-year-planner":"Maximize your 2027 long weekends around holidays.","berlin-heating-log":"Log flat temperatures against legal Berlin minimums.","berlin-disposal-cost-ladder":"Compare BSR recycling yard limits and pickup fees.","berlin-bike-theft-clock":"See Berlin bike-theft patterns by district and hour.","berlin-nebenkosten-line-check":"Check which utility charges belong on a Berlin bill.","berlin-off-leash-map":"Find legal off-leash dog forests and runs in Berlin.","berlin-water-hardness-map":"Check official water hardness by Berlin postcode.","berlin-kleingarten-map":"Explore all 1,038 allotment colonies across Berlin.","berlin-library-hours-board":"See opening hours across 18 major Berlin libraries.","berlin-parking-zone-clock":"Check paid street-parking hours across 103 zones.","berlin-bathing-site-small-print":"Compare all 39 official Berlin bathing spots.","berlin-green-path-stages":"Break Berlin\u2019s 20 green walks into station stages.","berlin-rent-increase-limits":"Check the four legal caps on a Berlin rent increase.","berlin-rundfunkbeitrag-check":"See how Germany\u2019s 18.36 EUR flat broadcast fee works.","berlin-krankenkasse-cost-spread":"Compare statutory health insurance rates in Berlin.","berlin-balcony-solar-year":"Estimate yearly savings from an 800W balcony solar kit.","berlin-wbs-income-ladder":"Check if your income qualifies for a Berlin WBS.","berlin-ballot-board":"See the five ballots in the 2026 Berlin election.","berlin-referral-route-board":"Compare five ways to book a specialist in Berlin.","berlin-tyre-swap-window":"See when Berlin road temperatures need winter tyres.","berlin-notice-deadline":"Calculate the legal move-out date on a Berlin lease.","berlin-kita-call-list":"Find Kitas within walking distance of your street.","berlin-moving-permit-planner":"Check deadlines for a moving-van parking zone.","berlin-pavement-duty-map":"Check winter snow and ice rules on Berlin pavements.","berlin-airing-hours":"See how long to air a Berlin flat in each season.","berlin-school-catchment-map":"Check primary-school boundaries across 394 zones.","berlin-monthly-ticket-break-even":"Compare the 63 EUR Deutschlandticket with BVG passes.","berlin-deposit-release-ledger":"Check legal caps and return rules for rent deposits.","berlin-apple-orchard-planner":"Compare five pick-your-own orchards around Berlin.","berlin-bouldering-cost-curve":"Compare 14 Berlin bouldering gyms and multi-passes.","berlin-wohngeld-estimator":"Estimate Wohngeld housing benefit for your Berlin flat.","berlin-tax-refund-years":"Check which Berlin tax years you can still file.","berlin-electricity-offer-lines":"Compare Berlin electricity tariffs by kWh and bonus.","berlin-citizenship-clock":"Count your residence years toward German citizenship.","berlin-tenant-cover-clock":"Check waiting periods for tenant legal protection.","berlin-dental-stamp-ledger":"See how Bonusheft stamps increase dental coverage.","berlin-buergeramt-errand-map":"Check documents and fees for B\xFCrgeramt errands.","berlin-elterngeld-split-board":"Plan basic and Plus Elterngeld months for your child.","berlin-hausrat-claim-line":"See what Berlin contents insurance pays for claims.","berlin-dark-ride-window":"See when your Berlin bike commute crosses sunset.","berlin-flu-wave-timer":"Compare flu-shot timing with recent Berlin flu waves.","berlin-vet-bill-week":"See how emergency surcharges affect Berlin vet bills.","berlin-crane-evening-planner":"Time an autumn sunset trip to see cranes at Linum.","berlin-leaf-turn-map":"Track autumn foliage colors around Berlin by week.","berlin-cargo-bike-map":"Find free fLotte community cargo bikes in Berlin.","berlin-pumpkin-weekend-map":"Find six autumn pumpkin farms in and around Berlin.","berlin-church-tax-map":"Find which Amtsgericht handles your church exit.","berlin-broadband-speed-claim":"Check when slow internet lets you cut your bill.","berlin-milieuschutz-check":"Check if your flat sits in one of 82 protected areas.","berlin-blood-donor-map":"Compare all 14 blood and plasma centers in Berlin.","berlin-second-home-tax-ledger":"Calculate Berlin\u2019s 20% tax on a secondary address.","berlin-coop-share-payback":"Compare cooperative shares with lower monthly rent.","berlin-kindergeld-backpay-clock":"See how the six-month Kindergeld backpay cap works.","berlin-therme-soak-timeline":"Compare six thermal baths reachable on regional rail.","berlin-observatory-sky-board":"Check public telescope nights at Berlin observatories.","berlin-zoo-annual-pass-planner":"See when a Berlin Zoo or Tierpark annual pass pays off.","berlin-winter-swim-lake-board":"Compare water temperatures at nine winter swim spots.","berlin-tour-group-size-viewer":"Compare how a tour group of 12 feels next to 45.","berlin-sport-pass-month-map":"Compare Urban Sports Club tiers with direct prices.","berlin-herbstferien-cover-planner":"Plan childcare across Berlin\u2019s autumn school holidays.","berlin-cold-night-help-map":"Find open K\xE4ltehilfe winter night shelters in Berlin.","gardens-of-the-world-fit-map":"Plan Marzahn\u2019s Gardens of the World by season and gate.","berlin-parcel-pickup-clock":"Check last pickup days for DHL, Hermes, DPD, and GLS.","berlin-church-hours-board":"Check daily visiting hours at central Berlin churches.","berlin-rink-season-board":"Compare Berlin\u2019s six public ice rinks and hours.","potsdam-winter-palace-board":"See which Potsdam palaces open between Nov and March.","berlin-indoor-play-bill":"Compare family costs at Berlin indoor playgrounds.","berlin-photo-museum-clock":"Compare opening days across Berlin photography venues.","berlin-repair-cafe-calendar":"Find Berlin Repair Caf\xE9s by weekday and item type.","berlin-seven-day-board":"Lay out a seven-day Berlin week from your arrival day.","berlin-swim-badge-timeline":"See how kids\u2019 swimming badges unlock Berlin pools.","museum-island-lunch-map":"Find calm lunch spots within a walk of Museum Island.","berlin-flat-swap-rent-board":"See how a Berlin flat swap changes your monthly rent.","dessau-bauhaus-day-planner":"Plan a direct RE7 day trip to Bauhaus Dessau.","berlin-e-waste-drop-map":"Find free electronics drop-off points across Berlin.","beelitz-heilstatten-day-clock":"Check seasonal hours and tours at Beelitz-Heilst\xE4tten.","berlin-rail-change-board":"See how the December 2026 rail timetable change works.","ber-dawn-departure-map":"Find night buses and early trains to BER before 07:00.","berlin-lantern-walk-map":"Find public St. Martin lantern walks across Berlin.","christmas-market-day-trip-planner":"Compare Christmas markets in Potsdam and Dresden.","berlin-on-call-practice-map":"Find the 11 KV Berlin urgent on-call medical practices.","berlin-christmas-opening-chart":"See what opens in Berlin from 24 to 27 December.","berlin-sledding-snow-odds":"Check snow odds and the best sledding hills in Berlin.","queer-history-walk-map":"Walk seven landmarks of Berlin\u2019s queer history.","berlin-blackout-emergency-map":"Find your nearest Berlin emergency lighthouse point.","berlin-winter-feels-like-grid":"Check Berlin winter wind-chill and layering needs.","berlin-parcel-customs-line":"Calculate customs duty and fees on non-EU parcels.","berlin-clock-reader":"Learn how to read the Mengenlehreuhr Berlin Clock."};var he=`@font-face {
  font-family: Fraunces;
  src: url('https://fenerszymanski.github.io/berlinwalk-widgets/home-two-doors/assets/fonts/Fraunces-Variable-latin.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}

.bw-hub-v4 {
  --green: #1b5e20;
  --ink: #123d18;
  --yellow: #ffe600;
  --cream: #fafaf5;
  --line: #d6dfcf;
  --muted: #555d54;
  --surface: #eef2e7;
  font-family: Montserrat, sans-serif;
  color: var(--ink);
  background: var(--cream);
  font-synthesis: none;
}

.bw-hub-v4 * {
  box-sizing: border-box;
}

.bw-hub-v4 {
  margin: 0;
}

.bw-hub-v4 button,
.bw-hub-v4 input,
.bw-hub-v4 select {
  font: inherit;
}

.bw-hub-v4 button,
.bw-hub-v4 a,
.bw-hub-v4 summary,
.bw-hub-v4 select {
  -webkit-tap-highlight-color: transparent;
}

.bw-hub-v4 button,
.bw-hub-v4 select,
.bw-hub-v4 summary {
  cursor: pointer;
}

.bw-hub-v4 a {
  color: inherit;
  text-decoration: none;
}

.bw-hub-v4 button {
  color: var(--ink);
}

.bw-hub-v4 [hidden] {
  display: none !important;
}

.bw-hub-v4 :focus-visible {
  outline: 3px solid var(--green);
  outline-offset: 3px;
}

.bw-hub-v4 h1,
.bw-hub-v4 h2,
.bw-hub-v4 h3,
.bw-hub-v4 p {
  margin: 0;
}

.bw-hub-v4 h1,
.bw-hub-v4 h2 {
  font-family: Fraunces, serif;
}

.bw-hub-v4 h1 {
  font-size: clamp(40px, 5.5vw, 72px);
  font-weight: 650;
  line-height: 1.05;
  letter-spacing: -2px;
}

.bw-hub-v4 h2 {
  font-size: 32px;
  line-height: 1.15;
  font-weight: 600;
}

.bw-hub-v4 .sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}

.bw-hub-v4 .skip-link {
  position: fixed;
  top: -100px;
  left: 20px;
  z-index: 9999;
  background: var(--yellow);
  color: var(--ink);
  font-weight: 700;
  padding: 15px;
}

.bw-hub-v4 .skip-link:focus {
  top: 5px;
}

.bw-hub-v4 {
  max-width: 1440px;
  margin: auto;
  padding: 34px 42px 0;
}

.bw-hub-v4 .heading-band {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: 30px;
}

.bw-hub-v4 .eyebrow {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  margin-bottom: 10px;
}

.bw-hub-v4 .total {
  font-size: 18px;
  margin-top: 8px;
}

.bw-hub-v4 .search-form {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid #8ca87c;
  border-radius: 9px;
  padding: 6px 7px 6px 16px;
  flex: 1;
  max-width: 570px;
  min-width: 0;
  scroll-margin-top: 12px;
}

.bw-hub-v4 .search-form:focus-within {
  outline: 2px solid var(--green);
  outline-offset: 2px;
}

.bw-hub-v4 .ui-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.bw-hub-v4 .search-form input {
  border: 0;
  outline: 0;
  min-width: 0;
  width: 100%;
  background: transparent;
  font-size: 14px;
  color: var(--ink);
  height: 38px;
}

.bw-hub-v4 .search-clear {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  flex-shrink: 0;
}

.bw-hub-v4 .search-clear:hover {
  background: var(--surface);
}

.bw-hub-v4 .search-clear .ui-icon {
  width: 15px;
  height: 15px;
}

.bw-hub-v4 .search-form button {
  border: 0;
  background: var(--yellow);
  color: var(--ink);
  border-radius: 5px;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
}

.bw-hub-v4 .catalog-layout {
  display: grid;
  grid-template-columns: 235px minmax(0, 1fr);
  gap: 34px;
}

.bw-hub-v4 .sidebar {
  border-right: 1px solid var(--line);
  padding-right: 20px;
}

.bw-hub-v4 .category-nav {
  position: sticky;
  top: 22px;
  max-height: calc(100dvh - 44px);
  overflow: auto;
}

.bw-hub-v4 .category-nav h2 {
  font: 700 11px Montserrat, sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 4px 12px 14px;
}

.bw-hub-v4 .category-nav a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 46px;
  padding: 9px 12px;
  font-size: 13px;
  line-height: 1.35;
  border-radius: 7px;
  margin-bottom: 4px;
}

.bw-hub-v4 .cat-label-mobile {
  display: none;
}

.bw-hub-v4 .cat-count {
  font-size: 11px;
  color: #59644f;
  font-weight: 600;
  flex-shrink: 0;
}

.bw-hub-v4 .category-nav a:hover {
  background: var(--surface);
}

.bw-hub-v4 .category-nav a[aria-current] {
  background: var(--yellow);
  color: var(--ink);
  font-weight: 700;
}

.bw-hub-v4 .category-nav a[aria-current] .cat-count {
  color: var(--ink);
  font-weight: 700;
}

.bw-hub-v4 .section-intro {
  font-size: 14px;
  color: var(--muted);
  margin: 6px 0 10px;
}

.bw-hub-v4 .tool-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 26px;
}

.bw-hub-v4 .tool-item {
  min-width: 0;
  border-bottom: 1px solid var(--line);
}

.bw-hub-v4 .tool-row {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  padding: 13px 0;
  min-height: 0;
  border-radius: 4px;
}

.bw-hub-v4 .tool-row:hover {
  background: #f0f3e9;
}

.bw-hub-v4 .tool-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  flex-shrink: 0;
  margin-top: 2px;
}

.bw-hub-v4 .row-copy {
  flex: 1;
  min-width: 0;
}

.bw-hub-v4 .row-heading {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px 8px;
}

.bw-hub-v4 h3 {
  font-family: Montserrat, sans-serif;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.3;
  color: var(--ink);
}

.bw-hub-v4 .row-copy p {
  font-size: 14px;
  line-height: 1.44;
  color: var(--muted);
  margin-top: 3px;
}

.bw-hub-v4 .type-prefix {
  font-size: 12px;
  font-weight: 700;
  color: var(--green);
}

.bw-hub-v4 .type-sep {
  color: #7d8978;
  font-weight: 700;
}

.bw-hub-v4 .tool-row > .ui-icon {
  width: 16px;
  height: 16px;
  margin-top: 6px;
}

.bw-hub-v4 .suggestions {
  margin-bottom: 28px;
}

.bw-hub-v4 .suggestion-toggle {
  display: none;
}

.bw-hub-v4 .results {
  scroll-margin-top: 20px;
}

.bw-hub-v4 .results-heading {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: start;
  margin-bottom: 8px;
}

.bw-hub-v4 #results-title {
  scroll-margin-top: 20px;
}

.bw-hub-v4 .result-meta {
  font-size: 13px;
  margin-top: 8px;
  color: var(--muted);
}

.bw-hub-v4 .result-meta span {
  padding-left: 12px;
  font-size: 11px;
  font-weight: 600;
}

.bw-hub-v4 .type-filter {
  position: relative;
  flex-shrink: 0;
  z-index: 20;
}

.bw-hub-v4 .type-trigger {
  border: 1px solid var(--line);
  border-radius: 7px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 8px 13px;
  font-size: 13px;
  background: var(--cream);
  color: var(--ink);
}

.bw-hub-v4 .type-trigger:hover {
  background: var(--surface);
}

.bw-hub-v4 .type-trigger.is-filtered,
.bw-hub-v4 .type-filter.is-open .type-trigger {
  background: var(--yellow);
  border-color: var(--ink);
  color: var(--ink);
  font-weight: 700;
}

.bw-hub-v4 .type-popover {
  position: absolute;
  right: 0;
  top: 50px;
  width: 248px;
  background: #fff;
  border: 1px solid var(--line);
  box-shadow: 0 8px 22px #123d181a;
  padding: 12px;
  border-radius: 8px;
  overflow-y: auto;
}

.bw-hub-v4 .type-filter.opens-up .type-popover {
  top: auto;
  bottom: 50px;
}

.bw-hub-v4 .type-fallback {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.bw-hub-v4 .type-fallback a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 8px;
  border: 1px solid var(--line);
  border-radius: 6px;
}

.bw-hub-v4 .type-popover-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--muted);
  padding: 2px 8px 8px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 6px;
}

.bw-hub-v4 .type-popover-head a {
  text-transform: none;
  letter-spacing: 0;
  color: var(--green);
  text-decoration: underline;
  font-size: 12px;
}

.bw-hub-v4 .type-options-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bw-hub-v4 .type-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 44px;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 13px;
  color: var(--ink);
}

.bw-hub-v4 .type-option:hover {
  background: var(--surface);
}

.bw-hub-v4 .type-option.is-active {
  background: var(--yellow);
  color: var(--ink);
  font-weight: 700;
}

.bw-hub-v4 .type-count {
  font-size: 11px;
  color: #59644f;
  font-weight: 600;
}

.bw-hub-v4 .type-option.is-active .type-count {
  color: var(--ink);
  font-weight: 700;
}

.bw-hub-v4 .active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 10px 0;
  font-size: 12px;
}

.bw-hub-v4 .active-filters a {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  min-height: 44px;
  text-decoration: underline;
}

.bw-hub-v4 .active-filters .ui-icon {
  width: 14px;
  height: 14px;
}

.bw-hub-v4 .pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 26px 0 50px;
  font-size: 12px;
}

.bw-hub-v4 .page-controls,
.bw-hub-v4 .page-numbers {
  display: flex;
  gap: 5px;
  align-items: center;
}

.bw-hub-v4 .page-controls a {
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 8px;
}

.bw-hub-v4 .page-controls a[aria-current] {
  background: var(--yellow);
  border-color: var(--ink);
  color: var(--ink);
  font-weight: 700;
}

.bw-hub-v4 .ellipsis {
  padding: 0 3px;
}

.bw-hub-v4 .mobile-page {
  display: none;
}

.bw-hub-v4 .empty {
  padding: 26px 0 18px;
}

.bw-hub-v4 .empty h3 {
  font-family: Fraunces, serif;
  font-size: 26px;
  line-height: 1.2;
}

.bw-hub-v4 .empty p {
  font-size: 14px;
  line-height: 1.55;
  margin-top: 10px;
  color: var(--muted);
  max-width: 580px;
}

.bw-hub-v4 .empty-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.bw-hub-v4 .empty-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 9px 16px;
  border-radius: 6px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--ink);
  font-size: 13px;
  font-weight: 700;
}

.bw-hub-v4 .empty-btn:hover {
  border-color: var(--ink);
}

.bw-hub-v4 .empty-btn-primary,
.bw-hub-v4 .empty-btn-primary:visited,
.bw-hub-v4 .empty-btn-primary:hover,
.bw-hub-v4 .empty-btn-primary:focus,
.bw-hub-v4 .empty-btn-primary:active {
  background: var(--yellow);
  border-color: var(--ink);
  color: var(--ink);
}

.bw-hub-v4 .recovery .tool-list {
  grid-template-columns: 1fr;
}

.bw-hub-v4 .catalog-footer {
  border-top: 1px solid var(--line);
  padding: 24px 0;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  font-size: 11px;
  color: var(--muted);
}

.bw-hub-v4 .catalog-footer a {
  text-decoration: underline;
}

.bw-hub-v4 .catalog-footer > span:first-child {
  font-family: Fraunces, serif;
  font-size: 16px;
  color: var(--ink);
}

@media (min-width: 701px) {
}

@media (max-width: 1100px) and (min-width: 701px) {
  .bw-hub-v4 {
    padding: 28px 28px 0;
  }
  .bw-hub-v4 .catalog-layout {
    grid-template-columns: 200px minmax(0, 1fr);
    gap: 24px;
  }
  .bw-hub-v4 .tool-list {
    column-gap: 20px;
  }
  .bw-hub-v4 .tool-row {
    gap: 9px;
  }
  .bw-hub-v4 .tool-icon {
    width: 36px;
    height: 36px;
  }
  .bw-hub-v4 .row-heading h3 {
    font-size: 14px;
  }
  .bw-hub-v4 .tool-row > .ui-icon {
    display: none;
  }
  .bw-hub-v4 .pagination {
    flex-wrap: wrap;
  }
}

@media (max-width: 700px) {
  .bw-hub-v4 {
    padding: 18px 16px 0;
  }
  .bw-hub-v4 .heading-band {
    display: block;
    margin-bottom: 14px;
  }
  .bw-hub-v4 .eyebrow {
    display: none;
  }
  .bw-hub-v4 h1 {
    font-size: 36px;
    letter-spacing: -1px;
  }
  .bw-hub-v4 h2 {
    font-size: 24px;
  }
  .bw-hub-v4 .total {
    font-size: 14px;
    margin-top: 6px;
  }
  .bw-hub-v4 .search-form {
    margin-top: 16px;
    max-width: none;
    padding-left: 12px;
    gap: 8px;
  }
  .bw-hub-v4 .search-form input {
    font-size: 16px;
    height: 38px;
  }
  .bw-hub-v4 .search-form input::placeholder {
    font-size: 13px;
  }
  .bw-hub-v4 .catalog-layout {
    display: block;
  }
  .bw-hub-v4 .sidebar {
    position: sticky;
    top: 0;
    z-index: 25;
    padding: 6px 0;
    border: 0;
    border-bottom: 1px solid var(--line);
    margin: 0 -16px 18px;
    background: rgba(250, 250, 245, 0.97);
    backdrop-filter: blur(6px);
  }
  .bw-hub-v4 .category-nav {
    position: static;
    display: flex;
    gap: 6px;
    overflow-x: auto;
    max-height: none;
    padding: 2px 16px 4px;
    scrollbar-width: none;
    scroll-padding-inline: 16px;
  }
  .bw-hub-v4 .category-nav::-webkit-scrollbar {
    display: none;
  }
  .bw-hub-v4 .category-nav h2 {
    display: none;
  }
  .bw-hub-v4 .category-nav a {
    white-space: nowrap;
    min-height: 44px;
    margin: 0;
    padding: 8px 12px;
    font-size: 12px;
    gap: 5px;
    background: var(--surface);
    border-radius: 22px;
    flex-shrink: 0;
  }
  .bw-hub-v4 .cat-label-desktop {
    display: none;
  }
  .bw-hub-v4 .cat-label-mobile {
    display: inline;
  }
  .bw-hub-v4 .cat-count {
    display: inline;
    font-size: 11px;
    opacity: 0.86;
  }
  .bw-hub-v4 .tool-list {
    display: block;
  }
  .bw-hub-v4 .tool-row,
  .bw-hub-v4 .suggestions .tool-row {
    padding: 10px 0;
    min-height: 0;
    gap: 10px;
  }
  .bw-hub-v4 .tool-icon {
    width: 34px;
    height: 34px;
    margin-top: 2px;
  }
  .bw-hub-v4 .row-heading {
    gap: 3px 6px;
  }
  .bw-hub-v4 h3 {
    font-size: 14px;
    line-height: 1.28;
  }
  .bw-hub-v4 .row-copy p {
    font-size: 14px;
    line-height: 1.38;
    margin-top: 2px;
  }
  .bw-hub-v4 .type-prefix {
    font-size: 12px;
  }
  .bw-hub-v4 .tool-row > .ui-icon {
    width: 15px;
    height: 15px;
    margin-top: 6px;
  }
  .bw-hub-v4 .extra-suggestion {
    display: none;
  }
  .bw-hub-v4 .expanded .extra-suggestion {
    display: block;
  }
  .bw-hub-v4 .suggestion-toggle {
    display: block;
    min-height: 44px;
    margin: 8px 0 0;
    padding: 8px 0;
    border: 0;
    background: none;
    color: var(--green);
    text-decoration: underline;
    font-size: 13px;
    font-weight: 700;
  }
  .bw-hub-v4 .suggestions {
    margin-bottom: 22px;
  }
  .bw-hub-v4 .section-intro {
    font-size: 13px;
    line-height: 1.45;
  }
  .bw-hub-v4 .results-heading {
    align-items: start;
  }
  .bw-hub-v4 #results-title {
    scroll-margin-top: 74px;
  }
  .bw-hub-v4 .type-trigger {
    font-size: 12px;
    padding: 8px 10px;
  }
  .bw-hub-v4 .type-trigger .ui-icon {
    width: 16px;
    height: 16px;
  }
  .bw-hub-v4 .type-popover {
    right: 0;
    width: min(244px, calc(100vw - 32px));
  }
  .bw-hub-v4 .result-meta {
    font-size: 12px;
  }
  .bw-hub-v4 .result-meta span {
    padding-left: 8px;
    font-size: 10px;
  }
  .bw-hub-v4 .page-numbers {
    display: none;
  }
  .bw-hub-v4 .mobile-page {
    display: block;
    font-size: 12px;
  }
  .bw-hub-v4 .pagination {
    display: block;
    margin: 20px 0 32px;
  }
  .bw-hub-v4 .page-range {
    display: block;
    text-align: center;
    margin-bottom: 12px;
  }
  .bw-hub-v4 .page-controls {
    justify-content: space-between;
  }
  .bw-hub-v4 .page-controls a {
    font-size: 12px;
    padding: 8px 10px;
  }
  .bw-hub-v4 .page-controls:has(a[rel='next']):not(:has(a[rel='prev'])) {
    justify-content: flex-end;
    gap: 24px;
  }
  .bw-hub-v4 .catalog-footer {
    flex-wrap: wrap;
    font-size: 10px;
  }
  .bw-hub-v4 .catalog-footer > span:last-child {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bw-hub-v4 * {
    scroll-behavior: auto !important;
  }
}

bw-tools-catalog-v4,bw-tools-hub[data-bw-catalog-version="4"]{display:block;min-width:0;width:100%;background:#fafaf5}

.bw-hub-v4{box-sizing:border-box}

.bw-hub-v4 .suggestions{margin-top:0}
`;var Pe="https://fenerszymanski.github.io/berlinwalk-widgets/tools-hub/v4/",Ee="https://fenerszymanski.github.io/berlinwalk-widgets/tools-hub/data.json",Z=class extends HTMLElement{connectedCallback(){this._started||(this._started=!0,this.setAttribute("data-bw-catalog-version","4"),this.innerHTML=`<style>${he}</style><div class="bw-hub-v4"><p role="status" style="padding:24px">Loading Berlin tools\u2026</p></div>`,this._root=this.querySelector(".bw-hub-v4"),this._load())}async _load(){try{let y=this.getAttribute("data-url")||Ee,x=await fetch(y,{credentials:"omit",cache:"no-cache"});if(!x.ok)throw Error("Tools HTTP "+x.status);let S=await x.json();if(!Array.isArray(S.tools)||!Array.isArray(S.hubCategories))throw Error("Invalid catalog");if(!this.isConnected)return;let k=le(S,pe,Pe);this._unmount=ce(this._root,k,()=>this._fit()),this._observer=new ResizeObserver(()=>this._fit()),this._observer.observe(this._root),this.dataset.ready="true",this.dispatchEvent(new CustomEvent("bw-catalog-ready",{bubbles:!0})),this._fit()}catch(y){if(!this.isConnected)return;this.dataset.error="true",this._root.innerHTML='<h1>Berlin Tools</h1><p>The tools could not load. Please reload this page.</p><p><a href="/berlin-tools">Reload tools</a></p>',console.error("Berlin Tools could not load:",y.message)}}_fit(){let y=document.getElementById("comp-mp3h6ahr");if(!y||!y.contains(this))return;let x=Math.ceil(this.getBoundingClientRect().height);if(!x||x===this._height)return;this._height=x;let S=document.getElementById("comp-mp3h654p");for(let k of["comp-mp3h6ahr","comp-mp3h654p_relative","comp-mp3h654p"]){let B=document.getElementById(k);B&&(B.style.setProperty("height","auto","important"),B.style.setProperty("min-height","0","important"),B.style.setProperty("max-height","none","important"),B.style.setProperty("overflow","visible","important"),B.style.setProperty("aspect-ratio","auto","important"))}if(S)for(let k of S.querySelectorAll('.comp-mp3h654p-container,[data-testid="responsive-container-content"]'))k.style.setProperty("height","auto","important"),k.style.setProperty("min-height","0","important"),k.style.setProperty("grid-template-rows","minmax(0,auto)","important")}disconnectedCallback(){this._unmount?.(),this._observer?.disconnect(),this._started=!1}};customElements.get("bw-tools-catalog-v4")||customElements.define("bw-tools-catalog-v4",Z);customElements.get("bw-tools-hub")||customElements.define("bw-tools-hub",class extends Z{});function ue(){if(location.pathname.replace(/\/+$/,"")!=="/berlin-tools")return;let d=document.querySelector("#comp-mp3h6ahr bw-tools-hub");if(!d||d.dataset.bwCatalogVersion==="4"||d.parentElement.querySelector("bw-tools-catalog-v4"))return;let y=document.createElement("bw-tools-catalog-v4"),x=d.getAttribute("data-url");x&&y.setAttribute("data-url",x),y.style.cssText="position:absolute;visibility:hidden;width:100%;top:0;left:0",y.addEventListener("bw-catalog-ready",()=>{d.style.setProperty("display","none","important"),d.setAttribute("aria-hidden","true"),y.style.cssText="",y._fit()},{once:!0}),d.after(y)}var ae,Le=new MutationObserver(()=>{ae||(ae=requestAnimationFrame(()=>{ae=null,ue()}))});Le.observe(document.documentElement,{childList:!0,subtree:!0});ue();})();
