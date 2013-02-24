/*
 * draggable_core.js
 */

(function( $ ) {

var relativeElement, absoluteElement;

module( "draggable: core", {
	setup: function() {
		relativeElement = $("<div style='width: 200px; height: 100px;'>Relative</div>").appendTo("#qunit-fixture");
		absoluteElement = $("<div style='background: green; width: 200px; height: 100px; position: absolute; top: 10px; left: 10px;'><span>Absolute</span></div>").appendTo("#qunit-fixture");
	},
	teardown: function() {
		relativeElement.remove();
		absoluteElement.remove();
	}
});

test( "element types", function() {
	var typeNames = (
			"p,h1,h2,h3,h4,h5,h6,blockquote,ol,ul,dl,div,form" +
			",table,fieldset,address,ins,del,em,strong,q,cite,dfn,abbr" +
			",acronym,code,samp,kbd,var,img,hr" +
			",input,button,label,select,iframe"
		).split(",");

	expect( typeNames.length * 2 );

	$.each( typeNames, function( i ) {
		var offsetBefore, offsetAfter,
			typeName = typeNames[ i ],
			el = $( document.createElement( typeName ) ).appendTo("#qunit-fixture");

		if ( typeName === "table" ) {
			el.append("<tr><td>content</td></tr>");
		}

		el.draggable({ cancel: "" });
		offsetBefore = el.offset();
		el.simulate( "drag", {
			dx: 50,
			dy: 50
		});
		offsetAfter = el.offset();

		// Support: FF, Chrome, and IE9,
		// there are some rounding errors in so we can't say equal, we have to settle for close enough
		closeEnough( offsetBefore.left, offsetAfter.left - 50, 1, "dragged[50, 50] " + "<" + typeName + ">" );
		closeEnough( offsetBefore.top, offsetAfter.top - 50, 1, "dragged[50, 50] " + "<" + typeName + ">" );
		el.draggable("destroy");
		el.remove();
	});
});

test( "No options, relative", function() {
	expect( 1 );
	TestHelpers.draggable.shouldMove( relativeElement.draggable() );
});

test( "No options, absolute", function() {
	expect( 1 );
	TestHelpers.draggable.shouldMove( absoluteElement.draggable() );
});

test( "resizable handle with complex markup (#8756 / #8757)", function() {
	expect( 2 );

	relativeElement
		.append(
			$("<div>")
				.addClass("ui-resizable-handle ui-resizable-w")
				.append( $("<div>") )
		);

	var handle = $(".ui-resizable-w div"),
		target = relativeElement.draggable().resizable({ handles: "all" });

	// todo: fix resizable so it doesn't require a mouseover
	handle.simulate("mouseover").simulate( "drag", { dx: -50 } );
	equal( target.width(), 250, "compare width" );

	// todo: fix resizable so it doesn't require a mouseover
	handle.simulate("mouseover").simulate( "drag", { dx: 50 } );
	equal( target.width(), 200, "compare width" );
});

test("_blockFrames, absolute parent", function() {
	expect( 3 );
	var el = $("#draggable1").draggable(),
		parent = $("<div style='width: 600px; height: 600px; position: absolute; top: 300px; left; 400px;'>"),
		iframe = $("<iframe src='about:blank' width='500' height='500' style='position: absolute; top: 25px; left: 30px;'>"),
		left, top;

	parent.append( iframe );

	$("#qunit-fixture").prepend( parent );

	el.on( "drag", function() {

		var block = iframe.next();

		left = block.css("left");
		top = block.css("top");

	});

	TestHelpers.draggable.shouldMove(el);

	equal( left, "30px" );
	equal( top, "25px" );

});

test("_blockFrames, relative parent", function() {
	expect( 3 );
	var el = $("#draggable1").draggable(),
		parent = $("<div style='width: 600px; height: 600px; position: relative; top: 300px; left; 400px;'>"),
		iframe = $("<iframe src='about:blank' width='500' height='500' style='position: absolute; top: 25px; left: 30px;'>"),
		left, top;

	parent.append( iframe );

	$("#qunit-fixture").prepend( parent );

	el.on( "drag", function() {

		var block = iframe.next();
		
		left = block.css("left");
		top = block.css("top");

	});

	TestHelpers.draggable.shouldMove(el);
	
	equal( left, "30px" );
	equal( top, "25px" );

});

test("_blockFrames, static parent", function() {
	expect( 3 );
	var el = $("#draggable1").draggable(),
		parent = $("<div style='width: 600px; height: 600px; margin-top: 300px; margin-left: 400px;'>"),
		iframe = $("<iframe src='about:blank' width='500' height='500' style='position: relative; top: 25px; left: 30px;'>"),
		left, top;

	parent.append( iframe );

	$("#qunit-fixture").prepend( parent );

	el.on( "drag", function() {

		var block = iframe.next();
		
		left = block.css("left");
		top = block.css("top");

	});

	TestHelpers.draggable.shouldMove(el);
	
	equal( left, "430px" );
  equal( top, "325px" );

});

})( jQuery );
