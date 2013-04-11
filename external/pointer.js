(function( $ ) {
var POINTER_TYPE_UNAVAILABLE = "",
    POINTER_TYPE_TOUCH = "touch",
    POINTER_TYPE_PEN = "pen",
    POINTER_TYPE_MOUSE = "mouse";

function processEvent( event, pointerType ) {
    var propLength,
        i = 0,
        orig = event,
        mouseProps = $.event.mouseHooks.props;

    event = $.Event( pointerType, {
        bubbles: true,
        cancelable: true,
        pointerId: 0,
        width: 0,
        height: 0,
        pressure: 0,
        tiltX: 0,
        tiltY: 0,
        pointerType: "",
        isPrimary: false
    });

    for ( propLength = mouseProps.length; i < propLength; i++ ) {
        event[ mouseProps[ i ] ] = orig[ mouseProps[ i ] ];
    }

    if ( orig.type.indexOf("mouse") !== -1 ) {
        event.pointerId = 1;
        event.pointerType = POINTER_TYPE_MOUSE;
        // TODO: Don't assume left click
        event.button = 0;
        event.buttons = 1;
        event.isPrimary = true;
    } else if ( orig.type.indexOf("touch") !== -1 ) {
        event.pointerId = orig.pointerId;
        event.pointerType = POINTER_TYPE_TOUCH;
        event.button = 0;
        event.buttons = 1;
        event.originalEvent = orig;
        // TODO: Properly determine primary pointer
        event.isPrimary = true;
    } else if ( orig.type.indexOf("Pointer") !== -1 ) {
        event.pointerId = orig.originalEvent.pointerId;
        event.pointerType = orig.originalEvent.pointerType || POINTER_TYPE_UNAVAILABLE;
        event.button = orig.originalEvent.button;
        event.buttons = orig.originalEvent.buttons;
        event.width = orig.originalEvent.width;
        event.height = orig.originalEvent.height;
        event.pressure = orig.originalEvent.pressure;
        event.tiltX = orig.originalEvent.tiltX;
        event.tiltY = orig.originalEvent.tiltY;
        event.isPrimary = orig.originalEvent.isPrimary;
    }

    return event;
}

function pointerEventHandler( event, type ) {
    var touch;

    if ( event.type.indexOf("touch") !== -1 ) {
        touch = event.originalEvent.changedTouches[ 0 ];
        event.pageX = touch.pageX;
        event.pageY = touch.pageY;
        event.screenX = touch.screenX;
        event.screenY = touch.screenY;
        event.clientX = touch.clientX;
        event.clientY = touch.clientY;
        event.pointerId = touch.identifier;
    }

    $( event.target ).trigger( processEvent( event, type ) );
}

$.event.special.pointerdown = {
    setup: function() {
        $( this ).on( "mousedown touchstart MSPointerDown", $.event.special.pointerdown.handler );
    },
    teardown: function() {
        $( this ).off( "mousedown touchstart MSPointerDown", $.event.special.pointerdown.handler );
    },
    handler: function( event ) {
        pointerEventHandler( event, "pointerdown" );
    }
};

$.event.special.pointerup = {
    setup: function() {
        $( this ).on( "mouseup touchend MSPointerUp", $.event.special.pointerup.handler );
    },
    teardown: function() {
        $( this ).off( "mouseup touchend MSPointerUp", $.event.special.pointerup.handler );
    },
    handler: function( event ) {
        pointerEventHandler( event, "pointerup" );
    }
};

$.event.special.pointermove = {
    setup: function() {
        $( this ).on( "mousemove touchmove MSPointerMove", $.event.special.pointermove.handler );
    },
    teardown: function() {
        $( this ).off( "mousemove touchmove MSPointerMove", $.event.special.pointermove.handler );
    },
    handler: function( event ) {
        pointerEventHandler( event, "pointermove" );
    }
};
})( jQuery );
