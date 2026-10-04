/* ========== FAQ PAGE LOGIC ========== */
(function() {
    // === Bottom Menu ===
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // === Accordion ===
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            // بستن همه
            faqItems.forEach(i => i.classList.remove('open'));
            // باز کردن اگر بسته بود
            if (!isOpen) item.classList.add('open');
        });
    });

    // === Category Filter ===
    const cats = document.querySelectorAll('.cat');
    cats.forEach(cat => {
        cat.addEventListener('click', () => {
            cats.forEach(c => c.classList.remove('active'));
            cat.classList.add('active');

            const selected = cat.dataset.cat;
            faqItems.forEach(item => {
                const match = selected === 'all' || item.dataset.cat === selected;
                item.style.display = match ? '' : 'none';
            });

            // ریست سرچ
            searchInput.value = '';
            checkEmpty();
        });
    });

    // === Search ===
    const searchInput = document.getElementById('searchInput');
    const emptyState = document.getElementById('emptyState');

    function checkEmpty() {
        const visible = Array.from(faqItems).filter(i => i.style.display !== 'none');
        emptyState.style.display = visible.length === 0 ? 'block' : 'none';
    }

    searchInput.addEventListener('input', (e) => {
        const q = e.target.value.trim().toLowerCase();

        // ریست دسته‌بندی
        cats.forEach(c => c.classList.remove('active'));
        document.querySelector('.cat[data-cat="all"]').classList.add('active');

        if (!q) {
            faqItems.forEach(i => i.style.display = '');
            checkEmpty();
            return;
        }

        faqItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(q) ? '' : 'none';
        });

        checkEmpty();
    });

    // === Contact Button ===
    document.querySelector('.contact-btn') ? .addEventListener('click', () => {
        console.log('گفتگو با پشتیبانی باز شد');
    });
})();