define( [
	"qunit",
	"jquery",
	"./helper",
	"ui/widgets/accordion"
], function( QUnit, $, testHelper ) {
"use strict";

var equalHeight = testHelper.equalHeight,
	beforeAfterEach = testHelper.beforeAfterEach,
	state = testHelper.state;

QUnit.module( "accordion: options", beforeAfterEach() );

QUnit.test( "{ active: default }", function( assert ) {
	assert.expect( 2 );
	var element = $( "#list1" ).accordion();
	assert.equal( element.accordion( "option", "active" ), 0 );
	state( assert, element, 1, 0, 0 );
} );

QUnit.test( "{ active: null }", function( assert ) {
	assert.expect( 2 );
	var element = $( "#list1" ).accordion( {
		active: null
	} );
	assert.equal( element.accordion( "option", "active" ), 0 );
	state( assert, element, 1, 0, 0 );
} );

QUnit.test( "{ active: false }", function( assert ) {
	assert.expect( 7 );
	var element = $( "#list1" ).accordion( {
		active: false,
		collapsible: true
	} );
	state( assert, element, 0, 0, 0 );
	assert.equal( element.find( ".ui-accordion-header.ui-state-active" ).length, 0, "no headers selected" );
	assert.equal( element.accordion( "option", "active" ), false );

	element.accordion( "option", "collapsible", false );
	state( assert, element, 1, 0, 0 );
	assert.equal( element.accordion( "option", "active" ), 0 );

	element.accordion( "destroy" );
	element.accordion( {
		active: false
	} );
	state( assert, element, 1, 0, 0 );
	assert.strictEqual( element.accordion( "option", "active" ), 0 );
} );

// http://bugs.jqueryui.com/ticket/11938
QUnit.test( "{ active: false, collapsible: true }", function( assert ) {
	assert.expect( 1 );
	var element = $( "#collapsible" ).accordion(),
		height = element.outerHeight();

	element
		.accordion( "destroy" )
		.accordion( {
			active: false,
			collapsible: true
		} )
		.accordion( "option", "active", 0 );
	assert.equal( element.outerHeight(), height );
} );

QUnit.test( "{ active: Number }", function( assert ) {
	assert.expect( 8 );
	var element = $( "#list1" ).accordion( {
		active: 2
	} );
	assert.equal( element.accordion( "option", "active" ), 2 );
	state( assert, element, 0, 0, 1 );

	element.accordion( "option", "active", 0 );
	assert.equal( element.accordion( "option", "active" ), 0 );
	state( assert, element, 1, 0, 0 );

	element.find( ".ui-accordion-header" ).eq( 1 ).trigger( "click" );
	assert.equal( element.accordion( "option", "active" ), 1 );
	state( assert, element, 0, 1, 0 );

	element.accordion( "option", "active", 10 );
	assert.equal( element.accordion( "option", "active" ), 1 );
	state( assert, element, 0, 1, 0 );
} );

QUnit.test( "{ active: -Number }", function( assert ) {
	assert.expect( 8 );
	var element = $( "#list1" ).accordion( {
		active: -1
	} );
	assert.equal( element.accordion( "option", "active" ), 2 );
	state( assert, element, 0, 0, 1 );

	element.accordion( "option", "active", -2 );
	assert.equal( element.accordion( "option", "active" ), 1 );
	state( assert, element, 0, 1, 0 );

	element.accordion( "option", "active", -10 );
	assert.equal( element.accordion( "option", "active" ), 1 );
	state( assert, element, 0, 1, 0 );

	element.accordion( "option", "active", -3 );
	assert.equal( element.accordion( "option", "active" ), 0 );
	state( assert, element, 1, 0, 0 );
} );

QUnit.test( "{ animate: false }", function( assert ) {
	assert.expect( 3 );
	var element = $( "#list1" ).accordion( {
			animate: false
		} ),
		panels = element.find( ".ui-accordion-content" ),
		animate = $.fn.animate;
	$.fn.animate = function() {
		assert.ok( false, ".animate() called" );
	};

	assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel visible" );
	element.accordion( "option", "active", 1 );
	assert.ok( panels.eq( 0 ).is( ":hidden" ), "first panel hidden" );
	assert.ok( panels.eq( 1 ).is( ":visible" ), "second panel visible" );
	$.fn.animate = animate;
} );

QUnit.test( "{ animate: Number }", function( assert ) {
	var ready = assert.async();
	assert.expect( 7 );
	var element = $( "#list1" ).accordion( {
			animate: 100
		} ),
		panels = element.find( ".ui-accordion-content" ),
		animate = $.fn.animate;

	// Called twice (both panels)
	$.fn.animate = function( props, options ) {
		assert.equal( options.duration, 100, "correct duration" );
		assert.equal( options.easing, undefined, "default easing" );
		animate.apply( this, arguments );
	};

	assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel visible" );
	element.accordion( "option", "active", 1 );
	panels.promise().done( function() {
		assert.ok( panels.eq( 0 ).is( ":hidden" ), "first panel hidden" );
		assert.ok( panels.eq( 1 ).is( ":visible" ), "second panel visible" );
		$.fn.animate = animate;
		ready();
	} );
} );

QUnit.test( "{ animate: String }", function( assert ) {
	var ready = assert.async();
	assert.expect( 7 );
	var element = $( "#list1" ).accordion( {
			animate: "linear"
		} ),
		panels = element.find( ".ui-accordion-content" ),
		animate = $.fn.animate;

	// Called twice (both panels)
	$.fn.animate = function( props, options ) {
		assert.equal( options.duration, undefined, "default duration" );
		assert.equal( options.easing, "linear", "correct easing" );
		animate.apply( this, arguments );
	};

	assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel visible" );
	element.accordion( "option", "active", 1 );
	panels.promise().done( function() {
		assert.ok( panels.eq( 0 ).is( ":hidden" ), "first panel hidden" );
		assert.ok( panels.eq( 1 ).is( ":visible" ), "second panel visible" );
		$.fn.animate = animate;
		ready();
	} );
} );

QUnit.test( "{ animate: {} }", function( assert ) {
	var ready = assert.async();
	assert.expect( 7 );
	var element = $( "#list1" ).accordion( {
			animate: {}
		} ),
		panels = element.find( ".ui-accordion-content" ),
		animate = $.fn.animate;

	// Called twice (both panels)
	$.fn.animate = function( props, options ) {
		assert.equal( options.duration, undefined, "default duration" );
		assert.equal( options.easing, undefined, "default easing" );
		animate.apply( this, arguments );
	};

	assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel visible" );
	element.accordion( "option", "active", 1 );
	panels.promise().done( function() {
		assert.ok( panels.eq( 0 ).is( ":hidden" ), "first panel hidden" );
		assert.ok( panels.eq( 1 ).is( ":visible" ), "second panel visible" );
		$.fn.animate = animate;
		ready();
	} );
} );

QUnit.test( "{ animate: { duration, easing } }", function( assert ) {
	var ready = assert.async();
	assert.expect( 7 );
	var element = $( "#list1" ).accordion( {
			animate: { duration: 100, easing: "linear" }
		} ),
		panels = element.find( ".ui-accordion-content" ),
		animate = $.fn.animate;

	// Called twice (both panels)
	$.fn.animate = function( props, options ) {
		assert.equal( options.duration, 100, "correct duration" );
		assert.equal( options.easing, "linear", "correct easing" );
		animate.apply( this, arguments );
	};

	assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel visible" );
	element.accordion( "option", "active", 1 );
	panels.promise().done( function() {
		assert.ok( panels.eq( 0 ).is( ":hidden" ), "first panel hidden" );
		assert.ok( panels.eq( 1 ).is( ":visible" ), "second panel visible" );
		$.fn.animate = animate;
		ready();
	} );
} );

QUnit.test( "{ animate: { duration, easing } }, animate down", function( assert ) {
	var ready = assert.async();
	assert.expect( 7 );
	var element = $( "#list1" ).accordion( {
			active: 1,
			animate: { duration: 100, easing: "linear" }
		} ),
		panels = element.find( ".ui-accordion-content" ),
		animate = $.fn.animate;

	// Called twice (both panels)
	$.fn.animate = function( props, options ) {
		assert.equal( options.duration, 100, "correct duration" );
		assert.equal( options.easing, "linear", "correct easing" );
		animate.apply( this, arguments );
	};

	assert.ok( panels.eq( 1 ).is( ":visible" ), "first panel visible" );
	element.accordion( "option", "active", 0 );
	panels.promise().done( function() {
		assert.ok( panels.eq( 1 ).is( ":hidden" ), "first panel hidden" );
		assert.ok( panels.eq( 0 ).is( ":visible" ), "second panel visible" );
		$.fn.animate = animate;
		ready();
	} );
} );

QUnit.test( "{ animate: { duration, easing, down } }, animate down", function( assert ) {
	var ready = assert.async();
	assert.expect( 7 );
	var element = $( "#list1" ).accordion( {
			active: 1,
			animate: {
				duration: 100,
				easing: "linear",
				down: {
					easing: "swing"
				}
			}
		} ),
		panels = element.find( ".ui-accordion-content" ),
		animate = $.fn.animate;

	// Called twice (both panels)
	$.fn.animate = function( props, options ) {
		assert.equal( options.duration, 100, "correct duration" );
		assert.equal( options.easing, "swing", "correct easing" );
		animate.apply( this, arguments );
	};

	assert.ok( panels.eq( 1 ).is( ":visible" ), "first panel visible" );
	element.accordion( "option", "active", 0 );
	panels.promise().done( function() {
		assert.ok( panels.eq( 1 ).is( ":hidden" ), "first panel hidden" );
		assert.ok( panels.eq( 0 ).is( ":visible" ), "second panel visible" );
		$.fn.animate = animate;
		ready();
	} );
} );

QUnit.test( "{ collapsible: false }", function( assert ) {
	assert.expect( 4 );
	var element = $( "#list1" ).accordion( {
		active: 1
	} );
	element.accordion( "option", "active", false );
	assert.equal( element.accordion( "option", "active" ), 1 );
	state( assert, element, 0, 1, 0 );

	element.find( ".ui-accordion-header" ).eq( 1 ).trigger( "click" );
	assert.equal( element.accordion( "option", "active" ), 1 );
	state( assert, element, 0, 1, 0 );
} );

QUnit.test( "{ collapsible: true }", function( assert ) {
	assert.expect( 6 );
	var element = $( "#list1" ).accordion( {
		active: 1,
		collapsible: true
	} );

	element.accordion( "option", "active", false );
	assert.equal( element.accordion( "option", "active" ), false );
	state( assert, element, 0, 0, 0 );

	element.accordion( "option", "active", 1 );
	assert.equal( element.accordion( "option", "active" ), 1 );
	state( assert, element, 0, 1, 0 );

	element.find( ".ui-accordion-header" ).eq( 1 ).trigger( "click" );
	assert.equal( element.accordion( "option", "active" ), false );
	state( assert, element, 0, 0, 0 );
} );

QUnit.test( "{ event: null }", function( assert ) {
	assert.expect( 5 );
	var element = $( "#list1" ).accordion( {
		event: null
	} );
	state( assert, element, 1, 0, 0 );

	element.accordion( "option", "active", 1 );
	assert.equal( element.accordion( "option", "active" ), 1 );
	state( assert, element, 0, 1, 0 );

	// Ensure default click handler isn't bound
	element.find( ".ui-accordion-header" ).eq( 2 ).trigger( "click" );
	assert.equal( element.accordion( "option", "active" ), 1 );
	state( assert, element, 0, 1, 0 );
} );

QUnit.test( "{ event: custom }", function( assert ) {
	assert.expect( 11 );
	var element = $( "#list1" ).accordion( {
		event: "custom1 custom2"
	} );
	state( assert, element, 1, 0, 0 );

	element.find( ".ui-accordion-header" ).eq( 1 ).trigger( "custom1" );
	assert.equal( element.accordion( "option", "active" ), 1 );
	state( assert, element, 0, 1, 0 );

	// Ensure default click handler isn't bound
	element.find( ".ui-accordion-header" ).eq( 2 ).trigger( "click" );
	assert.equal( element.accordion( "option", "active" ), 1 );
	state( assert, element, 0, 1, 0 );

	element.find( ".ui-accordion-header" ).eq( 2 ).trigger( "custom2" );
	assert.equal( element.accordion( "option", "active" ), 2 );
	state( assert, element, 0, 0, 1 );

	element.accordion( "option", "event", "custom3" );

	// Ensure old event handlers are unbound
	element.find( ".ui-accordion-header" ).eq( 1 ).trigger( "custom1" );
	element.find( ".ui-accordion-header" ).eq( 1 ).trigger( "custom2" );
	assert.equal( element.accordion( "option", "active" ), 2 );
	state( assert, element, 0, 0, 1 );

	element.find( ".ui-accordion-header" ).eq( 1 ).trigger( "custom3" );
	assert.equal( element.accordion( "option", "active" ), 1 );
	state( assert, element, 0, 1, 0 );
} );

QUnit.test( "{ header: default }", function( assert ) {
	assert.expect( 2 );

	// Default: elem.find( "> li > :first-child" ).add( elem.find( "> :not(li)" ).even() )
	// elem.find( "> :not(li)" ).even()
	state( assert, $( "#list1" ).accordion(), 1, 0, 0 );

	// > li > :first-child
	state( assert, $( "#navigation" ).accordion(), 1, 0, 0 );
} );

QUnit.test( "{ header: customString }", function( assert ) {
	assert.expect( 6 );
	var element = $( "#navigationWrapper" ).accordion( {
		header: "h2"
	} );
	element.find( "h2" ).each( function() {
		assert.hasClasses( this, "ui-accordion-header" );
	} );
	assert.equal( element.find( ".ui-accordion-header" ).length, 3 );
	state( assert, element, 1, 0, 0 );
	element.accordion( "option", "active", 2 );
	state( assert, element, 0, 0, 1 );
} );

QUnit.test( "{ header: customFunction }", function( assert ) {
	assert.expect( 6 );
	var element = $( "#navigationWrapper" ).accordion( {
		header: function( elem ) {
			return elem.find( "h2" );
		}
	} );
	element.find( "h2" ).each( function() {
		assert.hasClasses( this, "ui-accordion-header" );
	} );
	assert.equal( element.find( ".ui-accordion-header" ).length, 3 );
	state( assert, element, 1, 0, 0 );
	element.accordion( "option", "active", 2 );
	state( assert, element, 0, 0, 1 );
} );

QUnit.test( "{ heightStyle: 'auto' }", function( assert ) {
	assert.expect( 3 );
	var element = $( "#navigation" ).accordion( { heightStyle: "auto" } );
	equalHeight( assert, element, 105 );
} );

QUnit.test( "{ heightStyle: 'content' }", function( assert ) {
	assert.expect( 3 );
	var element = $( "#navigation" ).accordion( { heightStyle: "content" } ),
		sizes = element.find( ".ui-accordion-content" ).map( function() {
			return $( this ).height();
		} ).get();
	assert.equal( sizes[ 0 ], 75 );
	assert.equal( sizes[ 1 ], 105 );
	assert.equal( sizes[ 2 ], 45 );
} );

QUnit.test( "{ heightStyle: 'fill' }", function( assert ) {
	assert.expect( 3 );
	$( "#navigationWrapper" ).height( 500 );
	var element = $( "#navigation" ).accordion( { heightStyle: "fill" } );
	equalHeight( assert, element, 455 );
} );

QUnit.test( "{ heightStyle: 'fill' } with sibling", function( assert ) {
	assert.expect( 3 );
	$( "#navigationWrapper" ).height( 500 );
	$( "<p>Lorem Ipsum</p>" )
		.css( {
			height: 50,
			marginTop: 20,
			marginBottom: 30
		} )
		.prependTo( "#navigationWrapper" );
	var element = $( "#navigation" ).accordion( { heightStyle: "fill" } );
	equalHeight( assert, element, 355 );
} );

QUnit.test( "{ heightStyle: 'fill' } with multiple siblings", function( assert ) {
	assert.expect( 3 );
	$( "#navigationWrapper" ).height( 500 );
	$( "<p>Lorem Ipsum</p>" )
		.css( {
			height: 50,
			marginTop: 20,
			marginBottom: 30
		} )
		.prependTo( "#navigationWrapper" );
	$( "<p>Lorem Ipsum</p>" )
		.css( {
			height: 50,
			marginTop: 20,
			marginBottom: 30,
			position: "absolute"
		} )
		.prependTo( "#navigationWrapper" );
	$( "<p>Lorem Ipsum</p>" )
		.css( {
			height: 25,
			marginTop: 10,
			marginBottom: 15
		} )
		.prependTo( "#navigationWrapper" );
	var element = $( "#navigation" ).accordion( { heightStyle: "fill" } );
	equalHeight( assert, element, 305 );
} );

QUnit.test( "{ icons: false }", function( assert ) {
	assert.expect( 8 );
	var element = $( "#list1" );
	function icons( on ) {
		assert.deepEqual( element.find( "span.ui-icon" ).length, on ? 3 : 0 );
		assert.deepEqual( element.find( ".ui-accordion-header.ui-accordion-icons" ).length, on ? 3 : 0 );
	}
	element.accordion();
	icons( true );
	element.accordion( "destroy" ).accordion( {
		icons: false
	} );
	icons( false );
	element.accordion( "option", "icons", { header: "foo", activeHeader: "bar" } );
	icons( true );
	element.accordion( "option", "icons", false );
	icons( false );
} );

QUnit.test( "{ icons: hash }", function( assert ) {
	assert.expect( 3 );
	var element = $( "#list1" ).accordion( {
		icons: { activeHeader: "a1", header: "h1" }
	} );
	assert.hasClasses( element.find( ".ui-accordion-header.ui-state-active span.ui-icon" ), "a1" );
	element.accordion( "option", "icons", { activeHeader: "a2", header: "h2" } );
	assert.lacksClasses( element.find( ".ui-accordion-header.ui-state-active span.ui-icon" ), "a1" );
	assert.hasClasses( element.find( ".ui-accordion-header.ui-state-active span.ui-icon" ), "a2" );
} );

} );
