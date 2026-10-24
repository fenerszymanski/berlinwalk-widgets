/* Fixed ten-institution ticket pilot. No cookies, storage, free-text dimensions,
 * new endpoint or tracking before Wix analytics consent. GA event names encode
 * only a reviewed public institution code so standard reports need no custom
 * dimensions. Existing BerlinToolEvents remains the overall tool ledger. */
(function(root, factory){
  var api = factory();
  if(typeof module !== 'undefined' && module.exports) module.exports = api;
  if(typeof window !== 'undefined' && typeof document !== 'undefined') api.install(window, document);
})(typeof globalThis !== 'undefined' ? globalThis : this, function(){
  'use strict';
  var SLUG = 'berlin-ticket-machine-simulator';
  var PARTNERS = {gls:'gls','heart-of-gold':'hog','pension-absolut':'pa',wilmina:'wil','kapitel-zwei':'k2',eastseven:'es','die-fabrik':'df',sunflower:'sf',pfefferbett:'pf',meininger:'mei'};
  var DOMAINS = {'gls-berlin.de':'gls','gls-german-courses.de':'gls','heartofgold-hostel.de':'heart-of-gold','pension-absolutberlin.de':'pension-absolut','wilmina.com':'wilmina','kapitel-zwei.de':'kapitel-zwei','eastseven.de':'eastseven','diefabrik.com':'die-fabrik','sunflower-hostel.de':'sunflower','pfefferbett.de':'pfefferbett','meininger-hotels.com':'meininger'};
  function partnerCode(search, referrer){
    var q = new URLSearchParams(search || '');
    var selected = q.get('wob_partner') || q.get('utm_source');
    if(Object.prototype.hasOwnProperty.call(PARTNERS,selected)) return PARTNERS[selected];
    try{
      var host = new URL(referrer).hostname.toLowerCase();
      var domains = Object.keys(DOMAINS);
      for(var i=0;i<domains.length;i++) if(host===domains[i] || host.endsWith('.'+domains[i])) return PARTNERS[DOMAINS[domains[i]]];
    }catch(_){}
    return 'other';
  }
  function consent(win){
    try{var manager=win.consentPolicyManager;if(!manager || manager.initRan!==true)return false;var value=manager.getCurrentConsentPolicy();return value.defaultPolicy===false && (value.policy || value).analytics===true;}catch(_){return false;}
  }
  function stage(data){
    if(data.eventName==='start') return data.actionName==='practice_selected' ? 'practice_start' : data.actionName==='scenario_started' ? 'challenge_start' : '';
    if(data.eventName==='complete') return data.actionName==='practice_selected' ? 'practice_complete' : data.actionName==='challenge_selected' ? 'challenge_complete' : '';
    return '';
  }
  function install(win, doc){
    if(win.__bwTicketPartnerAnalytics) return;
    win.__bwTicketPartnerAnalytics = true;
    var hosts=['https://www.walkofberlin.com','https://walkofberlin.com','http://127.0.0.1:8765','http://localhost:8765'];
    if(hosts.indexOf(win.location.origin)<0) return;
    var code=partnerCode(win.location.search,doc.referrer),seen=new Set(),visitSent=false;
    var qa=win.location.origin.indexOf('http:')===0 || new URLSearchParams(win.location.search).get('wob_ticket_qa')==='1';
    function onPage(){return /^\/tools\/berlin-ticket-machine-simulator\/?$/.test(win.location.pathname);}
    function diagnostic(value){
      if(!qa || !doc.documentElement || !doc.documentElement.setAttribute)return;
      doc.documentElement.setAttribute('data-bw-ticket-pilot-qa',value);
      var layer=win.dataLayer || [],config=0,initialised=0;
      for(var i=0;i<layer.length;i++){if(layer[i] && layer[i][0]==='config' && layer[i][1]==='G-4HWBTM07N2')config++;if(layer[i] && layer[i][0]==='js')initialised++;}
      doc.documentElement.setAttribute('data-bw-ticket-pilot-qa-runtime',JSON.stringify({googleTagLoaded:!!win.google_tag_manager,googleTagConfigured:!!(win.google_tag_manager && win.google_tag_manager['G-4HWBTM07N2']),layerLength:layer.length,configCommands:config,initialisationCommands:initialised,wixChannel:!!(win.promoteAnalyticsChannels && win.promoteAnalyticsChannels.some(function(c){return c.name==='googleAnalyticsConsentMode';}))}));
    }
    function send(suffix){
      if(!onPage()) return false;
      if(!consent(win)){diagnostic('blocked_consent');return false;}
      if(typeof win.gtag!=='function' && !(win.dataLayer && typeof win.dataLayer.push==='function')){diagnostic('waiting_tracker');return false;}
      var name=(qa?'bw_tkt_qa_':'bw_tkt_')+code+'_'+suffix;
      var payload={send_to:'G-4HWBTM07N2',page_location:'https://www.walkofberlin.com/tools/'+SLUG,page_referrer:''};
      if(typeof win.gtag==='function') win.gtag('event',name,payload);
      else win.dataLayer.push((function(){return arguments;})('event',name,payload));
      diagnostic('queued:'+name);
      return true;
    }
    function visit(){if(!visitSent && doc.visibilityState!=='hidden' && send('visit')) visitSent=true;}
    function message(event){
      if(!onPage() || !consent(win)) return;
      var d=event.data,childOrigin=event.origin;
      var allowedOrigin=childOrigin==='https://fenerszymanski.github.io' || (qa && /^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(childOrigin));
      if(!allowedOrigin || !d || d.type!=='bw-tool-event' || d.v!=='20260830a' || d.toolSlug!==SLUG || !/^bwte_[0-9a-f]{32}$/.test(d.eventId || '')) return;
      var frames=doc.querySelectorAll('iframe[data-bw-tool-frame][data-bw-tool-slug="'+SLUG+'"]');
      var matches=false;for(var i=0;i<frames.length;i++) if(frames[i].contentWindow===event.source) matches=true;
      if(!matches || seen.has(d.eventId)) return;
      var suffix=stage(d);if(!suffix) return;
      visit();
      if(send(suffix)){seen.add(d.eventId);if(seen.size>500)seen.delete(seen.values().next().value);}
    }
    win.addEventListener('message',message);
    doc.addEventListener('consentPolicyInitialized',visit);doc.addEventListener('consentPolicyChanged',visit);doc.addEventListener('visibilitychange',visit);
    // Wix/gtag can initialise after the early tool loader. Bounded retry only;
    // each check still needs consent, and never replays pre-consent actions.
    var tries=0,timer=win.setInterval(function(){visit();if(visitSent || ++tries>=60)win.clearInterval(timer);},1000);
    visit();
  }
  return {install:install,partnerCode:partnerCode,stage:stage,PARTNERS:PARTNERS};
});
