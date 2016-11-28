define( [
	"qunit",
	"jquery",
	"./helper",
	"ui/widgets/pinpad"
], function( QUnit, $, helper ) {

	QUnit.module( "pinpad: events" );

	QUnit.test( "open close", function( assert ) {
		var ready = assert.async();
		assert.expect( 4 );
		var element = $( "#pinpad1" ).pinpad( {
				open: function( event ) {
					assert.equal( event.type, "pinpadopen", "the pinpad is opened" );
					assert.ok( element.pinpad( "widget" ).is( ":visible" ), "the pinpad widget is visible" );
					element.pinpad( "output" ).simulate( "blur" );
				},
				close: function( event ) {
					assert.equal( event.type, "pinpadclose", "the pinpad is closed" );
					assert.ok( element.pinpad( "widget" ).is( ":hidden" ), "the pinpad widget is hidden" );
					ready();
				}
			} ),
			output = element.pinpad( "output" );
		output.simulate( "focus" );
	} );

	QUnit.test( "keypress change confirm", function( assert ) {
		var ready = assert.async();
		assert.expect( 7 );
		var element = $( "#pinpad1" ).pinpad( {
				keypress: function( event, ui ) {
					assert.ok( !$.isEmptyObject( ui ), "the ui parameter is not null and not empty" );
					assert.ok( ui.hasOwnProperty( "keyCode" ), "the keyCode property exist" );
				},
				change: function( event ) {
					assert.equal( event.type, "pinpadchange", "the pinpad input value has changed" );
				},
				confirm: function( event ) {
					assert.equal( event.type, "pinpadconfirm", "the pinpad input value has been confirmed" );
				}
			} ),
			output = element.pinpad( "output" ),
			widget = element.pinpad( "widget" );
		output.simulate( "focus" );

		function step1() {
			output.simulate( "keydown", { keyCode: $.ui.keyCode.NUMPAD_0 + helper.getRandomDigit() } );
			setTimeout( step2, 0 );
		}

		function step2() {
			widget.find( ".ui-pinpad-key-num-pad-" + helper.getRandomDigit() ).simulate( "click" );
			setTimeout( step3, 0 );
		}

		function step3() {
			output.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			setTimeout( ready, 0 );
		}

		setTimeout( step1, 0 );
	} );

	QUnit.test( "cancel: explicit", function( assert ) {
		var ready = assert.async();
		assert.expect( 2 );
		var element = $( "#pinpad1" ).pinpad( {
				cancel: function( event ) {
					assert.equal( event.type, "pinpadcancel", "the pinpad input value has been canceled" );
				}
			} ),
			output = element.pinpad( "output" );
		output.simulate( "focus" );

		function start() {
			var currentValue = element.pinpad( "value" );
			helper.insert( helper.getRandomNumber( 10000, 10000000000 ), element );
			assert.notEqual( element.pinpad( "value" ), currentValue, "the pinpad input value has changed" );
			output.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
			ready();
		}

		setTimeout( start, 0 );
	} );

	QUnit.test( "cancel: on blur", function( assert ) {
		var ready = assert.async();
		assert.expect( 2 );
		var element = $( "#pinpad1" ).pinpad( {
				cancel: function( event ) {
					assert.equal( event.type, "pinpadcancel", "the pinpad input value has been canceled" );
				}
			} ),
			output = element.pinpad( "output" );
		output.simulate( "focus" );

		function start() {
			var currentValue = element.pinpad( "value" );
			helper.insert( helper.getRandomNumber( 10000, 10000000000 ), element );
			assert.notEqual( element.pinpad( "value" ), currentValue, "the pinpad input value has changed" );
			output.simulate( "blur" );
			ready();
		}

		setTimeout( start, 0 );
	} );

} );
