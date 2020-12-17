define( [
	"qunit",
	"jquery",
	"./helper",
	"ui/widgets/tooltip"
], function( QUnit, $, testHelper ) {

var beforeAfterEach = testHelper.beforeAfterEach;

QUnit.module( "tooltip: options", beforeAfterEach() );

QUnit.test( "disabled: true", function( assert ) {
	assert.expect( 1 );
	$( "#tooltipped1" ).tooltip( {
		disabled: true
	} ).tooltip( "open" );
	assert.equal( $( ".ui-tooltip" ).length, 0 );
} );

QUnit.test( "content: default", function( assert ) {
	assert.expect( 1 );
	var element = $( "#tooltipped1" ).tooltip().tooltip( "open" );
	assert.deepEqual( $( "#" + element.data( "ui-tooltip-id" ) ).text(), "anchortitle" );
} );

QUnit.test( "content: default; HTML escaping", function( assert ) {
	assert.expect( 2 );
	var scriptText = "<script>$.ui.tooltip.hacked = true;</script>",
		element = $( "#tooltipped1" );

	$.ui.tooltip.hacked = false;
	element.attr( "title", scriptText )
		.tooltip()
		.tooltip( "open" );
	assert.equal( $.ui.tooltip.hacked, false, "script did not execute" );
	assert.deepEqual( $( "#" + element.data( "ui-tooltip-id" ) ).text(), scriptText,
		"correct tooltip text" );
} );

QUnit.test( "content: return string", function( assert ) {
	assert.expect( 1 );
	var element = $( "#tooltipped1" ).tooltip( {
		content: function() {
			return "customstring";
		}
	} ).tooltip( "open" );
	assert.deepEqual( $( "#" + element.data( "ui-tooltip-id" ) ).text(), "customstring" );
} );

QUnit.test( "content: return jQuery", function( assert ) {
	assert.expect( 2 );
	var element = $( "#tooltipped1" ).tooltip( {
		content: function() {
			return $( "<div id='unique'>" ).html( "cu<b id='bold'>s</b>tomstring" );
		}
	} ).tooltip( "open" ),
	liveRegion = element.tooltip( "instance" ).liveRegion;
	assert.deepEqual( $( "#" + element.data( "ui-tooltip-id" ) ).text(), "customstring" );
	assert.equal( liveRegion.children().last().html().toLowerCase(), "<div>cu<b>s</b>tomstring</div>",
		"The accessibility live region will strip the ids but keep the structure" );
} );

QUnit.test( "content: sync + async callback", function( assert ) {
	var ready = assert.async();
	assert.expect( 2 );
	var element = $( "#tooltipped1" ).tooltip( {
		content: function( response ) {
			setTimeout( function() {
				assert.deepEqual( $( "#" + element.data( "ui-tooltip-id" ) ).text(), "loading..." );

				response( "customstring2" );
				setTimeout( function() {
					assert.deepEqual( $( "#" + element.data( "ui-tooltip-id" ) ).text(), "customstring2" );
					ready();
				}, 13 );
			}, 13 );
			return "loading...";
		}
	} ).tooltip( "open" );
} );

// http://bugs.jqueryui.com/ticket/8740
QUnit.test( "content: async callback loses focus before load", function( assert ) {
	var ready = assert.async();
	assert.expect( 1 );

	var element = $( "#tooltipped1" ).tooltip( {
		content: function( response ) {
			setTimeout( function() {
				element.trigger( "mouseleave" );
				setTimeout( function() {
					response( "sometext" );
					setTimeout( function() {
						assert.ok( !$( "#" + element.data( "ui-tooltip-id" ) ).is( ":visible" ),
							"Tooltip should not display" );
						ready();
					} );
				} );
			} );
		}
	} );
	element.trigger( "mouseover" );
} );

QUnit.test( "content: change while open", function( assert ) {
	assert.expect( 2 ) ;
	var element = $( "#tooltipped1" ).tooltip( {
		content: function() {
			return "old";
		}
	} );

	element.one( "tooltipopen", function( event, ui ) {
		assert.equal( ui.tooltip.text(), "old", "original content" );
		element.tooltip( "option", "content", function() {
			return "new";
		} );
		assert.equal( ui.tooltip.text(), "new", "updated content" );
	} );

	element.tooltip( "open" );
} );

QUnit.test( "content: string", function( assert ) {
	assert.expect( 1 );
	$( "#tooltipped1" ).tooltip( {
		content: "just a string",
		open: function( event, ui ) {
			assert.equal( ui.tooltip.text(), "just a string" );
		}
	} ).tooltip( "open" );
} );

QUnit.test( "content: element", function( assert ) {
	assert.expect( 1 );
	var content = "<p>this is a <i>test</i> of the emergency broadcast system.</p>",
		element = $( content )[ 0 ];
	$( "#tooltipped1" ).tooltip( {
		content: element,
		open: function( event, ui ) {
			assert.equal( ui.tooltip.children().html().toLowerCase(), content );
		}
	} ).tooltip( "open" );
} );

QUnit.test( "content: jQuery", function( assert ) {
	assert.expect( 1 );
	var content = "<p>this is a <i>test</i> of the emergency broadcast system.</p>",
		element = $( content );
	$( "#tooltipped1" ).tooltip( {
		content: element,
		open: function( event, ui ) {
			assert.equal( ui.tooltip.children().html().toLowerCase(), content );
		}
	} ).tooltip( "open" );
} );

QUnit.test( "items", function( assert ) {
	assert.expect( 2 );
	var event,
		element = $( "#qunit-fixture" ).tooltip( {
			items: "#fixture-span"
		} );

	event = $.Event( "mouseenter" );
	event.target = $( "#fixture-span" )[ 0 ];
	element.tooltip( "open", event );
	assert.deepEqual( $( "#" + $( "#fixture-span" ).data( "ui-tooltip-id" ) ).text(), "title-text" );

	// Make sure default [title] doesn't get used
	event.target = $( "#tooltipped1" )[ 0 ];
	element.tooltip( "open", event );
	assert.deepEqual( $( "#tooltipped1" ).data( "ui-tooltip-id" ), undefined );

	element.tooltip( "destroy" );
} );

QUnit.test( "track + show delay", function( assert ) {
	assert.expect( 2 );
	var event,
		leftVal = 314,
		topVal = 159,
		offsetVal = 26,
		element = $( "#tooltipped1" ).tooltip( {
			track: true,
			show: {
				delay: 1
			},
			position: {
				my: "left+" + offsetVal + " top+" + offsetVal,
				at: "right bottom"
			}
		} );

	event = $.Event( "mouseover" );
	event.target = $( "#tooltipped1" )[ 0 ];
	event.originalEvent = { type: "mouseover" };
	event.pageX = leftVal;
	event.pageY = topVal;
	element.trigger( event );

	event = $.Event( "mousemove" );
	event.target = $( "#tooltipped1" )[ 0 ];
	event.originalEvent = { type: "mousemove" };
	event.pageX = leftVal;
	event.pageY = topVal;
	element.trigger( event );

	assert.close(
		parseFloat( $( ".ui-tooltip" ).css( "left" ) ),
		leftVal + offsetVal, 0.5,
		"left position"
	);
	assert.close(
		parseFloat( $( ".ui-tooltip" ).css( "top" ) ),
		topVal + offsetVal, 0.5,
		"top position"
	);
} );

QUnit.test( "track and programmatic focus", function( assert ) {
	assert.expect( 1 );
	$( "#qunit-fixture div input" ).tooltip( {
		track: true
	} ).trigger( "focus" );
	assert.equal( "inputtitle", $( ".ui-tooltip" ).text() );
} );

} );
