/*
 * resizable tests
 */
(function($) {
//
// Resizable Test Helper Functions
//

var defaults = {
	animate: false,
	animateDuration: 'slow',
	animateEasing: 'swing',
	alsoResize: false,
	aspectRatio: false,
	autoHide: false,
	cancel: ':input',
	containment: false,
	delay: 0,
	disabled: false,
	disableSelection: true,
	distance: 1,
	ghost: false,
	grid: false,
	handles: '???',
	helper: null,
	knobHandles: false,
	maxHeight: null,
	maxWidth: null,
	minHeight: 10,
	minWidth: 10,
	preserveCursor: true,
	preventDefault: true,
	proportionallyResize: false,
	transparent: false
};

var drag = function(el, dx, dy, complete) {

	// speed = sync -> Drag syncrhonously.
	// speed = fast|slow -> Drag asyncrhonously - animated.

	//this mouseover is to work around a limitation in resizable
	//TODO: fix resizable so handle doesn't require mouseover in order to be used
	$(el).simulate("mouseover");

	return $(el).simulate("drag", {
		dx: dx||0, dy: dy||0, speed: 'sync', complete: complete 
	});
};

// Resizable Tests
module("resizable");

test("init", function() {
	expect(6);

	$("<div></div>").appendTo('body').resizable().remove();
	ok(true, '.resizable() called on element');

	$([]).resizable().remove();
	ok(true, '.resizable() called on empty collection');

	$('<div></div>').resizable().remove();
	ok(true, '.resizable() called on disconnected DOMElement');

	$('<div></div>').resizable().resizable("foo").remove();
	ok(true, 'arbitrary method called after init');

	el = $('<div></div>').resizable()
	var foo = el.data("foo.resizable");
	el.remove();
	ok(true, 'arbitrary option getter after init');

	$('<div></div>').resizable().data("foo.resizable", "bar").remove();
	ok(true, 'arbitrary option setter after init');
});

test("destroy", function() {
	expect(6);

	$("<div></div>").appendTo('body').resizable().resizable("destroy").remove();
	ok(true, '.resizable("destroy") called on element');

	$([]).resizable().resizable("destroy").remove();
	ok(true, '.resizable("destroy") called on empty collection');

	$('<div></div>').resizable().resizable("destroy").remove();
	ok(true, '.resizable("destroy") called on disconnected DOMElement');

	$('<div></div>').resizable().resizable("destroy").resizable("foo").remove();
	ok(true, 'arbitrary method called after destroy');

	el = $('<div></div>').resizable();
	var foo = el.resizable("destroy").data("foo.resizable");
	el.remove();
	ok(true, 'arbitrary option getter after destroy');

	$('<div></div>').resizable().resizable("destroy").data("foo.resizable", "bar").remove();
	ok(true, 'arbitrary option setter after destroy');
});

test("element types", function() {
	var typeNames = ('p,h1,h2,h3,h4,h5,h6,blockquote,ol,ul,dl,div,form'
		+ ',table,fieldset,address,ins,del,em,strong,q,cite,dfn,abbr'
		+ ',acronym,code,samp,kbd,var,img,object,hr'
		+ ',input,button,label,select,iframe').split(',');

	$.each(typeNames, function(i) {
		var typeName = typeNames[i];
		el = $(document.createElement(typeName)).appendTo('body');
		(typeName == 'table' && el.append("<tr><td>content</td></tr>"));
		el.resizable();
		ok(true, '$("&lt;' + typeName + '/&gt").resizable()');
		el.resizable("destroy");
		el.remove();
	});
});

test("defaults", function() {
	el = $('<div></div>').resizable();
	$.each(defaults, function(key, val) {
		var actual = el.data(key + ".resizable"), expected = val;
		same(actual, expected, key);
	});
	el.remove();
});

test("n", function() {
	expect(2);

	var handle = '.ui-resizable-n', target = $('#resizable1').resizable({ handles: 'all' });

	drag(handle, 0, -50);
	equals( target.height(), 150, "compare height" );

	drag(handle, 0, 50);
	equals( target.height(), 100, "compare height" );
});

test("s", function() {
	expect(2);

	var handle = '.ui-resizable-s', target = $('#resizable1').resizable({ handles: 'all' });

	drag(handle, 0, 50);
	equals( target.height(), 150, "compare height" );

	drag(handle, 0, -50);
	equals( target.height(), 100, "compare height" );
});

test("e", function() {
	expect(2);

	var handle = '.ui-resizable-e', target = $('#resizable1').resizable({ handles: 'all' });

	drag(handle, 50);
	equals( target.width(), 150, "compare width");

	drag(handle, -50);
	equals( target.width(), 100, "compare width" );
});

test("w", function() {
	expect(2);

	var handle = '.ui-resizable-w', target = $('#resizable1').resizable({ handles: 'all' });

	drag(handle, -50);
	equals( target.width(), 150, "compare width" );

	drag(handle, 50);
	equals( target.width(), 100, "compare width" );
});

test("ne", function() {
	expect(4);

	var handle = '.ui-resizable-ne', target = $('#resizable1').css({ overflow: 'hidden' }).resizable({ handles: 'all' });

	drag(handle, -50, -50);
	equals( target.width(), 50, "compare width" );
	equals( target.height(), 150, "compare height" );

	drag(handle, 50, 50);
	equals( target.width(), 100, "compare width" );
	equals( target.height(), 100, "compare height" );
});

test("se", function() {
	expect(4);

	var handle = '.ui-resizable-se', target = $('#resizable1').resizable({ handles: 'all' });

	drag(handle, 50, 50);
	equals( target.width(), 150, "compare width" );
	equals( target.height(), 150, "compare height" );

	drag(handle, -50, -50);
	equals( target.width(), 100, "compare width" );
	equals( target.height(), 100, "compare height" );
});

test("sw", function() {
	expect(4);

	var handle = '.ui-resizable-sw', target = $('#resizable1').resizable({ handles: 'all' });

	drag(handle, -50, -50);
	equals( target.width(), 150, "compare width" );
	equals( target.height(), 50, "compare height" );

	drag(handle, 50, 50);
	equals( target.width(), 100, "compare width" );
	equals( target.height(), 100, "compare height" );
});

test("nw", function() {
	expect(4);

	var handle = '.ui-resizable-nw', target = $('#resizable1').resizable({ handles: 'all' });

	drag(handle, -50, -50);
	equals( target.width(), 150, "compare width" );
	equals( target.height(), 150, "compare height" );

	drag(handle, 50, 50);
	equals( target.width(), 100, "compare width" );
	equals( target.height(), 100, "compare height" );
});

module("resizable: Options");

test("aspectRatio: 'preserve' (e)", function() {
	expect(4);

	var handle = '.ui-resizable-e', target = $('#resizable1').resizable({ aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });

	drag(handle, 80);
	equals( target.width(), 130, "compare maxWidth");
	equals( target.height(), 130, "compare maxHeight");

	drag(handle, -130);
	equals( target.width(), 70, "compare minWidth");
	equals( target.height(), 70, "compare minHeight");
});

test("aspectRatio: 'preserve' (w)", function() {
	expect(4);

	var handle = '.ui-resizable-w', target = $('#resizable1').resizable({ aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });

	drag(handle, -80);
	equals( target.width(), 130, "compare maxWidth");
	equals( target.height(), 130, "compare maxHeight");

	drag(handle, 130);
	equals( target.width(), 70, "compare minWidth");
	equals( target.height(), 70, "compare minHeight");
});

test("aspectRatio: 'preserve' (n)", function() {
	expect(4);

	var handle = '.ui-resizable-n', target = $('#resizable1').resizable({ aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });

	drag(handle, 0, -80);
	equals( target.width(), 130, "compare maxWidth");
	equals( target.height(), 130, "compare maxHeight");

	drag(handle, 0, 80);
	equals( target.width(), 70, "compare minWidth");
	equals( target.height(), 70, "compare minHeight");
});

test("aspectRatio: 'preserve' (s)", function() {
	expect(4);

	var handle = '.ui-resizable-s', target = $('#resizable1').resizable({ aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });

	drag(handle, 0, 80);
	equals( target.width(), 130, "compare maxWidth");
	equals( target.height(), 130, "compare maxHeight");

	drag(handle, 0, -80);
	equals( target.width(), 70, "compare minWidth");
	equals( target.height(), 70, "compare minHeight");
});

test("aspectRatio: 'preserve' (se)", function() {
	expect(4);

	var handle = '.ui-resizable-se', target = $('#resizable1').resizable({ aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });

	drag(handle, 80, 80);
	equals( target.width(), 130, "compare maxWidth");
	equals( target.height(), 130, "compare maxHeight");

	drag(handle, -80, -80);
	equals( target.width(), 70, "compare minWidth");
	equals( target.height(), 70, "compare minHeight");
});

test("aspectRatio: 'preserve' (sw)", function() {
	expect(4);

	var handle = '.ui-resizable-sw', target = $('#resizable1').resizable({ aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });

	drag(handle, -80, 80);
	equals( target.width(), 130, "compare maxWidth");
	equals( target.height(), 130, "compare maxHeight");

	drag(handle, 80, -80);
	equals( target.width(), 70, "compare minWidth");
	equals( target.height(), 70, "compare minHeight");
});

test("aspectRatio: 'preserve' (ne)", function() {
	expect(4);

	var handle = '.ui-resizable-ne', target = $('#resizable1').resizable({ aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });

	drag(handle, 80, -80);
	equals( target.width(), 130, "compare maxWidth");
	equals( target.height(), 130, "compare maxHeight");

	drag(handle, -80, 80);
	equals( target.width(), 70, "compare minWidth");
	equals( target.height(), 70, "compare minHeight");
});

test("grid", function() {
	expect(4);

	var handle = '.ui-resizable-se', target = $('#resizable1').resizable({ handles: 'all', grid: [0, 20] });

	drag(handle, 3, 9);
	equals( target.width(), 103, "compare width");
	equals( target.height(), 100, "compare height");

	drag(handle, 15, 11);
	equals( target.width(), 118, "compare width");
	equals( target.height(), 120, "compare height");
});

test("grid (wrapped)", function() {
	expect(4);

	var handle = '.ui-resizable-se', target = $('#resizable2').resizable({ handles: 'all', grid: [0, 20] });

	drag(handle, 3, 9);
	equals( target.width(), 103, "compare width");
	equals( target.height(), 100, "compare height");

	drag(handle, 15, 11);
	equals( target.width(), 118, "compare width");
	equals( target.height(), 120, "compare height");
});

test("ui-resizable-se { handles: 'all', minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 }", function() {
	expect(4);

	var handle = '.ui-resizable-se', target = $('#resizable1').resizable({ handles: 'all', minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 });

	drag(handle, -50, -50);
	equals( target.width(), 60, "compare minWidth" );
	equals( target.height(), 60, "compare minHeight" );

	drag(handle, 70, 70);
	equals( target.width(), 100, "compare maxWidth" );
	equals( target.height(), 100, "compare maxHeight" );
});

test("ui-resizable-sw { handles: 'all', minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 }", function() {
	expect(4);

	var handle = '.ui-resizable-sw', target = $('#resizable1').resizable({ handles: 'all', minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 });

	drag(handle, 50, -50);
	equals( target.width(), 60, "compare minWidth" );
	equals( target.height(), 60, "compare minHeight" );

	drag(handle, -70, 70);
	equals( target.width(), 100, "compare maxWidth" );
	equals( target.height(), 100, "compare maxHeight" );
});

test("ui-resizable-ne { handles: 'all', minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 }", function() {
	expect(4);

	var handle = '.ui-resizable-ne', target = $('#resizable1').resizable({ handles: 'all', minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 });

	drag(handle, -50, 50);
	equals( target.width(), 60, "compare minWidth" );
	equals( target.height(), 60, "compare minHeight" );

	drag(handle, 70, -70);
	equals( target.width(), 100, "compare maxWidth" );
	equals( target.height(), 100, "compare maxHeight" );
});

test("ui-resizable-nw { handles: 'all', minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 }", function() {
	expect(4);

	var handle = '.ui-resizable-nw', target = $('#resizable1').resizable({ handles: 'all', minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 });

	drag(handle, 70, 70);
	equals( target.width(), 60, "compare minWidth" );
	equals( target.height(), 60, "compare minHeight" );

	drag(handle, -70, -70);
	equals( target.width(), 100, "compare maxWidth" );
	equals( target.height(), 100, "compare maxHeight" );
});

})(jQuery);
