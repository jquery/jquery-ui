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

test( ".option() - classes setter", function(){
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

	equal( testWidget.element.is( ".test-self.self-class-2" ), true,
		"Removing a class leaves the structure and other classes in value" );
	equal( !testWidget.element.is( ".self-class" ), true,
		"Removing a class from the value removes the class" );
	testWidget.option( "classes.test-self", "" );
	equal( testWidget.element.is( ".test-self" ), true,
		"Setting to empty value leaves structure class" );
	equal( !testWidget.element.is( ".self-class-2" ), true,
		"Setting empty value removes previous value classes" );
	equal( testWidget.span.is( ".test-span.self-span-new" ), true,
		"Adding a class to an empty value works as expected" );
	equal( testWidget.wrapper.is( ".test-wrapper.self-wrapper-new" ), true,
		"Appending a class to the current value works as expected" );
});

test( ".destroy() - class removal", function(){
	expect( 1 );

	domEqual( "#widget", function(){
		$( "#widget" ).classesWidget().classesWidget( "destroy" );
	});
});

function testElementClasses( widget, bool, method, toggle ) {
	toggle = toggle || "";
	equal( widget.is( ".test-self.self-class.self-class-2" ), bool,
		"_" + method + "Class works with ( keys, extra " + toggle + ")" );
	equal( widget.is( ".test-self-2" ), bool,
		"_" + method + "Class works with ( keys, null " + toggle + ")" );
	equal( widget.is( ".test-self-extra-null" ), bool,
		"_" + method + "Class works with ( null, extra " + toggle + ")" );
	equal( widget.parent().is( ".test-wrapper.self-wrapper" ), bool,
		"_" + method + "Class works with ( element, null, extra " + toggle + ")" );
	equal( widget.find( "span" ).is( ".test-span.test-span-extra" ), bool,
		"_" + method + "Class works with ( element, keys, extra " + toggle + ")" );
	equal( widget.find( "span" ).is( ".test-span-extra-null" ), bool,
		"_" + method + "Class works with ( element, keys, null " + toggle + ")" );
}

test( "._add/_remove/_toggleClass()", function(){
	expect( 24 );

	var widget = $( "#widget" ).classesWidget();

	testElementClasses( widget, true, "add" );
	widget.classesWidget( "toggleClasses", false );
	testElementClasses( widget, false, "toggle", ", false ");
	widget.classesWidget( "toggleClasses", true );
	testElementClasses( widget, true, "toggle", ", true ");
	widget.classesWidget( "removeClasses" );
	testElementClasses( widget, false, "remove" );
});

}( jQuery ) );
