/*
 * dialog_events.js
 */
(function($) {

module("dialog: events");

test("open", function() {
	expect(13);

	el = $("<div></div>");
	el.dialog({
		open: function(ev, ui) {
			ok(el.data("dialog")._isOpen, "interal _isOpen flag is set");
			ok(true, 'autoOpen: true fires open callback');
			equals(this, el[0], "context of callback");
			equals(ev.type, 'dialogopen', 'event type in callback');
			same(ui, {}, 'ui hash in callback');
		}
	});
	el.remove();

	el = $("<div></div>");
	el.dialog({
		autoOpen: false,
		open: function(ev, ui) {
			ok(true, '.dialog("open") fires open callback');
			equals(this, el[0], "context of callback");
			equals(ev.type, 'dialogopen', 'event type in callback');
			same(ui, {}, 'ui hash in callback');
		}
	}).bind('dialogopen', function(ev, ui) {
		ok(el.data("dialog")._isOpen, "interal _isOpen flag is set");
		ok(true, 'dialog("open") fires open event');
		equals(this, el[0], 'context of event');
		same(ui, {}, 'ui hash in event');
	});
	el.dialog("open");
	el.remove();
});

test("dragStart", function() {
	expect(9);

	el = $('<div></div>').dialog({
		dragStart: function(ev, ui) {
			ok(true, 'dragging fires dragStart callback');
			equals(this, el[0], "context of callback");
			equals(ev.type, 'dialogdragstart', 'event type in callback');
			ok(ui.position !== undefined, "ui.position in callback");
			ok(ui.offset !== undefined, "ui.offset in callback");
		}
	}).bind('dialogdragstart', function(ev, ui) {
		ok(true, 'dragging fires dialogdragstart event');
		equals(this, el[0], 'context of event');
		ok(ui.position !== undefined, "ui.position in callback");
		ok(ui.offset !== undefined, "ui.offset in callback");
	});
	var handle = $(".ui-dialog-titlebar", dlg());
	drag(handle, 50, 50);
	el.remove();
});

test("drag", function() {
	expect(9);
	var hasDragged = false;
	
	el = $('<div></div>').dialog({
		drag: function(ev, ui) {
			if (!hasDragged) {
				ok(true, 'dragging fires drag callback');
				equals(this, el[0], "context of callback");
				equals(ev.type, 'dialogdrag', 'event type in callback');
				ok(ui.position !== undefined, "ui.position in callback");
				ok(ui.offset !== undefined, "ui.offset in callback");
				
				hasDragged = true;
			}
		}
	}).one('dialogdrag', function(ev, ui) {
		ok(true, 'dragging fires dialogdrag event');
		equals(this, el[0], 'context of event');
		ok(ui.position !== undefined, "ui.position in callback");
		ok(ui.offset !== undefined, "ui.offset in callback");
	});
	var handle = $(".ui-dialog-titlebar", dlg());
	drag(handle, 50, 50);
	el.remove();
});

test("dragStop", function() {
	expect(9);

	el = $('<div></div>').dialog({
		dragStop: function(ev, ui) {
			ok(true, 'dragging fires dragStop callback');
			equals(this, el[0], "context of callback");
			equals(ev.type, 'dialogdragstop', 'event type in callback');
			ok(ui.position !== undefined, "ui.position in callback");
			ok(ui.offset !== undefined, "ui.offset in callback");
		}
	}).bind('dialogdragstop', function(ev, ui) {
		ok(true, 'dragging fires dialogdragstop event');
		equals(this, el[0], 'context of event');
		ok(ui.position !== undefined, "ui.position in callback");
		ok(ui.offset !== undefined, "ui.offset in callback");
	});
	var handle = $(".ui-dialog-titlebar", dlg());
	drag(handle, 50, 50);
	el.remove();
});

test("resizeStart", function() {
	expect(13);

	el = $('<div></div>').dialog({
		resizeStart: function(ev, ui) {
			ok(true, 'resizing fires resizeStart callback');
			equals(this, el[0], "context of callback");
			equals(ev.type, 'dialogresizestart', 'event type in callback');
			ok(ui.originalPosition !== undefined, "ui.originalPosition in callback");
			ok(ui.originalSize !== undefined, "ui.originalSize in callback");
			ok(ui.position !== undefined, "ui.position in callback");
			ok(ui.size !== undefined, "ui.size in callback");
		}
	}).bind('dialogresizestart', function(ev, ui) {
		ok(true, 'resizing fires dialogresizestart event');
		equals(this, el[0], 'context of event');
		ok(ui.originalPosition !== undefined, "ui.originalPosition in callback");
		ok(ui.originalSize !== undefined, "ui.originalSize in callback");
		ok(ui.position !== undefined, "ui.position in callback");
		ok(ui.size !== undefined, "ui.size in callback");
	});
	var handle = $(".ui-resizable-se", dlg());
	drag(handle, 50, 50);
	el.remove();
});

test("resize", function() {
	expect(13);
	var hasResized = false;

	el = $('<div></div>').dialog({
		resize: function(ev, ui) {
			if (!hasResized) {
				ok(true, 'resizing fires resize callback');
				equals(this, el[0], "context of callback");
				equals(ev.type, 'dialogresize', 'event type in callback');
				ok(ui.originalPosition !== undefined, "ui.originalPosition in callback");
				ok(ui.originalSize !== undefined, "ui.originalSize in callback");
				ok(ui.position !== undefined, "ui.position in callback");
				ok(ui.size !== undefined, "ui.size in callback");
				
				hasResized = true;
			}
		}
	}).one('dialogresize', function(ev, ui) {
		ok(true, 'resizing fires dialogresize event');
		equals(this, el[0], 'context of event');
		ok(ui.originalPosition !== undefined, "ui.originalPosition in callback");
		ok(ui.originalSize !== undefined, "ui.originalSize in callback");
		ok(ui.position !== undefined, "ui.position in callback");
		ok(ui.size !== undefined, "ui.size in callback");
	});
	var handle = $(".ui-resizable-se", dlg());
	drag(handle, 50, 50);
	el.remove();
});

test("resizeStop", function() {
	expect(13);

	el = $('<div></div>').dialog({
		resizeStop: function(ev, ui) {
			ok(true, 'resizing fires resizeStop callback');
			equals(this, el[0], "context of callback");
			equals(ev.type, 'dialogresizestop', 'event type in callback');
			ok(ui.originalPosition !== undefined, "ui.originalPosition in callback");
			ok(ui.originalSize !== undefined, "ui.originalSize in callback");
			ok(ui.position !== undefined, "ui.position in callback");
			ok(ui.size !== undefined, "ui.size in callback");
		}
	}).bind('dialogresizestop', function(ev, ui) {
		ok(true, 'resizing fires dialogresizestop event');
		equals(this, el[0], 'context of event');
			ok(ui.originalPosition !== undefined, "ui.originalPosition in callback");
			ok(ui.originalSize !== undefined, "ui.originalSize in callback");
			ok(ui.position !== undefined, "ui.position in callback");
			ok(ui.size !== undefined, "ui.size in callback");
	});
	var handle = $(".ui-resizable-se", dlg());
	drag(handle, 50, 50);
	el.remove();
});

test("close", function() {
	expect(7);

	el = $('<div></div>').dialog({
		close: function(ev, ui) {
			ok(true, '.dialog("close") fires close callback');
			equals(this, el[0], "context of callback");
			equals(ev.type, 'dialogclose', 'event type in callback');
			same(ui, {}, 'ui hash in callback');
		}
	}).bind('dialogclose', function(ev, ui) {
		ok(true, '.dialog("close") fires dialogclose event');
		equals(this, el[0], 'context of event');
		same(ui, {}, 'ui hash in event');
	});
	el.dialog('close');
	el.remove();
});

test("beforeClose", function() {
	expect(14);

	el = $('<div></div>').dialog({
		beforeClose: function(ev, ui) {
			ok(true, '.dialog("close") fires beforeClose callback');
			equals(this, el[0], "context of callback");
			equals(ev.type, 'dialogbeforeclose', 'event type in callback');
			same(ui, {}, 'ui hash in callback');
			return false;
		}
	});
	el.dialog('close');
	isOpen('beforeClose callback should prevent dialog from closing');
	el.remove();

	el = $('<div></div>').dialog();
	el.dialog('option', 'beforeClose', function(ev, ui) {
		ok(true, '.dialog("close") fires beforeClose callback');
		equals(this, el[0], "context of callback");
		equals(ev.type, 'dialogbeforeclose', 'event type in callback');
		same(ui, {}, 'ui hash in callback');
		return false;
	});
	el.dialog('close');
	isOpen('beforeClose callback should prevent dialog from closing');
	el.remove();

	el = $('<div></div>').dialog().bind('dialogbeforeclose', function(ev, ui) {
		ok(true, '.dialog("close") triggers dialogbeforeclose event');
		equals(this, el[0], "context of event");
		same(ui, {}, 'ui hash in event');
		return false;
	});
	el.dialog('close');
	isOpen('dialogbeforeclose event should prevent dialog from closing');
	el.remove();
});

})(jQuery);
