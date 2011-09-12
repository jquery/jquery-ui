(function( $ ) {

module( "accordion (deprecated): expanded active option, activate method", accordion_setupTeardown() );

test( "activate, numeric", function() {
	expect( 5 );
	var element = $( "#list1" ).accordion({ active: 1 });
	accordion_state( element, 0, 1, 0 );
	element.accordion( "activate", 2 );
	accordion_state( element, 0, 0, 1 );
	element.accordion( "activate", 0 );
	accordion_state( element, 1, 0, 0 );
	element.accordion( "activate", 1 );
	accordion_state( element, 0, 1, 0 );
	element.accordion( "activate", 2 );
	accordion_state( element, 0, 0, 1 );
});

test( "activate, numeric, collapsible:true", function() {
	expect( 3 );
	var element = $( "#list1" ).accordion({ collapsible: true });
	element.accordion( "activate", 2 );
	accordion_state( element, 0, 0, 1 );
	element.accordion( "activate", 0 );
	accordion_state( element, 1, 0, 0 );
	element.accordion( "activate", -1 );
	accordion_state( element, 0, 0, 0 );
});

test( "activate, boolean, collapsible: true", function() {
	expect( 2 );
	var element = $( "#list1" ).accordion({ collapsible: true });
	element.accordion( "activate", 2 );
	accordion_state( element, 0, 0, 1 );
	element.accordion( "activate", false );
	accordion_state( element, 0, 0, 0 );
});

test( "activate, boolean, collapsible: false", function() {
	expect( 2 );
	var element = $( "#list1" ).accordion();
	element.accordion( "activate", 2 );
	accordion_state( element, 0, 0, 1 );
	element.accordion( "activate", false );
	accordion_state( element, 0, 0, 1 );
});

test( "activate, string expression", function() {
	expect( 4 );
	var element = $( "#list1" ).accordion({ active: "h3:last" });
	accordion_state( element, 0, 0, 1 );
	element.accordion( "activate", ":first" );
	accordion_state( element, 1, 0, 0 );
	element.accordion( "activate", ":eq(1)" );
	accordion_state( element, 0, 1, 0 );
	element.accordion( "activate", ":last" );
	accordion_state( element, 0, 0, 1 );
});

test( "activate, jQuery or DOM element", function() {
	expect( 3 );
	var element = $( "#list1" ).accordion({ active: $( "#list1 h3:last" ) });
	accordion_state( element, 0, 0, 1 );
	element.accordion( "activate", $( "#list1 h3:first" ) );
	accordion_state( element, 1, 0, 0 );
	element.accordion( "activate", $( "#list1 h3" )[ 1 ] );
	accordion_state( element, 0, 1, 0 );
});

test( "{ active: Selector }", function() {
	expect( 2 );
	var element = $("#list1").accordion({
		active: "h3:last"
	});
	accordion_state( element, 0, 0, 1 );
	element.accordion( "option", "active", "h3:eq(1)" );
	accordion_state( element, 0, 1, 0 );
});

test( "{ active: Element }", function() {
	expect( 2 );
	var element = $( "#list1" ).accordion({
		active: $( "#list1 h3:last" )[ 0 ]
	});
	accordion_state( element, 0, 0, 1 );
	element.accordion( "option", "active", $( "#list1 h3:eq(1)" )[ 0 ] );
	accordion_state( element, 0, 1, 0 );
});

test( "{ active: jQuery Object }", function() {
	expect( 2 );
	var element = $( "#list1" ).accordion({
		active: $( "#list1 h3:last" )
	});
	accordion_state( element, 0, 0, 1 );
	element.accordion( "option", "active", $( "#list1 h3:eq(1)" ) );
	accordion_state( element, 0, 1, 0 );
});





module( "accordion (deprecated) - height options", accordion_setupTeardown() );

test( "{ autoHeight: true }, default", function() {
	expect( 3 );
	accordion_equalHeights( $( "#navigation" ).accordion({ autoHeight: true }), 95, 130 );
});

test( "{ autoHeight: false }", function() {
	expect( 3 );
	var element = $( "#navigation" ).accordion({ autoHeight: false });
	var sizes = [];
	element.find( ".ui-accordion-content" ).each(function() {
		sizes.push( $(this).height() );
	});
	ok( sizes[0] >= 70 && sizes[0] <= 105, "was " + sizes[0] );
	ok( sizes[1] >= 98 && sizes[1] <= 126, "was " + sizes[1] );
	ok( sizes[2] >= 42 && sizes[2] <= 54, "was " + sizes[2] );
});

test( "{ fillSpace: true }", function() {
	expect( 3 );
	$( "#navigationWrapper" ).height( 500 );
	var element = $( "#navigation" ).accordion({ fillSpace: true });
	accordion_equalHeights( element, 446, 458 );
});

test( "{ fillSapce: true } with sibling", function() {
	expect( 3 );
	$( "#navigationWrapper" ).height( 500 );
	$( "<p>Lorem Ipsum</p>" )
		.css({
			height: 50,
			marginTop: 20,
			marginBottom: 30
		})
		.prependTo( "#navigationWrapper" );
	var element = $( "#navigation" ).accordion({ fillSpace: true });
	accordion_equalHeights( element , 346, 358);
});

test( "{ fillSpace: true } with multiple siblings", function() {
	expect( 3 );
	$( "#navigationWrapper" ).height( 500 );
	$( "<p>Lorem Ipsum</p>" )
		.css({
			height: 50,
			marginTop: 20,
			marginBottom: 30
		})
		.prependTo( "#navigationWrapper" );
	$( "<p>Lorem Ipsum</p>" )
		.css({
			height: 50,
			marginTop: 20,
			marginBottom: 30,
			position: "absolute"
		})
		.prependTo( "#navigationWrapper" );
	$( "<p>Lorem Ipsum</p>" )
		.css({
			height: 25,
			marginTop: 10,
			marginBottom: 15
		})
		.prependTo( "#navigationWrapper" );
	var element = $( "#navigation" ).accordion({ fillSpace: true });
	accordion_equalHeights( element, 296, 308 );
});





module( "accordion (deprecated) - icons", accordion_setupTeardown() );

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





module( "accordion (deprecated) - resize", accordion_setupTeardown() );

test( "resize", function() {
	expect( 6 );
	var element = $( "#navigation" )
		.parent()
			.height( 300 )
		.end()
		.accordion({
			heightStyle: "fill"
		});
	accordion_equalHeights( element, 246, 258 );

	element.parent().height( 500 );
	element.accordion( "resize" );
	accordion_equalHeights( element, 446, 458 );
});





module( "accordion (deprecated) - navigation", accordion_setupTeardown() );

test( "{ navigation: true, navigationFilter: header }", function() {
	expect( 2 );
	var element = $( "#navigation" ).accordion({
		navigation: true,
		navigationFilter: function() {
			return /\?p=1\.1\.3$/.test( this.href );
		}
	});
	equal( element.accordion( "option", "active" ), 2 );
	accordion_state( element, 0, 0, 1 );
});

test( "{ navigation: true, navigationFilter: content }", function() {
	expect( 2 );
	var element = $( "#navigation" ).accordion({
		navigation: true,
		navigationFilter: function() {
			return /\?p=1\.1\.3\.2$/.test( this.href );
		}
	});
	equal( element.accordion( "option", "active" ), 2 );
	accordion_state( element, 0, 0, 1 );
});





module( "accordion (deprecated) - changestart/change events", accordion_setupTeardown() );

test( "changestart", function() {
	expect( 26 );
	var element = $( "#list1" ).accordion({
		active: false,
		collapsible: true
	});
	var headers = element.find( ".ui-accordion-header" );
	var content = element.find( ".ui-accordion-content" );

	element.one( "accordionchangestart", function( event, ui ) {
		equal( ui.oldHeader.size(), 0 );
		equal( ui.oldContent.size(), 0 );
		equal( ui.newHeader.size(), 1 );
		strictEqual( ui.newHeader[ 0 ], headers[ 0 ] );
		equal( ui.newContent.size(), 1 );
		strictEqual( ui.newContent[ 0 ], content[ 0 ] );
		accordion_state( element, 0, 0, 0 );
	});
	element.accordion( "option", "active", 0 );
	accordion_state( element, 1, 0, 0 );

	element.one( "accordionchangestart", function( event, ui ) {
		equal( ui.oldHeader.size(), 1 );
		strictEqual( ui.oldHeader[ 0 ], headers[ 0 ] );
		equal( ui.oldContent.size(), 1 );
		strictEqual( ui.oldContent[ 0 ], content[ 0 ] );
		equal( ui.newHeader.size(), 1 );
		strictEqual( ui.newHeader[ 0 ], headers[ 1 ] );
		equal( ui.newContent.size(), 1 );
		strictEqual( ui.newContent[ 0 ], content[ 1 ] );
		accordion_state( element, 1, 0, 0 );
	});
	headers.eq( 1 ).click();
	accordion_state( element, 0, 1, 0 );

	element.one( "accordionchangestart", function( event, ui ) {
		equal( ui.oldHeader.size(), 1 );
		strictEqual( ui.oldHeader[ 0 ], headers[ 1 ] );
		equal( ui.oldContent.size(), 1 );
		strictEqual( ui.oldContent[ 0 ], content[ 1 ] );
		equal( ui.newHeader.size(), 0 );
		equal( ui.newContent.size(), 0 );
		accordion_state( element, 0, 1, 0 );
	});
	element.accordion( "option", "active", false );
	accordion_state( element, 0, 0, 0 );
});

test( "change", function() {
	expect( 20 );
	var element = $( "#list1" ).accordion({
		active: false,
		collapsible: true
	});
	var headers = element.find( ".ui-accordion-header" );
	var content = element.find( ".ui-accordion-content" );

	element.one( "accordionchange", function( event, ui ) {
		equal( ui.oldHeader.size(), 0 );
		equal( ui.oldContent.size(), 0 );
		equal( ui.newHeader.size(), 1 );
		strictEqual( ui.newHeader[ 0 ], headers[ 0 ] );
		equal( ui.newContent.size(), 1 );
		strictEqual( ui.newContent[ 0 ], content[ 0 ] );
	});
	element.accordion( "option", "active", 0 );

	element.one( "accordionchange", function( event, ui ) {
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

	element.one( "accordionchange", function( event, ui ) {
		equal( ui.oldHeader.size(), 1 );
		strictEqual( ui.oldHeader[ 0 ], headers[ 1 ] );
		equal( ui.oldContent.size(), 1 );
		strictEqual( ui.oldContent[ 0 ], content[ 1 ] );
		equal( ui.newHeader.size(), 0 );
		equal( ui.newContent.size(), 0 );
	});
	element.accordion( "option", "active", false );
});

})(jQuery);
