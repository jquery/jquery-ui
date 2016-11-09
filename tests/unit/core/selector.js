define( [
	"qunit",
	"jquery",
	"ui/data",
	"ui/escape-selector",
	"ui/focusable",
	"ui/tabbable"
], function( QUnit, $ ) {

QUnit.module( "core - selectors" );

QUnit.assert.isFocusable = function( selector, msg ) {
	this.push( $( selector ).is( ":focusable" ), null, null,
		msg + " - selector " + selector + " is focusable" );
};

QUnit.assert.isNotFocusable = function( selector, msg ) {
	this.push( $( selector ).length && !$( selector ).is( ":focusable" ), null, null,
		msg + " - selector " + selector + " is not focusable" );
};

QUnit.assert.isTabbable = function( selector, msg ) {
	this.push( $( selector ).is( ":tabbable" ), null, null,
		msg + " - selector " + selector + " is tabbable" );
};

QUnit.assert.isNotTabbable = function( selector, msg ) {
	this.push( $( selector ).length && !$( selector ).is( ":tabbable" ), null, null,
		msg + " - selector " + selector + " is not tabbable" );
};

QUnit.test( "data", function( assert ) {
	assert.expect( 15 );

	var element;

	function shouldHaveData( msg ) {
		assert.ok( element.is( ":data(test)" ), msg );
	}

	function shouldNotHaveData( msg ) {
		assert.ok( !element.is( ":data(test)" ), msg );
	}

	element = $( "<div>" );
	shouldNotHaveData( "data never set" );

	element = $( "<div>" ).data( "test", null );
	shouldNotHaveData( "data is null" );

	element = $( "<div>" ).data( "test", true );
	shouldHaveData( "data set to true" );

	element = $( "<div>" ).data( "test", false );
	shouldNotHaveData( "data set to false" );

	element = $( "<div>" ).data( "test", 0 );
	shouldNotHaveData( "data set to 0" );

	element = $( "<div>" ).data( "test", 1 );
	shouldHaveData( "data set to 1" );

	element = $( "<div>" ).data( "test", "" );
	shouldNotHaveData( "data set to empty string" );

	element = $( "<div>" ).data( "test", "foo" );
	shouldHaveData( "data set to string" );

	element = $( "<div>" ).data( "test", [] );
	shouldHaveData( "data set to empty array" );

	element = $( "<div>" ).data( "test", [ 1 ] );
	shouldHaveData( "data set to array" );

	element = $( "<div>" ).data( "test", {} );
	shouldHaveData( "data set to empty object" );

	element = $( "<div>" ).data( "test", { foo: "bar" } );
	shouldHaveData( "data set to object" );

	element = $( "<div>" ).data( "test", new Date() );
	shouldHaveData( "data set to date" );

	element = $( "<div>" ).data( "test", /test/ );
	shouldHaveData( "data set to regexp" );

	element = $( "<div>" ).data( "test", function() {} );
	shouldHaveData( "data set to function" );
} );

QUnit.test( "focusable - visible, enabled elements", function( assert ) {
	assert.expect( 22 );

	assert.isNotFocusable( "#formNoTabindex", "form" );
	assert.isFocusable( "#formTabindex", "form with tabindex" );
	assert.isFocusable( "#enabledFieldset input", "input in enabled fieldset" );
	assert.isNotFocusable( "#disabledFieldset input", "input in disabled fieldset" );
	assert.isFocusable( "#visibleAncestor-inputTypeNone", "input, no type" );
	assert.isFocusable( "#visibleAncestor-inputTypeText", "input, type text" );
	assert.isFocusable( "#visibleAncestor-inputTypeCheckbox", "input, type checkbox" );
	assert.isFocusable( "#visibleAncestor-inputTypeRadio", "input, type radio" );
	assert.isFocusable( "#visibleAncestor-inputTypeButton", "input, type button" );
	assert.isNotFocusable( "#visibleAncestor-inputTypeHidden", "input, type hidden" );
	assert.isFocusable( "#visibleAncestor-button", "button" );
	assert.isFocusable( "#visibleAncestor-select", "select" );
	assert.isFocusable( "#visibleAncestor-textarea", "textarea" );
	assert.isFocusable( "#visibleAncestor-object", "object" );
	assert.isFocusable( "#visibleAncestor-anchorWithHref", "anchor with href" );
	assert.isNotFocusable( "#visibleAncestor-anchorWithoutHref", "anchor without href" );
	assert.isNotFocusable( "#visibleAncestor-span", "span" );
	assert.isNotFocusable( "#visibleAncestor-div", "div" );
	assert.isFocusable( "#visibleAncestor-spanWithTabindex", "span with tabindex" );
	assert.isFocusable( "#visibleAncestor-divWithNegativeTabindex", "div with tabindex" );
	assert.isFocusable( "#nestedVisibilityInheritWithVisibleAncestor",
			"span, visibility: inherit inside visibility: visible parent" );
	assert.isFocusable( "#nestedVisibilityInheritWithVisibleAncestor-input",
			"input, visibility: inherit inside visibility: visible parent" );
} );

QUnit.test( "focusable - disabled elements", function( assert ) {
	assert.expect( 9 );

	assert.isNotFocusable( "#disabledElement-inputTypeNone", "input, no type" );
	assert.isNotFocusable( "#disabledElement-inputTypeText", "input, type text" );
	assert.isNotFocusable( "#disabledElement-inputTypeCheckbox", "input, type checkbox" );
	assert.isNotFocusable( "#disabledElement-inputTypeRadio", "input, type radio" );
	assert.isNotFocusable( "#disabledElement-inputTypeButton", "input, type button" );
	assert.isNotFocusable( "#disabledElement-inputTypeHidden", "input, type hidden" );
	assert.isNotFocusable( "#disabledElement-button", "button" );
	assert.isNotFocusable( "#disabledElement-select", "select" );
	assert.isNotFocusable( "#disabledElement-textarea", "textarea" );
} );

QUnit.test( "focusable - hidden styles", function( assert ) {
	assert.expect( 12 );

	assert.isNotFocusable( "#displayNoneAncestor-input", "input, display: none parent" );
	assert.isNotFocusable( "#displayNoneAncestor-span", "span with tabindex, display: none parent" );

	assert.isNotFocusable( "#visibilityHiddenAncestor-input", "input, visibility: hidden parent" );
	assert.isNotFocusable( "#visibilityHiddenAncestor-span", "span with tabindex, visibility: hidden parent" );

	assert.isFocusable( "#nestedVisibilityOverrideAncestor-input", "input, visibility: visible parent but visibility: hidden grandparent" );
	assert.isFocusable( "#nestedVisibilityOverrideAncestor-span", "span with tabindex, visibility: visible parent but visibility: hidden grandparent " );

	assert.isNotFocusable( "#nestedVisibilityInheritWithHiddenAncestor", "span, visibility: inherit inside visibility: hidden parent" );
	assert.isNotFocusable( "#nestedVisibilityInheritWithHiddenAncestor-input", "input, visibility: inherit inside visibility: hidden parent" );

	assert.isNotFocusable( "#displayNone-input", "input, display: none" );
	assert.isNotFocusable( "#visibilityHidden-input", "input, visibility: hidden" );

	assert.isNotFocusable( "#displayNone-span", "span with tabindex, display: none" );
	assert.isNotFocusable( "#visibilityHidden-span", "span with tabindex, visibility: hidden" );
} );

QUnit.test( "focusable - natively focusable with various tabindex", function( assert ) {
	assert.expect( 4 );

	assert.isFocusable( "#inputTabindex0", "input, tabindex 0" );
	assert.isFocusable( "#inputTabindex10", "input, tabindex 10" );
	assert.isFocusable( "#inputTabindex-1", "input, tabindex -1" );
	assert.isFocusable( "#inputTabindex-50", "input, tabindex -50" );
} );

QUnit.test( "focusable - not natively focusable with various tabindex", function( assert ) {
	assert.expect( 4 );

	assert.isFocusable( "#spanTabindex0", "span, tabindex 0" );
	assert.isFocusable( "#spanTabindex10", "span, tabindex 10" );
	assert.isFocusable( "#spanTabindex-1", "span, tabindex -1" );
	assert.isFocusable( "#spanTabindex-50", "span, tabindex -50" );
} );

QUnit.test( "focusable - area elements", function( assert ) {
	assert.expect( 3 );

	assert.isFocusable( "#areaCoordsHref", "coords and href" );
	assert.isFocusable( "#areaNoCoordsHref", "href but no coords" );
	assert.isNotFocusable( "#areaNoImg", "not associated with an image" );
} );

QUnit.test( "focusable - dimensionless parent with overflow", function( assert ) {
	assert.expect( 1 );

	assert.isFocusable( "#dimensionlessParent", "input" );
} );

QUnit.test( "tabbable - visible, enabled elements", function( assert ) {
	assert.expect( 20 );

	assert.isNotTabbable( "#formNoTabindex", "form" );
	assert.isTabbable( "#formTabindex", "form with tabindex" );
	assert.isTabbable( "#enabledFieldset input", "input in enabled fieldset" );
	assert.isNotTabbable( "#disabledFieldset input", "input in disabled fieldset" );
	assert.isTabbable( "#visibleAncestor-inputTypeNone", "input, no type" );
	assert.isTabbable( "#visibleAncestor-inputTypeText", "input, type text" );
	assert.isTabbable( "#visibleAncestor-inputTypeCheckbox", "input, type checkbox" );
	assert.isTabbable( "#visibleAncestor-inputTypeRadio", "input, type radio" );
	assert.isTabbable( "#visibleAncestor-inputTypeButton", "input, type button" );
	assert.isNotTabbable( "#visibleAncestor-inputTypeHidden", "input, type hidden" );
	assert.isTabbable( "#visibleAncestor-button", "button" );
	assert.isTabbable( "#visibleAncestor-select", "select" );
	assert.isTabbable( "#visibleAncestor-textarea", "textarea" );
	assert.isTabbable( "#visibleAncestor-object", "object" );
	assert.isTabbable( "#visibleAncestor-anchorWithHref", "anchor with href" );
	assert.isNotTabbable( "#visibleAncestor-anchorWithoutHref", "anchor without href" );
	assert.isNotTabbable( "#visibleAncestor-span", "span" );
	assert.isNotTabbable( "#visibleAncestor-div", "div" );
	assert.isTabbable( "#visibleAncestor-spanWithTabindex", "span with tabindex" );
	assert.isNotTabbable( "#visibleAncestor-divWithNegativeTabindex", "div with tabindex" );
} );

QUnit.test( "tabbable - disabled elements", function( assert ) {
	assert.expect( 9 );

	assert.isNotTabbable( "#disabledElement-inputTypeNone", "input, no type" );
	assert.isNotTabbable( "#disabledElement-inputTypeText", "input, type text" );
	assert.isNotTabbable( "#disabledElement-inputTypeCheckbox", "input, type checkbox" );
	assert.isNotTabbable( "#disabledElement-inputTypeRadio", "input, type radio" );
	assert.isNotTabbable( "#disabledElement-inputTypeButton", "input, type button" );
	assert.isNotTabbable( "#disabledElement-inputTypeHidden", "input, type hidden" );
	assert.isNotTabbable( "#disabledElement-button", "button" );
	assert.isNotTabbable( "#disabledElement-select", "select" );
	assert.isNotTabbable( "#disabledElement-textarea", "textarea" );
} );

QUnit.test( "tabbable - hidden styles", function( assert ) {
	assert.expect( 10 );

	assert.isNotTabbable( "#displayNoneAncestor-input", "input, display: none parent" );
	assert.isNotTabbable( "#displayNoneAncestor-span", "span with tabindex, display: none parent" );

	assert.isNotTabbable( "#visibilityHiddenAncestor-input", "input, visibility: hidden parent" );
	assert.isNotTabbable( "#visibilityHiddenAncestor-span", "span with tabindex, visibility: hidden parent" );

	assert.isTabbable( "#nestedVisibilityOverrideAncestor-input", "input, visibility: visible parent but visibility: hidden grandparent" );
	assert.isTabbable( "#nestedVisibilityOverrideAncestor-span", "span with tabindex, visibility: visible parent but visibility: hidden grandparent " );

	assert.isNotTabbable( "#displayNone-input", "input, display: none" );
	assert.isNotTabbable( "#visibilityHidden-input", "input, visibility: hidden" );

	assert.isNotTabbable( "#displayNone-span", "span with tabindex, display: none" );
	assert.isNotTabbable( "#visibilityHidden-span", "span with tabindex, visibility: hidden" );
} );

QUnit.test( "tabbable -  natively tabbable with various tabindex", function( assert ) {
	assert.expect( 4 );

	assert.isTabbable( "#inputTabindex0", "input, tabindex 0" );
	assert.isTabbable( "#inputTabindex10", "input, tabindex 10" );
	assert.isNotTabbable( "#inputTabindex-1", "input, tabindex -1" );
	assert.isNotTabbable( "#inputTabindex-50", "input, tabindex -50" );
} );

QUnit.test( "tabbable -  not natively tabbable with various tabindex", function( assert ) {
	assert.expect( 4 );

	assert.isTabbable( "#spanTabindex0", "span, tabindex 0" );
	assert.isTabbable( "#spanTabindex10", "span, tabindex 10" );
	assert.isNotTabbable( "#spanTabindex-1", "span, tabindex -1" );
	assert.isNotTabbable( "#spanTabindex-50", "span, tabindex -50" );
} );

QUnit.test( "tabbable - area elements", function( assert ) {
	assert.expect( 3 );

	assert.isTabbable( "#areaCoordsHref", "coords and href" );
	assert.isTabbable( "#areaNoCoordsHref", "href but no coords" );
	assert.isNotTabbable( "#areaNoImg", "not associated with an image" );
} );

QUnit.test( "tabbable - dimensionless parent with overflow", function( assert ) {
	assert.expect( 1 );

	assert.isTabbable( "#dimensionlessParent", "input" );
} );

QUnit.test( "escapeSelector", function( assert ) {
	assert.expect( 1 );

	assert.equal( $( "#" + $.ui.escapeSelector( "weird-['x']-id" ) ).length, 1,
		"properly escapes selectors to use as an id" );
} );

} );
