(function( $ ) {

module( "spinner: events" );

test( "start", function() {
	expect( 1 );
	var element = $( "#spin" ).spinner({
		start: function() {
			ok( true, "start" );
		}
	});

	spinner_simulateKeyDownUp( element, $.ui.keyCode.UP );
});

test( "spin", function() {
	expect( 1 );
	var element = $( "#spin" ).spinner({
		spin: function(){
			ok( true, "spin" );
		}
	});

	spinner_simulateKeyDownUp( element, $.ui.keyCode.UP );
});

test( "stop", function() {
	expect( 1 );
	var element = $( "#spin" ).spinner({
		stop: function(){
			ok( true, "stop" );
		}
	});

	spinner_simulateKeyDownUp( element, $.ui.keyCode.DOWN );
});

test( "change", function() {
	expect( 1 );
	var element = $( "#spin" ).spinner({
		change: function(){
			ok( true, "change" );
		}
	});

	spinner_simulateKeyDownUp( element, $.ui.keyCode.UP );
	element.blur();
});

})( jQuery );
