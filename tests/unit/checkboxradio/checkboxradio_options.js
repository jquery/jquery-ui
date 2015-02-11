/*
* checkboxradio_methods.js
*/

(function($) {

module( "Checkboxradio: options" );

function assertDisabled( widget, checkbox ) {
	QUnit.assert.hasClasses( widget, "ui-state-disabled",
		"label gets ui-state-disabled" );
	strictEqual( checkbox.is( ":disabled" ), true,
		"checkbox is disabled" );
}

function assertEnabled( widget, checkbox ) {
	QUnit.assert.lacksClasses(  widget, "ui-state-disabled",
		"label has ui-state-disabled removed when disabled set to false" );
	strictEqual( checkbox.is( ":disabled" ), false,
		"checkbox has disabled prop removed when disabled set to false" );
}

test( "disabled", function() {
	var checkbox = $( "#checkbox-option-disabled" ),
		widget;
	expect( 6 );
	checkbox.checkboxradio({
		disabled: true
	});

	widget = checkbox.checkboxradio( "widget" );

	assertDisabled( widget, checkbox );

	checkbox.checkboxradio( "option", "disabled", false );

	assertEnabled( widget, checkbox );

	checkbox.checkboxradio( "option", "disabled", true );

	assertDisabled( widget, checkbox );
});
test( "disabled - prop true on init", function() {
	expect( 2 );
	var checkbox = $( "#checkbox-option-disabled" ),
		widget;

	checkbox.prop( "disabled", true );
	checkbox.checkboxradio();
	widget = checkbox.checkboxradio( "widget" );

	assertDisabled( widget, checkbox );
});
test( "disabled - explicit null value", function() {
	expect( 2 );
	var checkbox = $( "#checkbox-option-disabled" ),
		widget;

	checkbox.prop( "disabled", true );

	checkbox.checkboxradio({
		disabled: null
	});
	widget = checkbox.checkboxradio( "widget" );

	assertDisabled( widget, checkbox );
});

function assertNoIcon( widget ) {
	strictEqual( widget.find( "span.ui-icon" ).length, 0,
		"Label does not contain an icon" );
}
function assertIcon( widget, icon ) {
	icon = icon || "blank";
	strictEqual( widget.find( ".ui-icon" ).length, 1,
		"Label contains icon" );
	QUnit.assert.hasClasses( widget.find( ".ui-icon" ), "ui-checkboxradio-icon ui-corner-all ui-icon " +
		"ui-icon-background ui-icon-" + icon,
		"Icon has proper classes" );
}
test( "icon - false on init", function() {
	var checkbox = $( "#checkbox-option-icon" ),
		widget;

	expect( 1 );

	checkbox.checkboxradio({ icon: false });

	widget = checkbox.checkboxradio( "widget" );

	assertNoIcon( widget );
});

test( "icon - default unchecked", function() {
	var checkbox = $( "#checkbox-option-icon" ),
		widget;

	expect( 2 );

	checkbox.checkboxradio();
	widget = checkbox.checkboxradio( "widget" );

	assertIcon( widget );
});
test( "icon", function(){
	var checkbox = $( "#checkbox-option-icon" ),
		widget;

	expect( 8 );

	checkbox.prop( "checked", true );

	checkbox.checkboxradio();
	widget = checkbox.checkboxradio( "widget" );

	assertIcon( widget, "check" );

	checkbox.checkboxradio( "option", "icon", false );

	assertNoIcon( widget );

	checkbox.checkboxradio( "option", "icon", true );

	assertIcon( widget, "check" );

	checkbox.prop( "checked", false ).checkboxradio( "refresh" );
	checkbox.checkboxradio( "option", "icon", false );

	assertNoIcon( widget );

	checkbox.checkboxradio( "option", "icon", true );

	assertIcon( widget );

});
function getLabelText( label, element ) {
	var text = "";
	label.contents().not( element ).each( function() {
		text += ( this.nodeType === 3 ) ? $( this ).text() : "";
	});
	return text;
}
test( "label - default", function() {
	var checkbox = $( "#checkbox-option-label" ),
		widget;

	expect( 2 );

	checkbox.checkboxradio();

	widget = checkbox.checkboxradio( "widget" );

	strictEqual( checkbox.checkboxradio( "option", "label" ),
		"checkbox label", "When no value passed on create text from dom is used for option" );
	strictEqual( getLabelText( widget, checkbox ),
		"checkbox label", "When no value passed on create text from dom is used in dom" );
});
test( "label - explicit value", function() {
	var checkbox = $( "#checkbox-option-label" ),
		widget;

	expect( 2 );

	checkbox.checkboxradio({
		label: "foo"
	});

	widget = checkbox.checkboxradio( "widget" );

	strictEqual( checkbox.checkboxradio( "option", "label" ),
		"foo", "When value is passed on create value is used for option" );
	strictEqual( getLabelText( widget, checkbox ),
		"foo", "When value is passed on create value is used in dom" );

});

test( "label - explicit null value", function() {
	var checkbox = $( "#checkbox-option-label" ),
		widget;

	expect( 2 );

	// We are testing the default here because the default null is a special value which means to check
	// the DOM, so we need to make sure this happens correctly checking the options should never return
	// null. It should always be true or false
	checkbox.checkboxradio({
		label: null
	});

	widget = checkbox.checkboxradio( "widget" );

	strictEqual( checkbox.checkboxradio( "option", "label" ),
		"checkbox label", "When null is passed on create text from dom is used for option" );
	strictEqual( getLabelText( widget, checkbox ),
		"checkbox label", "When null is passed on create text from dom is used in dom" );

});

test( "label", function() {
	var checkbox = $( "#checkbox-option-label" ),
		widget;

	expect( 4 );

	checkbox.checkboxradio();
	widget = checkbox.checkboxradio( "widget" );

	checkbox.checkboxradio( "option", "label", "bar" );

	strictEqual( checkbox.checkboxradio( "option", "label" ),
		"bar", "When value is passed value is used for option" );
	strictEqual( getLabelText( widget, checkbox ),
		"bar", "When value is passed value is used in dom" );

	checkbox.checkboxradio( "option", "label", null );

	strictEqual( checkbox.checkboxradio( "option", "label" ),
		"bar", "When null is passed text from dom is used for option" );
	strictEqual( getLabelText( widget, checkbox ),
		"bar", "When null is passed text from dom is used in dom" );

});

})(jQuery);
