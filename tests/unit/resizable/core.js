define( [
	"jquery",
	"./helper",
	"ui/resizable"
], function( $, testHelper ) {

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

	testHelper.drag(handle, 0, -50);
	equal( target.height(), 150, "compare height" );

	testHelper.drag(handle, 0, 50);
	equal( target.height(), 100, "compare height" );

	equal( target[0].style.left, "", "left should not be modified" );
	equal( target[0].style.width, "", "width should not be modified" );
});

test("s", function() {
	expect(5);

	var handle = ".ui-resizable-s", target = $("#resizable1").resizable({ handles: "all" });

	testHelper.drag(handle, 0, 50);
	equal( target.height(), 150, "compare height" );

	testHelper.drag(handle, 0, -50);
	equal( target.height(), 100, "compare height" );

	equal( target[0].style.top, "", "top should not be modified" );
	equal( target[0].style.left, "", "left should not be modified" );
	equal( target[0].style.width, "", "width should not be modified" );
});

test("e", function() {
	expect(5);

	var handle = ".ui-resizable-e", target = $("#resizable1").resizable({ handles: "all" });

	testHelper.drag(handle, 50);
	equal( target.width(), 150, "compare width");

	testHelper.drag(handle, -50);
	equal( target.width(), 100, "compare width" );

	equal( target[0].style.height, "", "height should not be modified" );
	equal( target[0].style.top, "", "top should not be modified" );
	equal( target[0].style.left, "", "left should not be modified" );
});

test("w", function() {
	expect(4);

	var handle = ".ui-resizable-w", target = $("#resizable1").resizable({ handles: "all" });

	testHelper.drag(handle, -50);
	equal( target.width(), 150, "compare width" );

	testHelper.drag(handle, 50);
	equal( target.width(), 100, "compare width" );

	equal( target[0].style.height, "", "height should not be modified" );
	equal( target[0].style.top, "", "top should not be modified" );
});

test("ne", function() {
	expect(5);

	var handle = ".ui-resizable-ne", target = $("#resizable1").css({ overflow: "hidden" }).resizable({ handles: "all" });

	testHelper.drag(handle, -50, -50);
	equal( target.width(), 50, "compare width" );
	equal( target.height(), 150, "compare height" );

	testHelper.drag(handle, 50, 50);
	equal( target.width(), 100, "compare width" );
	equal( target.height(), 100, "compare height" );

	equal( target[0].style.left, "", "left should not be modified" );
});

test("se", function() {
	expect(6);

	var handle = ".ui-resizable-se", target = $("#resizable1").resizable({ handles: "all" });

	testHelper.drag(handle, 50, 50);
	equal( target.width(), 150, "compare width" );
	equal( target.height(), 150, "compare height" );

	testHelper.drag(handle, -50, -50);
	equal( target.width(), 100, "compare width" );
	equal( target.height(), 100, "compare height" );

	equal( target[0].style.top, "", "top should not be modified" );
	equal( target[0].style.left, "", "left should not be modified" );
});

test("sw", function() {
	expect(5);

	var handle = ".ui-resizable-sw", target = $("#resizable1").resizable({ handles: "all" });

	testHelper.drag(handle, -50, -50);
	equal( target.width(), 150, "compare width" );
	equal( target.height(), 50, "compare height" );

	testHelper.drag(handle, 50, 50);
	equal( target.width(), 100, "compare width" );
	equal( target.height(), 100, "compare height" );

	equal( target[0].style.top, "", "top should not be modified" );
});

test("nw", function() {
	expect(4);

	var handle = ".ui-resizable-nw", target = $("#resizable1").resizable({ handles: "all" });

	testHelper.drag(handle, -50, -50);
	equal( target.width(), 150, "compare width" );
	equal( target.height(), 150, "compare height" );

	testHelper.drag(handle, 50, 50);
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

	testHelper.drag(handle, -50);
	equal( target.width(), 150, "compare width" );

	testHelper.drag(handle, 50);
	equal( target.width(), 100, "compare width" );
});

test("resizable accounts for scroll position correctly (#3815)", function() {
	expect( 4 );

	var position, top, left,
		container = $("<div style='overflow:scroll;height:300px;width:300px;position:relative;'></div>").appendTo("#qunit-fixture"),
		overflowed = $("<div style='width: 1000px; height: 1000px;'></div>").appendTo( container ),
		el = $("<div style='height:100px;width:100px;position:absolute;top:10px;left:10px;'></div>").appendTo( overflowed ).resizable({ handles: "all" }),
		handle = ".ui-resizable-e",
		handlePosition = $(handle).position().left;

	container.scrollLeft( 100 ).scrollTop( 100 );

	position = el.position();
	left = el.css("left");
	top = el.css("top");

	testHelper.drag(handle, 50, 50);
	deepEqual( el.position(), position, "position stays the same when resized" );
	equal( el.css("left"), left, "css('left') stays the same when resized" );
	equal( el.css("top"), top, "css('top') stays the same when resized" );
	equal( $(handle).position().left, handlePosition + 50, "handle also moved" );
});

test( "resizable stores correct size when using helper and grid (#9547)", function() {
	expect( 2 );

	var handle = ".ui-resizable-se",
		target = $( "#resizable1" ).resizable({
			handles: "all",
			helper: "ui-resizable-helper",
			grid: [ 10, 10 ]
		});

	testHelper.drag( handle, 1, 1 );
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

	testHelper.drag( innerHandle, 10 );
	equal( inner.width(), 40, "compare width of inner element" );
	testHelper.drag( innerHandle, -10 );
	equal( inner.width(), 30, "compare width of inner element" );

	testHelper.drag( outerHandle, 10 );
	equal( outer.width(), 60, "compare width of outer element" );
	testHelper.drag( outerHandle, -10 );
	equal( outer.width(), 50, "compare width of outer element" );

	inner.remove();
	outer.remove();
});

} );
