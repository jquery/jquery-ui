define( [
	"qunit",
	"jquery",
	"ui/widgets/pinpad"
], function( QUnit, $ ) {

	QUnit.module( "pinpad: core" );

	QUnit.test( "markup structure", function( assert ) {
		assert.expect( 5 );
		var element = $( "#pinpad1" ).pinpad(),
			output = element.pinpad( "output" ),
			widget = element.pinpad( "widget" ),
			numpadKeyButtons = widget.find( ".ui-pinpad-key" ),
			commandButtons = widget.find( ".ui-pinpad-command" );

		assert.hasClasses( element, "ui-pinpad-input ui-helper-hidden" );
		assert.hasClasses( output, "ui-pinpad-output" );
		assert.hasClasses( widget, "ui-pinpad ui-widget ui-widget-content" );
		assert.equal( numpadKeyButtons.length, 12, "The widget contains exactly twelve numpad key buttons" );
		assert.equal( commandButtons.length, 4, "The widget contains exactly four command buttons" );
	} );

	QUnit.test( "keyboard support - numpad keys", function( assert ) {
		var ready = assert.async();
		assert.expect( 1 );
		var element = $( "#pinpad1" ).pinpad(),
			output = element.pinpad( "output" );
		output.simulate( "focus" );

		function start() {
			output.simulate( "keydown", { keyCode: $.ui.keyCode.NUMPAD_0 } );
			output.simulate( "keydown", { keyCode: $.ui.keyCode.DECIMAL_POINT } );
			output.simulate( "keydown", { keyCode: $.ui.keyCode.NUMPAD_1 } );
			output.simulate( "keydown", { keyCode: $.ui.keyCode.NUMPAD_2 } );
			output.simulate( "keydown", { keyCode: $.ui.keyCode.NUMPAD_3 } );
			output.simulate( "keydown", { keyCode: $.ui.keyCode.NUMPAD_4 } );
			output.simulate( "keydown", { keyCode: $.ui.keyCode.NUMPAD_5 } );
			output.simulate( "keydown", { keyCode: $.ui.keyCode.NUMPAD_6 } );
			output.simulate( "keydown", { keyCode: $.ui.keyCode.NUMPAD_7 } );
			output.simulate( "keydown", { keyCode: $.ui.keyCode.NUMPAD_8 } );
			output.simulate( "keydown", { keyCode: $.ui.keyCode.NUMPAD_9 } );
			output.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			assert.equal( element.pinpad( "value" ), "0.123456789" );
			ready();
		}

		setTimeout( start, 0 );
	} );

} );
