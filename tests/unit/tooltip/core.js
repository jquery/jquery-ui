define( [
	"qunit",
	"jquery",
	"./helper",
	"ui/widgets/tooltip"
], function( QUnit, $, testHelper ) {

var beforeAfterEach = testHelper.beforeAfterEach;

QUnit.module( "tooltip: core", beforeAfterEach() );

QUnit.test( "markup structure", function( assert ) {
	assert.expect( 7 );
	var element = $( "#tooltipped1" ).tooltip(),
		tooltip = $( ".ui-tooltip" );

	assert.equal( element.attr( "aria-describedby" ), undefined, "no aria-describedby on init" );
	assert.equal( tooltip.length, 0, "no tooltip on init" );

	element.tooltip( "open" );
	tooltip = $( "#" + element.data( "ui-tooltip-id" ) );
	assert.equal( tooltip.length, 1, "tooltip exists" );
	assert.equal( element.attr( "aria-describedby" ), tooltip.attr( "id" ), "aria-describedby" );
	assert.hasClasses( tooltip, "ui-tooltip ui-widget ui-widget-content ui-widget-shadow" );
	assert.equal( tooltip.length, 1, ".ui-tooltip exists" );
	assert.equal( tooltip.find( ".ui-tooltip-content" ).length, 1,
		".ui-tooltip-content exists" );
} );

QUnit.test( "accessibility", function( assert ) {
	assert.expect( 15 );

	var tooltipId, tooltip,
		element = $( "#multiple-describedby" ).tooltip(),
		liveRegion = element.tooltip( "instance" ).liveRegion;

	assert.equal( liveRegion.find( ">div" ).length, 0 );
	assert.equal( liveRegion.attr( "role" ), "log" );
	assert.equal( liveRegion.attr( "aria-live" ), "assertive" );
	assert.equal( liveRegion.attr( "aria-relevant" ), "additions" );
	element.tooltip( "open" );
	tooltipId = element.data( "ui-tooltip-id" );
	tooltip = $( "#" + tooltipId );
	assert.equal( tooltip.attr( "role" ), "tooltip", "role" );
	assert.equal( element.attr( "aria-describedby" ), "fixture-span " + tooltipId,
		"multiple describedby when open" );

	assert.equal( element.attr( "title" ), null, "no title when open" );
	assert.equal( liveRegion.children().length, 1 );
	assert.equal( liveRegion.children().last().html(), "..." );
	element.tooltip( "close" );
	assert.equal( element.attr( "aria-describedby" ), "fixture-span",
		"correct describedby when closed" );
	assert.equal( element.attr( "title" ), "...", "title restored when closed" );

	element.tooltip( "open" );
	assert.equal( liveRegion.children().length, 2,
		"After the second tooltip show, there should be two children" );
	assert.equal( liveRegion.children().filter( ":visible" ).length, 1,
		"Only one of the children should be visible" );
	assert.ok( liveRegion.children().last().is( ":visible" ),
		"Only the last child should be visible" );
	element.tooltip( "close" );

	element.tooltip( "destroy" );
	assert.equal( liveRegion.parent().length, 0,
		"Tooltip liveregion element should be removed" );
} );

QUnit.test( "delegated removal", function( assert ) {
	assert.expect( 2 );

	var container = $( "#contains-tooltipped" ).tooltip(),
		element = $( "#contained-tooltipped" );

	element.trigger( "mouseover" );
	assert.equal( $( ".ui-tooltip" ).length, 1 );

	container.empty();
	assert.equal( $( ".ui-tooltip" ).length, 0 );
} );

QUnit.test( "nested tooltips", function( assert ) {
	assert.expect( 2 );

	var child = $( "#contained-tooltipped" ),
		parent = $( "#contains-tooltipped" ).tooltip( {
			show: null,
			hide: null
		} );

	parent.trigger( "mouseover" );
	assert.equal( $( ".ui-tooltip:visible" ).text(), "parent" );

	child.trigger( "mouseover" );
	assert.equal( $( ".ui-tooltip" ).text(), "child" );
} );

// #8742
QUnit.test( "form containing an input with name title", function( assert ) {
	assert.expect( 4 );

	var form = $( "#tooltip-form" ).tooltip( {
			show: null,
			hide: null
		} ),
		input = form.find( "[name=title]" );

	assert.equal( $( ".ui-tooltip" ).length, 0, "no tooltips on init" );

	input.trigger( "mouseover" );
	assert.equal( $( ".ui-tooltip" ).length, 1, "tooltip for input" );
	input.trigger( "mouseleave" );
	assert.equal( $( ".ui-tooltip" ).length, 0, "tooltip for input closed" );

	form.trigger( "mouseover" );
	assert.equal( $( ".ui-tooltip" ).length, 0, "no tooltip for form" );
} );

QUnit.test( "tooltip on .ui-state-disabled element", function( assert ) {
	assert.expect( 2 );

	var container = $( "#contains-tooltipped" ).tooltip(),
		element = $( "#contained-tooltipped" ).addClass( "ui-state-disabled" );

	element.trigger( "mouseover" );
	assert.equal( $( ".ui-tooltip" ).length, 1 );

	container.empty();
	assert.equal( $( ".ui-tooltip" ).length, 0 );
} );

// http://bugs.jqueryui.com/ticket/8740
QUnit.test( "programmatic focus with async content", function( assert ) {
	var ready = assert.async();
	assert.expect( 2 );
	var element = $( "#tooltipped1" ).tooltip( {
		content: function( response ) {
			setTimeout( function() {
				response( "test" );
			} );
		}
	} );

	element.on( "tooltipopen", function( event ) {
		assert.deepEqual( event.originalEvent.type, "focusin" );

		element.on( "tooltipclose", function( event ) {
			assert.deepEqual( event.originalEvent.type, "focusout" );
			ready();
		} );

		setTimeout( function() {
			element.trigger( "blur" );
		} );
	} );

	element.trigger( "focus" );
} );

QUnit.test( "destroy during hide animation; only one close event", function( assert ) {
	var ready = assert.async();
	assert.expect( 1 );

	var element = $( "#tooltipped1" ).tooltip( {
		show: false,
		hide: true
	} );

	element.on( "tooltipclose", function() {
		assert.ok( true, "tooltip closed" );
	} );

	element.tooltip( "open" );
	element.tooltip( "close" );
	setTimeout( function() {
		element.tooltip( "destroy" );
		ready();
	} );
} );

// http://bugs.jqueryui.com/ticket/10602
QUnit.test( "multiple active delegated tooltips", function( assert ) {
	var ready = assert.async();
	assert.expect( 1 );

	var anchor = $( "#tooltipped1" ),
		input = anchor.next(),
		actions = [];

	$( document ).tooltip( {
			show: false,
			hide: false,
			open: function( event, ui ) {
				actions.push( "open:" + ui.tooltip.text() );
			},
			close: function( event, ui ) {
				actions.push( "close:" + ui.tooltip.text() );
			}
		} );

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
		assert.deepEqual( actions, [
			"open:anchortitle",
			"open:inputtitle",
			"close:inputtitle",
			"close:anchortitle"
		], "Both tooltips open and close" );
		ready();
	}

	step1();
} );

// http://bugs.jqueryui.com/ticket/11272
QUnit.test( "remove conflicting attributes from live region", function( assert ) {
	assert.expect( 2 );

	var element = $(
		"<div id='content'>" +
			"<input type='radio' name='hobby' id='hobby1' checked='checked'>" +
			"<label for='hobby1'>option 1</label>" +
			"<input type='radio' name='hobby' id='hobby2'>" +
			"<label for='hobby2'>option 2</label>" +
		"</div>" );

	$( "#tooltipped1" )
		.tooltip( {
			content: element,
			open: function() {
				assert.equal( $( ".ui-helper-hidden-accessible [name]" ).length, 0,
					"no name attributes within live region" );
				assert.equal( $( ".ui-helper-hidden-accessible [id]" ).length, 0,
					"no id attributes within live region" );
			}
		} )
		.tooltip( "open" );
} );

} );
