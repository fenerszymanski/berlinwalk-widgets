// Presentation and category metadata never supply a price, stock value or checkout identity.
// In production, pass a fresh native Wix read and the existing external product's Product schema.
const first = (...values) => values.find(value => value !== undefined && value !== null);
const list = value => Array.isArray(value) ? value : [];
const intersects = (a, b) => a.some(value => b.includes(value));
const cleanText = value => String(value ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
// Cards carry a short introduction. Full native descriptions belong on the product page.
export function cardSummary(value, maxLength = 240) {
  const html = String(value ?? '').replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '').replace(/<!--[\s\S]*?-->/g, '');
  const paragraph = Array.from(html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)).find(entry => cleanText(entry[1]).replace(/&nbsp;|&#160;/gi,'').trim());
  let text = cleanText(paragraph ? paragraph[1] : html.split(/<br\s*\/?>|<\/(?:div|section)>|\n\s*\n/i)[0]);
  const entities = {amp:'&',nbsp:' ',lt:'<',gt:'>',quot:'"',apos:"'",ndash:'–',mdash:'—',rsquo:'’',lsquo:'‘',ldquo:'“',rdquo:'”'};
  text = text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, key) => {
    if(key[0] !== '#')return entities[key.toLowerCase()] ?? match;
    const code = key[1].toLowerCase() === 'x' ? parseInt(key.slice(2),16) : Number(key.slice(1));
    return Number.isInteger(code) && code >= 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
  }).replace(/\s+/g, ' ').replace(/\s+([,.;:!?])/g,'$1').trim();
  // Plain-text legacy descriptions may have lost paragraph boundaries already.
  text = text.split(/\b(?:PRODUCT DETAILS|PRINTING AND DELIVERY|PRINTING & DELIVERY|ABOUT THE ARTWORK|FILE DETAILS|WHAT YOU(?:’|')LL RECEIVE)\b/i)[0].trim();
  if(!text)return '';
  const sentences = globalThis.Intl?.Segmenter
    ? Array.from(new Intl.Segmenter('en',{granularity:'sentence'}).segment(text), entry => entry.segment)
    : text.match(/.+?(?:[.!?](?=\s|$)|$)/g) || [text];
  let summary = '';
  for(const sentence of sentences.slice(0,2)) {
    const next = [summary,sentence.trim()].filter(Boolean).join(' ');
    if(next.length > maxLength)break;
    summary = next;
  }
  if(summary)return summary;
  const prefix = text.slice(0,maxLength-1), boundary = prefix.search(/\s+\S*$/);
  return boundary > 0 ? prefix.slice(0,boundary).replace(/[\s,;:–—-]+$/,'') + '…' : '';
}
const https = value => { try {const url = new URL(value); return url.protocol === 'https:' ? url.href : null;} catch {return null;} };
const majorToCents = value => {
  if (value === '' || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.round(number * 100) : null;
};
const keyOf = product => product.source === 'wix' ? product.wixProductId : product.externalSourceKey;

export function validateDefinitions(definitions) {
  for (const section of ['categories', 'fulfilments']) {
    if (!Array.isArray(definitions?.[section])) throw new TypeError(`Missing ${section} definitions`);
    const ids = definitions[section].map(item => item.id);
    if (new Set(ids).size !== ids.length || ids.some(id => !/^[a-z][a-z0-9-]*$/.test(id))) throw new TypeError(`Invalid or duplicate ${section} ids`);
  }
  for (const category of definitions.categories) {
    if (!category.label || !category.match || !category.shelf) throw new TypeError(`Incomplete category ${category.id}`);
    if (!(category.shelf.previewLimit > 0) || !(category.shelf.featureBelowCount > 0)) throw new TypeError(`Invalid shelf ${category.id}`);
  }
  return definitions;
}

function match(product, rule = {}) {
  const checks = [];
  if (rule.sources) checks.push(rule.sources.includes(product.source));
  if (rule.nativeProductTypes) checks.push(rule.nativeProductTypes.includes(product.nativeProductType));
  if (rule.nativeCategoryIds) checks.push(intersects(list(rule.nativeCategoryIds), list(product.nativeCategoryIds)));
  if (rule.externalSourceKeys) checks.push(rule.externalSourceKeys.includes(product.externalSourceKey));
  if (rule.presentationGroups) checks.push(list(rule.presentationGroups).includes(product.group));
  if (rule.productKeys) checks.push(rule.productKeys.includes(keyOf(product)));
  return checks.length > 0 && checks.every(Boolean);
}

// Wix V1 and the native product object from the public SSR read share these fields.
// The caller may query all categories once; adding a category does not add an independent price list.
export function adaptWixProducts(nativeProducts, presentation = []) {
  const meta = new Map(presentation.map(item => [item.wixProductId, item]));
  return list(nativeProducts).map(native => {
    const wixProductId = first(native.id, native._id);
    const item = meta.get(wixProductId) || {};
    const rawPrice = typeof native.price === 'object' ? native.price : null;
    const price = first(native.priceData, rawPrice);
    const major = first(price?.discountedPrice, native.discountedPrice, price?.price, typeof native.price === 'number' ? native.price : null);
    const currency = first(price?.currency, native.currency, native.convertedPriceData?.currency);
    const page = native.productPageUrl;
    const productUrl = https(typeof page === 'string' ? page : page?.base && page?.path ? new URL(page.path, page.base).href : native.productUrl);
    const stock = first(native.stock?.inStock, native.isInStock, native.inventory?.status === 'in_stock' ? true : null);
    const visible = first(native.visible, native.isVisible, true);
    const nativeCategoryIds = first(native.collectionIds, native.categoryIds, []);
    return {
      ...item,
      id: item.id || wixProductId,
      source: 'wix',
      approvedForShop: Boolean(item.wixProductId) && item.enabled !== false,
      wixProductId,
      nativeProductType: native.productType,
      nativeCategoryIds: [...nativeCategoryIds],
      name: item.name || native.name,
      nativeTitle: native.name,
      priceCents: majorToCents(major),
      currency,
      inStock: stock === true,
      status: visible && stock === true ? 'available' : 'unavailable',
      productUrl,
      nativeImageUrl: first(native.media?.mainMedia?.image?.url, native.media?.[0]?.fullUrl),
      description: item.description || cleanText(native.description),
      cardSummary: cardSummary(item.cardSummary || item.description || native.description),
      nativeAdditionalInfo: first(native.additionalInfoSections, native.additionalInfo, []),
      options: first(native.productOptions, native.options, []),
      requiresOptions: list(first(native.productOptions, native.options, [])).length > 0
    };
  });
}

// Each entry comes from a verified GET of an existing product page, not from the category config.
export function adaptExternalProducts(entries) {
  return list(entries).map(entry => {
    const schema = entry.productSchema || {};
    const offer = list(schema.offers)[0] || schema.offers || {};
    const item = entry.presentation || {};
    return {
      ...item,
      id: item.id || entry.sourceKey,
      source: 'external',
      approvedForShop: entry.verified === true,
      externalSourceKey: entry.sourceKey,
      wixProductId: null,
      nativeProductType: null,
      nativeCategoryIds: [],
      name: item.name || schema.name,
      nativeTitle: schema.name,
      priceCents: majorToCents(offer.price),
      currency: offer.priceCurrency,
      inStock: entry.verified === true && /(?:^|\/)InStock$/.test(offer.availability || ''),
      status: entry.verified === true && /(?:^|\/)InStock$/.test(offer.availability || '') ? 'available' : 'unavailable',
      productUrl: https(first(offer.url, schema.url, entry.sourceUrl)),
      nativeImageUrl: first(list(schema.image)[0], typeof schema.image === 'string' ? schema.image : null),
      description: item.description || schema.description || '',
      cardSummary: cardSummary(item.cardSummary || item.description || schema.description),
      options: [],
      requiresOptions: false
    };
  });
}

export function createCatalogModel(products, definitions) {
  validateDefinitions(definitions);
  const diagnostics = [];
  const unique = new Set();
  const active = [];
  for (const product of list(products)) {
    const key = `${product.source}:${keyOf(product)}`;
    if (!keyOf(product) || unique.has(key)) {diagnostics.push({id: product.id, reason: 'missing-or-duplicate-native-identity'}); continue;}
    unique.add(key);
    if (product.approvedForShop !== true) {diagnostics.push({id: product.id, reason: 'no-approved-presentation-binding'}); continue;}
    if (product.status !== 'available' || !product.inStock || !Number.isInteger(product.priceCents) || product.priceCents < 0 || !product.currency || !https(product.productUrl)) {
      diagnostics.push({id: product.id, reason: 'unavailable-or-unverified-commercial-data'}); continue;
    }
    const fulfilments = definitions.fulfilments.filter(item => match(product, item.match));
    if (fulfilments.length !== 1) {diagnostics.push({id: product.id, reason: 'missing-or-ambiguous-fulfilment'}); continue;}
    const categories = definitions.categories.filter(item => match(product, item.match));
    if (!categories.length) {diagnostics.push({id: product.id, reason: 'no-enabled-category-binding'}); continue;}
    const fulfilment = fulfilments[0];
    active.push({...product, categoryIds: categories.map(item => item.id), fulfilmentId: fulfilment.id, fulfilment,
      action: fulfilment.cartEligible ? product.requiresOptions ? 'choose-options' : 'add' : 'external',
      actionLabel: product.requiresOptions ? 'Choose options' : categories[0].actionLabel || fulfilment.actionLabel,
      detailLabel: categories[0].detailLabel || fulfilment.detailLabel});
  }
  const enabled = [...definitions.categories].sort((a, b) => a.order - b.order).filter(category => active.some(product => product.categoryIds.includes(category.id)));
  function categoryView(categoryId, filterId = 'all', {preview = false} = {}) {
    const category = definitions.categories.find(item => item.id === categoryId);
    if (!category) return null;
    const categoryProducts = active.filter(product => product.categoryIds.includes(categoryId));
    const filters = list(category.filters).map(filter => ({...filter,count:categoryProducts.filter(product=>match(product,filter.match)).length}));
    const filter = filters.find(item => item.id === filterId);
    let selected = filter ? categoryProducts.filter(product => match(product, filter.match)) : categoryProducts;
    if(preview && category.shelf.featuredProductIds?.length){const priority=category.shelf.featuredProductIds;selected=[...selected].sort((a,b)=>{const rank=p=>priority.includes(p.id)?priority.indexOf(p.id):priority.length;return rank(a)-rank(b);});}
    const limit = preview ? category.shelf.previewLimit : selected.length;
    return {
      id: category.id,
      title: category.label,
      description: category.description || '',
      totalCount: selected.length,
      products: selected.slice(0, limit),
      layout: selected.length < category.shelf.featureBelowCount ? 'feature' : 'grid',
      imageFit: category.shelf.imageFit || 'contain',
      allFilterLabel: category.allFilterLabel || `All ${category.label.toLowerCase()}`,
      filters,
      selectedFilterId: filter?.id || 'all',
      moreCategoryId: preview && selected.length > limit ? category.id : null,
      featureDescription: category.shelf.featureDescription || null,
      browseHref: category.browseHref || null,
      browseLabel: category.browseLabel || null,
      moreLabel: (category.shelf.moreLabel || 'View all').replace('{count}', String(selected.length))
    };
  }
  return {
    products: active,
    categories: enabled,
    tabs: [{id: 'all', label: definitions.allLabel || 'All'}, ...enabled.map(({id, label}) => ({id, label}))],
    sections: [...enabled].sort((a,b)=>(a.shelf.order??a.order)-(b.shelf.order??b.order)).map(category => categoryView(category.id, 'all', {preview: true})),
    diagnostics,
    getCategoryView: categoryView,
    normaliseCategoryId: id => id === 'all' || definitions.categories.some(category => category.id === id) ? id : 'all',
    getProduct: id => active.find(product => product.id === id) || null,
    getCartGroups: lines => definitions.fulfilments.filter(group => group.cartEligible).map(fulfilment => ({
      ...fulfilment,
      products: list(lines).filter(line => line.fulfilmentId === fulfilment.id)
    })).filter(group => group.products.length)
  };
}
