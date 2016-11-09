define( [
	"qunit",
	"jquery",
	"ui/widgets/controlgroup",
	"ui/widgets/checkboxradio",
	"ui/widgets/selectmenu",
	"ui/widgets/button",
	"ui/widgets/spinner"
], function( QUnit, $ ) {

QUnit.module( "Controlgroup: Core" );

QUnit.test( "selectmenu: open/close corners", function( assert ) {
	assert.expect( 12 );
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

QUnit.test( "selectmenu: controlgroupLabel", function( assert ) {
	assert.expect( 2 );
	var element = $( ".controlgroup" ).controlgroup();
	var label = element.find( ".ui-controlgroup-label" );

	assert.hasClasses( label, "ui-widget ui-widget-content ui-state-default ui-controlgroup-item" );
	assert.hasClasses( label.find( "span" ), "ui-controlgroup-label-contents" );
} );

var assertSanatized = function( assert, initClasses, expectedClasses, message ) {
	var selectmenu = $( "#select-sanatize" ).selectmenu( {
		classes: {
			"ui-selectmenu-button-open": initClasses
		}
	} ).selectmenu( "instance" );
	var classes = {
		"ui-selectmenu-button-open": "ui-corner-top"
	};
	var result = $.ui.controlgroup.prototype._resolveClassesValues( classes, selectmenu );
	assert.deepEqual( result, {
		"ui-selectmenu-button-open": expectedClasses + " ui-corner-top"
	}, message );
};

QUnit.test( "_resolveClassesValues", function( assert ) {
	assert.expect( 6 );
	assertSanatized( assert, "bar ui-corner-bottom", "bar", "Single corner class removed end" );
	assertSanatized( assert, "ui-corner-bottom bar", "bar", "Single corner class removed beginning" );
	assertSanatized( assert, "bar ui-corner-bottom ui-corner-left", "bar", "Multiple corner classes removed end" );
	assertSanatized( assert, "ui-corner-bottom ui-corner-left bar", "bar", "Multiple corner classes removed beginning" );
	assertSanatized( assert, "bar ui-corner-bottom ui-corner-left foo", "bar foo", "Multiple corner class removed middle" );
	assertSanatized( assert, "bar", "bar", "No corner classes" );
} );

QUnit.test( "Single controlgroup select - horizontal", function( assert ) {
	assert.expect( 4 );
	var group = $( ".controlgroup-single-select" ).controlgroup();
	var select = group.find( ".ui-selectmenu-button" );

	assert.hasClasses( select, "ui-corner-all" );
	assert.lacksClasses( select,
		"ui-corner-left ui-corner-right ui-corner-top ui-corner-left" +
		" ui-corner-tr ui-corner-tl ui-corner-bl ui corner-br" );

	group.find( "select" ).selectmenu( "open" );
	assert.hasClasses( select, "ui-corner-top" );
	assert.lacksClasses( select,
		"ui-corner-left ui-corner-right ui-corner-all ui-corner-left" +
		" ui-corner-tr ui-corner-tl ui-corner-bl ui corner-br" );
} );

QUnit.test( "Single controlgroup select - vertical", function( assert ) {
	assert.expect( 4 );
	var group = $( ".controlgroup-single-select" ).controlgroup( {
		direction: "verticle"
	} );
	var select = group.find( ".ui-selectmenu-button" );

	assert.hasClasses( select, "ui-corner-all" );
	assert.lacksClasses( select,
		"ui-corner-left ui-corner-right ui-corner-top ui-corner-left" +
		" ui-corner-tr ui-corner-tl ui-corner-bl ui corner-br" );

	group.find( "select" ).selectmenu( "open" );
	assert.hasClasses( select, "ui-corner-top" );
	assert.lacksClasses( select,
		"ui-corner-left ui-corner-right ui-corner-all ui-corner-left" +
		" ui-corner-tr ui-corner-tl ui-corner-bl ui corner-br" );
} );

QUnit.test( "Single controlgroup button - horizontal", function( assert ) {
	assert.expect( 2 );
	var group = $( ".controlgroup-single-button" ).controlgroup();
	var button = group.find( "button" );

	assert.hasClasses( button, "ui-corner-all" );
	assert.lacksClasses( button,
		"ui-corner-left ui-corner-right ui-corner-top ui-corner-left" +
		" ui-corner-tr ui-corner-tl ui-corner-bl ui corner-br" );
} );

QUnit.test( "Single controlgroup button - vertical", function( assert ) {
	assert.expect( 2 );
	var group = $( ".controlgroup-single-button" ).controlgroup( {
		direction: "verticle"
	} );
	var button = group.find( "button" );

	assert.hasClasses( button, "ui-corner-all" );
	assert.lacksClasses( button,
		"ui-corner-left ui-corner-right ui-corner-top ui-corner-left" +
		" ui-corner-tr ui-corner-tl ui-corner-bl ui corner-br" );
} );

QUnit.module( "Controlgroup: Non-empty class key", {
	setup: function() {
		this.classKey = $.ui.selectmenu.prototype.options.classes[ "ui-selectmenu-button-closed" ];
		$.ui.selectmenu.prototype.options.classes[ "ui-selectmenu-button-closed" ] =
			"something-custom";
	},
	teardown: function() {
		$.ui.selectmenu.prototype.options.classes[ "ui-selectmenu-button-closed" ] = this.classKey;
	}
} );

QUnit.test( "Controlgroup instantiates child widgets with correct options", function( assert ) {
	assert.expect( 1 );

	$( ".controlgroup-class-key-init" ).controlgroup();

	assert.hasClasses( $( "#class-key-init-child" ).next(), "something-custom" );
} );

QUnit.test( "Controlgroup correctly assigns child widget classes options key", function( assert ) {
	assert.expect( 2 );

	$( ".controlgroup-class-key-dupe" ).controlgroup();

	assert.strictEqual(
		( $( "#class-key-dupe-first" )
			.selectmenu( "option", "classes.ui-selectmenu-button-closed" )
			.match( /something-custom/g ) || [] ).length, 1,
		"Class 'something-custom' appears exactly once in the first widget's class key value" );

	assert.strictEqual(
		( $( "#class-key-dupe-second" )
			.selectmenu( "option", "classes.ui-selectmenu-button-closed" )
			.match( /something-custom/g ) || [] ).length, 1,
		"Class 'something-custom' appears exactly once in the second widget's class key value" );
} );

} );
