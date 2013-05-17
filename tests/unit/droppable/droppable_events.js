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

test( "drop event callback order", function() {
	expect( 4 );

	$( "<div id='droppable3'></div>" ).appendTo( "body" );
	$( "<div id='droppable4'></div>" ).appendTo( $( "#droppable3" ) );
	$( "<div id='draggable2'></div>" ).appendTo( "body" );
	var droppable3 = $( "#droppable3" ),
		droppable4 = $( "#droppable4" ),
		draggable2 = $( "#draggable2" );

	droppable3.css({ position: 'absolute', width: 100, height: 100, left: 0, top: 0 });
	droppable4.css({ position: 'absolute', width: 50, height: 50, left: 0, top: 0 });

	droppable3.droppable({ drop: function() { droppable3.addClass( "dropped" ) } });
	droppable4.droppable({ drop: function() { droppable4.addClass( "dropped" ) } });

	draggable2.draggable();
	draggable2.css({ position: 'absolute', width: 1, height: 1, left: 0, top: 0 });

	draggable2.simulate( "drag", { dx: 1, dy: 1 } );

	ok( droppable3.hasClass( "dropped" ), "parent droppable receives event" );
	ok( droppable4.hasClass( "dropped" ), "child droppable receives event" );

	droppable3.removeClass( "dropped" );
	droppable4.removeClass( "dropped" );

	droppable4.droppable({ greedy: true });

	draggable2.simulate( "drag", { dx: 1, dy: 1 } );

	ok( !droppable3.hasClass( "dropped" ), "parent droppable does not receive event" );
	ok( droppable4.hasClass( "dropped" ), "child droppable receives event" );

	droppable3.remove();
	droppable4.remove();
	draggable2.remove();
});

})( jQuery );
