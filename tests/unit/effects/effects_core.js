(function($) {

var animateTime = 15;

module( "effects.core" );

$.each( $.effects.effect, function( effect ) {
	if ( effect === "transfer" ) {
		return;
	}
	QUnit.reset();
	module( "effect."+effect );
	test( "show/hide", function() {
		var hidden = $( "div.hidden" );
		expect( 3 );
		stop();
		hidden.show( effect, animateTime, function() {
			equal( hidden.css("display"), "block", "Hidden is shown after .show(\"" +effect+ "\", time)" );
		}).hide( effect, animateTime, function() {
			equal( hidden.css("display"), "none", "Back to hidden after .hide(\"" +effect+ "\", time)" );
		}).queue( function(next) {
			deepEqual( hidden.queue(), ["inprogress"], "Only the inprogress sentinel remains")
			start();
		});
	});
});

})(jQuery);
