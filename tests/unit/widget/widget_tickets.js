(function( $ ) {

module( "widget: tickets" );

test( "#5830 - Widget: Using inheritance overwrites the base classes options", function() {
	$.widget( "ui.testWidgetBase", {
		options: {
			obj: {
				key1: "foo",
				key2: "bar"
			},
			arr: [ "testing" ]
		}
	});

	$.widget( "ui.testWidgetExtension", $.ui.testWidgetBase, {
		options: {
			obj: {
				key1: "baz"
			},
			arr: [ "alpha", "beta" ]
		}
	});

	same( $.ui.testWidgetBase.prototype.options.obj, {
		key1: "foo",
		key2: "bar"
	}, "base class option object not overridden");
	same( $.ui.testWidgetBase.prototype.options.arr, [ "testing" ],
		"base class option array not overridden");

	same( $.ui.testWidgetExtension.prototype.options.obj, {
		key1: "baz",
		key2: "bar"
	}, "extension class option object extends base");
	same( $.ui.testWidgetExtension.prototype.options.arr, [ "alpha", "beta" ],
		"extension class option array overwrites base");

	delete $.ui.testWidgetBase;
	delete $.ui.testWidgetExtension;
});

test( "#6795 - Widget: handle array arguments to _trigger consistently", function() {
	expect( 4 );

	$.widget( "ui.testWidget", {
		_create: function() {},
		testEvent: function() {
			var ui = {
					foo: "bar",
					baz: {
						qux: 5,
						quux: 20
					}
				};
			var extra = {
				bar: 5
			};
			this._trigger( "foo", null, [ ui, extra ] );
		}
	});
	$( "#widget" ).bind( "testwidgetfoo", function( event, ui, extra ) {
		same( ui, {
			foo: "bar",
			baz: {
				qux: 5,
				quux: 20
			}
		}, "event: ui hash passed" );
		same( extra, {
			bar: 5
		}, "event: extra argument passed" );
	});
	$( "#widget" ).testWidget({
		foo: function( event, ui, extra ) {
			same( ui, {
				foo: "bar",
				baz: {
					qux: 5,
					quux: 20
				}
			}, "callback: ui hash passed" );
			same( extra, {
				bar: 5
			}, "callback: extra argument passed" );
		}
	})
	.testWidget( "testEvent" );
});

}( jQuery ) );
