define( [
	"qunit",
	"jquery",
	"ui/widgets/dialog"
], function( QUnit, $ ) {

// TODO add teardown callback to remove dialogs
QUnit.module( "dialog: core" );

QUnit.test( "markup structure", function( assert ) {
	assert.expect( 11 );

	var element = $( "<div>" ).dialog( {
			buttons: [ {
				text: "Ok",
				click: $.noop
			} ]
		} ),
		widget = element.dialog( "widget" ),
		titlebar = widget.find( ".ui-dialog-titlebar" ),
		title = titlebar.find( ".ui-dialog-title" ),
		close = titlebar.find( ".ui-dialog-titlebar-close" ),
		buttonpane = widget.find( ".ui-dialog-buttonpane" ),
		buttonset = widget.find( ".ui-dialog-buttonset" ),
		buttons = buttonset.find( ".ui-button" );

	assert.hasClasses( widget, "ui-dialog ui-dialog-buttons ui-widget ui-widget-content" );
	assert.hasClasses( titlebar, "ui-dialog-titlebar ui-widget-header" );
	assert.equal( titlebar.length, 1, "Dialog has exactly one titlebar" );
	assert.hasClasses( close, "ui-dialog-titlebar-close ui-widget" );
	assert.equal( close.length, 1, "Titlebar has exactly one close button" );
	assert.equal( title.length, 1, "Titlebar has exactly one title" );
	assert.hasClasses( element, "ui-dialog-content ui-widget-content" );
	assert.hasClasses( buttonpane, "ui-dialog-buttonpane ui-widget-content" );
	assert.equal( buttonpane.length, 1, "Dialog has exactly one buttonpane" );
	assert.equal( buttonset.length, 1, "Buttonpane has exactly one buttonset" );
	assert.equal( buttons.length, 1, "Buttonset contains exactly 1 button when created with 1" );

} );

QUnit.test( "markup structure - no buttons", function( assert ) {
	assert.expect( 7 );

	var element = $( "<div>" ).dialog(),
		widget = element.dialog( "widget" ),
		titlebar = widget.find( ".ui-dialog-titlebar" ),
		title = titlebar.find( ".ui-dialog-title" ),
		close = titlebar.find( ".ui-dialog-titlebar-close" );

	assert.hasClasses( widget, "ui-dialog ui-widget ui-widget-content" );
	assert.hasClasses( titlebar, "ui-dialog-titlebar ui-widget-header" );
	assert.equal( titlebar.length, 1, "Dialog has exactly one titlebar" );
	assert.hasClasses( close, "ui-dialog-titlebar-close ui-widget" );
	assert.equal( close.length, 1, "Titlebar has exactly one close button" );
	assert.equal( title.length, 1, "Titlebar has exactly one title" );
	assert.hasClasses( element, "ui-dialog-content ui-widget-content" );
} );

QUnit.test( "title id", function( assert ) {
	assert.expect( 1 );

	var titleId,
		element = $( "<div>" ).dialog();

	titleId = element.dialog( "widget" ).find( ".ui-dialog-title" ).attr( "id" );
	assert.ok( /ui-id-\d+$/.test( titleId ), "auto-numbered title id" );
	element.remove();
} );

QUnit.test( "ARIA", function( assert ) {
	assert.expect( 4 );

	var element = $( "<div>" ).dialog(),
		wrapper = element.dialog( "widget" );
	assert.equal( wrapper.attr( "role" ), "dialog", "dialog role" );
	assert.equal( wrapper.attr( "aria-labelledby" ), wrapper.find( ".ui-dialog-title" ).attr( "id" ) );
	assert.equal( wrapper.attr( "aria-describedby" ), element.attr( "id" ), "aria-describedby added" );
	element.remove();

	element = $( "<div><div aria-describedby='section2'><p id='section2'>descriotion</p></div></div>" ).dialog();
	assert.equal( element.dialog( "widget" ).attr( "aria-describedby" ), null, "no aria-describedby added, as already present in markup" );
	element.remove();
} );

QUnit.test( "widget method", function( assert ) {
	assert.expect( 1 );
	var dialog = $( "<div>" ).appendTo( "#qunit-fixture" ).dialog();
	assert.deepEqual( dialog.parent()[ 0 ], dialog.dialog( "widget" )[ 0 ] );
	dialog.remove();
} );

QUnit.test( "focus tabbable", function( assert ) {
	var ready = assert.async();
	assert.expect( 8 );
	var element,
		options = {
			buttons: [ {
				text: "Ok",
				click: $.noop
			} ]
		};

	function checkFocus( markup, options, testFn, next ) {

		// Support: IE8
		// For some reason the focus doesn't get set properly if we don't
		// focus the body first.
		$( "body" ).trigger( "focus" );

		element = $( markup ).dialog( options );
		setTimeout( function() {
			testFn( function done() {
				element.remove();
				setTimeout( next );
			} );
		} );
	}

	function step1() {
		checkFocus( "<div><input><input></div>", options, function( done ) {
			var input = element.find( "input:last" ).trigger( "focus" ).trigger( "blur" );
			element.dialog( "instance" )._focusTabbable();
			setTimeout( function() {
				assert.equal( document.activeElement, input[ 0 ],
					"1. an element that was focused previously." );
				done();
			} );
		}, step2 );
	}

	function step2() {
		checkFocus( "<div><input><input autofocus></div>", options, function( done ) {
			assert.equal( document.activeElement, element.find( "input" )[ 1 ],
				"2. first element inside the dialog matching [autofocus]" );
			done();
		}, step3 );
	}

	function step3() {
		checkFocus( "<div><input><input></div>", options, function( done ) {
			assert.equal( document.activeElement, element.find( "input" )[ 0 ],
				"3. tabbable element inside the content element" );
			done();
		}, step4 );
	}

	function step4() {
		checkFocus( "<div>text</div>", options, function( done ) {
			assert.equal( document.activeElement,
				element.dialog( "widget" ).find( ".ui-dialog-buttonpane button" )[ 0 ],
				"4. tabbable element inside the buttonpane" );
			done();
		}, step5 );
	}

	function step5() {
		checkFocus( "<div>text</div>", {}, function( done ) {
			assert.equal( document.activeElement,
				element.dialog( "widget" ).find( ".ui-dialog-titlebar .ui-dialog-titlebar-close" )[ 0 ],
				"5. the close button" );
			done();
		}, step6 );
	}

	function step6() {
		checkFocus( "<div>text</div>", { autoOpen: false }, function( done ) {
			element.dialog( "widget" ).find( ".ui-dialog-titlebar-close" ).hide();
			element.dialog( "open" );
			setTimeout( function() {
				assert.equal( document.activeElement, element.parent()[ 0 ], "6. the dialog itself" );
				done();
			} );
		}, step7 );
	}

	function step7() {
		checkFocus(
			"<div><input><input autofocus></div>",
			{
				open: function() {
					var inputs = $( this ).find( "input" );
					inputs.last().on( "keydown", function( event ) {
						event.preventDefault();
						inputs.first().trigger( "focus" );
					} );
				}
			},
			function( done ) {
				var inputs = element.find( "input"
					);
				assert.equal
				( document.activeElement, inputs[ 1 ],  "Focus starts on second input" );
				inputs.last().simulate( "keydown", { keyCode: $.ui.keyCode.TAB } );
				setTimeout( function() {
					assert.equal( document.activeElement, inputs[ 0 ],
						"Honor preventDefault, allowing custom focus management" );
					done();
				}, 50 );
			},
			ready
		);
	}

	step1();
} );

QUnit.test( "#7960: resizable handles below modal overlays", function( assert ) {
	assert.expect( 1 );

	var resizable = $( "<div>" ).resizable(),
		dialog = $( "<div>" ).dialog( { modal: true } ),
		resizableZindex = parseInt( resizable.find( ".ui-resizable-handle" ).css( "zIndex" ), 10 ),
		overlayZindex = parseInt( $( ".ui-widget-overlay" ).css( "zIndex" ), 10 );

	assert.ok( resizableZindex < overlayZindex, "Resizable handles have lower z-index than modal overlay" );
	dialog.dialog( "destroy" );
} );

QUnit.test( "Prevent tabbing out of dialogs", function( assert ) {
	var ready = assert.async();
	assert.expect( 3 );

	var element = $( "<div><input name='0'><input name='1'></div>" ).dialog(),
		inputs = element.find( "input" );

	// Remove close button to test focus on just the two buttons
	element.dialog( "widget" ).find( ".ui-button" ).remove();

	function checkTab() {
		assert.equal( document.activeElement, inputs[ 0 ], "Tab key event move d focus  within the modal" );

		// Check shift tab
		$( document.activeElement ).simulate( "keydown", { keyCode: $.ui.keyCode.TAB, shiftKey: true } );
		setTimeout( checkShiftTab );
	}

	function checkShiftTab() {
		assert.equal( document.activeElement, inputs[ 1 ], "Shift-Tab key event moved focus back to second input" );

		element.remove();
		setTimeout( ready );
	}

	inputs[ 1 ].focus();
	setTimeout( function() {
		assert.equal( document.activeElement, inputs[ 1 ], "Focus set on second input" );
		inputs.eq( 1 ).simulate( "keydown", { keyCode: $.ui.keyCode.TAB } );

		setTimeout( checkTab );
	} );
} );

QUnit.test( "#9048: multiple modal dialogs opened and closed in different order",
	function( assert )  {
	var ready = assert.async();
	assert.expect( 1 );
	$( "#dialog1, #dialog2" ).dialog( { autoOpen: false, modal:true } );
	$( "#dialog1" ).dialog( "open" );
	$( "#dialog2" ).dialog( "open" );
	$( "#dialog1" ).dialog( "close" );
	setTimeout( function() {
		$( "#dialog2" ).dialog( "close" );
		$( "#favorite-animal" ).trigger( "focus" );
		assert.ok( true, "event handlers cleaned up (no errors thrown)" );
		ready();
	} );
} );

QUnit.test( "interaction between overlay and other dialogs", function( assert ) {
	var ready = assert.async();
	$.widget( "ui.testWidget", $.ui.dialog, {
		options: {
			modal: true,
			autoOpen: false
		}
	} );
	assert.expect( 2 );
	var first = $( "<div><input id='input-1'></div>" ).dialog( {
			modal: true
		} ),
		firstInput = first.find( "input" ),
		second = $( "<div><input id='input-2'></div>" ).testWidget(),
		secondInput = second.find( "input" );

	// Support: IE8
	// For some reason the focus doesn't get set properly if we don't
	// focus the body first.
	$( "body" ).trigger( "focus" );

	// Wait for the modal to init
	setTimeout( function() {

		second.
		testWidget
		( "open" );

		// Simulate user  tabbing  from address bar to an element outside the dialog
		$( "#favorite-animal" ).trigger( "focus" );
		setTimeout( function() {
			assert.equal( document.activeElement, secondInput[ 0 ] );

			// Last active dialog must receive focus
			firstInput.trigger( "focus" );
			$( "#favorite-animal" ).trigger( "focus" );
			setTimeout( function() {
				assert.equal( document.activeElement, firstInput[ 0 ] );

				// Cleanup
				first.remove();
				second.remove();
				delete $.ui.testWidget;
				delete $.fn.testWidget;
				ready();
			} );
		} );
	} );
} );

} );
