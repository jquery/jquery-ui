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
			queue: false,
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

		elem.effect( o );
	});
};

$.effects.effect.scale = function( o ) {

	return this[ o.queue === false ? "each" : "queue" ]( function() {

		// Create element
		var el = $( this ),
			options = $.extend( true, {}, o ),
			mode = $.effects.setMode( el, o.mode || 'effect' ),
			percent = parseInt( o.percent, 10 ) || ( parseInt( o.percent, 10 ) == 0 ? 0 : ( mode == 'hide' ? 0 : 100 ) ),
			direction = o.direction || 'both',
			origin = o.origin,
			original = { 
				height: el.height(), 
				width: el.width(),
				outerHeight: el.outerHeight(),
				outerWidth: el.outerWidth()
			},
			factor = {
				y: direction != 'horizontal' ? (percent / 100) : 1,
				x: direction != 'vertical' ? (percent / 100) : 1
			}; 

		// We are going to pass this effect to the size effect:
		options.effect = "size";
		options.queue = false;

		// Set default origin and restore for show/hide
		if ( mode != 'effect' ) { 
			options.origin = origin || ['middle','center'];
			options.restore = true;
		}

		options.from = o.from || ( mode == 'show' ? { height: 0, width: 0 } : original ); 
		options.to = {
			height: original.height * factor.y, 
			width: original.width * factor.x,
			outerHeight: original.outerHeight * factor.y, 
			outerWidth: original.outerWidth * factor.x
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
		el.effect(options);
	});

};

$.effects.effect.size = function( o ) {

	return this[ o.queue === false ? "each" : "queue" ]( function() {
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
			restore = o.restore || mode !== "effect",
			scale = o.scale || 'both',
			origin = o.origin,
			original, baseline, factor;

		if ( mode === "show" ) {
			el.show();
		}
		original = {
			height: el.height(), 
			width: el.width(),
			outerHeight: el.outerHeight(),
			outerWidth: el.outerWidth()
		};

		el.from = o.from || original;
		el.to = o.to || original;

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
			if ( factor.from.y !== factor.to.y ) { 
				props = props.concat( vProps );
				el.from = $.effects.setTransition( el, vProps, factor.from.y, el.from );
				el.to = $.effects.setTransition( el, vProps, factor.to.y, el.to );
			};

			// Horizontal props scaling
			if ( factor.from.x !== factor.to.x ) { 
				props = props.concat( hProps );
				el.from = $.effects.setTransition( el, hProps, factor.from.x, el.from );
				el.to = $.effects.setTransition( el, hProps, factor.to.x, el.to );
			};
		};

		// Scale the content
		if ( scale == 'content' || scale == 'both' ) { 

			// Vertical props scaling
			if ( factor.from.y !== factor.to.y ) { 
				props = props.concat( cProps );
				el.from = $.effects.setTransition( el, cProps, factor.from.y, el.from );
				el.to = $.effects.setTransition( el, cProps, factor.to.y, el.to );
			};
		};
		
		$.effects.save( el, restore ? props : props1 ); 
		el.show(); 
		$.effects.createWrapper( el );
		el.css( 'overflow', 'hidden' ).css( el.from ); 

		// Adjust
		if (origin) { // Calculate baseline shifts
			baseline = $.effects.getBaseline( origin, original );
			el.from.top = ( original.outerHeight - el.outerHeight() ) * baseline.y;
			el.from.left = ( original.outerWidth - el.outerWidth() ) * baseline.x;
			el.to.top = ( original.outerHeight - el.to.outerHeight ) * baseline.y;
			el.to.left = ( original.outerWidth - el.to.outerWidth ) * baseline.x;
		}
		el.css( el.from ); // set top & left

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
				var pos = {}, parent = el.parent();
				if ( el.to.opacity === 0 ) {
					el.css( 'opacity', el.from.opacity );
				}
				if( mode == 'hide' ) {
					el.hide();
				}
				$.effects.restore( el, restore ? props : props1 );

				function setPos( pos, attr ) {
					pos[ attr ] = parseInt( parent.css( attr ), 10 );
					if ( isNaN( pos[ attr ] ) ) {
						pos[ attr ] = "auto";
					} else {
						switch ( attr ) {
						case "top":
							pos[ attr ] += el.to.top;
							break;
						case "bottom":
							pos[ attr ] -= el.css("position") === "relative" ? el.to.top : - el.to.top;
							break;
						case "left":
							pos[ attr ] += el.to.left;
							break;
						case "right":
							pos[ attr ] -= el.css("position") === "relative" ? el.to.left : - el.to.left;
							break;
						}
					}
				}

				function setAutoPos( pos, attr ) {
					switch ( el.css( "position" ) ) {
					case "relative":
						pos[ attr ] = el.to[ attr ];
						break;
					case "absolute":
						pos[ attr ] = el.offset()[ attr ] + el.to[ attr ];
						break;
					case "fixed":
						pos[ attr ] = parent.offset()[ attr ] -
							( attr === "top" ? $( "body" ).scrollTop() : $( "body" ).scrollLeft() ) +
							el.to[attr];
						break;
					}
				}

				if (parent.is( ".ui-effects-wrapper" )) {
					if ( el.css( "position" ) === "static" ) {
						el.css({
							position: "relative",
							top: el.to.top,
							left: el.to.left
						});
					} else {
						if ( el.css( "top" ) === "auto" &&
						     el.css( "bottom" ) === "auto" ){
							setAutoPos( pos, "top" );
						} else {
							if ( origin[ 0 ] !== 'top') {
								setPos( pos, "top" );
							}
							if ( origin[ 0 ] !== "bottom" ||
							     el.css ("position") === "relative" ) {
								setPos( pos, "bottom" );
							}
						}
						if ( el.css( "left" ) === "auto" &&
						     el.css( "right" ) === "auto" ){
							setAutoPos( pos, "left" );
						} else {
							if ( origin[ 1 ] !== "left" ) {
								setPos( pos, "left" );
							}
							if ( origin[ 1 ] !== "right" ||
							     el.css ("position") === "relative" ) {
								setPos( pos, "right" );
							}
						}
						el.css( pos );
					}
				}
				$.effects.removeWrapper( el ); 
				$.isFunction( o.complete ) && o.complete.apply( this, arguments ); // Callback
				el.dequeue();
			}
		});

	});

};

})(jQuery);
