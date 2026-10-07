(function () {
  'use strict';

  var toastTimer = null;

  function showToast() {
    var toast = document.getElementById('copyToast');
    if (!toast) return;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2000);
  }

  function fallbackCopy(number) {
    // برای مرورگرهای قدیمی
    var el = document.createElement('textarea');
    el.value = number;
    el.setAttribute('readonly', '');
    el.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
    document.body.appendChild(el);
    el.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(el);
    showToast();
  }

  // با onclick="copyPhone('...')" صدا زده میشه
  window.copyPhone = function (number) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(number).then(showToast).catch(function () { fallbackCopy(number); });
    } else {
      fallbackCopy(number);
    }
  };
})();
