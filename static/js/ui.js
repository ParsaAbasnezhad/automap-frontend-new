(function () {
    'use strict';

    var FIELD = 'input,textarea,select,[contenteditable="true"]';
    var INTERACTIVE = 'a,button,input,textarea,select,label,[role="button"]';

    function inField(t) {
        return !!(t && t.closest && t.closest(FIELD));
    }

    function stop(e) {
        e.preventDefault();
        return false;
    }

    /* ===== رویدادهایی که همیشه بلاک میشن ===== */
    ['dragstart', 'dragenter', 'dragover', 'drop',
        'gesturestart', 'gesturechange', 'gestureend', 'dblclick'
    ].forEach(function (type) {
        document.addEventListener(type, stop, { passive: false });
    });

    /* ===== کپی / برش / انتخاب / منوی راست‌کلیک (به‌جز داخل فیلدها) ===== */
    ['contextmenu', 'copy', 'cut', 'selectstart'].forEach(function (type) {
        document.addEventListener(type, function (e) {
            if (inField(e.target)) return;
            e.preventDefault();
        });
    });

    /* ===== زوم لمسی ===== */
    document.addEventListener('touchstart', function (e) {
        if (e.touches.length > 1) e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', function (e) {
        if (e.touches.length > 1 || (typeof e.scale === 'number' && e.scale !== 1)) e.preventDefault();
    }, { passive: false });

    // دابل‌تپ (روی لینک‌ها و دکمه‌ها اعمال نمیشه تا کلیک سریع خراب نشه)
    var lastTouchEnd = 0;
    document.addEventListener('touchend', function (e) {
        var now = Date.now();
        var t = e.target;
        if (now - lastTouchEnd <= 320 && !(t && t.closest && t.closest(INTERACTIVE))) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });

    /* ===== زوم با ماوس/کیبورد ===== */
    window.addEventListener('wheel', function (e) {
        if (e.ctrlKey) e.preventDefault();
    }, { passive: false });

    /* ===== میانبرهای کیبورد ===== */
    document.addEventListener('keydown', function (e) {
        var k = (e.key || '').toLowerCase();
        var mod = e.ctrlKey || e.metaKey;

        if (e.key === 'F12' || e.key === 'PrintScreen') { e.preventDefault(); return; }

        // زوم
        if (mod && ['+', '-', '=', '_', '0'].indexOf(e.key) !== -1) { e.preventDefault(); return; }

        // ذخیره، چاپ، مشاهده‌ی سورس
        if (mod && ['s', 'p', 'u'].indexOf(k) !== -1) { e.preventDefault(); return; }

        // ابزار توسعه‌دهنده و اسکرین‌شات
        if (mod && e.shiftKey && ['i', 'j', 'c', 's', '3', '4', '5'].indexOf(k) !== -1) {
            e.preventDefault();
            return;
        }

        // کپی / برش / انتخاب همه (به‌جز داخل فیلدها)
        if (mod && ['c', 'x', 'a'].indexOf(k) !== -1 && !inField(e.target)) e.preventDefault();
    });

    // بعد از PrintScreen کلیپ‌بورد خالی میشه (در حد توان مرورگر)
    document.addEventListener('keyup', function (e) {
        if (e.key === 'PrintScreen' && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText('').catch(function () {});
        }
    });

    /* ===== پرینت ===== */
    window.addEventListener('beforeprint', function () { document.documentElement.style.display = 'none'; });
    window.addEventListener('afterprint', function () { document.documentElement.style.display = ''; });

    /* ===== تصاویر و لینک‌ها قابل درگ نباشن ===== */
    function lockDrag() {
        document.querySelectorAll('img,a').forEach(function (el) {
            el.setAttribute('draggable', 'false');
        });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', lockDrag);
    else lockDrag();
})();