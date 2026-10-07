(function () {
    'use strict';

    var toastTimer = null;

    function showToast() {
        var toast = document.getElementById('modernToast');
        if (!toast) return;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2000);
    }

    function fallbackCopy(text) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
        document.body.appendChild(textarea);
        textarea.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(textarea);
        showToast();
    }

    function copyText(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(showToast).catch(function () { fallbackCopy(text); });
        } else {
            fallbackCopy(text);
        }
    }

    function bindCopy(inputId, btnId) {
        var input = document.getElementById(inputId);
        var btn = document.getElementById(btnId);
        if (!input) return;
        function run() { copyText(input.value); }
        if (btn) btn.addEventListener('click', run);
        input.addEventListener('click', run);
    }

    document.addEventListener('DOMContentLoaded', function () {
        bindCopy('supportPhone', 'copyBtnPhone');
        bindCopy('supportInstagram', 'copyBtnIg');
    });
})();