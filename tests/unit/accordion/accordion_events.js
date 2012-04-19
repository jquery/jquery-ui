(function( $ ) {

var setupTeardown = TestHelpers.accordion.setupTeardown,
	state = TestHelpers.accordion.state;

module( "accordion: events", setupTeardown() );

test( "create", function() {
	expect( 10 );

	var element = $( "#list1" ),
		headers = element.children( "h3" ),
		contents = headers.next();

	element.accordion({
		create: function( event, ui ) {
			equal( ui.header.size(), 1, "header size" );
			strictEqual( ui.header[ 0 ], headers[ 0 ], "header" );
			equal( ui.content.size(), 1, "content size" );
			strictEqual( ui.content[ 0 ], contents[ 0 ], "content" );
		}
	});
	element.accordion( "destroy" );

	element.accordion({
		active: 2,
		create: function( event, ui ) {
			equal( ui.header.size(), 1, "header size" );
			strictEqual( ui.header[ 0 ], headers[ 2 ], "header" );
			equal( ui.content.size(), 1, "content size" );
			strictEqual( ui.content[ 0 ], contents[ 2 ], "content" );
		}
	});
	element.accordion( "destroy" );

	element.accordion({
		active: false,
		collapsible: true,
		create: function( event, ui ) {
			equal( ui.header.size(), 0, "header size" );
			equal( ui.content.size(), 0, "content size" );
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
		equal( ui.oldHeader.size(), 0 );
		equal( ui.oldContent.size(), 0 );
		equal( ui.newHeader.size(), 1 );
		strictEqual( ui.newHeader[ 0 ], headers[ 0 ] );
		equal( ui.newContent.size(), 1 );
		strictEqual( ui.newContent[ 0 ], content[ 0 ] );
		state( element, 0, 0, 0 );
	});
	element.accordion( "option", "active", 0 );
	state( element, 1, 0, 0 );

	element.one( "accordionbeforeactivate", function( event, ui ) {
		equal( event.originalEvent.type, "click" );
		equal( ui.oldHeader.size(), 1 );
		strictEqual( ui.oldHeader[ 0 ], headers[ 0 ] );
		equal( ui.oldContent.size(), 1 );
		strictEqual( ui.oldContent[ 0 ], content[ 0 ] );
		equal( ui.newHeader.size(), 1 );
		strictEqual( ui.newHeader[ 0 ], headers[ 1 ] );
		equal( ui.newContent.size(), 1 );
		strictEqual( ui.newContent[ 0 ], content[ 1 ] );
		state( element, 1, 0, 0 );
	});
	headers.eq( 1 ).click();
	state( element, 0, 1, 0 );

	element.one( "accordionbeforeactivate", function( event, ui ) {
		ok( !( "originalEvent" in event ) );
		equal( ui.oldHeader.size(), 1 );
		strictEqual( ui.oldHeader[ 0 ], headers[ 1 ] );
		equal( ui.oldContent.size(), 1 );
		strictEqual( ui.oldContent[ 0 ], content[ 1 ] );
		equal( ui.newHeader.size(), 0 );
		equal( ui.newContent.size(), 0 );
		state( element, 0, 1, 0 );
	});
	element.accordion( "option", "active", false );
	state( element, 0, 0, 0 );

	element.one( "accordionbeforeactivate", function( event, ui ) {
		ok( !( "originalEvent" in event ) );
		equal( ui.oldHeader.size(), 0 );
		equal( ui.oldContent.size(), 0 );
		equal( ui.newHeader.size(), 1 );
		strictEqual( ui.newHeader[ 0 ], headers[ 2 ] );
		equal( ui.newContent.size(), 1 );
		strictEqual( ui.newContent[ 0 ], content[ 2 ] );
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
		equal( ui.oldHeader.size(), 0 );
		equal( ui.oldContent.size(), 0 );
		equal( ui.newHeader.size(), 1 );
		strictEqual( ui.newHeader[ 0 ], headers[ 0 ] );
		equal( ui.newContent.size(), 1 );
		strictEqual( ui.newContent[ 0 ], content[ 0 ] );
	});
	element.accordion( "option", "active", 0 );

	element.one( "accordionactivate", function( event, ui ) {
		equal( ui.oldHeader.size(), 1 );
		strictEqual( ui.oldHeader[ 0 ], headers[ 0 ] );
		equal( ui.oldContent.size(), 1 );
		strictEqual( ui.oldContent[ 0 ], content[ 0 ] );
		equal( ui.newHeader.size(), 1 );
		strictEqual( ui.newHeader[ 0 ], headers[ 1 ] );
		equal( ui.newContent.size(), 1 );
		strictEqual( ui.newContent[ 0 ], content[ 1 ] );
	});
	headers.eq( 1 ).click();

	element.one( "accordionactivate", function( event, ui ) {
		equal( ui.oldHeader.size(), 1 );
		strictEqual( ui.oldHeader[ 0 ], headers[ 1 ] );
		equal( ui.oldContent.size(), 1 );
		strictEqual( ui.oldContent[ 0 ], content[ 1 ] );
		equal( ui.newHeader.size(), 0 );
		equal( ui.newContent.size(), 0 );
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

}( jQuery ) );
