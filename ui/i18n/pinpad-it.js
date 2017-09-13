/* French initialisation for the jQuery UI pinpad plugin. */
/* Written by Yannick Ebongue <yannick.ebongue@yahoo.fr> */
( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "../widgets/pinpad" ], factory );
	} else {

		// Browser globals
		factory( jQuery.ui.pinpad );
	}
}( function( pinpad ) {

	pinpad.regional.it = {
		display: {
			decPoint: ",",
			cancel: "Annulla",
			correct: "Cancella",
			confirm: "Conferma"
		}
	};

	return pinpad.regional.it;

} ) );
