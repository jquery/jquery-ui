define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widget"
], function( QUnit, $, helper ) {
"use strict";

QUnit.module( "widget factory classes", {
	beforeEach: function() {
		$.widget( "ui.classesWidget", {
			options: {
				classes: {
					"ui-classes-widget": "ui-theme-widget",
					"ui-classes-element": "ui-theme-element ui-theme-element-2"
				}
			},
			_create: function() {
				this.span = $( "<span>" )
					.add( "<span>" )
					.add( "<span>" )
					.appendTo( this.element );

				this.element.wrap( "<div>" );

				this.wrapper = this.element.parent();

				this._addClass( "ui-classes-element", "ui-core-element" )
					._addClass( "ui-classes-element-2" )
					._addClass( null, "ui-core-element-null" )
					._addClass( this.span, null, "ui-core-span-null" )
					._addClass( this.span, "ui-classes-span", "ui-core-span" )
					._addClass( this.wrapper, "ui-classes-widget" );

			},
			toggleClasses: function( bool ) {
				this._toggleClass( "ui-classes-element", "ui-core-element", bool )
					._toggleClass( "ui-classes-element-2", null, bool )
					._toggleClass( null, "ui-core-element-null", bool )
					._toggleClass( this.span, null, "ui-core-span-null", bool )
					._toggleClass( this.span, "ui-classes-span", "ui-core-span", bool )
					._toggleClass( this.wrapper, "ui-classes-widget", null, bool );
			},
			removeClasses: function() {
				this._removeClass( "ui-classes-element", "ui-core-element" )
					._removeClass( "ui-classes-element-2" )
					._removeClass(  null, "ui-core-element-null"  )
					._removeClass( this.span, null, "ui-core-span-null" )
					._removeClass( this.span, "ui-classes-span", "ui-core-span" )
					._removeClass( this.wrapper, "ui-classes-widget" );
			},
			_destroy: function() {
				this.span.remove();
				this.element.unwrap();
				return helper.moduleAfterEach.apply( this, arguments );
			}
		} );
	},
	afterEach: function() {
		delete $.ui.classesWidget;
		delete $.fn.classesWidget;
	}
} );

function elementHasClasses( widget, method, assert ) {
	var toggle = method === "toggle" ? ( ", true" ) : "";

	assert.hasClasses( widget, "ui-classes-element ui-theme-element ui-theme-element-2",
		"_" + method + "Class works with ( keys, extra" + toggle + " )" );
	assert.hasClasses( widget, "ui-classes-element-2",
		"_" + method + "Class works with ( keys, null" + toggle + " )" );
	assert.hasClasses( widget, "ui-core-element-null",
		"_" + method + "Class works with ( null, extra" + toggle + " )" );
	assert.hasClasses( widget.parent(), "ui-classes-widget ui-theme-widget",
		"_" + method + "Class works with ( element, null, extra" + toggle + " )" );
	assert.hasClasses( widget.find( "span" )[ 0 ], "ui-classes-span ui-core-span",
		"_" + method + "Class works with ( element, keys, extra" + toggle + " )" );
	assert.hasClasses( widget.find( "span" )[ 0 ], "ui-core-span-null",
		"_" + method + "Class works with ( element, keys, null" + toggle + " )" );
}
function elementLacksClasses( widget, method, assert ) {
	var toggle = method === "toggle" ? ( ", false" ) : "";

	assert.lacksClasses( widget, "ui-classes-element ui-theme-element ui-theme-element-2",
		"_" + method + "Class works with ( keys, extra" + toggle + " )" );
	assert.lacksClasses( widget, "ui-classes-element-2",
		"_" + method + "Class works with ( keys, null" + toggle + " )" );
	assert.lacksClasses( widget, "ui-core-element-null",
		"_" + method + "Class works with ( null, extra" + toggle + " )" );
	assert.lacksClasses( widget.parent(), "ui-classes-widget ui-theme-widget",
		"_" + method + "Class works with ( element, null, extra" + toggle + " )" );
	assert.lacksClasses( widget.find( "span" )[ 0 ], "ui-classes-span ui-core-span",
		"_" + method + "Class works with ( element, keys, extra" + toggle + " )" );
	assert.lacksClasses( widget.find( "span" )[ 0 ], "ui-core-span-null",
		"_" + method + "Class works with ( element, keys, null" + toggle + " )" );
}

QUnit.test( ".option() - classes setter", function( assert ) {
	assert.expect( 11 );

	var testWidget = $.ui.classesWidget();

	elementHasClasses( testWidget.element, "add", assert );

	testWidget.option( {
		classes: {
			"ui-classes-span": "custom-theme-span",
			"ui-classes-widget": "ui-theme-widget custom-theme-widget",
			"ui-classes-element": "ui-theme-element-2"
		}
	} );

	assert.lacksClasses( testWidget.element, "ui-theme-element",
		"Removing a class from the value removes the class" );

	testWidget.option( "classes.ui-classes-element", "" );
	assert.hasClasses( testWidget.element, "ui-classes-element",
		"Setting to empty value leaves structure class" );
	assert.lacksClasses( testWidget.element, "ui-theme-element-2",
		"Setting empty value removes previous value classes" );
	assert.hasClasses( testWidget.span[ 0 ], "ui-classes-span custom-theme-span",
		"Adding a class to an empty value works as expected" );
	assert.hasClasses( testWidget.wrapper, "ui-classes-widget custom-theme-widget",
		"Appending a class to the current value works as expected" );
} );

QUnit.test( ".destroy() - class removal", function( assert ) {
	assert.expect( 1 );

	assert.domEqual( "#widget", function() {
		$( "#widget" ).classesWidget().classesWidget( "destroy" );
	} );
} );

QUnit.test( "._add/_remove/_toggleClass()", function( assert ) {
	assert.expect( 24 );

	var widget = $( "#widget" ).classesWidget();

	elementHasClasses( widget, "add", assert );

	widget.classesWidget( "toggleClasses", false );
	elementLacksClasses( widget, "toggle", assert );

	widget.classesWidget( "toggleClasses", true );
	elementHasClasses( widget, "toggle", assert );

	widget.classesWidget( "removeClasses" );
	elementLacksClasses( widget, "remove", assert );
} );

QUnit.test( "Classes elements are untracked as they are removed from the DOM", function( assert ) {
	assert.expect( 9 );

	var widget = $( "#widget" ).classesWidget();
	var instance = widget.classesWidget( "instance" );

	assert.equal( instance.classesElementLookup[ "ui-classes-span" ].length, 3,
		"Widget is tracking 3 ui-classes-span elements" );
	assert.equal( instance.classesElementLookup[ "ui-core-span-null" ].length, 3,
		"Widget is tracking 3 ui-core-span-null elements" );
	assert.equal( instance.classesElementLookup[ "ui-core-span" ].length, 3,
		"Widget is tracking 3 ui-core-span elements" );

	widget.find( "span" ).eq( 0 ).remove();
	assert.equal( instance.classesElementLookup[ "ui-classes-span" ].length, 2,
		"After removing 1 span from dom 2 ui-classes-span elements are tracked" );
	assert.equal( instance.classesElementLookup[ "ui-core-span-null" ].length, 2,
		"After removing 1 span from dom 2 ui-core-span-null elements are tracked" );
	assert.equal( instance.classesElementLookup[ "ui-core-span" ].length, 2,
		"After removing 1 span from dom 2 ui-core-span elements are tracked" );

	widget.find( "span" ).remove();
	assert.equal( instance.classesElementLookup[ "ui-classes-span" ].length, 0,
		"No ui-classes-span elements are tracked after removing all spans" );
	assert.equal( instance.classesElementLookup[ "ui-core-span-null" ].length, 0,
		"No ui-core-span-null elements are tracked after removing all spans" );
	assert.equal( instance.classesElementLookup[ "ui-core-span" ].length, 0,
		"No ui-core-span elements are tracked after removing all spans" );
} );

} );
