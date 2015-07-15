define( [
	"jquery",
	"lib/common",
	"ui/widget",
	"ui/form-reset-mixin"
], function( $, common ) {

module( "widget factory", {
	setup: function() {
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

	teardown: function() {
		delete $.ui.testWidget;
		delete $.fn.testWidget;
	}
});

common.testJshint( "form-reset-mixin" );

asyncTest( "form reset", function() {
	expect( 2 );

	var form = $( "#main" );
	var inputs = form.find( "input" );

	inputs.testWidget();
	form.on( "reset", function() {
		setTimeout(function() {
			deepEqual( $.ui.testWidget.refreshed, [ "input1", "input2", "input3", "input4" ],
				"All widgets are refreshed on form reset" );
			equal( form.data( "ui-form-reset-instances" ).length, 4,
				"All widget instances are tracked against the form" );
			start();
		} );
	} );
	form[ 0 ].reset();
} );

asyncTest( "destroy", function() {
	expect( 2 );

	var form = $( "#main" );
	var inputs = form.find( "input" );

	inputs
		.testWidget()
		.eq( 1 )
			.testWidget( "destroy" );

	form.on( "reset", function() {
		setTimeout(function() {
			deepEqual( $.ui.testWidget.refreshed, [ "input1", "input3", "input4" ],
				"All widgets are refreshed on form reset" );
			deepEqual( form.data( "ui-form-reset-instances" ).length, 3,
				"All widget instances are tracked against the form" );
			start();
		} );
	} );
	form[ 0 ].reset();
} );

asyncTest( "destroy all", function() {
	expect( 2 );

	var form = $( "#main" );

	form.find( "input" )
		.testWidget()
		.testWidget( "destroy" );

	form.on( "reset", function() {
		setTimeout(function() {
			deepEqual( $.ui.testWidget.refreshed, [], "No widgets are refreshed after destroy" );
			strictEqual( form.data( "ui-form-reset-instances" ), undefined,
				"Form data is removed when the last widget instance is destroyed" );
			start();
		} );
	} );
	form[ 0 ].reset();
} );

} );
