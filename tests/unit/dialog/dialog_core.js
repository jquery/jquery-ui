/*
 * dialog_core.js
 */

(function($) {

module("dialog: core");

test("title id", function() {
	expect(1);

	var titleId,
		el = $('<div></div>').dialog();

	titleId = el.dialog('widget').find('.ui-dialog-title').attr('id');
	ok( /ui-id-\d+$/.test( titleId ), 'auto-numbered title id');
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

	el = $( '<div><div aria-describedby="section2"><p id="section2">descriotion</p></div></div>' ).dialog();
	strictEqual( el.dialog( "widget" ).attr( "aria-describedby" ), undefined, "no aria-describedby added, as already present in markup" );
	el.remove();
});

test("widget method", function() {
	expect( 1 );
	var dialog = $("<div>").appendTo("#main").dialog();
	deepEqual(dialog.parent()[0], dialog.dialog("widget")[0]);
});

test( "focus tabbable", function() {
	expect( 5 );
	var el,
		options = {
			buttons: [{
				text: "Ok",
				click: $.noop
			}]
		};

	el = $( "<div><input><input autofocus></div>" ).dialog( options );
	equal( document.activeElement, el.find( "input" )[ 1 ], "1. first element inside the dialog matching [autofocus]" );
	el.remove();

	// IE8 fails to focus the input, <body> ends up being the activeElement
	// so wait for that stupid browser
	stop();
	setTimeout(function() {
		el = $( "<div><input><input></div>" ).dialog( options );
		equal( document.activeElement, el.find( "input" )[ 0 ], "2. tabbable element inside the content element" );
		el.remove();

		el = $( "<div>text</div>" ).dialog( options );
		equal( document.activeElement, el.dialog( "widget" ).find( ".ui-dialog-buttonpane button" )[ 0 ], "3. tabbable element inside the buttonpane" );
		el.remove();

		el = $( "<div>text</div>" ).dialog();
		equal( document.activeElement, el.dialog( "widget" ).find( ".ui-dialog-titlebar .ui-dialog-titlebar-close" )[ 0 ], "4. the close button" );
		el.remove();

		el = $( "<div>text</div>" ).dialog({
			autoOpen: false
		});
		el.dialog( "widget" ).find( ".ui-dialog-titlebar-close" ).hide();
		el.dialog( "open" );
		equal( document.activeElement, el.parent()[ 0 ], "5. the dialog itself" );
		el.remove();

		start();
	}, 13);
});

// #7960
test( "resizable handles below modal overlays", function() {
	expect( 1 );

	var resizable = $( "<div>" ).resizable(),
		dialog = $( "<div>" ).dialog({ modal: true }),
		resizableZindex = parseInt( resizable.find( ".ui-resizable-handle" ).css( "zIndex" ), 10 ),
		overlayZindex = parseInt( $( ".ui-widget-overlay" ).css( "zIndex" ), 10 );

	ok( resizableZindex < overlayZindex, "Resizable handles have lower z-index than modal overlay" );
	dialog.dialog( "destroy" );
});

})(jQuery);
