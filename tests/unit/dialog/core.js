define( [
	"jquery",
	"ui/widgets/dialog"
], function( $ ) {

// TODO add teardown callback to remove dialogs
module("dialog: core");

test( "markup structure", function( assert ) {
	expect( 11 );

	var element = $( "<div>" ).dialog({
			buttons: [ {
				text: "Ok",
				click: $.noop
			} ]
		}),
		widget = element.dialog( "widget" ),
		titlebar = widget.find( ".ui-dialog-titlebar" ),
		title = titlebar.find( ".ui-dialog-title" ),
		close = titlebar.find( ".ui-dialog-titlebar-close" ),
		buttonpane = widget.find( ".ui-dialog-buttonpane" ),
		buttonset = widget.find( ".ui-dialog-buttonset" ),
		buttons = buttonset.find( ".ui-button" );

	assert.hasClasses( widget, "ui-dialog ui-dialog-buttons ui-widget ui-widget-content" );
	assert.hasClasses( titlebar, "ui-dialog-titlebar ui-widget-header" );
	equal( titlebar.length, 1, "Dialog has exactly one titlebar" );
	assert.hasClasses( close, "ui-dialog-titlebar-close ui-widget" );
	equal( close.length, 1, "Titlebar has exactly one close button" );
	equal( title.length, 1, "Titlebar has exactly one title" );
	assert.hasClasses( element, "ui-dialog-content ui-widget-content" );
	assert.hasClasses( buttonpane, "ui-dialog-buttonpane ui-widget-content" );
	equal( buttonpane.length, 1, "Dialog has exactly one buttonpane" );
	equal( buttonset.length, 1, "Buttonpane has exactly one buttonset" );
	equal( buttons.length, 1, "Buttonset contains exactly 1 button when created with 1" );

});

test( "markup structure - no buttons", function( assert ) {
	expect( 7 );

	var element = $( "<div>" ).dialog(),
		widget = element.dialog( "widget" ),
		titlebar = widget.find( ".ui-dialog-titlebar" ),
		title = titlebar.find( ".ui-dialog-title" ),
		close = titlebar.find( ".ui-dialog-titlebar-close" );

	assert.hasClasses( widget, "ui-dialog ui-widget ui-widget-content" );
	assert.hasClasses( titlebar, "ui-dialog-titlebar ui-widget-header" );
	equal( titlebar.length, 1, "Dialog has exactly one titlebar" );
	assert.hasClasses( close, "ui-dialog-titlebar-close ui-widget" );
	equal( close.length, 1, "Titlebar has exactly one close button" );
	equal( title.length, 1, "Titlebar has exactly one title" );
	assert.hasClasses( element, "ui-dialog-content ui-widget-content" );
});

test("title id", function() {
	expect(1);

	var titleId,
		element = $("<div>").dialog();

	titleId = element.dialog("widget").find(".ui-dialog-title").attr("id");
	ok( /ui-id-\d+$/.test( titleId ), "auto-numbered title id");
	element.remove();
});

test( "ARIA", function() {
	expect( 4 );

	var element = $( "<div>" ).dialog(),
		wrapper = element.dialog( "widget" );
	equal( wrapper.attr( "role" ), "dialog", "dialog role" );
	equal( wrapper.attr( "aria-labelledby" ), wrapper.find( ".ui-dialog-title" ).attr( "id" ) );
	equal( wrapper.attr( "aria-describedby" ), element.attr( "id" ), "aria-describedby added" );
	element.remove();

	element = $("<div><div aria-describedby='section2'><p id='section2'>descriotion</p></div></div>").dialog();
	equal( element.dialog( "widget" ).attr( "aria-describedby" ), null, "no aria-describedby added, as already present in markup" );
	element.remove();
});

test("widget method", function() {
	expect( 1 );
	var dialog = $("<div>").appendTo("#qunit-fixture").dialog();
	deepEqual(dialog.parent()[0], dialog.dialog("widget")[0]);
	dialog.remove();
});

asyncTest( "focus tabbable", function() {
	expect( 8 );
	var element,
		options = {
			buttons: [{
				text: "Ok",
				click: $.noop
			}]
		};

	function checkFocus( markup, options, testFn, next ) {

		// Support: IE8
		// For some reason the focus doesn't get set properly if we don't
		// focus the body first.
		$( "body" ).trigger( "focus" );

		element = $( markup ).dialog( options );
		setTimeout(function() {
			testFn(function done() {
				element.remove();
				setTimeout( next );
			});
		});
	}

	function step1() {
		checkFocus( "<div><input><input></div>", options, function( done ) {
			var input = element.find( "input:last" ).trigger( "focus" ).trigger( "blur" );
			element.dialog( "instance" )._focusTabbable();
			setTimeout(function() {
				equal( document.activeElement, input[ 0 ],
					"1. an element that was focused previously." );
				done();
			});
		}, step2 );
	}

	function step2() {
		checkFocus( "<div><input><input autofocus></div>", options, function( done ) {
			equal( document.activeElement, element.find( "input" )[ 1 ],
				"2. first element inside the dialog matching [autofocus]" );
			done();
		}, step3 );
	}

	function step3() {
		checkFocus( "<div><input><input></div>", options, function( done ) {
			equal( document.activeElement, element.find( "input" )[ 0 ],
				"3. tabbable element inside the content element" );
			done();
		}, step4 );
	}

	function step4() {
		checkFocus( "<div>text</div>", options, function( done ) {
			equal( document.activeElement,
				element.dialog( "widget" ).find( ".ui-dialog-buttonpane button" )[ 0 ],
				"4. tabbable element inside the buttonpane" );
			done();
		}, step5 );
	}

	function step5() {
		checkFocus( "<div>text</div>", {}, function( done ) {
			equal( document.activeElement,
				element.dialog( "widget" ).find( ".ui-dialog-titlebar .ui-dialog-titlebar-close" )[ 0 ],
				"5. the close button" );
			done();
		}, step6 );
	}

	function step6() {
		checkFocus( "<div>text</div>", { autoOpen: false }, function( done ) {
			element.dialog( "widget" ).find( ".ui-dialog-titlebar-close" ).hide();
			element.dialog( "open" );
			setTimeout(function() {
				equal( document.activeElement, element.parent()[ 0 ], "6. the dialog itself" );
				done();
			});
		}, step7 );
	}

	function step7() {
		checkFocus(
			"<div><input><input autofocus></div>",
			{
				open: function() {
					var inputs = $( this ).find( "input" );
					inputs.last().on( "keydown",function( event ) {
						event.preventDefault();
						inputs.first().trigger( "focus" );
					});
				}
			},
			function( done ) {
				var inputs = element.find( "input" );
				equal( document.activeElement, inputs[ 1 ], "Focus starts on second input" );
				inputs.last().simulate( "keydown", { keyCode: $.ui.keyCode.TAB });
				setTimeout(function() {
					equal( document.activeElement, inputs[ 0 ],
						"Honor preventDefault, allowing custom focus management" );
					done();
				}, 50 );
			},
			start
		);
	}

	step1();
});

test( "#7960: resizable handles below modal overlays", function() {
	expect( 1 );

	var resizable = $( "<div>" ).resizable(),
		dialog = $( "<div>" ).dialog({ modal: true }),
		resizableZindex = parseInt( resizable.find( ".ui-resizable-handle" ).css( "zIndex" ), 10 ),
		overlayZindex = parseInt( $( ".ui-widget-overlay" ).css( "zIndex" ), 10 );

	ok( resizableZindex < overlayZindex, "Resizable handles have lower z-index than modal overlay" );
	dialog.dialog( "destroy" );
});

asyncTest( "Prevent tabbing out of dialogs", function() {
	expect( 3 );

	var element = $( "<div><input name='0'><input name='1'></div>" ).dialog(),
		inputs = element.find( "input" );

	// Remove close button to test focus on just the two buttons
	element.dialog( "widget" ).find( ".ui-button").remove();

	function checkTab() {
		equal( document.activeElement, inputs[ 0 ], "Tab key event moved focus within the modal" );

		// Check shift tab
		$( document.activeElement ).simulate( "keydown", { keyCode: $.ui.keyCode.TAB, shiftKey: true });
		setTimeout( checkShiftTab );
	}

	function checkShiftTab() {
		equal( document.activeElement, inputs[ 1 ], "Shift-Tab key event moved focus back to second input" );

		element.remove();
		setTimeout( start );
	}

	inputs[ 1 ].focus();
	setTimeout(function() {
		equal( document.activeElement, inputs[ 1 ], "Focus set on second input" );
		inputs.eq( 1 ).simulate( "keydown", { keyCode: $.ui.keyCode.TAB });

		setTimeout( checkTab );
	});
});

asyncTest( "#9048: multiple modal dialogs opened and closed in different order", function() {
	expect( 1 );
	$( "#dialog1, #dialog2" ).dialog({ autoOpen: false, modal:true });
	$( "#dialog1" ).dialog( "open" );
	$( "#dialog2" ).dialog( "open" );
	$( "#dialog1" ).dialog( "close" );
	setTimeout(function() {
		$( "#dialog2" ).dialog( "close" );
		$( "#favorite-animal" ).trigger( "focus" );
		ok( true, "event handlers cleaned up (no errors thrown)" );
		start();
	});
});

asyncTest( "interaction between overlay and other dialogs", function() {
	$.widget( "ui.testWidget", $.ui.dialog, {
		options: {
			modal: true,
			autoOpen: false
		}
	});
	expect( 2 );
	var first = $( "<div><input id='input-1'></div>" ).dialog({
			modal: true
		}),
		firstInput = first.find( "input" ),
		second = $( "<div><input id='input-2'></div>" ).testWidget(),
		secondInput = second.find( "input" );

	// Support: IE8
	// For some reason the focus doesn't get set properly if we don't
	// focus the body first.
	$( "body" ).trigger( "focus" );

	// Wait for the modal to init
	setTimeout(function() {
		second.testWidget( "open" );

		// Simulate user tabbing from address bar to an element outside the dialog
		$( "#favorite-animal" ).trigger( "focus" );
		setTimeout(function() {
			equal( document.activeElement, secondInput[ 0 ] );

			// Last active dialog must receive focus
			firstInput.trigger( "focus" );
			$( "#favorite-animal" ).trigger( "focus" );
			setTimeout(function() {
				equal( document.activeElement, firstInput[ 0 ] );

				// Cleanup
				first.remove();
				second.remove();
				delete $.ui.testWidget;
				delete $.fn.testWidget;
				start();
			});
		});
	});
});

} );
