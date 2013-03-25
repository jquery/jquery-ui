(function( $ ) {
var POINTER_TYPE_UNAVAILABLE = 1,
    POINTER_TYPE_TOUCH = 2,
    POINTER_TYPE_PEN = 3,
    POINTER_TYPE_MOUSE = 4;

function processEvent( event, pointerType ) {
    var prop,
        orig = event;

    event = $.Event( pointerType );

    for ( prop in orig ) {
        if ( !( prop in event ) ) {
            event[ prop ] = orig[ prop ];
        }
    }

    event.pageX = event.pageX || orig.originalEvent.pageX;
    event.pageY = event.pageY || orig.originalEvent.pageY;

    // TODO - Actually determine if primary
    event.isPrimary = true;

    if ( orig.type.indexOf("mouse") != -1 ) {
        event.pointerId = 1;
        event.pointerType = POINTER_TYPE_MOUSE;
        // TODO: Don't assume left click
        event.button = 0;
        event.buttons = 1;
    } else if ( orig.type.indexOf("touch") != -1 ) {
        event.pointerId = orig.identifier || 2;
        event.pointerType = POINTER_TYPE_TOUCH;
        event.button = 0;
        event.buttons = 1;
    } else if ( orig.type.indexOf("Pointer") != -1 ) {
        event.pointerId = orig.originalEvent.pointerId;
        event.pointerType = orig.originalEvent.pointerType || POINTER_TYPE_UNAVAILABLE;
        event.button = orig.originalEvent.button;
        event.buttons = orig.originalEvent.buttons;
    }

    return event;
}

$.event.special.pointerdown = {
    setup: function() {
        $( this ).bind( "mousedown touchstart MSPointerDown", jQuery.event.special.pointerdown.handler );
    },
    teardown: function() {
        $( this ).unbind( "mousedown touchstart MSPointerDown", jQuery.event.special.pointerdown.handler );
    },
    handler: function( event ) {
        event = processEvent( event, "pointerdown" );
        $( event.target ).trigger( event );
    }
};

$.event.special.pointerup = {
    setup: function() {
        $( this ).bind( "mouseup touchend MSPointerUp", jQuery.event.special.pointerup.handler );
    },
    teardown: function() {
        $( this ).unbind( "mouseup touchend MSPointerUp", jQuery.event.special.pointerup.handler );
    },
    handler: function( event ) {
        event = processEvent( event, "pointerup" );
        $( event.target ).trigger( event );
    }
};

$.event.special.pointermove = {
    setup: function() {
        $( this ).bind( "mousemove touchmove MSPointerMove", jQuery.event.special.pointermove.handler );
    },
    teardown: function() {
        $( this ).unbind( "mousemove touchmove MSPointerMove", jQuery.event.special.pointermove.handler );
    },
    handler: function( event ) {
        event = processEvent( event, "pointermove" );
        $( event.target ).trigger( event );
    }
};
})( jQuery );
