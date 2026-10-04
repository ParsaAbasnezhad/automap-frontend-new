(function () {
    'use strict';

    /* ===== بلاک زوم ===== */
    document.addEventListener('touchmove', function (e) {
        if (e.touches.length > 1) e.preventDefault();
    }, { passive: false });

    var lastTouchEnd = 0;
    document.addEventListener('touchend', function (e) {
        var now = Date.now();
        if (now - lastTouchEnd <= 320) e.preventDefault();
        lastTouchEnd = now;
    }, false);

    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && ['+', '-', '0', '='].indexOf(e.key) !== -1) e.preventDefault();
        if (e.key === 'PrintScreen') e.preventDefault();
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['s', 'S', '4', '5'].indexOf(e.key) !== -1) e.preventDefault();
    });

    window.addEventListener('wheel', function (e) {
        if (e.ctrlKey) e.preventDefault();
    }, { passive: false });

    /* ===== بلاک کپی / منوی راست‌کلیک / درگ ===== */
    function isField(t) {
        return t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName);
    }
    ['contextmenu', 'dragstart', 'copy', 'cut', 'selectstart'].forEach(function (type) {
        document.addEventListener(type, function (e) {
            if (isField(e.target)) return;
            e.preventDefault();
        });
    });

    /* ===== نقطه‌ی اطلاعیه‌ی خوانده‌نشده ===== */
    function fetchUnreadCount() {
        var dot = document.getElementById('notifMenuDot');
        if (!dot) return;
        fetch('/notifications/unread-count/')
            .then(function (r) { return r.json(); })
            .then(function (d) { dot.style.display = d.unread_count > 0 ? 'block' : 'none'; })
            .catch(function () {});
    }
    document.addEventListener('DOMContentLoaded', fetchUnreadCount);
    setInterval(fetchUnreadCount, 30000);

    /* ===== صفحه‌ی قطع اینترنت ===== */
    var box = null;
    var busy = false;

    var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.58 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>';

    function showOffline() {
        if (box) return;
        box = document.createElement('div');
        box.className = 'offline';
        box.innerHTML =
            '<div class="offline-card">' +
            '<div class="offline-icon">' + ICON + '</div>' +
            '<h2>اتصال اینترنت قطع شد</h2>' +
            '<p>ارتباط شما با سرور برقرار نیست. لطفاً اتصال اینترنت خود را بررسی کنید.</p>' +
            '<button type="button" class="offline-retry">تلاش مجدد</button>' +
            '</div>';
        box.querySelector('.offline-retry').addEventListener('click', function () { location.reload(); });
        document.body.appendChild(box);
        document.body.style.overflow = 'hidden';
    }

    function hideOffline() {
        if (!box) return;
        var el = box;
        box = null;
        el.classList.add('out');
        setTimeout(function () { el.remove(); document.body.style.overflow = ''; }, 300);
    }

    function checkConnection() {
        if (busy) return;
        busy = true;
        var img = new Image();
        var finished = false;
        var timer = setTimeout(function () { done(false); }, 5000);

        function done(online) {
            if (finished) return;
            finished = true;
            clearTimeout(timer);
            busy = false;
            if (online) {
                if (box) location.reload();
            } else {
                showOffline();
            }
        }

        img.onload = function () { done(true); };
        img.onerror = function () { done(false); };
        img.src = 'https://www.cloudflare.com/favicon.ico?t=' + Date.now();
    }

    setTimeout(checkConnection, 500);
    setInterval(checkConnection, 4000);
    window.addEventListener('focus', checkConnection);
    window.addEventListener('online', function () { location.reload(); });
    window.addEventListener('offline', showOffline);
})();