(function($) {

function present( value, array, message ) {
	QUnit.push( jQuery.inArray( value, array ) !== -1 , value, array, message );
}

function notPresent( value, array, message ) {
	QUnit.push( jQuery.inArray( value, array ) === -1 , value, array, message );
}

// minDuration is used for "short" animate tests where we are only concerned about the final
var minDuration = 15,

	// duration is used for "long" animates where we plan on testing properties during animation
	duration = 200,

	// mid is used for testing in the "middle" of the "duration" animations
	mid = duration / 2;

module( "effects.core" );

$.each( $.effects.effect, function( effect ) {
	if ( effect === "transfer" ) {
		return;
	}
	module( "effect."+effect );
	asyncTest( "show/hide", function() {
		var hidden = $( "div.hidden" );
		expect( 8 );

		var count = 0,
			test = 0;

		function queueTest( fn ) {
			count++;
			var point = count;
			return function( next ) {
				test++;
				equal( point, test, "Queue function fired in order" );
				if ( fn ) {
					fn();
				} else {
					setTimeout( next, minDuration );
				}
			};
		}

		hidden.queue( queueTest() ).show( effect, minDuration, queueTest(function() {
			equal( hidden.css("display"), "block", "Hidden is shown after .show(\"" +effect+ "\", time)" );
		})).queue( queueTest() ).hide( effect, minDuration, queueTest(function() {
			equal( hidden.css("display"), "none", "Back to hidden after .hide(\"" +effect+ "\", time)" );
		})).queue( queueTest(function(next) {
			deepEqual( hidden.queue(), ["inprogress"], "Only the inprogress sentinel remains");
			start();
		}));
	});
});

module("animateClass");

asyncTest( "animateClass works with borderStyle", function() {
	var test = $("div.animateClass"),
		count = 0;
	expect(3);
	test.toggleClass("testAddBorder", minDuration, function() {
		test.toggleClass("testAddBorder", minDuration, function() {
			equal( test.css("borderLeftStyle"), "none", "None border set" );
			start();
		});
		equal( test.css("borderLeftStyle"), "solid", "None border not immedately set" );
	});
	equal( test.css("borderLeftStyle"), "solid", "Solid border immedately set" );
});

asyncTest( "animateClass works with colors", function() {
	var test = $("div.animateClass"),
		count = 0;
	expect(2);
	test.toggleClass("testChangeBackground", duration, function() {
		present( test.css("backgroundColor"), [ "#ffffff", "#fff", "rgb(255, 255, 255)" ], "Color is final" );
		start();
	});
	setTimeout(function() {
		var color = test.css("backgroundColor");
		notPresent( color, [ "#000000", "#ffffff", "#000", "#fff", "rgb(0, 0, 0)", "rgb(255,255,255)" ],
			"Color is not endpoints in middle." );
	}, mid);
});

asyncTest( "animateClass works with children", function() {
	var test = $("div.animateClass"),
		h2 = test.find("h2");

	expect(4);
	setTimeout(function() {
		notPresent( h2.css("fontSize"), ["10px","20px"], "Font size is neither endpoint when in middle.");
	}, mid);
	test.toggleClass("testChildren", { children: true, duration: duration, complete: function() {
		equal( h2.css("fontSize"), "20px", "Text size is final during complete");
		test.toggleClass("testChildren", duration, function() {
			equal( h2.css("fontSize"), "10px", "Text size revertted after class removed");

			start();
		});
		setTimeout(function() {
			equal( h2.css("fontSize"), "20px", "Text size unchanged during animate with children: undefined" );
		}, mid);
	}});
});

})(jQuery);
