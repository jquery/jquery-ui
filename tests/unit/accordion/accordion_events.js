(function( $ ) {

module( "accordion: events", accordionSetupTeardown() );

test( "beforeActivate", function() {
	expect( 38 );
	var ac = $( "#list1" ).accordion({
		active: false,
		collapsible: true
	});
	var headers = ac.find( ".ui-accordion-header" );
	var content = ac.find( ".ui-accordion-content" );

	ac.one( "accordionbeforeactivate", function( event, ui ) {
		ok( !( "originalEvent" in event ) );
		equals( ui.oldHeader.size(), 0 );
		equals( ui.oldContent.size(), 0 );
		equals( ui.newHeader.size(), 1 );
		strictEqual( ui.newHeader[ 0 ], headers[ 0 ] );
		equals( ui.newContent.size(), 1 );
		strictEqual( ui.newContent[ 0 ], content[ 0 ] );
		state( ac, 0, 0, 0 );
	});
	ac.accordion( "option", "active", 0 );
	state( ac, 1, 0, 0 );

	ac.one( "accordionbeforeactivate", function( event, ui ) {
		equals( event.originalEvent.type, "click" );
		equals( ui.oldHeader.size(), 1 );
		strictEqual( ui.oldHeader[ 0 ], headers[ 0 ] );
		equals( ui.oldContent.size(), 1 );
		strictEqual( ui.oldContent[ 0 ], content[ 0 ] );
		equals( ui.newHeader.size(), 1 );
		strictEqual( ui.newHeader[ 0 ], headers[ 1 ] );
		equals( ui.newContent.size(), 1 );
		strictEqual( ui.newContent[ 0 ], content[ 1 ] );
		state( ac, 1, 0, 0 );
	});
	headers.eq( 1 ).click();
	state( ac, 0, 1, 0 );

	ac.one( "accordionbeforeactivate", function( event, ui ) {
		ok( !( "originalEvent" in event ) );
		equals( ui.oldHeader.size(), 1 );
		strictEqual( ui.oldHeader[ 0 ], headers[ 1 ] );
		equals( ui.oldContent.size(), 1 );
		strictEqual( ui.oldContent[ 0 ], content[ 1 ] );
		equals( ui.newHeader.size(), 0 );
		equals( ui.newContent.size(), 0 );
		state( ac, 0, 1, 0 );
	});
	ac.accordion( "option", "active", false );
	state( ac, 0, 0, 0 );

	ac.one( "accordionbeforeactivate", function( event, ui ) {
		ok( !( "originalEvent" in event ) );
		equals( ui.oldHeader.size(), 0 );
		equals( ui.oldContent.size(), 0 );
		equals( ui.newHeader.size(), 1 );
		strictEqual( ui.newHeader[ 0 ], headers[ 2 ] );
		equals( ui.newContent.size(), 1 );
		strictEqual( ui.newContent[ 0 ], content[ 2 ] );
		event.preventDefault();
		state( ac, 0, 0, 0 );
	});
	ac.accordion( "option", "active", 2 );
	state( ac, 0, 0, 0 );
});

test( "activate", function() {
	expect( 21 );
	var ac = $( "#list1" ).accordion({
		active: false,
		collapsible: true
	});
	var headers = ac.find( ".ui-accordion-header" );
	var content = ac.find( ".ui-accordion-content" );

	ac.one( "accordionactivate", function( event, ui ) {
		equals( ui.oldHeader.size(), 0 );
		equals( ui.oldContent.size(), 0 );
		equals( ui.newHeader.size(), 1 );
		strictEqual( ui.newHeader[ 0 ], headers[ 0 ] );
		equals( ui.newContent.size(), 1 );
		strictEqual( ui.newContent[ 0 ], content[ 0 ] );
	});
	ac.accordion( "option", "active", 0 );

	ac.one( "accordionactivate", function( event, ui ) {
		equals( ui.oldHeader.size(), 1 );
		strictEqual( ui.oldHeader[ 0 ], headers[ 0 ] );
		equals( ui.oldContent.size(), 1 );
		strictEqual( ui.oldContent[ 0 ], content[ 0 ] );
		equals( ui.newHeader.size(), 1 );
		strictEqual( ui.newHeader[ 0 ], headers[ 1 ] );
		equals( ui.newContent.size(), 1 );
		strictEqual( ui.newContent[ 0 ], content[ 1 ] );
	});
	headers.eq( 1 ).click();

	ac.one( "accordionactivate", function( event, ui ) {
		equals( ui.oldHeader.size(), 1 );
		strictEqual( ui.oldHeader[ 0 ], headers[ 1 ] );
		equals( ui.oldContent.size(), 1 );
		strictEqual( ui.oldContent[ 0 ], content[ 1 ] );
		equals( ui.newHeader.size(), 0 );
		equals( ui.newContent.size(), 0 );
	});
	ac.accordion( "option", "active", false );

	// prevent activation
	ac.one( "accordionbeforeactivate", function( event ) {
		ok( true );
		event.preventDefault();
	});
	ac.one( "accordionactivate", function() {
		ok( false );
	});
	ac.accordion( "option", "active", 1 );
});

}( jQuery ) );
