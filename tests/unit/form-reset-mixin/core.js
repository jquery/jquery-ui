define( [
	"qunit",
	"jquery",
	"lib/common",
	"ui/widget",
	"ui/form-reset-mixin"
], function( QUnit, $, common ) {

QUnit.module( "widget factory", {
	beforeEach: function() {
		$.widget( "ui.testWidget", [ $.ui.formResetMixin, {
			_create: function() {
				this._bindFormResetHandler();
			},
			_destroy: function() {
				this._unbindFormResetHandler();
			},
			refresh: function() {
				$.ui.testWidget.refreshed.push( this.element.attr( "id" ) );
			}
		} ] );

		$.ui.testWidget.refreshed = [];
	},

	afterEach: function() {
		delete $.ui.testWidget;
		delete $.fn.testWidget;
	}
} );

common.testJshint( "form-reset-mixin" );

QUnit.test( "form reset", function( assert ) {
	var ready = assert.async();
	assert.expect( 2 );

	var form = $( "#main" );
	var inputs = form.find( "input" );

	inputs.testWidget();
	form.on( "reset", function() {
		setTimeout( function() {
			assert.deepEqual( $.ui.testWidget.refreshed, [ "input1", "input2", "input3", "input4" ],
				"All widgets are refreshed on form reset" );
			assert.equal( form.data( "ui-form-reset-instances" ).length, 4,
				"All widget instances are tracked against the form" );
			ready();
		} );
	} );
	form[ 0 ].reset();
} );

QUnit.test( "destroy", function( assert ) {
	var ready = assert.async();
	assert.expect( 2 );

	var form = $( "#main" );
	var inputs = form.find( "input" );

	inputs
		.testWidget()
		.eq( 1 )
			.testWidget( "destroy" );

	form.on( "reset", function() {
		setTimeout( function() {
			assert.deepEqual( $.ui.testWidget.refreshed, [ "input1", "input3", "input4" ],
				"All widgets are refreshed on form reset" );
			assert.deepEqual( form.data( "ui-form-reset-instances" ).length, 3,
				"All widget instances are tracked against the form" );
			ready();
		} );
	} );
	form[ 0 ].reset();
} );

QUnit.test( "destroy all", function( assert ) {
	var ready = assert.async();
	assert.expect( 2 );

	var form = $( "#main" );

	form.find( "input" )
		.testWidget()
		.testWidget( "destroy" );

	form.on( "reset", function() {
		setTimeout( function() {
			assert.deepEqual( $.ui.testWidget.refreshed, [], "No widgets are refreshed after destroy" );
			assert.strictEqual( form.data( "ui-form-reset-instances" ), undefined,
				"Form data is removed when the last widget instance is destroyed" );
			ready();
		} );
	} );
	form[ 0 ].reset();
} );

} );
