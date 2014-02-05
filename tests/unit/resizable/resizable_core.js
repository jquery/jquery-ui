/*
 * resizable_core.js
 */

(function($) {

module("resizable: core");

/*
test("element types", function() {
	var typeNames = ("p,h1,h2,h3,h4,h5,h6,blockquote,ol,ul,dl,div,form"
		+ ",table,fieldset,address,ins,del,em,strong,q,cite,dfn,abbr"
		+ ",acronym,code,samp,kbd,var,img,object,hr"
		+ ",input,button,label,select,iframe").split(",");

	$.each(typeNames, function(i) {
		var typeName = typeNames[i];
		el = $(document.createElement(typeName)).appendTo("body");
		(typeName == "table" && el.append("<tr><td>content</td></tr>"));
		el.resizable();
		ok(true, "$('&lt;" + typeName + "/&gt').resizable()");
		el.resizable("destroy");
		el.remove();
	});
});
*/

test("n", function() {
	expect(4);

	var handle = ".ui-resizable-n", target = $("#resizable1").resizable({ handles: "all" });

	TestHelpers.resizable.drag(handle, 0, -50);
	equal( target.height(), 150, "compare height" );

	TestHelpers.resizable.drag(handle, 0, 50);
	equal( target.height(), 100, "compare height" );

	equal( target[0].style.left, "", "left should not be modified" );
	equal( target[0].style.width, "", "width should not be modified" );
});

test("s", function() {
	expect(5);

	var handle = ".ui-resizable-s", target = $("#resizable1").resizable({ handles: "all" });

	TestHelpers.resizable.drag(handle, 0, 50);
	equal( target.height(), 150, "compare height" );

	TestHelpers.resizable.drag(handle, 0, -50);
	equal( target.height(), 100, "compare height" );

	equal( target[0].style.top, "", "top should not be modified" );
	equal( target[0].style.left, "", "left should not be modified" );
	equal( target[0].style.width, "", "width should not be modified" );
});

test("e", function() {
	expect(5);

	var handle = ".ui-resizable-e", target = $("#resizable1").resizable({ handles: "all" });

	TestHelpers.resizable.drag(handle, 50);
	equal( target.width(), 150, "compare width");

	TestHelpers.resizable.drag(handle, -50);
	equal( target.width(), 100, "compare width" );

	equal( target[0].style.height, "", "height should not be modified" );
	equal( target[0].style.top, "", "top should not be modified" );
	equal( target[0].style.left, "", "left should not be modified" );
});

test("w", function() {
	expect(4);

	var handle = ".ui-resizable-w", target = $("#resizable1").resizable({ handles: "all" });

	TestHelpers.resizable.drag(handle, -50);
	equal( target.width(), 150, "compare width" );

	TestHelpers.resizable.drag(handle, 50);
	equal( target.width(), 100, "compare width" );

	equal( target[0].style.height, "", "height should not be modified" );
	equal( target[0].style.top, "", "top should not be modified" );
});

test("ne", function() {
	expect(5);

	var handle = ".ui-resizable-ne", target = $("#resizable1").css({ overflow: "hidden" }).resizable({ handles: "all" });

	TestHelpers.resizable.drag(handle, -50, -50);
	equal( target.width(), 50, "compare width" );
	equal( target.height(), 150, "compare height" );

	TestHelpers.resizable.drag(handle, 50, 50);
	equal( target.width(), 100, "compare width" );
	equal( target.height(), 100, "compare height" );

	equal( target[0].style.left, "", "left should not be modified" );
});

test("se", function() {
	expect(6);

	var handle = ".ui-resizable-se", target = $("#resizable1").resizable({ handles: "all" });

	TestHelpers.resizable.drag(handle, 50, 50);
	equal( target.width(), 150, "compare width" );
	equal( target.height(), 150, "compare height" );

	TestHelpers.resizable.drag(handle, -50, -50);
	equal( target.width(), 100, "compare width" );
	equal( target.height(), 100, "compare height" );

	equal( target[0].style.top, "", "top should not be modified" );
	equal( target[0].style.left, "", "left should not be modified" );
});

test("sw", function() {
	expect(5);

	var handle = ".ui-resizable-sw", target = $("#resizable1").resizable({ handles: "all" });

	TestHelpers.resizable.drag(handle, -50, -50);
	equal( target.width(), 150, "compare width" );
	equal( target.height(), 50, "compare height" );

	TestHelpers.resizable.drag(handle, 50, 50);
	equal( target.width(), 100, "compare width" );
	equal( target.height(), 100, "compare height" );

	equal( target[0].style.top, "", "top should not be modified" );
});

test("nw", function() {
	expect(4);

	var handle = ".ui-resizable-nw", target = $("#resizable1").resizable({ handles: "all" });

	TestHelpers.resizable.drag(handle, -50, -50);
	equal( target.width(), 150, "compare width" );
	equal( target.height(), 150, "compare height" );

	TestHelpers.resizable.drag(handle, 50, 50);
	equal( target.width(), 100, "compare width" );
	equal( target.height(), 100, "compare height" );
});

test("handle with complex markup (#8756)", function() {
	expect(2);

	$("#resizable1")
		.append(
			$("<div>")
				.addClass("ui-resizable-handle")
				.addClass("ui-resizable-w")
				.append($("<div>"))
		);

	var handle = ".ui-resizable-w div", target = $("#resizable1").resizable({ handles: "all" });

	TestHelpers.resizable.drag(handle, -50);
	equal( target.width(), 150, "compare width" );

	TestHelpers.resizable.drag(handle, 50);
	equal( target.width(), 100, "compare width" );
});

test("resizable accounts for scroll position correctly (#3815)", function() {
	expect( 3 );

	var position, top, left,
		container = $("<div style='overflow:scroll;height:300px;width:300px;position:relative;'></div>").appendTo("#qunit-fixture"),
		overflowed = $("<div style='width: 1000px; height: 1000px;'></div>").appendTo( container ),
		el = $("<div style='height:100px;width:100px;position:absolute;top:10px;left:10px;'></div>").appendTo( overflowed ).resizable({ handles: "all" }),
		handle = ".ui-resizable-e";

	container.scrollLeft( 100 ).scrollTop( 100 );

	position = el.position();
	left = el.css("left");
	top = el.css("top");

	TestHelpers.resizable.drag(handle, 50, 50);
	deepEqual( el.position(), position, "position stays the same when resized" );
	equal( el.css("left"), left, "css('left') stays the same when resized" );
	equal( el.css("top"), top, "css('top') stays the same when resized" );
});

test( "resizable stores correct size when using helper and grid (#9547)", function() {
	expect( 2 );

	var handle = ".ui-resizable-se",
		target = $( "#resizable1" ).resizable({
			handles: "all",
			helper: "ui-resizable-helper",
			grid: [ 10, 10 ]
		});

	TestHelpers.resizable.drag( handle, 1, 1 );
	equal( target.width(), 100, "compare width" );
	equal( target.height(), 100, "compare height" );
});

test( "nested resizable", function() {
	expect( 4 );
	
	var outer = $( "<div id='outer' style='width:50px'></div>" ),
		inner = $( "<div id='inner' style='width:30px'></div>" ),
		target = $( "#resizable1" ),
		innerHandle,
		outerHandle;

	outer.appendTo( target );
	inner.appendTo( outer );

	inner.resizable( { handles : "e" } );
	outer.resizable( { handles : "e" } );
	target.resizable( { handles : "e" } );

	innerHandle = $( "#inner > .ui-resizable-e" );
	outerHandle = $( "#outer > .ui-resizable-e" );
	
	TestHelpers.resizable.drag( innerHandle, 10 );
	equal( inner.width(), 40, "compare width of inner element" );
	TestHelpers.resizable.drag( innerHandle, -10 );
	equal( inner.width(), 30, "compare width of inner element" );

	TestHelpers.resizable.drag( outerHandle, 10 );
	equal( outer.width(), 60, "compare width of outer element" );
	TestHelpers.resizable.drag( outerHandle, -10 );
	equal( outer.width(), 50, "compare width of outer element" );

	inner.remove();
	outer.remove();
});

test( "resizable form elements not overflowed", function() {
	expect( 6 );

	var select = $( "<select size='3'></select>" ),
		option1 = $( "<option value='1'>1</option>" ),
		option2 = $( "<option value='2'>2</option>" ),
		option3 = $( "<option value='3'>3</option>" ),
		option4 = $( "<option value='4' selected='selected'>4</option>" ),
		option5 = $( "<option value='5'>5</option>" ),
		input = $( "<input type='submit' value='p'/>" ),
		button = $( "<button>Testing</button>" ),
		width,
		height;

	option1.appendTo( select );
	option2.appendTo( select );
	option3.appendTo( select );
	option4.appendTo( select );
	option5.appendTo( select );
	select.appendTo( "#qunit-fixture" );
	input.appendTo( "#qunit-fixture" );
	button.appendTo( "#qunit-fixture" );

	width = select.width();
	height = select.height();
	select.resizable();
	equal( select.width(), width, "compare width of select element" );
	equal( select.height(), height, "compare height of select element" );

	width = input.width();
	height = input.height();
	input.resizable();
	equal( input.width(), width, "compare width of input element" );
	equal( input.height(), height, "compare height of input element" );

	width = button.width();
	height = button.height();
	button.resizable();
	equal( button.width(), width, "compare width of button element" );
	equal( button.height(), height, "compare height of button element" );

	option1.remove();
	option2.remove();
	option3.remove();
	option4.remove();
	option5.remove();
	select.remove();
	input.remove();
	button.remove();
});
})(jQuery);
