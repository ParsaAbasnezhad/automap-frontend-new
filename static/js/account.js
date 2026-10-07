(function () {
    'use strict';

    /* بستن پیام‌ها */
    document.querySelectorAll('.alert-close').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var alert = btn.closest('.alert');
            if (alert) alert.remove();
        });
    });

    /* نمایش/مخفی کردن رمز عبور */
    document.querySelectorAll('[data-toggle-password]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var field = document.getElementById(btn.getAttribute('data-toggle-password'));
            if (!field) return;
            var show = field.type === 'password';
            field.type = show ? 'text' : 'password';
            btn.classList.toggle('on', show);
        });
    });

    /* فقط رقم: شماره موبایل و کد ملی */
    function digitsOnly(id, max) {
        var el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', function () {
            var v = el.value.replace(/\D/g, '');
            if (v.length > max) v = v.slice(0, max);
            if (v !== el.value) el.value = v;
        });
    }
    digitsOnly('id_phone', 11);
    digitsOnly('id_national_id', 10);

    /* قدرت رمز عبور (ثبت‌نام) */
    var pw1 = document.getElementById('id_password1') || document.getElementById('id_new_password1');
    var pw2 = document.getElementById('id_password2') || document.getElementById('id_new_password2');
    var bar = document.getElementById('passwordStrength');

    if (pw1 && bar) {
        pw1.addEventListener('input', function () {
            var p = pw1.value;
            var strength = 0;
            if (p.length >= 8) strength += 25;
            if (/[a-z]/.test(p)) strength += 25;
            if (/[A-Z]/.test(p)) strength += 25;
            if (/[0-9]/.test(p)) strength += 25;

            bar.style.width = strength + '%';
            bar.className = 'strength-bar ' + (strength < 50 ? 'bar-weak' : strength < 75 ? 'bar-mid' : 'bar-strong');
        });
    }

    /* تطابق رمز عبور */
    function validateMatch() {
        if (!pw1 || !pw2 || pw2.value.length === 0) return;
        if (pw1.value !== pw2.value) {
            pw2.classList.add('is-invalid');
            pw2.setCustomValidity('رمزهای عبور مطابقت ندارند');
        } else {
            pw2.classList.remove('is-invalid');
            pw2.setCustomValidity('');
        }
    }
    if (pw1 && pw2) {
        pw1.addEventListener('input', validateMatch);
        pw2.addEventListener('input', validateMatch);
    }

    /* حالت «در حال پردازش» روی دکمه‌ی ارسال */
    document.querySelectorAll('form').forEach(function (form) {
        var btn = form.querySelector('button[type="submit"]');
        if (!btn) return;
        var original = btn.innerHTML;
        var timer = null;

        function reset() {
            clearTimeout(timer);
            btn.classList.remove('btn-loading');
            btn.disabled = false;
            btn.innerHTML = original;
        }

        form.addEventListener('submit', function () {
            if (btn.classList.contains('btn-loading')) return;
            btn.classList.add('btn-loading');
            btn.disabled = true;
            btn.innerHTML = '<span class="spin"></span> در حال پردازش...';
            timer = setTimeout(reset, 30000);      // اگر جواب نیومد دوباره فعال بشه
        });

        // برگشت با دکمه‌ی Back مرورگر
        window.addEventListener('pageshow', function (e) { if (e.persisted) reset(); });
    });
})();