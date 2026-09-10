/* Rueckruf-Formular: absenden ohne Seitenwechsel, danach auf die Danke-Seite.
   Ohne JavaScript sendet das Formular normal ab; die Weiterleitung uebernimmt
   dann das Feld _next. */
(function () {
    var FEHLERTEXT =
        'Das Formular konnte gerade nicht gesendet werden. Bitte rufen Sie mich ' +
        'einfach an: <a href="tel:+491633938181">0163 3938181</a> &ndash; oder ' +
        'schreiben Sie an <a href="mailto:trance.form@email.de">trance.form@email.de</a>.';

    function zeigeFehler(form) {
        var box = form.querySelector('.rueckruf-fehler');
        if (!box) {
            box = document.createElement('p');
            box.className = 'rueckruf-fehler';
            box.setAttribute('role', 'alert');
            form.appendChild(box);
        }
        box.innerHTML = FEHLERTEXT;
    }

    function sende(form, btn, urspruenglich) {
        fetch(form.action, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(new FormData(form)).toString()
        })
            .then(function (antwort) {
                if (!antwort.ok) throw new Error('HTTP ' + antwort.status);
                var ziel = form.querySelector('input[name="_next"]');
                location.assign(ziel ? ziel.value : '/danke-vorgespraech.html');
            })
            .catch(function () {
                btn.disabled = false;
                btn.textContent = urspruenglich;
                zeigeFehler(form);
            });
    }

    function start() {
        var formulare = document.querySelectorAll('.rueckruf-form');
        Array.prototype.forEach.call(formulare, function (form) {
            form.addEventListener('submit', function (e) {
                if (!form.checkValidity()) return;   /* Browser meldet selbst */
                e.preventDefault();
                var btn = form.querySelector('.rueckruf-btn');
                var urspruenglich = btn.textContent;
                btn.disabled = true;
                btn.textContent = 'Wird gesendet …';
                sende(form, btn, urspruenglich);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
