TestHelpers.droppable = {
	shouldDrop: function( source, target, why ) {
	
		var dropped = this.detectDropped( source, target );
		
		why = why ? "Dropped: " + why : "";
		
		equal( dropped, true,  + why );
		
	},
	shouldNotDrop: function( source, target, why ) {
	
		var dropped = this.detectDropped( source, target );
		
		why = why ? "Not Dropped: " + why : "";
		
		equal( dropped, false, why );
	},
	detectDropped: function( source, target ) {
	
		// TODO: Remove these lines after old tests upgraded
		if ( !source || !target ){
			ok(true, "missing test - untested code is broken code");
		}
		
		var targetOffset = target.offset(),
			sourceOffset = source.offset(),
			dropped = false;
		
		$(target).on( "drop", function() {
			dropped = true;
		});
		
		$(source).simulate( "drag", {
			dx: targetOffset.left - sourceOffset.left,
			dy: targetOffset.top - sourceOffset.top
		});
		
		return dropped;
	
	}
};