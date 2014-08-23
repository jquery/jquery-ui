module( "Controlgroup: Core" );

function hasCornerClass( className, element ) {
	if ( className ) {
		return element.hasClass( className );
	}

	return element.attr( "class" ).match( /ui-corner/g );
}

test( "selectmenu: open/close corners", function() {
	expect( 1 );
	var element = $( ".controlgroup" ).controlgroup(),
		selects = element.find( "select" ),
		selectButton = selects.eq( 0 ).selectmenu( "widget" );

		expect( 12 );

		selects.eq( 0 ).selectmenu( "open" );

		strictEqual( selectButton.hasClass( "ui-corner-tl" ), true,
			"Horizontal: First selectmenu gets ui-corner-tl when opened" );

		selects.eq( 0 ).selectmenu( "close" );

		strictEqual( selectButton.hasClass( "ui-corner-left" ), true,
			"Horizontal: First selectmenu gets ui-corner-left when closed" );

		selectButton = selects.eq( 1 ).selectmenu( "widget" );

		selects.eq( 1 ).selectmenu( "open" );

		strictEqual( !!hasCornerClass( false, selectButton ), false,
			"Horizontal: Middle selectmenu does not get corner class when opened" );

		selects.eq( 1 ).selectmenu( "close" );

		strictEqual( !!hasCornerClass( false, selectButton ), false,
			"Horizontal: Middle selectmenu does not get corner class when closed" );

		selectButton = selects.eq( 2 ).selectmenu( "widget" );

		selects.eq( 2 ).selectmenu( "open" );

		strictEqual( selectButton.hasClass( "ui-corner-tr" ), true,
			"Horizontal: Last selectmenu gets ui-corner-tr when opened" );

		selects.eq( 2 ).selectmenu( "close" );

		strictEqual( selectButton.hasClass( "ui-corner-right" ), true,
			"Horizontal: Last selectmenu gets ui-corner-right when closed" );

		element.controlgroup( "option", "direction", "vertical" );
		selectButton = selects.eq( 0 ).selectmenu( "widget" );

		selects.eq( 0 ).selectmenu( "open" );

		strictEqual( selectButton.hasClass( "ui-corner-top" ), true,
			"vertical: First selectmenu gets ui-corner-top when opened" );

		selects.eq( 0 ).selectmenu( "close" );

		strictEqual( selectButton.hasClass( "ui-corner-top" ), true,
			"vertical: First selectmenu gets ui-corner-top when closed" );

		selectButton = selects.eq( 1 ).selectmenu( "widget" );

		selects.eq( 1 ).selectmenu( "open" );

		strictEqual( !!hasCornerClass( false, selectButton ), false,
			"vertical: Middle selectmenu does not get corner class when opened" );

		selects.eq( 1 ).selectmenu( "close" );

		strictEqual( !!hasCornerClass( false, selectButton ), false,
			"vertical: Middle selectmenu does not get corner class when closed" );

		selectButton = selects.eq( 2 ).selectmenu( "widget" );

		selects.eq( 2 ).selectmenu( "open" );

		strictEqual( !!hasCornerClass( false, selectButton ), false,
			"vertical: Last selectmenu does not get corner class when opened" );

		selects.eq( 2 ).selectmenu( "close" );

		strictEqual( selectButton.hasClass( "ui-corner-bottom" ), true,
			"vertical: Last selectmenu gets ui-corner-bottom when closed" );
});