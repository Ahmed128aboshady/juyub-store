// ============ JUYUB — home / about / shipping / faq ============
const { useState: uSt, useEffect: uEf } = React;

// resolve a button "href": internal route name (home/shop/about/shipping/faq)
// or an external URL. Returns props for a <button>/<a>.
const useCta = () => {
  const { navigate } = useStore();
  return (href, fallback) => {
    const h = (href || '').trim();
    const target = h || fallback || 'home';
    const isUrl = /^(https?:|wa\.me|mailto:|tel:|\/\/)/i.test(target);
    if (isUrl) {
      const url = /^https?:|^mailto:|^tel:/i.test(target) ? target : 'https://' + target.replace(/^\/\//, '');
      return { as: 'a', href: url, target: '_blank', rel: 'noopener' };
    }
    return { as: 'button', onClick: () => navigate(target.replace(/^#?\/?/, '') || 'home') };
  };
};

// render helper: <Cta> picks <a> or <button> based on resolved props
const Cta = ({ go, href, fallback, className, children, style }) => {
  const p = go(href, fallback);
  if (p.as === 'a') return <a className={className} href={p.href} target={p.target} rel={p.rel} style={style}>{children}</a>;
  return <button className={className} onClick={p.onClick} style={style}>{children}</button>;
};

// renders a custom image icon if provided, else the built-in SVG glyph
const ValIcon = ({ item }) => (
  item && item.iconImg
    ? <img src={item.iconImg} alt="" />
    : <Icon n={item ? item.icon : 'sparkle'} />
);

/* ---------- Home ---------- */
const HomePage = () => {
  const { t, dir, navigate, lang, products, content } = useStore();
  const featured = (products.filter(p => p.featured).length ? products.filter(p => p.featured) : products).slice(0, 4);
  const go = useCta();
  const hc = content.hero || {};
  const heroImg = hc.image || 'assets/products/tote-beige.png';
  const vals = content.values || [];
  const eh = content.editHead || {};
  const gift = content.gift || {};
  const quote = content.quote || {};

  const Hero = dir === 'b' ? (
    <section className="hero hero-b">
      <div className="ftr-pattern" />
      <div className="wrap">
        <div className="hero-copy">
          <img className="hero-emblem" src="https://juyub.odoo.com/web/image/1082" alt="" />
          <span className="eyebrow">{t(hc.eyebrow)}</span>
          <h1 className="h-hero">{t(hc.title)}</h1>
          <p className="lede">{t(hc.lede)}</p>
          <div className="hero-actions">
            <Cta go={go} href={hc.primaryHref} fallback="shop" className="btn btn-primary btn-lg">{t(hc.primaryLabel)} <Icon n="arrow" style={{ width: 18 }} /></Cta>
            <Cta go={go} href={hc.secondaryHref} fallback="about" className="btn btn-outline btn-lg">{t(hc.secondaryLabel)}</Cta>
          </div>
        </div>
        <div className="hero-b-art"><img src={heroImg} alt="JUYUB bag" /></div>
      </div>
    </section>
  ) : (
    <section className="hero hero-a">
      <div className="wrap">
        <div className="hero-copy">
          <span className="eyebrow">{t(hc.eyebrow)}</span>
          <h1 className="h-hero">{t(hc.title)}</h1>
          <p className="lede">{t(hc.lede)}</p>
          <div className="hero-actions">
            <Cta go={go} href={hc.primaryHref} fallback="shop" className="btn btn-primary btn-lg">{t(hc.primaryLabel)} <Icon n="arrow" style={{ width: 18 }} /></Cta>
            <Cta go={go} href={hc.secondaryHref} fallback="about" className="btn btn-ghost">{t(hc.secondaryLabel)}</Cta>
          </div>
        </div>
        <div className="hero-art">
          <div className="kang" />
          <div className="prod" style={{ backgroundImage: `url(${heroImg})` }} />
        </div>
      </div>
    </section>
  );

  return (
    <>
      {Hero}
      <Marquee />
      <section className="wrap section">
        <div className="values">
          {vals.map((v, i) => (
            <div className="value" key={i}>
              <div className="value-ic"><ValIcon item={v} /></div>
              <h3>{t(v.h)}</h3>
              <p className="muted">{t(v.p)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap section" style={{ paddingTop: 0 }}>
        <div className="sec-head">
          <div className="stack">
            <span className="eyebrow">{t(eh.eyebrow)}</span>
            <h2 className="h2">{t(eh.title)}</h2>
          </div>
          <button className="btn btn-ghost" onClick={() => navigate('shop')}>{t(eh.viewAll)}</button>
        </div>
        <div className="grid-products home-grid">{featured.map(p => <ProductCard key={p.id} p={p} />)}</div>
      </section>

      {/* Gift editorial */}
      <section className="section" style={{ background: dir === 'b' ? 'var(--paper)' : 'transparent' }}>
        <div className="wrap split">
          <div className="split-img" style={{ aspectRatio: '1/1', background: 'radial-gradient(120% 90% at 50% 20%,#fff,var(--sand))', display: 'grid', placeItems: 'center', overflow: 'hidden', padding: 0 }}>
            <img src={gift.image} alt="JUYUB packaging" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
          </div>
          <div className="stack gap-l">
            <span className="eyebrow">{t(gift.eyebrow)}</span>
            <h2 className="h1" style={{ fontSize: 'clamp(30px,4.4vw,58px)' }}>{t(gift.title)}</h2>
            <p className="lede">{t(gift.lede)}</p>
            <div className="hero-actions"><Cta go={go} href={gift.buttonHref} fallback="shop" className="btn btn-primary btn-lg">{t(gift.button)}</Cta></div>
          </div>
        </div>
      </section>

      {/* Quote band */}
      <section className="band">
        <div className="ftr-pattern" />
        <div className="band-inner">
          <img className="band-emblem" src="https://juyub.odoo.com/web/image/1082" alt="" />
          <p className="h2 display">{t(quote.text)}</p>
          <Cta go={go} href={quote.buttonHref} fallback="about" className="btn btn-outline btn-lg" style={{ marginTop: 30, boxShadow: 'inset 0 0 0 1.4px var(--ivory)', color: 'var(--ivory)' }}>{t(quote.button)}</Cta>
        </div>
      </section>

      <ContactBand />
    </>
  );
};

/* ---------- shared contact band ---------- */
const ContactBand = () => {
  const { t, content } = useStore();
  const c = content.contact || {};
  return (
    <section className="wrap section-sm">
      <div className="contact-band">
        <div className="stack gap-s">
          <span className="eyebrow" style={{ color: 'var(--taupe)' }}>{t(c.eyebrow)}</span>
          <h2 className="h2" style={{ color: 'var(--ivory)' }}>{t(c.title)}</h2>
          <p style={{ color: 'rgba(246,241,231,.78)', maxWidth: '42ch' }}>{t(c.lede)}</p>
        </div>
        <a className="btn btn-wa btn-lg" href={waLink()} target="_blank" rel="noopener"><Icon n="chat" style={{ width: 19 }} />{t(c.button)}</a>
      </div>
    </section>
  );
};

/* ---------- About ---------- */
const AboutPage = () => {
  const { t, navigate, content } = useStore();
  uEf(() => window.scrollTo(0, 0), []);
  const a = content.about || {};
  const vals = a.values || [];
  return (
    <>
      <div className="page-hero">
        <div className="ftr-pattern" style={{ opacity: 0.06 }} />
        <div className="wrap">
          <span className="eyebrow">{t(a.heroEyebrow)}</span>
          <h1 className="h1">{t(a.heroTitle)}</h1>
          <p className="lede">{t(a.heroLede)}</p>
        </div>
      </div>
      <section className="wrap section">
        <div className="split">
          <div className="split-img" style={{ background: 'radial-gradient(120% 90% at 50% 15%,#fff,var(--sand))', display: 'grid', placeItems: 'center' }}>
            <img src={a.image} alt="JUYUB" style={{ width: '74%', height: 'auto', borderRadius: '50%' }} />
          </div>
          <div className="stack gap-l">
            <h2 className="h2">{t(a.splitTitle)}</h2>
            <p className="lede" style={{ fontSize: 17 }}>{t(a.splitP1)}</p>
            <p className="muted">{t(a.splitP2)}</p>
            <button className="btn btn-primary" onClick={() => navigate('shop')}>{t(a.splitButton)}</button>
          </div>
        </div>
      </section>
      <section className="wrap section" style={{ paddingTop: 0 }}>
        <div className="values">
          {vals.map((v, i) => (
            <div className="value" key={i}>
              <div className="value-ic"><ValIcon item={v} /></div>
              <h3>{t(v.h)}</h3>
              <p className="muted">{t(v.p)}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="band">
        <div className="ftr-pattern" />
        <div className="band-inner">
          <img className="band-emblem" src="https://juyub.odoo.com/web/image/1082" alt="" />
          <p className="h2 display">{t(a.quote)}</p>
        </div>
      </section>
      <ContactBand />
    </>
  );
};

/* ---------- Shipping ---------- */
const ShippingPage = () => {
  const { t, content } = useStore();
  uEf(() => window.scrollTo(0, 0), []);
  const s = content.shipping || {};
  const bullets = s.bullets || [];
  const trust = s.trust || [];
  return (
    <>
      <div className="page-hero">
        <div className="ftr-pattern" style={{ opacity: 0.06 }} />
        <div className="wrap">
          <span className="eyebrow">{t(s.heroEyebrow)}</span>
          <h1 className="h1">{t(s.heroTitle)}</h1>
          <p className="lede">{t(s.heroLede)}</p>
        </div>
      </div>
      <section className="wrap section">
        <div className="ship-grid">
          {bullets.map((b, i) => (
            <div className="ship-card" key={i}>
              <span className="ship-num">{String(i + 1).padStart(2, '0')}</span>
              <p>{t(b)}</p>
            </div>
          ))}
        </div>
        <div className="row gap-l" style={{ justifyContent: 'center', marginTop: 44, flexWrap: 'wrap' }}>
          {trust.map((tr, i) => (
            <span className="trust" key={i}>{tr.iconImg ? <img src={tr.iconImg} alt="" /> : <Icon n={tr.icon} />}{t(tr.text)}</span>
          ))}
        </div>
      </section>
      <ContactBand />
    </>
  );
};

/* ---------- FAQ ---------- */
const FAQPage = () => {
  const { t, content } = useStore();
  const [open, setOpen] = uSt(0);
  uEf(() => window.scrollTo(0, 0), []);
  const f = content.faq || {};
  const items = f.items || [];
  return (
    <>
      <div className="page-hero">
        <div className="ftr-pattern" style={{ opacity: 0.06 }} />
        <div className="wrap">
          <span className="eyebrow">{t(f.heroEyebrow)}</span>
          <h1 className="h1">{t(f.heroTitle)}</h1>
          <p className="lede">{t(f.heroLede)}</p>
        </div>
      </div>
      <section className="wrap section">
        <div className="faq-wrap">
          {items.map((item, i) => (
            <div className={'acc ' + (open === i ? 'open' : '')} key={i}>
              <button className="acc-q" onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{t(item.q)}</span><span className="acc-ic" />
              </button>
              <div className="acc-a"><p>{t(item.a)}</p></div>
            </div>
          ))}
        </div>
        <div className="center" style={{ marginTop: 48 }}>
          <p className="muted" style={{ marginBottom: 16 }}>{t(f.stillTitle)}</p>
          <a className="btn btn-wa btn-lg" href={waLink()} target="_blank" rel="noopener"><Icon n="chat" style={{ width: 19 }} />{t(content.contact ? content.contact.button : { en: 'Chat with us', ar: 'كلّمينا' })}</a>
        </div>
      </section>
      <ContactBand />
    </>
  );
};

Object.assign(window, { HomePage, AboutPage, ShippingPage, FAQPage, ContactBand, useCta, Cta });
