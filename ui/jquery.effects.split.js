/*
 * jQuery UI Effects Explode @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Split (Not yet!)
 *
 * Depends:
 *  jquery.effects.core.js
 * 
 * 
 * TODO: 
 * - Properties and offset can be collected in one object in $.effects.effect.build's animate function
 * - The random calculations is the same in every function set it out in startSplitAnim function		
 * - secure that there is a max left/top on the effects which has elements wider than the element they are animating
 */

(function( $, undefined ) {

	function setupRowsColumns( opt ) {
		//Support for pieces
		if ( ( !opt.rows || !opt.columns ) && opt.pieces ) {
			opt.rows = opt.columns = Math.round( Math.sqrt( opt.pieces ) );
		} else {
			opt.rows = opt.rows || 3;
			opt.columns = opt.columns || 3;
		}
	}

	//Helper function to control the split on each animation
	function startSplitAnim( o, animation, next ) {

		var el = $( this ),
		interval = o.interval, 
		duration = o.duration - ( o.rows + o.columns ) * interval,
		pieceCounter = [],
		documentCoords = {
			height: $( document ).height(),
			width: $( document ).width()
		},
		parentCoords, container, pieces, i, j, properties, width, height;
		
		$.effects.save( el, [ 'visibility', 'opacity' ] );
		
		parentCoords = el.show().css('visibility','hidden').offset();
		parentCoords.width = el.outerWidth();
		parentCoords.height = el.outerHeight();

		if (interval === false){
			interval = o.duration / ( o.rows + o.columns * 2 );
		}

		//split into pieces
		pieces = $.effects.piecer.call( this, o.rows, o.columns );
		firstEl = $( pieces[ 0 ] );
		container = firstEl.parent().addClass( 'ui-effects-split' );
		width = firstEl.outerWidth();
		height = firstEl.outerHeight();

		container.css('overflow', o.crop ? 'hidden' : 'visible');
		
		
		//Make animation
		for ( i = 0; i < o.rows; i++ ) {
			for ( j = 0; j < o.columns; j++ ) {
				// call the animation for each piece.
				animation.call( pieces[ i*o.columns + j ], width, height, interval, duration, i, j, documentCoords, parentCoords, childComplete );
			}
		}

		// children animate complete
		function childComplete() {
			pieceCounter.push( this );
			if ( pieceCounter.length == o.rows * o.columns ) {
				animComplete();
			}
		}


		function animComplete() {
			// Ensures that the element is hidden/shown correctly
			$.effects.restore( el, [ 'visibility', 'opacity' ] );
			
			if ( o.show ) {
				el.show();
			} else {
				el.hide();
			}
			container.detach();
			if ( $.isFunction( o.complete ) ) {
				o.complete.apply( el[ 0 ] );
			}
			next();
		}

	}


	$.effects.piecer = function(rows, columns){
		var el = $( this ), 
		height = el.outerHeight(), 
		width = el.outerWidth(), 
		position = el.offset(),
		pieceHeight = Math.ceil( height / rows ), 
		pieceWidth = Math.ceil( width / columns ), 
		container = $( '<div></div>' ).css({
			position : 'absolute',
			padding : 0,
			margin : 0,
			border : 0,
			top : position.top + "px",
			left : position.left + "px",
			height : height + "px",
			width : width + "px",
			zIndex : el.css( 'zIndex' )
		}).appendTo('body'),
		pieces = [],

		i, j, left, top;

		for( i = 0; i < rows; i++ ){
			top = i * pieceHeight;

			for( j = 0; j < columns; j++ ){
				left = j * pieceWidth;

				pieces.push(
						el
						.clone()
						.css({
							position: 'absolute',
							visibility: 'visible',
							top : -top + "px",
							left : -left + "px"
						})
						.wrap( '<div></div>' )
						.parent()
						.css({
							position : 'absolute',
							padding : 0,
							margin : 0,
							border : 0,
							height : pieceHeight + "px",
							width : pieceWidth + "px",
							left: left + "px",
							top: top + "px",
							overflow : "hidden"
						}).appendTo(container)
				);
			}
		}

		el.hide();

		return pieces;
	}

	$.effects.effect.build = function( o ){
		/*Options:
		 * 		random,
		 * 		reverse, 
		 * 		distance, 
		 * 		rows, 
		 * 		columns, 
		 * 		direction, 
		 * 		duration, 
		 * 		interval, 
		 * 		easing, 
		 * 		crop, 
		 * 		pieces,
		 * 		fade, 
		 * 		show
		 */

		return this.queue( function( next ) {

			var opt = $.extend(
					{
						direction: 'bottom',
						distance: 1,
						reverse: false,
						random: false,
						interval: false,
						fade: true,
						crop: false
					},
					o
			);


			//Reverse it if it is hidden and mode is toggle
			if ( $( this ).is(':hidden') && opt.mode == 'toggle' ) {
				opt.reverse = !opt.reverse;
			}

			//Sets mode for toggle
			opt.mode = $.effects.setMode( this, opt.mode );

			opt.show = 0 + ( opt.mode == 'show' );

			setupRowsColumns( opt );

			function animate( width, height, interval, duration, row, column, documentCoords, parentCoords, callback ) {	    		
				var random = opt.random ? Math.abs( opt.random ) : 0, 
					el = $( this ),
					randomDelay = Math.random() * ( opt.rows + opt.columns ) * interval, 
					uniformDelay = ( opt.reverse || opt.distance < 0 ) ? 
							( ( row + column ) * interval ) : 
							( ( ( opt.rows + opt.columns ) - ( row + column ) ) * interval ), 
					delay = randomDelay * random + Math.max( 1 - random, 0 ) * uniformDelay, 
					offset = el.offset(),   
					maxTop = documentCoords.height - height,
					maxLeft = documentCoords.width - width,
					properties, top, left;

				offset = {
						top : offset.top - parentCoords.top,
						left : offset.left - parentCoords.left
				};

				properties = offset;

				if ( opt.fade ) {
					properties.opacity = opt.show;
					el.css( 'opacity', opt.show ? 0 : '' );
				}


				if ( opt.direction.indexOf( 'bottom' ) !== -1 ) {
					top = offset.top + parentCoords.height * opt.distance;
					top = top > maxTop ? maxTop : top;
				} else if ( opt.direction.indexOf( 'top' ) !== -1 ) {
					top = offset.top - parentCoords.height * opt.distance;
					top = top < 0 ? 0 : top;
				}

				if ( opt.direction.indexOf( 'right' ) !== -1 ) {
					left = offset.left + parentCoords.width * opt.distance;
					left = left > maxLeft ? maxLeft : left;
				} else if ( opt.direction.indexOf( 'left' ) !== -1 ) {
					left = offset.left - parentCoords.width * opt.distance;
					left = left < 0 ? 0 : left;
				}

				if ( opt.direction.indexOf( 'right' ) || opt.direction.indexOf( 'left' ) ) {
					if ( opt.show ) {
						el.css( 'left', left );
					} else {
						properties.left = left;
					}
				}

				if ( opt.direction.indexOf( 'top' ) || opt.direction.indexOf( 'bottom' ) ) {
					if ( opt.show ) {
						el.css( 'top', top );
					} else {
						properties.top = top;
					}
				}

				el.delay( delay ).animate( properties, duration, opt.easing, callback );
			}
			
			startSplitAnim.call( this, opt, animate, next );

		} );

	}

	$.effects.effect.pinwheel = function( o ) {
		/*Options:
		 * 		random,
		 * 		reverse, 
		 * 		distance, 
		 * 		rows, 
		 * 		columns, 
		 * 		direction, 
		 * 		duration, 
		 * 		interval, 
		 * 		easing,
		 * 		pieces,
		 * 		fade, 
		 * 		show
		 */

		return this.queue( function( next ) {

			var opt = $.extend(
					{
						direction: 'bottom',
						distance: 1,
						reverse: false,
						random: false,
						interval: 0,
						fade: true,
						crop: false
					},
					o
			);
			

			//Reverse it if it is hidden and mode is toggle
			if ( $( this ).is(':hidden') && opt.mode == 'toggle' ) {
				opt.reverse = !opt.reverse;
			}

			//Sets mode for toggle
			opt.mode = $.effects.setMode( this, opt.mode );
			
			opt.show = 0 + ( opt.mode == 'show' );

			setupRowsColumns( opt );

			function animate( width, height, interval, duration, row, column, documentCoords, parentCoords, callback ) {
				var random = opt.random ? Math.abs( opt.random ) : 0, 
					el = $( this ),
					randomDelay = Math.random() * ( opt.rows + opt.columns ) * interval, 
					uniformDelay = ( opt.reverse ) ? 
						( ( ( opt.rows + opt.columns ) - ( row + column ) ) * interval ) : 
						( ( row + column ) * interval ), 
					delay = randomDelay * random + Math.max( 1 - random, 0 ) * uniformDelay, 
					startProperties = el.offset(),
					rowOdd = !( row % 2 ),
					colOdd = !( column % 2 ),
					properties, top, left;

				startProperties = {
						top : startProperties.top - parentCoords.top,
						left : startProperties.left - parentCoords.left,
						width : width,
						height : height
				};

				//Copy object
				properties = $.extend( {}, startProperties );

				// If we have only rows or columns, ignore the other dimension
				if ( opt.columns == 1 ) {
					colOdd = !rowOdd;
				} else if ( opt.rows == 1 ) {
					rowOdd = colOdd;
				}

				if ( opt.fade ) {
					properties.opacity = opt.show;
					startProperties.opacity = 1;
				}

				if ( colOdd ) {
					if ( rowOdd ) {
						properties.top = properties.top + height * opt.distance;
					} else {
						properties.left = properties.left + width * opt.distance;
					}
				}

				if ( colOdd != rowOdd ) {
					properties.width = width * ( 1 - opt.distance );
				} else {
					properties.height = height * ( 1 - opt.distance );
				}

				if ( opt.show ) {
					el.css( properties );
					if ( opt.fade ) {
						el.css( 'opacity', 0 );
					}
					properties = startProperties;
				}

				el.delay( delay ).animate( properties, duration, opt.easing, callback );
			}

			startSplitAnim.call( this, opt, animate, next );
		} );
	}
	
	$.effects.effect.blockfade = function( o ) {
		/*Options:
		 * 		random,
		 * 		reverse, 
		 * 		rows, 
		 * 		columns, 
		 * 		duration,
		 * 		interval, 
		 * 		easing,
		 * 		pieces,
		 * 		show
		 */

		return this.queue( function( next ) {

			var opt = $.extend(
					{
						direction: 'bottom',
						distance: 1,
						reverse: false,
						random: false,
						interval: false
					},
					o
			);

			//Reverse it if it is hidden and mode is toggle
			if ( $( this ).is(':hidden') && opt.mode == 'toggle' ) {
				opt.reverse = !opt.reverse;
			}

			//Sets mode for toggle
			opt.mode = $.effects.setMode( this, opt.mode );

			opt.show = 0 + ( opt.mode == 'show' );
			
			setupRowsColumns( opt );

			function animate( width, height, interval, duration, row, column, documentCoords, parentCoords, callback ) {
				var random = opt.random ? Math.abs( opt.random ) : 0, 
					el = $( this ),
					randomDelay = Math.random() * ( opt.rows + opt.columns ) * interval, 
					uniformDelay = ( opt.reverse ) ? 
						( ( ( opt.rows + opt.columns ) - ( row + column ) ) * interval ) : 
						( ( row + column ) * interval ), 
					delay = randomDelay * random + Math.max( 1 - random, 0 ) * uniformDelay;
				
				if ( opt.show ) {
					el.css('opacity', 0);
				}
						
				el.delay( delay ).animate( { opacity: opt.show }, duration, opt.easing, callback );
			}

			startSplitAnim.call( this, opt, animate, next );
		} );
	}
	
	$.effects.effect.sexplode = function( o ) {
		/*Options:
		 * 		random,
		 * 		reverse, 
		 * 		distance, 
		 * 		rows, 
		 * 		columns, 
		 * 		direction, 
		 * 		duration, 
		 * 		sync,
		 * 		easing,
		 * 		pieces,
		 * 		interval,
		 * 		fade, 
		 * 		show,
		 * 		crop
		 */

		return this.queue( function( next ) {

			var opt = $.extend(
				{
					direction: 'bottom',
					distance: 1,
					reverse: false,
					random: 0.5,
					sync: false,
					interval: false,
					fade: true,
					crop: false
				},
				o
			);
			
			//Support for toggle
			opt.mode = $.effects.setMode( this, opt.mode );
			
			//Reverse it if it is hidden and mode is toggle
			if ( $( this ).is(':hidden') && opt.mode == 'toggle' ) {
				opt.reverse = !opt.reverse;
			}

			opt.show = 0 + ( opt.mode == 'show' );

			setupRowsColumns( opt );

			function animate( width, height, interval, duration, row, column, documentCoords, parentCoords, callback ) {
				var el = $( this ),
					delay = 0,
					startProperties = el.offset(),
					distance = opt.distance,
					randomX = 0, 
					randomY = 0, 
					properties, distanceX, distanceY, distanceXY, seed;
				
				startProperties = {
						top : startProperties.top - parentCoords.top,
						left : startProperties.left - parentCoords.left,
				};
				
				//Copy object
				properties = $.extend( {}, startProperties );
				
				if ( opt.fade ) {
					properties.opacity = opt.show;
					startProperties.opacity = 1;
				}

				if ( opt.random ) {
					seed = ( Math.random() * opt.random ) + Math.max( 1 - opt.random, 0 );
					distance *= seed;
					duration *= seed;

					// To syncronize, give each piece an appropriate delay so they end together
					if ( opt.sync ) {
						delay = opt.duration - duration;
					}
					randomX = Math.random() - 0.5;
					randomY = Math.random() - 0.5;
				}

				distanceY = ( parentCoords.height - height ) / 2 - height * row;
				distanceX = ( parentCoords.width - width ) / 2 - width * column;
				distanceXY = Math.sqrt( Math.pow( distanceX, 2 ) + Math.pow( distanceY, 2 ) );
				properties.top -= distanceY * distance + distanceXY * randomY;
				properties.left -= distanceX * distance + distanceXY * randomX;				
				
				if ( opt.show ) {
					el.css( properties );
					if ( opt.fade ) {
						el.css( 'opacity', 0 );
					}
					properties = startProperties;
				}

				el.delay( delay ).animate( properties, duration, opt.easing, callback );
			}

			startSplitAnim.call( this, opt, animate, next );
		} );
	}
	
	$.effects.effect.shear = function( o ) {
		/*Options:
		 * 		random,
		 * 		reverse, 
		 * 		distance, 
		 * 		rows, 
		 * 		columns, 
		 * 		direction, 
		 * 		duration, 
		 * 		interval, 
		 * 		easing,
		 * 		pieces,
		 * 		fade, 
		 * 		show,
		 * 		crop
		 */

		return this.queue( function( next ) {

			var opt = $.extend(
					{
						direction: 'bottom',
						distance: 1,
						reverse: false,
						random: false,
						interval: false,
						fade: true,
						crop: false
					},
					o
			);

			//Support for toggle
			opt.mode = $.effects.setMode( this, opt.mode );
			
			opt.show = 0 + ( opt.mode == 'show' );
			
			setupRowsColumns( opt );

			function animate( width, height, interval, duration, row, column, documentCoords, parentCoords, callback ) {
				var random = opt.random ? Math.abs( opt.random ) : 0, 
					el = $( this ),
					randomDelay = Math.random() * ( opt.rows + opt.columns ) * interval, 
					uniformDelay = ( opt.reverse ) ? 
						( ( ( opt.rows + opt.columns ) - ( row + column ) ) * interval ) : 
						( ( row + column ) * interval ), 
					delay = randomDelay * random + Math.max( 1 - random, 0 ) * uniformDelay, 
					startProperties = el.offset(),
					rowOdd = !( row % 2 ),
					colOdd = !( column % 2 ),
					properties, top, left;
				startProperties = {
						top : startProperties.top - parentCoords.top,
						left : startProperties.left - parentCoords.left,
						width : width,
						height : height
				};

				//Copy object
				properties = $.extend( {}, startProperties );

				// If we have only rows or columns, ignore the other dimension
				if ( opt.columns == 1 ) {
					colOdd = rowOdd;
				} else if ( opt.rows == 1 ) {
					rowOdd = !colOdd;
				}

				if ( opt.fade ) {
					properties.opacity = 0;
					startProperties.opacity = 1;
				}

				if ( colOdd == rowOdd ) {
					if ( !colOdd ) {
						properties.left -= opt.distance * parentCoords.width;
					} else {
						properties.left += opt.distance * parentCoords.width;
					}
				} else {
					if ( !colOdd ){
						properties.top -= opt.distance * parentCoords.height;
					} else {
						properties.top += opt.distance * parentCoords.height;
					}
				}

				console.log({properties: properties, startProperties: startProperties, show: opt.show });
				
				if ( opt.show ) {
					el.css( properties );
					properties = startProperties;
				}

				el.delay( delay ).animate( properties, duration, opt.easing, callback );
			}

			startSplitAnim.call( this, opt, animate, next );
		} );
	}

})( jQuery );