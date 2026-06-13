// ============ JUYUB — shop / product / checkout / confirm ============
const { useState: uS, useEffect: uE, useMemo: uM } = React;

const WA_LINK = 'https://wa.me/message/HRQIN2XJSVOWO1'; // JUYUB WhatsApp click-to-chat
const waLink = () => WA_LINK;

/* ---------- Shop ---------- */
const ShopPage = () => {
  const { t, route, navigate, lang, products, categories, content } = useStore();
  const [cat, setCat] = uS(route.params.cat || 'all');
  const [sort, setSort] = uS('default');
  const [page, setPage] = uS(1);
  const [featSlide, setFeatSlide] = uS(0);
  const [shopSlide, setShopSlide] = uS(0);
  const touchRef = React.useRef(null);
  uE(() => { if (route.params.cat) setCat(route.params.cat); }, [route.params.cat]);
  // reset carousel when filter/sort changes
  uE(() => { setShopSlide(0); setPage(1); }, [cat, sort]);

  const counts = uM(() => {
    const c = {}; categories.forEach(k => c[k.id] = k.id === 'all' ? products.length : products.filter(p => Array.isArray(p.cats) ? p.cats.includes(k.id) : p.cat === k.id).length);
    return c;
  }, [products, categories]);
  const featuredList = products.filter(p => p.featured && !p.hidden).sort((a,b)=>(a.sortOrder??999)-(b.sortOrder??999));
  let list = (cat === 'all' ? [...products] : products.filter(p => Array.isArray(p.cats) ? p.cats.includes(cat) : p.cat === cat)).filter(p => !p.hidden);
  if (sort === 'low') list.sort((a, b) => a.price - b.price);
  if (sort === 'high') list.sort((a, b) => b.price - a.price);
  if (sort === 'default') list.sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
  const ITEMS_PER_PAGE = 15;
  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
  const pagedList = list.slice((page-1)*ITEMS_PER_PAGE, page*ITEMS_PER_PAGE);

  // detect mobile via window width
  const isMob = typeof window !== 'undefined' && window.innerWidth <= 860;
  const maxShopSlide = Math.max(0, pagedList.length - 1);

  return (
    <>
      <div className="page-hero">
        <div className="ftr-pattern" style={{ opacity: 0.06 }} />
        <div className="wrap">
          <span className="eyebrow">{t((content.shop && content.shop.eyebrow) || { en: 'The Collection', ar: 'المجموعة' })}</span>
          <h1 className="h1">{t((content.shop && content.shop.title) || { en: 'Carry Your Confidence', ar: 'احملي ثقتك' })}</h1>
          <p className="lede">{t((content.shop && content.shop.lede) || { en: 'A curated edit of leather bags and wallets — selected to complement the modern everyday.', ar: 'تشكيلة مختارة من شنط ومحافظ الجلد — منتقاة عشان تكمّل يومك العصري.' })}</p>
        </div>
      </div>
      {featuredList.length > 0 && (() => {
        const visibleCount = isMob ? 1 : 3;
        const maxSlide = Math.max(0, featuredList.length - visibleCount);
        const pct = isMob ? 90 : 100/3;
        const gapPx = isMob ? 14 : 20;
        return (
          <section className="wrap" style={{paddingTop:32,paddingBottom:0}}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
              <span style={{fontSize:12,fontWeight:700,letterSpacing:'0.1em',color:'var(--maroon)',textTransform:'uppercase'}}>★ {t({en:'Featured Picks',ar:'مختارات مميزة'})}</span>
              <div style={{flex:1,height:1,background:'var(--line)'}}/>
            </div>
            <div style={{position:'relative', margin:'0 -4px'}}>
              <div style={{overflow:'hidden', padding:'4px 4px 8px'}}
                onTouchStart={e=>{touchRef.current=e.touches[0].clientX;}}
                onTouchEnd={e=>{if(touchRef.current==null)return;const dx=touchRef.current-e.changedTouches[0].clientX;if(Math.abs(dx)>40){if(dx>0)setFeatSlide(s=>Math.min(maxSlide,s+1));else setFeatSlide(s=>Math.max(0,s-1));}touchRef.current=null;}}>
                <div className="feat-carousel-track" style={{display:'flex',gap:gapPx,transform:`translateX(calc(-${featSlide * pct}% - ${featSlide * gapPx}px))`,transition:'transform 0.4s cubic-bezier(0.4,0,0.2,1)'}}>
                  {featuredList.map(p => (
                    <div key={p.id} style={{flex:`0 0 calc(${pct}% - ${gapPx*(visibleCount-1)/visibleCount}px)`,minWidth:`calc(${pct}% - ${gapPx*(visibleCount-1)/visibleCount}px)`}}>
                      <ProductCard p={p} />
                    </div>
                  ))}
                </div>
              </div>
              {featSlide > 0 && (
                <button onClick={()=>setFeatSlide(s=>s-1)} style={{position:'absolute',top:'40%',left:4,transform:'translateY(-50%)',width:40,height:40,borderRadius:'50%',background:'var(--ivory)',border:'1px solid var(--line-strong)',boxShadow:'0 4px 14px rgba(0,0,0,.14)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,zIndex:3,color:'var(--ink)'}}>‹</button>
              )}
              {featSlide < maxSlide && (
                <button onClick={()=>setFeatSlide(s=>s+1)} style={{position:'absolute',top:'40%',right:4,transform:'translateY(-50%)',width:40,height:40,borderRadius:'50%',background:'var(--ivory)',border:'1px solid var(--line-strong)',boxShadow:'0 4px 14px rgba(0,0,0,.14)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,zIndex:3,color:'var(--ink)'}}>›</button>
              )}
            </div>
            {featuredList.length > 1 && (
              <div style={{display:'flex',justifyContent:'center',gap:7,marginTop:14}}>
                {Array.from({length:maxSlide+1},(_,i)=>i).map(i=>(
                  <button key={i} onClick={()=>setFeatSlide(i)} style={{width:i===featSlide?20:7,height:7,borderRadius:4,padding:0,background:i===featSlide?'var(--maroon)':'var(--taupe)',transition:'all .25s',border:'none',cursor:'pointer'}} />
                ))}
              </div>
            )}
          </section>
        );
      })()}
      <section className="wrap section-sm">
        <div className="shop-layout">
          <aside className="filters">
            <div className="filter-group">
              <h4>{t({ en: 'Category', ar: 'الفئة' })}</h4>
              <div className="filter-list">
                {categories.map(c => (
                  <button key={c.id} className={cat === c.id ? 'active' : ''} onClick={() => setCat(c.id)}>
                    <span>{t(c)}</span><span className="cnt">{counts[c.id]}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <h4>{t({ en: 'Good to know', ar: 'معلومة' })}</h4>
              <div className="stack gap-m" style={{ fontSize: 14, color: 'var(--ink-soft)' }}>
                {((content && content.goodToKnow) ? content.goodToKnow : (typeof SITE_CONTENT !== 'undefined' && SITE_CONTENT.goodToKnow) || []).map((item, i) => (
                  <span key={i} className="row gap-s">
                    {item.icon && item.icon.startsWith('http')
                      ? <img src={item.icon} alt="" style={{ width: 19, height: 19, objectFit: 'contain' }} />
                      : <Icon n={item.icon} style={{ width: 19, color: 'var(--maroon)' }} />
                    }
                    {t({ en: item.en, ar: item.ar })}
                  </span>
                ))}
              </div>
            </div>
            {content.shop && content.shop.sidebarImg && (
              <div style={{marginTop:24,borderRadius:12,overflow:'hidden',width:'100%'}}>
                <img src={content.shop.sidebarImg} alt="" style={{width:'100%',height:450,objectFit:'cover',display:'block',borderRadius:12}} />
              </div>
            )}
          </aside>
          <div>
            <div className="shop-toolbar">
              <div className="shop-toolbar-top">
                <span className="toolbar-count">{list.length} {t({ en: 'pieces', ar: 'قطعة' })}</span>
                <select className="select" value={sort} onChange={e => setSort(e.target.value)}>
                  <option value="low">{lang === 'en' ? 'Price: Low → High' : 'السعر: من الأقل'}</option>
                  <option value="high">{lang === 'en' ? 'Price: High → Low' : 'السعر: من الأعلى'}</option>
                </select>
              </div>
              <div className="chip-row">
                {categories.map(c => (
                  <button key={c.id} className={'chip mobile-cat ' + (cat === c.id ? 'active' : '')} onClick={() => setCat(c.id)}>{t(c)}</button>
                ))}
              </div>
            </div>

            {/* ── DESKTOP: normal grid ── */}
            <div className="grid-products shop-grid shop-grid-desk">
              {pagedList.map(p => <ProductCard key={p.id} p={p} />)}
            </div>

            {/* ── MOBILE: carousel — identical to Featured Picks ── */}
            <div className="shop-carousel-mob">
              <div style={{position:'relative', margin:'0 -4px'}}>
                <div style={{overflow:'hidden', padding:'4px 4px 8px'}}
                  onTouchStart={e=>{touchRef.current=e.touches[0].clientX;}}
                  onTouchEnd={e=>{if(touchRef.current==null)return;const dx=touchRef.current-e.changedTouches[0].clientX;if(Math.abs(dx)>40){if(dx>0)setShopSlide(s=>Math.min(maxShopSlide,s+1));else setShopSlide(s=>Math.max(0,s-1));}touchRef.current=null;}}>
                  <div style={{display:'flex',gap:14,transform:`translateX(calc(-${shopSlide * 90}% - ${shopSlide * 14}px))`,transition:'transform 0.4s cubic-bezier(0.4,0,0.2,1)'}}>
                    {pagedList.map(p => (
                      <div key={p.id} style={{flex:'0 0 calc(90% - 0px)',minWidth:'calc(90% - 0px)'}}>
                        <ProductCard p={p} />
                      </div>
                    ))}
                  </div>
                </div>
                {shopSlide > 0 && (
                  <button onClick={()=>setShopSlide(s=>s-1)} style={{position:'absolute',top:'40%',left:4,transform:'translateY(-50%)',width:40,height:40,borderRadius:'50%',background:'var(--ivory)',border:'1px solid var(--line-strong)',boxShadow:'0 4px 14px rgba(0,0,0,.14)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,zIndex:3,color:'var(--ink)'}}>‹</button>
                )}
                {shopSlide < maxShopSlide && (
                  <button onClick={()=>setShopSlide(s=>s+1)} style={{position:'absolute',top:'40%',right:4,transform:'translateY(-50%)',width:40,height:40,borderRadius:'50%',background:'var(--ivory)',border:'1px solid var(--line-strong)',boxShadow:'0 4px 14px rgba(0,0,0,.14)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,zIndex:3,color:'var(--ink)'}}>›</button>
                )}
              </div>
              {/* Dots */}
              <div style={{display:'flex',justifyContent:'center',gap:7,marginTop:14,flexWrap:'wrap'}}>
                {pagedList.map((_,i)=>(
                  <button key={i} onClick={()=>setShopSlide(i)} style={{width:i===shopSlide?20:7,height:7,borderRadius:4,padding:0,background:i===shopSlide?'var(--maroon)':'var(--taupe)',transition:'all .25s',border:'none',cursor:'pointer'}} />
                ))}
              </div>
              {totalPages > 1 && (
                <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:20}}>
                  <button onClick={()=>{setPage(p=>Math.max(1,p-1));setShopSlide(0);window.scrollTo(0,300);}} disabled={page===1}
                    style={{padding:'9px 20px',borderRadius:8,border:'1px solid var(--line-strong)',background:'var(--bg)',fontSize:13,opacity:page===1?0.4:1,cursor:page===1?'not-allowed':'pointer'}}>
                    ← {t({en:'Prev page',ar:'السابق'})}
                  </button>
                  <button onClick={()=>{setPage(p=>Math.min(totalPages,p+1));setShopSlide(0);window.scrollTo(0,300);}} disabled={page===totalPages}
                    style={{padding:'9px 20px',borderRadius:8,border:'1px solid var(--line-strong)',background:'var(--bg)',fontSize:13,opacity:page===totalPages?0.4:1,cursor:page===totalPages?'not-allowed':'pointer'}}>
                    {t({en:'Next page',ar:'التالي'})} →
                  </button>
                </div>
              )}
            </div>

            {/* Desktop pagination */}
            {totalPages > 1 && (
              <div className="shop-pagination-desk" style={{display:'flex',justifyContent:'center',alignItems:'center',gap:8,marginTop:32,flexWrap:'wrap'}}>
                <button onClick={()=>{setPage(p=>Math.max(1,p-1));window.scrollTo(0,300);}} disabled={page===1}
                  style={{padding:'8px 18px',borderRadius:8,border:'1px solid var(--border)',background:'var(--bg)',cursor:page===1?'not-allowed':'pointer',opacity:page===1?0.4:1,fontSize:13}}>
                  ← {t({en:'Prev',ar:'السابق'})}
                </button>
                {Array.from({length:totalPages},(_,i)=>i+1).map(n=>(
                  <button key={n} onClick={()=>{setPage(n);window.scrollTo(0,300);}}
                    style={{width:36,height:36,borderRadius:8,border:'1px solid',fontSize:13,fontWeight:n===page?700:400,cursor:'pointer',
                      borderColor:n===page?'var(--maroon)':'var(--border)',background:n===page?'var(--maroon)':'var(--bg)',color:n===page?'#fff':'var(--ink)'}}>
                    {n}
                  </button>
                ))}
                <button onClick={()=>{setPage(p=>Math.min(totalPages,p+1));window.scrollTo(0,300);}} disabled={page===totalPages}
                  style={{padding:'8px 18px',borderRadius:8,border:'1px solid var(--border)',background:'var(--bg)',cursor:page===totalPages?'not-allowed':'pointer',opacity:page===totalPages?0.4:1,fontSize:13}}>
                  {t({en:'Next',ar:'التالي'})} →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
const ProductPage = () => {
  const { t, money, navigate, route, addToCart, openCart, toast, lang, products, categories } = useStore();
  const p = products.find(x => x.id === route.params.id) || products[0];
  const firstInStock = p.variants.findIndex(v => v.stock);
  const [vi, setVi] = uS(firstInStock < 0 ? 0 : firstInStock);
  const [qty, setQty] = uS(1);
  const [activeImg, setActiveImg] = uS(p.variants[firstInStock < 0 ? 0 : firstInStock].img);
  const [lightbox, setLightbox] = uS(false);
  const [lbIdx, setLbIdx] = uS(0);
  uE(() => {
    if (lightbox) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('lightbox-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('lightbox-open');
    }
    return () => { document.body.style.overflow = ''; document.body.classList.remove('lightbox-open'); };
  }, [lightbox]);
  uE(() => {
    const fi = firstInStock < 0 ? 0 : firstInStock;
    setVi(fi); setQty(1); window.scrollTo(0, 0);
  }, [p.id]);
  const v = p.variants[vi];
  const cat = categories.find(c => c.id === p.cat);
  const related = products.filter(x => x.id !== p.id).slice(0, 4);
  // gallery is scoped to the selected colour: its hero image + that colour's detail shots
  const thumbs = [v.img, ...(v.shots || [])];
  // when colour (or product) changes, snap the main image back to that colour's hero
  uE(() => { setActiveImg(v.img); }, [vi, p.id]);

  const add = () => { addToCart(p, v, qty); toast(t({ en: 'Added to cart', ar: 'اتضاف للسلة' })); openCart(); };
  const waMsg = t({
    en: `Hi JUYUB! I'd like to order:\n• ${t(p.name)} (${t(v.color)}) ×${qty}\nSKU ${p.sku} — ${money(p.price * qty)}`,
    ar: `أهلاً چيوب! عايزة أطلب:\n• ${t(p.name)} (${t(v.color)}) ×${qty}\nكود ${p.sku} — ${money(p.price * qty)}`,
  });

  return (
    <section className="wrap section-sm">
      <div className="crumbs" style={{ marginBottom: 26 }}>
        <a onClick={() => navigate('home')}>{t({ en: 'Home', ar: 'الرئيسية' })}</a><Icon n="arrow" style={{ width: 13 }} />
        <a onClick={() => navigate('shop')}>{t({ en: 'Shop', ar: 'المتجر' })}</a><Icon n="arrow" style={{ width: 13 }} />
        <span className="muted">{t(p.name)}</span>
      </div>
      <div className="pdp">
        <div className="pdp-gallery">
          <div className="pdp-main" onClick={()=>{setLightbox(true);setLbIdx(thumbs.indexOf(activeImg)<0?0:thumbs.indexOf(activeImg));}} style={{cursor:'zoom-in',position:'relative'}}>
            {!v.stock && <div className="card-oos"><span>{t({ en: 'Out of stock', ar: 'نفد المخزون' })}</span></div>}
            <img src={activeImg} alt={t(p.name)} />
            <div style={{position:'absolute',bottom:10,right:10,background:'rgba(0,0,0,0.28)',borderRadius:6,padding:'4px 8px',color:'#fff',fontSize:11,pointerEvents:'none',backdropFilter:'blur(4px)'}}>⤢</div>
          </div>
          {lightbox && ReactDOM.createPortal(
            <div id="juyub-lightbox" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.97)',zIndex:2147483647,display:'flex',alignItems:'center',justifyContent:'center'}} onClick={()=>setLightbox(false)}>
              <button onClick={()=>setLightbox(false)} style={{position:'fixed',top:16,right:16,background:'rgba(255,255,255,0.15)',border:'none',color:'#fff',fontSize:22,width:44,height:44,borderRadius:'50%',cursor:'pointer'}}>✕</button>
              <div style={{position:'fixed',top:18,left:'50%',transform:'translateX(-50%)',color:'rgba(255,255,255,0.5)',fontSize:13,zIndex:10}}>{lbIdx+1} / {thumbs.length}</div>
              {lbIdx>0 && <button onClick={e=>{e.stopPropagation();setLbIdx(i=>i-1);}} style={{position:'fixed',left:12,top:'50%',transform:'translateY(-50%)',background:'rgba(255,255,255,0.12)',border:'none',color:'#fff',fontSize:32,width:52,height:52,borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>‹</button>}
              {lbIdx<thumbs.length-1 && <button onClick={e=>{e.stopPropagation();setLbIdx(i=>i+1);}} style={{position:'fixed',right:12,top:'50%',transform:'translateY(-50%)',background:'rgba(255,255,255,0.12)',border:'none',color:'#fff',fontSize:32,width:52,height:52,borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>›</button>}
              <div onClick={e=>e.stopPropagation()} style={{overflow:'hidden',borderRadius:8,cursor:'crosshair',maxWidth:'80vw',maxHeight:'80vh'}}
                onMouseMove={e=>{const r=e.currentTarget.getBoundingClientRect();const x=((e.clientX-r.left)/r.width*100).toFixed(1);const y=((e.clientY-r.top)/r.height*100).toFixed(1);const im=e.currentTarget.querySelector('img');im.style.transformOrigin=x+'% '+y+'%';im.style.transform='scale(2.2)';}}
                onMouseLeave={e=>{e.currentTarget.querySelector('img').style.transform='scale(1)';}}>
                <img src={thumbs[lbIdx]||activeImg} alt={t(p.name)} style={{display:'block',maxWidth:'80vw',maxHeight:'80vh',objectFit:'contain',transition:'transform 0.15s ease'}} />
              </div>
              {thumbs.length>1 && (
                <div style={{position:'fixed',bottom:14,left:'50%',transform:'translateX(-50%)',display:'flex',gap:8,zIndex:10}}>
                  {thumbs.map((img,i)=>(
                    <div key={i} onClick={e=>{e.stopPropagation();setLbIdx(i);}} style={{width:46,height:46,borderRadius:6,overflow:'hidden',cursor:'pointer',border:'2px solid',borderColor:i===lbIdx?'#fff':'rgba(255,255,255,0.25)',opacity:i===lbIdx?1:0.55,transition:'all 0.2s'}}>
                      <img src={img} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                    </div>
                  ))}
                </div>
              )}
            </div>,
          document.body)}
          {thumbs.length > 1 && (
            <div className="pdp-thumbs">
              {thumbs.map((img, i) => (
                <button key={i} className={'pdp-thumb ' + (activeImg === img ? 'active' : '')} onClick={() => setActiveImg(img)} aria-label={t(v.color)}><img src={img} alt={t(p.name)} /></button>
              ))}
            </div>
          )}
        </div>
        <div className="pdp-info">
          <div className="stack gap-s">
            <span className="pdp-sku">{t(cat)} · {p.sku}</span>
            <h1 className="h1" style={{ fontSize: 'clamp(30px,4vw,50px)' }}>{t(p.name)}</h1>
            <span className="eyebrow" style={{ color: 'var(--ink-soft)' }}>{t(p.tagline)}</span>
          </div>
          <div className="pdp-price">
            {money(p.price)}
            {p.compareAt > p.price && (
              <>
                <span className="price-was">{money(p.compareAt)}</span>
                <span className="price-off">-{Math.round((1 - p.price / p.compareAt) * 100)}%</span>
              </>
            )}
          </div>
          <p className="lede" style={{ fontSize: 16 }}>{t(p.blurb)}</p>

          <div>
            <div className="opt-label">{t({ en: 'Color', ar: 'اللون' })}<span className="val">{t(v.color)}</span></div>
            <div className="swatch-row">
              {p.variants.map((x, i) => (
                <SwatchDot key={i} className={'swatch ' + (i === vi ? 'active ' : '') + (x.stock ? '' : 'oos')} hex={x.color.hex} onClick={() => setVi(i)} title={t(x.color)} />
              ))}
            </div>
          </div>

          <div className="row gap-m" style={{ flexWrap: 'wrap' }}>
            <div className="qty">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}><Icon n="minus" style={{ width: 16 }} /></button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)}><Icon n="plus" style={{ width: 16 }} /></button>
            </div>
            <div className="pdp-cta" style={{ flex: 1 }}>
              <button className="btn btn-primary btn-lg" disabled={!v.stock} onClick={add}>
                {v.stock ? t({ en: 'Add to cart', ar: 'أضف للسلة' }) : t({ en: 'Out of stock', ar: 'نفد المخزون' })}
              </button>
            </div>
          </div>
          <a className="btn btn-wa btn-block" href={waLink(waMsg)} target="_blank" rel="noopener">
            <Icon n="whatsapp" style={{ width: 19 }} />{t({ en: 'Order on WhatsApp', ar: 'اطلبي على واتساب' })}
          </a>

          <dl className="specs">
            {Object.entries(p.specs).filter(([k,val])=>t(val)&&t(val).trim()).map(([k, val]) => (
              <div className="spec-row" key={k}>
                <dt>{SPEC_LABELS[k] ? t({ en: SPEC_LABELS[k].en, ar: SPEC_LABELS[k].ar }) : k}</dt>
                <dd>{t(val)}</dd>
              </div>
            ))}
            {(p.extraSpecs||[]).filter(s=>s.label&&t(s.label)).map((s,i)=>(
              <div className="spec-row" key={'ex'+i}>
                <dt>{t(s.label)}</dt>
                <dd>{t(s.value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="section">
        <div className="sec-head">
          <div className="stack"><span className="eyebrow">{t({ en: 'You may also like', ar: 'ممكن يعجبك كمان' })}</span><h2 className="h2">{t({ en: 'Complete the look', ar: 'كمّلي الإطلالة' })}</h2></div>
          <button className="btn btn-ghost" onClick={() => navigate('shop')}>{t({ en: 'View all', ar: 'عرض الكل' })}</button>
        </div>
        <div className="grid-products home-grid">{related.map(r => <ProductCard key={r.id} p={r} />)}</div>
      </div>
    </section>
  );
};

const SPEC_LABELS = {
  size: { en: 'Size', ar: 'المقاس' },
  material: { en: 'Material', ar: 'الخامة' },
  strap: { en: 'Strap', ar: 'الحزام' },
  closure: { en: 'Closure', ar: 'الإغلاق' },
  interior: { en: 'Interior', ar: 'من الداخل' },
};

/* ---------- Checkout ---------- */
const CheckoutPage = () => {
  const { t, money, cart, subtotal, navigate, lang, placeOrder, shipRates } = useStore();
  const [f, setF] = uS({ name: '', phone: '', gov: '', city: '', address: '', notes: '' });
  const [payMethod, setPayMethod] = uS('cod');
  const [errs, setErrs] = uS({});
  const set = (k) => (e) => setF(s => ({ ...s, [k]: e.target.value }));
  const freeAll  = (() => { try { return JSON.parse(localStorage.getItem('juyub_freeAll')||'false'); } catch{return false;} })();
  const freeGovs = (() => { try { return JSON.parse(localStorage.getItem('juyub_freeGovs')||'{}'); } catch{return {};} })();
  const shipping = f.gov ? ((freeAll || freeGovs[f.gov]) ? 0 : (shipRates[f.gov] ?? 0)) : null; // null until governorate chosen
  const total = subtotal + (shipping || 0);

  uE(() => window.scrollTo(0, 0), []);
  if (cart.length === 0) {
    return (
      <section className="wrap section center">
        <h2 className="h2">{t({ en: 'Your bag is empty', ar: 'سلتك فاضية' })}</h2>
        <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => navigate('shop')}>{t({ en: 'Browse the collection', ar: 'تصفّحي المجموعة' })}</button>
      </section>
    );
  }
  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!f.name.trim()) er.name = t({ en: 'Required', ar: 'مطلوب' });
    if (!/^01[0-9]{9}$/.test(f.phone.replace(/\s/g, ''))) er.phone = t({ en: 'Enter a valid Egyptian number', ar: 'اكتبي رقم مصري صحيح' });
    if (!f.gov) er.gov = t({ en: 'Required', ar: 'مطلوب' });
    if (!f.address.trim()) er.address = t({ en: 'Required', ar: 'مطلوب' });
    setErrs(er);
    if (Object.keys(er).length === 0) placeOrder({ ...f, payMethod }, shipping || 0);
  };
  // plain function (NOT a component) → returns elements inline, avoids remount/focus-loss
  const field = ({ k, label, type = 'text', ph, full, ac }) => (
    <div className="field" style={full ? { gridColumn: '1 / -1' } : null}>
      <label>{t(label)} <span className="req">*</span></label>
      <input className={'input ' + (errs[k] ? 'err' : '')} type={type} name={k} autoComplete={ac}
        inputMode={type === 'tel' ? 'tel' : undefined}
        value={f[k]} onChange={set(k)} placeholder={ph ? t(ph) : ''} />
      {errs[k] && <span className="msg">{errs[k]}</span>}
    </div>
  );
  return (
    <section className="wrap section-sm">
      <div className="crumbs" style={{ marginBottom: 24 }}>
        <a onClick={() => navigate('shop')}>{t({ en: 'Shop', ar: 'المتجر' })}</a><Icon n="arrow" style={{ width: 13 }} />
        <span className="muted">{t({ en: 'Checkout', ar: 'إتمام الطلب' })}</span>
      </div>
      <h1 className="h1" style={{ marginBottom: 30 }}>{t({ en: 'Checkout', ar: 'إتمام الطلب' })}</h1>
      <form className="checkout" onSubmit={submit} autoComplete="on">
        <div>
          <h3 className="h3" style={{ marginBottom: 18 }}>{t({ en: 'Delivery details', ar: 'بيانات التوصيل' })}</h3>
          <div className="grid-2">
            {field({ k: 'name', label: { en: 'Full name', ar: 'الاسم بالكامل' }, full: true, ac: 'name' })}
            {field({ k: 'phone', label: { en: 'Phone number', ar: 'رقم الموبايل' }, type: 'tel', ac: 'tel', ph: { en: '01XXXXXXXXX', ar: '01XXXXXXXXX' } })}
            <div className="field">
              <label>{t({ en: 'Governorate', ar: 'المحافظة' })} <span className="req">*</span></label>
              <select className={'input ' + (errs.gov ? 'err' : '')} name="gov" autoComplete="address-level1" value={f.gov} onChange={set('gov')}>
                <option value="">{t({ en: 'Select…', ar: 'اختاري…' })}</option>
                {GOVERNORATES.map(g => <option key={g} value={g}>{lang === 'ar' ? (GOV_AR[g] || g) : g}</option>)}
              </select>
              {errs.gov && <span className="msg">{errs.gov}</span>}
            </div>
            {field({ k: 'city', label: { en: 'Area / City', ar: 'المنطقة / المدينة' }, ac: 'address-level2' })}
            {field({ k: 'address', label: { en: 'Street address', ar: 'العنوان بالتفصيل' }, full: true, ac: 'street-address' })}
          </div>
          <div className="field">
            <label>{t({ en: 'Order notes (optional)', ar: 'ملاحظات (اختياري)' })}</label>
            <textarea className="input" name="notes" rows="3" value={f.notes} onChange={set('notes')} placeholder={t({ en: 'Landmark, preferred delivery time…', ar: 'علامة مميزة، وقت توصيل مفضل…' })} />
          </div>

          <h3 className="h3" style={{ margin: '14px 0 14px' }}>{t({ en: 'Payment', ar: 'الدفع' })}</h3>
          {[
            {id:'cod', en:'Cash on delivery', ar:'الدفع عند الاستلام', descEn:'Pay in cash when your order arrives. No deposit needed.', descAr:'ادفعي كاش لما الأوردر يوصلك. من غير أي مقدم.'},
            {id:'instapay', en:'InstaPay', ar:'انستاباي', descEn:'Paid in full before shipment.', descAr:'الدفع بشكل كامل قبل شحن المنتج.'},
          ].map(opt => (
            <div key={opt.id} className="pay-opt" onClick={()=>setPayMethod(opt.id)}
              style={{cursor:'pointer',marginBottom:10,border:`2px solid ${payMethod===opt.id?'var(--maroon)':'transparent'}`,background:payMethod===opt.id?'#fff5f5':'var(--bg)'}}>
              <div style={{width:20,height:20,borderRadius:'50%',border:'2px solid',borderColor:payMethod===opt.id?'var(--maroon)':'#ccc',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                {payMethod===opt.id&&<div style={{width:10,height:10,borderRadius:'50%',background:'var(--maroon)'}}/>}
              </div>
              <div>
                <strong style={{display:'block'}}>{t({en:opt.en,ar:opt.ar})}</strong>
                <span className="muted" style={{fontSize:14}}>{t({en:opt.descEn,ar:opt.descAr})}</span>
              </div>
            </div>
          ))}
        </div>

        <aside className="osummary">
          <h3 className="h3" style={{ marginBottom: 8 }}>{t({ en: 'Order summary', ar: 'ملخص الطلب' })}</h3>
          {cart.map(it => (
            <div className="li-mini" key={it.key}>
              <img src={it.img} alt="" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{t(it.name)}</div>
                <div className="muted" style={{ fontSize: 12.5 }}>{t(it.color)} · ×{it.qty}</div>
              </div>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{money(it.price * it.qty)}</span>
            </div>
          ))}
          <div className="stack gap-s" style={{ padding: '16px 0' }}>
            <div className="summary-row"><span>{t({ en: 'Subtotal', ar: 'الإجمالي الفرعي' })}</span><span>{money(subtotal)}</span></div>
            <div className="summary-row">
              <span>{t({ en: 'Shipping', ar: 'الشحن' })}</span>
              <span>{shipping === null ? t({ en: 'Select governorate', ar: 'اختاري المحافظة' }) : (shipping === 0 ? t({ en: 'Free', ar: 'مجاني' }) : money(shipping))}</span>
            </div>
          </div>
          <div className="summary-row total" style={{ borderTop: '1px solid var(--line)', paddingTop: 16 }}>
            <span>{t({ en: 'Total', ar: 'الإجمالي' })}</span><span>{money(total)}</span>
          </div>
          <div className="cod-note" style={{ margin: '16px 0' }}><Icon n="cash" />{payMethod === 'instapay' ? t({ en: 'You pay before shipping', ar: 'بتدفعي قبل الشحن' }) : t({ en: 'You pay on delivery', ar: 'بتدفعي عند الاستلام' })}</div>
          <button className="btn btn-primary btn-lg btn-block" type="submit">{t({ en: 'Place order', ar: 'تأكيد الطلب' })}</button>
        </aside>
      </form>
    </section>
  );
};

/* ---------- Confirmation ---------- */
const ConfirmPage = () => {
  const { t, money, navigate, lastOrder } = useStore();
  uE(() => window.scrollTo(0, 0), []);
  const o = lastOrder;
  if (!o) { navigate('home'); return null; }
  const isInstaPay = o.payMethod === 'instapay';
  const payLabel = isInstaPay ? 'InstaPay' : 'Cash on delivery';
  const payLabelAr = isInstaPay ? 'انستاباي' : 'دفع عند الاستلام';
  const waMsg = t({
    en: `Hi JUYUB! Confirming my order ${o.id}\nName: ${o.f.name}\nPhone: ${o.f.phone}\n${o.f.gov}, ${o.f.address}\nTotal: ${money(o.total)} (${payLabel})`,
    ar: `أهلاً چيوب! بأكد أوردري ${o.id}\nالاسم: ${o.f.name}\nالموبايل: ${o.f.phone}\n${o.f.gov}، ${o.f.address}\nالإجمالي: ${money(o.total)} (${payLabelAr})`,
  });
  return (
    <section className="wrap confirm">
      <img className="confirm-emblem" src="https://juyub.odoo.com/web/image/1082" alt="" />
      <span className="eyebrow">{t({ en: 'Order received', ar: 'تم استلام الطلب' })}</span>
      <h1 className="h1">{t({ en: 'Thank you, ', ar: 'شكراً ليكي، ' })}{o.f.name.split(' ')[0]}!</h1>
      <p className="lede" style={{ textAlign: 'center' }}>{isInstaPay ? t({ en: 'We’ve received your order. A team member will contact you on WhatsApp to arrange InstaPay payment.', ar: 'استلمنا طلبك. هيتواصل معاكي أحد أفراد الفريق على واتساب لترتيب الدفع عبر انستاباي.' }) : t({ en: 'We’ve received your order and our team will confirm everything with you shortly. Pay in cash when it arrives.', ar: 'استلمنا طلبك وفريقنا هيأكد معاكي كل حاجة قريب. ادفعي كاش لما يوصلك.' })}</p>
      <div className="confirm-card">
        <div className="row between" style={{ marginBottom: 14 }}>
          <span className="muted">{t({ en: 'Order number', ar: 'رقم الطلب' })}</span>
          <strong>{o.id}</strong>
        </div>
        {o.items.map(it => (
          <div className="li-mini" key={it.key}>
            <img src={it.img} alt="" />
            <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{t(it.name)}</div><div className="muted" style={{ fontSize: 12.5 }}>{t(it.color)} · ×{it.qty}</div></div>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{money(it.price * it.qty)}</span>
          </div>
        ))}
        <div className="summary-row total" style={{ paddingTop: 16 }}><span>{t({ en: 'Total (COD)', ar: 'الإجمالي (عند الاستلام)' })}</span><span>{money(o.total)}</span></div>
      </div>
      <div className="row gap-m" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        {isInstaPay && (
        <div style={{background:'#fff8e1',border:'1px solid #ffd54f',borderRadius:12,padding:'16px 20px',marginBottom:20,textAlign:'center'}}>
          <div style={{fontWeight:700,fontSize:15,marginBottom:6}}>📲 {t({en:'Payment Required',ar:'مطلوب الدفع'})}</div>
          <div style={{fontSize:14,color:'#666'}}>{t({en:'A team member will contact you on WhatsApp with the InstaPay number to complete your payment.',ar:'هيتواصل معاك أحد أفراد الفريق على واتساب برقم الانستاباي عشان تكمل الدفع.'})}</div>
        </div>
      )}
      <a className="btn btn-wa btn-lg" href={waLink(waMsg)} target="_blank" rel="noopener"><Icon n="chat" style={{ width: 19 }} />{t({ en: 'Chat with us on WhatsApp', ar: 'كلّمينا على واتساب' })}</a>
        <button className="btn btn-outline btn-lg" onClick={() => navigate('shop')}>{t({ en: 'Continue shopping', ar: 'كمّلي تسوق' })}</button>
      </div>
    </section>
  );
};

Object.assign(window, { ShopPage, ProductPage, CheckoutPage, ConfirmPage, SPEC_LABELS, waLink });







