define( [
	"qunit",
	"jquery",
	"./helper",
	"ui/widgets/accordion"
], function( QUnit, $, testHelper ) {

var beforeAfterEach = testHelper.beforeAfterEach,
	state = testHelper.state;

QUnit.module( "accordion: events", beforeAfterEach() );

QUnit.test( "create", function( assert ) {
	assert.expect( 10 );

	var element = $( "#list1" ),
		headers = element.children( "h3" ),
		contents = headers.next();

	element.accordion( {
		create: function( event, ui ) {
			assert.equal( ui.header.length, 1, "header length" );
			assert.strictEqual( ui.header[ 0 ], headers[ 0 ], "header" );
			assert.equal( ui.panel.length, 1, "panel length" );
			assert.strictEqual( ui.panel[ 0 ], contents[ 0 ], "panel" );
		}
	} );
	element.accordion( "destroy" );

	element.accordion( {
		active: 2,
		create: function( event, ui ) {
			assert.equal( ui.header.length, 1, "header length" );
			assert.strictEqual( ui.header[ 0 ], headers[ 2 ], "header" );
			assert.equal( ui.panel.length, 1, "panel length" );
			assert.strictEqual( ui.panel[ 0 ], contents[ 2 ], "panel" );
		}
	} );
	element.accordion( "destroy" );

	element.accordion( {
		active: false,
		collapsible: true,
		create: function( event, ui ) {
			assert.equal( ui.header.length, 0, "header length" );
			assert.equal( ui.panel.length, 0, "panel length" );
		}
	} );
	element.accordion( "destroy" );
} );

QUnit.test( "beforeActivate", function( assert ) {
	assert.expect( 38 );
	var element = $( "#list1" ).accordion( {
			active: false,
			collapsible: true
		} ),
		headers = element.find( ".ui-accordion-header" ),
		content = element.find( ".ui-accordion-content" );

	element.one( "accordionbeforeactivate", function( event, ui ) {
		assert.ok( !( "originalEvent" in event ) );
		assert.equal( ui.oldHeader.length, 0 );
		assert.equal( ui.oldPanel.length, 0 );
		assert.equal( ui.newHeader.length, 1 );
		assert.strictEqual( ui.newHeader[ 0 ], headers[ 0 ] );
		assert.equal( ui.newPanel.length, 1 );
		assert.strictEqual( ui.newPanel[ 0 ], content[ 0 ] );
		state( assert, element, 0, 0, 0 );
	} );
	element.accordion( "option", "active", 0 );
	state( assert, element, 1, 0, 0 );

	element.one( "accordionbeforeactivate", function( event, ui ) {
		assert.equal( event.originalEvent.type, "click" );
		assert.equal( ui.oldHeader.length, 1 );
		assert.strictEqual( ui.oldHeader[ 0 ], headers[ 0 ] );
		assert.equal( ui.oldPanel.length, 1 );
		assert.strictEqual( ui.oldPanel[ 0 ], content[ 0 ] );
		assert.equal( ui.newHeader.length, 1 );
		assert.strictEqual( ui.newHeader[ 0 ], headers[ 1 ] );
		assert.equal( ui.newPanel.length, 1 );
		assert.strictEqual( ui.newPanel[ 0 ], content[ 1 ] );
		state( assert, element, 1, 0, 0 );
	} );
	headers.eq( 1 ).trigger( "click" );
	state( assert, element, 0, 1, 0 );

	element.one( "accordionbeforeactivate", function( event, ui ) {
		assert.ok( !( "originalEvent" in event ) );
		assert.equal( ui.oldHeader.length, 1 );
		assert.strictEqual( ui.oldHeader[ 0 ], headers[ 1 ] );
		assert.equal( ui.oldPanel.length, 1 );
		assert.strictEqual( ui.oldPanel[ 0 ], content[ 1 ] );
		assert.equal( ui.newHeader.length, 0 );
		assert.equal( ui.newPanel.length, 0 );
		state( assert, element, 0, 1, 0 );
	} );
	element.accordion( "option", "active", false );
	state( assert, element, 0, 0, 0 );

	element.one( "accordionbeforeactivate", function( event, ui ) {
		assert.ok( !( "originalEvent" in event ) );
		assert.equal( ui.oldHeader.length, 0 );
		assert.equal( ui.oldPanel.length, 0 );
		assert.equal( ui.newHeader.length, 1 );
		assert.strictEqual( ui.newHeader[ 0 ], headers[ 2 ] );
		assert.equal( ui.newPanel.length, 1 );
		assert.strictEqual( ui.newPanel[ 0 ], content[ 2 ] );
		event.preventDefault();
		state( assert, element, 0, 0, 0 );
	} );
	element.accordion( "option", "active", 2 );
	state( assert, element, 0, 0, 0 );
} );

QUnit.test( "activate", function( assert ) {
	assert.expect( 21 );
	var element = $( "#list1" ).accordion( {
			active: false,
			collapsible: true
		} ),
		headers = element.find( ".ui-accordion-header" ),
		content = element.find( ".ui-accordion-content" );

	element.one( "accordionactivate", function( event, ui ) {
		assert.equal( ui.oldHeader.length, 0 );
		assert.equal( ui.oldPanel.length, 0 );
		assert.equal( ui.newHeader.length, 1 );
		assert.strictEqual( ui.newHeader[ 0 ], headers[ 0 ] );
		assert.equal( ui.newPanel.length, 1 );
		assert.strictEqual( ui.newPanel[ 0 ], content[ 0 ] );
	} );
	element.accordion( "option", "active", 0 );

	element.one( "accordionactivate", function( event, ui ) {
		assert.equal( ui.oldHeader.length, 1 );
		assert.strictEqual( ui.oldHeader[ 0 ], headers[ 0 ] );
		assert.equal( ui.oldPanel.length, 1 );
		assert.strictEqual( ui.oldPanel[ 0 ], content[ 0 ] );
		assert.equal( ui.newHeader.length, 1 );
		assert.strictEqual( ui.newHeader[ 0 ], headers[ 1 ] );
		assert.equal( ui.newPanel.length, 1 );
		assert.strictEqual( ui.newPanel[ 0 ], content[ 1 ] );
	} );
	headers.eq( 1 ).trigger( "click" );

	element.one( "accordionactivate", function( event, ui ) {
		assert.equal( ui.oldHeader.length, 1 );
		assert.strictEqual( ui.oldHeader[ 0 ], headers[ 1 ] );
		assert.equal( ui.oldPanel.length, 1 );
		assert.strictEqual( ui.oldPanel[ 0 ], content[ 1 ] );
		assert.equal( ui.newHeader.length, 0 );
		assert.equal( ui.newPanel.length, 0 );
	} );
	element.accordion( "option", "active", false );

	// Prevent activation
	element.one( "accordionbeforeactivate", function( event ) {
		assert.ok( true );
		event.preventDefault();
	} );
	element.one( "accordionactivate", function() {
		assert.ok( false );
	} );
	element.accordion( "option", "active", 1 );
} );

} );
