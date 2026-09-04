/* Cookie-Einwilligung: Google Analytics lädt erst nach ausdrücklicher Zustimmung. */
(function () {
    var GA_ID = 'G-S6LJW6H8JC';
    var KEY = 'tf-consent';

    function ladeAnalytics() {
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(s);

        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', GA_ID);
    }

    function entscheide(wert) {
        try { localStorage.setItem(KEY, wert); } catch (e) {}
        var banner = document.getElementById('tf-consent');
        if (banner) banner.parentNode.removeChild(banner);
        if (wert === 'granted') ladeAnalytics();
    }

    function zeigeBanner() {
        var style = document.createElement('style');
        style.textContent =
            '#tf-consent{position:fixed;left:0;right:0;bottom:0;z-index:9999;' +
            'display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:1rem;' +
            'padding:1rem 1.25rem;background:#fff;border-top:2px solid #2C4A6E;' +
            'box-shadow:0 -2px 8px rgba(0,0,0,.12);' +
            'font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:1rem;' +
            'line-height:1.5;color:#2C4A6E}' +
            '#tf-consent p{margin:0;max-width:44rem;font-size:1rem}' +
            '#tf-consent a{color:#3B5D8C}' +
            '#tf-consent div{display:flex;gap:.75rem;flex-shrink:0}' +
            '#tf-consent button{font:inherit;cursor:pointer;padding:.55rem 1.4rem;' +
            'border-radius:4px;border:2px solid #2C4A6E;white-space:nowrap}' +
            '#tf-consent .tf-ja{background:#2C4A6E;color:#fff}' +
            '#tf-consent .tf-ja:hover{background:#3B5D8C;border-color:#3B5D8C}' +
            '#tf-consent .tf-nein{background:#fff;color:#2C4A6E}' +
            '#tf-consent .tf-nein:hover{background:#f0f3f7}' +
            '@media (max-width:700px){#tf-consent{font-size:.95rem}' +
            '#tf-consent div{width:100%}#tf-consent button{flex:1}}';
        document.head.appendChild(style);

        var banner = document.createElement('div');
        banner.id = 'tf-consent';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Hinweis zum Datenschutz');
        banner.innerHTML =
            '<p>Diese Website nutzt Google Analytics, um anonym auszuwerten, welche Seiten ' +
            'besucht werden. Das geschieht nur mit Ihrer Einwilligung. Mehr dazu in der ' +
            '<a href="/datenschutz.html">Datenschutzerklärung</a>.</p>' +
            '<div><button type="button" class="tf-nein">Ablehnen</button>' +
            '<button type="button" class="tf-ja">Akzeptieren</button></div>';
        banner.querySelector('.tf-ja').addEventListener('click', function () { entscheide('granted'); });
        banner.querySelector('.tf-nein').addEventListener('click', function () { entscheide('denied'); });
        document.body.appendChild(banner);
    }

    /* Widerruf-Schaltfläche auf der Datenschutzseite */
    function verknuepfeWiderruf() {
        var btn = document.getElementById('tf-consent-widerruf');
        if (!btn) return;
        btn.addEventListener('click', function () {
            try { localStorage.removeItem(KEY); } catch (e) {}
            location.reload();
        });
    }


    /* Kontaktwege als Ereignisse melden - nur wenn eingewilligt wurde */
    function verfolgeKontaktklicks() {
        document.addEventListener('click', function (e) {
            if (typeof window.gtag !== 'function') return;
            var a = e.target && e.target.closest ? e.target.closest('a') : null;
            if (!a) return;
            var ziel = a.getAttribute('href') || '';
            var ereignis =
                ziel.indexOf('doctolib.de') > -1 ? 'termin_klick' :
                ziel.indexOf('mailto:') === 0   ? 'email_klick' :
                ziel.indexOf('tel:') === 0      ? 'telefon_klick' : null;
            if (!ereignis) return;
            window.gtag('event', ereignis, { seite: location.pathname });
        });
    }

    function start() {
        verknuepfeWiderruf();
        verfolgeKontaktklicks();
        var gespeichert = null;
        try { gespeichert = localStorage.getItem(KEY); } catch (e) {}
        if (gespeichert === 'granted') { ladeAnalytics(); return; }
        if (gespeichert === 'denied') { return; }
        zeigeBanner();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
