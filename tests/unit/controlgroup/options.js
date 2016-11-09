define( [
	"qunit",
	"jquery",
	"ui/widgets/controlgroup",
	"ui/widgets/checkboxradio",
	"ui/widgets/selectmenu",
	"ui/widgets/button",
	"ui/widgets/spinner"
], function( QUnit, $ ) {

QUnit.module( "Controlgroup: options" );

QUnit.test( "disabled", function( assert ) {
	assert.expect( 4 );
	var element = $( ".controlgroup" ).controlgroup().controlgroup( "option", "disabled", true );
	assert.lacksClasses( element, "ui-state-disabled" );
	assert.equal( element.find( ".ui-state-disabled" ).length, 9, "Child widgets are disabled" );

	element.controlgroup( "option", "disabled", false );
	assert.lacksClasses( element, "ui-state-disabled" );
	assert.strictEqual( element.find( ".ui-state-disabled" ).length, 0, "Child widgets are not disabled" );

} );

QUnit.test( "items - null", function( assert ) {
	assert.expect( 2 );
	var element = $( ".controlgroup" ).controlgroup( {
		items: {
			"button": null,
			"selectmenu": null,
			"checkboxradio": null
		}
	} );

	assert.strictEqual( element.children( ".ui-button" ).length, 0,
		"Child widgets are not called when selector is null" );

	element.controlgroup( "option", "items", {
		"button": "button"
	} );
	assert.strictEqual( element.children( ".ui-button" ).length, 2,
		"Correct child widgets are called when selector is updated" );
} );

QUnit.test( "items: custom selector", function( assert ) {
	assert.expect( 1 );
	var element = $( ".controlgroup" ).controlgroup( {
		items: {
			"button": ".button"
		}
	} );
	assert.strictEqual( element.children( ".ui-button" ).length, 4,
		"Correct child widgets are called when custom selector used" );
} );

$.widget( "ui.test", {
	_create: function() {
		this.element.addClass( "ui-test ui-button" );
	},

	// Controlgroup requires a refresh method to exist
	refresh: $.noop
} );

QUnit.test( "items: custom widget", function( assert ) {
	assert.expect( 2 );
	var element = $( ".controlgroup" ).controlgroup( {
		items: {
			"test": ".test"
		}
	} );

	assert.strictEqual( element.children( ".ui-button" ).length, 7,
		"Correct child widgets are called when custom selector used" );
	assert.strictEqual( element.children( ".ui-test" ).length, 1,
		"Custom widget called" );
} );

QUnit.test( "onlyVisible", function( assert ) {
	assert.expect( 4 );
	var element = $( ".controlgroup" ).controlgroup( {
			onlyVisible: false
		} ),
		buttons = element.children( ".ui-button" );

	assert.lacksClassStart( buttons.eq( 1 ), "ui-corner" );
	assert.hasClasses( buttons.eq( 0 ), "ui-corner-left",
		"onlyVisible: false: First button hidden second button doesn't get a corner class" );

	element.controlgroup( "option", "onlyVisible", true );
	assert.lacksClassStart( buttons.eq( 0 ), "ui-corner" );
	assert.hasClasses( buttons.eq( 1 ), "ui-corner-left",
		"onlyVisible: true: First button is hidden second button get corner class" );
} );

QUnit.test( "direction", function( assert ) {
	assert.expect( 6 );
	var element = $( ".controlgroup" ).controlgroup(),
		buttons = element.children( ".ui-button" ).filter( ":visible" );

	assert.hasClasses( element, "ui-controlgroup-horizontal" );
	assert.hasClasses( buttons.first(), "ui-corner-left" );
	assert.hasClasses( buttons.last(), "ui-corner-right" );

	element.controlgroup( "option", "direction", "vertical" );
	assert.hasClasses( element, "ui-controlgroup-vertical" );
	assert.hasClasses( buttons.first(), "ui-corner-top" );
	assert.hasClasses( buttons.last(), "ui-corner-bottom" );
} );

} );
