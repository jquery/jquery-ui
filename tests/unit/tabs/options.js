define( [
	"jquery",
	"./helper",
	"ui/widgets/tabs"
], function( $, testHelper ) {

var disabled = testHelper.disabled,
	equalHeight = testHelper.equalHeight,
	state = testHelper.state;

module( "tabs: options" );

test( "{ active: default }", function() {
	expect( 6 );

	var element = $( "#tabs1" ).tabs();
	equal( element.tabs( "option", "active" ), 0, "should be 0 by default" );
	state( element, 1, 0, 0 );
	element.tabs( "destroy" );

	location.hash = "#fragment-3";
	element = $( "#tabs1" ).tabs();
	equal( element.tabs( "option", "active" ), 2, "should be 2 based on URL" );
	state( element, 0, 0, 1 );
	element.tabs( "destroy" );

	location.hash = "#custom-id";
	element = $( "#tabs2" ).tabs();
	equal( element.tabs( "option", "active" ), 3, "should be 3 based on URL" );
	state( element, 0, 0, 0, 1, 0 );
	element.tabs( "destroy" );
	location.hash = "#";
});

test( "{ active: false }", function() {
	expect( 7 );

	var element = $( "#tabs1" ).tabs({
		active: false,
		collapsible: true
	});
	state( element, 0, 0, 0 );
	equal( element.find( ".ui-tabs-nav .ui-state-active" ).length, 0, "no tabs selected" );
	strictEqual( element.tabs( "option", "active" ), false );

	element.tabs( "option", "collapsible", false );
	state( element, 1, 0, 0 );
	equal( element.tabs( "option", "active" ), 0 );

	element.tabs( "destroy" );
	element.tabs({
		active: false
	});
	state( element, 1, 0, 0 );
	strictEqual( element.tabs( "option", "active" ), 0 );
});

test( "{ active: Number }", function() {
	expect( 8 );

	var element = $( "#tabs1" ).tabs({
		active: 2
	});
	equal( element.tabs( "option", "active" ), 2 );
	state( element, 0, 0, 1 );

	element.tabs( "option", "active", 0 );
	equal( element.tabs( "option", "active" ), 0 );
	state( element, 1, 0, 0 );

	element.find( ".ui-tabs-nav .ui-tabs-anchor" ).eq( 1 ).trigger( "click" );
	equal( element.tabs( "option", "active" ), 1 );
	state( element, 0, 1, 0 );

	element.tabs( "option", "active", 10 );
	equal( element.tabs( "option", "active" ), 1 );
	state( element, 0, 1, 0 );
});

test( "{ active: -Number }", function() {
	expect( 8 );

	var element = $( "#tabs1" ).tabs({
		active: -1
	});
	equal( element.tabs( "option", "active" ), 2 );
	state( element, 0, 0, 1 );

	element.tabs( "option", "active", -2 );
	equal( element.tabs( "option", "active" ), 1 );
	state( element, 0, 1, 0 );

	element.tabs( "option", "active", -10 );
	equal( element.tabs( "option", "active" ), 1 );
	state( element, 0, 1, 0 );

	element.tabs( "option", "active", -3 );
	equal( element.tabs( "option", "active" ), 0 );
	state( element, 1, 0, 0 );
});

test( "active - mismatched tab/panel order", function() {
	expect( 3 );

	location.hash = "#tabs7-2";
	var element = $( "#tabs7" ).tabs();
	equal( element.tabs( "option", "active" ), 1, "should be 1 based on URL" );
	state( element, 0, 1 );
	element.tabs( "option", "active", 0 );
	state( element, 1, 0 );
	location.hash = "#";
});

test( "collapsible", function( assert ) {
	expect( 13 );

	var element = $( "#tabs1" ).tabs({
		active: 1,
		collapsible: true
	});
	assert.hasClasses( element, "ui-tabs-collapsible" );
	element.tabs( "option", "active", false );
	equal( element.tabs( "option", "active" ), false );
	state( element, 0, 0, 0 );

	element.tabs( "option", "active", 1 );
	equal( element.tabs( "option", "active" ), 1 );
	state( element, 0, 1, 0 );

	element.find( ".ui-state-active .ui-tabs-anchor" ).trigger( "click" );
	equal( element.tabs( "option", "active" ), false );
	state( element, 0, 0, 0 );

	element.tabs( "option", "collapsible", false );
	assert.lacksClasses( element, "ui-tabs-collapsible" );

	element.tabs( "option", "collapsible", true );

	assert.hasClasses( element, "ui-tabs-collapsible" );

	element.tabs({
		active: 1,
		collapsible: false
	});
	element.tabs( "option", "active", false );
	equal( element.tabs( "option", "active" ), 1 );
	state( element, 0, 1, 0 );

	element.find( ".ui-state-active .ui-tabs-anchor" ).eq( 1 ).trigger( "click" );
	equal( element.tabs( "option", "active" ), 1 );
	state( element, 0, 1, 0 );

});

test( "disabled", function( assert ) {
	expect( 23 );

	// Fully enabled by default
	var event,
		element = $( "#tabs1" ).tabs();
	disabled( element, false );

	assert.lacksClasses( element.tabs( "widget" ), "ui-state-disabled" );
	assert.lacksClasses( element.tabs( "widget" ), "ui-tabs-disabled" );
	ok( !element.tabs( "widget" ).attr( "aria-disabled" ), "after: wrapper doesn't have aria-disabled attr" );

	// Disable single tab
	element.tabs( "option", "disabled", [ 1 ] );
	disabled( element, [ 1 ] );

	assert.lacksClasses( element.tabs( "widget" ), "ui-state-disabled" );
	assert.lacksClasses( element.tabs( "widget" ), "ui-tabs-disabled" );
	ok( !element.tabs( "widget" ).attr( "aria-disabled" ), "after: wrapper doesn't have aria-disabled attr" );

	// Disabled active tab
	element.tabs( "option", "disabled", [ 0, 1 ] );
	disabled( element, [ 0, 1 ] );

	assert.lacksClasses( element.tabs( "widget" ), "ui-state-disabled" );
	assert.lacksClasses( element.tabs( "widget" ), "ui-tabs-disabled" );
	ok( !element.tabs( "widget" ).attr( "aria-disabled" ), "after: wrapper doesn't have aria-disabled attr" );

	// Disable all tabs
	element.tabs( "option", "disabled", [ 0, 1, 2 ] );
	disabled( element, true );

	assert.lacksClasses( element.tabs( "widget" ), "ui-state-disabled" );
	assert.lacksClasses( element.tabs( "widget" ), "ui-tabs-disabled" );
	ok( !element.tabs( "widget" ).attr( "aria-disabled" ), "after: wrapper doesn't have aria-disabled attr" );

	event = $.Event( "click" );
	element.find( ".ui-tabs-anchor" ).eq( 0 ).trigger( event );
	ok( event.isDefaultPrevented(), "click is prevented for disabled tab" );

	// Enable all tabs
	element.tabs( "option", "disabled", [] );
	disabled( element, false );
});

test( "{ event: null }", function() {
	expect( 5 );

	var element = $( "#tabs1" ).tabs({
		event: null
	});
	state( element, 1, 0, 0 );

	element.tabs( "option", "active", 1 );
	equal( element.tabs( "option", "active" ), 1 );
	state( element, 0, 1, 0 );

	// Ensure default click handler isn't bound
	element.find( ".ui-tabs-nav .ui-tabs-anchor" ).eq( 2 ).trigger( "click" );
	equal( element.tabs( "option", "active" ), 1 );
	state( element, 0, 1, 0 );
});

test( "{ event: custom }", function() {
	expect( 11 );

	var element = $( "#tabs1" ).tabs({
		event: "custom1 custom2"
	});
	state( element, 1, 0, 0 );

	element.find( ".ui-tabs-nav .ui-tabs-anchor" ).eq( 1 ).trigger( "custom1" );
	equal( element.tabs( "option", "active" ), 1 );
	state( element, 0, 1, 0 );

	// Ensure default click handler isn't bound
	element.find( ".ui-tabs-nav .ui-tabs-anchor" ).eq( 2 ).trigger( "click" );
	equal( element.tabs( "option", "active" ), 1 );
	state( element, 0, 1, 0 );

	element.find( ".ui-tabs-nav .ui-tabs-anchor" ).eq( 2 ).trigger( "custom2" );
	equal( element.tabs( "option", "active" ), 2 );
	state( element, 0, 0, 1 );

	element.tabs( "option", "event", "custom3" );

	// Ensure old event handlers are unbound
	element.find( ".ui-tabs-nav .ui-tabs-anchor" ).eq( 1 ).trigger( "custom1" );
	equal( element.tabs( "option", "active" ), 2 );
	state( element, 0, 0, 1 );

	element.find( ".ui-tabs-nav .ui-tabs-anchor" ).eq( 1 ).trigger( "custom3" );
	equal( element.tabs( "option", "active" ), 1 );
	state( element, 0, 1, 0 );
});

test( "{ heightStyle: 'auto' }", function() {
	expect( 2 );
	var element = $( "#tabs8" ).tabs({ heightStyle: "auto" });
	equalHeight( element, 45 );
});

test( "{ heightStyle: 'content' }", function() {
	expect( 2 );
	var element = $( "#tabs8" ).tabs({ heightStyle: "content" }),
		sizes = element.find( ".ui-tabs-panel" ).map(function() {
			return $( this ).height();
		}).get();
	equal( sizes[ 0 ], 45 );
	equal( sizes[ 1 ], 15 );
});

test( "{ heightStyle: 'fill' }", function() {
	expect( 4 );
	$( "#tabs8Wrapper" ).height( 500 );
	var element = $( "#tabs8" ).tabs({ heightStyle: "fill" });
	equalHeight( element, 485 );
	element.tabs( "destroy" );

	element = $( "#tabs8" ).css({
		"border": "1px solid black",
		"padding": "1px 0"
	});
	element.tabs({ heightStyle: "fill" });
	equalHeight( element, 481 );
});

test( "{ heightStyle: 'fill' } with sibling", function() {
	expect( 2 );
	$( "#tabs8Wrapper" ).height( 500 );
	$( "<p>Lorem Ipsum</p>" )
		.css({
			height: 50,
			marginTop: 20,
			marginBottom: 30
		})
		.prependTo( "#tabs8Wrapper" );
	var element = $( "#tabs8" ).tabs({ heightStyle: "fill" });
	equalHeight( element, 385 );
});

test( "{ heightStyle: 'fill' } with multiple siblings", function() {
	expect( 2 );
	$( "#tabs8Wrapper" ).height( 500 );
	$( "<p>Lorem Ipsum</p>" )
		.css({
			height: 50,
			marginTop: 20,
			marginBottom: 30
		})
		.prependTo( "#tabs8Wrapper" );
	$( "<p>Lorem Ipsum</p>" )
		.css({
			height: 50,
			marginTop: 20,
			marginBottom: 30,
			position: "absolute"
		})
		.prependTo( "#tabs8Wrapper" );
	$( "<p>Lorem Ipsum</p>" )
		.css({
			height: 25,
			marginTop: 10,
			marginBottom: 15
		})
		.prependTo( "#tabs8Wrapper" );
	var element = $( "#tabs8" ).tabs({ heightStyle: "fill" });
	equalHeight( element, 335 );
});

test( "hide and show: false", function() {
	expect( 3 );
	var element = $( "#tabs1" ).tabs({
			show: false,
			hide: false
		}),
		widget = element.tabs( "instance" ),
		panels = element.find( ".ui-tabs-panel" );
	widget._show = function() {
		ok( false, "_show() called" );
	};
	widget._hide = function() {
		ok( false, "_hide() called" );
	};

	ok( panels.eq( 0 ).is( ":visible" ), "first panel visible" );
	element.tabs( "option", "active", 1 );
	ok( panels.eq( 0 ).is( ":hidden" ), "first panel hidden" );
	ok( panels.eq( 1 ).is( ":visible" ), "second panel visible" );
});

asyncTest( "hide and show - animation", function() {
	expect( 5 );
	var element = $( "#tabs1" ).tabs({
			show: "drop",
			hide: 2000
		}),
		widget = element.tabs( "instance" ),
		panels = element.find( ".ui-tabs-panel" );
	widget._show = function( element, options, callback ) {
		strictEqual( element[ 0 ], panels[ 1 ], "correct element in _show()" );
		equal( options, "drop", "correct options in _show()" );
		setTimeout(function() {
			callback();
		});
	};
	widget._hide = function( element, options, callback ) {
		strictEqual( element[ 0 ], panels[ 0 ], "correct element in _hide()" );
		equal( options, 2000, "correct options in _hide()" );
		setTimeout(function() {
			callback();
			start();
		});
	};

	ok( panels.eq( 0 ).is( ":visible" ), "first panel visible" );
	element.tabs( "option", "active", 1 );
});

} );
