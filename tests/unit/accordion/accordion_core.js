(function( $ ) {

module( "accordion: core", accordionSetupTeardown() );

$.each( { div: "#list1", ul: "#navigation", dl: "#accordion-dl" }, function( type, selector ) {
	test( "markup structure: " + type, function() {
		var element = $( selector ).accordion();
		ok( element.hasClass( "ui-accordion" ), "main element is .ui-accordion" );
		equal( element.find( ".ui-accordion-header" ).length, 3,
			".ui-accordion-header elements exist, correct number" );
		equal( element.find( ".ui-accordion-content" ).length, 3,
			".ui-accordion-content elements exist, correct number" );
		same( element.find( ".ui-accordion-header" ).next().get(),
			element.find( ".ui-accordion-content" ).get(),
			"content panels come immediately after headers" );
	});
});

test( "handle click on header-descendant", function() {
	var element = $( "#navigation" ).accordion();
	$( "#navigation h2:eq(1) a" ).click();
	accordion_state( element, 0, 1, 0 );
});

test( "ui-accordion-heading class added to headers anchor", function() {
	expect( 1 );
	var element = $( "#list1" ).accordion();
	var anchors = element.find( ".ui-accordion-heading" );
	equals( anchors.length, 3 );
});

test( "accessibility", function () {
	expect( 13 );
	var element = $( "#list1" ).accordion().accordion( "option", "active", 1 );
	var headers = element.find( ".ui-accordion-header" );

	equals( headers.eq( 1 ).attr( "tabindex" ), 0, "active header should have tabindex=0" );
	equals( headers.eq( 0 ).attr( "tabindex" ), -1, "inactive header should have tabindex=-1" );
	equals( element.attr( "role" ), "tablist", "main role" );
	equals( headers.attr( "role" ), "tab", "tab roles" );
	equals( headers.next().attr( "role" ), "tabpanel", "tabpanel roles" );
	equals( headers.eq( 1 ).attr( "aria-expanded" ), "true", "active tab has aria-expanded" );
	equals( headers.eq( 0 ).attr( "aria-expanded" ), "false", "inactive tab has aria-expanded" );
	equals( headers.eq( 1 ).attr( "aria-selected" ), "true", "active tab has aria-selected" );
	equals( headers.eq( 0 ).attr( "aria-selected" ), "false", "inactive tab has aria-selected" );
	element.accordion( "option", "active", 0 );
	equals( headers.eq( 0 ).attr( "aria-expanded" ), "true", "newly active tab has aria-expanded" );
	equals( headers.eq( 1 ).attr( "aria-expanded" ), "false", "newly inactive tab has aria-expanded" );
	equals( headers.eq( 0 ).attr( "aria-selected" ), "true", "active tab has aria-selected" );
	equals( headers.eq( 1 ).attr( "aria-selected" ), "false", "inactive tab has aria-selected" );
});

}( jQuery ) );
