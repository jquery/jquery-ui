module( "Controlgroup: options" );

function hasCornerClass( element ) {
	return !!element.attr( "class" ).match( /ui-corner/g );
}

test( "disabled", function() {
	expect( 4 );
	var element = $( ".controlgroup" ).controlgroup().controlgroup( "option", "disabled", true );
	strictEqual( element.hasClass( "ui-state-disabled" ), false,
		"ui-state-disabled is not present on widget after setting disabled true" );
	strictEqual( element.find( ".ui-state-disabled" ).length, 6,
		"Child widgets are disabled" );

	element.controlgroup( "option", "disabled", false );
	strictEqual( element.hasClass( "ui-state-disabled" ), false,
		"ui-state-disabled is not present on widget after setting disabled false" );
	strictEqual( element.find( ".ui-state-disabled" ).length, 0,
		"Child widgets are not disabled" );

});
test( "items - null", function() {
	expect( 2 );
	var element = $( ".controlgroup" ).controlgroup({
		items: {
			"button": null,
			"selectmenu": null,
			"checkboxradio": null
		}
	});

	strictEqual( element.children( ".ui-button" ).length, 0,
		"Child widgets are not called when selector is null" );

	element.controlgroup( "option", "items", {
		"button": "button"
	});
	strictEqual( element.children( ".ui-button" ).length, 2,
		"Correct child widgets are called when selector is updated" );
});

test( "items: custom selector", function() {
	expect( 1 );
	var element = $( ".controlgroup" ).controlgroup({
		items: {
			"button": ".button"
		}
	});
	strictEqual( element.children( ".ui-button" ).length, 4,
		"Correct child widgets are called when custom selector used" );
});

$.widget( "ui.test", {
	_create: function (){
		this.element.addClass( "ui-test ui-button" );
	},
	refresh: function() {
		return;
	}
});
test( "items: custom widget", function() {
	expect( 2 );
	var element = $( ".controlgroup" ).controlgroup({
		items: {
			"test": ".test"
		}
	});

	strictEqual( element.children( ".ui-button" ).length, 7,
		"Correct child widgets are called when custom selector used" );
	strictEqual( element.children( ".ui-test" ).length, 1,
		"Custom widget called" );
});

test( "excludeInvisible", function( assert ) {
	expect( 4 );
	var element = $( ".controlgroup" ).controlgroup({
			excludeInvisible: false
		}),
		buttons = element.children( ".ui-button" );

	strictEqual( hasCornerClass( buttons.eq( 1 ) ), false,
		"ExcludeInvisible: false: Hidden first element get a corner class" );
	assert.hasClasses( buttons.eq( 0 ), "ui-corner-left",
		"ExcludeInvisible: false: First button hidden second button doesn't get a corner class" );

	element.controlgroup( "option", "excludeInvisible", true );
	strictEqual( hasCornerClass( buttons.eq( 0 ) ), false,
		"ExcludeInvisible: true: Hidden first element does not get a corner class" );
	assert.hasClasses( buttons.eq( 1 ), "ui-corner-left",
		"ExcludeInvisible: true: First button is hidden second button get corner class" );
});

test( "direction", function() {
	expect( 6 );
	var element = $( ".controlgroup" ).controlgroup(),
		buttons = element.children( ".ui-button" ).filter( ":visible" );

	strictEqual( element.hasClass( "ui-controlgroup-horizontal" ), true,
		"Controlgroup gets horizontal class by default" );
	strictEqual( buttons.first().hasClass( "ui-corner-left" ), true,
		"First visible element in horizontal controlgroup gets ui-corner-left" );
	strictEqual( buttons.last().hasClass( "ui-corner-right" ), true,
		"Last visible element in horizontal controlgroup gets ui-corner-right" );

	element.controlgroup( "option", "direction", "vertical" );
	strictEqual( element.hasClass( "ui-controlgroup-vertical" ), true,
		"Controlgroup gets vertical class by default" );
	strictEqual( buttons.first().hasClass( "ui-corner-top" ), true,
		"First visible element in vertical controlgroup gets ui-corner-top" );
	strictEqual( buttons.last().hasClass( "ui-corner-bottom" ), true,
		"Last visible element in vertical controlgroup gets ui-corner-bottom" );
});
