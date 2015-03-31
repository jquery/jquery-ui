define([
	"jquery",
	"./accordion_test_helpers",
	"ui/accordion"
], function( $, accordionTestHelper ) {

var setupTeardown = accordionTestHelper.setupTeardown,
	state = accordionTestHelper.state;

module( "accordion: events", setupTeardown() );

test( "create", function() {
	expect( 10 );

	var element = $( "#list1" ),
		headers = element.children( "h3" ),
		contents = headers.next();

	element.accordion({
		create: function( event, ui ) {
			equal( ui.header.length, 1, "header length" );
			strictEqual( ui.header[ 0 ], headers[ 0 ], "header" );
			equal( ui.panel.length, 1, "panel length" );
			strictEqual( ui.panel[ 0 ], contents[ 0 ], "panel" );
		}
	});
	element.accordion( "destroy" );

	element.accordion({
		active: 2,
		create: function( event, ui ) {
			equal( ui.header.length, 1, "header length" );
			strictEqual( ui.header[ 0 ], headers[ 2 ], "header" );
			equal( ui.panel.length, 1, "panel length" );
			strictEqual( ui.panel[ 0 ], contents[ 2 ], "panel" );
		}
	});
	element.accordion( "destroy" );

	element.accordion({
		active: false,
		collapsible: true,
		create: function( event, ui ) {
			equal( ui.header.length, 0, "header length" );
			equal( ui.panel.length, 0, "panel length" );
		}
	});
	element.accordion( "destroy" );
});

test( "beforeActivate", function() {
	expect( 38 );
	var element = $( "#list1" ).accordion({
			active: false,
			collapsible: true
		}),
		headers = element.find( ".ui-accordion-header" ),
		content = element.find( ".ui-accordion-content" );

	element.one( "accordionbeforeactivate", function( event, ui ) {
		ok( !( "originalEvent" in event ) );
		equal( ui.oldHeader.length, 0 );
		equal( ui.oldPanel.length, 0 );
		equal( ui.newHeader.length, 1 );
		strictEqual( ui.newHeader[ 0 ], headers[ 0 ] );
		equal( ui.newPanel.length, 1 );
		strictEqual( ui.newPanel[ 0 ], content[ 0 ] );
		state( element, 0, 0, 0 );
	});
	element.accordion( "option", "active", 0 );
	state( element, 1, 0, 0 );

	element.one( "accordionbeforeactivate", function( event, ui ) {
		equal( event.originalEvent.type, "click" );
		equal( ui.oldHeader.length, 1 );
		strictEqual( ui.oldHeader[ 0 ], headers[ 0 ] );
		equal( ui.oldPanel.length, 1 );
		strictEqual( ui.oldPanel[ 0 ], content[ 0 ] );
		equal( ui.newHeader.length, 1 );
		strictEqual( ui.newHeader[ 0 ], headers[ 1 ] );
		equal( ui.newPanel.length, 1 );
		strictEqual( ui.newPanel[ 0 ], content[ 1 ] );
		state( element, 1, 0, 0 );
	});
	headers.eq( 1 ).click();
	state( element, 0, 1, 0 );

	element.one( "accordionbeforeactivate", function( event, ui ) {
		ok( !( "originalEvent" in event ) );
		equal( ui.oldHeader.length, 1 );
		strictEqual( ui.oldHeader[ 0 ], headers[ 1 ] );
		equal( ui.oldPanel.length, 1 );
		strictEqual( ui.oldPanel[ 0 ], content[ 1 ] );
		equal( ui.newHeader.length, 0 );
		equal( ui.newPanel.length, 0 );
		state( element, 0, 1, 0 );
	});
	element.accordion( "option", "active", false );
	state( element, 0, 0, 0 );

	element.one( "accordionbeforeactivate", function( event, ui ) {
		ok( !( "originalEvent" in event ) );
		equal( ui.oldHeader.length, 0 );
		equal( ui.oldPanel.length, 0 );
		equal( ui.newHeader.length, 1 );
		strictEqual( ui.newHeader[ 0 ], headers[ 2 ] );
		equal( ui.newPanel.length, 1 );
		strictEqual( ui.newPanel[ 0 ], content[ 2 ] );
		event.preventDefault();
		state( element, 0, 0, 0 );
	});
	element.accordion( "option", "active", 2 );
	state( element, 0, 0, 0 );
});

test( "activate", function() {
	expect( 21 );
	var element = $( "#list1" ).accordion({
			active: false,
			collapsible: true
		}),
		headers = element.find( ".ui-accordion-header" ),
		content = element.find( ".ui-accordion-content" );

	element.one( "accordionactivate", function( event, ui ) {
		equal( ui.oldHeader.length, 0 );
		equal( ui.oldPanel.length, 0 );
		equal( ui.newHeader.length, 1 );
		strictEqual( ui.newHeader[ 0 ], headers[ 0 ] );
		equal( ui.newPanel.length, 1 );
		strictEqual( ui.newPanel[ 0 ], content[ 0 ] );
	});
	element.accordion( "option", "active", 0 );

	element.one( "accordionactivate", function( event, ui ) {
		equal( ui.oldHeader.length, 1 );
		strictEqual( ui.oldHeader[ 0 ], headers[ 0 ] );
		equal( ui.oldPanel.length, 1 );
		strictEqual( ui.oldPanel[ 0 ], content[ 0 ] );
		equal( ui.newHeader.length, 1 );
		strictEqual( ui.newHeader[ 0 ], headers[ 1 ] );
		equal( ui.newPanel.length, 1 );
		strictEqual( ui.newPanel[ 0 ], content[ 1 ] );
	});
	headers.eq( 1 ).click();

	element.one( "accordionactivate", function( event, ui ) {
		equal( ui.oldHeader.length, 1 );
		strictEqual( ui.oldHeader[ 0 ], headers[ 1 ] );
		equal( ui.oldPanel.length, 1 );
		strictEqual( ui.oldPanel[ 0 ], content[ 1 ] );
		equal( ui.newHeader.length, 0 );
		equal( ui.newPanel.length, 0 );
	});
	element.accordion( "option", "active", false );

	// prevent activation
	element.one( "accordionbeforeactivate", function( event ) {
		ok( true );
		event.preventDefault();
	});
	element.one( "accordionactivate", function() {
		ok( false );
	});
	element.accordion( "option", "active", 1 );
});

});
