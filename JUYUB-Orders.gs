/***********************************************************************
 * JUYUB — Orders → Google Sheet
 * كود Google Apps Script لاستقبال الأوردرات من الموقع وتسجيلها في الشيت
 *
 * خطوات التركيب:
 * 1) افتحي الـ Google Sheet بتاعك (Juyub Orders).
 * 2) Extensions ▸ Apps Script.
 * 3) امسحي أي كود موجود والصقي الكود ده كله.
 * 4) Save (أيقونة الديسك).
 * 5) Deploy ▸ Manage deployments ▸ (عدّلي الـ deployment الحالي)
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    اعملي Deploy. (لو طلب صلاحيات وافقي عليها.)
 * 6) خلاص — أي أوردر جديد هيتسجّل تلقائياً في الشيت.
 *
 * ملاحظة: لو عملتي Deploy جديد وطلع لينك (URL) جديد، حطّيه في
 * الموقع من: لوحة التحكم ▸ الإعدادات ▸ جوجل شيت.
 ***********************************************************************/

var SHEET_NAME = 'Sheet1'; // غيّري الاسم لو الشيت اسمه مختلف
var HEADERS = ['Date','Order ID','Name','Phone','Governorate','City','Address','Notes','Items','Items (AR)','Qty','Subtotal','Shipping','Total','Payment'];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sh = getSheet_();
    sh.appendRow([
      data.date || new Date(),
      data.id || '',
      data.name || '',
      "'" + (data.phone || ''),   // الـ ' بتخلي الرقم يفضل نص ومايضيعش الصفر
      data.governorate || '',
      data.city || '',
      data.address || '',
      data.notes || '',
      data.items || '',
      data.itemsAr || '',
      data.count || '',
      data.subtotal || 0,
      data.shipping || 0,
      data.total || 0,
      data.payment || 'Cash on delivery'
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// للتجربة من المتصفح (اختياري): افتحي لينك الـ /exec هيكتبلك إن الخدمة شغّالة
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'ok', message: 'JUYUB orders endpoint is live' }))
    .setMimeType(ContentService.MimeType.JSON);
}
