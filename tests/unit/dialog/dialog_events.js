/*
 * dialog_events.js
 */
(function($) {

module("dialog: events");

test("open", function() {
	expect(6);

	el = $("<div></div>");
	el.dialog({
		open: function(ev, ui) {
			ok(true, 'autoOpen: true fires open callback');
			equals(this, el[0], "context of callback");
		}
	});
	el.remove();

	el = $("<div></div>");
	el.dialog({
		autoOpen: false,
		open: function(ev, ui) {
			ok(true, '.dialog("open") fires open callback');
			equals(this, el[0], "context of callback");
		}
	});
	el.dialog("open");
	el.remove();

	el = $('<div></div>').dialog({
		autoOpen: false
	});
	el.bind('dialogopen', function(ev, ui) {
		ok(true, 'dialog("open") fires open event');
		equals(this, el[0], 'context of event');
	});
	el.dialog('open');
	el.remove();
});

test("dragStart", function() {
	expect(2);

	el = $("<div></div>");
	el.dialog({
		dragStart: function(ev, ui) {
			ok(true, 'dragging fires dragStart callback');
			equals(this, el[0], "context of callback");
		}
	});
	var handle = $(".ui-dialog-titlebar", dlg());
	drag(handle, 50, 50);
	el.remove();
});

test("drag", function() {
	var fired = false;

	el = $("<div></div>");
	el.dialog({
		drag: function(ev, ui) {
			fired = true;
			equals(this, el[0], "context of callback");
		}
	});
	var handle = $(".ui-dialog-titlebar", dlg());
	drag(handle, 50, 50);
	ok(fired, "drag fired");
	el.remove();
});

test("dragStop", function() {
	expect(2);

	el = $("<div></div>");
	el.dialog({
		dragStop: function(ev, ui) {
			ok(true, 'dragging fires dragStop callback');
			equals(this, el[0], "context of callback");
		}
	});
	var handle = $(".ui-dialog-titlebar", dlg());
	drag(handle, 50, 50);
	el.remove();
});

test("resizeStart", function() {
	expect(2);

	el = $("<div></div>");
	el.dialog({
		resizeStart: function(ev, ui) {
			ok(true, 'resizing fires resizeStart callback');
			equals(this, el[0], "context of callback");
		}
	});
	var handle = $(".ui-resizable-se", dlg());
	drag(handle, 50, 50);
	el.remove();
});

test("resize", function() {
	var fired = false;

	el = $("<div></div>");
	el.dialog({
		resize: function(ev, ui) {
			fired = true;
			equals(this, el[0], "context of callback");
		}
	});
	var handle = $(".ui-resizable-se", dlg());
	drag(handle, 50, 50);
	ok(fired, "resize fired");
	el.remove();
});

test("resizeStop", function() {
	expect(2);

	el = $("<div></div>");
	el.dialog({
		resizeStop: function(ev, ui) {
			ok(true, 'resizing fires resizeStop callback');
			equals(this, el[0], "context of callback");
		}
	});
	var handle = $(".ui-resizable-se", dlg());
	drag(handle, 50, 50);
	el.remove();
});

test("close", function() {
	expect(4);

	el = $('<div></div>').dialog({
		close: function(ev, ui) {
			ok(true, '.dialog("close") fires close callback');
			equals(this, el[0], "context of callback");
		}
	});
	el.dialog("close");
	el.remove();

	el = $('<div></div>').dialog().bind('dialogclose', function(ev, ui) {
		ok(true, '.dialog("close") fires dialogclose event');
		equals(this, el[0], 'context of event');
	});
	el.dialog('close');
	el.remove();
});

test("beforeclose", function() {
	expect(6);

	el = $('<div></div>').dialog({
		beforeclose: function(ev, ui) {
			ok(true, '.dialog("close") fires beforeclose callback');
			equals(this, el[0], "context of callback");
			return false;
		}
	});
	el.dialog('close');
	isOpen('beforeclose callback should prevent dialog from closing');
	el.remove();

	el = $('<div></div>').dialog().bind('dialogbeforeclose', function(ev, ui) {
		ok(true, '.dialog("close") triggers dialogbeforeclose event');
		equals(this, el[0], "context of event");
		return false;
	});
	el.dialog('close');
	isOpen('dialogbeforeclose event should prevent dialog from closing');
	el.remove();
});

})(jQuery);
