/* English/CA initialisation for the jQuery UI date picker plugin. */
/* Written by Eric Maniez. */
(function( factory ) {
  if ( typeof define === "function" && define.amd ) {

    // AMD. Register as an anonymous module.
    define([ "../datepicker" ], factory );
  } else {

    // Browser globals
    factory( jQuery.datepicker );
  }
}(function( datepicker ) {

  datepicker.regional['en-CA'] = {
    closeText: 'Done',
    prevText: 'Prev',
    nextText: 'Next',
    currentText: 'Today',
    monthNames: ['January','February','March','April','May','June',
                 'July','August','September','October','November','December'],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dayNamesMin: ['Su','Mo','Tu','We','Th','Fr','Sa'],
    weekHeader: 'Wk',
    dateFormat: 'yy-mm-dd',
    firstDay: 0,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ''};
  datepicker.setDefaults(datepicker.regional['en-CA']);

  return datepicker.regional['en-CA'];

}));
