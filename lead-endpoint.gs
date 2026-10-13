// ==== Настройки ====
const BOT_TOKEN = 'ВСТАВЬТЕ_ТОКЕН_БОТА';   // из @BotFather
const CHAT_ID   = 'ВСТАВЬТЕ_ВАШ_CHAT_ID';  // из @userinfobot

const HEADERS = ['Дата', 'Имя', 'Телефон', 'Связь', 'Что хочет', 'Страница'];
const MESSENGERS = { telegram: 'Telegram', viber: 'Viber', call: 'Звонок' };

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const when = new Date();
    const source = d.source || 'Рассчитать стоимость';
    const via = MESSENGERS[d.messenger] || d.messenger || '—';

    // 1) строка в таблицу (шапка ставится автоматически, если её нет)
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    if (sheet.getLastRow() === 0 || sheet.getRange(1, 5).getValue() !== 'Что хочет') {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    }
    sheet.appendRow([when, d.name || '', d.phone || '', via, source, d.page || '']);

    // 2) сообщение в Telegram
    const icon = /лендинг/i.test(source) ? '🖥' : '📣';
    const text =
      '🔔 Новая заявка с сайта\n' +
      icon + ' ' + source + '\n\n' +
      '👤 Имя: ' + (d.name || '—') + '\n' +
      '📞 Телефон: ' + (d.phone || '—') + '\n' +
      '💬 Связь: ' + via;

    UrlFetchApp.fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
      method: 'post',
      payload: { chat_id: CHAT_ID, text: text },
      muteHttpExceptions: true,
    });

    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err);
  }
}
