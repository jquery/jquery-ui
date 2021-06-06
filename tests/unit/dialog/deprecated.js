define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/dialog"
], function( QUnit, $, helper ) {
"use strict";

QUnit.module( "dialog (deprecated): options", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "dialogClass", function( assert ) {
	assert.expect( 5 );

	var element = $( "<div>" ).dialog(),
		widget = element.dialog( "widget" );
	assert.lacksClasses( widget, "foo", "dialogClass not specified. class not added" );
	element.remove();

	element = $( "<div>" ).dialog( { dialogClass: "foo" } );
	widget = element.dialog( "widget" );
	assert.hasClasses( widget, "foo", "dialogClass in init, foo class added" );
	element.dialog( "option", "dialogClass", "foobar" );
	assert.lacksClasses( widget, "foo", "dialogClass changed, previous one was removed" );
	assert.hasClasses( widget, "foobar", "dialogClass changed, new one was added" );
	element.remove();

	element = $( "<div>" ).dialog( { dialogClass: "foo bar" } );
	widget = element.dialog( "widget" );
	assert.hasClasses( widget, "foo bar", "dialogClass in init, two classes." );
	element.remove();
} );

QUnit.test( "buttons - deprecated options", function( assert ) {
	assert.expect( 7 );

	var buttons,
		element = $( "<div></div>" ).dialog( {
			buttons: [
				{
					html: "a button",
					"class": "additional-class",
					id: "my-button-id",
					click: function() {
						assert.equal( this, element[ 0 ], "correct context" );
					},
					icons: { primary: "ui-icon-cancel" },
					text: false
				}
			]
		} );

	buttons = element.dialog( "widget" ).find( ".ui-dialog-buttonpane button" );
	assert.equal( buttons.length, 1, "correct number of buttons" );
	assert.equal( buttons.attr( "id" ), "my-button-id", "correct id" );
	assert.equal( String.prototype.trim.call( buttons.text() ), "a button", "correct label" );
	assert.hasClasses( buttons, "additional-class" );
	assert.deepEqual( buttons.button( "option", "icon" ), "ui-icon-cancel" );
	assert.equal( buttons.button( "option", "showLabel" ), false );
	buttons.trigger( "click" );

	element.remove();
} );
} );
