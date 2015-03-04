/*
 * dialog_core.js
 */

(function($) {

// TODO add teardown callback to remove dialogs
module("dialog: core");

test("title id", function() {
	expect(1);

	var titleId,
		element = $("<div></div>").dialog();

	titleId = element.dialog("widget").find(".ui-dialog-title").attr("id");
	ok( /ui-id-\d+$/.test( titleId ), "auto-numbered title id");
	element.remove();
});

test( "ARIA", function() {
	expect( 4 );

	var element = $( "<div></div>" ).dialog(),
		wrapper = element.dialog( "widget" );
	equal( wrapper.attr( "role" ), "dialog", "dialog role" );
	equal( wrapper.attr( "aria-labelledby" ), wrapper.find( ".ui-dialog-title" ).attr( "id" ) );
	equal( wrapper.attr( "aria-describedby" ), element.attr( "id" ), "aria-describedby added" );
	element.remove();

	element = $("<div><div aria-describedby='section2'><p id='section2'>descriotion</p></div></div>").dialog();
	strictEqual( element.dialog( "widget" ).attr( "aria-describedby" ), undefined, "no aria-describedby added, as already present in markup" );
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
		$( "body" ).focus();

		element = $( markup ).dialog( options );
		setTimeout(function() {
			testFn();
			element.remove();
			setTimeout( next );
		});
	}

	function step1() {
		element = $( "<div><input><input></div>" ).dialog( options );
		setTimeout(function() {
			var input = element.find( "input:last" ).focus().blur();
			element.dialog( "instance" )._focusTabbable();
			setTimeout(function() {
				equal( document.activeElement, input[ 0 ],
					"1. an element that was focused previously." );
				element.remove();
				setTimeout( step2 );
			});
		});
	}

	function step2() {
		checkFocus( "<div><input><input autofocus></div>", options, function() {
			equal( document.activeElement, element.find( "input" )[ 1 ],
				"2. first element inside the dialog matching [autofocus]" );
		}, step3 );
	}

	function step3() {
		checkFocus( "<div><input><input></div>", options, function() {
			equal( document.activeElement, element.find( "input" )[ 0 ],
				"3. tabbable element inside the content element" );
		}, step4 );
	}

	function step4() {
		checkFocus( "<div>text</div>", options, function() {
			equal( document.activeElement,
				element.dialog( "widget" ).find( ".ui-dialog-buttonpane button" )[ 0 ],
				"4. tabbable element inside the buttonpane" );
		}, step5 );
	}

	function step5() {
		checkFocus( "<div>text</div>", {}, function() {
			equal( document.activeElement,
				element.dialog( "widget" ).find( ".ui-dialog-titlebar .ui-dialog-titlebar-close" )[ 0 ],
				"5. the close button" );
		}, step6 );
	}

	function step6() {
		element = $( "<div>text</div>" ).dialog({
			autoOpen: false
		});
		element.dialog( "widget" ).find( ".ui-dialog-titlebar-close" ).hide();
		element.dialog( "open" );
		setTimeout(function() {
			equal( document.activeElement, element.parent()[ 0 ], "6. the dialog itself" );
			element.remove();
			setTimeout( step7 );
		});
	}

	function step7() {
		element = $( "<div><input name='0'><input name='1' autofocus></div>" ).dialog({
			open: function() {
				var inputs = $( this ).find( "input" );
				inputs.last().keydown(function( event ) {
					event.preventDefault();
					inputs.first().focus();
				});
			}
		});
		setTimeout(function() {
			var inputs = element.find( "input" );
			equal( document.activeElement, inputs[ 1 ], "Focus starts on second input" );
			inputs.last().simulate( "keydown", { keyCode: $.ui.keyCode.TAB });
			setTimeout(function() {
				equal( document.activeElement, inputs[ 0 ],
					"Honor preventDefault, allowing custom focus management" );
				element.remove();
				start();
			}, 50 );
		});
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

		// check shift tab
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
		$( "#favorite-animal" ).focus();
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
	$( "body" ).focus();

	// Wait for the modal to init
	setTimeout(function() {
		second.testWidget( "open" );

		// Simulate user tabbing from address bar to an element outside the dialog
		$( "#favorite-animal" ).focus();
		setTimeout(function() {
			equal( document.activeElement, secondInput[ 0 ] );

			// Last active dialog must receive focus
			firstInput.focus();
			$( "#favorite-animal" ).focus();
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

})(jQuery);
