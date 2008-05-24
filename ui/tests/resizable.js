var console = console || {
	log: function(l) {
		$('log').append(l + <br/>);
	}
};

var num = function(i) {
	return parseInt(i, 10);
};

var animateClick = function(co) {
	var img = $("<img src='images/click.png' width='1'>").appendTo("body")
				.css({ position: "absolute", zIndex: 1000, left: co.x, top: co.y })
				.animate({ width: 80, height: 80, left: co.x-40, top: co.y-40, opacity: 'hide' }, 1000, function() { $(this).remove(); });
};

var initMouseEvent = function(type, el, co, relatedTarget) {
	
	//check for DOM-compliant browsers
	if ($.isFunction(document.createEvent)) {
	
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent(type, true, true, window, 0, 0, 0, co.x, co.y, false, false, false, false, 0, null);
		
		if (relatedTarget && !evt.relatedTarget) {
			if (type == "mouseout") {
				evt.toElement = relatedTarget;
			}
			else 
				if (type == "mouseover") {
					evt.fromElement = relatedTarget;
				}
		}
		
		el.dispatchEvent(evt);
	}
	
	// IE
	if (document.createEventObject) {
		
	}
	
	if (/^mouseup|mousdemove|mousedown|click$/i.test(type)) {
		animateClick(co);
	}
	
	return evt;
};


$.fn.triggerMouse = function(type, co, relatedTarget) {
	return initMouseEvent(type, this[0], co, relatedTarget);
};

var xy = function(el, offset) {
	var o = el.offset();
	return { x: o.left + (offset || [0, 0])[0]||0, 	y: o.top + (offset || [0, 0])[1]||0	};
};

$(document).ready(function() {

	$("#resizable1").resizable({
		
		//maxHeight: 200,
		
		start: function(e, ui) {
			console.log('start: [' + e.pageX + ', ' + e.pageY + ']' )
			console.log(ui.instance.size, ui.instance.position)
		},
		
		stop: function(e, ui) {
			console.log('stop: [' + e.pageX + ', ' + e.pageY + ']' )
			console.log(ui.instance.size, ui.instance.position)
		},
		
		resize: function(e) {
			console.log(e);
		}
	});
	
	var handler = $(this).find('.ui-resizable-s');
	
	handler.mousedown(function() {	/*console.log('down')*/ });
	handler.mouseup(function() { /*console.log('up')*/ });
	
	handler.triggerMouse( "mouseover", xy(handler), handler[0] );
	handler.triggerMouse( "mousedown", xy(handler) );
	
	var lastco = [], distance = 30;
	
	for (var x = 0; x < distance; x++) {
		var evt = $(handler).triggerMouse( "mousemove", lastco = xy(handler, [x, x]) );
	}
	
	handler.triggerMouse( "mouseup", lastco );

	
	
	return; 
	
	module("resizable: simple resize");
	
	test("simple drag", function() {

		expect(1);
		ok(true, "Resize element on the same position");
		
	});

});