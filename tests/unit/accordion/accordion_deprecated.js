(function( $ ) {

module( "accordion (deprecated): expanded active option, activate method", accordionSetupTeardown() );

test( "activate, numeric", function() {
	var ac = $( "#list1" ).accordion({ active: 1 });
	state( ac, 0, 1, 0 );
	ac.accordion( "activate", 2 );
	state( ac, 0, 0, 1 );
	ac.accordion( "activate", 0 );
	state( ac, 1, 0, 0 );
	ac.accordion( "activate", 1 );
	state( ac, 0, 1, 0 );
	ac.accordion( "activate", 2 );
	state( ac, 0, 0, 1 );
});

test( "activate, numeric, collapsible:true", function() {
	var ac = $( "#list1" ).accordion({ collapsible: true });
	ac.accordion( "activate", 2 );
	state( ac, 0, 0, 1 );
	ac.accordion( "activate", 0 );
	state( ac, 1, 0, 0 );
	ac.accordion( "activate", -1 );
	state( ac, 0, 0, 0 );
});

test( "activate, boolean, collapsible: true", function() {
	var ac = $( "#list1" ).accordion({ collapsible: true });
	ac.accordion( "activate", 2 );
	state( ac, 0, 0, 1 );
	ac.accordion( "activate", false );
	state( ac, 0, 0, 0 );
});

test( "activate, boolean, collapsible: false", function() {
	var ac = $( "#list1" ).accordion();
	ac.accordion( "activate", 2 );
	state( ac, 0, 0, 1 );
	ac.accordion( "activate", false );
	state( ac, 0, 0, 1 );
});

test( "activate, string expression", function() {
	var ac = $( "#list1" ).accordion({ active: "h3:last" });
	state( ac, 0, 0, 1 );
	ac.accordion( "activate", ":first" );
	state( ac, 1, 0, 0 );
	ac.accordion( "activate", ":eq(1)" );
	state( ac, 0, 1, 0 );
	ac.accordion( "activate", ":last" );
	state( ac, 0, 0, 1 );
});

test( "activate, jQuery or DOM element", function() {
	var ac = $( "#list1" ).accordion({ active: $( "#list1 h3:last" ) });
	state( ac, 0, 0, 1 );
	ac.accordion( "activate", $( "#list1 h3:first" ) );
	state( ac, 1, 0, 0 );
	ac.accordion( "activate", $( "#list1 h3" )[ 1 ] );
	state( ac, 0, 1, 0 );
});

test( "{ active: Selector }", function() {
	var ac = $("#list1").accordion({
		active: "h3:last"
	});
	state( ac, 0, 0, 1 );
	ac.accordion( "option", "active", "h3:eq(1)" );
	state( ac, 0, 1, 0 );
});

test( "{ active: Element }", function() {
	var ac = $( "#list1" ).accordion({
		active: $( "#list1 h3:last" )[ 0 ]
	});
	state( ac, 0, 0, 1 );
	ac.accordion( "option", "active", $( "#list1 h3:eq(1)" )[ 0 ] );
	state( ac, 0, 1, 0 );
});

test( "{ active: jQuery Object }", function() {
	var ac = $( "#list1" ).accordion({
		active: $( "#list1 h3:last" )
	});
	state( ac, 0, 0, 1 );
	ac.accordion( "option", "active", $( "#list1 h3:eq(1)" ) );
	state( ac, 0, 1, 0 );
});





module( "accordion (deprecated) - height options", accordionSetupTeardown() );

test( "{ autoHeight: true }, default", function() {
	equalHeights($('#navigation').accordion({ autoHeight: true }), 95, 130);
});

test("{ autoHeight: false }", function() {
	var accordion = $('#navigation').accordion({ autoHeight: false });
	var sizes = [];
	accordion.find(".ui-accordion-content").each(function() {
		sizes.push($(this).height());
	});
	ok( sizes[0] >= 70 && sizes[0] <= 90, "was " + sizes[0] );
	ok( sizes[1] >= 98 && sizes[1] <= 126, "was " + sizes[1] );
	ok( sizes[2] >= 42 && sizes[2] <= 54, "was " + sizes[2] );
});

test( "{ fillSpace: true }", function() {
	$( "#navigationWrapper" ).height( 500 );
	var ac = $( "#navigation" ).accordion({ fillSpace: true });
	equalHeights( ac, 446, 458 );
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
	var ac = $( "#navigation" ).accordion({ fillSpace: true });
	equalHeights( ac , 346, 358);
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
	var ac = $( "#navigation" ).accordion({ fillSpace: true });
	equalHeights( ac, 296, 308 );
});





module( "accordion (deprecated) - icons", accordionSetupTeardown() );

test( "icons, headerSelected", function() {
	var list = $( "#list1" ).accordion({
		icons: { headerSelected: "a1", header: "h1" }
	});
	ok( list.find( ".ui-accordion-header.ui-state-active span.ui-icon" ).hasClass( "a1" ) );
	list.accordion( "option", "icons", { headerSelected: "a2", header: "h2" } );
	ok( !list.find( ".ui-accordion-header.ui-state-active span.ui-icon" ).hasClass( "a1" ) );
	ok( list.find( ".ui-accordion-header.ui-state-active span.ui-icon" ).hasClass( "a2" ) );
});





module( "accordion (deprecated) - resize", accordionSetupTeardown() );

test( "resize", function() {
	var expected = $( "#navigation" )
		.parent()
			.height( 300 )
		.end()
		.accordion({
			heightStyle: "fill"
		});
	equalHeights( expected, 246, 258 );

	expected.parent().height( 500 );
	expected.accordion( "resize" );
	equalHeights( expected, 446, 458 );
});





module( "accordion (deprecated) - navigation", accordionSetupTeardown() );

test( "{ navigation: true, navigationFilter: header }", function() {
	var ac = $( "#navigation" ).accordion({
		navigation: true,
		navigationFilter: function() {
			return /\?p=1\.1\.3$/.test( this.href );
		}
	});
	equal( ac.accordion( "option", "active" ), 2 );
	state( ac, 0, 0, 1 );
});

test( "{ navigation: true, navigationFilter: content }", function() {
	var ac = $("#navigation").accordion({
		navigation: true,
		navigationFilter: function() {
			return /\?p=1\.1\.3\.2$/.test(this.href);
		}
	});
	equal( ac.accordion( "option", "active" ), 2 );
	state( ac, 0, 0, 1 );
});





module( "accordion (deprecated) - changestart/change events", accordionSetupTeardown() );

test( "changestart", function() {
	expect( 26 );
	var ac = $( "#list1" ).accordion({
		active: false,
		collapsible: true
	});
	var headers = ac.find( ".ui-accordion-header" );
	var content = ac.find( ".ui-accordion-content" );

	ac.one( "accordionchangestart", function( event, ui ) {
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

	ac.one( "accordionchangestart", function( event, ui ) {
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

	ac.one( "accordionchangestart", function( event, ui ) {
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
});

test( "change", function() {
	expect( 20 );
	var ac = $( "#list1" ).accordion({
		active: false,
		collapsible: true
	});
	var headers = ac.find( ".ui-accordion-header" );
	var content = ac.find( ".ui-accordion-content" );

	ac.one( "accordionchange", function( event, ui ) {
		equals( ui.oldHeader.size(), 0 );
		equals( ui.oldContent.size(), 0 );
		equals( ui.newHeader.size(), 1 );
		strictEqual( ui.newHeader[ 0 ], headers[ 0 ] );
		equals( ui.newContent.size(), 1 );
		strictEqual( ui.newContent[ 0 ], content[ 0 ] );
	});
	ac.accordion( "option", "active", 0 );

	ac.one( "accordionchange", function( event, ui ) {
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

	ac.one( "accordionchange", function( event, ui ) {
		equals( ui.oldHeader.size(), 1 );
		strictEqual( ui.oldHeader[ 0 ], headers[ 1 ] );
		equals( ui.oldContent.size(), 1 );
		strictEqual( ui.oldContent[ 0 ], content[ 1 ] );
		equals( ui.newHeader.size(), 0 );
		equals( ui.newContent.size(), 0 );
	});
	ac.accordion( "option", "active", false );
});

})(jQuery);
