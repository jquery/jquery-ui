/*
 * draggable_core.js
 */

(function( $ ) {

module( "draggable: core" );

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
	TestHelpers.draggable.shouldMove( $( "#draggable1" ).draggable() );
});

test( "No options, absolute", function() {
	expect( 1 );
	TestHelpers.draggable.shouldMove( $( "#draggable2" ).draggable() );
});

test( "resizable handle with complex markup (#8756 / #8757)", function() {
	expect( 2 );

	$( "#draggable1" )
		.append(
			$("<div>")
				.addClass("ui-resizable-handle ui-resizable-w")
				.append( $("<div>") )
		);

	var handle = $(".ui-resizable-w div"),
		target = $( "#draggable1" ).draggable().resizable({ handles: "all" });

	// todo: fix resizable so it doesn't require a mouseover
	handle.simulate("mouseover").simulate( "drag", { dx: -50 } );
	equal( target.width(), 250, "compare width" );

	// todo: fix resizable so it doesn't require a mouseover
	handle.simulate("mouseover").simulate( "drag", { dx: 50 } );
	equal( target.width(), 200, "compare width" );
});

test( "#8269: Removing draggable element on drop", function() {
	expect( 2 );

	var element = $( "#draggable1" ).wrap( "<div id='wrapper' />" ).draggable({
			stop: function() {
				ok( true, "stop still called despite element being removed from DOM on drop" );
			}
		}),
		dropOffset = $( "#droppable" ).offset();

	$( "#droppable" ).droppable({
		drop: function() {
			$( "#wrapper" ).remove();
			ok( true, "element removed from DOM on drop" );
		}
	});

	// Support: Opera 12.10, Safari 5.1, jQuery <1.8
	if ( TestHelpers.draggable.unreliableContains ) {
		ok( true, "Opera <12.14 and Safari <6.0 report wrong values for $.contains in jQuery < 1.8" );
		ok( true, "Opera <12.14 and Safari <6.0 report wrong values for $.contains in jQuery < 1.8" );
	} else {
		element.simulate( "drag", {
			handle: "corner",
			x: dropOffset.left,
			y: dropOffset.top
		});
	}
});

test( "#6258: not following mouse when scrolled and using overflow-y: scroll", function() {
	expect( 2 );

	var element = $( "#draggable1" ).draggable({
			stop: function( event, ui ) {
				equal( ui.position.left, 1, "left position is correct despite overflow on HTML" );
				equal( ui.position.top, 1, "top position is correct despite overflow on HTML" );
				$( "html" )
					.css( "overflow-y", oldOverflowY )
					.css( "overflow-x", oldOverflowX )
					.scrollTop( 0 )
					.scrollLeft( 0 );
			}
		}),
		contentToForceScroll = $( "<div>" ).css({
			height: "10000px",
			width: "10000px"
		}),
		oldOverflowY = $( "html" ).css( "overflow-y" ),
		oldOverflowX = $( "html" ).css( "overflow-x" );

		contentToForceScroll.appendTo( "#qunit-fixture" );
		$( "html" )
			.css( "overflow-y", "scroll" )
			.css( "overflow-x", "scroll" )
			.scrollTop( 300 )
			.scrollLeft( 300 );

		element.simulate( "drag", {
			dx: 1,
			dy: 1,
			moves: 1
		});
});

test( "#9315: Draggable: jumps down with offset of scrollbar", function() {
	expect( 2 );

	var element = $( "#draggable2" ).draggable({
			stop: function( event, ui ) {
				equal( ui.position.left, 11, "left position is correct when position is absolute" );
				equal( ui.position.top, 11, "top position is correct when position is absolute" );
				$( "html" ).scrollTop( 0 ).scrollLeft( 0 );
			}
		}),
		contentToForceScroll = $( "<div>" ).css({
			height: "10000px",
			width: "10000px"
		});

		contentToForceScroll.appendTo( "#qunit-fixture" );
		$( "html" ).scrollTop( 300 ).scrollLeft( 300 );

		element.simulate( "drag", {
			dx: 1,
			dy: 1,
			moves: 1
		});
});

test( "#5009: scroll not working with parent's position fixed", function() {
	expect( 2 );

	var startValue = 300,
		element = $( "#draggable1" ).wrap( "<div id='wrapper' />" ).draggable({
			drag: function() {
				startValue += 100;
				$( document ).scrollTop( startValue ).scrollLeft( startValue );
			},
			stop: function( event, ui ) {
				equal( ui.position.left, 10, "left position is correct when parent position is fixed" );
				equal( ui.position.top, 10, "top position is correct when parent position is fixed" );
				$( document ).scrollTop( 0 ).scrollLeft( 0 );
			}
		}),
		contentToForceScroll = $( "<div>" ).css({
			height: "20000px",
			width: "20000px"
		});

	$( "#qunit-fixture" ).append( contentToForceScroll );
	$( "#wrapper" ).css( "position", "fixed" );

	element.simulate( "drag", {
		dx: 10,
		dy: 10,
		moves: 3
	});
});

test( "#5727: draggable from iframe" , function() {
	expect( 2 );

	var iframe = $( "<iframe id='iframe-draggable-container' src='about:blank'></iframe>" ).appendTo( "#qunit-fixture" ),
		iframeBody = iframe.contents().find( "body" ).append(
			"<div id='iframe-draggable-1' style='background: green; width: 200px; height: 100px;'>Relative</div>"
		),
		draggable1 = iframeBody.find( "#iframe-draggable-1" );

	draggable1.draggable();

	equal( draggable1.closest( iframeBody ).length, 1 );

	TestHelpers.draggable.shouldMove( draggable1 );
});

test( "#8399: A draggable should become the active element after you are finished interacting with it, but not before.", function() {
	expect( 2 );

	var element = $( "<a href='#'>link</a>" ).appendTo( "#qunit-fixture" ).draggable();

	$( document ).one( "mousemove", function() {
		notStrictEqual( document.activeElement, element.get( 0 ), "moving a draggable anchor did not make it the active element" );
	});

	TestHelpers.draggable.move( element, 50, 50 );

	strictEqual( document.activeElement, element.get( 0 ), "finishing moving a draggable anchor made it the active element" );
});

asyncTest( "#4261: active element should blur when mousing down on a draggable", function() {
	expect( 2 );

	var textInput = $( "<input>" ).appendTo( "#qunit-fixture" ),
		element = $( "#draggable1" ).draggable();

	TestHelpers.onFocus( textInput, function() {
		strictEqual( document.activeElement, textInput.get( 0 ), "ensure that a focussed text input is the active element before mousing down on a draggable" );

		TestHelpers.draggable.move( element, 50, 50 );

		notStrictEqual( document.activeElement, textInput.get( 0 ), "ensure the text input is no longer the active element after mousing down on a draggable" );
		start();
	});
});

})( jQuery );
