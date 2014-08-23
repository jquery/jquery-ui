module( "Controlgroup: options" );

function hasCornerClass( className, element ) {
	if ( className ) {
		return element.hasClass( className );
	}

	return element.attr( "class" ).match( /ui-corner/g );
}

test( "disabled", function() {
	expect( 1 );
	var tests = 2,
		element = $( ".controlgroup" ).controlgroup().controlgroup( "option", "disabled", true );
	strictEqual( element.hasClass( "ui-state-disabled" ), false,
		"ui-state-disabled is present on widget after setting disabled true" );
	$.each( $.ui.controlgroup.prototype.options.items, function( widget, selector ){
		element.children( selector ).each(function(){
			expect( ++tests );
			strictEqual( $( this )[ widget ]( "widget" ).hasClass( "ui-state-disabled"), true,
				"Child " + widget + " widgets are disabled" );
		});
	});
	element.controlgroup( "option", "disabled", false );
	strictEqual( element.hasClass( "ui-state-disabled" ), false,
		"ui-state-disabled is not present on widget after setting disabled false" );
	$.each( $.ui.controlgroup.prototype.options.items, function( widget, selector ){
		element.children( selector ).each(function(){
			expect( ++tests );
			strictEqual( !$( this )[ widget ]( "widget" ).hasClass( "ui-state-disabled"), true,
				"Child " + widget + " widgets are disabled" );
		});
	});
});
test( "items", function() {
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
	expect( 2 );
});

test( "excludeInvisible", function() {
	var element = $( ".controlgroup" ).controlgroup(),
		buttons = element.children( ".ui-button" );

	expect( 4 );

	strictEqual( !!hasCornerClass( false, buttons.eq( 0 ) ), false,
		"ExcludeInvisible: true: Hidden first element does not get a corner class" );
	strictEqual( buttons.eq( 1 ).hasClass( "ui-corner-left" ), true,
		"ExcludeInvisible: true: First button is hidden second button get corner class" );
	element.controlgroup( "option", "excludeInvisible", false );
	strictEqual( !!hasCornerClass( false, buttons.eq( 1 ) ), false,
		"ExcludeInvisible: false: Hidden first element get a corner class" );
	strictEqual( buttons.eq( 0 ).hasClass( "ui-corner-left" ), true,
		"ExcludeInvisible: false: First button hidden second button doesn't get a corner class" );
});

test( "direction", function() {
	var element = $( ".controlgroup" ).controlgroup(),
		buttons = element.children( ".ui-button" );

	expect( 6 );

	strictEqual( element.hasClass( "ui-controlgroup-horizontal" ), true,
		"Controlgroup gets horizontal class by default" );
	strictEqual( buttons.filter( ":visible" ).first().hasClass( "ui-corner-left" ), true,
		"First visible element in horizontal controlgroup gets ui-corner-left" );
	strictEqual( buttons.filter( ":visible" ).last().hasClass( "ui-corner-right" ), true,
		"Last visible element in horizontal controlgroup gets ui-corner-right" );

	element.controlgroup( "option", "direction", "vertical" );
	strictEqual( element.hasClass( "ui-controlgroup-vertical" ), true,
		"Controlgroup gets vertical class by default" );
	strictEqual( buttons.filter( ":visible" ).first().hasClass( "ui-corner-top" ), true,
		"First visible element in vertical controlgroup gets ui-corner-top" );
	strictEqual( buttons.filter( ":visible" ).last().hasClass( "ui-corner-bottom" ), true,
		"Last visible element in vertical controlgroup gets ui-corner-bottom" );
});
