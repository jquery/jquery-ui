/*
 * Myanmar/UNICODE initialisation for the jQuery UI date picker plugin.
 * Author: Thiha Thit | github/thihathit
*/
( function( factory ) {
  if ( typeof define === "function" && define.amd ) {

    // AMD. Register as an anonymous module.
    define( [ "../widgets/datepicker" ], factory );
  } else {

    // Browser globals
    factory( jQuery.datepicker );
  }
}( function( datepicker ) {

datepicker.regional[ "mm-UNI" ] = {
  closeText: "ပိတ်ပါ",
  prevText: "ရှေ့သို့",
  nextText: "နောက်သို့",
  currentText: "ယနေ့",
  monthNames: [
    "ဇန်နဝါရီလ",
    "ဖေဖော်ဝါရီလ",
    "မတ်လ",
    "ဧပြီလ",
    "မေလ",
    "ဇွန်လ",
    "ဇူလိုင်လ",
    "ဩဂုတ်လ",
    "စက်တင်ဘာလ",
    "အောက်တိုဘာလ",
    "နိုဝင်ဘာ",
    "ဒီဇင်ဘာလ"
  ],
  monthNamesShort: [
    "ဇန်နဝါရီ",
    "ဖေဖော်ဝါရီ",
    "မတ်",
    "ဧပြီ",
    "မေ",
    "ဇွန်",
    "ဇူလိုင်",
    "ဩဂုတ်",
    "စက်တင်ဘာ",
    "အောက်တိုဘာ",
    "နိုဝင်ဘ",
    "ဒီဇင်ဘာ"
  ],
  dayNames: [
    "တနင်္ဂနွေနေ့",
    "တနင်္လာနေ့",
    "အင်္ဂါနေ့",
    "ဗုဒ္ဓဟူးနေ့",
    "ကြာသာပတေးနေ့",
    "သောကြာနေ့",
    "စနေနေ့"
  ],
  dayNamesShort: [
    "တနင်္ဂနွေ",
    "တနင်္လာ",
    "အင်္ဂါ",
    "ဗုဒ္ဓဟူး",
    "ကြာသာပတေး",
    "သောကြာ",
    "စနေ"
  ],
  dayNamesMin: [
    "တနင်္ဂနွေ",
    "တနင်္လာ",
    "အင်္ဂါ",
    "ဗုဒ္ဓဟူး",
    "ကြာသာပတေး",
    "သောကြာ",
    "စနေ"
  ],
  weekHeader: "အပတ်",
  dateFormat: "နေ့/လ/နှစ်",
  firstDay: 2,
  isRTL: false,
  showMonthAfterYear: false,
  yearSuffix: "" };
datepicker.setDefaults( datepicker.regional[ "mm-UNI" ] );

return datepicker.regional[ "mm-UNI" ];

} ) );
