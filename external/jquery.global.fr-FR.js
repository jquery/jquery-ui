(function($) {
    var cultures = $.global.cultures,
        en = cultures.en,
        standard = en.calendars.standard,
        culture = cultures["fr-FR"] = $.extend(true, {}, en, {
        name: "fr-FR",
        englishName: "French (France)",
        nativeName: "Français (France)",
        language: "fr",
        numberFormat: {
            ',': ".",
            '.': ",",
            percent: {
                pattern: ["-n%","n%"],
                ',': ".",
                '.': ","
            },
            currency: {
                pattern: ["-n $","n $"],
                ',': ".",
                '.': ",",
                symbol: "€"
            }
        },
        calendars: {
            standard: $.extend(true, {}, standard, {
                '/': ".",
                firstDay: 1,
                days: {
                    names: ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"],
                    namesAbbr: ["Lu","Ma","Me","Je","Ve","Sa","Di"],
                    namesShort: ["Lu","Ma","Me","Je","Ve","Sa","Di"]
                },
                months: {
                    names: ["Janvier","Février","Mars","Avril","Mai","Juin","Juiller","Août","Septembre","Octobre","Novembre","Decembre",""],
                    namesAbbr: ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Aoû","Sep","Oct","Nov","Dec",""]
                },
                AM: null,
                PM: null,
                eras: [{"name":"n. Chr.","start":null,"offset":0}],
                patterns: {
                    d: "dd.MM.yyyy",
                    D: "dddd, d. MMMM yyyy",
                    t: "HH:mm",
                    T: "HH:mm:ss",
                    f: "dddd, d. MMMM yyyy HH:mm",
                    F: "dddd, d. MMMM yyyy HH:mm:ss",
                    M: "dd MMMM",
                    Y: "MMMM yyyy"
                }
            })
        }
    }, cultures["fr-FR"]);
    culture.calendar = culture.calendars.standard;
})(jQuery);
