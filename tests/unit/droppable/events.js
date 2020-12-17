define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/droppable"
], function( QUnit, $, helper ) {

QUnit.module( "droppable: events", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "droppable destruction/recreation on drop event", function( assert ) {
	assert.expect( 1 );

	var config = {
			activeClass: "active",
			drop: function() {
				var element = $( this ),
					newDroppable = $( "<div>" )
						.css( { width: 100, height: 100 } )
						.text( "Droppable" );
				element.after( newDroppable );
				element.remove();
				newDroppable.droppable( config );
			}
		},

		draggable = $( "#draggable1" ).draggable(),
		droppable1 = $( "#droppable1" ).droppable( config ),
		droppable2 = $( "#droppable2" ).droppable( config ),

		droppableOffset = droppable1.offset(),
		draggableOffset = draggable.offset(),
		dx = droppableOffset.left - draggableOffset.left,
		dy = droppableOffset.top - draggableOffset.top;

	draggable.simulate( "drag", {
		dx: dx,
		dy: dy
	} );

	assert.lacksClasses( droppable2, "active", "subsequent droppable no longer active" );
} );

// Todo: comment the following in when ready to actually test
/*
Test("activate", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("deactivate", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("over", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("out", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("drop", function() {
	ok(false, 'missing test - untested code is broken code');
});
*/

} );
