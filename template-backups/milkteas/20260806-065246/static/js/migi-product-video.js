(function () {
    'use strict';

    function withoutAutoplay(url) {
        try {
            var parsed = new URL(url, window.location.origin);
            parsed.searchParams.set('autoplay', 'false');
            return parsed.toString();
        } catch (ignore) {
            return url;
        }
    }

    function playerUrl(rawUrl) {
        var raw = (rawUrl || '').trim();
        if (!raw || raw === 'none' || raw === 'https://geo.dailymotion.com/player.html?video=') {
            return '';
        }

        var tikTokId = raw.match(/tiktok\.com\/(?:player\/v1\/|[^?#]+\/video\/)(\d+)/i);
        if (tikTokId) {
            return 'https://www.tiktok.com/player/v1/' + tikTokId[1] + '?autoplay=0&loop=0';
        }

        if (/dailymotion\.com/i.test(raw)) {
            // Product data already stores Dailymotion's working geo player URL.
            // Keep it byte-for-byte like nncminhchau.vn/thegioithan.com do.
            return raw;
        }

        if (/dai\.ly/i.test(raw)) {
            var dailyId = raw.match(/(?:video[=\/]|dai\.ly\/)([a-zA-Z0-9]+)/i);
            if (dailyId) {
                return 'https://geo.dailymotion.com/player.html?video=' + dailyId[1];
            }
            return '';
        }

        // Keep an existing provider embed usable, while always asking it not to autoplay.
        return withoutAutoplay(raw);
    }

    function initialize(scope) {
        (scope || document).querySelectorAll('iframe[data-product-video]').forEach(function (frame) {
            var src = playerUrl(frame.getAttribute('data-product-video'));
            if (!src) {
                var container = frame.closest('[data-product-video-container]');
                if (container) container.hidden = true;
                return;
            }
            // Dailymotion is rendered directly by Thymeleaf. Do not replace a
            // working player URL after it has begun loading.
            if (!frame.src || !/dailymotion\.com/i.test(frame.getAttribute('data-product-video') || '')) {
                frame.src = src;
            }
        });
    }

    window.MigiProductVideo = { initialize: initialize, playerUrl: playerUrl };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { initialize(document); });
    } else {
        initialize(document);
    }
}());
