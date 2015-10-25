define( [
	"jquery",
	"ui/widgets/controlgroup",
	"ui/widgets/checkboxradio",
	"ui/widgets/selectmenu",
	"ui/widgets/button"
], function( $ ) {

module( "Controlgroup: Core" );

test( "selectmenu: open/close corners", function( assert ) {
	expect( 12 );
	var element = $( ".controlgroup" ).controlgroup(),
		selects = element.find( "select" ),
		selectButton = selects.eq( 0 ).selectmenu( "widget" );

	selects.eq( 0 ).selectmenu( "open" );
	assert.hasClasses( selectButton, "ui-corner-tl",
		"Horizontal: First selectmenu gets ui-corner-tl when opened" );

	selects.eq( 0 ).selectmenu( "close" );
	assert.hasClasses( selectButton, "ui-corner-left",
		"Horizontal: First selectmenu gets ui-corner-left when closed" );

	selectButton = selects.eq( 1 ).selectmenu( "widget" );
	selects.eq( 1 ).selectmenu( "open" );
	assert.lacksClassStart( selectButton, "ui-corner" );

	selects.eq( 1 ).selectmenu( "close" );
	assert.lacksClassStart( selectButton, "ui-corner" );

	selectButton = selects.eq( 2 ).selectmenu( "widget" );
	selects.eq( 2 ).selectmenu( "open" );
	assert.hasClasses( selectButton, "ui-corner-tr",
		"Horizontal: Last selectmenu gets ui-corner-tr when opened" );

	selects.eq( 2 ).selectmenu( "close" );
	assert.hasClasses( selectButton, "ui-corner-right",
		"Horizontal: Last selectmenu gets ui-corner-right when closed" );

	element.controlgroup( "option", "direction", "vertical" );
	selectButton = selects.eq( 0 ).selectmenu( "widget" );
	selects.eq( 0 ).selectmenu( "open" );
	assert.hasClasses( selectButton, "ui-corner-top",
		"vertical: First selectmenu gets ui-corner-top when opened" );

	selects.eq( 0 ).selectmenu( "close" );
	assert.hasClasses( selectButton, "ui-corner-top",
		"vertical: First selectmenu gets ui-corner-top when closed" );

	selectButton = selects.eq( 1 ).selectmenu( "widget" );
	selects.eq( 1 ).selectmenu( "open" );
	assert.lacksClassStart( selectButton, "ui-corner" );

	selects.eq( 1 ).selectmenu( "close" );
	assert.lacksClassStart( selectButton, "ui-corner" );

	selectButton = selects.eq( 2 ).selectmenu( "widget" );
	selects.eq( 2 ).selectmenu( "open" );
	assert.lacksClassStart( selectButton, "ui-corner" );

	selects.eq( 2 ).selectmenu( "close" );
	assert.hasClasses( selectButton, "ui-corner-bottom",
		"vertical: Last selectmenu gets ui-corner-bottom when closed" );
} );

test( "selectmenu: controlgroupLabel", function( assert ) {
	expect( 2 );
	var element = $( ".controlgroup" ).controlgroup();
	var label = element.find( ".ui-controlgroup-label" );

	assert.hasClasses( label, "ui-widget ui-widget-content ui-state-default ui-controlgroup-item" );
	assert.hasClasses( label.find( "span" ), "ui-controlgroup-label-contents" );
} );

} );
