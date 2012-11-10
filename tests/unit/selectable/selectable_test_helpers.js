TestHelpers.selectable = {
	drag: function( el, dx, dy ) {
		$( el ).simulate( "drag", {
			dx: dx || 0,
			dy: dy || 0
		});
	}
};