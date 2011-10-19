// regional data
var regions = {
    "en": {
        "closeText": "Done",
        "prevText": "Prev",
        "nextText": "Next",
        "currentText": "Today",
        "weekHeader": "Wk",
        "dateFormat": "d",
        "datePickerRole": "date picker"
    },
    "af": {
        "closeText": "Selekteer",
        "prevText": "Vorige",
        "nextText": "Volgende",
        "currentText": "Vandag",
        "weekHeader": "Wk",
        "dateFormat": "d"
    },
    "zh-TW": {
        "closeText": "\u95dc\u9589",
        "prevText": "&#x3c;\u4e0a\u6708",
        "nextText": "\u4e0b\u6708&#x3e;",
        "currentText": "\u4eca\u5929",
        "weekHeader": "\u5468",
        "dateFormat": "d"
    },
    "ar": {
        "closeText": "\u0625\u063a\u0644\u0627\u0642",
        "prevText": "&#x3c;\u0627\u0644\u0633\u0627\u0628\u0642",
        "nextText": "\u0627\u0644\u062a\u0627\u0644\u064a&#x3e;",
        "currentText": "\u0627\u0644\u064a\u0648\u0645",
        "weekHeader": "\u0623\u0633\u0628\u0648\u0639",
        "dateFormat": "d"
    },
    "az": {
        "closeText": "Ba\u011fla",
        "prevText": "&#x3c;Geri",
        "nextText": "\u0130r\u0259li&#x3e;",
        "currentText": "Bug\u00fcn",
        "weekHeader": "Hf",
        "dateFormat": "d"
    },
    "bg": {
        "closeText": "\u0437\u0430\u0442\u0432\u043e\u0440\u0438",
        "prevText": "&#x3c;\u043d\u0430\u0437\u0430\u0434",
        "nextText": "\u043d\u0430\u043f\u0440\u0435\u0434&#x3e;",
        "currentText": "\u0434\u043d\u0435\u0441",
        "weekHeader": "Wk",
        "dateFormat": "d"
    },
    "bs": {
        "closeText": "Zatvori",
        "prevText": "&#x3c;",
        "nextText": "&#x3e;",
        "currentText": "Danas",
        "weekHeader": "Wk",
        "dateFormat": "d"
    },
    "ca": {
        "closeText": "Tancar",
        "prevText": "&#x3c;Ant",
        "nextText": "Seg&#x3e;",
        "currentText": "Avui",
        "weekHeader": "Sm",
        "dateFormat": "d"
    },
    "cs": {
        "closeText": "Zav\u0159\u00edt",
        "prevText": "&#x3c;D\u0159\u00edve",
        "nextText": "Pozd\u011bji&#x3e;",
        "currentText": "Nyn\u00ed",
        "weekHeader": "T\u00fdd",
        "dateFormat": "d"
    },
    "da": {
        "closeText": "Luk",
        "prevText": "&#x3c;Forrige",
        "nextText": "N\u00e6ste&#x3e;",
        "currentText": "Idag",
        "weekHeader": "Uge",
        "dateFormat": "d"
    },
    "de": {
        "closeText": "schlie\u00dfen",
        "prevText": "&#x3c;zur\u00fcck",
        "nextText": "Vor&#x3e;",
        "currentText": "heute",
        "weekHeader": "Wo",
        "dateFormat": "d"
    },
    "el": {
        "closeText": "\u039a\u03bb\u03b5\u03af\u03c3\u03b9\u03bc\u03bf",
        "prevText": "\u03a0\u03c1\u03bf\u03b7\u03b3\u03bf\u03cd\u03bc\u03b5\u03bd\u03bf\u03c2",
        "nextText": "\u0395\u03c0\u03cc\u03bc\u03b5\u03bd\u03bf\u03c2",
        "currentText": "\u03a4\u03c1\u03ad\u03c7\u03c9\u03bd \u039c\u03ae\u03bd\u03b1\u03c2",
        "weekHeader": "\u0395\u03b2\u03b4",
        "dateFormat": "d"
    },
    "en-GB": {
        "closeText": "Done",
        "prevText": "Prev",
        "nextText": "Next",
        "currentText": "Today",
        "weekHeader": "Wk",
        "dateFormat": "d"
    },
    "eo": {
        "closeText": "Fermi",
        "prevText": "&lt;Anta",
        "nextText": "Sekv&gt;",
        "currentText": "Nuna",
        "weekHeader": "Sb",
        "dateFormat": "dd/MM/yyyy"
    },
    "es": {
        "closeText": "Cerrar",
        "prevText": "&#x3c;Ant",
        "nextText": "Sig&#x3e;",
        "currentText": "Hoy",
        "weekHeader": "Sm",
        "dateFormat": "d"
    },
    "et": {
        "closeText": "Sulge",
        "prevText": "Eelnev",
        "nextText": "J\u00e4rgnev",
        "currentText": "T\u00e4na",
        "weekHeader": "Sm",
        "dateFormat": "d"
    },
    "eu": {
        "closeText": "Egina",
        "prevText": "&#x3c;Aur",
        "nextText": "Hur&#x3e;",
        "currentText": "Gaur",
        "weekHeader": "Wk",
        "dateFormat": "d"
    },
    "fa": {
        "closeText": "\u0628\u0633\u062a\u0646",
        "prevText": "&#x3c;\u0642\u0628\u0644\u064a",
        "nextText": "\u0628\u0639\u062f\u064a&#x3e;",
        "currentText": "\u0627\u0645\u0631\u0648\u0632",
        "weekHeader": "\u0647\u0641",
        "dateFormat": "d"
    },
    "fi": {
        "closeText": "Sulje",
        "prevText": "&laquo;Edellinen",
        "nextText": "Seuraava&raquo;",
        "currentText": "T&auml;n&auml;&auml;n",
        "weekHeader": "Vk",
        "dateFormat": "d"
    },
    "fo": {
        "closeText": "Lat aftur",
        "prevText": "&#x3c;Fyrra",
        "nextText": "N\u00e6sta&#x3e;",
        "currentText": "\u00cd dag",
        "weekHeader": "Vk",
        "dateFormat": "d"
    },
    "fr-CH": {
        "closeText": "Fermer",
        "prevText": "&#x3c;Pr\u00e9c",
        "nextText": "Suiv&#x3e;",
        "currentText": "Courant",
        "weekHeader": "Sm",
        "dateFormat": "d"
    },
    "fr": {
        "closeText": "Fermer",
        "prevText": "&#x3c;Pr\u00e9c",
        "nextText": "Suiv&#x3e;",
        "currentText": "Courant",
        "weekHeader": "Sm",
        "dateFormat": "d"
    },
    "he": {
        "closeText": "\u05e1\u05d2\u05d5\u05e8",
        "prevText": "&#x3c;\u05d4\u05e7\u05d5\u05d3\u05dd",
        "nextText": "\u05d4\u05d1\u05d0&#x3e;",
        "currentText": "\u05d4\u05d9\u05d5\u05dd",
        "weekHeader": "Wk",
        "dateFormat": "d"
    },
    "hr": {
        "closeText": "Zatvori",
        "prevText": "&#x3c;",
        "nextText": "&#x3e;",
        "currentText": "Danas",
        "weekHeader": "Tje",
        "dateFormat": "d"
    },
    "hu": {
        "closeText": "bez\u00c3\u00a1r\u00c3\u00a1s",
        "prevText": "&laquo;&nbsp;vissza",
        "nextText": "el\u00c5\u2018re&nbsp;&raquo;",
        "currentText": "ma",
        "weekHeader": "H\u00c3\u00a9",
        "dateFormat": "d"
    },
    "hy": {
        "closeText": "\u00d5\u201c\u00d5\u00a1\u00d5\u00af\u00d5\u00a5\u00d5\u00ac",
        "prevText": "&#x3c;\u00d5\u2020\u00d5\u00a1\u00d5\u00ad.",
        "nextText": "\u00d5\u20ac\u00d5\u00a1\u00d5\u00bb.&#x3e;",
        "currentText": "\u00d4\u00b1\u00d5\u00b5\u00d5\u00bd\u00d6\u2026\u00d6\u20ac",
        "weekHeader": "\u00d5\u2021\u00d4\u00b2\u00d5\u008f",
        "dateFormat": "d"
    },
    "id": {
        "closeText": "Tutup",
        "prevText": "&#x3c;mundur",
        "nextText": "maju&#x3e;",
        "currentText": "hari ini",
        "weekHeader": "Mg",
        "dateFormat": "d"
    },
    "is": {
        "closeText": "Loka",
        "prevText": "&#x3c; Fyrri",
        "nextText": "N&aelig;sti &#x3e;",
        "currentText": "&Iacute; dag",
        "weekHeader": "Vika",
        "dateFormat": "d"
    },
    "it": {
        "closeText": "Chiudi",
        "prevText": "&#x3c;Prec",
        "nextText": "Succ&#x3e;",
        "currentText": "Oggi",
        "weekHeader": "Sm",
        "dateFormat": "d"
    },
    "ja": {
        "closeText": "\u9589\u3058\u308b",
        "prevText": "&#x3c;\u524d",
        "nextText": "\u6b21&#x3e;",
        "currentText": "\u4eca\u65e5",
        "weekHeader": "\u9031",
        "dateFormat": "d"
    },
    "ko": {
        "closeText": "\u00eb\u2039\u00ab\u00ea\u00b8\u00b0",
        "prevText": "\u00ec\u009d\u00b4\u00ec\u00a0\u201e\u00eb\u2039\u00ac",
        "nextText": "\u00eb\u2039\u00a4\u00ec\u009d\u0152\u00eb\u2039\u00ac",
        "currentText": "\u00ec\u02dc\u00a4\u00eb\u0160\u02dc",
        "weekHeader": "Wk",
        "dateFormat": "d"
    },
    "lt": {
        "closeText": "U\u00c5\u00bedaryti",
        "prevText": "&#x3c;Atgal",
        "nextText": "Pirmyn&#x3e;",
        "currentText": "\u00c5\u00a0iandien",
        "weekHeader": "Wk",
        "dateFormat": "d"
    },
    "lv": {
        "closeText": "Aizv\u00c4\u201crt",
        "prevText": "Iepr",
        "nextText": "N\u00c4\u0081ka",
        "currentText": "\u00c5\u00a0odien",
        "weekHeader": "Nav",
        "dateFormat": "d"
    },
    "ms": {
        "closeText": "Tutup",
        "prevText": "&#x3c;Sebelum",
        "nextText": "Selepas&#x3e;",
        "currentText": "hari ini",
        "weekHeader": "Mg",
        "dateFormat": "d"
    },
    "nl": {
        "closeText": "Sluiten",
        "prevText": "\u2190",
        "nextText": "\u2192",
        "currentText": "Vandaag",
        "weekHeader": "Wk",
        "dateFormat": "d"
    },
    "no": {
        "closeText": "Lukk",
        "prevText": "&laquo;Forrige",
        "nextText": "Neste&raquo;",
        "currentText": "I dag",
        "weekHeader": "Uke",
        "dateFormat": "d"
    },
    "pl": {
        "closeText": "Zamknij",
        "prevText": "&#x3c;Poprzedni",
        "nextText": "Nast\u00c4\u2122pny&#x3e;",
        "currentText": "Dzi\u00c5\u203a",
        "weekHeader": "Tydz",
        "dateFormat": "d"
    },
    "pt-BR": {
        "closeText": "Fechar",
        "prevText": "&#x3c;Anterior",
        "nextText": "Pr&oacute;ximo&#x3e;",
        "currentText": "Hoje",
        "weekHeader": "Sm",
        "dateFormat": "d"
    },
    "ro": {
        "closeText": "\u00cenchide",
        "prevText": "&laquo; Luna precedent\u0103",
        "nextText": "Luna urm\u0103toare &raquo;",
        "currentText": "Azi",
        "weekHeader": "S\u0103pt",
        "dateFormat": "d"
    },
    "ru": {
        "closeText": "\u00d0\u2014\u00d0\u00b0\u00d0\u00ba\u00d1\u20ac\u00d1\u2039\u00d1\u201a\u00d1\u0152",
        "prevText": "&#x3c;\u00d0\u0178\u00d1\u20ac\u00d0\u00b5\u00d0\u00b4",
        "nextText": "\u00d0\u00a1\u00d0\u00bb\u00d0\u00b5\u00d0\u00b4&#x3e;",
        "currentText": "\u00d0\u00a1\u00d0\u00b5\u00d0\u00b3\u00d0\u00be\u00d0\u00b4\u00d0\u00bd\u00d1\u008f",
        "weekHeader": "\u00d0\u009d\u00d0\u00b5",
        "dateFormat": "d"
    },
    "sk": {
        "closeText": "Zavrie\u00c5\u00a5",
        "prevText": "&#x3c;Predch\u00c3\u00a1dzaj\u00c3\u00baci",
        "nextText": "Nasleduj\u00c3\u00baci&#x3e;",
        "currentText": "Dnes",
        "weekHeader": "Ty",
        "dateFormat": "d"
    },
    "sl": {
        "closeText": "Zapri",
        "prevText": "&lt;Prej&#x161;nji",
        "nextText": "Naslednji&gt;",
        "currentText": "Trenutni",
        "weekHeader": "Teden",
        "dateFormat": "d"
    },
    "sq": {
        "closeText": "mbylle",
        "prevText": "&#x3c;mbrapa",
        "nextText": "P\u00ebrpara&#x3e;",
        "currentText": "sot",
        "weekHeader": "Ja",
        "dateFormat": "d"
    },
    "sr-SR": {
        "closeText": "Zatvori",
        "prevText": "&#x3c;",
        "nextText": "&#x3e;",
        "currentText": "Danas",
        "weekHeader": "Sed",
        "dateFormat": "dd/MM/yyyy"
    },
    "sr": {
        "closeText": "\u0417\u0430\u0442\u0432\u043e\u0440\u0438",
        "prevText": "&#x3c;",
        "nextText": "&#x3e;",
        "currentText": "\u0414\u0430\u043d\u0430\u0441",
        "weekHeader": "\u0421\u0435\u0434",
        "dateFormat": "d"
    },
    "sv": {
        "closeText": "St\u00e4ng",
        "prevText": "&laquo;F\u00f6rra",
        "nextText": "N\u00e4sta&raquo;",
        "currentText": "Idag",
        "weekHeader": "Ve",
        "dateFormat": "d"
    },
    "ta": {
        "closeText": "\u0bae\u0bc2\u0b9f\u0bc1",
        "prevText": "\u0bae\u0bc1\u0ba9\u0bcd\u0ba9\u0bc8\u0baf\u0ba4\u0bc1",
        "nextText": "\u0b85\u0b9f\u0bc1\u0ba4\u0bcd\u0ba4\u0ba4\u0bc1",
        "currentText": "\u0b87\u0ba9\u0bcd\u0bb1\u0bc1",
        "weekHeader": "\u041d\u0435",
        "dateFormat": "d"
    },
    "th": {
        "closeText": "\u0e1b\u0e34\u0e14",
        "prevText": "&laquo;&nbsp;\u0e22\u0e49\u0e2d\u0e19",
        "nextText": "\u0e16\u0e31\u0e14\u0e44\u0e1b&nbsp;&raquo;",
        "currentText": "\u0e27\u0e31\u0e19\u0e19\u0e35\u0e49",
        "weekHeader": "Wk",
        "dateFormat": "d"
    },
    "tr": {
        "closeText": "kapat",
        "prevText": "&#x3c;geri",
        "nextText": "ileri&#x3e",
        "currentText": "bug\u00c3\u00bcn",
        "weekHeader": "Hf",
        "dateFormat": "d"
    },
    "uk": {
        "closeText": "\u00d0\u2014\u00d0\u00b0\u00d0\u00ba\u00d1\u20ac\u00d0\u00b8\u00d1\u201a\u00d0\u00b8",
        "prevText": "&#x3c;",
        "nextText": "&#x3e;",
        "currentText": "\u00d0\u00a1\u00d1\u0152\u00d0\u00be\u00d0\u00b3\u00d0\u00be\u00d0\u00b4\u00d0\u00bd\u00d1\u2013",
        "weekHeader": "\u00d0\u009d\u00d0\u00b5",
        "dateFormat": "d"
    },
    "vi": {
        "closeText": "\u0110\u00f3ng",
        "prevText": "&#x3c;Tr\u01b0\u1edbc",
        "nextText": "Ti\u1ebfp&#x3e;",
        "currentText": "H\u00f4m nay",
        "weekHeader": "Tu",
        "dateFormat": "d"
    },
    "zh-CN": {
        "closeText": "\u00e5\u2026\u00b3\u00e9\u2014\u00ad",
        "prevText": "&#x3c;\u00e4\u00b8\u0160\u00e6\u0153\u02c6",
        "nextText": "\u00e4\u00b8\u2039\u00e6\u0153\u02c6&#x3e;",
        "currentText": "\u00e4\u00bb\u0160\u00e5\u00a4\u00a9",
        "weekHeader": "\u00e5\u2018\u00a8",
        "dateFormat": "d"
    },
    "zh-HK": {
        "closeText": "\u00e9\u2014\u0153\u00e9\u2013\u2030",
        "prevText": "&#x3c;\u00e4\u00b8\u0160\u00e6\u0153\u02c6",
        "nextText": "\u00e4\u00b8\u2039\u00e6\u0153\u02c6&#x3e;",
        "currentText": "\u00e4\u00bb\u0160\u00e5\u00a4\u00a9",
        "weekHeader": "\u00e5\u2018\u00a8",
        "dateFormat": "d"
    }
};
$.each( regions, function( name, value ) {
	var culture = Globalize.findClosestCulture( name );
	Globalize.addCultureInfo( culture && culture.name || name, {
		messages : {
			datepicker : value
		}
	});
});
