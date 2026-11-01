import {createCatalog} from './catalog.js';
import {mountCatalog} from './controller.js';
import shortLeads from './short-leads.json';
import css from './catalog.css';

const ASSETS='https://fenerszymanski.github.io/berlinwalk-widgets/tools-hub/v4/';
const DATA='https://fenerszymanski.github.io/berlinwalk-widgets/tools-hub/data.json';
class ToolsCatalog extends HTMLElement {
  connectedCallback() {
    if(this._started)return;
    this._started=true;
    this.setAttribute('data-bw-catalog-version','4');
    this.innerHTML=`<style>${css}</style><div class="bw-hub-v4"><p role="status" style="padding:24px">Loading Berlin tools…</p></div>`;
    this._root=this.querySelector('.bw-hub-v4');
    this._load();
  }
  async _load() {
    try {
      const url=this.getAttribute('data-url')||DATA;
      const response=await fetch(url,{credentials:'omit',cache:'no-cache'});
      if(!response.ok)throw Error('Tools HTTP '+response.status);
      const data=await response.json();
      if(!Array.isArray(data.tools)||!Array.isArray(data.hubCategories))throw Error('Invalid catalog');
      if(!this.isConnected)return;
      const catalog=createCatalog(data,shortLeads,ASSETS);
      this._unmount=mountCatalog(this._root,catalog,()=>this._fit());
      this._observer=new ResizeObserver(()=>this._fit());
      this._observer.observe(this._root);
      this.dataset.ready='true';
      this.dispatchEvent(new CustomEvent('bw-catalog-ready',{bubbles:true}));
      this._fit();
    } catch(error) {
      if(!this.isConnected)return;
      this.dataset.error='true';
      this._root.innerHTML='<h1>Berlin Tools</h1><p>The tools could not load. Please reload this page.</p><p><a href="/berlin-tools">Reload tools</a></p>';
      console.error('Berlin Tools could not load:',error.message);
    }
  }
  _fit() {
    const box=document.getElementById('comp-mp3h6ahr');
    if(!box||!box.contains(this))return;
    const height=Math.ceil(this.getBoundingClientRect().height);
    if(!height||height===this._height)return;
    this._height=height;
    const section=document.getElementById('comp-mp3h654p');
    for(const id of ['comp-mp3h6ahr','comp-mp3h654p_relative','comp-mp3h654p']) {
      const el=document.getElementById(id);if(!el)continue;
      el.style.setProperty('height','auto','important');
      el.style.setProperty('min-height','0','important');
      el.style.setProperty('max-height','none','important');
      el.style.setProperty('overflow','visible','important');
      el.style.setProperty('aspect-ratio','auto','important');
    }
    if(section) {
      for(const el of section.querySelectorAll('.comp-mp3h654p-container,[data-testid="responsive-container-content"]')) {
        el.style.setProperty('height','auto','important');
        el.style.setProperty('min-height','0','important');
        el.style.setProperty('grid-template-rows','minmax(0,auto)','important');
      }
    }
  }
  disconnectedCallback() {
    this._unmount?.();this._observer?.disconnect();this._started=false;
  }
}
if(!customElements.get('bw-tools-catalog-v4'))customElements.define('bw-tools-catalog-v4',ToolsCatalog);
if(!customElements.get('bw-tools-hub'))customElements.define('bw-tools-hub',class extends ToolsCatalog {});

// The Wix script can be cached independently of the page-level loader. Upgrade
// a previously registered legacy instance only once the new catalog is ready.
function upgradeLegacy() {
  if(location.pathname.replace(/\/+$/,'')!=='/berlin-tools')return;
  const old=document.querySelector('#comp-mp3h6ahr bw-tools-hub');
  if(!old||old.dataset.bwCatalogVersion==='4')return;
  if(old.parentElement.querySelector('bw-tools-catalog-v4'))return;
  const next=document.createElement('bw-tools-catalog-v4');
  const dataUrl=old.getAttribute('data-url');if(dataUrl)next.setAttribute('data-url',dataUrl);
  next.style.cssText='position:absolute;visibility:hidden;width:100%;top:0;left:0';
  next.addEventListener('bw-catalog-ready',()=>{
    old.style.setProperty('display','none','important');old.setAttribute('aria-hidden','true');
    next.style.cssText='';next._fit();
  },{once:true});
  old.after(next);
}
let frame;
const watcher=new MutationObserver(()=>{
 if(frame)return;frame=requestAnimationFrame(()=>{frame=null;upgradeLegacy();});
});
watcher.observe(document.documentElement,{childList:true,subtree:true});
upgradeLegacy();
