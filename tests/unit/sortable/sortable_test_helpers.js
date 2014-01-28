TestHelpers.sortable = {
	sort: function( handle, dx, dy, index, msg ) {
		$( handle ).simulate( "drag", {
			dx: dx,
			dy: dy
		});
		equal( $( handle ).parent().children().index( handle ), index, msg );
	},
	findCenter: function ( elem ) {
		var offset,
			document = $( elem[0].ownerDocument );
		offset = elem.offset();
	
		return {
			x: offset.left + elem.outerWidth() / 2 - document.scrollLeft(),
			y: offset.top + elem.outerHeight() / 2 - document.scrollTop()
		};
	},
	drag: function( target, options ) {
		// Adapted from the jquery simulate plugin - a version that can avoid doing mouseup or mouse down is useful
		// - don't currently need all the functionality from there, but it seemed pointless to pare it down
		// in case it does become useful later.

		target = $( target );
		var i = 0,
			center = TestHelpers.sortable.findCenter( target ),
			x = Math.floor( center.x ),
			y = Math.floor( center.y ),
			coord = { clientX: x, clientY: y },
			dx = options.dx || ( options.x !== undefined ? options.x - x : 0 ),
			dy = options.dy || ( options.y !== undefined ? options.y - y : 0 ),
			moves = options.moves || 3,
			nomousedown = options.nomousedown || false,
			nomouseup = options.nomouseup || false;

		if ( !nomousedown ) {
			target.simulate( "mousedown", coord );
		}

		for ( ; i < moves ; i++ ) {
			x += dx / moves;
			y += dy / moves;

			coord = {
				clientX: Math.round( x ),
				clientY: Math.round( y )
			};

			$( target[0].ownerDocument ).simulate( "mousemove", coord );
		}

		if ( !nomouseup ) {
			if ( $.contains( document, target[0] ) ) {
				target.simulate( "mouseup", coord );
				target.simulate( "click", coord );
			} else {
				$( document ).simulate( "mouseup", coord );
			}
		}
	},
	dragBegin: function ( target, options ) {
		TestHelpers.sortable.drag( target, $.extend( {} , options, { "nomouseup":true } ) );
	},
	dragContinue: function ( target, options ) {
		TestHelpers.sortable.drag( target, $.extend( {} , options, { "nomouseup":true, "nomousedown":true } ) );
	},
	dragEnd: function ( target, options ) {
		TestHelpers.sortable.drag( target, $.extend( {} , options, { "nomousedown":true } ) );
	}
};