(function( $ ) {

var equalHeight = TestHelpers.accordion.equalHeight,
	setupTeardown = TestHelpers.accordion.setupTeardown,
	state = TestHelpers.accordion.state;

module( "accordion (deprecated) - resize", setupTeardown() );

test( "resize", function() {
	expect( 6 );
	var element = $( "#navigation" )
		.parent()
			.height( 300 )
		.end()
		.accordion({
			heightStyle: "fill"
		});
	equalHeight( element, 255 );

	element.parent().height( 500 );
	element.accordion( "resize" );
	equalHeight( element, 455 );
});





module( "accordion (deprecated) - changestart/change events", setupTeardown() );

test( "changestart", function() {
	expect( 26 );
	var element = $( "#list1" ).accordion({
			active: false,
			collapsible: true
		}),
		headers = element.find( ".ui-accordion-header" ),
		content = element.find( ".ui-accordion-content" );

	element.one( "accordionchangestart", function( event, ui ) {
		equal( ui.oldHeader.length, 0 );
		equal( ui.oldContent.length, 0 );
		equal( ui.newHeader.length, 1 );
		strictEqual( ui.newHeader[ 0 ], headers[ 0 ] );
		equal( ui.newContent.length, 1 );
		strictEqual( ui.newContent[ 0 ], content[ 0 ] );
		state( element, 0, 0, 0 );
	});
	element.accordion( "option", "active", 0 );
	state( element, 1, 0, 0 );

	element.one( "accordionchangestart", function( event, ui ) {
		equal( ui.oldHeader.length, 1 );
		strictEqual( ui.oldHeader[ 0 ], headers[ 0 ] );
		equal( ui.oldContent.length, 1 );
		strictEqual( ui.oldContent[ 0 ], content[ 0 ] );
		equal( ui.newHeader.length, 1 );
		strictEqual( ui.newHeader[ 0 ], headers[ 1 ] );
		equal( ui.newContent.length, 1 );
		strictEqual( ui.newContent[ 0 ], content[ 1 ] );
		state( element, 1, 0, 0 );
	});
	headers.eq( 1 ).click();
	state( element, 0, 1, 0 );

	element.one( "accordionchangestart", function( event, ui ) {
		equal( ui.oldHeader.length, 1 );
		strictEqual( ui.oldHeader[ 0 ], headers[ 1 ] );
		equal( ui.oldContent.length, 1 );
		strictEqual( ui.oldContent[ 0 ], content[ 1 ] );
		equal( ui.newHeader.length, 0 );
		equal( ui.newContent.length, 0 );
		state( element, 0, 1, 0 );
	});
	element.accordion( "option", "active", false );
	state( element, 0, 0, 0 );
});

test( "change", function() {
	expect( 20 );
	var element = $( "#list1" ).accordion({
			active: false,
			collapsible: true
		}),
		headers = element.find( ".ui-accordion-header" ),
		content = element.find( ".ui-accordion-content" );

	element.one( "accordionchange", function( event, ui ) {
		equal( ui.oldHeader.length, 0 );
		equal( ui.oldContent.length, 0 );
		equal( ui.newHeader.length, 1 );
		strictEqual( ui.newHeader[ 0 ], headers[ 0 ] );
		equal( ui.newContent.length, 1 );
		strictEqual( ui.newContent[ 0 ], content[ 0 ] );
	});
	element.accordion( "option", "active", 0 );

	element.one( "accordionchange", function( event, ui ) {
		equal( ui.oldHeader.length, 1 );
		strictEqual( ui.oldHeader[ 0 ], headers[ 0 ] );
		equal( ui.oldContent.length, 1 );
		strictEqual( ui.oldContent[ 0 ], content[ 0 ] );
		equal( ui.newHeader.length, 1 );
		strictEqual( ui.newHeader[ 0 ], headers[ 1 ] );
		equal( ui.newContent.length, 1 );
		strictEqual( ui.newContent[ 0 ], content[ 1 ] );
	});
	headers.eq( 1 ).click();

	element.one( "accordionchange", function( event, ui ) {
		equal( ui.oldHeader.length, 1 );
		strictEqual( ui.oldHeader[ 0 ], headers[ 1 ] );
		equal( ui.oldContent.length, 1 );
		strictEqual( ui.oldContent[ 0 ], content[ 1 ] );
		equal( ui.newHeader.length, 0 );
		equal( ui.newContent.length, 0 );
	});
	element.accordion( "option", "active", false );
});

})(jQuery);
