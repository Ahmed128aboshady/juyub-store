# JUYUB · چيوب — Source Code

موقع متجر شنط (React + Babel inline، ملف واحد بيشغّل كذا ملف JSX).

## التشغيل
افتح `JUYUB Store.html` في المتصفح. كل الملفات بتتحمّل عن طريق `<script>` tags جواه.
(`JUYUB-Store-standalone.html` = نسخة مجمّعة في ملف واحد — للرفع على Odoo. متعدّلش فيها، عدّل المصدر.)

## الملفات
- `JUYUB Store.html` — نقطة البداية: الخطوط، CSS، وترتيب تحميل ملفات JSX.
- `styles.css` — كل التصميم (design system، الصفحات، لوحة التحكم، الأيقونات الـ floating).
- `data.jsx` — المنتجات الافتراضية، الفئات، الأسئلة، نصوص الشحن، المحافظات.
- `ui.jsx` — مكوّنات مشتركة: Header, Footer, ProductCard, CartDrawer, FloatingSocial, الأيقونات (Icon).
- `pages-content.jsx` — صفحات: Home, About, Shipping, FAQ.
- `pages-shop.jsx` — صفحات: Shop, Product, Checkout, Confirmation.
- `admin.jsx` — تسجيل دخول المالك + لوحة التحكم (المنتجات، الأوردرات، الإعدادات).
- `content-editor.jsx` — تبويب "المحتوى" داخل لوحة التحكم (تعديل كل نصوص/صور الموقع).
- `app.jsx` — الجذر: الحالة (state)، الراوتر، السلة، الأوردرات، التكامل مع Google Sheet، الـ Tweaks.
- `tweaks-panel.jsx` — لوحة الـ Tweaks (مكوّن جاهز).
- `JUYUB-Orders.gs` — كود Google Apps Script (يتحط في الشيت، مش في الموقع).
- `assets/` — صور البراند والمنتجات (البراند دلوقتي روابط Odoo؛ دي نسخ احتياطية محلية).

## ملاحظات مهمة للتعديل
- React عن طريق Babel inline — **لازم** كل ملف JSX ينتهي بـ `Object.assign(window, {...})` عشان يشارك المكوّنات.
- متكتبش `const styles = {}` باسم عام — استخدم أسماء مميزة لكل ملف.
- الحالة كلها بتتخزّن في localStorage بـ prefix `juyub_`.
- بيانات دخول الأدمن الافتراضية: user `juyub` / pass `juyub2025` (تتغيّر من الإعدادات).
- صور البراند روابط Odoo `/web/image/...` — شغّالة أونلاين بس.
