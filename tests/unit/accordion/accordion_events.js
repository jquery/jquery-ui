(function( $ ) {

module( "accordion: events", accordionSetupTeardown() );

test( "beforeActivate", function() {
	expect( 20 );
	var ac = $( "#list1" ).accordion({
		active: false,
		collapsible: true
	});
	var headers = ac.find( ".ui-accordion-header" );
	var content = ac.find( ".ui-accordion-content" );

	ac.one( "accordionbeforeactivate", function( event, ui ) {
		equals( ui.oldHeader.size(), 0 );
		equals( ui.oldContent.size(), 0 );
		equals( ui.newHeader.size(), 1 );
		strictEqual( ui.newHeader[ 0 ], headers[ 0 ] );
		equals( ui.newContent.size(), 1 );
		strictEqual( ui.newContent[ 0 ], content[ 0 ] );
	});
	ac.accordion( "option", "active", 0 );

	ac.one( "accordionbeforeactivate", function( event, ui ) {
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

	ac.one( "accordionbeforeactivate", function( event, ui ) {
		equals( ui.oldHeader.size(), 1 );
		strictEqual( ui.oldHeader[ 0 ], headers[ 1 ] );
		equals( ui.oldContent.size(), 1 );
		strictEqual( ui.oldContent[ 0 ], content[ 1 ] );
		equals( ui.newHeader.size(), 0 );
		equals( ui.newContent.size(), 0 );
	});
	ac.accordion( "option", "active", false );
});

test( "activate", function() {
	expect( 20 );
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
});

}( jQuery ) );
