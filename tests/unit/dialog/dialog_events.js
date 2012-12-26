/*
 * dialog_events.js
 */
(function($) {

module("dialog: events");

test("open", function() {
	expect(13);

	var el = $("<div></div>");
	el.dialog({
		open: function(ev, ui) {
			ok(el.data("ui-dialog")._isOpen, "interal _isOpen flag is set");
			ok(true, "autoOpen: true fires open callback");
			equal(this, el[0], "context of callback");
			equal(ev.type, "dialogopen", "event type in callback");
			deepEqual(ui, {}, "ui hash in callback");
		}
	});
	el.remove();

	el = $("<div></div>");
	el.dialog({
		autoOpen: false,
		open: function(ev, ui) {
			ok(true, ".dialog('open') fires open callback");
			equal(this, el[0], "context of callback");
			equal(ev.type, "dialogopen", "event type in callback");
			deepEqual(ui, {}, "ui hash in callback");
		}
	}).bind("dialogopen", function(ev, ui) {
		ok(el.data("ui-dialog")._isOpen, "interal _isOpen flag is set");
		ok(true, "dialog('open') fires open event");
		equal(this, el[0], "context of event");
		deepEqual(ui, {}, "ui hash in event");
	});
	el.dialog("open");
	el.remove();
});


test( "focus", function() {
	expect( 5 );
	var el, other;
	el = $("#dialog1").dialog({
		autoOpen: false
	});
	other = $("#dialog2").dialog({
		autoOpen: false
	});

	el.one( "dialogopen", function() {
		ok( true, "open, just once" );
	});
	el.one( "dialogfocus", function() {
		ok( true, "focus on open" );
	});
	other.dialog( "open" );

	el.one( "dialogfocus", function() {
		ok( true, "when opening and already open and wasn't on top" );
	});
	other.dialog( "open" );
	el.dialog( "open" );

	el.one( "dialogfocus", function() {
		ok( true, "when calling moveToTop and wasn't on top" );
	});
	other.dialog( "moveToTop" );
	el.dialog( "moveToTop" );

	el.bind( "dialogfocus", function() {
		ok( true, "when mousedown anywhere on the dialog and it wasn't on top" );
	});
	other.dialog( "moveToTop" );
	el.trigger( "mousedown" );

	// triggers just once when already on top
	el.dialog( "open" );
	el.dialog( "moveToTop" );
	el.trigger( "mousedown" );

	el.add( other ).remove();
});

test("dragStart", function() {
	expect(9);

	var handle,
		el = $("<div></div>").dialog({
			dragStart: function(ev, ui) {
				ok(true, "dragging fires dragStart callback");
				equal(this, el[0], "context of callback");
				equal(ev.type, "dialogdragstart", "event type in callback");
				ok(ui.position !== undefined, "ui.position in callback");
				ok(ui.offset !== undefined, "ui.offset in callback");
			}
		}).bind("dialogdragstart", function(ev, ui) {
			ok(true, "dragging fires dialogdragstart event");
			equal(this, el[0], "context of event");
			ok(ui.position !== undefined, "ui.position in callback");
			ok(ui.offset !== undefined, "ui.offset in callback");
		});

	handle = $(".ui-dialog-titlebar", el.dialog("widget"));
	TestHelpers.dialog.drag(el, handle, 50, 50);
	el.remove();
});

test("drag", function() {
	expect(9);
	var handle,
		hasDragged = false,
		el = $("<div></div>").dialog({
			drag: function(ev, ui) {
				if (!hasDragged) {
					ok(true, "dragging fires drag callback");
					equal(this, el[0], "context of callback");
					equal(ev.type, "dialogdrag", "event type in callback");
					ok(ui.position !== undefined, "ui.position in callback");
					ok(ui.offset !== undefined, "ui.offset in callback");

					hasDragged = true;
				}
			}
		}).one("dialogdrag", function(ev, ui) {
			ok(true, "dragging fires dialogdrag event");
			equal(this, el[0], "context of event");
			ok(ui.position !== undefined, "ui.position in callback");
			ok(ui.offset !== undefined, "ui.offset in callback");
		});

	handle = $(".ui-dialog-titlebar", el.dialog("widget"));
	TestHelpers.dialog.drag(el, handle, 50, 50);
	el.remove();
});

test("dragStop", function() {
	expect(9);

	var handle,
		el = $("<div></div>").dialog({
			dragStop: function(ev, ui) {
				ok(true, "dragging fires dragStop callback");
				equal(this, el[0], "context of callback");
				equal(ev.type, "dialogdragstop", "event type in callback");
				ok(ui.position !== undefined, "ui.position in callback");
				ok(ui.offset !== undefined, "ui.offset in callback");
			}
		}).bind("dialogdragstop", function(ev, ui) {
			ok(true, "dragging fires dialogdragstop event");
			equal(this, el[0], "context of event");
			ok(ui.position !== undefined, "ui.position in callback");
			ok(ui.offset !== undefined, "ui.offset in callback");
		});

	handle = $(".ui-dialog-titlebar", el.dialog("widget"));
	TestHelpers.dialog.drag(el, handle, 50, 50);
	el.remove();
});

test("resizeStart", function() {
	expect(13);

	var handle,
		el = $("<div></div>").dialog({
			resizeStart: function(ev, ui) {
				ok(true, "resizing fires resizeStart callback");
				equal(this, el[0], "context of callback");
				equal(ev.type, "dialogresizestart", "event type in callback");
				ok(ui.originalPosition !== undefined, "ui.originalPosition in callback");
				ok(ui.originalSize !== undefined, "ui.originalSize in callback");
				ok(ui.position !== undefined, "ui.position in callback");
				ok(ui.size !== undefined, "ui.size in callback");
			}
		}).bind("dialogresizestart", function(ev, ui) {
			ok(true, "resizing fires dialogresizestart event");
			equal(this, el[0], "context of event");
			ok(ui.originalPosition !== undefined, "ui.originalPosition in callback");
			ok(ui.originalSize !== undefined, "ui.originalSize in callback");
			ok(ui.position !== undefined, "ui.position in callback");
			ok(ui.size !== undefined, "ui.size in callback");
		});

	handle = $(".ui-resizable-se", el.dialog("widget"));
	TestHelpers.dialog.drag(el, handle, 50, 50);
	el.remove();
});

test("resize", function() {
	expect(13);
	var handle,
		hasResized = false,
		el = $("<div></div>").dialog({
			resize: function(ev, ui) {
				if (!hasResized) {
					ok(true, "resizing fires resize callback");
					equal(this, el[0], "context of callback");
					equal(ev.type, "dialogresize", "event type in callback");
					ok(ui.originalPosition !== undefined, "ui.originalPosition in callback");
					ok(ui.originalSize !== undefined, "ui.originalSize in callback");
					ok(ui.position !== undefined, "ui.position in callback");
					ok(ui.size !== undefined, "ui.size in callback");

					hasResized = true;
				}
			}
		}).one("dialogresize", function(ev, ui) {
			ok(true, "resizing fires dialogresize event");
			equal(this, el[0], "context of event");
			ok(ui.originalPosition !== undefined, "ui.originalPosition in callback");
			ok(ui.originalSize !== undefined, "ui.originalSize in callback");
			ok(ui.position !== undefined, "ui.position in callback");
			ok(ui.size !== undefined, "ui.size in callback");
		});

	handle = $(".ui-resizable-se", el.dialog("widget"));
	TestHelpers.dialog.drag(el, handle, 50, 50);
	el.remove();
});

test("resizeStop", function() {
	expect(13);

	var handle,
		el = $("<div></div>").dialog({
			resizeStop: function(ev, ui) {
				ok(true, "resizing fires resizeStop callback");
				equal(this, el[0], "context of callback");
				equal(ev.type, "dialogresizestop", "event type in callback");
				ok(ui.originalPosition !== undefined, "ui.originalPosition in callback");
				ok(ui.originalSize !== undefined, "ui.originalSize in callback");
				ok(ui.position !== undefined, "ui.position in callback");
				ok(ui.size !== undefined, "ui.size in callback");
			}
		}).bind("dialogresizestop", function(ev, ui) {
			ok(true, "resizing fires dialogresizestop event");
			equal(this, el[0], "context of event");
				ok(ui.originalPosition !== undefined, "ui.originalPosition in callback");
				ok(ui.originalSize !== undefined, "ui.originalSize in callback");
				ok(ui.position !== undefined, "ui.position in callback");
				ok(ui.size !== undefined, "ui.size in callback");
		});

	handle = $(".ui-resizable-se", el.dialog("widget"));
	TestHelpers.dialog.drag(el, handle, 50, 50);
	el.remove();
});

asyncTest("close", function() {
	expect(14);

	var el = $("<div></div>").dialog({
		close: function(ev, ui) {
			ok(true, ".dialog('close') fires close callback");
			equal(this, el[0], "context of callback");
			equal(ev.type, "dialogclose", "event type in callback");
			deepEqual(ui, {}, "ui hash in callback");
		}
	}).bind("dialogclose", function(ev, ui) {
		ok(true, ".dialog('close') fires dialogclose event");
		equal(this, el[0], "context of event");
		deepEqual(ui, {}, "ui hash in event");
	});
	el.dialog("close");
	el.remove();

	// Close event with an effect
	el = $("<div></div>").dialog({
		hide: 10,
		close: function(ev, ui) {
			ok(true, ".dialog('close') fires close callback");
			equal(this, el[0], "context of callback");
			equal(ev.type, "dialogclose", "event type in callback");
			deepEqual(ui, {}, "ui hash in callback");
			start();
		}
	}).bind("dialogclose", function(ev, ui) {
		ok(true, ".dialog('close') fires dialogclose event");
		equal(this, el[0], "context of event");
		deepEqual(ui, {}, "ui hash in event");
	});
	el.dialog("close");
});

test("beforeClose", function() {
	expect(14);

	var el = $("<div></div>").dialog({
		beforeClose: function(ev, ui) {
			ok(true, ".dialog('close') fires beforeClose callback");
			equal(this, el[0], "context of callback");
			equal(ev.type, "dialogbeforeclose", "event type in callback");
			deepEqual(ui, {}, "ui hash in callback");
			return false;
		}
	});

	el.dialog("close");
	ok( el.dialog("widget").is(":visible"), "beforeClose callback should prevent dialog from closing");
	el.remove();

	el = $("<div></div>").dialog();
	el.dialog("option", "beforeClose", function(ev, ui) {
		ok(true, ".dialog('close') fires beforeClose callback");
		equal(this, el[0], "context of callback");
		equal(ev.type, "dialogbeforeclose", "event type in callback");
		deepEqual(ui, {}, "ui hash in callback");
		return false;
	});
	el.dialog("close");

	ok( el.dialog("widget").is(":visible"), "beforeClose callback should prevent dialog from closing");
	el.remove();

	el = $("<div></div>").dialog().bind("dialogbeforeclose", function(ev, ui) {
		ok(true, ".dialog('close') triggers dialogbeforeclose event");
		equal(this, el[0], "context of event");
		deepEqual(ui, {}, "ui hash in event");
		return false;
	});
	el.dialog("close");
	ok( el.dialog("widget").is(":visible"), "dialogbeforeclose event should prevent dialog from closing");
	el.remove();
});

// #8789 and #8838
asyncTest("ensure dialog's container doesn't scroll on resize and focus", function() {
	expect(2);

	var el = $("#dialog1").dialog(),
		initialScroll = $(window).scrollTop();
	el.dialog("option", "height", 600);
	equal($(window).scrollTop(), initialScroll, "scroll hasn't moved after height change");
	setTimeout( function(){
		$(".ui-dialog-titlebar-close").simulate("mousedown");
		equal($(window).scrollTop(), initialScroll, "scroll hasn't moved after focus moved to dialog");
		el.dialog("destroy");
		start();
	}, 500);
});

test("#5184: isOpen in dialogclose event is true", function() {
	expect( 3 );

	var el = $( "<div></div>" ).dialog({
			close: function() {
				ok( !el.dialog("isOpen"), "dialog is not open during close" );
			}
		});
	ok( el.dialog("isOpen"), "dialog is open after init" );
	el.dialog( "close" );
	ok( !el.dialog("isOpen"), "dialog is not open after close" );
	el.remove();
});

})(jQuery);
