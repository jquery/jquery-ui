/*
 * dialog_core.js
 */

(function($) {

module("dialog: core");

test("title id", function() {
	expect(1);

	var titleId,
		el = $("<div></div>").dialog();

	titleId = el.dialog("widget").find(".ui-dialog-title").attr("id");
	ok( /ui-id-\d+$/.test( titleId ), "auto-numbered title id");
	el.remove();
});

test( "ARIA", function() {
	expect( 4 );

	var el = $( "<div></div>" ).dialog(),
		wrapper = el.dialog( "widget" );
	equal( wrapper.attr( "role" ), "dialog", "dialog role" );
	equal( wrapper.attr( "aria-labelledby" ), wrapper.find( ".ui-dialog-title" ).attr( "id" ) );
	equal( wrapper.attr( "aria-describedby" ), el.attr( "id" ), "aria-describedby added" );
	el.remove();

	el = $("<div><div aria-describedby='section2'><p id='section2'>descriotion</p></div></div>").dialog();
	strictEqual( el.dialog( "widget" ).attr( "aria-describedby" ), undefined, "no aria-describedby added, as already present in markup" );
	el.remove();
});

test("widget method", function() {
	expect( 1 );
	var dialog = $("<div>").appendTo("#qunit-fixture").dialog();
	deepEqual(dialog.parent()[0], dialog.dialog("widget")[0]);
	dialog.remove();
});

asyncTest( "focus tabbable", function() {
	expect( 5 );
	var el,
		options = {
			buttons: [{
				text: "Ok",
				click: $.noop
			}]
		};

	function checkFocus( markup, options, testFn, next ) {
		el = $( markup ).dialog( options );
		setTimeout(function() {
			testFn();
			el.remove();
			setTimeout( next );
		});
	}

	function step1() {
		checkFocus( "<div><input><input autofocus></div>", options, function() {
			equal( document.activeElement, el.find( "input" )[ 1 ],
				"1. first element inside the dialog matching [autofocus]" );
		}, step2 );
	}

	function step2() {
		checkFocus( "<div><input><input></div>", options, function() {
			equal( document.activeElement, el.find( "input" )[ 0 ],
				"2. tabbable element inside the content element" );
		}, step3 );
	}

	function step3() {
		checkFocus( "<div>text</div>", options, function() {
			equal( document.activeElement,
				el.dialog( "widget" ).find( ".ui-dialog-buttonpane button" )[ 0 ],
				"3. tabbable element inside the buttonpane" );
		}, step4 );
	}

	function step4() {
		checkFocus( "<div>text</div>", {}, function() {
			equal( document.activeElement,
				el.dialog( "widget" ).find( ".ui-dialog-titlebar .ui-dialog-titlebar-close" )[ 0 ],
				"4. the close button" );
		}, step5 );
	}

	function step5() {
		el = $( "<div>text</div>" ).dialog({
			autoOpen: false
		});
		el.dialog( "widget" ).find( ".ui-dialog-titlebar-close" ).hide();
		el.dialog( "open" );
		setTimeout(function() {
			equal( document.activeElement, el.parent()[ 0 ], "5. the dialog itself" );
			el.remove();
			start();
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

	var el = $( "<div><input><input></div>" ).dialog(),
		inputs = el.find( "input" ),
		widget = el.dialog( "widget" )[ 0 ];

	function checkTab() {
		ok( $.contains( widget, document.activeElement ), "Tab key event moved focus within the modal" );

		// check shift tab
		$( document.activeElement ).simulate( "keydown", { keyCode: $.ui.keyCode.TAB, shiftKey: true });
		setTimeout( checkShiftTab );
	}

	function checkShiftTab() {
		ok( $.contains( widget, document.activeElement ), "Shift-Tab key event moved focus within the modal" );

		el.remove();
		setTimeout( start );
	}

	inputs[1].focus();
	setTimeout(function() {
		equal( document.activeElement, inputs[1], "Focus set on second input" );
		inputs.eq( 1 ).simulate( "keydown", { keyCode: $.ui.keyCode.TAB });

		setTimeout( checkTab );
	});
});

})(jQuery);
