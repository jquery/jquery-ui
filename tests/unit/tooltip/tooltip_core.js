(function( $ ) {

module( "tooltip: core" );

test( "markup structure", function() {
	expect( 7 );
	var element = $( "#tooltipped1" ).tooltip(),
		tooltip = $( ".ui-tooltip" );

	equal( element.attr( "aria-describedby" ), undefined, "no aria-describedby on init" );
	equal( tooltip.length, 0, "no tooltip on init" );

	element.tooltip( "open" );
	tooltip = $( "#" + element.data( "ui-tooltip-id" ) );
	equal( tooltip.length, 1, "tooltip exists" );
	equal( element.attr( "aria-describedby"), tooltip.attr( "id" ), "aria-describedby" );
	ok( tooltip.hasClass( "ui-tooltip" ), "tooltip is .ui-tooltip" );
	equal( tooltip.length, 1, ".ui-tooltip exists" );
	equal( tooltip.find( ".ui-tooltip-content" ).length, 1,
		".ui-tooltip-content exists" );
});

test( "accessibility", function() {
	expect( 15 );

	var tooltipId, tooltip,
		element = $( "#multiple-describedby" ).tooltip(),
		liveRegion = element.tooltip( "instance" ).liveRegion;

	equal( liveRegion.find( ">div" ).length, 0 );
	equal( liveRegion.attr( "role" ), "log" );
	equal( liveRegion.attr( "aria-live" ), "assertive" );
	equal( liveRegion.attr( "aria-relevant" ), "additions" );
	element.tooltip( "open" );
	tooltipId = element.data( "ui-tooltip-id" );
	tooltip = $( "#" + tooltipId );
	equal( tooltip.attr( "role" ), "tooltip", "role" );
	equal( element.attr( "aria-describedby" ), "fixture-span " + tooltipId,
		"multiple describedby when open" );

	// strictEqual to distinguish between .removeAttr( "title" ) and .attr( "title", "" )
	// support: jQuery <1.6.2
	// support: IE <8
	// We should use strictEqual( ..., undefined ) when dropping jQuery 1.6.1 support (or IE6/7)
	ok( !element.attr( "title" ), "no title when open" );
	equal( liveRegion.children().length, 1 );
	equal( liveRegion.children().last().html(), "..." );
	element.tooltip( "close" );
	equal( element.attr( "aria-describedby" ), "fixture-span",
		"correct describedby when closed" );
	equal( element.attr( "title" ), "...", "title restored when closed" );

	element.tooltip( "open" );
	equal( liveRegion.children().length, 2,
		"After the second tooltip show, there should be two children" );
	equal( liveRegion.children().filter( ":visible" ).length, 1,
		"Only one of the children should be visible" );
	ok( liveRegion.children().last().is( ":visible" ),
		"Only the last child should be visible" );
	element.tooltip( "close" );

	element.tooltip( "destroy" );
	equal( liveRegion.parent().length, 0,
		"Tooltip liveregion element should be removed" );
});

test( "delegated removal", function() {
	expect( 2 );

	var container = $( "#contains-tooltipped" ).tooltip(),
		element = $( "#contained-tooltipped" );

	element.trigger( "mouseover" );
	equal( $( ".ui-tooltip" ).length, 1 );

	container.empty();
	equal( $( ".ui-tooltip" ).length, 0 );
});

test( "nested tooltips", function() {
	expect( 2 );

	var child = $( "#contained-tooltipped" ),
		parent = $( "#contains-tooltipped" ).tooltip({
			show: null,
			hide: null
		});

	parent.trigger( "mouseover" );
	equal( $( ".ui-tooltip:visible" ).text(), "parent" );

	child.trigger( "mouseover" );
	equal( $( ".ui-tooltip" ).text(), "child" );
});

// #8742
test( "form containing an input with name title", function() {
	expect( 4 );

	var form = $( "#tooltip-form" ).tooltip({
			show: null,
			hide: null
		}),
		input = form.find( "[name=title]" );

	equal( $( ".ui-tooltip" ).length, 0, "no tooltips on init" );

	input.trigger( "mouseover" );
	equal( $( ".ui-tooltip" ).length, 1, "tooltip for input" );
	input.trigger( "mouseleave" );
	equal( $( ".ui-tooltip" ).length, 0, "tooltip for input closed" );

	form.trigger( "mouseover" );
	equal( $( ".ui-tooltip" ).length, 0, "no tooltip for form" );
});

test( "tooltip on .ui-state-disabled element", function() {
	expect( 2 );

	var container = $( "#contains-tooltipped" ).tooltip(),
		element = $( "#contained-tooltipped" ).addClass( "ui-state-disabled" );

	element.trigger( "mouseover" );
	equal( $( ".ui-tooltip" ).length, 1 );

	container.empty();
	equal( $( ".ui-tooltip" ).length, 0 );
});

// http://bugs.jqueryui.com/ticket/8740
asyncTest( "programmatic focus with async content", function() {
	expect( 2 );
	var element = $( "#tooltipped1" ).tooltip({
		content: function( response ) {
			setTimeout(function() {
				response( "test" );
			});
		}
	});

	element.bind( "tooltipopen", function( event ) {
		deepEqual( event.originalEvent.type, "focusin" );

		element.bind( "tooltipclose", function( event ) {
			deepEqual( event.originalEvent.type, "focusout" );
			start();
		});

		setTimeout(function() {
			element.blur();
		});
	});

	element.focus();
});

asyncTest( "destroy during hide animation; only one close event", function() {
	expect( 1 );

	var element = $( "#tooltipped1" ).tooltip({
		show: false,
		hide: true
	});

	element.bind( "tooltipclose", function() {
		ok( true, "tooltip closed" );
	});

	element.tooltip( "open" );
	element.tooltip( "close" );
	setTimeout(function() {
		element.tooltip( "destroy" );
		start();
	});
});

// http://bugs.jqueryui.com/ticket/10602
asyncTest( "multiple active delegated tooltips", function() {
	expect( 1 );

	var anchor = $( "#tooltipped1" ),
		input = anchor.next(),
		actions = [];

	$( document ).tooltip({
			show: false,
			hide: false,
			open: function( event, ui ) {
				actions.push( "open:" + ui.tooltip.text() );
			},
			close: function( event, ui ) {
				actions.push( "close:" + ui.tooltip.text() );
			}
		});

	function step1() {
		anchor.simulate( "mouseover" );
		setTimeout( step2 );
	}

	function step2() {
		input.simulate( "focus" );
		setTimeout( step3 );
	}

	function step3() {
		input.simulate( "blur" );
		setTimeout( step4 );
	}

	function step4() {
		anchor.simulate( "mouseout" );
		deepEqual( actions, [
			"open:anchortitle",
			"open:inputtitle",
			"close:inputtitle",
			"close:anchortitle"
		], "Both tooltips open and close" );
		start();
	}

	step1();
});

}( jQuery ) );
