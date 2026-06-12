// ============ JUYUB — full site content editor (Admin → Content) ============
const { useState: ceUS } = React;

// deep get/set by dotted path
const ceGet = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
const ceSet = (obj, path, val) => {
  const next = JSON.parse(JSON.stringify(obj));
  const ks = path.split('.'); let o = next;
  for (let i = 0; i < ks.length - 1; i++) o = o[ks[i]];
  o[ks[ks.length - 1]] = val;
  return next;
};

const ContentEditor = () => {
  const { t, lang, content, saveContent, resetContent, toast, products, categories, addCategory, deleteCategory } = useStore();
  const [c, setC] = ceUS(() => JSON.parse(JSON.stringify({ ...SITE_CONTENT, ...content })));
  const [sec, setSec] = ceUS('general');
  const L = (en, ar) => t({ en, ar });

  const upd = (path, val) => setC(s => ceSet(s, path, val));
  const updPair = (path, lng, val) => { const cur = ceGet(c, path) || { en: '', ar: '' }; upd(path, { ...cur, [lng]: val }); };

  const save = () => {
    const clean = JSON.parse(JSON.stringify(c));
    if (clean.marquee) clean.marquee = clean.marquee.filter(m => (m.en || '').trim() || (m.ar || '').trim());
    saveContent(clean); toast(L('Content saved — view the store to see it live', 'تم الحفظ — افتحي المتجر تشوفيه'));
  };

  // ---- field builders ----
  const Pair = (label, path, { area } = {}) => {
    const obj = ceGet(c, path) || { en: '', ar: '' };
    const In = area ? 'textarea' : 'input';
    return (
      <div className="adm-grid" key={path}>
        <div className="field"><label>{label} (EN)</label><In className="input" rows={area ? 2 : undefined} value={obj.en} onChange={e => updPair(path, 'en', e.target.value)} /></div>
        <div className="field"><label>{label} (AR)</label><In className="input" dir="rtl" rows={area ? 2 : undefined} value={obj.ar} onChange={e => updPair(path, 'ar', e.target.value)} /></div>
      </div>
    );
  };
  const Text = (label, path, ph) => (
    <div className="field" key={path}><label>{label}</label><input className="input" value={ceGet(c, path) ?? ''} placeholder={ph || ''} onChange={e => upd(path, e.target.value)} /></div>
  );
  const ImageField = (label, path) => {
    const val = ceGet(c, path) || '';
    return (
      <div className="adm-row-inline" key={path}>
        <div className="field" style={{ flex: 1, minWidth: 220 }}>
          <label>{label}</label>
          <input className="input" value={val} placeholder="https://juyub.odoo.com/web/image/…" onChange={e => upd(path, e.target.value)} />
        </div>
        <div className="img-preview" style={{ width: 64, height: 64 }}>{val ? <img src={val} alt="" /> : <Icon n="box" style={{ width: 20, opacity: .4 }} />}</div>
      </div>
    );
  };
  const LinkField = (label, path) => (
    <div className="field" key={path}>
      <label>{label} <span className="muted" style={{ fontWeight: 400 }}>— {L('page or URL', 'صفحة أو رابط')}</span></label>
      <input className="input" value={ceGet(c, path) ?? ''} placeholder="shop · about · https://…" onChange={e => upd(path, e.target.value)} />
    </div>
  );

  // ---- list editors ----
  const listAdd = (path, blank) => setC(s => ceSet(s, path, [...(ceGet(s, path) || []), blank]));
  const listRm = (path, i) => setC(s => ceSet(s, path, (ceGet(s, path) || []).filter((_, j) => j !== i)));

  const linkHint = (
    <p className="muted" style={{ fontSize: 12.5, marginTop: -6, marginBottom: 12 }}>
      💡 {L('For button links: type a page name (shop, about, shipping, faq) or paste a full link (https://…).', 'للينك الزراير: اكتبي اسم صفحة (shop, about, shipping, faq) أو الصقي رابط كامل (https://…).')}
    </p>
  );

  const nav = [
    ['general', L('General', 'عام')],
    ['hero', L('Hero', 'الهيرو')],
    ['home', L('Home sections', 'أقسام الرئيسية')],
    ['about', L('About', 'عن چيوب')],
    ['shipping', L('Shipping', 'الشحن')],
    ['faq', L('Q&A', 'الأسئلة')],
    ['shop', L('Shop page', 'صفحة المتجر')],
  ];

  return (
    <div>
      <div className="content-nav">
        {nav.map(([id, label]) => (
          <button key={id} className={sec === id ? 'active' : ''} onClick={() => setSec(id)}>{label}</button>
        ))}
      </div>

      <div className="adm-editor" style={{ maxWidth: 820, marginTop: 18 }}>
        {/* ---------------- GENERAL ---------------- */}
        {sec === 'general' && <>
          <h3 className="h3">{L('General', 'عام')}</h3>
          <div className="adm-sec" style={{ borderTop: 0, marginTop: 10, paddingTop: 0 }}>
            <h4>{L('Top announcement bar', 'الشريط العلوي')}</h4>
            {Pair(L('Text', 'النص'), 'announce')}
          </div>
          <div className="adm-sec">
            <h4>{L('Scrolling strip (marquee)', 'الشريط المتحرك')}</h4>
            <p className="muted" style={{ marginTop: -6, marginBottom: 14, fontSize: 13.5 }}>{L('Each line scrolls across — great for offers like “30% OFF this week”.', 'كل سطر بيمشي في الشريط — مناسب للعروض زي «خصم ٣٠٪ الأسبوع ده».')}</p>
            {(c.marquee || []).map((m, i) => (
              <div className="adm-variant" key={i} style={{ paddingTop: 14, position: 'relative' }}>
                {c.marquee.length > 1 && <button className="v-remove" onClick={() => listRm('marquee', i)}>{L('Remove', 'حذف')}</button>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <button type="button" disabled={i === 0} onClick={() => {
                      const arr = [...c.marquee];
                      [arr[i-1], arr[i]] = [arr[i], arr[i-1]];
                      upd('marquee', arr);
                    }} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)', background: i === 0 ? 'var(--surface)' : 'var(--bg)', cursor: i === 0 ? 'not-allowed' : 'pointer', fontSize: 14, opacity: i === 0 ? 0.3 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↑</button>
                    <button type="button" disabled={i === (c.marquee.length - 1)} onClick={() => {
                      const arr = [...c.marquee];
                      [arr[i+1], arr[i]] = [arr[i], arr[i+1]];
                      upd('marquee', arr);
                    }} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)', background: i === (c.marquee.length - 1) ? 'var(--surface)' : 'var(--bg)', cursor: i === (c.marquee.length - 1) ? 'not-allowed' : 'pointer', fontSize: 14, opacity: i === (c.marquee.length - 1) ? 0.3 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↓</button>
                  </div>
                  <div style={{ flex: 1 }}>{Pair(L('Line', 'السطر') + ' ' + (i + 1), 'marquee.' + i)}</div>
                </div>
              </div>
            ))}
            <button className="btn btn-outline" onClick={() => listAdd('marquee', { en: '', ar: '' })} style={{ marginTop: 4 }}><Icon n="plus" style={{ width: 16 }} />{L('Add line', 'أضف سطر')}</button>
          </div>
          <div className="adm-sec">
            <h4>{L('Footer', 'الفوتر')}</h4>
            {Pair(L('Footer tagline', 'جملة الفوتر'), 'footer.tagline', { area: true })}
            {Pair(L('Copyright line (e.g. © 2026 JUYUB)', 'سطر الحقوق (مثال: © 2026 JUYUB)'), 'footer.founded')}
          </div>
          <div className="adm-sec">
            <h4>{L('Social links', 'لينكات السوشيال')}</h4>
            <p className="muted" style={{ marginTop: -6, marginBottom: 12, fontSize: 13 }}>{L('Paste the full link. Leave empty to hide that icon.', 'الصقي اللينك كامل. سيبيه فاضي عشان تخفي الأيقونة.')}</p>
            {Text('Instagram', 'footer.social.instagram', 'https://instagram.com/…')}
            {Text('TikTok', 'footer.social.tiktok', 'https://tiktok.com/@…')}
            {Text('Facebook', 'footer.social.facebook', 'https://facebook.com/…')}
            {Text('WhatsApp', 'footer.social.whatsapp', 'https://wa.me/…')}
          </div>
          
          <div className="adm-sec">
            <h4>{L('Quote banner', 'بانر الاقتباس')}</h4>
            {Pair(L('Quote', 'الاقتباس'), 'quote.text', { area: true })}
            {Pair(L('Button label', 'نص الزر'), 'quote.button')}
            {LinkField(L('Button link', 'لينك الزر'), 'quote.buttonHref')}
          </div>
          <div className="adm-sec">
            <h4>{L('Contact banner (bottom of pages)', 'بانر التواصل (أسفل الصفحات)')}</h4>
            {Pair(L('Small label', 'السطر الصغير'), 'contact.eyebrow')}
            {Pair(L('Heading', 'العنوان'), 'contact.title')}
            {Pair(L('Text', 'النص'), 'contact.lede', { area: true })}
            {Pair(L('WhatsApp button label', 'نص زر الواتساب'), 'contact.button')}
            <div className="field">
              <label>{L('Button icon', 'أيقونة الزرار')}</label>
              <div style={{display:'flex',gap:10,marginTop:6}}>
                {[['chat',L('Chat bubble','فقاعة چات')],['whatsapp',L('WhatsApp','واتساب')],['phone',L('Phone','تليفون')]].map(([val,label])=>(
                  <button key={val} type="button" onClick={()=>upd('contact.icon', val)}
                    style={{padding:'8px 16px',borderRadius:8,border:'2px solid',fontSize:13,cursor:'pointer',fontWeight:600,
                      borderColor:(c.contact&&c.contact.icon||'chat')===val?'var(--maroon)':'var(--border)',
                      background:(c.contact&&c.contact.icon||'chat')===val?'var(--maroon)':'transparent',
                      color:(c.contact&&c.contact.icon||'chat')===val?'#fff':'var(--ink-soft)'}}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        <div className="adm-sec">
          <h4>{L('Categories','الفئات')}</h4>
          <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:14}}>
            {(categories||[]).map(cat=>(
              <span key={cat.en} style={{display:'flex',alignItems:'center',gap:6,padding:'5px 12px',borderRadius:99,border:'1px solid var(--border)',fontSize:13,background:'var(--surface)'}}>
                {lang==='ar'?cat.ar:cat.en}
                <button onClick={()=>deleteCategory(cat.en)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--ink-soft)',fontSize:14,lineHeight:1,padding:0}}>×</button>
              </span>
            ))}
          </div>
          <div className="adm-grid">
            <div className="field"><label>{L('New category (English)','فئة جديدة (إنجليزي)')}</label><input id="cat-en" className="input" placeholder="e.g. Backpacks" /></div>
            <div className="field"><label>{L('New category (Arabic)','فئة جديدة (عربي)')}</label><input id="cat-ar" className="input" dir="rtl" placeholder="مثلاً: شنط ظهر" /></div>
          </div>
          <button className="btn btn-outline" style={{marginTop:10}} onClick={()=>{
            const en=document.getElementById('cat-en').value.trim();
            const ar=document.getElementById('cat-ar').value.trim();
            if(en&&ar){addCategory(en,ar);document.getElementById('cat-en').value='';document.getElementById('cat-ar').value='';}
          }}><span>+</span> {L('Add category','أضف فئة')}</button>
        </div>
        </>}

        {/* ---------------- HERO ---------------- */}
        {sec === 'hero' && <>
          <h3 className="h3">{L('Hero banner', 'البانر الرئيسي')}</h3>
          {linkHint}
          {Pair(L('Small label', 'السطر الصغير'), 'hero.eyebrow')}
          {Pair(L('Headline', 'العنوان الكبير'), 'hero.title')}
          {Pair(L('Subtext', 'النص'), 'hero.lede', { area: true })}
          <div className="adm-sec">
            <h4>{L('Primary button', 'الزر الأساسي')}</h4>
            {Pair(L('Label', 'النص'), 'hero.primaryLabel')}
            {LinkField(L('Link', 'اللينك'), 'hero.primaryHref')}
          </div>
          <div className="adm-sec">
            <h4>{L('Secondary button', 'الزر الثانوي')}</h4>
            {Pair(L('Label', 'النص'), 'hero.secondaryLabel')}
            {LinkField(L('Link', 'اللينك'), 'hero.secondaryHref')}
          </div>
          <div className="adm-sec">
            <h4>{L('Hero image', 'صورة الهيرو')}</h4>
            {ImageField(L('Image URL', 'رابط الصورة'), 'hero.image')}
            <p className="muted" style={{ fontSize: 13 }}>{L('Tip: drop a promo bag or offer graphic here during a sale.', 'فكرة: حطي صورة شنطة أو بانر عرض هنا وقت التخفيضات.')}</p>
          </div>
        </>}

        {/* ---------------- HOME SECTIONS ---------------- */}
        {sec === 'home' && <>
          <h3 className="h3">{L('Homepage sections', 'أقسام الصفحة الرئيسية')}</h3>
          <div className="adm-sec" style={{borderTop:0,marginTop:10,paddingTop:0}}>
            <h4>{L('Featured products (Bestselling section)','المنتجات المميزة — سيكشن الأكثر مبيعاً')}</h4>
            <p className="muted" style={{fontSize:13,marginBottom:14}}>{L('Pick up to 8 products. Leave empty to auto-show featured products.','اختار لحد ٨ منتجات. سيبها فاضية للعرض التلقائي.')}</p>
            {(c.featuredIds||[]).map((id,i)=>{
              const p=products.find(x=>x.id===id);
              const img=p&&p.variants&&p.variants[0]&&p.variants[0].img;
              return (
                <div key={id} style={{display:'flex',alignItems:'center',gap:10,marginBottom:8,padding:'8px 12px',borderRadius:10,border:'1px solid var(--border)',background:'var(--bg)'}}>
                  <div style={{display:'flex',flexDirection:'column',gap:2}}>
                    <button type="button" disabled={i===0} onClick={()=>{const a=[...(c.featuredIds||[])];[a[i-1],a[i]]=[a[i],a[i-1]];upd('featuredIds',a);}} style={{background:'none',border:'1px solid var(--border)',borderRadius:4,cursor:i===0?'not-allowed':'pointer',fontSize:11,padding:'1px 5px',opacity:i===0?0.3:1}}>↑</button>
                    <button type="button" disabled={i===(c.featuredIds||[]).length-1} onClick={()=>{const a=[...(c.featuredIds||[])];[a[i+1],a[i]]=[a[i],a[i+1]];upd('featuredIds',a);}} style={{background:'none',border:'1px solid var(--border)',borderRadius:4,cursor:i===(c.featuredIds||[]).length-1?'not-allowed':'pointer',fontSize:11,padding:'1px 5px',opacity:i===(c.featuredIds||[]).length-1?0.3:1}}>↓</button>
                  </div>
                  <span style={{fontSize:12,fontWeight:700,color:'var(--ink-soft)',minWidth:18}}>#{i+1}</span>
                  {img&&<img src={img} style={{width:36,height:36,borderRadius:6,objectFit:'cover'}}/>}
                  <span style={{flex:1,fontSize:13,fontWeight:600}}>{p?t(p.name):id}</span>
                  <button onClick={()=>upd('featuredIds',(c.featuredIds||[]).filter(x=>x!==id))} style={{background:'none',border:'none',cursor:'pointer',color:'var(--ink-soft)',fontSize:18,lineHeight:1}}>×</button>
                </div>
              );
            })}
            {(c.featuredIds||[]).length<8&&(
              <select onChange={e=>{
                const val=e.target.value;
                if(!val) return;
                const cur=c.featuredIds||[];
                if(!cur.includes(val)) upd('featuredIds',[...cur,val]);
                e.target.value='';
              }} style={{width:'100%',padding:'10px 12px',borderRadius:8,border:'1px solid var(--border)',fontSize:13,fontFamily:'inherit',marginTop:4}}>
                <option value="">{L('+ Add a product...','+ أضف منتج...')}</option>
                {(products||[]).filter(p=>!(c.featuredIds||[]).includes(p.id)).map(p=>(
                  <option key={p.id} value={p.id}>{t(p.name)}</option>
                ))}
              </select>
            )}
            {(c.featuredIds||[]).length>0&&(
              <button onClick={()=>upd('featuredIds',[])} style={{fontSize:12,color:'var(--ink-soft)',background:'none',border:'none',cursor:'pointer',textDecoration:'underline',marginTop:8}}>
                {L('Clear all (revert to auto)','مسح الكل (رجوع للتلقائي)')}
              </button>
            )}
          </div>
          {linkHint}
          <div className="adm-sec" style={{ borderTop: 0, marginTop: 10, paddingTop: 0 }}>
            <h4>{L('Feature highlights (3 boxes)', 'المميزات (٣ مربعات)')}</h4>
            {(c.values || []).map((v, i) => (
              <div className="adm-variant" key={i} style={{ paddingTop: 14 }}>
                <div className="a-meta" style={{ marginBottom: 8, fontWeight: 700 }}>{L('Box', 'مربع')} {i + 1}</div>
                {Pair(L('Title', 'العنوان'), 'values.' + i + '.h')}
                {Pair(L('Text', 'النص'), 'values.' + i + '.p', { area: true })}
                {ImageField(L('Icon image (optional — leave empty for default)', 'صورة الأيقونة (اختياري — سيبيها فاضية للافتراضي)'), 'values.' + i + '.iconImg')}
              </div>
            ))}
          </div>
          <div className="adm-sec">
            <h4>{L('“Bestsellers” heading', 'عنوان «الأكثر مبيعاً»')}</h4>
            {Pair(L('Small label', 'السطر الصغير'), 'editHead.eyebrow')}
            {Pair(L('Heading', 'العنوان'), 'editHead.title')}
            {Pair(L('“View all” link text', 'نص «شوفي الكل»'), 'editHead.viewAll')}
          </div>
          <div className="adm-sec">
            <h4>{L('Gift section', 'قسم الهدية')}</h4>
            {Pair(L('Small label', 'السطر الصغير'), 'gift.eyebrow')}
            {Pair(L('Heading', 'العنوان'), 'gift.title')}
            {Pair(L('Text', 'النص'), 'gift.lede', { area: true })}
            {Pair(L('Button label', 'نص الزر'), 'gift.button')}
            {LinkField(L('Button link', 'لينك الزر'), 'gift.buttonHref')}
            {ImageField(L('Gift image', 'صورة الهدية'), 'gift.image')}
          </div>
          <div className="adm-sec">
            <h4>{L('Sidebar image / GIF','صورة أو GIF جانبي')}</h4>
            <p className="muted" style={{fontSize:13,marginBottom:12}}>{L('Paste an image or GIF link — appears below Good to Know in the shop sidebar (200×450px recommended).','الصق لينك صورة أو GIF — بتظهر تحت Good to Know في الشريط الجانبي.')}</p>
            <div className="field">
              <label>{L('Image / GIF URL','لينك الصورة / GIF')}</label>
              <input className="input" value={(c.shop&&c.shop.sidebarImg)||''} placeholder="https://..." onChange={e=>upd('shop.sidebarImg',e.target.value)} />
            </div>
            {c.shop && c.shop.sidebarImg && (
              <div style={{marginTop:12,borderRadius:10,overflow:'hidden',width:120}}>
                <img src={c.shop.sidebarImg} alt="preview" style={{width:'100%',height:180,objectFit:'cover',display:'block'}}/>
              </div>
            )}
          </div>
        </>}

        {/* ---------------- ABOUT ---------------- */}
        {sec === 'about' && <>
          <h3 className="h3">{L('About page', 'صفحة عن چيوب')}</h3>
          <div className="adm-sec" style={{ borderTop: 0, marginTop: 10, paddingTop: 0 }}>
            <h4>{L('Page header', 'ترويسة الصفحة')}</h4>
            {Pair(L('Small label', 'السطر الصغير'), 'about.heroEyebrow')}
            {Pair(L('Title', 'العنوان'), 'about.heroTitle')}
            {Pair(L('Subtext', 'النص'), 'about.heroLede', { area: true })}
          </div>
          <div className="adm-sec">
            <h4>{L('Story section', 'قسم القصة')}</h4>
            {Pair(L('Heading', 'العنوان'), 'about.splitTitle')}
            {Pair(L('Paragraph 1', 'الفقرة ١'), 'about.splitP1', { area: true })}
            {Pair(L('Paragraph 2', 'الفقرة ٢'), 'about.splitP2', { area: true })}
            {Pair(L('Button label', 'نص الزر'), 'about.splitButton')}
            {ImageField(L('Story image', 'صورة القسم'), 'about.image')}
          </div>
          <div className="adm-sec">
            <h4>{L('Value cards (3)', 'بطاقات القيم (٣)')}</h4>
            {(c.about.values || []).map((v, i) => (
              <div className="adm-variant" key={i} style={{ paddingTop: 14 }}>
                <div className="a-meta" style={{ marginBottom: 8, fontWeight: 700 }}>{L('Card', 'بطاقة')} {i + 1}</div>
                {Pair(L('Title', 'العنوان'), 'about.values.' + i + '.h')}
                {Pair(L('Text', 'النص'), 'about.values.' + i + '.p', { area: true })}
                {ImageField(L('Icon image (optional)', 'صورة الأيقونة (اختياري)'), 'about.values.' + i + '.iconImg')}
              </div>
            ))}
          </div>
          <div className="adm-sec">
            <h4>{L('Quote banner', 'بانر الاقتباس')}</h4>
            {Pair(L('Quote', 'الاقتباس'), 'about.quote', { area: true })}
          </div>
        </>}

        {/* ---------------- SHIPPING ---------------- */}
        {sec === 'shipping' && <>
          <h3 className="h3">{L('Shipping page', 'صفحة الشحن')}</h3>
          <div className="adm-sec" style={{ borderTop: 0, marginTop: 10, paddingTop: 0 }}>
            <h4>{L('Page header', 'ترويسة الصفحة')}</h4>
            {Pair(L('Small label', 'السطر الصغير'), 'shipping.heroEyebrow')}
            {Pair(L('Title', 'العنوان'), 'shipping.heroTitle')}
            {Pair(L('Subtext', 'النص'), 'shipping.heroLede', { area: true })}
          </div>
          <div className="adm-sec">
            <h4>{L('Shipping points', 'نقاط الشحن')}</h4>
            {(c.shipping.bullets || []).map((b, i) => (
              <div className="adm-variant" key={i} style={{ paddingTop: 14 }}>
                {c.shipping.bullets.length > 1 && <button className="v-remove" onClick={() => listRm('shipping.bullets', i)}>{L('Remove', 'حذف')}</button>}
                {Pair(L('Point', 'نقطة') + ' ' + (i + 1), 'shipping.bullets.' + i, { area: true })}
              </div>
            ))}
            <button className="btn btn-outline" onClick={() => listAdd('shipping.bullets', { en: '', ar: '' })} style={{ marginTop: 4 }}><Icon n="plus" style={{ width: 16 }} />{L('Add point', 'أضف نقطة')}</button>
          </div>
          <div className="adm-sec">
            <h4>{L('Trust badges (3)', 'شارات الثقة (٣)')}</h4>
            {(c.shipping.trust || []).map((tr, i) => (
              <div className="adm-variant" key={i} style={{ paddingTop: 14 }}>
                {Pair(L('Badge', 'شارة') + ' ' + (i + 1), 'shipping.trust.' + i + '.text')}
                {ImageField(L('Icon image (optional)', 'صورة الأيقونة (اختياري)'), 'shipping.trust.' + i + '.iconImg')}
              </div>
            ))}
          </div>
        </>}

        {/* ---------------- FAQ ---------------- */}
        {sec === 'faq' && <>
          <h3 className="h3">{L('Q&A page', 'صفحة الأسئلة')}</h3>
          <div className="adm-sec" style={{ borderTop: 0, marginTop: 10, paddingTop: 0 }}>
            <h4>{L('Page header', 'ترويسة الصفحة')}</h4>
            {Pair(L('Small label', 'السطر الصغير'), 'faq.heroEyebrow')}
            {Pair(L('Title', 'العنوان'), 'faq.heroTitle')}
            {Pair(L('Subtext', 'النص'), 'faq.heroLede', { area: true })}
            {Pair(L('“Still have a question?” text', 'نص «لسه عندك سؤال؟»'), 'faq.stillTitle')}
          </div>
          <div className="adm-sec">
            <h4>{L('Questions', 'الأسئلة')}</h4>
            {(c.faq.items || []).map((it, i) => (
              <div className="adm-variant" key={i} style={{ paddingTop: 14 }}>
                {c.faq.items.length > 1 && <button className="v-remove" onClick={() => listRm('faq.items', i)}>{L('Remove', 'حذف')}</button>}
                {Pair(L('Question', 'السؤال') + ' ' + (i + 1), 'faq.items.' + i + '.q')}
                {Pair(L('Answer', 'الإجابة'), 'faq.items.' + i + '.a', { area: true })}
              </div>
            ))}
            <button className="btn btn-outline" onClick={() => listAdd('faq.items', { q: { en: '', ar: '' }, a: { en: '', ar: '' } })} style={{ marginTop: 4 }}><Icon n="plus" style={{ width: 16 }} />{L('Add question', 'أضف سؤال')}</button>
          </div>
        </>}

        {/* ---------------- SHOP ---------------- */}
        {sec === 'shop' && <>
          <h3 className="h3">{L('Shop page', 'صفحة المتجر')}</h3>
          <div className="adm-sec" style={{ borderTop: 0, marginTop: 10, paddingTop: 0 }}>
            <h4>{L('Page header', 'ترويسة الصفحة')}</h4>
            {Pair(L('Small label', 'السطر الصغير'), 'shop.eyebrow')}
            {Pair(L('Headline', 'العنوان الكبير'), 'shop.title')}
            {Pair(L('Subtext', 'النص'), 'shop.lede', { area: true })}
          </div>
          <div className="adm-sec">
            <h4>{L('Good to know (sidebar)', 'معلومة (الشريط الجانبي)')}</h4>
            <p className="muted" style={{ marginTop: -6, marginBottom: 12, fontSize: 13 }}>{L('3 trust points in the shop sidebar. Icons: cash · truck · shield · star · heart · box', '٣ نقاط ثقة في الشريط الجانبي. الأيقونات: cash · truck · shield · star · heart · box')}</p>
            {(c.goodToKnow || []).map((item, i) => (
              <div className="adm-variant" key={i} style={{ paddingTop: 14 }}>
                <div className="a-meta" style={{ marginBottom: 8, fontWeight: 700 }}>{L('Point', 'نقطة')} {i + 1}</div>
                <div className="field"><label>{L('Icon / Image URL', 'أيقونة أو لينك صورة')}</label><input className="input" value={item.icon || ''} placeholder="cash / truck / https://..." onChange={e => { const arr = JSON.parse(JSON.stringify(c.goodToKnow||[])); arr[i] = {...arr[i], icon: e.target.value}; upd('goodToKnow', arr); }} /></div>
                <div className="adm-grid">
                  <div className="field"><label>{L('Text', 'النص')} (EN)</label><input className="input" value={item.en || ''} onChange={e => { const arr = JSON.parse(JSON.stringify(c.goodToKnow||[])); arr[i] = {...arr[i], en: e.target.value}; upd('goodToKnow', arr); }} /></div>
                  <div className="field"><label>{L('Text', 'النص')} (AR)</label><input className="input" dir="rtl" value={item.ar || ''} onChange={e => { const arr = JSON.parse(JSON.stringify(c.goodToKnow||[])); arr[i] = {...arr[i], ar: e.target.value}; upd('goodToKnow', arr); }} /></div>
                </div>
              </div>
            ))}
          </div>
        </>}

        <div className="adm-foot">
          <button className="btn btn-outline" onClick={() => { if (confirm(L('Reset ALL content to defaults? Your text edits will be lost.', 'استرجاع كل المحتوى للأصل؟ كل تعديلاتك هتتمسح.'))) { resetContent(); setC(JSON.parse(JSON.stringify(SITE_CONTENT))); toast(L('Content reset', 'تم الاسترجاع')); } }}>{L('Reset to defaults', 'استرجاع الأصلي')}</button>
          <button className="btn btn-primary" onClick={save}>{L('Save content', 'حفظ المحتوى')}</button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { ContentEditor });
