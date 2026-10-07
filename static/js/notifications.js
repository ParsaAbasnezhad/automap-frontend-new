(function () {
    'use strict';

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    document.querySelectorAll('.notification-card').forEach(function (card) {
        card.addEventListener('click', function (e) {
            // جلوگیری از کلیک روی لینک‌های داخلی
            if (e.target.closest('.click-hint')) return;

            var notifId = this.dataset.id;
            var clickUrl = this.dataset.url;
            var el = this;

            // افکت بازخورد لمسی
            el.classList.add('pressed');
            setTimeout(function () { el.classList.remove('pressed'); }, 150);

            // اثر haptic (برای دستگاه‌های پشتیبان)
            if ('vibrate' in navigator) navigator.vibrate(10);

            fetch('/notifications/mark-clicked/' + notifId + '/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'Content-Type': 'application/json'
                }
            })
                .then(function (response) { return response.json(); })
                .then(function (data) {
                    if (data.status === 'success') {
                        if (clickUrl) window.open(clickUrl, '_blank');
                        location.reload();
                    }
                })
                .catch(function (err) { console.error('Error:', err); });
        });
    });
})();