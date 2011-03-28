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
    		parentCoords = el.show().css('visibility','hidden').offset(),
    		container, pieces, i, j, properties;
    	
    	parentCoords.width = el.outerWidth();
    	parentCoords.height = el.outerHeight();
        
    	if (interval === false){
    		interval = o.duration / ( o.rows + o.columns * 2 );
    	}
    	console.log(interval);
    	
    	//split into pieces
        pieces = $.effects.piecer.call( this, o.rows, o.columns );
        container = $( pieces[0] ).parent();
        
        container.css('overflow', o.crop ? 'hidden' : 'visible');
    
        // If element is to be hidden we make it invisible until the
        // transformation is done and then hide it.
        if ( !o.show ) {
            el.css( 'visibility', 'hidden' );
        }
        
        //Make animation
        for ( i = 0; i < o.rows; i++ ) {
            for ( j = 0; j < o.columns; j++ ) {
                // call the animation for each piece.
                animation.call( pieces[ i*o.columns + j ], interval, duration, i, j, documentCoords, parentCoords, childComplete );
            }
        }
        
		// children animate complete:       
		function childComplete() {
        	pieceCounter.push( this );
			if ( pieceCounter.length == o.rows * o.columns ) {
				animComplete();
			}
		}
		
		
		function animComplete() {
            // Ensures that the element is hidden/shown correctly
            if ( o.show ) {
                el.css( {
                	opacity: '',
                	visibility: ''
                } ).show();
            } else {
                el.css( {
                    opacity : '',
                    visibility : ''
                } ).hide();
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
    			opt.reverse = !reverse;
    		}
    		
    		//Sets mode for toggle
    		opt.mode = $.effects.setMode( this, opt.mode );
    		
    		
    		opt.show = ( opt.mode == 'show' );
	    	
    		setupRowsColumns( opt );
	    	
	    	function animate( interval, duration, row, column, documentCoords, parentCoords, callback ) {	    		
	    		var random = opt.random ? Math.abs( opt.random ) : 0, 
	            	el = $( this ),
                 	randomDelay = Math.random() * ( opt.rows + opt.columns ) * interval, 
                 	uniformDelay = ( opt.reverse || opt.distance < 0 ) ? 
                 			( ( row + column ) * interval ) : 
                 			( ( ( opt.rows + opt.columns ) - ( row + column ) ) * interval ), 
                 	delay = randomDelay * random + Math.max( 1 - random, 0 ) * uniformDelay, 
                 	offset = el.offset(), 
                 	width = el.outerWidth(), 
                 	height = el.outerHeight(), 
                 	maxTop = documentCoords.height - height,
                 	maxLeft = documentCoords.width - width, 
                 	properties, top, left;
                 			
                 //TODO Porperties and offset can be collected in one object!
                 			
                 offset = {
                     top : offset.top - parentCoords.top,
                     left : offset.left - parentCoords.left
                 };

                 properties = offset;
                 
                 if ( opt.fade ) {
                     properties.opacity = opt.show ? 1 : 0;
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
    		
    		if (opt.interval === false) {
    			console.log("true");
    		} else {
    			console.log("false");
    		}
    		
	    	//Support for toggle
    		opt.mode = $.effects.setMode( this, opt.mode );
    		
    		opt.show = ( opt.mode == 'show' );
	    	
    		setupRowsColumns( opt );
    		
    		function animate( interval, duration, row, column, documentCoords, parentCoords, callback ) {
    			var random = opt.random ? Math.abs( opt.random ) : 0, 
	            	el = $( this ),
                 	randomDelay = Math.random() * ( opt.rows + opt.columns ) * interval, 
                 	uniformDelay = ( opt.reverse ) ? 
		        			( ( ( opt.rows + opt.columns ) - ( row + column ) ) * interval ) : 
		        			( ( row + column ) * interval ), 
                 	delay = randomDelay * random + Math.max( 1 - random, 0 ) * uniformDelay, 
                 	startProperties = el.offset(), 
                 	width = el.outerWidth(), 
                 	height = el.outerHeight(), 
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
		            properties.opacity = opt.show ? 1 : 0;
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
    
})( jQuery );

var defaultOptions = {
    easing : 'linear', // jQuery easing, The easing to use
    distance : 1, // move element to/from where * parent.height()
    direction : 'bottom', // the direction the fade should use.
    reverse : false, // Boolean
    random : false, // float
    interval : false, // Number, miliseconds before each piece animation
                        // (optional)
    fade : true, // Boolean, indicates if the pieces should fade.
    rows : 5, // Number of rows
    cols : 5, // Number of rows
    crop : false
// Boolean, show pieces outside of the main element.
};

/** Do not use direction * */
$.effects.splitExplode = function( o, show ) {
    var docHeight = $( document ).height(), docWidth = $( document ).width();

    /* show is either 1 or null */
    show = show || 0;

    var options = o.options = $
            .extend(
                    {},
                    defaultOptions,
                    o.options,
                    {
                        // piece animate function
                        animate : function( interval, duration, x, y,
                                parentCoords ) {
                            var offset = this.offset(), height = this
                                    .outerHeight(), width = this.outerWidth(), distance = options.distance * 2, properties = {
                                opacity : show ? 1 : 0
                            }, maxTop = docHeight - height, maxLeft = docWidth
                                    - width, delay = 0, randomX = 0, randomY = 0;

                            /* sets the offset relative to the parent offset */
                            offset = {
                                top : offset.top - parentCoords.top,
                                left : offset.left - parentCoords.left
                            };

                            this.css( 'opacity', show ? 0 : '' );

                            if ( options.random ) {
                                var seed = ( Math.random() * options.random )
                                        + Math.max( 1 - options.random, 0 );
                                distance *= seed;
                                duration *= seed;

                                // To syncronize, give each piece an appropriate
                                // delay so they end together
                                // delay = ((show && options.sync) || (!show &&
                                // !options.sync)) ? (options.duration -
                                // duration) : 0;

                                randomX = Math.random() - 0.5;
                                randomY = Math.random() - 0.5;
                            }

                            var distanceY = ( ( parentCoords.height - height ) / 2 - height
                                    * y ), distanceX = ( ( parentCoords.width - width ) / 2 - width
                                    * x ), distanceXY = Math.sqrt( Math.pow(
                                    distanceX, 2 )
                                    + Math.pow( distanceY, 2 ) ), offsetTo = {
                                top : parseInt( offset.top - distanceY
                                        * distance + distanceXY * randomY ),
                                left : parseInt( offset.left - distanceX
                                        * distance + distanceXY * randomX )
                            };

                            if ( show ) {
                                this.css( offsetTo );
                                properties.top = offset.top;
                                properties.left = offset.left;
                            } else {
                                this.css( offset );
                                properties.top = offsetTo.top;
                                properties.left = offsetTo.left;
                            }

                            this.delay( delay ).animate( properties, duration,
                                    options.easing );
                        }
                    } );
    /* sends the options to the split animation */
    $.effects.splitAnim.call( this, o, show );
};

$.effects.splitConverge = function( o ) {
    $.effects.splitExplode.call( this, o, 1 );
};


$.effects.splitShear = function( o, show ) {
    var docHeight = $( document ).height(), docWidth = $( document ).width();
    /* show is either 1 or null */
    show = show || 0;

    var options = o.options = $
            .extend(
                    {},
                    defaultOptions,
                    o.options,
                    {

                        // piece animate function
                        animate : function( interval, duration, x, y,
                                parentCoords ) {
                            var random = options.random ? Math
                                    .abs( options.random ) : 0, randomDelay = Math
                                    .random()
                                    * duration, uniformDelay = ( options.reverse ) ? ( ( ( options.rows + options.cols ) - ( x + y ) ) * interval )
                                    : ( ( x + y ) * interval ), delay = randomDelay
                                    * Math.abs( options.random )
                                    + Math.max( 1 - Math.abs( options.random ),
                                            0 ) * uniformDelay, rowOdd = !( y % 2 ), colOdd = !( x % 2 ), offset = this
                                    .offset(), properties = offset, distanceX = options.distance
                                    * parentCoords.width, distanceY = options.distance
                                    * parentCoords.height;

                            offset = {
                                top : offset.top - parentCoords.top,
                                left : offset.left - parentCoords.left
                            };

                            properties = $.extend( {}, offset );

                            this.css( 'opacity', show ? 0 : '' );

                            // If we have only rows or columns, ignore the other
                            // dimension
                            if ( options.cols == 1 ) {
                                colOdd = rowOdd;
                            } else if ( options.rows == 1 ) {
                                rowOdd = !colOdd;
                            }

                            if ( colOdd == rowOdd ) {
                                properties.left = !colOdd ? offset.left
                                        - distanceX : offset.left + distanceX;
                            } else {
                                properties.top = !colOdd ? offset.top
                                        - distanceY : offset.top + distanceY;
                            }

                            if ( show ) {
                                // Bug: it should work just by switching
                                // properties and offset but somehow this won't
                                // work. therefore we takes and configure a new
                                // offset.
                                var newOffset = this.offset();
                                newOffset = {
                                    top : newOffset.top - parentCoords.top,
                                    left : newOffset.left - parentCoords.left
                                };
                                this.css( properties );
                                properties = newOffset;
                            }

                            properties.opacity = show ? 1 : 0;

                            this.delay( delay ).animate( properties, duration,
                                    options.easing );

                        }
                    } );

    /* sends the options to the split animation */
    $.effects.splitAnim.call( this, o, show );

};

$.effects.splitUnShear = function( o ) {
    $.effects.splitShear.call( this, o, 1 );
};

/*******************************************************************************
 * Don't use fade and direction 
 * TODO: make the fading comming from the options.direction.
 ******************************************************************************/
$.effects.blockSplitFadeOut = function( o, show ) {
    var docHeight = $( document ).height(), docWidth = $( document ).width();
    /* show is either 1 or null */
    show = show || 0;

    /* Internal callback to run before animation has started */
    function beforeAnimate( ) {
        this.css( {
            opacity : show ? 0 : 1
        } );
    }

    var options = o.options = $
            .extend(
                    {},
                    defaultOptions,
                    o.options,
                    {
                        beforeAnimate : beforeAnimate,

                        // animation piece function
                        animate : function( interval, duration, x, y,
                                parentCoords ) {
                            options.random = options.random || 0;
                            var randomDelay = Math.random() * duration, uniformDelay = ( options.reverse ) ? ( ( ( options.rows + options.cols ) - ( x + y ) ) * interval )
                                    : ( ( x + y ) * interval ), delay = randomDelay
                                    * Math.abs( options.random )
                                    + Math.max( 1 - Math.abs( options.random ),
                                            0 ) * uniformDelay;

                            // make the animation
                            this.delay( delay ).animate( {
                                opacity : show
                            }, duration, options.easing );
                        }
                    } );
    /* sends the options to the split animation */
    $.effects.splitAnim.call( this, o, show );
};

$.effects.blockSplitFadeIn = function( o ) {
    $.effects.blockSplitFadeOut.call( this, o, 1 );
};

$.effects.splitAnim = function( o, show ) {
    var options = o.options;

    // To ensure that the element is hidden/shown correctly
    if ( show ) {
        this.css( 'opacity', 0 ).show();
    } else {
        this.css( 'opacity', 1 ).show();
    }

    return this
            .queue( function( ) {
                var $this = $( this ), 
                height = $this.outerHeight(), 
                width = $this.outerWidth(), 
                position = $this.offset(), 
                interval = options.interval || o.duration / ( options.rows + options.cols * 2 ), 
                duration = o.duration - ( options.rows + options.cols ) * interval, 
                parentCoords = $.extend( position, {
                            width : width,
                            height : height
                        } ), 
                pieceHeight = Math.ceil( height / options.rows ), 
                pieceWidth = Math.ceil( width / options.cols ), 
                $container = $('<div></div>' ).css( {
                    position : 'absolute',
                    padding : 0,
                    margin : 0,
                    border : 0,
                    top : position.top + "px",
                    left : position.left + "px",
                    height : height + "px",
                    width : width + "px",
                    background : 0,
                    overflow : options.crop ? 'hidden' : 'visible',
                    zIndex : $this.css( 'z-index' )
                } ).insertAfter( $this ), 
                $pieces = [], 
                $cloner = $(
                        '<div></div>' ).css( {
                    position : 'absolute',
                    border : 0,
                    padding : 0,
                    margin : 0,
                    height : pieceHeight + "px",
                    width : pieceWidth + "px",
                    overflow : "hidden"
                } ), 
                $clonerContent = $this.clone().css( {
                    position : 'static',
                    opacity : ''
                } ).show();

                var x, y, pieceTop, pieceLeft, ly = options.rows, lx = options.cols;

                // creating the pieces.
                for ( y = 0; y < ly; y++ ) {
                    for ( x = 0; x < lx; x++ ) {

                        pieceTop = y * pieceHeight;
                        pieceLeft = x * pieceWidth;

                        $pieces.push(
                        // Makes a clone for each piece
                        $cloner.clone().html(
                        // Inserting the cloned clonerContent into the clone
                        $clonerContent.clone().css( {
                            marginTop : -pieceTop + "px",
                            marginLeft : -pieceLeft + "px"
                        } ) ).css( {
                            left : pieceLeft + "px",
                            top : pieceTop + "px"
                        // Adds the piece to the container
                        } ).appendTo( $container ) );
                    }
                }

                // If element is to be hidden we make it invisible until the
                // transformation is done and then hide it.
                if ( !show ) {
                    $this.css( 'visibility', 'hidden' );
                }

                for ( y = 0; y < ly; y++ ) {
                    for ( x = 0; x < lx; x++ ) {
                        var $piece = $pieces[ y * ly + x ];
                        $.type( options.beforeAnimate ) === 'function'
                                && options.beforeAnimate.call( $piece );

                        // call the animation for each piece.
                        options.animate.call( $piece, interval, duration, x, y,
                                parentCoords );
                    }
                }

                setTimeout( function( ) {
                    // Ensures that the element is hidden/shown correctly
                    if ( show ) {
                        $this.css( 'opacity', '' ).show();
                    } else {
                        $this.css( {
                            opacity : '',
                            visibility : ''
                        } ).hide();
                    }

                    // normal object expecting domElement so give it
                    $.type( o.callback ) === 'function'
                            && o.callback.call( $this[ 0 ] );

                    $this.dequeue();
                    $container.detach();
                }, o.duration );
            } );
};