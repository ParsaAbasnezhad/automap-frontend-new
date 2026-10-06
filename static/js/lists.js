(function () {
    'use strict';

    var cards = [].slice.call(document.querySelectorAll('.pkg'));
    if (!cards.length) return;

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;

    var vh = window.innerHeight;

    var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(function (card, i) {
        // کارت‌هایی که از اول دیده میشن: ورود پله‌ای
        if (card.getBoundingClientRect().top < vh) {
            card.style.animationDelay = (Math.min(i, 8) * 0.05) + 's';
            card.classList.add('enter');
            return;
        }
        // کارت‌های پایین‌تر: با اسکرول ظاهر میشن
        card.classList.add('reveal');
        obs.observe(card);
    });
})();