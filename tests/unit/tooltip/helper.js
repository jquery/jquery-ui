define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/tooltip"
], function( QUnit, $, helper ) {
	"use strict";

	return $.extend( helper, {
		beforeAfterEach: function() {
			return {
				afterEach: function() {
					var index, timer,
						timers = jQuery.timers;

					jQuery.fx.stop();

					for ( index = timers.length; index--; ) {
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
