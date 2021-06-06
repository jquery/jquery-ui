define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/dialog"
], function( QUnit, $, helper ) {
"use strict";

QUnit.module( "dialog: methods", {
	afterEach: function() {
		$( "body>.ui-dialog" ).remove();
		return helper.moduleAfterEach.apply( this, arguments );
	}
} );

QUnit.test( "init", function( assert ) {
	assert.expect( 6 );

	$( "<div></div>" ).appendTo( "body" ).dialog().remove();
	assert.ok( true, ".dialog() called on element" );

	$( [] ).dialog().remove();
	assert.ok( true, ".dialog() called on empty collection" );

	$( "<div></div>" ).dialog().remove();
	assert.ok( true, ".dialog() called on disconnected DOMElement - never connected" );

	$( "<div></div>" ).appendTo( "body" ).remove().dialog().remove();
	assert.ok( true, ".dialog() called on disconnected DOMElement - removed" );

	var element = $( "<div></div>" ).dialog();
	element.dialog( "option", "foo" );
	element.remove();
	assert.ok( true, "arbitrary option getter after init" );

	$( "<div></div>" ).dialog().dialog( "option", "foo", "bar" ).remove();
	assert.ok( true, "arbitrary option setter after init" );
} );

QUnit.test( "destroy", function( assert ) {
	assert.expect( 17 );

	var element, element2;

	$( "#dialog1, #form-dialog" ).hide();
	assert.domEqual( "#dialog1", function() {
		var dialog = $( "#dialog1" ).dialog().dialog( "destroy" );
		assert.equal( dialog.parent()[ 0 ], $( "#qunit-fixture" )[ 0 ] );
		assert.equal( dialog.index(), 0 );
	} );
	assert.domEqual( "#form-dialog", function() {
		var dialog = $( "#form-dialog" ).dialog().dialog( "destroy" );
		assert.equal( dialog.parent()[ 0 ], $( "#qunit-fixture" )[ 0 ] );
		assert.equal( dialog.index(), 2 );
	} );

	// Ensure dimensions are restored (#8119)
	$( "#dialog1" ).show().css( {
		width: "400px",
		minHeight: "100px",
		height: "200px"
	} );
	assert.domEqual( "#dialog1", function() {
		$( "#dialog1" ).dialog().dialog( "destroy" );
	} );

	// Don't throw errors when destroying a never opened modal dialog (#9004)
	$( "#dialog1" ).dialog( { autoOpen: false, modal: true } ).dialog( "destroy" );
	assert.equal( $( ".ui-widget-overlay" ).length, 0, "overlay does not exist" );
	assert.equal( $( document ).data( "ui-dialog-overlays" ), undefined, "ui-dialog-overlays equals the number of open overlays" );

	element = $( "#dialog1" ).dialog( { modal: true } );
	element2 = $( "#dialog2" ).dialog( { modal: true } );
	assert.equal( $( ".ui-widget-overlay" ).length, 2, "overlays created when dialogs are open" );
	assert.equal( $( document ).data( "ui-dialog-overlays" ), 2, "ui-dialog-overlays equals the number of open overlays" );
	element.dialog( "close" );
	assert.equal( $( ".ui-widget-overlay" ).length, 1, "overlay remains after closing one dialog" );
	assert.equal( $( document ).data( "ui-dialog-overlays" ), 1, "ui-dialog-overlays equals the number of open overlays" );
	element.dialog( "destroy" );
	assert.equal( $( ".ui-widget-overlay" ).length, 1, "overlay remains after destroying one dialog" );
	assert.equal( $( document ).data( "ui-dialog-overlays" ), 1, "ui-dialog-overlays equals the number of open overlays" );
	element2.dialog( "destroy" );
	assert.equal( $( ".ui-widget-overlay" ).length, 0, "overlays removed when all dialogs are destoryed" );
	assert.equal( $( document ).data( "ui-dialog-overlays" ), undefined, "ui-dialog-overlays equals the number of open overlays" );
} );

QUnit.test( "#9000: Dialog leaves broken event handler after close/destroy in certain cases", function( assert ) {
	var ready = assert.async();
	assert.expect( 1 );
	$( "#dialog1" ).dialog( { modal: true } ).dialog( "close" ).dialog( "destroy" );
	setTimeout( function() {
		$( "#favorite-animal" ).trigger( "focus" );
		assert.ok( true, "close and destroy modal dialog before its really opened" );
		ready();
	} );
} );

QUnit.test( "#4980: Destroy should place element back in original DOM position", function( assert ) {
	assert.expect( 2 );
	var container = $( "<div id='container'><div id='modal'>Content</div></div>" ),
		modal = container.find( "#modal" );
	modal.dialog();
	assert.ok( !$.contains( container[ 0 ], modal[ 0 ] ), "dialog should move modal element to outside container element" );
	modal.dialog( "destroy" );
	assert.ok( $.contains( container[ 0 ], modal[ 0 ] ), "dialog(destroy) should place element back in original DOM position" );
} );

QUnit.test( "enable/disable disabled", function( assert ) {
	assert.expect( 3 );
	var element = $( "<div></div>" ).dialog();
	element.dialog( "disable" );
	assert.equal( element.dialog( "option", "disabled" ), false, "disable method doesn't do anything" );
	assert.lacksClasses( element, "ui-dialog-disabled ui-state-disabled", "disable method doesn't add classes" );
	assert.ok( !element.dialog( "widget" ).attr( "aria-disabled" ), "disable method doesn't add aria-disabled" );
} );

QUnit.test( "close", function( assert ) {
	assert.expect( 3 );

	var element,
		expected = $( "<div></div>" ).dialog(),
		actual = expected.dialog( "close" );
	assert.equal( actual, expected, "close is chainable" );

	element = $( "<div></div>" ).dialog();
	assert.ok( element.dialog( "widget" ).is( ":visible" ) && !element.dialog( "widget" ).is( ":hidden" ), "dialog visible before close method called" );
	element.dialog( "close" );
	assert.ok( element.dialog( "widget" ).is( ":hidden" ) && !element.dialog( "widget" ).is( ":visible" ), "dialog hidden after close method called" );
} );

QUnit.test( "isOpen", function( assert ) {
	assert.expect( 4 );

	var element = $( "<div></div>" ).dialog();
	assert.equal( element.dialog( "isOpen" ), true, "dialog is open after init" );
	element.dialog( "close" );
	assert.equal( element.dialog( "isOpen" ), false, "dialog is closed" );
	element.remove();

	element = $( "<div></div>" ).dialog( { autoOpen: false } );
	assert.equal( element.dialog( "isOpen" ), false, "dialog is closed after init" );
	element.dialog( "open" );
	assert.equal( element.dialog( "isOpen" ), true, "dialog is open" );
	element.remove();
} );

QUnit.test( "moveToTop", function( assert ) {
	assert.expect( 5 );
	function order() {
		var actual = $( ".ui-dialog" ).map( function() {
			return +$( this ).css( "z-index" );
		} ).get();
		assert.deepEqual( actual, $.makeArray( arguments ) );
	}
	var dialog1, dialog2,
		focusOn = "dialog1";
	dialog1 = $( "#dialog1" ).dialog( {
		focus: function() {
			assert.equal( focusOn, "dialog1" );
		}
	} );
	focusOn = "dialog2";
	dialog2 = $( "#dialog2" ).dialog( {
		focus: function() {
			assert.equal( focusOn, "dialog2" );
		}
	} );
	order( 100, 101 );
	focusOn = "dialog1";
	dialog1.dialog( "moveToTop" );
	order( 102, 101 );
} );

QUnit.test( "moveToTop: content scroll stays intact", function( assert ) {
	assert.expect( 2 );
	var otherDialog = $( "#dialog1" ).dialog(),
		scrollDialog = $( "#form-dialog" ).dialog( {
			height: 200
		} );
	scrollDialog.scrollTop( 50 );
	assert.equal( scrollDialog.scrollTop(), 50 );

	otherDialog.dialog( "moveToTop" );
	assert.equal( scrollDialog.scrollTop(), 50 );
} );

QUnit.test( "open", function( assert ) {
	assert.expect( 3 );
	var element,
		expected = $( "<div></div>" ).dialog(),
		actual = expected.dialog( "open" );
	assert.equal( actual, expected, "open is chainable" );

	element = $( "<div></div>" ).dialog( { autoOpen: false } );
	assert.ok( element.dialog( "widget" ).is( ":hidden" ) && !element.dialog( "widget" ).is( ":visible" ), "dialog hidden before open method called" );
	element.dialog( "open" );
	assert.ok( element.dialog( "widget" ).is( ":visible" ) && !element.dialog( "widget" ).is( ":hidden" ), "dialog visible after open method called" );
} );

// http://bugs.jqueryui.com/ticket/6137
QUnit.test( "Ensure form elements don't reset when opening a dialog", function( assert ) {
	assert.expect( 2 );

	var d1 = $( "<form><input type='radio' name='radio' id='a' value='a' checked='checked'></input>" +
				"<input type='radio' name='radio' id='b' value='b'>b</input></form>" ).appendTo( "body" ).dialog( { autoOpen: false } );

	d1.find( "#b" ).prop( "checked", true );
	assert.equal( d1.find( "input:checked" ).val(), "b", "checkbox b is checked" );

	d1.dialog( "open" );
	assert.equal( d1.find( "input:checked" ).val(), "b", "checkbox b is checked" );

	d1.remove();
} );

QUnit.test( "#8958: dialog can be opened while opening", function( assert ) {
	var ready = assert.async();
	assert.expect( 1 );

	var element = $( "<div>" ).dialog( {
		autoOpen: false,
		modal: true,
		open: function() {
			assert.equal( $( ".ui-widget-overlay" ).length, 1 );
			ready();
		}
	} );

	// Support: IE8
	// For some reason the #favorite-color input doesn't get focus if we don't
	// focus the body first, causing the test to hang.
	$( "body" ).trigger( "focus" );

	$( "#favorite-animal" )

		// We focus the input to start the test. Once it receives focus, the
		// dialog will open. Opening the dialog, will cause an element inside
		// the dialog to gain focus, thus blurring the input.
		.on( "focus", function() {
			element.dialog( "open" );
		} )

		// When the input blurs, the dialog is in the process of opening. We
		// try to open the dialog again, to make sure that dialogs properly
		// handle a call to the open() method during the process of the dialog
		// being opened.
		.on( "blur", function() {
			element.dialog( "open" );
		} )
		.trigger( "focus" );
} );

QUnit.test( "#5531: dialog width should be at least minWidth on creation", function( assert ) {
	assert.expect( 4 );
	var element = $( "<div></div>" ).dialog( {
			width: 200,
			minWidth: 300
		} );

	assert.equal( element.dialog( "option", "width" ), 300, "width is minWidth" );
	element.dialog( "option", "width", 200 );
	assert.equal( element.dialog( "option", "width" ), 300, "width unchanged when set to < minWidth" );
	element.dialog( "option", "width", 320 );
	assert.equal( element.dialog( "option", "width" ), 320, "width changed if set to > minWidth" );
	element.remove();

	element = $( "<div></div>" ).dialog( {
			minWidth: 300
		} );
	assert.ok( element.dialog( "option", "width" ) >=  300, "width is at least 300" );
	element.remove();

} );

} );
