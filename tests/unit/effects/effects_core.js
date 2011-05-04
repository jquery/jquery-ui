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
		expect( 8 );
		stop();

		var count = 0,
			test = 0;

		function queueTest( fn ) {
			count++;
			var point = count;
			return function( next ) {
				test++;
				equals( point, test, "Queue function fired in order" );
				if ( fn ) {
					fn ()
				} else {
					setTimeout( next, animateTime );
				}
			}
		}
		
		hidden.queue( queueTest() ).show( effect, animateTime, queueTest(function() {
			equal( hidden.css("display"), "block", "Hidden is shown after .show(\"" +effect+ "\", time)" );
		})).queue( queueTest() ).hide( effect, animateTime, queueTest(function() {
			equal( hidden.css("display"), "none", "Back to hidden after .hide(\"" +effect+ "\", time)" );
		})).queue( queueTest(function(next) {
			deepEqual( hidden.queue(), ["inprogress"], "Only the inprogress sentinel remains")
			start();
		}));
	});
});

})(jQuery);
