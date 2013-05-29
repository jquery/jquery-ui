(function( $ ) {

module( "droppable: events" );

test( "droppable destruction/recreation on drop event", function() {
	expect( 1 );

	var config = {
			activeClass: "active",
			drop: function() {
				var element = $( this ),
					newDroppable = $( "<div>" )
						.css({ width: 100, height: 100 })
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
	});

	ok( !droppable2.hasClass( "active" ), "subsequent droppable no longer active" );
});



// todo: comment the following in when ready to actually test
/*
test("activate", function() {
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


   test("#4977: tolerance, pointer - when pointer outside draggable", function() {
	expect(1);

	var draggable1 = $("#draggable1");
	var droppable1 = $("#droppable1");
	var isDropped = false;

	droppable1.droppable({
		tolerance: 'pointer',
		drop: function() { isDropped = true; }
	});

	// Contain draggable so only its bottom half can be dragged
	// over the droppable.
	draggable1.draggable({ containment: [
		draggable1.offset().left,
		draggable1.offset().top,
		droppable1.offset().left + droppable1.width(),
		droppable1.offset().top - Math.round(draggable1.height() / 2)
	]});

	// Pointer starts out over "top of draggable"
	draggable1.simulate("mousedown", {
		clientX: draggable1.offset().left + draggable1.width() / 2,
		clientY: draggable1.offset().top + 1 // draggable1.height() - 1
	});

	// Pointer ends up below bottom of draggable:
	//
	//   * Top of draggable is *not* inside droppable.
	//   * Bottom of draggable *is* inside droppable.
	//   * Pointer *is* inside droppable, and outside droppable.
	var pos = {
		clientX: droppable1.offset().left + droppable1.width() / 2,
		clientY: droppable1.offset().top + draggable1.height()
	};
	draggable1.simulate("mousemove", pos);
	draggable1.simulate("mouseup", pos);

	draggable1.draggable("destroy");
	droppable1.droppable("destroy");

	ok(isDropped, "tolerance, pointer - when pointer outside draggable");
   });

})( jQuery );
