/* Xhosa/ZA initialisation for the jQuery UI date picker plugin. */
/* Written by Dwayne Bailey. dwayne@translate.org.za */
/* Submitted by Stewart Mbofana. http://www.stewartmbofana.co.za for IMQS http://www.imqs.co.za */
( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "../widgets/datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
}( function( datepicker ) {

datepicker.regional[ "xh-ZA" ] = {
	closeText: "Yenziwe",
	prevText: "Emuva",
	nextText: "Phambili",
	currentText: "Namhlanje",
	monthNames: [ "eyoMqungu","eyoMdumba","eyoKwindla","uTshazimpuzi","uCanzibe","eyeSilimela",
	"eyeKhala","eyeThupa","eyoMsintsi","eyeDwarha","eyeNkanga","eyoMnga" ],
	monthNamesShort: [ "Mqu", "Mdu", "Kwi", "Tsh", "Can", "Sil",
	"Kha", "Thu", "Msi", "Dwa", "Nka", "Mng" ],
	dayNames: [ "iCawa", "uMvulo", "lwesiBini", "lwesiThathu", "ulweSine", "lwesiHlanu", "uMgqibelo" ],
	dayNamesShort: [ "Caw", "Mvu", "Bin", "Tha", "Sin", "Hla", "Mgq" ],
	dayNamesMin: [ "Ca","Mv","Bi","Th","Si","Hl","Mg" ],
	weekHeader: "Wk",
	dateFormat: "dd/mm/yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional[ "xh-ZA" ] );

return datepicker.regional[ "xh-ZA" ];

} ) );
