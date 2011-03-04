/*
 * tooltip_events.js
 */
(function($) {

module("tooltip: events");

test("programmatic triggers", function() {
	expect(2);
	var e = $("#tooltipped1").tooltip({
		open: function(event, ui) {
			same( event.type, "tooltipopen" );
		},
		close: function(event, ui) {
			same( event.type, "tooltipclose" );
		}
	});
	e.tooltip("open").tooltip("close");
	e.tooltip("destroy");
});

test("mouse events", function() {
	expect(4);
	var e = $("#tooltipped1").tooltip({
		open: function(event, ui) {
			same( event.type, "tooltipopen" );
			same( event.originalEvent.type, "mouseover" );
		},
		close: function(event, ui) {
			same( event.type, "tooltipclose" );
			same( event.originalEvent.type, "mouseout" );
		}
	});
	e.trigger("mouseover").trigger("mouseout");
	e.tooltip("destroy");
});

test("focus events", function() {
	expect(4);
	var e = $("#tooltipped1").tooltip({
		open: function(event, ui) {
			same( event.type, "tooltipopen" );
			same( event.originalEvent.type, "focus" );
		},
		close: function(event, ui) {
			same( event.type, "tooltipclose" );
			same( event.originalEvent.type, "blur" );
		}
	});
	e.trigger("focus").trigger("blur");
	e.tooltip("destroy");
});

})(jQuery);
