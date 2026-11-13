// Wix must serve a new document when the visitor changes language.
export function languageOf(href) {
 const u=new URL(href);
 return /^\/de(?:\/|$)/.test(u.pathname)||u.searchParams.get('lang')==='de'?'de':'en';
}
export function languageUrl(href,language) {
 const u=new URL(href);
 if(language==='de')u.searchParams.set('lang','de');else u.searchParams.delete('lang');
 return u.href;
}
export function navigateLanguageLink(event,anchor,{location=globalThis.location,currentLanguage=languageOf(location.href),beforeNavigate=()=>{}}={}) {
 if(!anchor||(event.button!==undefined&&event.button!==0)||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||anchor.hasAttribute('download')||(anchor.target&&anchor.target!=='_self'))return false;
 const source=new URL(location.href),target=new URL(anchor.href,source);
 const siteHost=host=>/^(?:www\.)?walkofberlin\.com$/.test(host);
 if(!['http:','https:'].includes(target.protocol)||!(target.origin===source.origin||(siteHost(source.hostname)&&siteHost(target.hostname))))return false;
 const language=languageOf(target.href);
 // A selected language link also reloads: it must never become a store pushState.
 if(!anchor.closest('.lang-switch')&&language===currentLanguage)return false;
 target.protocol=source.protocol;target.host=source.host;
 event.preventDefault();event.stopImmediatePropagation();
 beforeNavigate(language);
 location.assign(languageUrl(target.href,language));
 return true;
}
