// ============ JUYUB — owner login + admin dashboard ============
const { useState: adUS } = React;

const handleImageUpload = (file, callback) => {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const maxDim = 800;
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      const base64 = canvas.toDataURL('image/jpeg', 0.75);
      callback(base64);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

/* ---------- Login modal ---------- */
const LoginModal = () => {
  const { setLoginOpen, login, t } = useStore();
  const [u, setU] = adUS('');
  const [p, setP] = adUS('');
  const [err, setErr] = adUS(false);
  const submit = (e) => { e.preventDefault(); if (!login(u, p)) setErr(true); };
  return (
    <div className="modal-scrim" onClick={() => setLoginOpen(false)}>
      <form className="modal" onClick={e => e.stopPropagation()} onSubmit={submit}>
        <button type="button" className="modal-close" onClick={() => setLoginOpen(false)}><Icon n="close" /></button>
        <img className="modal-emblem" src="https://juyub.odoo.com/web/image/1082" alt="" />
        <h3 className="h3">{t({ en: 'Owner login', ar: 'دخول المالك' })}</h3>
        <p className="sub">{t({ en: 'Sign in to manage your store', ar: 'سجّلي دخولك لإدارة متجرك' })}</p>
        <div className="field">
          <label>{t({ en: 'Username', ar: 'اسم المستخدم' })}</label>
          <input className="input" value={u} autoComplete="username" onChange={e => { setU(e.target.value); setErr(false); }} />
        </div>
        <div className="field">
          <label>{t({ en: 'Password', ar: 'كلمة السر' })}</label>
          <input className="input" type="password" value={p} autoComplete="current-password" onChange={e => { setP(e.target.value); setErr(false); }} />
        </div>
        {err && <p className="msg" style={{ marginBottom: 12 }}>{t({ en: 'Wrong username or password', ar: 'اسم المستخدم أو كلمة السر غلط' })}</p>}
        <button className="btn btn-primary btn-block btn-lg" type="submit">{t({ en: 'Sign in', ar: 'دخول' })}</button>
      </form>
    </div>
  );
};

/* ---------- helpers ---------- */
const blankProduct = () => ({
  id: 'p' + Date.now().toString(36),
  sku: '', cat: 'totes', price: 0, featured: false,
  name: { en: '', ar: '' }, tagline: { en: '', ar: '' }, blurb: { en: '', ar: '' },
  variants: [{ color: { en: 'Default', ar: 'أساسي', hex: '#540b14' }, img: '', stock: true, shots: [] }],
  specs: { size: { en: '', ar: '' }, material: { en: '', ar: '' }, strap: { en: '', ar: '' }, closure: { en: '', ar: '' }, interior: { en: '', ar: '' } },
});

/* ---------- Product editor ---------- */
const ProductEditor = ({ initial, onDone }) => {
  const { t, lang, saveProduct, categories } = useStore();
  const [f, setF] = adUS(() => JSON.parse(JSON.stringify(initial)));
  const upd = (patch) => setF(s => ({ ...s, ...patch }));
  const updName = (field, lng, val) => setF(s => ({ ...s, [field]: { ...s[field], [lng]: val } }));
  const updSpec = (key, lng, val) => setF(s => ({ ...s, specs: { ...s.specs, [key]: { ...s.specs[key], [lng]: val } } }));
  const updVar = (i, patch) => setF(s => { const vs = [...s.variants]; vs[i] = { ...vs[i], ...patch }; return { ...s, variants: vs }; });
  const updVarColor = (i, lng, val) => setF(s => { const vs = [...s.variants]; vs[i] = { ...vs[i], color: { ...vs[i].color, [lng]: val } }; return { ...s, variants: vs }; });
  const addVar = () => setF(s => ({ ...s, variants: [...s.variants, { color: { en: '', ar: '', hex: '#888888' }, img: '', stock: true, shots: [] }] }));
  const rmVar = (i) => setF(s => ({ ...s, variants: s.variants.filter((_, j) => j !== i) }));

  const save = () => {
    if (!f.name.en.trim() && !f.name.ar.trim()) { alert(t({ en: 'Please enter a product name', ar: 'اكتبي اسم المنتج' })); return; }
    const clean = { ...f, price: Number(f.price) || 0, compareAt: Number(f.compareAt) || 0, variants: f.variants.map(v => ({ ...v, shots: (v.shots || []).filter(Boolean) })) };
    saveProduct(clean);
    onDone();
  };

  const L = (en, ar) => t({ en, ar });
  const field = (label, val, on, ph) => (
    <div className="field"><label>{label}</label><input className="input" value={val} placeholder={ph || ''} onChange={e => on(e.target.value)} /></div>
  );

  return (
    <div className="adm-editor">
      <h3 className="h3">{initial.name.en || initial.name.ar ? L('Edit product', 'تعديل منتج') : L('New product', 'منتج جديد')}</h3>

      <div className="adm-grid">
        {field(L('Name (English)', 'الاسم (إنجليزي)'), f.name.en, v => updName('name', 'en', v))}
        {field(L('Name (Arabic)', 'الاسم (عربي)'), f.name.ar, v => updName('name', 'ar', v))}
      </div>
      <div className="adm-grid">
        {field(L('SKU / code', 'الكود'), f.sku, v => upd({ sku: v }), 'B10-001')}
        <div className="field">
          <label>{L('Category', 'الفئة')}</label>
          <select className="input" value={f.cat} onChange={e => upd({ cat: e.target.value })}>
            {categories.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{t(c)}</option>)}
          </select>
        </div>
      </div>
      <div className="adm-grid">
        {field(L('Selling price (LE)', 'سعر البيع (ج.م)'), f.price, v => upd({ price: v }))}
        {field(L('Old price (optional)', 'السعر قبل الخصم (اختياري)'), f.compareAt || '', v => upd({ compareAt: v }))}
      </div>
      {Number(f.compareAt) > Number(f.price) && Number(f.price) > 0 && (
        <p className="muted" style={{ marginTop: -4, marginBottom: 6, fontSize: 13.5 }}>
          🏷️ {L('Discount', 'الخصم')}: <strong style={{ color: 'var(--maroon)' }}>-{Math.round((1 - Number(f.price) / Number(f.compareAt)) * 100)}%</strong> — {L('shown as a sale badge on the product.', 'هيظهر كشارة تخفيض على المنتج.')}
        </p>
      )}
      <label className="field-check" style={{ marginBottom: 14 }}>
        <input type="checkbox" checked={f.featured} onChange={e => upd({ featured: e.target.checked })} />
        {L('Show as bestseller', 'يظهر كأكثر مبيعاً')}
      </label>
      <div className="adm-grid">
        {field(L('Tagline (EN)', 'سطر تعريفي (EN)'), f.tagline.en, v => updName('tagline', 'en', v))}
        {field(L('Tagline (AR)', 'سطر تعريفي (AR)'), f.tagline.ar, v => updName('tagline', 'ar', v))}
      </div>
      <div className="adm-grid">
        <div className="field"><label>{L('Description (EN)', 'الوصف (EN)')}</label><textarea className="input" rows="2" value={f.blurb.en} onChange={e => updName('blurb', 'en', e.target.value)} /></div>
        <div className="field"><label>{L('Description (AR)', 'الوصف (AR)')}</label><textarea className="input" rows="2" value={f.blurb.ar} onChange={e => updName('blurb', 'ar', e.target.value)} /></div>
      </div>

      {/* variants */}
      <div className="adm-sec">
        <h4>{L('Colors & images', 'الألوان والصور')}</h4>
        {f.variants.map((v, i) => (
          <div className="adm-variant" key={i}>
            {f.variants.length > 1 && <button className="v-remove" onClick={() => rmVar(i)}>{L('Remove', 'حذف')}</button>}
            <div className="adm-grid">
              {field(L('Color name (EN)', 'اللون (EN)'), v.color.en, val => updVarColor(i, 'en', val))}
              {field(L('Color name (AR)', 'اللون (AR)'), v.color.ar, val => updVarColor(i, 'ar', val))}
            </div>
            <div className="adm-row-inline">
              <div className="field" style={{ flex: 1, minWidth: 200 }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{L('Main image URL', 'رابط الصورة الأساسية')}</span>
                  <label style={{ cursor: 'pointer', color: 'var(--maroon)', fontSize: '13.5px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', margin: 0 }}>
                    📎 {L('Upload from device', 'رفع من الجهاز')}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          handleImageUpload(file, (base64) => {
                            updVar(i, { img: base64 });
                          });
                        }
                      }}
                    />
                  </label>
                </label>
                <input className="input" value={v.img} placeholder="https://…  ·  assets/products/…" onChange={e => updVar(i, { img: e.target.value })} />
              </div>
              <div className="field" style={{ width: 70 }}>
                <label>{L('Swatch', 'اللون')}</label>
                <input className="color-input" type="color" value={v.color.hex} onChange={e => updVarColor(i, 'hex', e.target.value)} />
              </div>
              <div className="img-preview">{v.img ? <img src={v.img} alt="" /> : <Icon n="box" style={{ width: 20, opacity: .4 }} />}</div>
            </div>
            <div className="field">
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{L('Detail image URLs (one per line)', 'روابط صور التفاصيل (كل رابط في سطر)')}</span>
                <label style={{ cursor: 'pointer', color: 'var(--maroon)', fontSize: '13.5px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', margin: 0 }}>
                  📎 {L('Upload details', 'رفع صور تفاصيل')}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={e => {
                      const files = Array.from(e.target.files);
                      let uploadedCount = 0;
                      const newShots = [...(v.shots || [])];
                      files.forEach(file => {
                        handleImageUpload(file, (base64) => {
                          newShots.push(base64);
                          uploadedCount++;
                          if (uploadedCount === files.length) {
                            updVar(i, { shots: newShots.filter(Boolean) });
                          }
                        });
                      });
                    }}
                  />
                </label>
              </label>
              <textarea className="input" rows="2" value={(v.shots || []).join('\n')} onChange={e => updVar(i, { shots: e.target.value.split('\n') })} />
            </div>
            <label className="field-check" style={{ marginBottom: 0 }}>
              <input type="checkbox" checked={v.stock} onChange={e => updVar(i, { stock: e.target.checked })} />
              {L('In stock', 'متوفر')}
            </label>
          </div>
        ))}
        <button className="btn btn-outline" onClick={addVar} style={{ marginTop: 4 }}><Icon n="plus" style={{ width: 16 }} />{L('Add color', 'أضف لون')}</button>
      </div>

      {/* specs */}
      <div className="adm-sec">
        <h4>{L('Specifications', 'المواصفات')}</h4>
        {Object.keys(f.specs).map(key => (
          <div className="adm-grid" key={key}>
            {field(SPEC_LABELS[key].en, f.specs[key].en, v => updSpec(key, 'en', v))}
            {field(SPEC_LABELS[key].ar, f.specs[key].ar, v => updSpec(key, 'ar', v))}
          </div>
        ))}
      </div>

      <div className="adm-foot">
        <button className="btn btn-outline" onClick={onDone}>{L('Cancel', 'إلغاء')}</button>
        <button className="btn btn-primary" onClick={save}>{L('Save product', 'حفظ المنتج')}</button>
      </div>
    </div>
  );
};

/* ---------- Admin dashboard ---------- */
const AdminPage = () => {
  const { t, lang, money, navigate, products, saveProduct, deleteProduct, resetProducts,
    orders, updateOrder, deleteOrder, creds, setCreds, logout, categories } = useStore();
  const [tab, setTab] = adUS('products');
  const [editing, setEditing] = adUS(null);
  const L = (en, ar) => t({ en, ar });

  return (
    <div className="admin">
      <div className="admin-bar">
        <div className="a-logo"><img src="https://juyub.odoo.com/web/image/1082" alt="" /> JUYUB · {L('Admin', 'الإدارة')}</div>
        <div className="admin-tabs">
          <button className={tab === 'products' ? 'active' : ''} onClick={() => { setTab('products'); setEditing(null); }}>{L('Products', 'المنتجات')}</button>
          <button className={tab === 'orders' ? 'active' : ''} onClick={() => { setTab('orders'); setEditing(null); }}>{L('Orders', 'الأوردرات')} {orders.length > 0 && `(${orders.length})`}</button>
          <button className={tab === 'content' ? 'active' : ''} onClick={() => { setTab('content'); setEditing(null); }}>{L('Content', 'المحتوى')}</button>
          <button className={tab === 'settings' ? 'active' : ''} onClick={() => { setTab('settings'); setEditing(null); }}>{L('Settings', 'الإعدادات')}</button>
          <button className={tab === 'analytics' ? 'active' : ''} onClick={() => { setTab('analytics'); setEditing(null); }}>{L('Analytics', 'الإحصائيات')}</button>
        </div>
        <div className="a-actions">
          <button className="a-btn" onClick={() => navigate('home')}>{L('View store', 'المتجر')}</button>
          <button className="a-btn" onClick={logout}>{L('Log out', 'خروج')}</button>
        </div>
      </div>

      <div className="admin-body">
        {tab === 'products' && (editing ? (
          <ProductEditor initial={editing} onDone={() => setEditing(null)} />
        ) : (
          <>
            <div className="admin-head">
              <div><h2 className="h2">{L('Products', 'المنتجات')}</h2><p className="muted">{products.length} {L('items', 'منتج')}</p></div>
              <button className="btn btn-primary" onClick={() => setEditing(blankProduct())}><Icon n="plus" style={{ width: 16 }} />{L('Add product', 'أضف منتج')}</button>
            </div>
            <div className="adm-table">
              {products.map(p => {
                const inStock = p.variants.some(v => v.stock);
                return (
                  <div className="adm-row" key={p.id}>
                    <div className="a-thumb"><img src={p.variants[0].img} alt="" /></div>
                    <div className="a-info">
                      <div className="a-name">{t(p.name) || L('(untitled)', '(بدون اسم)')}</div>
                      <div className="a-meta">{p.sku || '—'} · {t(categories.find(c => c.id === p.cat) || {})} · {p.variants.length} {L('colors', 'ألوان')}</div>
                    </div>
                    <span className={'a-pill ' + (inStock ? 'in' : 'out')}>{inStock ? L('In stock', 'متوفر') : L('Out', 'نفد')}</span>
                    <span className="a-price">{money(p.price)}</span>
                    <div className="adm-actions">
                      <button className="a-iconbtn" onClick={() => setEditing(JSON.parse(JSON.stringify(p)))} title={L('Edit', 'تعديل')}><Icon n="edit" /></button>
                      <button className="a-iconbtn danger" onClick={() => { if (confirm(L('Delete this product?', 'تحذفي المنتج ده؟'))) deleteProduct(p.id); }} title={L('Delete', 'حذف')}><Icon n="trash" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ))}

        {tab === 'orders' && <OrdersPanel />}

        {tab === 'settings' && <AdminSettings />}
        {tab === 'content' && <ContentEditor />}
        {tab === 'analytics' && <AnalyticsPanel />}
      </div>
    </div>
  );
};

/* ---------- Analytics Panel ---------- */
const AnalyticsPanel = () => {
  const { t, lang, products } = useStore();
  const L = (en, ar) => t({ en, ar });
  const [data, setData] = adUS({});
  const [loading, setLoading] = adUS(true);

  React.useEffect(() => {
    const db = window._juyubDb;
    if (!db) { setLoading(false); return; }
    const ref = db.ref('analytics');
    ref.on('value', snap => { setData(snap.val() || {}); setLoading(false); });
    return () => ref.off();
  }, []);

  const clear = () => {
    if (confirm(L('Clear all analytics data?', 'مسح كل بيانات الإحصائيات؟'))) {
      const db = window._juyubDb;
      if (db) db.ref('analytics').remove();
      setData({});
    }
  };

  const pageViews    = data.pageViews    || {};
  const productClicks = data.productClicks || {};
  const totalVisits  = data.totalVisits  || 0;
  const dailyVisits  = data.dailyVisits  || {};

  const sortedPages    = Object.entries(pageViews).sort((a,b) => b[1]-a[1]);
  const sortedProducts = Object.entries(productClicks).sort((a,b) => b[1]-a[1]);
  const sortedDays     = Object.entries(dailyVisits).sort((a,b) => a[0].localeCompare(b[0])).slice(-14);
  const maxDay         = sortedDays.length ? Math.max(...sortedDays.map(d=>d[1])) : 1;
  const maxPage        = sortedPages.length ? sortedPages[0][1] : 1;
  const maxProd        = sortedProducts.length ? sortedProducts[0][1] : 1;

  const productMap = {};
  (products || []).forEach(p => { productMap[p.id] = p; });

  const pageColors = ['#540b14','#7a1a26','#a02535','#c63044','#e03a50','#f06070','#f08090','#f0a0a8'];
  const pageIcons  = { home:'🏠', shop:'🛍️', product:'👜', about:'✨', shipping:'🚚', faq:'❓', checkout:'🛒', admin:'⚙️' };

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:300,color:'var(--ink-soft)',fontSize:15}}>
      <span>⏳ {L('Loading analytics…','جاري تحميل الإحصائيات…')}</span>
    </div>
  );

  return (
    <div style={{padding:'32px 28px',maxWidth:960,fontFamily:'inherit'}}>

      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:32}}>
        <div>
          <h2 style={{margin:0,fontSize:26,fontWeight:800,color:'var(--ink)'}}>{L('Analytics','الإحصائيات')}</h2>
          <p style={{margin:'4px 0 0',fontSize:13,color:'var(--ink-soft)'}}>{L('Live data from Firebase — updates in real time','بيانات حية من Firebase — بتتحدث في الحال')}</p>
        </div>
        <button onClick={clear} style={{fontSize:12,padding:'8px 16px',borderRadius:8,border:'1px solid var(--border)',background:'transparent',cursor:'pointer',color:'var(--ink-soft)'}}>
          🗑 {L('Clear data','مسح البيانات')}
        </button>
      </div>

      {totalVisits === 0 ? (
        <div style={{textAlign:'center',padding:'80px 24px',color:'var(--ink-soft)'}}>
          <div style={{fontSize:56,marginBottom:16}}>📊</div>
          <p style={{fontSize:16,fontWeight:600}}>{L('No data yet','لا توجد بيانات بعد')}</p>
          <p style={{fontSize:13,marginTop:8}}>{L('Analytics data will appear here as visitors browse your store.','بيانات الإحصائيات هتظهر هنا لما الزوار يبدأوا يتصفحوا المتجر.')}</p>
        </div>
      ) : (<>

        {/* KPI Cards */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:16,marginBottom:36}}>
          {[
            {icon:'👁', label:L('Total visits','إجمالي الزيارات'),   value:totalVisits, color:'#540b14'},
            {icon:'📄', label:L('Pages tracked','الصفحات'),           value:Object.keys(pageViews).length, color:'#7a3b1a'},
            {icon:'👜', label:L('Products clicked','منتجات اتضغط'), value:Object.keys(productClicks).length, color:'#1a4a7a'},
            {icon:'📅', label:L('Days tracked','أيام متتبعة'),        value:Object.keys(dailyVisits).length, color:'#1a6b3a'},
          ].map((card,i) => (
            <div key={i} style={{background:'#fff',border:'1px solid var(--border)',borderRadius:16,padding:'20px 22px',boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
              <div style={{fontSize:28,marginBottom:8}}>{card.icon}</div>
              <div style={{fontSize:34,fontWeight:800,color:card.color,lineHeight:1}}>{card.value}</div>
              <div style={{fontSize:12,color:'var(--ink-soft)',marginTop:6,fontWeight:500}}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* Daily bar chart */}
        {sortedDays.length > 0 && (
          <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:16,padding:'24px 24px 16px',marginBottom:28,boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
            <h4 style={{margin:'0 0 20px',fontSize:14,fontWeight:700,color:'var(--ink)',textTransform:'uppercase',letterSpacing:1}}>
              📈 {L('Daily visits — last 14 days','الزيارات اليومية — آخر ١٤ يوم')}
            </h4>
            <div style={{display:'flex',alignItems:'flex-end',gap:8,height:140}}>
              {sortedDays.map(([day,count]) => (
                <div key={day} title={day+': '+count} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                  <div style={{fontSize:11,fontWeight:700,color:'var(--maroon)'}}>{count}</div>
                  <div style={{width:'100%',background:'linear-gradient(180deg,#8b1a2a,#540b14)',borderRadius:'6px 6px 0 0',
                    height:Math.max(6,(count/maxDay)*110)+'px',transition:'height 0.3s'}} />
                  <div style={{fontSize:10,color:'var(--ink-soft)',writingMode:'vertical-rl',transform:'rotate(180deg)',height:32,marginTop:4}}>{day.slice(5)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,marginBottom:28}}>

          {/* Top pages horizontal bars */}
          <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:16,padding:'24px',boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
            <h4 style={{margin:'0 0 18px',fontSize:14,fontWeight:700,color:'var(--ink)',textTransform:'uppercase',letterSpacing:1}}>
              📄 {L('Top pages','أكتر صفحات')}
            </h4>
            {sortedPages.slice(0,8).map(([page,count],i) => (
              <div key={page} style={{marginBottom:12}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4,fontSize:13}}>
                  <span>{pageIcons[page]||'📌'} <span style={{textTransform:'capitalize',fontWeight:600}}>{page}</span></span>
                  <span style={{fontWeight:700,color:pageColors[i]||'#540b14'}}>{count}</span>
                </div>
                <div style={{height:6,borderRadius:99,background:'#f0ebe6',overflow:'hidden'}}>
                  <div style={{height:'100%',borderRadius:99,background:pageColors[i]||'#540b14',width:(count/maxPage*100)+'%',transition:'width 0.5s'}} />
                </div>
              </div>
            ))}
          </div>

          {/* Top products with image */}
          <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:16,padding:'24px',boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
            <h4 style={{margin:'0 0 18px',fontSize:14,fontWeight:700,color:'var(--ink)',textTransform:'uppercase',letterSpacing:1}}>
              👜 {L('Most clicked products','أكتر منتجات اتضغط')}</h4>
            {sortedProducts.slice(0,6).map(([id,count],i) => {
              const prod = productMap[id];
              const img  = prod && prod.variants && prod.variants[0] && prod.variants[0].img;
              const name = prod ? t(prod.name) : id;
              return (
                <div key={id} style={{display:'flex',alignItems:'center',gap:12,marginBottom:12,padding:'8px 0',borderBottom:'1px solid #f5f0eb'}}>
                  {img
                    ? <img src={img} alt={name} style={{width:40,height:40,borderRadius:8,objectFit:'cover',background:'#f8f5f0'}} />
                    : <div style={{width:40,height:40,borderRadius:8,background:'#f0ebe6',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>👜</div>
                  }
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{name}</div>
                    <div style={{height:4,borderRadius:99,background:'#f0ebe6',marginTop:4}}>
                      <div style={{height:'100%',borderRadius:99,background:'linear-gradient(90deg,#540b14,#a02535)',width:(count/maxProd*100)+'%'}} />
                    </div>
                  </div>
                  <div style={{fontSize:16,fontWeight:800,color:'#540b14',minWidth:24,textAlign:'right'}}>{count}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Google Analytics CTA */}
        <div style={{background:'linear-gradient(135deg,#1a1a2e,#16213e)',borderRadius:16,padding:'24px 28px',color:'#fff',display:'flex',alignItems:'center',gap:20,boxShadow:'0 4px 20px rgba(0,0,0,0.15)'}}>
          <div style={{fontSize:40}}>📊</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:16,marginBottom:4}}>{L('Want deeper insights?','عايز تحليلات أعمق؟')}</div>
            <div style={{fontSize:13,opacity:0.8}}>{L('Google Analytics gives you visitor location, session duration, device type and much more.','Google Analytics بيديك موقع الزائر، وقت الجلسة، نوع الجهاز وأكتر بكتير.')}</div>
          </div>
          <a href="https://analytics.google.com" target="_blank" rel="noopener"
            style={{background:'#fff',color:'#1a1a2e',padding:'10px 20px',borderRadius:10,fontWeight:700,fontSize:13,textDecoration:'none',whiteSpace:'nowrap'}}>
            {L('Open Google Analytics','افتح Google Analytics')}
          </a>
        </div>

      </>)}
    </div>
  );
};


/* ---------- Orders panel ---------- */
const OrdersPanel = () => {
  const { t, lang, money, orders, updateOrder, deleteOrder } = useStore();
  const [sub, setSub] = adUS('new');
  const [openId, setOpenId] = adUS(null);
  const L = (en, ar) => t({ en, ar });

  const fmtDate = (ts) => {
    if (!ts) return '—';
    try { return new Date(ts).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
    catch { return new Date(ts).toLocaleString(); }
  };
  const newOrders = orders.filter(o => o.status !== 'done');
  const doneOrders = orders.filter(o => o.status === 'done');
  const list = sub === 'new' ? newOrders : doneOrders;

  return (
    <>
      <div className="admin-head" style={{ marginBottom: 16 }}>
        <h2 className="h2">{L('Orders', 'الأوردرات')}</h2>
      </div>
      <div className="content-nav" style={{ marginBottom: 18 }}>
        <button className={sub === 'new' ? 'active' : ''} onClick={() => setSub('new')}>{L('In progress', 'تحت التنفيذ')} ({newOrders.length})</button>
        <button className={sub === 'done' ? 'active' : ''} onClick={() => setSub('done')}>{L('Fulfilled', 'تم تنفيذها')} ({doneOrders.length})</button>
      </div>

      {list.length === 0 ? (
        <div className="admin-empty"><Icon n="bag" style={{ width: 40, margin: '0 auto 12px', opacity: .4 }} /><p>{sub === 'new' ? L('No orders in progress.', 'لا توجد أوردرات تحت التنفيذ.') : L('No fulfilled orders yet.', 'لا توجد أوردرات متنفّذة.')}</p></div>
      ) : (
        <div className="ord-list">
          {list.map(o => {
            const open = openId === o.id;
            const count = (o.items || []).reduce((s, i) => s + i.qty, 0);
            return (
              <div className={'ord-card' + (open ? ' open' : '')} key={o.id}>
                <button className="ord-head" onClick={() => setOpenId(open ? null : o.id)}>
                  <div className="ord-thumbs">
                    {(o.items || []).slice(0, 3).map((it, i) => <span className="ord-thumb" key={i}><img src={it.img} alt="" /></span>)}
                    {(o.items || []).length > 3 && <span className="ord-more">+{o.items.length - 3}</span>}
                  </div>
                  <div className="ord-main">
                    <div className="ord-line1">
                      <strong>#{o.id}</strong>
                      <span className={'a-pill ' + (o.status === 'done' ? 'in' : 'out')}>{o.status === 'done' ? L('Fulfilled', 'تم') : L('New', 'جديد')}</span>
                    </div>
                    <div className="ord-line2">{o.f.name} · {count} {L('item(s)', 'قطعة')}</div>
                    <div className="ord-date">{fmtDate(o.at)}</div>
                  </div>
                  <div className="ord-right">
                    <span className="a-price">{money(o.total)}</span>
                    <Icon n="arrow" className={'ord-chev' + (open ? ' up' : '')} style={{ width: 18 }} />
                  </div>
                </button>

                {open && (
                  <div className="ord-detail">
                    <div className="ord-items">
                      {(o.items || []).map((it, i) => (
                        <div className="ord-item" key={i}>
                          <span className="ord-item-img"><img src={it.img} alt="" /></span>
                          <div className="ord-item-info">
                            <div className="ord-item-name">{t(it.name)}</div>
                            <div className="a-meta">{t(it.color)}{it.size ? ' · ' + t(it.size) : ''} · ×{it.qty}</div>
                          </div>
                          <span className="ord-item-price">{money(it.price * it.qty)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="ord-grid">
                      <div className="ord-field"><span className="ord-k">{L('Phone', 'الموبايل')}</span><a className="ord-v" href={'tel:' + o.f.phone} dir="ltr">{o.f.phone}</a></div>
                      <div className="ord-field"><span className="ord-k">{L('Governorate', 'المحافظة')}</span><span className="ord-v">{o.f.gov}{o.f.city ? ' · ' + o.f.city : ''}</span></div>
                      <div className="ord-field" style={{ gridColumn: '1 / -1' }}><span className="ord-k">{L('Address', 'العنوان')}</span><span className="ord-v">{o.f.address}</span></div>
                      {o.f.notes && <div className="ord-field" style={{ gridColumn: '1 / -1' }}><span className="ord-k">{L('Notes', 'ملاحظات')}</span><span className="ord-v">{o.f.notes}</span></div>}
                      <div className="ord-field"><span className="ord-k">{L('Ordered on', 'تاريخ الطلب')}</span><span className="ord-v">{fmtDate(o.at)}</span></div>
                      <div className="ord-field"><span className="ord-k">{L('Payment', 'الدفع')}</span><span className="ord-v">{L('Cash on delivery', 'عند الاستلام')}</span></div>
                    </div>

                    <div className="ord-totals">
                      <div className="summary-row"><span>{L('Subtotal', 'الإجمالي الفرعي')}</span><span>{money(o.total - o.shipping)}</span></div>
                      <div className="summary-row"><span>{L('Shipping', 'الشحن')}</span><span>{o.shipping ? money(o.shipping) : L('Free', 'مجاني')}</span></div>
                      <div className="summary-row total"><span>{L('Total', 'الإجمالي')}</span><span>{money(o.total)}</span></div>
                    </div>

                    <div className="ord-actions">
                      <a className="btn btn-wa" href={'https://wa.me/2' + (o.f.phone || '').replace(/^0/, '')} target="_blank" rel="noopener"><Icon n="chat" style={{ width: 18 }} />{L('Contact customer', 'كلّمي العميلة')}</a>
                      <button className="btn btn-outline" onClick={() => updateOrder(o.id, { status: o.status === 'done' ? 'new' : 'done' })}>
                        <Icon n="check" style={{ width: 17 }} />{o.status === 'done' ? L('Mark as in progress', 'رجّعيها تحت التنفيذ') : L('Mark as fulfilled', 'تم تنفيذها')}
                      </button>
                      <button className="btn btn-outline ord-del" onClick={() => { if (confirm(L('Delete this order?', 'تحذفي الأوردر؟'))) deleteOrder(o.id); }}><Icon n="trash" style={{ width: 17 }} />{L('Delete', 'حذف')}</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};


Object.assign(window, { LoginModal, AdminPage, OrdersPanel });
