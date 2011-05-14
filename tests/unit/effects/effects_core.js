(function($) {

function present( value, array, message ) {
	QUnit.push( jQuery.inArray( value, array ) !== -1 , value, array, message );
}

function notPresent( value, array, message ) {
	QUnit.push( jQuery.inArray( value, array ) === -1 , value, array, message );
}

var animateTime = 15;

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
					fn ();
				} else {
					setTimeout( next, animateTime );
				}
			};
		}
		
		hidden.queue( queueTest() ).show( effect, animateTime, queueTest(function() {
			equal( hidden.css("display"), "block", "Hidden is shown after .show(\"" +effect+ "\", time)" );
		})).queue( queueTest() ).hide( effect, animateTime, queueTest(function() {
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
	test.toggleClass("testAddBorder", 20, function() {
		test.toggleClass("testAddBorder", 20, function() {
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
	test.toggleClass("testChangeBackground", 100, function() {
		present( test.css("backgroundColor"), [ "#ffffff", "rgb(255, 255, 255)" ], "Color is final" );
		start();
	});
	setTimeout(function() {
		var color = test.css("backgroundColor");
		notPresent( color, [ "#000000", "#ffffff", "rgb(0, 0, 0)", "rgb(255,255,255)" ],
			"Color is not endpoints in middle." );
	}, 50);
});

asyncTest( "animateClass works with children", function() {
	var test = $("div.animateClass"),
		h2 = test.find("h2");
	
	expect(4);
	test.toggleClass("testChildren", { children: true, duration: 100, complete: function() {
		equal( h2.css("fontSize"), "20px", "Text size is final during complete");
		test.toggleClass("testChildren", 100, function() {
			equal( h2.css("fontSize"), "10px", "Text size revertted after class removed");
			start();
		});
		setTimeout(function() {
			equal( h2.css("fontSize"), "20px", "Text size unchanged with children: undefined" );
		}, 50);
	}});
	setTimeout(function() {
		notPresent( h2.css("fontSize"), ["10px","20px"], "Font size is neither endpoint when in middle.");
	}, 50);
});

})(jQuery);
