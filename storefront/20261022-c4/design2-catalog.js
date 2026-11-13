// Presentation-only helpers. Native catalogue eligibility always wins.
export const normaliseSearch = value => String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim();
export const SEARCH_SYNONYMS = Object.freeze([
 ['fernsehturm','tv tower','television tower'],['mauer','wall','divided berlin'],['weltzeituhr','world clock'],
 ['geisterbahnhofe','ghost stations'],['siegessaule','victory column'],['bezirk','district'],['bezirke','districts'],
 ['spati','spaeti','late shop'],['schonhauser','schoenhauser'],['neukolln','neukoelln'],['kopenick','koepenick'],
 ['markthallen','market halls'],['strassenbahn','tram'],['ubahn','u bahn','underground'],['flughafen','airport','tempelhof'],
 ['kalender','calendar'],['zeitung','newspaper'],['geschenk','gift'],['luftbild','aerial','1928'],
 ['geburtstag','birthday'],['hochzeit','wedding'],['foto','photo'],['bahnhof','station'],['grunewald','forest','wald'],
 ['download','printable','digital','selbstdrucken'],['abend','evening','night'],['courtyard','hinterhof','hof'],['fenster','window']
].map(row=>row.map(normaliseSearch)));
export function matchesSearch(product,query,{family,translations={}}={}) {
  const source=[product.name,product.place,product.group,product.typeLine,...(family?.themes||[])];
  const hay=normaliseSearch([...source,...source.map(s=>translations['design2:'+s]||translations[s]||'')].join(' '));
  const expanded=[hay,...SEARCH_SYNONYMS.filter(row=>row.some(term=>(' '+hay+' ').includes(' '+term+' '))).flat()].join(' ');
  return normaliseSearch(query).split(' ').filter(Boolean).every(word=>expanded.includes(word));
}
export function familyFor(data,id) {return data?.families?.find(f=>f.members.includes(id));}
export function excludedFamilies(data,family) {return new Set([family?.id,...(data?.bundleContents?.[family?.id]||[])]);}
// Choose all rows together: a family can occur only once across the whole page.
export function recommendationRows(data,product,products,related=[]) {
 const family=familyFor(data,product.id),excluded=excludedFamilies(data,family);
 const digital=p=>p.kind==='digital'||p.nativeProductType==='digital';
 const key=p=>familyFor(data,p.id)?.id||p.id;
 const used=new Set([...excluded,key(product)]), rows={similar:[],'hang-together':[],explore:[]};
 const eligible=(p,kind)=>p&&p.id!==product.id&&p.visible!==false&&p.inStock===true&&p.status==='available'&&!used.has(key(p))&&
  (kind==='explore'?p.action==='external':p.fulfilment?.cartEligible===true)&&
  p.wixProductId!==product.alternativeProductId&&p.alternativeProductId!==product.wixProductId;
 const members=(id,kind)=>{const f=data.families.find(f=>f.id===id);return (kind==='explore'?f?.exploreMembers:f?.eligibleMembers)?.map(id=>products.find(p=>p.id===id)).filter(Boolean).sort((a,b)=>Number(digital(b)===digital(product))-Number(digital(a)===digital(product)))||[];};
 const editorial=kind=>(family?.[{similar:'similar','hang-together':'hangTogether',explore:'explore'}[kind]]||[]).flatMap(id=>members(id,kind));
 // Same collection, then same format/kind, then today's related() order, then catalogue order.
 const sameCollection=p=>(product.group&&p.group===product.group)||p.nativeCategoryIds?.some(id=>product.nativeCategoryIds?.includes(id))||familyFor(data,p.id)?.themes.some(t=>family?.themes.includes(t));
 const fallback=[...products.filter(sameCollection),...products.filter(p=>digital(p)===digital(product)),...related,...products];
 const fill=(kind,candidates,limit)=>{for(const p of candidates){if(rows[kind].length===limit)break;if(eligible(p,kind)){rows[kind].push(p);used.add(key(p));}}};
 // Reserve each row's editorial choices before filling gaps in either row.
 fill('similar',editorial('similar'),3);fill('hang-together',editorial('hang-together'),2);
 fill('similar',fallback,3);fill('hang-together',fallback,2);
 fill('explore',editorial('explore'),1);
 return rows;
}
export function chooseRecommendations(data,product,products,kind) {return recommendationRows(data,product,products)[kind];}
export function nativeRecommendationEligible(row) {
 if(!row||row.visible!==true||row.inStock!==true||!Number.isFinite(row.discountedPrice??row.price)||(row.discountedPrice??row.price)<0)return false;
 return row.requiresOptions===true
  ? row.variants?.some(v=>v.visible===true&&v.inStock===true&&Number.isFinite(v.price)&&v.price>=0)===true
  : row.directAddAllowed===true;
}
