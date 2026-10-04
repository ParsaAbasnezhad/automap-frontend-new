(function() {
    /* ============= SLIDER ============= */
    const sliderEl = document.getElementById('slider');
    if (sliderEl) {
        const slides = sliderEl.querySelectorAll('.slide');
        const dotsContainer = document.getElementById('dots');
        const count = slides.length;

        if (count && dotsContainer) {
            let current = 0;
            let timer = null;

            for (let i = 0; i < count; i++) {
                const dot = document.createElement('button');
                dot.className = 'dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', `اسلاید ${i + 1}`);
                dot.addEventListener('click', () => {
                    goTo(i);
                    reset();
                });
                dotsContainer.appendChild(dot);
            }

            const dots = dotsContainer.querySelectorAll('.dot');

            function goTo(index) {
                current = (index + count) % count;
                slides.forEach((slide, slideIndex) => {
                    slide.classList.toggle('active', slideIndex === current);
                });
                dots.forEach((dot, dotIndex) => {
                    dot.classList.toggle('active', dotIndex === current);
                });
            }

            function start() {
                timer = setInterval(() => goTo(current + 1), 4500);
            }

            function reset() {
                clearInterval(timer);
                start();
            }

            sliderEl.addEventListener('mouseenter', () => clearInterval(timer));
            sliderEl.addEventListener('mouseleave', start);

            let touchX = 0;
            sliderEl.addEventListener('touchstart', event => {
                touchX = event.touches[0].clientX;
                clearInterval(timer);
            }, { passive: true });

            sliderEl.addEventListener('touchend', event => {
                const diff = touchX - event.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) {
                    goTo(current + (diff > 0 ? 1 : -1));
                }
                start();
            });

            start();
        }
    }

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