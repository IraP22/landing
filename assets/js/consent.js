// Cookie-баннер и Meta Pixel.
// Пиксель загружается ТОЛЬКО после того, как посетитель нажал «Принять».
// Пока PIXEL_ID пустой, баннер не показывается: сайт не использует cookie.
(function () {
  var PIXEL_ID = ""; // ← сюда вписать ID пикселя из Meta Events Manager, например "123456789012345"
  var KEY = "cookie-consent"; // "all" или "necessary"

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function setChoice(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
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

  function hideBanner() {
    var b = document.getElementById("cookie-banner");
    if (b) b.remove();
  }

  function showBanner() {
    if (!PIXEL_ID || document.getElementById("cookie-banner")) return;
    var b = document.createElement("div");
    b.id = "cookie-banner";
    b.setAttribute("role", "dialog");
    b.setAttribute("aria-label", "Настройки cookie");
    b.style.cssText = "position:fixed;left:16px;right:16px;bottom:16px;z-index:200;max-width:560px;margin:0 auto;background:#16181B;color:#E9EAEC;border:1px solid rgba(255,255,255,0.14);border-radius:18px;padding:18px 20px;font:14px/1.5 Manrope,system-ui,sans-serif;box-shadow:0 12px 40px rgba(0,0,0,.5)";
    b.innerHTML =
      '<p style="margin:0 0 14px;color:#B4B8BF">Сайт использует cookie Meta Pixel, чтобы анализировать посещения и показывать рекламу. ' +
      'Они включатся только с вашего согласия. <a href="privacy.html#cookie" style="color:#E9EAEC;text-decoration:underline">Подробнее</a></p>' +
      '<div style="display:flex;flex-wrap:wrap;gap:10px">' +
      '<button type="button" data-c="all" style="flex:1 1 140px;background:#E9EAEC;color:#0B0C0E;border:none;border-radius:999px;padding:12px 16px;font:700 12px/1 Manrope,system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;cursor:pointer">Принять</button>' +
      '<button type="button" data-c="necessary" style="flex:1 1 140px;background:transparent;color:#E9EAEC;border:1px solid rgba(255,255,255,0.22);border-radius:999px;padding:12px 16px;font:700 12px/1 Manrope,system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;cursor:pointer">Отклонить</button>' +
      "</div>";
    b.addEventListener("click", function (e) {
      var c = e.target && e.target.getAttribute && e.target.getAttribute("data-c");
      if (!c) return;
      setChoice(c);
      hideBanner();
      if (c === "all") loadPixel();
    });
    document.body.appendChild(b);
  }

  // Для кнопки «Изменить настройки cookie» на странице политики.
  window.openCookieSettings = function () {
    try { localStorage.removeItem(KEY); } catch (e) {}
    if (!PIXEL_ID) { alert("Сайт сейчас не использует cookie."); return; }
    if (window.fbq) { location.reload(); return; } // выгрузить уже загруженный пиксель
    showBanner();
  };

  function start() {
    var choice = getChoice();
    if (choice === "all") loadPixel();
    else if (!choice) showBanner();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
