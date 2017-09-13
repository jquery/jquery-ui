define( [
	"qunit",
	"jquery",
	"./helper",
	"ui/widgets/pinpad"
], function( QUnit, $, helper ) {

	QUnit.module( "pinpad: options" );

	QUnit.test( "appendTo: null", function( assert ) {
		assert.expect( 1 );
		var element = $( "#pinpad1" ).pinpad(),
			widget = element.pinpad( "widget" );
		assert.equal( $( document.body ).children( ":last" )[ 0 ], widget[ 0 ], "append pinpad widget to document body" );
	} );

	QUnit.test( "appendTo: explicit", function( assert ) {
		assert.expect( 3 );
		var container = $( "#container" ),
			element = $( "#pinpad3" );

		element.pinpad( {
			appendTo: "#container"
		} );
		assert.equal( element.pinpad( "widget" ).parent()[ 0 ], container[ 0 ], "selector" );
		element.pinpad( "destroy" );

		element.pinpad( {
			appendTo: container
		} );
		assert.equal( element.pinpad( "widget" ).parent()[ 0 ], container[ 0 ], "jQuery object" );
		element.pinpad( "destroy" );

		element.pinpad( {
			appendTo: container[ 0 ]
		} );
		assert.equal( element.pinpad( "widget" ).parent()[ 0 ], container[ 0 ], "DOM element" );
		element.pinpad( "destroy" );
	} );

	QUnit.test( "autoComplete: true", function( assert ) {
		var ready = assert.async();
		assert.expect( 1 );
		var element = $( "#pinpad2" ).pinpad( {
				autoComplete: true,

				confirm: function() {
					assert.equal( element.val().length, element.pinpad( "option", "maxLength" ), "confirm pinpad input value since the maximum length is reached" );
				},

				open: function() {
					setTimeout( start, 0 );
				},

				close: function() {
					setTimeout( ready, 0 );
				}
			} ),
			output = element.pinpad( "output" );

		function start() {
			var i,
				maxLength = element.prop( "maxLength" );

			for ( i = 0; i < maxLength; i++ ) {
				output.simulate( "keydown", { keyCode: $.ui.keyCode.NUMPAD_0 + helper.getRandomDigit() } );
			}
		}

		output.simulate( "focus" );
	} );

	QUnit.test( "clear: false", function( assert ) {
		var ready = assert.async();
		assert.expect( 2 );
		var element = $( "#pinpad1" ).pinpad( {
				clear: false,

				open: function() {
					setTimeout( start, 0 );
				},

				close: function() {
					setTimeout( ready, 0 );
				}
			} ),
			output = element.pinpad( "output" );

		function start() {
			var currentLength;

			helper.insert( helper.getRandomNumber( 10000, 10000000000 ), element );

			currentLength = element.pinpad( "value" ).length;
			element.pinpad( "widget" ).find( ".ui-pinpad-command-correct" ).simulate( "click" );
			assert.equal( element.pinpad( "value" ).length, currentLength - 1, "Delete the last digit using the `correct` command" );

			currentLength = element.pinpad( "value" ).length;
			output.simulate( "keydown", { keyCode: $.ui.keyCode.BACKSPACE } );
			assert.equal( element.pinpad( "value" ).length, currentLength - 1, "Delete the last digit using the keyboard `Backspace` key" );

			output.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
		}

		output.simulate( "focus" );
	} );

	QUnit.test( "clear: true", function( assert ) {
		var ready = assert.async();
		assert.expect( 2 );
		var element = $( "#pinpad1" ).pinpad( {
				clear: true,

				open: function() {
					setTimeout( start, 0 );
				},

				close: function() {
					setTimeout( ready, 0 );
				}
			} ),
			output = element.pinpad( "output" );

		function start() {
			helper.insert( helper.getRandomNumber( 10000, 10000000000 ), element );

			element.pinpad( "widget" ).find( ".ui-pinpad-command-correct" ).simulate( "click" );
			assert.equal( element.pinpad( "value" ).length, 0, "Clear the pinpad input using the `correct` command" );

			helper.insert( helper.getRandomNumber( 10000, 10000000000 ), element );

			output.simulate( "keydown", { keyCode: $.ui.keyCode.DELETE } );
			assert.equal( element.pinpad( "value" ).length, 0, "Clear the pinpad input using the keyboard `Delete` key" );

			output.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
		}

		output.simulate( "focus" );
	} );

	QUnit.test( "disabled", function( assert ) {
		assert.expect( 4 );
		var element = $( "#pinpad1" ).pinpad(),
			output = element.pinpad( "output" );

		element.pinpad( "option", "disabled", true );
		assert.ok( element.is( ":disabled" ), "the pinpad input is disabled" );
		assert.ok( output.is( ":disabled" ), "the pinpad output is disabled" );

		element.pinpad( "option", "disabled", false );
		assert.ok( element.is( ":enabled" ), "the pinpad input is enabled" );
		assert.ok( output.is( ":enabled" ), "the pinpad output is enabled" );
	} );

	QUnit.test( "disabled inline", function( assert ) {
		assert.expect( 11 );
		var element = $( "#pinpad3" ).pinpad(),
			output = element.pinpad( "output" ),
			widget = element.pinpad( "widget" );

		element.pinpad( "option", "disabled", true );
		assert.ok( element.is( ":disabled" ), "the pinpad input is disabled" );
		assert.ok( output.is( ":disabled" ), "the pinpad output is disabled" );
		assert.hasClasses( widget, "ui-pinpad-disabled", "the pinpad widget is marked as disabled" );
		assert.equal( widget.find( ".ui-pinpad-key" ).filter( ":enabled" ).length, 0, "no pinpad key button is enabled" );
		assert.equal( widget.find( ".ui-pinpad-command" ).filter( ":enabled" ).length, 0, "no pinpad command button is enabled" );

		element.pinpad( "option", "disabled", false );
		assert.ok( element.is( ":enabled" ), "the pinpad input is enabled" );
		assert.ok( output.is( ":enabled" ), "the pinpad output is enabled" );
		assert.lacksClasses( widget, "ui-state-disabled", "the pinpad widget is not marked as disabled" );
		assert.equal( widget.find( ".ui-pinpad-key" ).filter( ":enabled" ).length, 12, "all pinpad key buttons are enabled" );
		assert.ok( widget.find( ".ui-pinpad-command-cancel" ).is( ":enabled" ), "the pinpad cancel command button is enabled" );
		assert.ok( widget.find( ".ui-pinpad-command-correct" ).is( ":enabled" ), "the pinpad correct command button is enabled" );
	} );

	QUnit.test( "digitOnly", function( assert ) {
		var ready = assert.async();
		assert.expect( 1 );
		var element = $( "#pinpad1" ).pinpad( {
				digitOnly: true,

				open: function() {
					setTimeout( step1, 0 );
				},

				close: function() {
					setTimeout( ready, 0 );
				}
			} ),
			output = element.pinpad( "output" );

		function step1() {
			var i,
				maxLength = helper.getRandomNumber( 5, 12 );
			for ( i = 0; i < maxLength; i++ ) {
				output.simulate( "keydown", { keyCode: $.ui.keyCode.NUMPAD_0 + helper.getRandomDigit() } );
			}
			setTimeout( step2, 0 );
		}

		function step2() {
			output.simulate( "keydown", { keyCode: $.ui.keyCode.DECIMAL_POINT } );
			assert.equal( element.pinpad( "value" ).indexOf( "." ), -1, "the pinpad input does not accept the decimal point" );
			setTimeout( step3, 0 );
		}

		function step3() {
			output.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
		}

		output.simulate( "focus" );
	} );

	QUnit.test( "minLength", function( assert ) {
		var ready = assert.async();
		assert.expect( 2 );
		var element = $( "#pinpad1" ).pinpad( {
				minLength: 1,

				open: function() {
					setTimeout( start, 0 );
				},

				close: function() {
					setTimeout( ready, 0 );
				}
			} ),
			output = element.pinpad( "output" ),
			widget = element.pinpad( "widget" );

		function start() {
			assert.ok( widget.find( ".ui-pinpad-command-confirm" ).button( "option", "disabled" ), "the pinpad confirm command must be disabled" );

			output.simulate( "keydown", { keyCode: $.ui.keyCode.NUMPAD_0 + helper.getRandomDigit() } );
			assert.ok( !widget.find( ".ui-pinpad-command-confirm" ).button( "option", "disabled" ), "the pinpad confirm command must be enabled" );

			output.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
		}

		output.simulate( "focus" );
	} );

	QUnit.test( "maxLength", function( assert ) {
		var ready = assert.async();
		assert.expect( 1 );
		var element = $( "#pinpad1" ).pinpad( {
				open: function() {
					setTimeout( step1, 0 );
				},

				close: function() {
					setTimeout( ready, 0 );
				}
			} ),
			output = element.pinpad( "output" );

		function step1() {
			var i,
				maxLength = element.pinpad( "option", "maxLength" );
			for ( i = 0; i < maxLength; i++ ) {
				output.simulate( "keydown", { keyCode: $.ui.keyCode.NUMPAD_0 + helper.getRandomDigit() } );
			}
			setTimeout( step2, 0 );
		}

		function step2() {
			output.simulate( "keydown", { keyCode: $.ui.keyCode.NUMPAD_0 + helper.getRandomDigit() } );
			assert.equal( element.pinpad( "value" ).length, element.pinpad( "option", "maxLength" ), "the pinpad does not accept any keys since the input maximum length is reached" );
			setTimeout( step3, 0 );
		}

		function step3() {
			output.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
		}

		element.pinpad( "option", "maxLength", 5 );
		output.simulate( "focus" );
	} );

} );
