/*
 * jQuery UI Effects Scale @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Scale
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function( $, undefined ) {

$.effects.effect.puff = function( o ) {
	return this.queue( function() {
		var elem = $( this ),
			mode = $.effects.setMode( elem, o.mode || 'hide' ),
			percent = parseInt( o.percent, 10 ) || 150,
			factor = percent / 100,
			original = { 
				height: elem.height(), 
				width: elem.width() 
			};

		$.extend(o, {
			effect: 'scale',
			fade: true,
			mode: mode,
			percent: mode == 'hide' ? percent : 100,
			from: mode == 'hide'
				? original
				: {
					height: original.height * factor,
					width: original.width * factor
				}
		});

		elem.effect( o ).dequeue();
	});
};

$.effects.effect.scale = function( o ) {

	return this.queue( function() {

		// Create element
		var el = $( this ),
			options = $.extend( true, {}, o ),
			mode = $.effects.setMode( el, o.mode || 'effect' ),
			percent = parseInt( o.percent, 10 ) || ( parseInt( o.percent, 10 ) == 0 ? 0 : ( mode == 'hide' ? 0 : 100 ) ),
			direction = o.direction || 'both',
			origin = o.origin,
			original = { 
				height: el.height(), 
				width: el.width()
			},
			factor = {
				y: direction != 'horizontal' ? (percent / 100) : 1,
				x: direction != 'vertical' ? (percent / 100) : 1
			}; 

		// We are going to pass this effect to the size effect:
		options.effect = "size";

		// Set default origin and restore for show/hide
		if ( mode != 'effect' ) { 
			options.origin = origin || ['middle','center'];
			options.restore = true;
		}

		options.from = o.from || ( mode == 'show' ? { height: 0, width: 0 } : original ); 
		options.to = {
			height: original.height * factor.y, 
			width: original.width * factor.x
		}; 

		if ( options.fade ) { // Fade option to support puff
			if ( mode == 'show' ) {
				options.from.opacity = 0; 
				options.to.opacity = 1;
			}
			if ( mode == 'hide' ) {
				options.from.opacity = 1; 
				options.to.opacity = 0;
			}
		};

		// Animate
		el.effect(options).dequeue();
	});

};

$.effects.effect.size = function( o ) {

	return this.queue( function() {
		// Create element
		var el = $( this ), 
			props = [ 'position', 'top', 'bottom', 'left', 'right', 'width', 'height', 'overflow', 'opacity' ],

			// Always restore
			props1 = [ 'position', 'top', 'bottom', 'left', 'right', 'overflow', 'opacity' ],

			// Copy for children
			props2 = [ 'width', 'height', 'overflow' ],
			cProps = [ 'fontSize' ],
			vProps = [ 'borderTopWidth', 'borderBottomWidth', 'paddingTop', 'paddingBottom' ],
			hProps = [ 'borderLeftWidth', 'borderRightWidth', 'paddingLeft', 'paddingRight' ],

			// Set options
			mode = $.effects.setMode( el, o.mode || 'effect' ),
			restore = o.restore || false,
			scale = o.scale || 'both',
			origin = o.origin,
			original = {
				height: el.height(), 
				width: el.width()
			},
			baseline, factor;

		el.from = o.from || original;
		el.to = o.to || original;

		// Adjust
		if (origin) { // Calculate baseline shifts
			baseline = $.effects.getBaseline( origin, original );
			el.from.top = ( original.height - el.from.height ) * baseline.y;
			el.from.left = ( original.width - el.from.width ) * baseline.x;
			el.to.top = ( original.height - el.to.height ) * baseline.y;
			el.to.left = ( original.width - el.to.width ) * baseline.x;
		}

		// Set scaling factor
		factor = {
			from: {
				y: el.from.height / original.height, 
				x: el.from.width / original.width
			},
			to: {
				y: el.to.height / original.height, 
				x: el.to.width / original.width
			}
		};

		// Scale the css box
		if ( scale == 'box' || scale == 'both' ) {

			// Vertical props scaling
			if ( factor.from.y != factor.to.y ) { 
				props = props.concat( vProps );
				el.from = $.effects.setTransition( el, vProps, factor.from.y, el.from );
				el.to = $.effects.setTransition( el, vProps, factor.to.y, el.to );
			};

			// Horizontal props scaling
			if ( factor.from.x != factor.to.x ) { 
				props = props.concat( hProps );
				el.from = $.effects.setTransition( el, hProps, factor.from.x, el.from );
				el.to = $.effects.setTransition( el, hProps, factor.to.x, el.to );
			};
		};

		// Scale the content
		if ( scale == 'content' || scale == 'both' ) { 

			// Vertical props scaling
			if ( factor.from.y != factor.to.y ) { 
				props = props.concat( cProps );
				el.from = $.effects.setTransition( el, cProps, factor.from.y, el.from );
				el.to = $.effects.setTransition( el, cProps, factor.to.y, el.to );
			};
		};
		
		$.effects.save( el, restore ? props : props1 ); 
		el.show(); 
		$.effects.createWrapper( el );
		el.css( 'overflow', 'hidden' ).css( el.from ); 

		// Animate
		if ( scale == 'content' || scale == 'both' ) { // Scale the children

			// Add margins/font-size
			vProps = vProps.concat([ 'marginTop', 'marginBottom' ]).concat(cProps);
			hProps = hProps.concat([ 'marginLeft', 'marginRight' ]);
			props2 = props.concat(vProps).concat(hProps);

			el.find( "*[width]" ).each( function(){
				var child = $( this ),
					c_original = { 
						height: child.height(), 
						width: child.width()
					};
				if (restore) $.effects.save(child, props2);
				
				child.from = {
					height: c_original.height * factor.from.y, 
					width: c_original.width * factor.from.x
				};
				child.to = {
					height: c_original.height * factor.to.y, 
					width: c_original.width * factor.to.x
				};

				// Vertical props scaling
				if ( factor.from.y != factor.to.y ) { 
					child.from = $.effects.setTransition( child, vProps, factor.from.y, child.from );
					child.to = $.effects.setTransition( child, vProps, factor.to.y, child.to );
				};

				// Horizontal props scaling
				if ( factor.from.x != factor.to.x ) {
					child.from = $.effects.setTransition( child, hProps, factor.from.x, child.from );
					child.to = $.effects.setTransition( child, hProps, factor.to.x, child.to );
				};

				// Animate children
				child.css( child.from );
				child.animate( child.to, o.duration, o.easing, function() {

					// Restore children
					if (restore) $.effects.restore( child, props2 ); 
				});
			});
		};

		// Animate
		el.animate( el.to, { 
			queue: false, 
			duration: o.duration, 
			easing: o.easing, 
			complete: function() {
				if ( el.to.opacity === 0 ) {
					el.css( 'opacity', el.from.opacity );
				}
				if( mode == 'hide' ) {
					el.hide();
				}
				$.effects.restore( el, restore ? props : props1 ); 
				$.effects.removeWrapper( el ); 
				$.isFunction( o.complete ) && o.complete.apply( this, arguments ); // Callback
				el.dequeue();
			}
		});

	});

};

})(jQuery);
