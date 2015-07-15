define( [
	"jquery",
	"./helper",
	"ui/widgets/accordion"
], function( $, testHelper ) {

var setupTeardown = testHelper.setupTeardown,
	state = testHelper.state;

module( "accordion: core", setupTeardown() );

$.each( { div: "#list1", ul: "#navigation", dl: "#accordion-dl" }, function( type, selector ) {
	test( "markup structure: " + type, function( assert ) {
		expect( 10 );
		var element = $( selector ).accordion(),
			headers = element.find( ".ui-accordion-header" ),
			content = headers.next();

		assert.hasClasses( element, "ui-accordion ui-widget" );
		equal( headers.length, 3, ".ui-accordion-header elements exist, correct number" );
		assert.hasClasses( headers[ 0 ],
			"ui-accordion-header ui-accordion-header-active ui-accordion-icons" );
		assert.hasClasses( headers[ 1 ],
			"ui-accordion-header ui-accordion-header-collapsed ui-accordion-icons" );
		assert.hasClasses( headers[ 2 ],
			"ui-accordion-header ui-accordion-header-collapsed ui-accordion-icons" );
		equal( content.length, 3, ".ui-accordion-content elements exist, correct number" );
		assert.hasClasses( content[ 0 ],
			"ui-accordion-content ui-widget-content ui-accordion-content-active" );
		assert.hasClasses( content[ 1 ], "ui-accordion-content ui-widget-content" );
		assert.hasClasses( content[ 2 ], "ui-accordion-content ui-widget-content" );
		deepEqual( element.find( ".ui-accordion-header" ).next().get(),
			element.find( ".ui-accordion-content" ).get(),
			"content panels come immediately after headers" );
	});
});

test( "handle click on header-descendant", function() {
	expect( 1 );
	var element = $( "#navigation" ).accordion();
	$( "#navigation h2:eq(1) a" ).trigger( "click" );
	state( element, 0, 1, 0 );
});

test( "accessibility", function () {
	expect( 61 );
	var element = $( "#list1" ).accordion({
			active: 1,
			collapsible: true
		}),
		headers = element.find( ".ui-accordion-header" );

	equal( element.attr( "role" ), "tablist", "element role" );
	headers.each(function( i ) {
		var header = headers.eq( i ),
			panel = header.next();
		equal( header.attr( "role" ), "tab", "header " + i + " role" );
		equal( header.attr( "aria-controls" ), panel.attr( "id" ), "header " + i + " aria-controls" );
		equal( panel.attr( "role" ), "tabpanel", "panel " + i + " role" );
		equal( panel.attr( "aria-labelledby" ), header.attr( "id" ), "panel " + i + " aria-labelledby" );
	});

	equal( headers.eq( 1 ).attr( "tabindex" ), 0, "active header has tabindex=0" );
	equal( headers.eq( 1 ).attr( "aria-selected" ), "true", "active tab (1) has aria-selected=true" );
	equal( headers.eq( 1 ).attr( "aria-expanded" ), "true", "active tab (1) has aria-expanded=true" );
	equal( headers.eq( 1 ).next().attr( "aria-hidden" ), "false", "active tabpanel (1) has aria-hidden=false" );
	equal( headers.eq( 0 ).attr( "tabindex" ), -1, "inactive header (0) has tabindex=-1" );
	equal( headers.eq( 0 ).attr( "aria-selected" ), "false", "inactive tab (0) has aria-selected=false" );
	equal( headers.eq( 0 ).attr( "aria-expanded" ), "false", "inactive tab (0) has aria-expanded=false" );
	equal( headers.eq( 0 ).next().attr( "aria-hidden" ), "true", "inactive tabpanel (0) has aria-hidden=true" );
	equal( headers.eq( 2 ).attr( "tabindex" ), -1, "inactive header (2) has tabindex=-1" );
	equal( headers.eq( 2 ).attr( "aria-selected" ), "false", "inactive tab (2) has aria-selected=false" );
	equal( headers.eq( 2 ).attr( "aria-expanded" ), "false", "inactive tab (2) has aria-expanded=false" );
	equal( headers.eq( 2 ).next().attr( "aria-hidden" ), "true", "inactive tabpanel (2) has aria-hidden=true" );

	element.accordion( "option", "active", 0 );
	equal( headers.eq( 0 ).attr( "tabindex" ), 0, "active header (0) has tabindex=0" );
	equal( headers.eq( 0 ).attr( "aria-selected" ), "true", "active tab (0) has aria-selected=true" );
	equal( headers.eq( 0 ).attr( "aria-expanded" ), "true", "active tab (0) has aria-expanded=true" );
	equal( headers.eq( 0 ).next().attr( "aria-hidden" ), "false", "active tabpanel (0) has aria-hidden=false" );
	equal( headers.eq( 1 ).attr( "tabindex" ), -1, "inactive header (1) has tabindex=-1" );
	equal( headers.eq( 1 ).attr( "aria-selected" ), "false", "inactive tab (1) has aria-selected=false" );
	equal( headers.eq( 1 ).attr( "aria-expanded" ), "false", "inactive tab (1) has aria-expanded=false" );
	equal( headers.eq( 1 ).next().attr( "aria-hidden" ), "true", "inactive tabpanel (1) has aria-hidden=true" );
	equal( headers.eq( 2 ).attr( "tabindex" ), -1, "inactive header (2) has tabindex=-1" );
	equal( headers.eq( 2 ).attr( "aria-selected" ), "false", "inactive tab (2) has aria-selected=false" );
	equal( headers.eq( 2 ).attr( "aria-expanded" ), "false", "inactive tab (2) has aria-expanded=false" );
	equal( headers.eq( 2 ).next().attr( "aria-hidden" ), "true", "inactive tabpanel (2) has aria-hidden=true" );

	element.accordion( "option", "active", false );
	equal( headers.eq( 0 ).attr( "tabindex" ), 0, "previously active header (0) has tabindex=0" );
	equal( headers.eq( 0 ).attr( "aria-selected" ), "false", "inactive tab (0) has aria-selected=false" );
	equal( headers.eq( 0 ).attr( "aria-expanded" ), "false", "inactive tab (0) has aria-expanded=false" );
	equal( headers.eq( 0 ).next().attr( "aria-hidden" ), "true", "inactive tabpanel (0) has aria-hidden=true" );
	equal( headers.eq( 1 ).attr( "tabindex" ), -1, "inactive header (1) has tabindex=-1" );
	equal( headers.eq( 1 ).attr( "aria-selected" ), "false", "inactive tab (1) has aria-selected=false" );
	equal( headers.eq( 1 ).attr( "aria-expanded" ), "false", "inactive tab (1) has aria-expanded=false" );
	equal( headers.eq( 1 ).next().attr( "aria-hidden" ), "true", "inactive tabpanel (1) has aria-hidden=true" );
	equal( headers.eq( 2 ).attr( "tabindex" ), -1, "inactive header (2) has tabindex=-1" );
	equal( headers.eq( 2 ).attr( "aria-selected" ), "false", "inactive tab (2) has aria-selected=false" );
	equal( headers.eq( 2 ).attr( "aria-expanded" ), "false", "inactive tab (2) has aria-expanded=false" );
	equal( headers.eq( 2 ).next().attr( "aria-hidden" ), "true", "inactive tabpanel (2) has aria-hidden=true" );

	element.accordion( "option", "active", 1 );
	equal( headers.eq( 1 ).attr( "tabindex" ), 0, "active header has tabindex=0" );
	equal( headers.eq( 1 ).attr( "aria-selected" ), "true", "active tab (1) has aria-selected=true" );
	equal( headers.eq( 1 ).attr( "aria-expanded" ), "true", "active tab (1) has aria-expanded=true" );
	equal( headers.eq( 1 ).next().attr( "aria-hidden" ), "false", "active tabpanel (1) has aria-hidden=false" );
	equal( headers.eq( 0 ).attr( "tabindex" ), -1, "inactive header (0) has tabindex=-1" );
	equal( headers.eq( 0 ).attr( "aria-selected" ), "false", "inactive tab (0) has aria-selected=false" );
	equal( headers.eq( 0 ).attr( "aria-expanded" ), "false", "inactive tab (0) has aria-expanded=false" );
	equal( headers.eq( 0 ).next().attr( "aria-hidden" ), "true", "inactive tabpanel (0) has aria-hidden=true" );
	equal( headers.eq( 2 ).attr( "tabindex" ), -1, "inactive header (2) has tabindex=-1" );
	equal( headers.eq( 2 ).attr( "aria-selected" ), "false", "inactive tab (2) has aria-selected=false" );
	equal( headers.eq( 2 ).attr( "aria-expanded" ), "false", "inactive tab (2) has aria-expanded=false" );
	equal( headers.eq( 2 ).next().attr( "aria-hidden" ), "true", "inactive tabpanel (2) has aria-hidden=true" );

});

asyncTest( "keyboard support", function( assert ) {
	expect( 13 );
	var element = $( "#list1" ).accordion(),
		headers = element.find( ".ui-accordion-header" ),
		anchor = headers.eq( 1 ).next().find( "a" ).eq( 0 ),
		keyCode = $.ui.keyCode;
	equal( headers.filter( ".ui-state-focus" ).length, 0, "no headers focused on init" );
	headers.eq( 0 ).simulate( "focus" );
	setTimeout( step1 );

	function step1() {
		assert.hasClasses( headers.eq( 0 ), "ui-state-focus", "first header has focus" );
		headers.eq( 0 ).simulate( "keydown", { keyCode: keyCode.DOWN } );
		setTimeout( step2 );
	}

	// Support: IE 11 with jQuery 1.7 - 1.8 only
	// All of the setTimeouts() from keydowns aren't necessary with newer jQuery.
	// Only the explicit focus simulations require them.
	function step2() {
		assert.hasClasses( headers.eq( 1 ), "ui-state-focus", "DOWN moves focus to next header" );
		headers.eq( 1 ).simulate( "keydown", { keyCode: keyCode.RIGHT } );
		setTimeout( step3 );
	}

	function step3() {
		assert.hasClasses( headers.eq( 2 ), "ui-state-focus", "RIGHT moves focus to next header" );
		headers.eq( 2 ).simulate( "keydown", { keyCode: keyCode.DOWN } );
		setTimeout( step4 );
	}

	function step4() {
		assert.hasClasses( headers.eq( 0 ), "ui-state-focus", "DOWN wraps focus to first header" );
		headers.eq( 0 ).simulate( "keydown", { keyCode: keyCode.UP } );
		setTimeout( step5 );
	}

	function step5() {
		assert.hasClasses( headers.eq( 2 ), "ui-state-focus", "UP wraps focus to last header" );
		headers.eq( 2 ).simulate( "keydown", { keyCode: keyCode.LEFT } );
		setTimeout( step6 );
	}

	function step6() {
		assert.hasClasses( headers.eq( 1 ),
			"ui-state-focus", "LEFT moves focus to previous header" );
		headers.eq( 1 ).simulate( "keydown", { keyCode: keyCode.HOME } );
		setTimeout( step7 );
	}

	function step7() {
		assert.hasClasses( headers.eq( 0 ), "ui-state-focus", "HOME moves focus to first header" );
		headers.eq( 0 ).simulate( "keydown", { keyCode: keyCode.END } );
		setTimeout( step8 );
	}

	function step8() {
		assert.hasClasses( headers.eq( 2 ), "ui-state-focus", "END moves focus to last header" );
		headers.eq( 2 ).simulate( "keydown", { keyCode: keyCode.ENTER } );
		setTimeout( step9 );
	}

	function step9() {
		equal( element.accordion( "option", "active" ) , 2, "ENTER activates panel" );
		headers.eq( 1 ).simulate( "keydown", { keyCode: keyCode.SPACE } );
		setTimeout( step10 );
	}

	function step10() {
		equal( element.accordion( "option", "active" ), 1, "SPACE activates panel" );
		anchor.simulate( "focus" );
		setTimeout( step11 );
	}

	function step11() {
		assert.lacksClasses( headers.eq( 1 ), "ui-state-focus",
			"header loses focus when focusing inside the panel" );
		anchor.simulate( "keydown", { keyCode: keyCode.UP, ctrlKey: true } );
		setTimeout( step12 );
	}

	function step12() {
		assert.hasClasses( headers.eq( 1 ), "ui-state-focus", "CTRL+UP moves focus to header" );
		start();
	}
});

} );
