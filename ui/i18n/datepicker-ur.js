/* Abdullah initialisation for the jQuery UI date picker plugin. */
/* For Pakistani Users Only */
/* Written by Abdullah <abdullahmzm@gmail.com> */
/* Twitter Handle @Software_abi */
(function (factory) {
    if (typeof define === "function" && define.amd) {

        // AMD. Register as an anonymous module.
        define(["../widgets/datepicker"], factory);
    } else {

        // Browser globals
        factory(jQuery.datepicker);
    }
}(function (datepicker) {

    datepicker.regional.ur = {
        closeText: "بند کریں",
        prevText: "&#x3C;پچھلا",
        nextText: "اگلا&#x3E;",
        currentText: "آج",
        monthNames: ["جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون",
            "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر"],
        monthNamesShort: ["1", "2", "3", "4", "5", "6",
            "7", "8", "9", "10", "11", "12"],
        dayNames: [
            "اتوار",
            "سوموار",
            "منگل",
            "بدھ",
            "جمعرات",
            "جمعہ",
            "ہفتہ"
        ],
        dayNamesShort: ["اتوار", "سوموار", "منگل", "بدھ", "جمعرات", "جمعہ", "ہفتہ"],
        dayNamesMin: ["اتوار", "سوموار", "منگل", "بدھ", "جمعرات", "جمعہ", "ہفتہ"],
        weekHeader: "ایک ہفتہ",
        dateFormat: "dd/mm/yy",
        firstDay: 0,
        isRTL: true,
        showMonthAfterYear: false,
        yearSuffix: ""};
    datepicker.setDefaults(datepicker.regional.ur);

    return datepicker.regional.ur;

}));
