(function () {
    'use strict';

    var slider = document.getElementById('slider');
    if (!slider) return;

    var slides = [].slice.call(slider.querySelectorAll('.slide'));
    var dotsEl = document.getElementById('dots');
    var INTERVAL = 5000;
    var current = 0;
    var timer = null;
    var dots = [];

    // با یک اسلاید، نقطه‌ها و اتوپلی لازم نیست
    if (slides.length < 2) {
        if (dotsEl) dotsEl.remove();
        return;
    }

    slides.forEach(function (_, n) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'dot' + (n === 0 ? ' active' : '');
        b.setAttribute('aria-label', 'اسلاید ' + (n + 1));
        b.addEventListener('click', function () { go(n); restart(); });
        dotsEl.appendChild(b);
        dots.push(b);
    });

    function go(n) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (n + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }

    function stop() { clearInterval(timer); timer = null; }

    function restart() {
        stop();
        timer = setInterval(function () { go(current + 1); }, INTERVAL);
    }

    // سوایپ (در RTL: کشیدن به راست = بعدی)
    var startX = null;
    slider.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
        stop();
    }, { passive: true });

    slider.addEventListener('touchend', function (e) {
        if (startX !== null) {
            var dx = e.changedTouches[0].clientX - startX;
            if (dx > 40) go(current + 1);
            else if (dx < -40) go(current - 1);
        }
        startX = null;
        restart();
    }, { passive: true });

    // وقتی تب پنهانه متوقف بشه
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) stop(); else restart();
    });

    restart();
})();