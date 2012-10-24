(function( $ ) {

var equalHeight = TestHelpers.accordion.equalHeight,
	setupTeardown = TestHelpers.accordion.setupTeardown,
	state = TestHelpers.accordion.state;

module( "accordion (deprecated): expanded active option, activate method", setupTeardown() );

test( "activate, numeric", function() {
	expect( 5 );
	var element = $( "#list1" ).accordion({ active: 1 });
	state( element, 0, 1, 0 );
	element.accordion( "activate", 2 );
	state( element, 0, 0, 1 );
	element.accordion( "activate", 0 );
	state( element, 1, 0, 0 );
	element.accordion( "activate", 1 );
	state( element, 0, 1, 0 );
	element.accordion( "activate", 2 );
	state( element, 0, 0, 1 );
});

test( "activate, numeric, collapsible:true", function() {
	expect( 3 );
	var element = $( "#list1" ).accordion({ collapsible: true });
	element.accordion( "activate", 2 );
	state( element, 0, 0, 1 );
	element.accordion( "activate", 0 );
	state( element, 1, 0, 0 );
	element.accordion( "activate", -1 );
	state( element, 0, 0, 0 );
});

test( "activate, boolean, collapsible: true", function() {
	expect( 2 );
	var element = $( "#list1" ).accordion({ collapsible: true });
	element.accordion( "activate", 2 );
	state( element, 0, 0, 1 );
	element.accordion( "activate", false );
	state( element, 0, 0, 0 );
});

test( "activate, boolean, collapsible: false", function() {
	expect( 2 );
	var element = $( "#list1" ).accordion();
	element.accordion( "activate", 2 );
	state( element, 0, 0, 1 );
	element.accordion( "activate", false );
	state( element, 0, 0, 1 );
});

test( "activate, string expression", function() {
	expect( 4 );
	var element = $( "#list1" ).accordion({ active: "h3:last" });
	state( element, 0, 0, 1 );
	element.accordion( "activate", ":first" );
	state( element, 1, 0, 0 );
	element.accordion( "activate", ":eq(1)" );
	state( element, 0, 1, 0 );
	element.accordion( "activate", ":last" );
	state( element, 0, 0, 1 );
});

test( "activate, jQuery or DOM element", function() {
	expect( 3 );
	var element = $( "#list1" ).accordion({ active: $( "#list1 h3:last" ) });
	state( element, 0, 0, 1 );
	element.accordion( "activate", $( "#list1 h3:first" ) );
	state( element, 1, 0, 0 );
	element.accordion( "activate", $( "#list1 h3" )[ 1 ] );
	state( element, 0, 1, 0 );
});

test( "{ active: Selector }", function() {
	expect( 2 );
	var element = $("#list1").accordion({
		active: "h3:last"
	});
	state( element, 0, 0, 1 );
	element.accordion( "option", "active", "h3:eq(1)" );
	state( element, 0, 1, 0 );
});

test( "{ active: Element }", function() {
	expect( 2 );
	var element = $( "#list1" ).accordion({
		active: $( "#list1 h3:last" )[ 0 ]
	});
	state( element, 0, 0, 1 );
	element.accordion( "option", "active", $( "#list1 h3:eq(1)" )[ 0 ] );
	state( element, 0, 1, 0 );
});

test( "{ active: jQuery Object }", function() {
	expect( 2 );
	var element = $( "#list1" ).accordion({
		active: $( "#list1 h3:last" )
	});
	state( element, 0, 0, 1 );
	element.accordion( "option", "active", $( "#list1 h3:eq(1)" ) );
	state( element, 0, 1, 0 );
});




module( "accordion (deprecated) - icons", setupTeardown() );

test( "icons, headerSelected", function() {
	expect( 3 );
	var element = $( "#list1" ).accordion({
		icons: { headerSelected: "a1", header: "h1" }
	});
	ok( element.find( ".ui-accordion-header.ui-state-active span.ui-icon" ).hasClass( "a1" ) );
	element.accordion( "option", "icons", { headerSelected: "a2", header: "h2" } );
	ok( !element.find( ".ui-accordion-header.ui-state-active span.ui-icon" ).hasClass( "a1" ) );
	ok( element.find( ".ui-accordion-header.ui-state-active span.ui-icon" ).hasClass( "a2" ) );
});





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
