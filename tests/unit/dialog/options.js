define( [
	"jquery",
	"./helper",
	"ui/widgets/dialog",
	"ui/effects/effect-blind",
	"ui/effects/effect-explode"
], function( $, testHelper ) {

module( "dialog: options" );

test( "appendTo", function() {
	expect( 16 );
	var detached = $( "<div>" ),
		element = $( "#dialog1" ).dialog( {
			modal: true
		} );
	equal( element.dialog( "widget" ).parent()[ 0 ], document.body, "defaults to body" );
	equal( $( ".ui-widget-overlay" ).parent()[ 0 ], document.body, "overlay defaults to body" );
	element.dialog( "destroy" );

	element.dialog( {
		appendTo: ".wrap",
		modal: true
	} );
	equal( element.dialog( "widget" ).parent()[ 0 ], $( "#wrap1" )[ 0 ], "first found element" );
	equal( $( ".ui-widget-overlay" ).parent()[ 0 ], $( "#wrap1" )[ 0 ], "overlay first found element" );
	equal( $( "#wrap2 .ui-dialog" ).length, 0, "only appends to one element" );
	equal( $( "#wrap2 .ui-widget-overlay" ).length, 0, "overlay only appends to one element" );
	element.dialog( "destroy" );

	element.dialog( {
		appendTo: null,
		modal: true
	} );
	equal( element.dialog( "widget" ).parent()[ 0 ], document.body, "null" );
	equal( $( ".ui-widget-overlay" ).parent()[ 0 ], document.body, "overlay null" );
	element.dialog( "destroy" );

	element.dialog( {
		autoOpen: false,
		modal: true
	} ).dialog( "option", "appendTo", "#wrap1" ).dialog( "open" );
	equal( element.dialog( "widget" ).parent()[ 0 ], $( "#wrap1" )[ 0 ], "modified after init" );
	equal( $( ".ui-widget-overlay" ).parent()[ 0 ], $( "#wrap1" )[ 0 ], "overlay modified after init" );
	element.dialog( "destroy" );

	element.dialog( {
		appendTo: detached,
		modal: true
	} );
	equal( element.dialog( "widget" ).parent()[ 0 ], detached[ 0 ], "detached jQuery object" );
	equal( detached.find( ".ui-widget-overlay" ).parent()[ 0 ], detached[ 0 ], "overlay detached jQuery object" );
	element.dialog( "destroy" );

	element.dialog( {
		appendTo: detached[ 0 ],
		modal: true
	} );
	equal( element.dialog( "widget" ).parent()[ 0 ], detached[ 0 ], "detached DOM element" );
	equal( detached.find( ".ui-widget-overlay" ).parent()[ 0 ], detached[ 0 ], "overlay detached DOM element" );
	element.dialog( "destroy" );

	element.dialog( {
		autoOpen: false,
		modal: true
	} ).dialog( "option", "appendTo", detached );
	equal( element.dialog( "widget" ).parent()[ 0 ], detached[ 0 ], "detached DOM element via option()" );
	equal( detached.find( ".ui-widget-overlay" ).length, 0, "overlay detached DOM element via option()" );
	element.dialog( "destroy" );
} );

test( "autoOpen", function() {
	expect( 2 );

	var element = $( "<div></div>" ).dialog( { autoOpen: false } );
	ok( !element.dialog( "widget" ).is( ":visible" ), ".dialog({ autoOpen: false })" );
	element.remove();

	element = $( "<div></div>" ).dialog( { autoOpen: true } );
	ok( element.dialog( "widget" ).is( ":visible" ), ".dialog({ autoOpen: true })" );
	element.remove();
} );

test( "buttons", function( assert ) {
	expect( 21 );

	var btn, i, newButtons,
		buttons = {
			"Ok": function( ev ) {
				ok( true, "button click fires callback" );
				equal( this, element[ 0 ], "context of callback" );
				equal( ev.target, btn[ 0 ], "event target" );
			},
			"Cancel": function( ev ) {
				ok( true, "button click fires callback" );
				equal( this, element[ 0 ], "context of callback" );
				equal( ev.target, btn[ 1 ], "event target" );
			}
		},
		element = $( "<div></div>" ).dialog( { buttons: buttons } );

	btn = element.dialog( "widget" ).find( ".ui-dialog-buttonpane button" );
	equal( btn.length, 2, "number of buttons" );

	i = 0;
	$.each( buttons, function( key ) {
		equal( btn.eq( i ).text(), key, "text of button " + ( i + 1 ) );
		i++;
	} );

	assert.hasClasses( btn.parent(), "ui-dialog-buttonset" );
	assert.hasClasses( element.parent(), "ui-dialog-buttons" );

	btn.trigger( "click" );

	newButtons = {
		"Close": function( ev ) {
			ok( true, "button click fires callback" );
			equal( this, element[ 0 ], "context of callback" );
			equal( ev.target, btn[ 0 ], "event target" );
		}
	};

	deepEqual( element.dialog( "option", "buttons" ), buttons, ".dialog('option', 'buttons') getter" );
	element.dialog( "option", "buttons", newButtons );
	deepEqual( element.dialog( "option", "buttons" ), newButtons, ".dialog('option', 'buttons', ...) setter" );

	btn = element.dialog( "widget" ).find( ".ui-dialog-buttonpane button" );
	equal( btn.length, 1, "number of buttons after setter" );
	btn.trigger( "click" );

	i = 0;
	$.each( newButtons, function( key ) {
		equal( btn.eq( i ).text(), key, "text of button " + ( i + 1 ) );
		i += 1;
	} );

	element.dialog( "option", "buttons", null );
	btn = element.dialog( "widget" ).find( ".ui-dialog-buttonpane button" );
	equal( btn.length, 0, "all buttons have been removed" );
	equal( element.find( ".ui-dialog-buttonset" ).length, 0, "buttonset has been removed" );
	assert.lacksClasses( element.parent(), "ui-dialog-buttons" );
	element.remove();
} );

test( "buttons - advanced", function( assert ) {
	expect( 7 );

	var buttons,
		element = $( "<div></div>" ).dialog( {
			buttons: [
				{
					text: "a button",
					"class": "additional-class",
					id: "my-button-id",
					click: function() {
						equal( this, element[ 0 ], "correct context" );
					},
					icon: "ui-icon-cancel",
					showLabel: false
				}
			]
		} );

	buttons = element.dialog( "widget" ).find( ".ui-dialog-buttonpane button" );
	equal( buttons.length, 1, "correct number of buttons" );
	equal( buttons.attr( "id" ), "my-button-id", "correct id" );
	equal( $.trim( buttons.text() ), "a button", "correct label" );
	assert.hasClasses( buttons, "additional-class" );
	deepEqual( buttons.button( "option", "icon" ), "ui-icon-cancel" );
	equal( buttons.button( "option", "showLabel" ), false );
	buttons.trigger( "click" );

	element.remove();
} );

test( "#9043: buttons with Array.prototype modification", function() {
	expect( 1 );
	Array.prototype.test = $.noop;
	var element = $( "<div></div>" ).dialog();
	equal( element.dialog( "widget" ).find( ".ui-dialog-buttonpane" ).length, 0,
		"no button pane" );
	element.remove();
	delete Array.prototype.test;
} );

test( "closeOnEscape", function() {
	expect( 6 );
	var element = $( "<div></div>" ).dialog( { closeOnEscape: false } );
	ok( true, "closeOnEscape: false" );
	ok( element.dialog( "widget" ).is( ":visible" ) && !element.dialog( "widget" ).is( ":hidden" ), "dialog is open before ESC" );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } )
		.simulate( "keypress", { keyCode: $.ui.keyCode.ESCAPE } )
		.simulate( "keyup", { keyCode: $.ui.keyCode.ESCAPE } );
	ok( element.dialog( "widget" ).is( ":visible" ) && !element.dialog( "widget" ).is( ":hidden" ), "dialog is open after ESC" );

	element.remove();

	element = $( "<div></div>" ).dialog( { closeOnEscape: true } );
	ok( true, "closeOnEscape: true" );
	ok( element.dialog( "widget" ).is( ":visible" ) && !element.dialog( "widget" ).is( ":hidden" ), "dialog is open before ESC" );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } )
		.simulate( "keypress", { keyCode: $.ui.keyCode.ESCAPE } )
		.simulate( "keyup", { keyCode: $.ui.keyCode.ESCAPE } );
	ok( element.dialog( "widget" ).is( ":hidden" ) && !element.dialog( "widget" ).is( ":visible" ), "dialog is closed after ESC" );
} );

test( "closeText", function() {
	expect( 4 );

	var element = $( "<div></div>" ).dialog();
		equal( $.trim( element.dialog( "widget" ).find( ".ui-dialog-titlebar-close" ).text() ), "Close",
			"default close text" );
	element.remove();

	element = $( "<div></div>" ).dialog( { closeText: "foo" } );
		equal( $.trim( element.dialog( "widget" ).find( ".ui-dialog-titlebar-close" ).text() ), "foo",
			"closeText on init" );
	element.remove();

	element = $( "<div></div>" ).dialog().dialog( "option", "closeText", "bar" );
		equal( $.trim( element.dialog( "widget" ).find( ".ui-dialog-titlebar-close" ).text() ), "bar",
			"closeText via option method" );
	element.remove();

	element = $( "<div></div>" ).dialog( { closeText: "<span>foo</span>" } );
		equal( $.trim( element.dialog( "widget" ).find( ".ui-dialog-titlebar-close" ).text() ), "<span>foo</span>",
			"closeText is escaped" );
	element.remove();
} );

test( "draggable", function() {
	expect( 4 );

	var element = $( "<div></div>" ).dialog( { draggable: false } );

		testHelper.testDrag( element, 50, -50, 0, 0 );
		element.dialog( "option", "draggable", true );
		testHelper.testDrag( element, 50, -50, 50, -50 );
	element.remove();

	element = $( "<div></div>" ).dialog( { draggable: true } );
		testHelper.testDrag( element, 50, -50, 50, -50 );
		element.dialog( "option", "draggable", false );
		testHelper.testDrag( element, 50, -50, 0, 0 );
	element.remove();
} );

test( "height", function() {
	expect( 4 );

	var element = $( "<div></div>" ).dialog();
		equal( element.dialog( "widget" ).outerHeight(), 150, "default height" );
	element.remove();

	element = $( "<div></div>" ).dialog( { height: 237 } );
		equal( element.dialog( "widget" ).outerHeight(), 237, "explicit height" );
	element.remove();

	element = $( "<div></div>" ).dialog();
		element.dialog( "option", "height", 238 );
		equal( element.dialog( "widget" ).outerHeight(), 238, "explicit height set after init" );
	element.remove();

	element = $( "<div></div>" ).css( "padding", "20px" )
		.dialog( { height: 240 } );
		equal( element.dialog( "widget" ).outerHeight(), 240, "explicit height with padding" );
	element.remove();
} );

test( "maxHeight", function( assert ) {
	expect( 3 );

	var element = $( "<div></div>" ).dialog( { maxHeight: 200 } );
		testHelper.drag( element, ".ui-resizable-s", 1000, 1000 );
		assert.close( element.dialog( "widget" ).height(), 200, 1, "maxHeight" );
	element.remove();

	element = $( "<div></div>" ).dialog( { maxHeight: 200 } );
		testHelper.drag( element, ".ui-resizable-n", -1000, -1000 );
		assert.close( element.dialog( "widget" ).height(), 200, 1, "maxHeight" );
	element.remove();

	element = $( "<div></div>" ).dialog( { maxHeight: 200 } ).dialog( "option", "maxHeight", 300 );
		testHelper.drag( element, ".ui-resizable-s", 1000, 1000 );
		assert.close( element.dialog( "widget" ).height(), 300, 1, "maxHeight" );
	element.remove();
} );

test( "maxWidth", function( assert ) {
	expect( 3 );

	var element = $( "<div></div>" ).dialog( { maxWidth: 200 } );
		testHelper.drag( element, ".ui-resizable-e", 1000, 1000 );
		assert.close( element.dialog( "widget" ).width(), 200, 1, "maxWidth" );
	element.remove();

	element = $( "<div></div>" ).dialog( { maxWidth: 200 } );
		testHelper.drag( element, ".ui-resizable-w", -1000, -1000 );
		assert.close( element.dialog( "widget" ).width(), 200, 1, "maxWidth" );
	element.remove();

	element = $( "<div></div>" ).dialog( { maxWidth: 200 } ).dialog( "option", "maxWidth", 300 );
		testHelper.drag( element, ".ui-resizable-w", -1000, -1000 );
		assert.close( element.dialog( "widget" ).width(), 300, 1, "maxWidth" );
	element.remove();
} );

test( "minHeight", function( assert ) {
	expect( 3 );

	var element = $( "<div></div>" ).dialog( { minHeight: 10 } );
		testHelper.drag( element, ".ui-resizable-s", -1000, -1000 );
		assert.close( element.dialog( "widget" ).height(), 10, 1, "minHeight" );
	element.remove();

	element = $( "<div></div>" ).dialog( { minHeight: 10 } );
		testHelper.drag( element, ".ui-resizable-n", 1000, 1000 );
		assert.close( element.dialog( "widget" ).height(), 10, 1, "minHeight" );
	element.remove();

	element = $( "<div></div>" ).dialog( { minHeight: 10 } ).dialog( "option", "minHeight", 30 );
		testHelper.drag( element, ".ui-resizable-n", 1000, 1000 );
		assert.close( element.dialog( "widget" ).height(), 30, 1, "minHeight" );
	element.remove();
} );

test( "minWidth", function( assert ) {
	expect( 3 );

	var element = $( "<div></div>" ).dialog( { minWidth: 10 } );
		testHelper.drag( element, ".ui-resizable-e", -1000, -1000 );
		assert.close( element.dialog( "widget" ).width(), 10, 1, "minWidth" );
	element.remove();

	element = $( "<div></div>" ).dialog( { minWidth: 10 } );
		testHelper.drag( element, ".ui-resizable-w", 1000, 1000 );
		assert.close( element.dialog( "widget" ).width(), 10, 1, "minWidth" );
	element.remove();

	element = $( "<div></div>" ).dialog( { minWidth: 30 } ).dialog( "option", "minWidth", 30 );
		testHelper.drag( element, ".ui-resizable-w", 1000, 1000 );
		assert.close( element.dialog( "widget" ).width(), 30, 1, "minWidth" );
	element.remove();
} );

test( "position, default center on window", function( assert ) {
	expect( 2 );

	// Dialogs alter the window width and height in Firefox
	// so we collect that information before creating the dialog
	// Support: Firefox
	var winWidth = $( window ).width(),
		winHeight = $( window ).height(),
		element = $( "<div></div>" ).dialog(),
		dialog = element.dialog( "widget" ),
		offset = dialog.offset();
	assert.close( offset.left, Math.round( winWidth / 2 - dialog.outerWidth() / 2 ) + $( window ).scrollLeft(), 1, "dialog left position of center on window on initilization" );
	assert.close( offset.top, Math.round( winHeight / 2 - dialog.outerHeight() / 2 ) + $( window ).scrollTop(), 1, "dialog top position of center on window on initilization" );
	element.remove();
} );

test( "position, right bottom at right bottom via ui.position args", function( assert ) {
	expect( 2 );

	// Dialogs alter the window width and height in Firefox
	// so we collect that information before creating the dialog
	// Support: Firefox
	var winWidth = $( window ).width(),
		winHeight = $( window ).height(),
		element = $( "<div></div>" ).dialog( {
			position: {
				my: "right bottom",
				at: "right bottom"
			}
		} ),
		dialog = element.dialog( "widget" ),
		offset = dialog.offset();

	assert.close( offset.left, winWidth - dialog.outerWidth() + $( window ).scrollLeft(), 1, "dialog left position of right bottom at right bottom on initilization" );
	assert.close( offset.top, winHeight - dialog.outerHeight() + $( window ).scrollTop(), 1, "dialog top position of right bottom at right bottom on initilization" );
	element.remove();
} );

test( "position, at another element", function( assert ) {
	expect( 4 );
	var parent = $( "<div></div>" ).css( {
			position: "absolute",
			top: 400,
			left: 600,
			height: 10,
			width: 10
		} ).appendTo( "body" ),

		element = $( "<div></div>" ).dialog( {
			position: {
				my: "left top",
				at: "left top",
				of: parent,
				collision: "none"
			}
		} ),

		dialog = element.dialog( "widget" ),
		offset = dialog.offset();

	assert.close( offset.left, 600, 1, "dialog left position at another element on initilization" );
	assert.close( offset.top, 400, 1, "dialog top position at another element on initilization" );

	element.dialog( "option", "position", {
			my: "left top",
			at: "right bottom",
			of: parent,
			collision: "none"
	} );

	offset = dialog.offset();

	assert.close( offset.left, 610, 1, "dialog left position at another element via setting option" );
	assert.close( offset.top, 410, 1, "dialog top position at another element via setting option" );

	element.remove();
	parent.remove();
} );

test( "resizable", function() {
	expect( 4 );

	var element = $( "<div></div>" ).dialog();
		testHelper.shouldResize( element, 50, 50, "[default]" );
		element.dialog( "option", "resizable", false );
		testHelper.shouldResize( element, 0, 0, "disabled after init" );
	element.remove();

	element = $( "<div></div>" ).dialog( { resizable: false } );
		testHelper.shouldResize( element, 0, 0, "disabled in init options" );
		element.dialog( "option", "resizable", true );
		testHelper.shouldResize( element, 50, 50, "enabled after init" );
	element.remove();
} );

test( "title", function() {
	expect( 11 );

	function titleText() {
		return element.dialog( "widget" ).find( ".ui-dialog-title" ).html();
	}

	var element = $( "<div></div>" ).dialog();

		// some browsers return a non-breaking space and some return "&nbsp;"
		// so we generate a non-breaking space for comparison
		equal( titleText(), $( "<span>&#160;</span>" ).html(), "[default]" );
		equal( element.dialog( "option", "title" ), null, "option not changed" );
	element.remove();

	element = $( "<div title='foo'>" ).dialog();
		equal( titleText(), "foo", "title in element attribute" );
		equal( element.dialog( "option", "title" ), "foo", "option updated from attribute" );
	element.remove();

	element = $( "<div></div>" ).dialog( { title: "foo" } );
		equal( titleText(), "foo", "title in init options" );
		equal( element.dialog( "option", "title" ), "foo", "opiton set from options hash" );
	element.remove();

	element = $( "<div title='foo'>" ).dialog( { title: "bar" } );
		equal( titleText(), "bar", "title in init options should override title in element attribute" );
		equal( element.dialog( "option", "title" ), "bar", "opiton set from options hash" );
	element.remove();

	element = $( "<div></div>" ).dialog().dialog( "option", "title", "foo" );
		equal( titleText(), "foo", "title after init" );
	element.remove();

	// Make sure attroperties are properly ignored - #5742 - .attr() might return a DOMElement
	element = $( "<form><input name='title'></form>" ).dialog();

		// some browsers return a non-breaking space and some return "&nbsp;"
		// so we get the text to normalize to the actual non-breaking space
		equal( titleText(), $( "<span>&#160;</span>" ).html(), "[default]" );
		equal( element.dialog( "option", "title" ), null, "option not changed" );
	element.remove();
} );

test( "width", function( assert ) {
	expect( 3 );

	var element = $( "<div></div>" ).dialog();
		assert.close( element.dialog( "widget" ).width(), 300, 1, "default width" );
	element.remove();

	element = $( "<div></div>" ).dialog( { width: 437 } );
		assert.close( element.dialog( "widget" ).width(), 437, 1, "explicit width" );
		element.dialog( "option", "width", 438 );
		assert.close( element.dialog( "widget" ).width(), 438, 1, "explicit width after init" );
	element.remove();
} );

test( "#4826: setting resizable false toggles resizable on dialog", function() {
	expect( 6 );
	var i,
		element = $( "<div></div>" ).dialog( { resizable: false } );

	testHelper.shouldResize( element, 0, 0, "[default]" );
	for ( i = 0; i < 2; i++ ) {
		element.dialog( "close" ).dialog( "open" );
		testHelper.shouldResize( element, 0, 0, "initialized with resizable false toggle (" + ( i + 1 ) + ")" );
	}
	element.remove();

	element = $( "<div></div>" ).dialog( { resizable: true } );
	testHelper.shouldResize( element, 50, 50, "[default]" );
	for ( i = 0; i < 2; i++ ) {
		element.dialog( "close" ).dialog( "option", "resizable", false ).dialog( "open" );
		testHelper.shouldResize( element, 0, 0, "set option resizable false toggle (" + ( i + 1 ) + ")" );
	}
	element.remove();

} );

asyncTest( "#8051 - 'Explode' dialog animation causes crash in IE 6, 7 and 8", function() {
	expect( 1 );
	var element = $( "<div></div>" ).dialog( {
		show: "explode",
		focus: function() {
			ok( true, "dialog opened with animation" );
			element.remove();
			start();
		}
	} );
} );

asyncTest( "#4421 - Focus lost from dialog which uses show-effect", function() {
	expect( 1 );
	var element = $( "<div></div>" ).dialog( {
		show: "blind",
		focus: function() {
			equal( element.dialog( "widget" ).find( document.activeElement ).length, 1, "dialog maintains focus" );
			element.remove();
			start();
		}
	} );
} );

asyncTest( "Open followed by close during show effect", function() {
	expect( 1 );
	var element = $( "<div></div>" ).dialog( {
		show: "blind",
		close: function() {
			ok( true, "dialog closed properly during animation" );
			element.remove();
			start();
		}
	} );

	setTimeout( function() {
		element.dialog( "close" );
	}, 100 );
} );

} );
