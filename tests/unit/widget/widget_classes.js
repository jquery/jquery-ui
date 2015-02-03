(function( $ ) {

module( "widget factory classes", {
	teardown: function() {
		if ( $.ui ) {
			delete $.ui.classWidget;
			delete $.fn.classWidget;
		}
	}
});

$.widget( "ui.classesWidget", {
	options: {
		classes: {
			"test-wrapper": "self-wrapper",
			"test-self": "self-class self-class-2"
		}
	},
	_create: function() {
		this.span = $( "<span>" )
			.appendTo( this.element );

		this.element.wrap( "<div>" );

		this.wrapper = this.element.parent();

		this._addClass( "test-self", "test-self-extra" )
			._addClass( "test-self-2" )
			._addClass( null, "test-self-extra-null" )
			._addClass( this.span, null, "test-span-extra-null" )
			._addClass( this.span, "test-span", "test-span-extra" )
			._addClass( this.wrapper, "test-wrapper" );

	},
	toggleClasses: function( bool ) {
		this._toggleClass( "test-self", "test-self-extra", bool )
			._toggleClass( "test-self-2", null, bool )
			._toggleClass( null, "test-self-extra-null", bool )
			._toggleClass( this.span, null, "test-span-extra-null", bool )
			._toggleClass( this.span, "test-span", "test-span-extra", bool )
			._toggleClass( this.wrapper, "test-wrapper", null, bool );
	},
	removeClasses: function() {
		this._removeClass( "test-self", "test-self-extra" )
			._removeClass( "test-self-2" )
			._removeClass( null, "test-self-extra-null" )
			._removeClass( this.span, null, "test-span-extra-null" )
			._removeClass( this.span, "test-span", "test-span-extra" )
			._removeClass( this.wrapper, "test-wrapper" );
	},
	_destroy: function() {
		this.span.remove();
		this.element.unwrap();
	},
	widget: function() {
		return this.wrapper;
	}
});

test( ".option() - classes setter", function( assert ){
	expect( 12 );

	var testWidget = $.ui.classesWidget(),
		currentWrapperClass = testWidget.option( "classes.test-wrapper" );

	testElementClasses( testWidget.element, true, "add" );

	testWidget.option({
		classes: {
			"test-span": "self-span-new",
			"test-wrapper": currentWrapperClass + " self-wrapper-new",
			"test-self": "self-class-2"
		}
	});

	assert.hasClasses( testWidget.element, "test-self self-class-2",
		"Removing a class leaves the structure and other classes in value" );
	assert.lacksClasses( testWidget.element, "self-class",
		"Removing a class from the value removes the class" );
	testWidget.option( "classes.test-self", "" );
	assert.hasClasses( testWidget.element, "test-self",
		"Setting to empty value leaves structure class" );
	assert.lacksClasses( testWidget.element, "self-class-2",
		"Setting empty value removes previous value classes" );
	assert.hasClasses( testWidget.span, "test-span self-span-new",
		"Adding a class to an empty value works as expected" );
	assert.hasClasses( testWidget.wrapper, "test-wrapper self-wrapper-new",
		"Appending a class to the current value works as expected" );
});

test( ".destroy() - class removal", function(){
	expect( 1 );

	domEqual( "#widget", function(){
		$( "#widget" ).classesWidget().classesWidget( "destroy" );
	});
});

function testElementClasses( widget, bool, method ) {
	var toggle = method === "toggle" ? ( ", " + bool ) : "",
		assertion = QUnit.assert[ ( bool? "has" : "lacks" ) + "Classes" ];

	assertion( widget, "test-self self-class self-class-2",
		"_" + method + "Class works with ( keys, extra " + toggle + ")" );
	assertion( widget, "test-self-2",
		"_" + method + "Class works with ( keys, null " + toggle + ")" );
	assertion( widget, "test-self-extra-null",
		"_" + method + "Class works with ( null, extra " + toggle + ")" );
	assertion( widget.parent(), "test-wrapper self-wrapper",
		"_" + method + "Class works with ( element, null, extra " + toggle + ")" );
	assertion( widget.find( "span" ), "test-span test-span-extra",
		"_" + method + "Class works with ( element, keys, extra " + toggle + ")" );
	assertion( widget.find( "span" ), "test-span-extra-null",
		"_" + method + "Class works with ( element, keys, null " + toggle + ")" );
}

test( "._add/_remove/_toggleClass()", function(){
	expect( 24 );

	var widget = $( "#widget" ).classesWidget();

	testElementClasses( widget, true, "add" );
	widget.classesWidget( "toggleClasses", false );
	testElementClasses( widget, false, "toggle" );
	widget.classesWidget( "toggleClasses", true );
	testElementClasses( widget, true, "toggle" );
	widget.classesWidget( "removeClasses" );
	testElementClasses( widget, false, "remove" );
});

}( jQuery ) );
