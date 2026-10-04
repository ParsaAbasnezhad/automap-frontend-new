(function() {
    'use strict';

    var fa = new Intl.NumberFormat('fa-IR', { useGrouping: false });

    /* ===== Scroll reveal ===== */
    var revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        var revealObs = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    revealObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealEls.forEach(function(el, i) {
            el.style.transitionDelay = (i * 0.08) + 's';
            revealObs.observe(el);
        });
    } else {
        revealEls.forEach(function(el) { el.classList.add('in'); });
    }

    /* ===== Count-up برای آمار ===== */
    function countUp(el) {
        var target = parseInt(el.dataset.target, 10);
        if (isNaN(target)) return;

        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) { el.textContent = fa.format(target); return; }

        var duration = 900;
        var start = null;

        function step(ts) {
            if (start === null) start = ts;
            var p = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = fa.format(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    var card = document.querySelector('.profile-card');
    if (card && 'IntersectionObserver' in window) {
        var statObs = new IntersectionObserver(function(entries) {
            if (entries[0].isIntersecting) {
                document.querySelectorAll('.stat-number').forEach(countUp);
                statObs.disconnect();
            }
        }, { threshold: 0.4 });
        statObs.observe(card);
    }

    /* ===== حالت خالی: اگر گروهی نبود پیام نشون بده ===== */
    var groups = document.querySelectorAll('.access-group');
    var empty = document.querySelector('.access-empty');
    if (empty) empty.hidden = groups.length > 0;

    /* ===== منوی پایین ===== */
    var menuBtns = document.querySelectorAll('.menu-btn');
    menuBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            menuBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            // اینجا می‌تونی به صفحه‌ی مربوطه بری:
            // location.href = btn.dataset.page + '.html';
        });
    });

    /* ===== دکمه خروج ===== */
    var logout = document.querySelector('.logout-btn');
    if (logout) {
        logout.addEventListener('click', function() {
            // اینجا بعداً به فرم/ریدایرکت خروج وصلش کن
        });
    }
})();