/*
 * draggable_core.js
 */

(function($) {

module("draggable");

test("element types", function() {
	var typeNames = ('p,h1,h2,h3,h4,h5,h6,blockquote,ol,ul,dl,div,form' +
		',table,fieldset,address,ins,del,em,strong,q,cite,dfn,abbr' +
		',acronym,code,samp,kbd,var,img,hr' +
		',input,button,label,select,iframe').split(',');

	expect( typeNames.length );

	$.each(typeNames, function(i) {
		var offsetBefore, offsetAfter,
			typeName = typeNames[i],
			el = $(document.createElement(typeName)).appendTo('#main');

		(typeName === 'table' && el.append("<tr><td>content</td></tr>"));
		el.draggable({ cancel: '' });
		offsetBefore = el.offset();
		TestHelpers.draggable.drag(el, 50, 50);
		offsetAfter = el.offset();
		//there are some rounding errors in FF and Chrome, so we can't say equal, we have to settle for close enough
		ok(offsetAfter.left - offsetBefore.left - 50 < 1 && offsetAfter.top - offsetBefore.top - 50 < 1, 'dragged[50, 50] ' + "&lt;" + typeName + "&gt;");
		el.draggable("destroy");
		el.remove();
	});
});

test("No options, relative", function() {
	expect( 1 );
	var el = $("#draggable1").draggable();
	TestHelpers.draggable.shouldMove(el);
});

test("No options, absolute", function() {
	expect( 1 );
	var el = $("#draggable2").draggable();
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
