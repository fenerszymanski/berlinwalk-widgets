// Card previews only. Native variant stock and the existing cart resolver remain authoritative.
export const COLOR_SWATCHES=Object.freeze({
 White:['#FFFFFF','Weiß'],Natural:['#EFE6CF','Natur'],'Ice Grey':['#D9DDDC','Eisgrau'],'RS Sport Grey':['#A9ACAB','Sportgrau'],Ash:['#D2D3CF','Aschgrau'],Sand:['#CDBA94','Sand'],'Heather Dust':['#D9D1BC','Meliertes Beige'],Black:['#202020','Schwarz'],Charcoal:['#4B4F4E','Anthrazit'],'Dark Grey':['#414344','Dunkelgrau'],'Military Green':['#626A4D','Militärgrün'],Navy:['#252D3F','Marineblau']
});
export function apparelCardColors(product,native){
 if(product?.group!=='apparel'||product.apparelMedia?.version!==1)return [];
 const rows=Array.isArray(native?.variants)?native.variants:null;
 return Object.keys(product.apparelMedia.colors||{}).filter(color=>{
  const lead=product.apparelMedia.colors[color]?.lead;
  return COLOR_SWATCHES[color]&&lead?.kind==='garmentPreview'&&typeof lead.image==='string'&&lead.image&&(!rows||rows.some(row=>row.visible===true&&row.inStock===true&&row.choices?.Color===color));
 });
}
export function apparelCardSelection(product,selected,native){const colors=apparelCardColors(product,native);return colors.includes(selected)?selected:colors.includes(product?.apparelMedia?.defaultColor)?product.apparelMedia.defaultColor:colors[0]||null;}
export function apparelCardProduct(product,color){
 if(!apparelCardColors(product).includes(color))return product;
 const lead=product.apparelMedia.colors[color].lead;
 const target=new URL(product.productUrl);target.searchParams.set('color',color);
 return {...product,image:lead.image,alt:lead.alt,productUrl:target.href,apparelMedia:{...product.apparelMedia,defaultColor:color}};
}
export function colorName(color,german=false){return german?COLOR_SWATCHES[color]?.[1]||color:color;}
