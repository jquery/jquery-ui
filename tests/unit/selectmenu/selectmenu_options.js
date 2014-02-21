(function ( $ ) {

module( "selectmenu: options" );

test( "appendTo: null", function() {
	expect( 1 );
	var element = $( "#speed" ).selectmenu();
	equal( element.selectmenu( "menuWidget" ).parent().parent()[ 0 ],document.body,
		"defaults to body" );
	element.selectmenu( "destroy" );
});

test( "appendTo: explicit", function() {
	expect( 6 );
	var detached = $( "<div>" ),
		element = $( "#speed" );

	element.selectmenu({
		appendTo: ".selectmenu-wrap"
	});
	equal( element.selectmenu( "menuWidget" ).parent().parent()[ 0 ], $( "#selectmenu-wrap1" )[ 0 ], "first found element" );
	equal( $( "#selectmenu-wrap2 .ui-selectmenu" ).length, 0, "only appends to one element" );
	element.selectmenu( "destroy" );

	element.selectmenu().selectmenu( "option", "appendTo", "#selectmenu-wrap1" );
	equal( element.selectmenu( "menuWidget" ).parent().parent()[ 0 ], $( "#selectmenu-wrap1" )[ 0 ], "modified after init" );
	element.selectmenu( "destroy" );

	element.selectmenu({
		appendTo: detached
	});
	equal( element.selectmenu( "menuWidget" ).parent().parent()[ 0 ], detached[ 0 ], "detached jQuery object" );
	element.selectmenu( "destroy" );

	element.selectmenu({
		appendTo: detached[ 0 ]
	});
	equal( element.selectmenu( "menuWidget" ).parent().parent()[ 0 ], detached[ 0 ], "detached DOM element" );
	element.selectmenu( "destroy" );

	element.selectmenu().selectmenu( "option", "appendTo", detached );
	equal( element.selectmenu( "menuWidget" ).parent().parent()[ 0 ], detached[ 0 ], "detached DOM element via option()" );
	element.selectmenu( "destroy" );
});

test( "appendTo: ui-front", function() {
	expect( 2 );
	var element = $( "#speed" );

	$( "#selectmenu-wrap2" ).addClass( "ui-front" );
	element.selectmenu();
	equal( element.selectmenu( "menuWidget" ).parent().parent()[ 0 ],
		$( "#selectmenu-wrap2" )[ 0 ], "null, inside .ui-front" );
	element.selectmenu( "destroy" );

	element.selectmenu({
		appendTo: $()
	});
	equal( element.selectmenu( "menuWidget" ).parent().parent()[ 0 ],
		$( "#selectmenu-wrap2" )[ 0 ], "empty jQuery object, inside .ui-front" );
});


test( "CSS styles", function () {
	expect( 2 );

	var element = $( "#speed" ).selectmenu(),
		button = element.selectmenu( "widget" ),
		menu = element.selectmenu( "menuWidget" );

	element.selectmenu( "open" );
	ok( button.hasClass( "ui-corner-top" ) && !button.hasClass( "ui-corner-all" ) && button.find( "span.ui-icon" ).hasClass( "ui-icon-triangle-1-s" ), "button styles dropdown" );
	ok( menu.hasClass( "ui-corner-bottom" ) && !menu.hasClass( "ui-corner-all" ), "menu styles dropdown" );
});


test( "Width", function () {
	expect( 8 );

	var element = $( "#speed" ),
		button, menu;

	element.selectmenu();
	button = element.selectmenu( "widget" );
	menu = element.selectmenu( "menuWidget" );

	equal( button.outerWidth(), element.outerWidth(), "button width auto" );
	element.selectmenu( "open" );
	equal( menu.outerWidth(), element.outerWidth(), "menu width auto" );

	element.outerWidth( 100 );
	element.selectmenu( "refresh" );

	equal( button.outerWidth(), 100, "button width set by CSS" );
	element.selectmenu( "open" );
	equal( menu.outerWidth(), 100, "menu width set by CSS" );

	element.width( "" );
	element.selectmenu( "option", "width", 100 );
	element.selectmenu( "refresh" );

	equal( button.outerWidth(), 100, "button width set by JS option" );
	element.selectmenu( "open" );
	equal( menu.outerWidth(), 100, "menu width set by JS option" );

	element.append( $( "<option>", { text: "Option with a little longer text" } ) );
	element.selectmenu( "option", "width", "" );
	element.selectmenu( "refresh" );

	equal( button.outerWidth(), element.outerWidth(), "button width with long option" );
	element.selectmenu( "open" );
	ok( menu.outerWidth() >= element.outerWidth(), "menu width with long option" );
});

})( jQuery );
