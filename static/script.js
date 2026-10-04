(function() {
    /* ============= SLIDER ============= */
    const slidesEl = document.getElementById('slides');
    const slides = slidesEl.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('dots');
    const count = slides.length;
    let current = 0;
    let timer = null;

    // Build dots dynamically
    for (let i = 0; i < count; i++) {
        const d = document.createElement('button');
        d.className = 'dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', `اسلاید ${i + 1}`);
        d.addEventListener('click', () => {
            goTo(i);
            reset();
        });
        dotsContainer.appendChild(d);
    }
    const dots = dotsContainer.querySelectorAll('.dot');

    function goTo(i) {
        if (i < 0) i = count - 1;
        if (i >= count) i = 0;
        current = i;
        slidesEl.style.transform = `translateX(${current * 100}%)`;
        slides.forEach((s, idx) => s.classList.toggle('active', idx === current));
        dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
    }

    function start() { timer = setInterval(() => goTo(current + 1), 4500); }

    function reset() {
        clearInterval(timer);
        start();
    }

    // Pause on hover
    const sliderEl = document.getElementById('slider');
    sliderEl.addEventListener('mouseenter', () => clearInterval(timer));
    sliderEl.addEventListener('mouseleave', start);

    // Touch swipe
    let touchX = 0;
    sliderEl.addEventListener('touchstart', e => {
        touchX = e.touches[0].clientX;
        clearInterval(timer);
    }, { passive: true });

    sliderEl.addEventListener('touchend', e => {
        const diff = touchX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            goTo(diff > 0 ? current + 1 : current - 1);
        }
        start();
    });

    // Start autoplay
    start();

    /* ============= PACKAGE BUTTONS ============= */
    document.querySelectorAll('.pkg').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.animate(
                [
                    { transform: 'translateX(0)' },
                    { transform: 'translateX(-6px)' },
                    { transform: 'translateX(0)' }
                ], { duration: 220, easing: 'ease-out' }
            );
        });
    });

    /* ============= BOTTOM MENU ============= */
    const menuBtns = document.querySelectorAll('.menu-btn');
    menuBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            menuBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
})();