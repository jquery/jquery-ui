define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/tooltip"
], function( QUnit, $, helper ) {

	return $.extend( helper, {
		beforeAfterEach: function() {
			return {
				afterEach: function() {
					var index, timer,
						timers = jQuery.timers;

					jQuery.fx.stop();
					var x = false;

					for ( index = timers.length; index--; ) {
						x = true;
						timer = timers[ index ];
						timer.anim.stop();
						timers.splice( index, 1 );
					}

					return helper.moduleAfterEach.apply( this, arguments );
				}
			};
		}
	} );

} );
