/*
 * dialog_options.js
 */
(function($) {

module("dialog: options");

test( "appendTo", function() {
	expect( 8 );
	var detached = $( "<div>" ),
		element = $( "#dialog1" ).dialog();
	equal( element.dialog( "widget" ).parent()[0], document.body, "defaults to body" );
	element.dialog( "destroy" );

	element.dialog({
		appendTo: ".wrap"
	});
	equal( element.dialog( "widget" ).parent()[0], $( "#wrap1" )[0], "first found element" );
	equal( $( "#wrap2 .ui-dialog" ).length, 0, "only appends to one element" );
	element.dialog( "destroy" );

	element.dialog({
		appendTo: null
	});
	equal( element.dialog( "widget" ).parent()[0], document.body, "null" );
	element.dialog( "destroy" );

	element.dialog({ autoOpen: false }).dialog( "option", "appendTo", "#wrap1" ).dialog( "open" );
	equal( element.dialog( "widget" ).parent()[0], $( "#wrap1" )[0], "modified after init" );
	element.dialog( "destroy" );

	element.dialog({
		appendTo: detached
	});
	equal( element.dialog( "widget" ).parent()[0], detached[0], "detached jQuery object" );
	element.dialog( "destroy" );

	element.dialog({
		appendTo: detached[0]
	});
	equal( element.dialog( "widget" ).parent()[0], detached[0], "detached DOM element" );
	element.dialog( "destroy" );

	element.dialog({ autoOpen: false }).dialog( "option", "appendTo", detached );
	equal( element.dialog( "widget" ).parent()[0], detached[0], "detached DOM element via option()" );
	element.dialog( "destroy" );
});

test("autoOpen", function() {
	expect(2);

	var el = $("<div></div>").dialog({ autoOpen: false });
	ok( !el.dialog("widget").is(":visible"), ".dialog({ autoOpen: false })");
	el.remove();

	el = $("<div></div>").dialog({ autoOpen: true });
	ok( el.dialog("widget").is(":visible"), ".dialog({ autoOpen: true })");
	el.remove();
});

test("buttons", function() {
	expect(21);

	var btn, i, newButtons,
		buttons = {
			"Ok": function( ev ) {
				ok(true, "button click fires callback");
				equal(this, el[0], "context of callback");
				equal(ev.target, btn[0], "event target");
			},
			"Cancel": function( ev ) {
				ok(true, "button click fires callback");
				equal(this, el[0], "context of callback");
				equal(ev.target, btn[1], "event target");
			}
		},
		el = $("<div></div>").dialog({ buttons: buttons });

	btn = el.dialog( "widget" ).find( ".ui-dialog-buttonpane button" );
	equal(btn.length, 2, "number of buttons");

	i = 0;
	$.each(buttons, function( key ) {
		equal(btn.eq(i).text(), key, "text of button " + (i+1));
		i++;
	});

	ok(btn.parent().hasClass("ui-dialog-buttonset"), "buttons in container");
	ok(el.parent().hasClass("ui-dialog-buttons"), "dialog wrapper adds class about having buttons");

	btn.trigger("click");

	newButtons = {
		"Close": function( ev ) {
			ok(true, "button click fires callback");
			equal(this, el[0], "context of callback");
			equal(ev.target, btn[0], "event target");
		}
	};

	deepEqual(el.dialog("option", "buttons"), buttons, ".dialog('option', 'buttons') getter");
	el.dialog("option", "buttons", newButtons);
	deepEqual(el.dialog("option", "buttons"), newButtons, ".dialog('option', 'buttons', ...) setter");

	btn = el.dialog( "widget" ).find( ".ui-dialog-buttonpane button" );
	equal(btn.length, 1, "number of buttons after setter");
	btn.trigger("click");

	i = 0;
	$.each(newButtons, function( key ) {
		equal(btn.eq(i).text(), key, "text of button " + (i+1));
		i += 1;
	});

	el.dialog("option", "buttons", null);
	btn = el.dialog( "widget" ).find( ".ui-dialog-buttonpane button" );
	equal(btn.length, 0, "all buttons have been removed");
	equal(el.find(".ui-dialog-buttonset").length, 0, "buttonset has been removed");
	equal(el.parent().hasClass("ui-dialog-buttons"), false, "dialog wrapper removes class about having buttons");

	el.remove();
});

test("buttons - advanced", function() {
	expect( 7 );

	var buttons,
		el = $("<div></div>").dialog({
			buttons: [
				{
					text: "a button",
					"class": "additional-class",
					id: "my-button-id",
					click: function() {
						equal(this, el[0], "correct context");
					},
					icons: {
						primary: "ui-icon-cancel"
					},
					showText: false
				}
			]
		});

	buttons = el.dialog( "widget" ).find( ".ui-dialog-buttonpane button" );
	equal(buttons.length, 1, "correct number of buttons");
	equal(buttons.attr("id"), "my-button-id", "correct id");
	equal(buttons.text(), "a button", "correct label");
	ok(buttons.hasClass("additional-class"), "additional classes added");
	deepEqual( buttons.button("option", "icons"), { primary: "ui-icon-cancel", secondary: null } );
	equal( buttons.button( "option", "text" ), false );
	buttons.click();

	el.remove();
});

test("closeOnEscape", function() {
	expect( 6 );
	var el = $("<div></div>").dialog({ closeOnEscape: false });
	ok(true, "closeOnEscape: false");
	ok(el.dialog("widget").is(":visible") && !el.dialog("widget").is(":hidden"), "dialog is open before ESC");
	el.simulate("keydown", { keyCode: $.ui.keyCode.ESCAPE })
		.simulate("keypress", { keyCode: $.ui.keyCode.ESCAPE })
		.simulate("keyup", { keyCode: $.ui.keyCode.ESCAPE });
	ok(el.dialog("widget").is(":visible") && !el.dialog("widget").is(":hidden"), "dialog is open after ESC");

	el.remove();

	el = $("<div></div>").dialog({ closeOnEscape: true });
	ok(true, "closeOnEscape: true");
	ok(el.dialog("widget").is(":visible") && !el.dialog("widget").is(":hidden"), "dialog is open before ESC");
	el.simulate("keydown", { keyCode: $.ui.keyCode.ESCAPE })
		.simulate("keypress", { keyCode: $.ui.keyCode.ESCAPE })
		.simulate("keyup", { keyCode: $.ui.keyCode.ESCAPE });
	ok(el.dialog("widget").is(":hidden") && !el.dialog("widget").is(":visible"), "dialog is closed after ESC");
});

test("closeText", function() {
	expect(3);

	var el = $("<div></div>").dialog();
		equal(el.dialog("widget").find(".ui-dialog-titlebar-close span").text(), "close",
			"default close text");
	el.remove();

	el = $("<div></div>").dialog({ closeText: "foo" });
		equal(el.dialog("widget").find(".ui-dialog-titlebar-close span").text(), "foo",
			"closeText on init");
	el.remove();

	el = $("<div></div>").dialog().dialog("option", "closeText", "bar");
		equal(el.dialog("widget").find(".ui-dialog-titlebar-close span").text(), "bar",
			"closeText via option method");
	el.remove();
});

test("dialogClass", function() {
	expect( 6 );

	var el = $("<div></div>").dialog();
		equal(el.dialog("widget").is(".foo"), false, "dialogClass not specified. foo class added");
	el.remove();

	el = $("<div></div>").dialog({ dialogClass: "foo" });
		equal(el.dialog("widget").is(".foo"), true, "dialogClass in init. foo class added");
	el.dialog( "option", "dialogClass", "foobar" );
		equal( el.dialog("widget").is(".foo"), false, "dialogClass changed, previous one was removed" );
		equal( el.dialog("widget").is(".foobar"), true, "dialogClass changed, new one was added" );
	el.remove();

	el = $("<div></div>").dialog({ dialogClass: "foo bar" });
		equal(el.dialog("widget").is(".foo"), true, "dialogClass in init, two classes. foo class added");
		equal(el.dialog("widget").is(".bar"), true, "dialogClass in init, two classes. bar class added");
	el.remove();
});

test("draggable", function() {
	expect(4);

	var el = $("<div></div>").dialog({ draggable: false });

		TestHelpers.dialog.testDrag(el, 50, -50, 0, 0);
		el.dialog("option", "draggable", true);
		TestHelpers.dialog.testDrag(el, 50, -50, 50, -50);
	el.remove();

	el = $("<div></div>").dialog({ draggable: true });
		TestHelpers.dialog.testDrag(el, 50, -50, 50, -50);
		el.dialog("option", "draggable", false);
		TestHelpers.dialog.testDrag(el, 50, -50, 0, 0);
	el.remove();
});

test("height", function() {
	expect(4);

	var el = $("<div></div>").dialog();
		equal(el.dialog("widget").outerHeight(), 150, "default height");
	el.remove();

	el = $("<div></div>").dialog({ height: 237 });
		equal(el.dialog("widget").outerHeight(), 237, "explicit height");
	el.remove();

	el = $("<div></div>").dialog();
		el.dialog("option", "height", 238);
		equal(el.dialog("widget").outerHeight(), 238, "explicit height set after init");
	el.remove();

	el = $("<div></div>").css("padding", "20px")
		.dialog({ height: 240 });
		equal(el.dialog("widget").outerHeight(), 240, "explicit height with padding");
	el.remove();
});

asyncTest( "hide, #5860 - don't leave effects wrapper behind", function() {
	expect( 1 );
	$( "#dialog1" ).dialog({ hide: "clip" }).dialog( "close" ).dialog( "destroy" );
	setTimeout(function() {
		equal( $( ".ui-effects-wrapper" ).length, 0 );
		start();
	}, 500);
});

test("maxHeight", function() {
	expect(3);

	var el = $("<div></div>").dialog({ maxHeight: 200 });
		TestHelpers.dialog.drag(el, ".ui-resizable-s", 1000, 1000);
		closeEnough(el.dialog("widget").height(), 200, 1, "maxHeight");
	el.remove();

	el = $("<div></div>").dialog({ maxHeight: 200 });
		TestHelpers.dialog.drag(el, ".ui-resizable-n", -1000, -1000);
		closeEnough(el.dialog("widget").height(), 200, 1, "maxHeight");
	el.remove();

	el = $("<div></div>").dialog({ maxHeight: 200 }).dialog("option", "maxHeight", 300);
		TestHelpers.dialog.drag(el, ".ui-resizable-s", 1000, 1000);
		closeEnough(el.dialog("widget").height(), 300, 1, "maxHeight");
	el.remove();
});

test("maxWidth", function() {
	expect(3);

	var el = $("<div></div>").dialog({ maxWidth: 200 });
		TestHelpers.dialog.drag(el, ".ui-resizable-e", 1000, 1000);
		closeEnough(el.dialog("widget").width(), 200, 1, "maxWidth");
	el.remove();

	el = $("<div></div>").dialog({ maxWidth: 200 });
		TestHelpers.dialog.drag(el, ".ui-resizable-w", -1000, -1000);
		closeEnough(el.dialog("widget").width(), 200, 1, "maxWidth");
	el.remove();

	el = $("<div></div>").dialog({ maxWidth: 200 }).dialog("option", "maxWidth", 300);
		TestHelpers.dialog.drag(el, ".ui-resizable-w", -1000, -1000);
		closeEnough(el.dialog("widget").width(), 300, 1, "maxWidth");
	el.remove();
});

test("minHeight", function() {
	expect(3);

	var el = $("<div></div>").dialog({ minHeight: 10 });
		TestHelpers.dialog.drag(el, ".ui-resizable-s", -1000, -1000);
		closeEnough(el.dialog("widget").height(), 10, 1, "minHeight");
	el.remove();

	el = $("<div></div>").dialog({ minHeight: 10 });
		TestHelpers.dialog.drag(el, ".ui-resizable-n", 1000, 1000);
		closeEnough(el.dialog("widget").height(), 10, 1, "minHeight");
	el.remove();

	el = $("<div></div>").dialog({ minHeight: 10 }).dialog("option", "minHeight", 30);
		TestHelpers.dialog.drag(el, ".ui-resizable-n", 1000, 1000);
		closeEnough(el.dialog("widget").height(), 30, 1, "minHeight");
	el.remove();
});

test("minWidth", function() {
	expect(3);

	var el = $("<div></div>").dialog({ minWidth: 10 });
		TestHelpers.dialog.drag(el, ".ui-resizable-e", -1000, -1000);
		closeEnough(el.dialog("widget").width(), 10, 1, "minWidth");
	el.remove();

	el = $("<div></div>").dialog({ minWidth: 10 });
		TestHelpers.dialog.drag(el, ".ui-resizable-w", 1000, 1000);
		closeEnough(el.dialog("widget").width(), 10, 1, "minWidth");
	el.remove();

	el = $("<div></div>").dialog({ minWidth: 30 }).dialog("option", "minWidth", 30);
		TestHelpers.dialog.drag(el, ".ui-resizable-w", 1000, 1000);
		closeEnough(el.dialog("widget").width(), 30, 1, "minWidth");
	el.remove();
});

test( "position, default center on window", function() {
	expect( 2 );

	// dialogs alter the window width and height in FF and IE7
	// so we collect that information before creating the dialog
	// Support: FF, IE7
	var winWidth = $( window ).width(),
		winHeight = $( window ).height(),
		el = $("<div></div>").dialog(),
		dialog = el.dialog("widget"),
		offset = dialog.offset();
	closeEnough( offset.left, Math.round( winWidth / 2 - dialog.outerWidth() / 2 ) + $( window ).scrollLeft(), 1, "dialog left position of center on window on initilization" );
	closeEnough( offset.top, Math.round( winHeight / 2 - dialog.outerHeight() / 2 ) + $( window ).scrollTop(), 1, "dialog top position of center on window on initilization" );
	el.remove();
});

test( "position, right bottom at right bottom via ui.position args", function() {
	expect( 2 );

	// dialogs alter the window width and height in FF and IE7
	// so we collect that information before creating the dialog
	// Support: FF, IE7
	var winWidth = $( window ).width(),
		winHeight = $( window ).height(),
		el = $("<div></div>").dialog({
			position: {
				my: "right bottom",
				at: "right bottom"
			}
		}),
		dialog = el.dialog("widget"),
		offset = dialog.offset();

	closeEnough( offset.left, winWidth - dialog.outerWidth() + $( window ).scrollLeft(), 1, "dialog left position of right bottom at right bottom on initilization" );
	closeEnough( offset.top, winHeight - dialog.outerHeight() + $( window ).scrollTop(), 1, "dialog top position of right bottom at right bottom on initilization" );
	el.remove();
});

test( "position, at another element", function() {
	expect( 4 );
	var parent = $("<div></div>").css({
			position: "absolute",
			top: 400,
			left: 600,
			height: 10,
			width: 10
		}).appendTo("body"),

		el = $("<div></div>").dialog({
			position: {
				my: "left top",
				at: "left top",
				of: parent,
				collision: "none"
			}
		}),

		dialog = el.dialog("widget"),
		offset = dialog.offset();

	closeEnough( offset.left, 600, 1, "dialog left position at another element on initilization" );
	closeEnough( offset.top, 400, 1, "dialog top position at another element on initilization" );

	el.dialog("option", "position", {
			my: "left top",
			at: "right bottom",
			of: parent,
			collision: "none"
	});

	offset = dialog.offset();

	closeEnough( offset.left, 610, 1, "dialog left position at another element via setting option" );
	closeEnough( offset.top, 410, 1, "dialog top position at another element via setting option" );

	el.remove();
	parent.remove();
});

test("resizable", function() {
	expect(4);

	var el = $("<div></div>").dialog();
		TestHelpers.dialog.shouldResize(el, 50, 50, "[default]");
		el.dialog("option", "resizable", false);
		TestHelpers.dialog.shouldResize(el, 0, 0, "disabled after init");
	el.remove();

	el = $("<div></div>").dialog({ resizable: false });
		TestHelpers.dialog.shouldResize(el, 0, 0, "disabled in init options");
		el.dialog("option", "resizable", true);
		TestHelpers.dialog.shouldResize(el, 50, 50, "enabled after init");
	el.remove();
});

test( "title", function() {
	expect( 11 );

	function titleText() {
		return el.dialog("widget").find( ".ui-dialog-title" ).html();
	}

	var el = $( "<div></div>" ).dialog();
		// some browsers return a non-breaking space and some return "&nbsp;"
		// so we generate a non-breaking space for comparison
		equal( titleText(), $( "<span>&#160;</span>" ).html(), "[default]" );
		equal( el.dialog( "option", "title" ), null, "option not changed" );
	el.remove();

	el = $( "<div title='foo'>" ).dialog();
		equal( titleText(), "foo", "title in element attribute" );
		equal( el.dialog( "option", "title"), "foo", "option updated from attribute" );
	el.remove();

	el = $( "<div></div>" ).dialog({ title: "foo" });
		equal( titleText(), "foo", "title in init options" );
		equal( el.dialog("option", "title"), "foo", "opiton set from options hash" );
	el.remove();

	el = $( "<div title='foo'>" ).dialog({ title: "bar" });
		equal( titleText(), "bar", "title in init options should override title in element attribute" );
		equal( el.dialog("option", "title"), "bar", "opiton set from options hash" );
	el.remove();

	el = $( "<div></div>" ).dialog().dialog( "option", "title", "foo" );
		equal( titleText(), "foo", "title after init" );
	el.remove();

	// make sure attroperties are properly ignored - #5742 - .attr() might return a DOMElement
	el = $( "<form><input name='title'></form>" ).dialog();
		// some browsers return a non-breaking space and some return "&nbsp;"
		// so we get the text to normalize to the actual non-breaking space
		equal( titleText(), $( "<span>&#160;</span>" ).html(), "[default]" );
		equal( el.dialog( "option", "title" ), null, "option not changed" );
	el.remove();
});

test("width", function() {
	expect(3);

	var el = $("<div></div>").dialog();
		closeEnough(el.dialog("widget").width(), 300, 1, "default width");
	el.remove();

	el = $("<div></div>").dialog({width: 437 });
		closeEnough(el.dialog("widget").width(), 437, 1, "explicit width");
		el.dialog("option", "width", 438);
		closeEnough(el.dialog("widget").width(), 438, 1, "explicit width after init");
	el.remove();
});

test("#4826: setting resizable false toggles resizable on dialog", function() {
	expect(6);
	var i,
		el = $("<div></div>").dialog({ resizable: false });

	TestHelpers.dialog.shouldResize(el, 0, 0, "[default]");
	for (i=0; i<2; i++) {
		el.dialog("close").dialog("open");
		TestHelpers.dialog.shouldResize(el, 0, 0, "initialized with resizable false toggle ("+ (i+1) +")");
	}
	el.remove();

	el = $("<div></div>").dialog({ resizable: true });
	TestHelpers.dialog.shouldResize(el, 50, 50, "[default]");
	for (i=0; i<2; i++) {
		el.dialog("close").dialog("option", "resizable", false).dialog("open");
		TestHelpers.dialog.shouldResize(el, 0, 0, "set option resizable false toggle ("+ (i+1) +")");
	}
	el.remove();

});

})(jQuery);
