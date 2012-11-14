/*
 * draggable_core.js
 */

TestHelpers.draggable = {};

// todo: remove these hacks
TestHelpers.draggable.unreliableOffset = $.ui.ie && ( !document.documentMode || document.documentMode < 8 ) ? 2 : 0;

TestHelpers.draggable.drag = function(handle, dx, dy) {
	$(handle).simulate("drag", {
		dx: dx || 0,
		dy: dy || 0
	});
	return el.offset();
};

TestHelpers.draggable.testDrag = function(el, handle, dx, dy, expectedDX, expectedDY, msg) {

	var offsetBefore = el.offset(),
		offsetAfter = TestHelpers.draggable.drag(handle, dx, dy),
		actual = { left: offsetAfter.left, top: offsetAfter.top },
		expected = { left: offsetBefore.left + expectedDX, top: offsetBefore.top + expectedDY };

	msg = msg ? msg + "." : "";
	deepEqual(actual, expected, 'dragged[' + dx + ', ' + dy + '] ' + msg);
};

TestHelpers.draggable.shouldMove = function(el, why) {
	TestHelpers.draggable.testDrag(el, el, 50, 50, 50, 50, why);
};

TestHelpers.draggable.shouldNotMove = function(el, why) {
	TestHelpers.draggable.testDrag(el, el, 50, 50, 0, 0, why);
};

TestHelpers.draggable.testScroll = function(el, position ) {
	var oldPosition = $("#main").css('position');
	$("#main").css('position', position);
	TestHelpers.draggable.shouldMove(el, position+' parent');
	$("#main").css('position', oldPosition);
};

TestHelpers.draggable.restoreScroll = function( what ) {
	if( what ) {
		$(document).scrollTop(0); $(document).scrollLeft(0);
	} else {
		$("#main").scrollTop(0); $("#main").scrollLeft(0);
	}
};

TestHelpers.draggable.setScroll = function( what ) {
	if(what) {
		// todo: currently, the draggable interaction doesn't properly account for scrolled pages,
		// uncomment the line below to make the tests fail that should when the page is scrolled
		// $(document).scrollTop(100); $(document).scrollLeft(100);
	} else {
		$("#main").scrollTop(100); $("#main").scrollLeft(100);
	}
};

TestHelpers.draggable.border = function(el, side) {
	return parseInt(el.css('border-' + side + '-width'), 10) || 0;
};
TestHelpers.draggable.margin = function(el, side) {
	return parseInt(el.css('margin-' + side), 10) || 0;
};

(function($) {

module("draggable");

test("element types", function() {
	var typeNames = ('p,h1,h2,h3,h4,h5,h6,blockquote,ol,ul,dl,div,form' +
		',table,fieldset,address,ins,del,em,strong,q,cite,dfn,abbr' +
		',acronym,code,samp,kbd,var,img,hr' +
		',input,button,label,select,iframe').split(',');

	expect( typeNames.length );

	$.each(typeNames, function(i) {
		var offsetBefore, offsetAfter, typeName = typeNames[i];
		el = $(document.createElement(typeName)).appendTo('#main');
		(typeName === 'table' && el.append("<tr><td>content</td></tr>"));
		el.draggable({ cancel: '' });
		offsetBefore = el.offset();
		offsetAfter =TestHelpers.draggable.drag(el, 50, 50);
		//there are some rounding errors in FF and Chrome, so we can't say equal, we have to settle for close enough
		ok(offsetAfter.left - offsetBefore.left - 50 < 1 && offsetAfter.top - offsetBefore.top - 50 < 1, 'dragged[50, 50] ' + "&lt;" + typeName + "&gt;");
		el.draggable("destroy");
		el.remove();
	});
});

test("No options, relative", function() {
	expect( 1 );
	el = $("#draggable1").draggable();
	TestHelpers.draggable.shouldMove(el);
});

test("No options, absolute", function() {
	expect( 1 );
	
	el = $("#draggable2").draggable();
	TestHelpers.draggable.shouldMove(el);
});

test("resizable handle with complex markup (#8756 / #8757)", function() {
	expect(2);

	var drag = function(el, dx) {
		$(el)
			.simulate("mouseover")
			.simulate("drag", {
				dx: dx || 0,
				speed: 'sync'
			});
	};

	$('#draggable1')
		.append(
			$('<div>')
				.addClass("ui-resizable-handle")
				.addClass("ui-resizable-w")
				.append($('<div>'))
		);

	var handle = '.ui-resizable-w div', target = $('#draggable1').draggable().resizable({ handles: 'all' });
	
	drag(handle, -50);
	equal( target.width(), 250, "compare width" );

	drag(handle, 50);
	equal( target.width(), 200, "compare width" );
});

})(jQuery);
