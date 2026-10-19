// Окно согласия на cookie с настройками по категориям.
// Технические — всегда включены. Маркетинговые (Meta Pixel) — только если посетитель их разрешил.
// Пока PIXEL_ID не вписан, пиксель не загружается.
(function () {
  var PIXEL_ID = ""; // ← ID пикселя из Meta Events Manager, например "123456789012345"
  var KEY = "cookie-consent";
  var BOX = "ip-consent-box"; // нейтральный id: блокировщики рекламы прячут элементы с id вроде "cookie-banner"

  // Выбор хранится как {"m":true/false}; старые значения "all"/"necessary" тоже понимаем.
  function getChoice() {
    var v = null;
    try { v = localStorage.getItem(KEY); } catch (e) { return null; }
    if (!v) return null;
    if (v === "all") return { m: true };
    if (v === "necessary") return { m: false };
    try { var o = JSON.parse(v); return { m: !!o.m }; } catch (e) { return null; }
  }
  function setChoice(c) {
    try { localStorage.setItem(KEY, JSON.stringify({ m: !!c.m })); } catch (e) {}
  }

  function loadPixel() {
    if (!PIXEL_ID || window.fbq) return;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", PIXEL_ID);
    window.fbq("track", "PageView");
  }

  function apply(c) {
    if (c.m) loadPixel();
  }

  var CSS =
    "#" + BOX + "{position:fixed;left:20px;bottom:20px;z-index:200;width:360px;max-width:calc(100vw - 24px);max-height:calc(100vh - 32px);overflow:auto;box-sizing:border-box;background:#16181B;color:#E9EAEC;border:1px solid rgba(255,255,255,.14);border-radius:16px;padding:14px 16px;font:12.5px/1.45 Manrope,system-ui,sans-serif;box-shadow:0 10px 32px rgba(0,0,0,.5)}" +
    "@media (max-width:480px){#" + BOX + "{left:12px;right:12px;bottom:12px;width:auto;max-width:none}}" +
    "#" + BOX + " p{margin:0 0 10px;color:#B4B8BF}" +
    "#" + BOX + " a{color:#E9EAEC;text-decoration:underline}" +
    "#" + BOX + " .ipc-row{display:flex;gap:8px;flex-wrap:wrap}" +
    "#" + BOX + " .ipc-btn{flex:1 1 auto;border-radius:999px;padding:9px 12px;font:600 12px/1.2 Manrope,system-ui,sans-serif;cursor:pointer;white-space:nowrap}" +
    "#" + BOX + " .ipc-main{background:#E9EAEC;color:#0B0C0E;border:none}" +
    "#" + BOX + " .ipc-ghost{background:transparent;color:#E9EAEC;border:1px solid rgba(255,255,255,.22)}" +
    "#" + BOX + " .ipc-link{display:inline-block;margin:0 0 10px;padding:0;background:none;border:none;color:#E9EAEC;text-decoration:underline;font:600 12px/1.4 Manrope,system-ui,sans-serif;cursor:pointer}" +
    "#" + BOX + " .ipc-title{font:600 14px/1.3 Oswald,sans-serif;text-transform:uppercase;letter-spacing:.02em;margin:0 0 8px;color:#E9EAEC}" +
    "#" + BOX + " .ipc-cat{padding:10px 0;border-top:1px solid rgba(255,255,255,.08)}" +
    "#" + BOX + " .ipc-head{display:flex;align-items:center;justify-content:space-between;gap:12px;font-weight:700;color:#E9EAEC}" +
    "#" + BOX + " .ipc-desc{margin:4px 0 0;font-size:11.5px;line-height:1.45;color:#8E939B}" +
    "#" + BOX + " .ipc-sw{position:relative;flex:none;width:42px;height:24px}" +
    "#" + BOX + " .ipc-sw input{position:absolute;opacity:0;width:100%;height:100%;margin:0;cursor:pointer}" +
    "#" + BOX + " .ipc-sw span{position:absolute;inset:0;border-radius:999px;background:rgba(255,255,255,.18);transition:background .2s;pointer-events:none}" +
    "#" + BOX + " .ipc-sw span::after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#0B0C0E;transition:transform .2s}" +
    "#" + BOX + " .ipc-sw input:checked+span{background:#E9EAEC}" +
    "#" + BOX + " .ipc-sw input:checked+span::after{transform:translateX(18px)}" +
    "#" + BOX + " .ipc-sw input:disabled{cursor:not-allowed}" +
    "#" + BOX + " .ipc-sw input:disabled+span{opacity:.6}" +
    "#" + BOX + " .ipc-sw input:focus-visible+span{outline:2px solid #fff;outline-offset:2px}";

  function sw(name, checked, disabled, label) {
    return '<label class="ipc-sw"><input type="checkbox" name="' + name + '"' + (checked ? " checked" : "") +
      (disabled ? " disabled" : "") + ' aria-label="' + label + '"><span></span></label>';
  }

  function hideBanner() {
    var b = document.getElementById(BOX);
    if (b) b.remove();
  }

  function showBanner(openSettings) {
    hideBanner();
    if (!document.getElementById(BOX + "-css")) {
      var st = document.createElement("style");
      st.id = BOX + "-css";
      st.textContent = CSS;
      document.head.appendChild(st);
    }
    var cur = getChoice() || { m: false };
    var b = document.createElement("div");
    b.id = BOX;
    b.setAttribute("role", "dialog");
    b.setAttribute("aria-label", "Согласие на обработку cookie");
    b.innerHTML =
      '<div data-v="main">' +
        "<p>Мы используем необходимые cookie для работы сайта, а с Вашего согласия — маркетинговые cookie " +
        "для оценки эффективности рекламных кампаний, измерения конверсий и ретаргетинга. Подробнее — в " +
        '<a href="cookie.html">Политике cookie</a>.</p>' +
        '<button type="button" class="ipc-link" data-c="open">Настроить</button>' +
        '<div class="ipc-row">' +
          '<button type="button" class="ipc-btn ipc-ghost" data-c="none">Отклонить необязательные</button>' +
          '<button type="button" class="ipc-btn ipc-main" data-c="all">Принять все</button>' +
        "</div>" +
      "</div>" +
      '<div data-v="settings" hidden>' +
        '<div class="ipc-title">Настройки cookie</div>' +
        '<div class="ipc-cat"><div class="ipc-head">Технические (обязательные)' + sw("t", true, true, "Технические cookie всегда включены") + "</div>" +
          '<p class="ipc-desc">Нужны для работы сайта, форм заявок и сохранения ваших настроек. Всегда включены, отключить нельзя.</p></div>' +
        '<div class="ipc-cat"><div class="ipc-head">Маркетинговые' + sw("m", cur.m, false, "Маркетинговые cookie") + "</div>" +
          '<p class="ipc-desc">Нужны для показа рекламы и оценки её эффективности (Meta Pixel — Facebook и Instagram). Данные передаются компании Meta Platforms за пределы Республики Беларусь.</p></div>' +
        '<div class="ipc-row" style="margin-top:6px">' +
          '<button type="button" class="ipc-btn ipc-ghost" data-c="all">Принять все</button>' +
          '<button type="button" class="ipc-btn ipc-main" data-c="save">Сохранить настройки</button>' +
        "</div>" +
      "</div>";

    function view(settings) {
      b.querySelector('[data-v="main"]').hidden = settings;
      b.querySelector('[data-v="settings"]').hidden = !settings;
    }
    b.addEventListener("click", function (e) {
      var c = e.target && e.target.getAttribute && e.target.getAttribute("data-c");
      if (!c) return;
      if (c === "open") { view(true); return; }
      var choice =
        c === "all" ? { m: true } :
        c === "none" ? { m: false } :
        { m: b.querySelector('input[name="m"]').checked };
      var prev = getChoice();
      setChoice(choice);
      hideBanner();
      // Если пиксель уже загружен, а теперь выключен — перезагрузить страницу, чтобы выгрузить его.
      if (prev && prev.m && !choice.m && window.fbq) { location.reload(); return; }
      apply(choice);
    });
    document.body.appendChild(b);
    view(!!openSettings);
  }

  // Для кнопки «Изменить настройки cookie» на странице cookie.html.
  window.openCookieSettings = function () { showBanner(true); };

  function start() {
    var c = getChoice();
    if (c) apply(c);
    else showBanner(false);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
