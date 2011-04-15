(function( $ ) {

module( "accordion (deprecated): expanded active option, activate method", accordionSetupTeardown() );

test( "activate, numeric", function() {
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
	var element = $( "#list1" ).accordion({ collapsible: true });
	element.accordion( "activate", 2 );
	accordion_state( element, 0, 0, 1 );
	element.accordion( "activate", 0 );
	accordion_state( element, 1, 0, 0 );
	element.accordion( "activate", -1 );
	accordion_state( element, 0, 0, 0 );
});

test( "activate, boolean, collapsible: true", function() {
	var element = $( "#list1" ).accordion({ collapsible: true });
	element.accordion( "activate", 2 );
	accordion_state( element, 0, 0, 1 );
	element.accordion( "activate", false );
	accordion_state( element, 0, 0, 0 );
});

test( "activate, boolean, collapsible: false", function() {
	var element = $( "#list1" ).accordion();
	element.accordion( "activate", 2 );
	accordion_state( element, 0, 0, 1 );
	element.accordion( "activate", false );
	accordion_state( element, 0, 0, 1 );
});

test( "activate, string expression", function() {
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
	var element = $( "#list1" ).accordion({ active: $( "#list1 h3:last" ) });
	accordion_state( element, 0, 0, 1 );
	element.accordion( "activate", $( "#list1 h3:first" ) );
	accordion_state( element, 1, 0, 0 );
	element.accordion( "activate", $( "#list1 h3" )[ 1 ] );
	accordion_state( element, 0, 1, 0 );
});

test( "{ active: Selector }", function() {
	var element = $("#list1").accordion({
		active: "h3:last"
	});
	accordion_state( element, 0, 0, 1 );
	element.accordion( "option", "active", "h3:eq(1)" );
	accordion_state( element, 0, 1, 0 );
});

test( "{ active: Element }", function() {
	var element = $( "#list1" ).accordion({
		active: $( "#list1 h3:last" )[ 0 ]
	});
	accordion_state( element, 0, 0, 1 );
	element.accordion( "option", "active", $( "#list1 h3:eq(1)" )[ 0 ] );
	accordion_state( element, 0, 1, 0 );
});

test( "{ active: jQuery Object }", function() {
	var element = $( "#list1" ).accordion({
		active: $( "#list1 h3:last" )
	});
	accordion_state( element, 0, 0, 1 );
	element.accordion( "option", "active", $( "#list1 h3:eq(1)" ) );
	accordion_state( element, 0, 1, 0 );
});





module( "accordion (deprecated) - height options", accordionSetupTeardown() );

test( "{ autoHeight: true }, default", function() {
	equalHeights($('#navigation').accordion({ autoHeight: true }), 95, 130);
});

test("{ autoHeight: false }", function() {
	var element = $('#navigation').accordion({ autoHeight: false });
	var sizes = [];
	element.find(".ui-accordion-content").each(function() {
		sizes.push($(this).height());
	});
	ok( sizes[0] >= 70 && sizes[0] <= 105, "was " + sizes[0] );
	ok( sizes[1] >= 98 && sizes[1] <= 126, "was " + sizes[1] );
	ok( sizes[2] >= 42 && sizes[2] <= 54, "was " + sizes[2] );
});

test( "{ fillSpace: true }", function() {
	$( "#navigationWrapper" ).height( 500 );
	var element = $( "#navigation" ).accordion({ fillSpace: true });
	equalHeights( element, 446, 458 );
});

test( "{ fillSapce: true } with sibling", function() {
	$( "#navigationWrapper" ).height( 500 );
	$( "<p>Lorem Ipsum</p>" )
		.css({
			height: 50,
			marginTop: 20,
			marginBottom: 30
		})
		.prependTo( "#navigationWrapper" );
	var element = $( "#navigation" ).accordion({ fillSpace: true });
	equalHeights( element , 346, 358);
});

test( "{ fillSpace: true } with multiple siblings", function() {
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
	equalHeights( element, 296, 308 );
});





module( "accordion (deprecated) - icons", accordionSetupTeardown() );

test( "icons, headerSelected", function() {
	var element = $( "#list1" ).accordion({
		icons: { headerSelected: "a1", header: "h1" }
	});
	ok( element.find( ".ui-accordion-header.ui-state-active span.ui-icon" ).hasClass( "a1" ) );
	element.accordion( "option", "icons", { headerSelected: "a2", header: "h2" } );
	ok( !element.find( ".ui-accordion-header.ui-state-active span.ui-icon" ).hasClass( "a1" ) );
	ok( element.find( ".ui-accordion-header.ui-state-active span.ui-icon" ).hasClass( "a2" ) );
});





module( "accordion (deprecated) - resize", accordionSetupTeardown() );

test( "resize", function() {
	var element = $( "#navigation" )
		.parent()
			.height( 300 )
		.end()
		.accordion({
			heightStyle: "fill"
		});
	equalHeights( element, 246, 258 );

	element.parent().height( 500 );
	element.accordion( "resize" );
	equalHeights( element, 446, 458 );
});





module( "accordion (deprecated) - navigation", accordionSetupTeardown() );

test( "{ navigation: true, navigationFilter: header }", function() {
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
	var element = $("#navigation").accordion({
		navigation: true,
		navigationFilter: function() {
			return /\?p=1\.1\.3\.2$/.test(this.href);
		}
	});
	equal( element.accordion( "option", "active" ), 2 );
	accordion_state( element, 0, 0, 1 );
});





module( "accordion (deprecated) - changestart/change events", accordionSetupTeardown() );

test( "changestart", function() {
	expect( 26 );
	var element = $( "#list1" ).accordion({
		active: false,
		collapsible: true
	});
	var headers = element.find( ".ui-accordion-header" );
	var content = element.find( ".ui-accordion-content" );

	element.one( "accordionchangestart", function( event, ui ) {
		equals( ui.oldHeader.size(), 0 );
		equals( ui.oldContent.size(), 0 );
		equals( ui.newHeader.size(), 1 );
		strictEqual( ui.newHeader[ 0 ], headers[ 0 ] );
		equals( ui.newContent.size(), 1 );
		strictEqual( ui.newContent[ 0 ], content[ 0 ] );
		accordion_state( element, 0, 0, 0 );
	});
	element.accordion( "option", "active", 0 );
	accordion_state( element, 1, 0, 0 );

	element.one( "accordionchangestart", function( event, ui ) {
		equals( ui.oldHeader.size(), 1 );
		strictEqual( ui.oldHeader[ 0 ], headers[ 0 ] );
		equals( ui.oldContent.size(), 1 );
		strictEqual( ui.oldContent[ 0 ], content[ 0 ] );
		equals( ui.newHeader.size(), 1 );
		strictEqual( ui.newHeader[ 0 ], headers[ 1 ] );
		equals( ui.newContent.size(), 1 );
		strictEqual( ui.newContent[ 0 ], content[ 1 ] );
		accordion_state( element, 1, 0, 0 );
	});
	headers.eq( 1 ).click();
	accordion_state( element, 0, 1, 0 );

	element.one( "accordionchangestart", function( event, ui ) {
		equals( ui.oldHeader.size(), 1 );
		strictEqual( ui.oldHeader[ 0 ], headers[ 1 ] );
		equals( ui.oldContent.size(), 1 );
		strictEqual( ui.oldContent[ 0 ], content[ 1 ] );
		equals( ui.newHeader.size(), 0 );
		equals( ui.newContent.size(), 0 );
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
		equals( ui.oldHeader.size(), 0 );
		equals( ui.oldContent.size(), 0 );
		equals( ui.newHeader.size(), 1 );
		strictEqual( ui.newHeader[ 0 ], headers[ 0 ] );
		equals( ui.newContent.size(), 1 );
		strictEqual( ui.newContent[ 0 ], content[ 0 ] );
	});
	element.accordion( "option", "active", 0 );

	element.one( "accordionchange", function( event, ui ) {
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

	element.one( "accordionchange", function( event, ui ) {
		equals( ui.oldHeader.size(), 1 );
		strictEqual( ui.oldHeader[ 0 ], headers[ 1 ] );
		equals( ui.oldContent.size(), 1 );
		strictEqual( ui.oldContent[ 0 ], content[ 1 ] );
		equals( ui.newHeader.size(), 0 );
		equals( ui.newContent.size(), 0 );
	});
	element.accordion( "option", "active", false );
});

})(jQuery);
