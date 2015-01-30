(function ( $ ) {

module( "selectmenu: options" );

test( "appendTo: null", function() {
	expect( 1 );

	var element = $( "#speed" ).selectmenu();
	equal( element.selectmenu( "menuWidget" ).parent().parent()[ 0 ], document.body,
		"defaults to body" );
});

test( "appendTo: explicit", function() {
	expect( 6 );

	var detached = $( "<div>" ),
		element = $( "#speed" );

	element.selectmenu({
		appendTo: ".selectmenu-wrap"
	});
	equal( element.selectmenu( "menuWidget" ).parent().parent()[ 0 ],
		$( "#selectmenu-wrap1" )[ 0 ], "first found element" );
	equal( $( "#selectmenu-wrap2 .ui-selectmenu" ).length, 0, "only appends to one element" );
	element.selectmenu( "destroy" );

	element.selectmenu().selectmenu( "option", "appendTo", "#selectmenu-wrap1" );
	equal( element.selectmenu( "menuWidget" ).parent().parent()[ 0 ],
		$( "#selectmenu-wrap1" )[ 0 ], "modified after init" );
	element.selectmenu( "destroy" );

	element.selectmenu({
		appendTo: detached
	});
	equal( element.selectmenu( "menuWidget" ).parent().parent()[ 0 ], detached[ 0 ],
		"detached jQuery object" );
	element.selectmenu( "destroy" );

	element.selectmenu({
		appendTo: detached[ 0 ]
	});
	equal( element.selectmenu( "menuWidget" ).parent().parent()[ 0 ], detached[ 0 ],
		"detached DOM element" );
	element.selectmenu( "destroy" );

	element.selectmenu().selectmenu( "option", "appendTo", detached );
	equal( element.selectmenu( "menuWidget" ).parent().parent()[ 0 ], detached[ 0 ],
		"detached DOM element via option()" );
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

test( "CSS styles", function( assert ) {
	expect( 5 );

	var element = $( "#speed" ).selectmenu(),
		button = element.selectmenu( "widget" ),
		menu = element.selectmenu( "menuWidget" );

	element.selectmenu( "open" );

	assert.hasClasses( button, "ui-corner-top" );
	assert.lacksClasses( button, "ui-corner-all" );
	assert.hasClasses( button.find( "span.ui-icon" ), "ui-icon-triangle-1-s" );
	assert.hasClasses( menu, "ui-corner-bottom" );
	assert.lacksClasses( button, "ui-corner-all" );
});

test( "width", function() {
	expect( 6 );

	var button,
		element = $( "#speed" );

	element.selectmenu();
	button = element.selectmenu( "widget" );

	equal( button[ 0 ].style.width, "", "no inline style" );

	element.selectmenu( "option", "width", null );
	equal( button.outerWidth(), element.outerWidth(), "button width auto" );

	element.outerWidth( 100 );
	element.selectmenu( "refresh" );
	equal( button.outerWidth(), 100, "button width set by CSS" );

	element
		.width( "" )
		.selectmenu( "option", "width", 100 )
		.selectmenu( "refresh" );
	equal( button.outerWidth(), 100, "button width set by JS option" );

	element
		.append( $( "<option>", { text: "Option with a little longer text" } ) )
		.selectmenu( "option", "width", null )
		.selectmenu( "refresh" );
	equal( button.outerWidth(), element.outerWidth(), "button width with long option" );

	element.parent().outerWidth( 300 );
	element
		.selectmenu( "destroy" )
		.css( "width", "100%" )
		.selectmenu({ width: null });
	button = element.selectmenu( "widget" );
	equal( button.outerWidth(), 300, "button width fills container" );
});

})( jQuery );
