// ============ JUYUB — catalog, categories, i18n copy ============
// Bilingual store data. Strings are {en, ar}. Helper t() lives in app.jsx.

const CURRENCY = { en: 'LE', ar: 'ج.م' };

// --- Categories ---
const CATEGORIES = [
  { id: 'all',       en: 'All Bags',     ar: 'كل الشنط' },
  { id: 'totes',     en: 'Totes',        ar: 'شنط يد' },
  { id: 'crossbody', en: 'Crossbody',    ar: 'كروس' },
  { id: 'shoulder',  en: 'Shoulder',     ar: 'كتف' },
  { id: 'wallets',   en: 'Wallets',      ar: 'محافظ' },
];

// helper to build a color
const C = (en, ar, hex) => ({ en, ar, hex });

// --- Products (Odoo-style: products carry color variants) ---
const PRODUCTS = [
  {
    id: 'structured-tote',
    sku: 'B10-001',
    cat: 'totes',
    name: { en: 'Monogram Structured Tote', ar: 'شنطة يد منقوشة' },
    price: 750,
    compareAt: 1050,
    featured: true,
    tagline: { en: 'The everyday icon', ar: 'القطعة الأساسية' },
    blurb: {
      en: 'A structured silhouette in monogram-embossed leather — composed enough for the office, soft enough for the everyday.',
      ar: 'تصميم بِنية محكمة من جلد منقوش بالمونوجرام — أنيقة بما يكفي للعمل وناعمة بما يكفي ليومك.',
    },
    variants: [
      { color: C('Beige', 'بيج', '#cdbf9f'), img: 'assets/products/tote-beige.png', stock: true, shots: ['assets/products/details/tote-beige-back.png'] },
      { color: C('Black', 'أسود', '#1c1a19'), img: 'assets/products/tote-black.png', stock: true, shots: ['assets/products/details/tote-black-back.png'] },
    ],
    specs: {
      size:     { en: '25 × 22 cm',                      ar: '25 × 22 سم' },
      material: { en: 'Genuine leather',                 ar: 'جلد طبيعي' },
      strap:    { en: 'Handle / Shoulder',               ar: 'يد / كتف' },
      closure:  { en: 'Zipper + back-pocket zipper',     ar: 'سوسته + جيب خلفي بسوسته' },
      interior: { en: 'Three compartments, inner pocket', ar: 'ثلاث جيوب واسعة + جيب داخلي' },
    },
  },
  {
    id: 'croc-bowler',
    sku: 'B20-003',
    cat: 'crossbody',
    name: { en: 'Croc Bowler Bag', ar: 'شنطة كروس كروكو' },
    price: 275,
    compareAt: 390,
    featured: true,
    tagline: { en: 'Polished & compact', ar: 'لامعة وعملية' },
    blurb: {
      en: 'A glossy croc-embossed dome with a detachable strap — small in scale, large in attitude.',
      ar: 'تصميم نصف دائري بجلد كروكو لامع وحزام منفصل — صغيرة في الحجم، كبيرة في الإطلالة.',
    },
    variants: [
      { color: C('Dark Brown', 'بني غامق', '#2c1c14'), img: 'assets/products/bowler-brown.png', stock: true, shots: ['assets/products/details/bowler-brown-back.png'] },
      { color: C('Black', 'أسود', '#15130f'), img: 'assets/products/bowler-black.png', stock: true, shots: ['assets/products/details/bowler-black-strap.png', 'assets/products/details/croc-zip-detail.png'] },
    ],
    specs: {
      size:     { en: '21 × 16 cm',          ar: '21 × 16 سم' },
      material: { en: 'Genuine leather',      ar: 'جلد طبيعي' },
      strap:    { en: 'Handle / Crossbody',   ar: 'يد / كروس' },
      closure:  { en: 'Zipper',               ar: 'سوسته' },
      interior: { en: 'One spacious compartment', ar: 'جيب واحد واسع' },
    },
  },
  {
    id: 'patent-baguette',
    sku: 'B20-004',
    cat: 'shoulder',
    name: { en: 'Patent Baguette', ar: 'شنطة كتف باجيت' },
    price: 250,
    featured: true,
    tagline: { en: 'The shoulder statement', ar: 'إطلالة الكتف' },
    blurb: {
      en: 'A sleek patent baguette that sits clean against the shoulder — the quiet way to finish a look.',
      ar: 'باجيت لامعة أنيقة تستقر على الكتف بنعومة — اللمسة الأخيرة الهادئة لإطلالتك.',
    },
    variants: [
      { color: C('Dark Brown', 'بني غامق', '#241712'), img: 'assets/products/baguette-brown.png', stock: true, shots: ['assets/products/details/baguette-buckle.png'] },
      { color: C('Black', 'أسود', '#100f0d'), img: 'assets/products/baguette-black.png', stock: false, shots: ['assets/products/details/baguette-black-back.png'] },
    ],
    specs: {
      size:     { en: '28 × 14 cm',          ar: '28 × 14 سم' },
      material: { en: 'Patent leather',       ar: 'جلد لامع' },
      strap:    { en: 'Handle / Shoulder',    ar: 'يد / كتف' },
      closure:  { en: 'Buckle',               ar: 'إبزيم' },
      interior: { en: 'One spacious compartment', ar: 'جيب واحد واسع' },
    },
  },
  {
    id: 'two-tone-mini',
    sku: 'B20-001',
    cat: 'crossbody',
    name: { en: 'Two-Tone Mini Satchel', ar: 'شنطة ميني بلونين' },
    price: 399,
    featured: true,
    tagline: { en: 'Navy meets red', ar: 'كحلي وأحمر' },
    blurb: {
      en: 'A nautical mini with chain handles and a pop of red lining — playful, polished, endlessly wearable.',
      ar: 'ميني بروح بحرية بمقابض سلسلة وبطانة حمراء — مرحة، أنيقة، ومناسبة لكل وقت.',
    },
    variants: [
      { color: C('Navy / Red', 'كحلي / أحمر', '#1b2740'), img: 'assets/products/mini-twotone.png', stock: true, shots: ['assets/products/details/mini-strap.png'] },
    ],
    specs: {
      size:     { en: '23 × 17 cm',                       ar: '23 × 17 سم' },
      material: { en: 'Genuine leather',                  ar: 'جلد طبيعي' },
      strap:    { en: 'Handle / Shoulder / Crossbody',    ar: 'يد / كتف / كروس' },
      closure:  { en: 'Zipper',                           ar: 'سوسته' },
      interior: { en: 'One compartment, inner pocket',    ar: 'جيب واسع + جيب داخلي' },
    },
  },
  {
    id: 'top-handle-tote',
    sku: 'B20-002',
    cat: 'totes',
    name: { en: 'Top-Handle Tote', ar: 'شنطة يد بمقبض علوي' },
    price: 350,
    featured: false,
    tagline: { en: 'Olive, contrast-stitched', ar: 'زيتوني بخياطة بارزة' },
    blurb: {
      en: 'A roomy top-handle tote in olive leather with contrast stitching and a clean front plaque.',
      ar: 'شنطة واسعة بمقبض علوي من الجلد الزيتوني بخياطة متباينة ولمسة أمامية نظيفة.',
    },
    variants: [
      { color: C('Olive', 'زيتوني', '#5a5e34'), img: 'assets/products/tote-olive.png', stock: true, shots: ['assets/products/details/tote-olive-angle.png'] },
    ],
    specs: {
      size:     { en: '28 × 16 cm',                    ar: '28 × 16 سم' },
      material: { en: 'Genuine leather',               ar: 'جلد طبيعي' },
      strap:    { en: 'Handle / Shoulder / Crossbody', ar: 'يد / كتف / كروس' },
      closure:  { en: 'Zipper',                        ar: 'سوسته' },
      interior: { en: 'One spacious compartment',      ar: 'جيب واحد واسع' },
    },
  },
  {
    id: 'zip-wallet',
    sku: 'B30-001',
    cat: 'wallets',
    name: { en: 'Compact Zip Wallet', ar: 'محفظة بسوسته' },
    price: 399,
    featured: false,
    tagline: { en: 'Pattern & order', ar: 'نقش وترتيب' },
    blurb: {
      en: 'A patterned zip wallet that keeps everything in order — six compartments and an inner pocket.',
      ar: 'محفظة منقوشة بسوسته تحفظ كل حاجة مرتبة — ست جيوب وجيب داخلي.',
    },
    variants: [
      { color: C('Cream', 'كريمي', '#e7e0cf'), img: 'assets/products/wallet-cream.png', stock: true, shots: ['assets/products/details/wallet-angle.png'] },
    ],
    specs: {
      material: { en: 'Genuine leather',                 ar: 'جلد طبيعي' },
      closure:  { en: 'Zipper',                          ar: 'سوسته' },
      interior: { en: 'Six compartments, inner pocket',  ar: 'ست جيوب + جيب داخلي' },
    },
  },
];

// --- FAQ ---
const FAQ = [
  {
    q: { en: 'How do I order?', ar: 'إزاي أطلب؟' },
    a: { en: 'Add what you love to the cart and check out — or chat with us on WhatsApp with your name, address and phone. Our team confirms everything with you right away.', ar: 'ضيفي اللي عجبك للسلة وكمّلي الأوردر — أو كلّمينا على واتساب باسمك وعنوانك ورقمك، وفريقنا هيأكدلك كل حاجة على طول.' },
  },
  {
    q: { en: 'How do I pay?', ar: 'إزاي أدفع؟' },
    a: { en: 'Cash on delivery. No deposit or upfront payment — you pay only when your order arrives.', ar: 'الدفع عند الاستلام. من غير أي مقدم أو دفع مقدماً — بتدفعي بس لما الأوردر يوصلك.' },
  },
  {
    q: { en: 'When will my order arrive?', ar: 'الأوردر هيوصل امتى؟' },
    a: { en: 'Usually within 2 to 4 days, right to your doorstep. Delivery time may vary by location.', ar: 'عادةً خلال 2 لـ 4 أيام لحد باب البيت. الوقت ممكن يختلف حسب مكانك.' },
  },
  {
    q: { en: 'How will I know my order shipped?', ar: 'هعرف إزاي إن الأوردر اتشحن؟' },
    a: { en: 'Once shipped, we contact you with an estimated delivery time so you can be ready to receive it.', ar: 'أول ما يتشحن هنتواصل معاكي ونديكي وقت متوقع للتسليم عشان تكوني جاهزة تستلمي.' },
  },
  {
    q: { en: 'How can I cancel my order?', ar: 'إزاي ألغي الأوردر؟' },
    a: { en: 'Contact us directly. If it hasn’t shipped, just confirm the cancellation. If it already shipped, shipping fees apply on delivery.', ar: 'تواصلي معانا مباشرةً. لو لسه ماتشحنش أكّدي الإلغاء وخلاص. لو اتشحن، مصاريف الشحن بتتحسب عند التسليم.' },
  },
];

// --- Shipping bullets ---
const SHIPPING = [
  { en: 'We are partnered with a trusted shipping company that delivers to your doorstep in no time.', ar: 'إحنا متعاقدين مع شركة شحن موثوقة بتوصّل لحد باب بيتك في أسرع وقت.' },
  { en: 'Pay on receipt — pay when you receive your order, not before.', ar: 'الدفع عند الاستلام — بتدفعي لما الأوردر يوصلك، مش قبل كده.' },
  { en: 'All payments are in cash only, for easier processing.', ar: 'كل المدفوعات كاش بس، لتسهيل العملية.' },
  { en: 'Remote-area shipping fees are paid in advance via Instapay / Vodafone Cash.', ar: 'مصاريف شحن المناطق البعيدة بتتدفع مقدماً عن طريق إنستاباي / فودافون كاش.' },
  { en: 'Delivery usually takes 2 to 4 days.', ar: 'التوصيل عادةً بياخد من 2 لـ 4 أيام.' },
  { en: 'If your order has already shipped, shipping fees apply in case of cancellation.', ar: 'لو الأوردر اتشحن بالفعل، مصاريف الشحن بتتحسب في حالة الإلغاء.' },
];

const GOVERNORATES = ['Cairo','Giza','Alexandria','Qalyubia','Dakahlia','Sharqia','Gharbia','Monufia','Beheira','Kafr El Sheikh','Damietta','Port Said','Ismailia','Suez','Fayoum','Beni Suef','Minya','Asyut','Sohag','Qena','Luxor','Aswan','Red Sea','Matrouh','North Sinai','South Sinai','New Valley'];

// Arabic names for governorates (for display)
const GOV_AR = {
  'Cairo':'القاهرة','Giza':'الجيزة','Alexandria':'الإسكندرية','Qalyubia':'القليوبية','Dakahlia':'الدقهلية','Sharqia':'الشرقية','Gharbia':'الغربية','Monufia':'المنوفية','Beheira':'البحيرة','Kafr El Sheikh':'كفر الشيخ','Damietta':'دمياط','Port Said':'بورسعيد','Ismailia':'الإسماعيلية','Suez':'السويس','Fayoum':'الفيوم','Beni Suef':'بني سويف','Minya':'المنيا','Asyut':'أسيوط','Sohag':'سوهاج','Qena':'قنا','Luxor':'الأقصر','Aswan':'أسوان','Red Sea':'البحر الأحمر','Matrouh':'مطروح','North Sinai':'شمال سيناء','South Sinai':'جنوب سيناء','New Valley':'الوادي الجديد'
};

// Default per-governorate shipping rates (LE). Editable from Admin → Settings.
const SHIP_RATES = (() => {
  const base = { 'Cairo':50, 'Giza':50, 'Alexandria':60, 'Qalyubia':60 };
  const r = {}; GOVERNORATES.forEach(g => { r[g] = base[g] != null ? base[g] : 70; });
  return r;
})();

// --- Editable site content. Editable from Admin → Content. Arabic = Egyptian dialect. ---
const SITE_CONTENT = {
  announce: { en: 'Free pickup · Cash on delivery · Ships in 2–4 days across Egypt', ar: 'دفع عند الاستلام · الشحن خلال ٢–٤ أيام لكل مصر' },
  marquee: [
    { en: 'Carry Your Confidence', ar: 'احملي ثقتك' },
    { en: 'Genuine Leather', ar: 'جلد طبيعي' },
    { en: 'Cash On Delivery', ar: 'الدفع عند الاستلام' },
    { en: 'Made for Every Day', ar: 'معاكي كل يوم' },
    { en: 'Egypt-wide Shipping', ar: 'بنشحن لكل مصر' },
  ],
  hero: {
    eyebrow: { en: 'Bags · Wallets · Made in Egypt', ar: 'شنط · محافظ · صنع في مصر' },
    title: { en: 'Carry Your Confidence', ar: 'احملي ثقتك' },
    lede: { en: 'A contemporary bag brand for the modern everyday — refined design, premium leather, timeless style.', ar: 'ماركة شنط عصرية ليومِك — تصميم شيك، جلد فاخر، وستايل ميقدّمش أبداً.' },
    image: 'assets/products/tote-beige.png',
    primaryLabel: { en: 'Shop the collection', ar: 'اتسوّقي المجموعة' },
    primaryHref: 'shop',
    secondaryLabel: { en: 'Our story', ar: 'قصتنا' },
    secondaryHref: 'about',
  },
  values: [
    { icon: 'cash', h: { en: 'Pay on receipt', ar: 'ادفعي عند الاستلام' }, p: { en: 'No upfront payment or deposit. Pay in cash when your order arrives.', ar: 'من غير أي مقدم ولا دفع قبل كده. بتدفعي كاش لما الأوردر يوصلك.' } },
    { icon: 'truck', h: { en: 'Fast doorstep delivery', ar: 'توصيل سريع لحد الباب' }, p: { en: 'Partnered with a trusted courier — usually 2 to 4 days, Egypt-wide.', ar: 'بنشحن مع شركة موثوقة — عادةً من ٢ لـ ٤ أيام لكل مصر.' } },
    { icon: 'chat', h: { en: 'Order by chat', ar: 'اطلبي بالرسايل' }, p: { en: 'No need to call — order on WhatsApp and we confirm everything right away.', ar: 'مش محتاجة تتصلي بحد — اطلبي على واتساب وإحنا نأكّدلك كل حاجة على طول.' } },
  ],
  editHead: { eyebrow: { en: 'The Edit', ar: 'المختارة' }, title: { en: 'Bestselling pieces', ar: 'الأكثر مبيعاً' }, viewAll: { en: 'View all', ar: 'شوفي الكل' } },
  gift: {
    eyebrow: { en: 'The perfect gift', ar: 'أحلى هدية' },
    title: { en: 'For yourself, and the ones you love', ar: 'لنفسِك، ولأقرب الناس ليكي' },
    lede: { en: 'Every JUYUB piece arrives wrapped and ready to give — a considered gift that carries confidence, beautifully.', ar: 'كل قطعة من چيوب بتوصلك متغلّفة وجاهزة للإهداء — هدية مدروسة بتحمل الثقة بشكل جميل.' },
    button: { en: 'Find a gift', ar: 'اختاري هدية' },
    buttonHref: 'shop',
    image: 'https://juyub.odoo.com/web/image/1081',
  },
  quote: {
    text: { en: '“A bag is more than an accessory. It’s a statement of confidence.”', ar: '«الشنطة أكتر من إكسسوار. دي تعبير عن الثقة.»' },
    button: { en: 'About JUYUB', ar: 'عن چيوب' },
    buttonHref: 'about',
  },
  contact: {
    eyebrow: { en: 'Need a hand?', ar: 'محتاجة مساعدة؟' },
    title: { en: 'Chat with us anytime', ar: 'كلّمينا في أي وقت' },
    lede: { en: 'Questions about sizing, colors or your order? Our team is one message away.', ar: 'عندك سؤال عن المقاس أو اللون أو طلبك؟ فريقنا على بُعد رسالة واحدة.' },
    button: { en: 'Message on WhatsApp', ar: 'راسلينا على واتساب' },
  },
  about: {
    heroEyebrow: { en: 'Our story', ar: 'قصتنا' },
    heroTitle: { en: 'About JUYUB', ar: 'عن چيوب' },
    heroLede: { en: 'A contemporary bag brand, founded in Egypt — built on confidence, elegance and individuality.', ar: 'ماركة شنط عصرية، اتأسست في مصر — قايمة على الثقة والأناقة والتميّز.' },
    image: 'https://juyub.odoo.com/web/image/1080',
    splitTitle: { en: 'More than an accessory', ar: 'أكتر من مجرد إكسسوار' },
    splitP1: { en: 'At JUYUB, we believe a bag is more than just an accessory. It’s a statement of confidence, elegance, and individuality.', ar: 'في چيوب، إحنا مؤمنين إن الشنطة أكتر من مجرد إكسسوار. دي تعبير عن الثقة والأناقة والتميّز.' },
    splitP2: { en: 'Founded in Egypt, we curate collections that blend refined design, premium quality, and timeless style. Whether you’re heading to work, traveling, or embracing your daily moments — carry your confidence with JUYUB.', ar: 'اتأسسنا في مصر، وبننتقي مجموعات بتجمع بين التصميم الشيك والجودة الفاخرة والستايل اللي ميقدمش. سواء رايحة الشغل، مسافرة، أو عايشة يومِك العادي — احملي ثقتك مع چيوب.' },
    splitButton: { en: 'Explore the collection', ar: 'اتفرّجي على المجموعة' },
    values: [
      { icon: 'sparkle', h: { en: 'Refined design', ar: 'تصميم شيك' }, p: { en: 'Each piece is selected to complement the modern lifestyle — from everyday essentials to statement bags.', ar: 'كل قطعة منتقاة عشان تكمّل ستايلِك العصري — من الأساسيات لشنط الإطلالات.' } },
      { icon: 'shield', h: { en: 'Premium quality', ar: 'جودة فاخرة' }, p: { en: 'Durable materials and meticulous attention to detail, for lasting value.', ar: 'خامات متينة واهتمام بأدق التفاصيل، عشان تفضل معاكي سنين.' } },
      { icon: 'leaf', h: { en: 'Timeless style', ar: 'ستايل ميقدمش' }, p: { en: 'Designs that move beyond trends — sophistication you carry season after season.', ar: 'تصاميم بتتعدّى الموضة — أناقة بتحمليها موسم ورا موسم.' } },
    ],
    quote: { en: '“Carry what you love, and craft your confidence.”', ar: '«احملي اللي بتحبيه، واصنعي ثقتك.»' },
  },
  shipping: {
    heroEyebrow: { en: 'Delivery & payment', ar: 'التوصيل والدفع' },
    heroTitle: { en: 'Shipping Info', ar: 'معلومات الشحن' },
    heroLede: { en: 'Pay on receipt, doorstep delivery across Egypt — here’s everything you need to know.', ar: 'دفع عند الاستلام وتوصيل لحد الباب لكل مصر — أهو كل اللي محتاجة تعرفيه.' },
    bullets: [
      { en: 'We are partnered with a trusted shipping company that delivers to your doorstep in no time.', ar: 'إحنا متعاقدين مع شركة شحن موثوقة بتوصّلك لحد باب البيت في أسرع وقت.' },
      { en: 'Pay on receipt — pay when you receive your order, not before.', ar: 'الدفع عند الاستلام — بتدفعي لما الأوردر يوصلك، مش قبل كده.' },
      { en: 'All payments are in cash only, for easier processing.', ar: 'كل المدفوعات كاش بس، عشان نسهّل العملية.' },
      { en: 'Remote-area shipping fees are paid in advance via Instapay / Vodafone Cash.', ar: 'مصاريف شحن المناطق البعيدة بتتدفع مقدّم عن طريق إنستاباي / فودافون كاش.' },
      { en: 'Delivery usually takes 2 to 4 days.', ar: 'التوصيل عادةً بياخد من ٢ لـ ٤ أيام.' },
      { en: 'If your order has already shipped, shipping fees apply in case of cancellation.', ar: 'لو الأوردر اتشحن بالفعل، مصاريف الشحن بتتحسب لو حصل إلغاء.' },
    ],
    trust: [
      { icon: 'cash', text: { en: 'Cash only, on delivery', ar: 'كاش بس، عند الاستلام' } },
      { icon: 'truck', text: { en: 'Doorstep, 2–4 days', ar: 'لحد الباب، ٢–٤ أيام' } },
      { icon: 'return', text: { en: 'Easy cancellation before shipping', ar: 'إلغاء سهل قبل الشحن' } },
    ],
  },
  faq: {
    heroEyebrow: { en: 'Q & A', ar: 'أسئلة وأجوبة' },
    heroTitle: { en: 'Questions, answered', ar: 'إجابات لأسئلتك' },
    heroLede: { en: 'Everything about ordering, paying, delivery and cancellations.', ar: 'كل حاجة عن الطلب والدفع والتوصيل والإلغاء.' },
    stillTitle: { en: 'Still have a question?', ar: 'لسه عندك سؤال؟' },
    items: [
      { q: { en: 'How do I order?', ar: 'إزاي أطلب؟' }, a: { en: 'Add what you love to the cart and check out — or chat with us on WhatsApp with your name, address and phone. Our team confirms everything with you right away.', ar: 'ضيفي اللي عجبِك للسلة وكمّلي الأوردر — أو كلّمينا على واتساب باسمِك وعنوانِك ورقمِك، وفريقنا هيأكّدلك كل حاجة على طول.' } },
      { q: { en: 'How do I pay?', ar: 'إزاي أدفع؟' }, a: { en: 'Cash on delivery. No deposit or upfront payment — you pay only when your order arrives.', ar: 'الدفع عند الاستلام. من غير أي مقدم ولا دفع قبل كده — بتدفعي بس لما الأوردر يوصلك.' } },
      { q: { en: 'When will my order arrive?', ar: 'الأوردر هيوصل امتى؟' }, a: { en: 'Usually within 2 to 4 days, right to your doorstep. Delivery time may vary by location.', ar: 'عادةً خلال ٢ لـ ٤ أيام لحد باب البيت. الوقت ممكن يختلف على حسب مكانك.' } },
      { q: { en: 'How will I know my order shipped?', ar: 'هعرف إزاي إن الأوردر اتشحن؟' }, a: { en: 'Once shipped, we contact you with an estimated delivery time so you can be ready to receive it.', ar: 'أول ما يتشحن هنكلّمك ونقولك معاد متوقّع للتسليم عشان تكوني جاهزة تستلميه.' } },
      { q: { en: 'How can I cancel my order?', ar: 'إزاي ألغي الأوردر؟' }, a: { en: 'Contact us directly. If it hasn’t shipped, just confirm the cancellation. If it already shipped, shipping fees apply on delivery.', ar: 'كلّمينا على طول. لو لسه ماتشحنش أكّدي الإلغاء وخلاص. لو اتشحن، مصاريف الشحن بتتحسب عند التسليم.' } },
    ],
  },
  footer: {
    tagline: { en: 'Juyub brings style to your every step. Carry what you love and craft your confidence.', ar: 'چيوب بتضيف ستايل لكل خطوة. احملي اللي بتحبيه واصنعي ثقتك.' },
    founded: { en: 'Founded in Egypt', ar: 'صُنع في مصر' },
    social: {
      instagram: 'https://www.instagram.com/juyub.eg/',
      tiktok: 'https://www.tiktok.com/@juyub.eg',
      facebook: 'https://www.facebook.com/Juyub.egg',
      whatsapp: 'https://wa.me/message/HRQIN2XJSVOWO1',
    },
  },
};

Object.assign(window, { CURRENCY, CATEGORIES, PRODUCTS, FAQ, SHIPPING, GOVERNORATES, GOV_AR, SHIP_RATES, SITE_CONTENT });
