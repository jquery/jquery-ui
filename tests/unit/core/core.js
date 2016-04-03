define( [
	"qunit",
	"jquery",
	"lib/common",
	"ui/form",
	"ui/labels",
	"ui/unique-id"
], function( QUnit, $, common ) {

QUnit.module( "core - jQuery extensions" );

common.testJshint( "core" );

QUnit.test( "innerWidth - getter", function( assert ) {
	assert.expect( 2 );
	var el = $( "#dimensions" );

	assert.equal( el.innerWidth(), 122, "getter passthru" );
	el.hide();
	assert.equal( el.innerWidth(), 122, "getter passthru when hidden" );
} );

QUnit.test( "innerWidth - setter", function( assert ) {
	assert.expect( 2 );
	var el = $( "#dimensions" );

	el.innerWidth( 120 );
	assert.equal( el.width(), 98, "width set properly" );
	el.hide();
	el.innerWidth( 100 );
	assert.equal( el.width(), 78, "width set properly when hidden" );
} );

QUnit.test( "innerHeight - getter", function( assert ) {
	assert.expect( 2 );
	var el = $( "#dimensions" );

	assert.equal( el.innerHeight(), 70, "getter passthru" );
	el.hide();
	assert.equal( el.innerHeight(), 70, "getter passthru when hidden" );
} );

QUnit.test( "innerHeight - setter", function( assert ) {
	assert.expect( 2 );
	var el = $( "#dimensions" );

	el.innerHeight( 60 );
	assert.equal( el.height(), 40, "height set properly" );
	el.hide();
	el.innerHeight( 50 );
	assert.equal( el.height(), 30, "height set properly when hidden" );
} );

QUnit.test( "outerWidth - getter", function( assert ) {
	assert.expect( 2 );
	var el = $( "#dimensions" );

	assert.equal( el.outerWidth(), 140, "getter passthru" );
	el.hide();
	assert.equal( el.outerWidth(), 140, "getter passthru when hidden" );
} );

QUnit.test( "outerWidth - setter", function( assert ) {
	assert.expect( 2 );
	var el = $( "#dimensions" );

	el.outerWidth( 130 );
	assert.equal( el.width(), 90, "width set properly" );
	el.hide();
	el.outerWidth( 120 );
	assert.equal( el.width(), 80, "width set properly when hidden" );
} );

QUnit.test( "outerWidth(true) - getter", function( assert ) {
	assert.expect( 2 );
	var el = $( "#dimensions" );

	assert.equal( el.outerWidth( true ), 154, "getter passthru w/ margin" );
	el.hide();
	assert.equal( el.outerWidth( true ), 154, "getter passthru w/ margin when hidden" );
} );

QUnit.test( "outerWidth(true) - setter", function( assert ) {
	assert.expect( 2 );
	var el = $( "#dimensions" );

	el.outerWidth( 130, true );
	assert.equal( el.width(), 76, "width set properly" );
	el.hide();
	el.outerWidth( 120, true );
	assert.equal( el.width(), 66, "width set properly when hidden" );
} );

QUnit.test( "outerHeight - getter", function( assert ) {
	assert.expect( 2 );
	var el = $( "#dimensions" );

	assert.equal( el.outerHeight(), 86, "getter passthru" );
	el.hide();
	assert.equal( el.outerHeight(), 86, "getter passthru when hidden" );
} );

QUnit.test( "outerHeight - setter", function( assert ) {
	assert.expect( 2 );
	var el = $( "#dimensions" );

	el.outerHeight( 80 );
	assert.equal( el.height(), 44, "height set properly" );
	el.hide();
	el.outerHeight( 70 );
	assert.equal( el.height(), 34, "height set properly when hidden" );
} );

QUnit.test( "outerHeight(true) - getter", function( assert ) {
	assert.expect( 2 );
	var el = $( "#dimensions" );

	assert.equal( el.outerHeight( true ), 98, "getter passthru w/ margin" );
	el.hide();
	assert.equal( el.outerHeight( true ), 98, "getter passthru w/ margin when hidden" );
} );

QUnit.test( "outerHeight(true) - setter", function( assert ) {
	assert.expect( 2 );
	var el = $( "#dimensions" );

	el.outerHeight( 90, true );
	assert.equal( el.height(), 42, "height set properly" );
	el.hide();
	el.outerHeight( 80, true );
	assert.equal( el.height(), 32, "height set properly when hidden" );
} );

QUnit.test( "uniqueId / removeUniqueId", function( assert ) {
	assert.expect( 3 );
	var el = $( "img" ).eq( 0 );
	assert.equal( el.attr( "id" ), null, "element has no initial id" );
	el.uniqueId();
	assert.ok( /ui-id-\d+$/.test( el.attr( "id" ) ), "element has generated id" );
	el.removeUniqueId();
	assert.equal( el.attr( "id" ), null, "unique id has been removed from element" );
} );

QUnit.test( "Labels", function( assert ) {
	assert.expect( 2 );

	var expected = [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "10" ];
	var dom = $( "#labels-fragment" );

	function testLabels( testType ) {
		var labels = dom.find( "#test" ).labels();
		var found = labels.map( function() {

				// Support: Core 1.9 Only
				// We use $.trim() because core 1.9.x silently fails when white space is present
				return $.trim( $( this ).text() );
			} ).get();

		assert.deepEqual( found, expected,
			".labels() finds all labels in " + testType + ", and sorts them in DOM order" );
	}

	testLabels( "the DOM" );

	// Detach the dom to test on a fragment
	dom.detach();
	testLabels( "document fragments" );
} );

( function() {
	var domAttached = $( "#form-test" );
	var domDetached = $( "#form-test-detached" ).detach();

	function testForm( name, dom ) {
		var inputs = dom.find( "input" );

		inputs.each( function() {
			var input = $( this );

			QUnit.test( name + this.id.replace( /_/g, " " ), function( assert ) {
				var ready = assert.async();
				assert.expect( 1 );
				var form = input.form();

				// If input has a form the value should reset to "" if not it should be "changed"
				var value = form.length ? "" : "changed";

				input.val( "changed" );

				// If there is a form we reset just that. If there is not a form, reset every form.
				// The idea is if a form is found resetting that form should reset the input.
				// If no form is found no amount of resetting should change the value.
				( form.length ? form : dom.find( "form" ).addBack( "form" ) ).each( function() {
					this.reset();
				} );

				setTimeout( function() {
					assert.equal( input.val(), value, "Proper form found for #" + input.attr( "id" ) );
					ready();
				} );
			} );
		} );
	}

	testForm( "form: attached: ", domAttached );
	testForm( "form: detached: ", domDetached );
} )();
} );
