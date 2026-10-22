(function () {
  'use strict';
  const script = document.currentScript;
  if (!script || !script.src || customElements.get('bw-storefront')) return;
  const base = new URL('.', script.src);
  const CHANNEL = 'wob:shop-cart:v1';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const asset = value => new URL(value, base).href;
  const url = value => {if(typeof value!=='string'||!value.trim())return '#';try {const u = new URL(value, 'https://www.walkofberlin.com');return u.protocol === 'https:' ? u.href : '#';} catch {return '#';}};
  const textMoney = value => value?.formattedAmount || (typeof value?.amount === 'string' ? value.amount : 'Not confirmed');
  const nativeImage = value => {if(typeof value!=='string')return '#';const match=/^wix:image:\/\/v1\/([^/#?]+)(?:\/|#|\?|$)/.exec(value);if(match&&/^[a-zA-Z0-9_.~%-]+$/.test(match[1]))return 'https://static.wixstatic.com/media/'+match[1];return url(value);};
  const json = value => {try{return JSON.parse(value || 'null');}catch{return null;}};
  const resources = Promise.all([
    import(asset('catalog-layer.js')), import(asset('editorial-helpers.js')),
    ...['data/categories.json','data/presentation.json','data/native-bindings.json','data/external-products.json'].map(path => fetch(asset(path)).then(response => {if (!response.ok) throw Error('CATALOGUE_METADATA_UNAVAILABLE');return response.json();}))
  ]);
  function safeHtml(html) {
    // Native rich text can preserve escaped quote delimiters and escaped block separators.
    // Normalize only tag attribute delimiters and separators between tags, then sanitize.
    const source=String(html||'').replace(/<[^>]*>/g,tag=>tag.replace(/=\\+(["'])/g,'=$1').replace(/\\+(["'])(?=[\s>])/g,'$1')).replace(/>(?:\s|\\+[rn])+</g,'>\n<');
    const doc = new DOMParser().parseFromString(source, 'text/html');
    const keep = new Set(['P','A','STRONG','EM','UL','OL','LI','BR','B','I']);
    for (const el of [...doc.body.querySelectorAll('*')]) {
      if (!keep.has(el.tagName)) {el.replaceWith(...el.childNodes);continue;}
      const href = el.tagName === 'A' ? el.getAttribute('href') : null;
      for (const attribute of [...el.attributes]) el.removeAttribute(attribute.name);
      if (href && url(href) !== '#') {el.href = url(href);el.target = '_blank';el.rel = 'noopener noreferrer';}
    }
    return doc.body.innerHTML.replace(/[\u2013\u2014]/g, ',');
  }
  class BWStorefront extends HTMLElement {
    static get observedAttributes() {return ['shop-bridge-ready','shop-context','shop-catalogue','shop-cart-response'];}
    constructor() {
      super();this.attachShadow({mode:'open'});this.pending = new Map();this.cart = null;this.catalogue = null;this.model = null;
      this.context = {};this.category = 'all';this.filter = 'all';this.quantity = 1;this.wall = false;this.busy = false;
      this.quote = null;this.destination = {};this.selection = null;this.error = '';this.notice = '';this.revealed = false;this.readySent = false;this.delivery = -1;this.quoteRevision=0;
      this.shadowRoot.addEventListener('click', event => this.click(event));
      this.shadowRoot.addEventListener('input', event => this.input(event));
      this.shadowRoot.addEventListener('change', event => this.change(event));
      this.shadowRoot.addEventListener('submit', event => {event.preventDefault();if(event.target.matches('[data-address-form]'))this.getQuote();});
    }
    connectedCallback() {this.context=json(this.getAttribute('shop-context'))||{};this.load();}
    disconnectedCallback() {this.sizeObserver?.disconnect();cancelAnimationFrame(this.sizeFrame);for(const pending of this.pending.values()){clearTimeout(pending.timer);pending.reject(Error('BRIDGE_DISCONNECTED'));}this.pending.clear();}
    attributeChangedCallback(name, oldValue, value) {
      if(oldValue===value)return;
      if(name==='shop-context') {const next=json(value)||{};if(next.path!==this.context.path){this.quantity=1;this.wall=false;this.readySent=false;this.revealed=false;this.quote=null;this.quoteRevision++;}this.context=next;this.applyContextCategory();this.render();this.signalReady();}
      if(name==='shop-catalogue') {this.catalogue=json(value);this.buildModel();}
      if(name==='shop-cart-response')this.receive(json(value));
      if(name==='shop-bridge-ready')this.start();
    }
    async load() {
      try {const [layer,editorial,definitions,presentation,bindings,external]=await resources;
        Object.assign(this,{layer,editorial,definitions,presentation,bindings,external});
        if(this.catalogue)this.buildModel();await this.start();
      }catch(error){this.fail(error.message);}
    }
    async start() {
      if(!this.layer||this.started||this.getAttribute('shop-bridge-ready')!==CHANNEL)return;
      this.started=true;
      const reads=await Promise.allSettled([this.request('catalog'),this.request('get')]);
      for(let index=0;index<reads.length;index++)if(reads[index].status==='rejected'&&index===0)this.fail(reads[index].reason.message);
      this.render();this.signalReady();
    }
    request(op, fields={}) {
      if(this.getAttribute('shop-bridge-ready')!==CHANNEL)return Promise.reject(Error('BRIDGE_NOT_READY'));
      const id=globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`;
      return new Promise((resolve,reject)=>{
        const timer=setTimeout(()=>{this.pending.delete(id);if(['add','update','remove','checkout'].includes(op))this.uncertain=true;reject(Error('UPDATE_NOT_CONFIRMED'));},20000);
        this.pending.set(id,{resolve,reject,timer,op,quoteRevision:this.quoteRevision});
        this.dispatchEvent(new CustomEvent('shop-cart-request',{detail:{channel:CHANNEL,id,op,...fields},bubbles:true,composed:true}));
      });
    }
    receive(response) {
      if(!response||response.channel!==CHANNEL)return;
      if(Number.isFinite(response.delivery)){if(response.delivery<=this.delivery)return;this.delivery=response.delivery;}
      if(response.event==='render-state') {
        for(const [id,pending] of this.pending)if(pending.op==='native-fallback'){clearTimeout(pending.timer);pending.resolve(response);this.pending.delete(id);}
        if(response.ok&&response.nativeCollapsed){this.hidden=false;this.revealed=true;this.render();}
        else {this.revealed=false;this.hidden=true;this.style.height='0px';this.sizeObserver?.disconnect();if(!response.fallback)this.dispatchEvent(new CustomEvent('shop-render-failed',{detail:{channel:CHANNEL},bubbles:true,composed:true}));}
        return;
      }
      if(response.context)this.context=response.context;
      if(response.catalogue){this.catalogue=response.catalogue;this.buildModel();}
      if(response.cart) {
        if(this.cart?.signature!==response.cart.signature){this.quote=null;this.quoteRevision++;}
        this.cart=response.cart;this.uncertain=false;if(this.error==='UPDATE_NOT_CONFIRMED')this.error='';
      }
      const pending=this.pending.get(response.id);
      const uncertainMutation=response.uncertain===true||response.refreshRequired===true||response.retryAllowed===false||['APPLIED_CART_UNREADABLE','UNKNOWN'].includes(response.mutationStatus)||(pending&&['add','update','remove','checkout'].includes(pending.op)&&response.ok===false&&response.error==='INVALID_CART_RESPONSE');
      if(uncertainMutation){this.uncertain=true;this.error='UPDATE_NOT_CONFIRMED';}
      if(response.quote&&pending?.op==='quote'&&pending.quoteRevision===this.quoteRevision)this.quote=response.quote;
      if(pending){clearTimeout(pending.timer);this.pending.delete(response.id);response.ok?pending.resolve(response):pending.reject(Error(typeof response.error==='string'?response.error:response.error?.code||'CART_UNAVAILABLE'));}
      this.render();this.signalReady();
    }
    buildModel() {
      if(!this.layer||!Array.isArray(this.catalogue?.products))return;
      try {
        const rows=this.catalogue.products.map(row=>{
          const binding=this.bindings.find(item=>item.wixProductId===row.productId);
          return {id:row.productId,name:row.name,productType:binding?.nativeProductType,collectionIds:row.collectionIds?.length?row.collectionIds:binding?.nativeCategoryIds,
            visible:true,stock:{inStock:row.inStock},priceData:{price:row.price,discountedPrice:row.discountedPrice,currency:row.currency},productPageUrl:url(row.productPageUrl),
            description:row.description,additionalInfoSections:row.additionalInfoSections,
            media:{mainMedia:{image:{url:row.mainMedia}}},productOptions:row.requiresOptions||row.directAddAllowed!==true?[{name:'Native options'}]:[]};
        });
        const products=[...this.layer.adaptWixProducts(rows,this.presentation),...this.layer.adaptExternalProducts(this.external)];
        products.sort((a,b)=>this.presentation.findIndex(item=>item.id===a.id)-this.presentation.findIndex(item=>item.id===b.id));
        this.model=this.layer.createCatalogModel(products,this.definitions);
        for(const product of this.model.products){const native=this.catalogue.products.find(row=>row.productId===product.wixProductId);product.priceLabel=native?.formattedDiscountedPrice||native?.formattedPrice||(native?`${native.currency} ${native.discountedPrice??native.price}`:`${product.currency} ${this.external.find(item=>item.sourceKey===product.externalSourceKey)?.productSchema?.offers?.price||''}`);}
        this.applyContextCategory();this.render();this.signalReady();
      }catch(error){this.fail(error.message);}
    }
    applyContextCategory() {
      if(!this.model)return;
      if(this.context.categorySlug==='berlin-landmark-posters'){this.category='print';this.filter='landmarks';}
      else if(this.context.categorySlug==='berlin-reels-collection'){this.category='print';this.filter='stories';}
      else this.category=this.model.normaliseCategoryId(this.category);
    }
    signalReady() {
      if(this.readySent||!this.model||!['shop','product','cart'].includes(this.context.mode))return;
      const stylesheet=this.shadowRoot.querySelector('link[rel=stylesheet]');if(stylesheet&&!stylesheet.sheet){stylesheet.addEventListener('load',()=>this.signalReady(),{once:true});return;}
      if(this.context.mode==='cart'&&!this.cart)return;
      if(this.context.mode==='product'&&!this.model.products.some(p=>p.wixProductId===this.context.productId))return;
      this.readySent=true;this.dispatchEvent(new CustomEvent('shop-render-ready',{detail:{channel:CHANNEL},bubbles:true,composed:true}));
    }
    fail(message) {this.error=message||'SHOP_UNAVAILABLE';this.revealed=false;this.hidden=true;this.style.height='0px';this.sizeObserver?.disconnect();this.render();this.dispatchEvent(new CustomEvent('shop-render-failed',{detail:{channel:CHANNEL},bubbles:true,composed:true}));}
    image(product) {const native=product.source==='external'?'#':nativeImage(product.nativeImageUrl);return native&&native!=='#'?native:asset('assets/'+product.image);}
    tile(product) {
      const source=this.image(product);
      return `<a class="tile ${product.imageFit==='cover'?'cover':''} ${product.visualOverlay?'audio-device-card':''}" href="${esc(url(product.productUrl))}"><img class="tile-photo" src="${esc(source)}" alt="${esc(product.alt||product.name)}" loading="lazy">${product.visualOverlay?`<img class="audio-device-overlay" src="${esc(asset('assets/'+product.visualOverlay))}" alt="Illustrative phone and headphones" loading="lazy">`:''}</a>`;
    }
    action(product) {return product.action==='add'?`<button class="outline" data-action="add" data-product="${product.wixProductId}" ${this.busy||this.uncertain?'disabled':''}>Add to cart</button>`:`<a class="outline" href="${esc(url(product.productUrl))}">${esc(product.actionLabel)}</a>`;}
    card(product,feature=false) {return `<article class="${feature?'feature':'card'}" data-product="${product.id}">${this.tile(product)}<div class="${feature?'feature-copy':'card-copy'}"><span class="type">${esc(product.typeLine)}</span><a class="product-name" href="${esc(url(product.productUrl))}">${esc(product.name)}</a>${feature?`<p>${esc(product.description)}</p>`:''}<span class="place">${esc(product.place)}</span><div class="card-bottom"><span class="price">${esc(product.priceLabel)}</span>${this.action(product)}</div></div></article>`;}
    shopbar() {return `<aside class="shopbar"><div class="wrap shopbar-inner"><a class="shopbar-home" href="https://walkofberlin.com/category/all-products">Shop</a><nav class="tabs" aria-label="Shop categories">${this.model.tabs.map(tab=>`<a href="https://walkofberlin.com/category/all-products" data-category="${tab.id}" ${this.category===tab.id?'aria-current="page"':''}>${esc(tab.label)}</a>`).join('')}</nav><a class="cart-link" href="https://walkofberlin.com/cart-page">Cart (${this.cart?this.cart.count:'—'})</a></div></aside>`;}
    credits() {return `<section class="wrap visual-credit-wrap"><details class="shop-visual-credits"><summary>Shop image credits</summary><div class="details-body"><p>Photograph of Anhalter Bahnhof: Carlos Delgado / Wikimedia Commons, CC BY-SA 4.0. The photograph is cropped and resized for the shop card.</p><p><a href="https://commons.wikimedia.org/wiki/File:Berlin_Anhalter_Bahnhof_-_01.jpg" target="_blank" rel="noopener noreferrer">Original photograph</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0 licence</a></p><p>A separate illustration of a phone and headphones was created with OpenAI image generation and layered over the photograph. It is an illustrative device image, not a screenshot of the audio player.</p></div></details></section>`;}
    shop() {
      const selected=this.category==='all'?null:this.model.getCategoryView(this.category,this.filter);
      return `<section class="wrap intro"><h1>Shop</h1><p class="lead">Prints of Berlin places, and audio walks to explore them on foot.</p>${selected?.filters.length?`<nav class="chips" aria-label="Print series"><a href="#" data-filter="all">${esc(selected.allFilterLabel)}</a>${selected.filters.map(filter=>`<a href="#" data-filter="${filter.id}" ${filter.id===this.filter?'aria-current="page"':''}>${esc(filter.label)}</a>`).join('')}</nav>`:''}</section>${(selected?[selected]:this.model.sections).map(section=>`<section class="wrap shelf"><div class="section-head"><div class="section-title"><h2>${esc(section.title)}</h2><span class="meta">${esc(section.description)}</span></div>${section.moreCategoryId?`<a href="#" data-category="${section.moreCategoryId}">${esc(section.moreLabel)} →</a>`:''}</div><div class="${section.layout==='feature'?'feature-grid':'grid'}${selected?' category-grid':''}">${section.products.map(product=>this.card({...product,imageFit:product.imageFit||section.imageFit},section.layout==='feature')).join('')}</div></section>`).join('')}${this.credits()}`;
    }
    quantityControl(value,id='',product=false) {return `<div class="qty"><button data-action="${product?'product-minus':'minus'}" data-line="${esc(id)}" aria-label="Decrease quantity" ${value<=1||this.busy||this.uncertain?'disabled':''}>−</button><output>${value}</output><button data-action="${product?'product-plus':'plus'}" data-line="${esc(id)}" aria-label="Increase quantity" ${value>=99||this.busy||this.uncertain?'disabled':''}>+</button></div>`;}
    product() {
      const product=this.model.products.find(p=>p.wixProductId===this.context.productId);if(!product)return '';
      const native=this.catalogue.products.find(p=>p.productId===product.wixProductId);
      const wall=this.wall&&product.id==='bu';
      const originalDescription=native?.description||product.description;
      return `<div class="wrap"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="https://walkofberlin.com/category/all-products">Shop</a> / ${esc(product.name)}</nav><section class="product-layout"><div class="product-title"><h1>${esc(product.name)}</h1><span class="place">${esc(product.place)}</span><span class="price">${esc(product.priceLabel)}</span></div><div class="gallery"><div class="gallery-stage"><img class="${wall?'wall':''}" src="${esc(wall?asset('assets/berlin-uhr-wall.jpg'):this.image(product))}" alt="${esc(wall?'Styling example. Frame not included.':product.alt)}">${wall?'<p class="gallery-caption">Styling example · Frame not included</p>':''}</div><div class="thumbnails"><button class="thumb" data-action="poster" aria-label="Show the poster" aria-pressed="${!wall}"><img src="${esc(asset('assets/'+product.image))}" alt=""></button>${product.id==='bu'?`<button class="thumb" data-action="wall" aria-label="Show it on a wall" aria-pressed="${wall}"><img src="${esc(asset('assets/berlin-uhr-wall.jpg'))}" alt=""></button>`:''}</div></div><div class="buy-box"><p class="spec">${esc(product.typeLine)}</p><div class="buy-row">${this.quantityControl(this.quantity,'',true)}${product.action==='add'?`<button class="primary" data-action="add" data-product="${product.wixProductId}" data-quantity="${this.quantity}" ${this.busy||this.uncertain?'disabled':''}>Add to cart</button>`:this.action(product)}</div><p class="delivery">Printed to order by Gelato. Delivery estimates are shown at checkout. Frame not included.</p></div></section><div class="product-info"><section class="story"><h2>The story behind this print</h2><div>${safeHtml(originalDescription)}</div></section>${product.id==='bu'?this.editorial.clockBox()+this.editorial.locationCard(product):''}<section class="disclosures">${(product.nativeAdditionalInfo||[]).map(info=>`<details><summary>${esc(info.title)}</summary><div class="details-body">${safeHtml(info.description)}</div></details>`).join('')}<details><summary>Delivery &amp; returns</summary><div class="details-body"><p>Printed to order by Gelato. Delivery estimates and the current delivery and return terms are shown in checkout.</p></div></details></section></div><section class="more"><h2>More from the shop</h2><div class="grid category-grid">${[...this.model.products.filter(p=>p.id!==product.id&&p.fulfilment.cartEligible).slice(0,2),...this.model.products.filter(p=>p.action==='external').slice(0,1)].map(p=>this.card(p)).join('')}</div></section></div>${this.credits()}`;
    }
    lines() {
      return [['Shipped to you',this.cart.lines.filter(line=>line.shippable===true)],['Download',this.cart.lines.filter(line=>line.shippable===false)],['Delivery type to confirm',this.cart.lines.filter(line=>line.shippable===null)]].filter(([,lines])=>lines.length).map(([label,lines])=>`<section class="cart-group"><h2>${label}</h2>${lines.map(line=>{const product=this.model.products.find(p=>p.wixProductId===line.productId);return `<article class="cart-line"><div class="line-image">${product?`<img src="${esc(this.image(product))}" alt="${esc(product.name)}">`:''}</div><div class="line-main"><h3>${esc(product?.name||line.name)}</h3><span class="meta">${esc(product?.typeLine||line.itemType||'')}</span><div class="line-bottom"><div class="line-controls">${line.editable?this.quantityControl(line.quantity,line.lineItemId):`<span>Quantity: ${line.quantity}</span>`}${line.editable?`<button class="text-button" data-action="remove" data-line="${esc(line.lineItemId)}" ${this.busy||this.uncertain?'disabled':''}>Remove</button>`:''}</div><strong class="price">${line.lineTotal?esc(textMoney(line.lineTotal)):`${esc(textMoney(line.unitPrice))} each`}</strong></div>${!line.editable?'<p class="meta">Manage this item in the original cart.</p>':''}</div></article>`;}).join('')}</section>`).join('');
    }
    quoteInput() {return {expectedCartSignature:this.cart.signature,[this.cart.hasShippableItems?'destination':'billingDestination']:{...this.destination},...(this.selection?{selection:this.selection}:{})};}
    cartPage() {
      if(!this.cart)return `<section class="wrap empty"><h1>Your cart could not be read.</h1><p>The original cart remains available.</p><button class="primary" data-action="native-fallback">Open original cart</button></section>`;
      if(!this.cart.count)return `<section class="wrap empty"><h1>Your cart is empty.</h1><p>Explore Berlin prints, or listen to a city walk.</p><a class="primary" href="https://walkofberlin.com/category/all-products">Browse the shop</a><div class="grid">${this.model.products.filter(p=>p.fulfilment.cartEligible).slice(0,3).map(p=>this.card(p)).join('')}</div></section>`;
      const quote=this.quote,ready=quote?.state==='READY'&&quote.signature===this.cart.signature;
      const fields=[['postalCode','Postal code'],['subdivision','State / region'],['city','City'],['addressLine1','Address line']];
      return `<section class="wrap cart-page cart-mode"><h1>Your cart <span class="meta">(${this.cart.count} ${this.cart.count===1?'item':'items'})</span></h1><div class="cart-layout"><div>${this.lines()}<details class="promo"><summary>Promo code</summary><div class="details-body">You can enter a promo code in checkout.</div></details></div><aside class="order-summary"><h2>Order summary</h2><div class="summary-row"><span>Subtotal</span><strong>${esc(textMoney(this.cart.subtotal))}</strong></div>${this.cart.hasShippableItems===null?'<p>Delivery requirements have not been confirmed. Continue in the original cart.</p><button class="outline" data-action="native-fallback">Open original cart</button>':`<form data-address-form><label class="destination-label">${this.cart.hasShippableItems?'Delivery destination':'Billing destination for tax'}</label><div class="address-grid"><label>Country<select name="country" required><option value="">Choose a destination</option>${[['DE','Germany'],['AT','Austria'],['FR','France'],['NL','Netherlands'],['GB','United Kingdom'],['US','United States']].map(([code,label])=>`<option value="${code}" ${this.destination.country===code?'selected':''}>${label}</option>`).join('')}<option value="OTHER" ${this.destination.country==='OTHER'?'selected':''}>Another destination</option></select></label>${fields.map(([key,label])=>`<label>${label}<input name="${key}" value="${esc(this.destination[key]||'')}" autocomplete="${key==='postalCode'?'postal-code':key==='city'?'address-level2':key==='subdivision'?'address-level1':'address-line1'}"></label>`).join('')}</div><button class="outline" type="submit" ${this.busy||this.destination.country==='OTHER'?'disabled':''}>Check delivery and tax</button>${this.destination.country==='OTHER'?'<p>For another destination, <button class="text-button" data-action="native-fallback" type="button">continue in the original cart</button> to check the available delivery options.</p>':''}</form>`}${quote?.choices?.length?`<div class="quote-choices"><span>Delivery method</span>${quote.choices.map((choice,index)=>`<button class="outline" data-action="shipping" data-index="${index}" ${this.busy?'disabled':''}>${esc(choice.title)}</button>`).join('')}</div>`:''}${ready?`<div class="native-cart-bottom"><div class="summary-row"><span>Delivery</span><strong>${esc(textMoney(quote.shipping))}</strong></div><div class="summary-row"><span>Tax</span><strong>${esc(textMoney(quote.tax))}</strong></div><div class="summary-row"><span>Estimated total</span><strong>${esc(textMoney(quote.total))}</strong></div></div>`:`<p class="shipping-note">${quote?.state==='NO_SHIPPING_AVAILABLE'?'No delivery method was returned for this address. Check the address or open the original cart.':'Choose a destination and a delivery method to see shipping and the estimated total.'}</p>`}<div class="checkout-area"><button class="primary" data-action="checkout" ${!ready||this.busy||this.uncertain?'disabled':''}>Continue to checkout</button><p class="checkout-note">Final delivery and tax are confirmed in checkout.</p><a href="https://walkofberlin.com/category/all-products">Continue shopping</a></div></aside></div></section>`;
    }
    render() {
      if(!this.layer||!this.model){this.shadowRoot.innerHTML=`<link rel="stylesheet" href="${esc(asset('storefront.css'))}"><div class="bridge-loading" role="status">Loading the shop…</div>`;return;}
      const open=this.shadowRoot.querySelector('dialog')?.open;
      const focus=this.shadowRoot.activeElement;
      const focusAction=focus?.dataset.action,focusLine=focus?.dataset.line;
      this.shadowRoot.innerHTML=`<link rel="stylesheet" href="${esc(asset('storefront.css'))}"><div class="surface" ${this.revealed?'':'hidden'}>${this.shopbar()}${this.error?`<div class="native-error" role="alert">${esc(this.errorMessage())} <button class="text-button" data-action="refresh">Refresh cart</button></div>`:''}${this.context.mode==='product'?this.product():this.context.mode==='cart'?this.cartPage():this.shop()}<p class="sr-only" role="status" aria-live="polite">${esc(this.notice)}</p><dialog class="drawer" aria-label="Shopping cart"><div class="drawer-heading"><h2>Cart (${this.cart?this.cart.count:'—'})</h2><button class="icon-button" data-action="close-drawer" aria-label="Close cart">✕</button></div>${this.notice?`<p class="notice">${esc(this.notice)}</p>`:''}${this.cart?this.lines():''}<div class="drawer-subtotal summary-row"><span>Subtotal</span><strong>${esc(textMoney(this.cart?.subtotal))}</strong></div><p class="delivery">Delivery and tax are confirmed after your destination is entered.</p><div class="drawer-actions"><a class="primary" href="https://walkofberlin.com/cart-page">View cart</a><button class="text-button" data-action="close-drawer">Continue shopping</button></div></dialog></div>`;
      const content=this.shadowRoot.querySelector('.surface');this.sizeObserver?.disconnect();if(content){this.sizeObserver=new ResizeObserver(()=>{cancelAnimationFrame(this.sizeFrame);this.sizeFrame=requestAnimationFrame(()=>{const height=Math.ceil(content.getBoundingClientRect().height);if(height>0&&Math.abs(height-(this.appliedHeight||0))>1){this.appliedHeight=height;this.style.height=height+'px';}});});this.sizeObserver.observe(content);}
      const dialog=this.shadowRoot.querySelector('dialog');
      dialog.addEventListener('close',()=>{this.shadowRoot.querySelector(`[data-action="add"][data-product="${this.lastAddedId||''}"]`)?.focus({preventScroll:true});});
      if(open&&this.revealed)dialog.showModal();
      if(focusAction)this.shadowRoot.querySelector(`[data-action="${focusAction}"]${focusLine?`[data-line="${CSS.escape(focusLine)}"]`:''}`)?.focus({preventScroll:true});
    }
    errorMessage() {if(this.uncertain)return 'The cart update could not be confirmed. Refresh the cart and check it before trying again.';return ({CART_UNAVAILABLE:'The cart could not be read. You can still open the original cart.',INVALID_DESTINATION:'Enter a valid destination.',NO_SHIPPING_AVAILABLE:'No delivery method is available for this address.',CART_CHANGED:'Your cart changed. Check delivery again.',BRIDGE_DISABLED:'The shop is temporarily unavailable.'})[this.error]||'This action could not be completed. Check your cart or try again.';}
    input(event) {if(event.target.closest('[data-address-form]')&&event.target.name){this.destination[event.target.name]=event.target.value;this.selection=null;this.quote=null;this.quoteRevision++;const checkout=this.shadowRoot.querySelector('[data-action="checkout"]');if(checkout)checkout.disabled=true;this.shadowRoot.querySelector('.native-cart-bottom')?.remove();this.shadowRoot.querySelector('.quote-choices')?.remove();}}
    change(event) {if(event.target.matches('[name="country"]')){this.input(event);this.render();}}
    async getQuote() {if(!this.cart||!this.destination.country||this.destination.country==='OTHER'||this.busy||this.uncertain)return;this.busy=true;this.error='';this.render();try{await this.request('quote',{quoteInput:this.quoteInput()});}catch(error){this.error=error.message;this.quote=null;}finally{this.busy=false;this.render();}}
    async click(event) {
      const category=event.target.closest('[data-category]'),filter=event.target.closest('[data-filter]');
      if(category){event.preventDefault();if(this.context.mode!=='shop'){location.assign('https://walkofberlin.com/category/all-products');return;}this.category=this.model.normaliseCategoryId(category.dataset.category);this.filter='all';this.render();return;}
      if(filter){event.preventDefault();this.filter=filter.dataset.filter;this.render();return;}
      const button=event.target.closest('[data-action]');if(!button)return;
      const action=button.dataset.action;
      if(action==='close-drawer'){this.shadowRoot.querySelector('dialog').close();return;}
      if(action==='poster'||action==='wall'){this.wall=action==='wall';this.render();return;}
      if(action==='product-minus'||action==='product-plus'){this.quantity=Math.max(1,Math.min(99,this.quantity+(action==='product-plus'?1:-1)));this.render();return;}
      if(action==='shipping'){this.selection=this.quote?.choices?.[Number(button.dataset.index)];if(this.selection){this.selection={carrierId:this.selection.carrierId,code:this.selection.code};this.quote=null;await this.getQuote();}return;}
      if(action==='native-fallback'){this.request('native-fallback').catch(()=>{});return;}
      if(this.busy)return;
      if(this.uncertain&&action!=='refresh'){this.error='UPDATE_NOT_CONFIRMED';this.render();return;}
      this.busy=true;this.error='';this.render();
      try {
        if(action==='refresh')await this.request('get');
        if(action==='add'){await this.request('add',{productId:button.dataset.product,quantity:Number(button.dataset.quantity)||1});this.lastAddedId=button.dataset.product;this.notice='Added to your cart';this.render();const dialog=this.shadowRoot.querySelector('dialog');if(this.revealed){dialog.showModal();dialog.querySelector('[data-action="close-drawer"]').focus();}}
        if(action==='minus'||action==='plus'){const line=this.cart?.lines.find(line=>line.lineItemId===button.dataset.line);if(line)await this.request('update',{lineItemId:line.lineItemId,quantity:line.quantity+(action==='plus'?1:-1)});}
        if(action==='remove')await this.request('remove',{lineItemId:button.dataset.line});
        if(action==='checkout'&&this.quote?.state==='READY')await this.request('checkout',{quoteInput:this.quoteInput()});
      }catch(error){this.error=error.message;}finally{this.busy=false;this.render();}
    }
  }
  customElements.define('bw-storefront', BWStorefront);
})();
