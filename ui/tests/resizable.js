var num = function(i) {
	return parseInt(i, 10);
};

var animateClick = function(co) {
	var img = $("<img src='images/click.png' width='1'>").appendTo("body")
				.css({ position: "absolute", zIndex: 1000, left: co.x, top: co.y })
				.animate({ width: 80, height: 80, left: co.x-40, top: co.y-40, opacity: 'hide' }, 1000, function() { $(this).remove(); });
};

var initMouseEvent = function(type, el, co) {
	var evt = document.createEvent("MouseEvents");
	evt.initMouseEvent(type, true, true, window, 0, 0, 0, co.x, co.y, false, false, false, false, 0, null);
	
	el.dispatchEvent(evt);
	
	if (/^mouseup|mousedown|click$/i.test(type)) {
		animateClick(co);
	}
	
	return evt;
};


$.fn.triggerMousedown = function(co) {
	return initMouseEvent("mousedown", this[0], co);
};

$.fn.triggerMouseup = function(co) {
	return initMouseEvent("mouseup", this[0],  co);
};

$.fn.triggerMousemove = function(co, target) {
	return initMouseEvent("mousemove", this[0],  co);
};

var xy = function(el, offset) {
	var o = el.offset();
	return { x: o.left + (offset || [0, 0])[0]||0, 	y: o.top + (offset || [0, 0])[1]||0	};
};

$(document).ready(function() {

	$("#resizable1").resizable({
		
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
	
	handler.triggerMousedown( xy(handler) );
	
	for (var x = 0; x < 50; x += 10) {
		var evt = $(handler).triggerMousemove( xy(handler, [x, x]) );
		console.log(evt)
	}
	
	handler.triggerMouseup( xy(handler, [50, 50]) );

	
	
	return; 
	
	module("resizable: simple resize");
	
	test("simple drag", function() {

		expect(1);
		ok(true, "Resize element on the same position");
		
	});

});