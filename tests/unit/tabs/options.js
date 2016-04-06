define( [
	"qunit",
	"jquery",
	"./helper",
	"ui/widgets/tabs"
], function( QUnit, $, testHelper ) {

var disabled = testHelper.disabled,
	equalHeight = testHelper.equalHeight,
	state = testHelper.state;

QUnit.module( "tabs: options" );

QUnit.test( "{ active: default }", function( assert ) {
	assert.expect( 6 );

	var element = $( "#tabs1" ).tabs();
	assert.equal( element.tabs( "option", "active" ), 0, "should be 0 by default" );
	state( assert, element, 1, 0, 0 );
	element.tabs( "destroy" );

	location.hash = "#fragment-3";
	element = $( "#tabs1" ).tabs();
	assert.equal( element.tabs( "option", "active" ), 2, "should be 2 based on URL" );
	state( assert, element, 0, 0, 1 );
	element.tabs( "destroy" );

	location.hash = "#custom-id";
	element = $( "#tabs2" ).tabs();
	assert.equal( element.tabs( "option", "active" ), 3, "should be 3 based on URL" );
	state( assert, element, 0, 0, 0, 1, 0 );
	element.tabs( "destroy" );
	location.hash = "#";
} );

QUnit.test( "{ active: false }", function( assert ) {
	assert.expect( 7 );

	var element = $( "#tabs1" ).tabs( {
		active: false,
		collapsible: true
	} );
	state( assert, element, 0, 0, 0 );
	assert.equal( element.find( ".ui-tabs-nav .ui-state-active" ).length, 0, "no tabs selected" );
	assert.strictEqual( element.tabs( "option", "active" ), false );

	element.tabs( "option", "collapsible", false );
	state( assert, element, 1, 0, 0 );
	assert.equal( element.tabs( "option", "active" ), 0 );

	element.tabs( "destroy" );
	element.tabs( {
		active: false
	} );
	state( assert, element, 1, 0, 0 );
	assert.strictEqual( element.tabs( "option", "active" ), 0 );
} );

QUnit.test( "{ active: Number }", function( assert ) {
	assert.expect( 8 );

	var element = $( "#tabs1" ).tabs( {
		active: 2
	} );
	assert.equal( element.tabs( "option", "active" ), 2 );
	state( assert, element, 0, 0, 1 );

	element.tabs( "option", "active", 0 );
	assert.equal( element.tabs( "option", "active" ), 0 );
	state( assert, element, 1, 0, 0 );

	element.find( ".ui-tabs-nav .ui-tabs-anchor" ).eq( 1 ).trigger( "click" );
	assert.equal( element.tabs( "option", "active" ), 1 );
	state( assert, element, 0, 1, 0 );

	element.tabs( "option", "active", 10 );
	assert.equal( element.tabs( "option", "active" ), 1 );
	state( assert, element, 0, 1, 0 );
} );

QUnit.test( "{ active: -Number }", function( assert ) {
	assert.expect( 8 );

	var element = $( "#tabs1" ).tabs( {
		active: -1
	} );
	assert.equal( element.tabs( "option", "active" ), 2 );
	state( assert, element, 0, 0, 1 );

	element.tabs( "option", "active", -2 );
	assert.equal( element.tabs( "option", "active" ), 1 );
	state( assert, element, 0, 1, 0 );

	element.tabs( "option", "active", -10 );
	assert.equal( element.tabs( "option", "active" ), 1 );
	state( assert, element, 0, 1, 0 );

	element.tabs( "option", "active", -3 );
	assert.equal( element.tabs( "option", "active" ), 0 );
	state( assert, element, 1, 0, 0 );
} );

QUnit.test( "active - mismatched tab/panel order", function( assert ) {
	assert.expect( 3 );

	location.hash = "#tabs7-2";
	var element = $( "#tabs7" ).tabs();
	assert.equal( element.tabs( "option", "active" ), 1, "should be 1 based on URL" );
	state( assert, element, 0, 1 );
	element.tabs( "option", "active", 0 );
	state( assert, element, 1, 0 );
	location.hash = "#";
} );

QUnit.test( "collapsible", function( assert ) {
	assert.expect( 13 );

	var element = $( "#tabs1" ).tabs( {
		active: 1,
		collapsible: true
	} );
	assert.hasClasses( element, "ui-tabs-collapsible" );
	element.tabs( "option", "active", false );
	assert.equal( element.tabs( "option", "active" ), false );
	state( assert, element, 0, 0, 0 );

	element.tabs( "option", "active", 1 );
	assert.equal( element.tabs( "option", "active" ), 1 );
	state( assert, element, 0, 1, 0 );

	element.find( ".ui-state-active .ui-tabs-anchor" ).trigger( "click" );
	assert.equal( element.tabs( "option", "active" ), false );
	state( assert, element, 0, 0, 0 );

	element.tabs( "option", "collapsible", false );
	assert.lacksClasses( element, "ui-tabs-collapsible" );

	element.tabs( "option", "collapsible", true );

	assert.hasClasses( element, "ui-tabs-collapsible" );

	element.tabs( {
		active: 1,
		collapsible: false
	} );
	element.tabs( "option", "active", false );
	assert.equal( element.tabs( "option", "active" ), 1 );
	state( assert, element, 0, 1, 0 );

	element.find( ".ui-state-active .ui-tabs-anchor" ).eq( 1 ).trigger( "click" );
	assert.equal( element.tabs( "option", "active" ), 1 );
	state( assert, element, 0, 1, 0 );

} );

QUnit.test( "disabled", function( assert ) {
	assert.expect( 23 );

	// Fully enabled by default
	var event,
		element = $( "#tabs1" ).tabs();
	disabled( assert, element, false );

	assert.lacksClasses( element.tabs( "widget" ), "ui-state-disabled" );
	assert.lacksClasses( element.tabs( "widget" ), "ui-tabs-disabled" );
	assert.ok( !element.tabs( "widget" ).attr( "aria-disabled" ), "after: wrapper doesn't have aria-disabled attr" );

	// Disable single tab
	element.tabs( "option", "disabled", [ 1 ] );
	disabled( assert, element, [ 1 ] );

	assert.lacksClasses( element.tabs( "widget" ), "ui-state-disabled" );
	assert.lacksClasses( element.tabs( "widget" ), "ui-tabs-disabled" );
	assert.ok( !element.tabs( "widget" ).attr( "aria-disabled" ), "after: wrapper doesn't have aria-disabled attr" );

	// Disabled active tab
	element.tabs( "option", "disabled", [ 0, 1 ] );
	disabled( assert, element, [ 0, 1 ] );

	assert.lacksClasses( element.tabs( "widget" ), "ui-state-disabled" );
	assert.lacksClasses( element.tabs( "widget" ), "ui-tabs-disabled" );
	assert.ok( !element.tabs( "widget" ).attr( "aria-disabled" ), "after: wrapper doesn't have aria-disabled attr" );

	// Disable all tabs
	element.tabs( "option", "disabled", [ 0, 1, 2 ] );
	disabled( assert, element, true );

	assert.lacksClasses( element.tabs( "widget" ), "ui-state-disabled" );
	assert.hasClasses( element.tabs( "widget" ), "ui-tabs-disabled" );
	assert.ok( !element.tabs( "widget" ).attr( "aria-disabled" ), "after: wrapper doesn't have aria-disabled attr" );

	event = $.Event( "click" );
	element.find( ".ui-tabs-anchor" ).eq( 0 ).trigger( event );
	assert.ok( event.isDefaultPrevented(), "click is prevented for disabled tab" );

	// Enable all tabs
	element.tabs( "option", "disabled", [] );
	disabled( assert, element, false );
} );

QUnit.test( "{ event: null }", function( assert ) {
	assert.expect( 5 );

	var element = $( "#tabs1" ).tabs( {
		event: null
	} );
	state( assert, element, 1, 0, 0 );

	element.tabs( "option", "active", 1 );
	assert.equal( element.tabs( "option", "active" ), 1 );
	state( assert, element, 0, 1, 0 );

	// Ensure default click handler isn't bound
	element.find( ".ui-tabs-nav .ui-tabs-anchor" ).eq( 2 ).trigger( "click" );
	assert.equal( element.tabs( "option", "active" ), 1 );
	state( assert, element, 0, 1, 0 );
} );

QUnit.test( "{ event: custom }", function( assert ) {
	assert.expect( 11 );

	var element = $( "#tabs1" ).tabs( {
		event: "custom1 custom2"
	} );
	state( assert, element, 1, 0, 0 );

	element.find( ".ui-tabs-nav .ui-tabs-anchor" ).eq( 1 ).trigger( "custom1" );
	assert.equal( element.tabs( "option", "active" ), 1 );
	state( assert, element, 0, 1, 0 );

	// Ensure default click handler isn't bound
	element.find( ".ui-tabs-nav .ui-tabs-anchor" ).eq( 2 ).trigger( "click" );
	assert.equal( element.tabs( "option", "active" ), 1 );
	state( assert, element, 0, 1, 0 );

	element.find( ".ui-tabs-nav .ui-tabs-anchor" ).eq( 2 ).trigger( "custom2" );
	assert.equal( element.tabs( "option", "active" ), 2 );
	state( assert, element, 0, 0, 1 );

	element.tabs( "option", "event", "custom3" );

	// Ensure old event handlers are unbound
	element.find( ".ui-tabs-nav .ui-tabs-anchor" ).eq( 1 ).trigger( "custom1" );
	assert.equal( element.tabs( "option", "active" ), 2 );
	state( assert, element, 0, 0, 1 );

	element.find( ".ui-tabs-nav .ui-tabs-anchor" ).eq( 1 ).trigger( "custom3" );
	assert.equal( element.tabs( "option", "active" ), 1 );
	state( assert, element, 0, 1, 0 );
} );

QUnit.test( "{ heightStyle: 'auto' }", function( assert ) {
	assert.expect( 2 );
	var element = $( "#tabs8" ).tabs( { heightStyle: "auto" } );
	equalHeight( assert, element, 45 );
} );

QUnit.test( "{ heightStyle: 'content' }", function( assert ) {
	assert.expect( 2 );
	var element = $( "#tabs8" ).tabs( { heightStyle: "content" } ),
		sizes = element.find( ".ui-tabs-panel" ).map( function() {
			return $( this ).height();
		} ).get();
	assert.equal( sizes[ 0 ], 45 );
	assert.equal( sizes[ 1 ], 15 );
} );

QUnit.test( "{ heightStyle: 'fill' }", function( assert ) {
	assert.expect( 4 );
	$( "#tabs8Wrapper" ).height( 500 );
	var element = $( "#tabs8" ).tabs( { heightStyle: "fill" } );
	equalHeight( assert, element, 485 );
	element.tabs( "destroy" );

	element = $( "#tabs8" ).css( {
		"border": "1px solid black",
		"padding": "1px 0"
	} );
	element.tabs( { heightStyle: "fill" } );
	equalHeight( assert, element, 481 );
} );

QUnit.test( "{ heightStyle: 'fill' } with sibling", function( assert ) {
	assert.expect( 2 );
	$( "#tabs8Wrapper" ).height( 500 );
	$( "<p>Lorem Ipsum</p>" )
		.css( {
			height: 50,
			marginTop: 20,
			marginBottom: 30
		} )
		.prependTo( "#tabs8Wrapper" );
	var element = $( "#tabs8" ).tabs( { heightStyle: "fill" } );
	equalHeight( assert, element, 385 );
} );

QUnit.test( "{ heightStyle: 'fill' } with multiple siblings", function( assert ) {
	assert.expect( 2 );
	$( "#tabs8Wrapper" ).height( 500 );
	$( "<p>Lorem Ipsum</p>" )
		.css( {
			height: 50,
			marginTop: 20,
			marginBottom: 30
		} )
		.prependTo( "#tabs8Wrapper" );
	$( "<p>Lorem Ipsum</p>" )
		.css( {
			height: 50,
			marginTop: 20,
			marginBottom: 30,
			position: "absolute"
		} )
		.prependTo( "#tabs8Wrapper" );
	$( "<p>Lorem Ipsum</p>" )
		.css( {
			height: 25,
			marginTop: 10,
			marginBottom: 15
		} )
		.prependTo( "#tabs8Wrapper" );
	var element = $( "#tabs8" ).tabs( { heightStyle: "fill" } );
	equalHeight( assert, element, 335 );
} );

QUnit.test( "hide and show: false", function( assert ) {
	assert.expect( 3 );
	var element = $( "#tabs1" ).tabs( {
			show: false,
			hide: false
		} ),
		widget = element.tabs( "instance" ),
		panels = element.find( ".ui-tabs-panel" );
	widget._show = function() {
		assert.ok( false, "_show() called" );
	};
	widget._hide = function() {
		assert.ok( false, "_hide() called" );
	};

	assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel visible" );
	element.tabs( "option", "active", 1 );
	assert.ok( panels.eq( 0 ).is( ":hidden" ), "first panel hidden" );
	assert.ok( panels.eq( 1 ).is( ":visible" ), "second panel visible" );
} );

QUnit.test( "hide and show - animation", function( assert ) {
	var ready = assert.async();
	assert.expect( 5 );
	var element = $( "#tabs1" ).tabs( {
			show: "drop",
			hide: 2000
		} ),
		widget = element.tabs( "instance" ),
		panels = element.find( ".ui-tabs-panel" );
	widget._show = function( element, options, callback ) {
		assert.strictEqual( element[ 0 ], panels[ 1 ], "correct element in _show()" );
		assert.equal( options, "drop", "correct options in _show()" );
		setTimeout( function() {
			callback();
		} );
	};
	widget._hide = function( element, options, callback ) {
		assert.strictEqual( element[ 0 ], panels[ 0 ], "correct element in _hide()" );
		assert.equal( options, 2000, "correct options in _hide()" );
		setTimeout( function() {
			callback();
			ready();
		} );
	};

	assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel visible" );
	element.tabs( "option", "active", 1 );
} );

} );
