(function( $ ) {
var currentEventType,
    POINTER_TYPE_UNAVAILABLE = "",
    POINTER_TYPE_TOUCH = "touch",
    POINTER_TYPE_PEN = "pen",
    POINTER_TYPE_MOUSE = "mouse",
    preventDuplicate = false,
    eventMap = {
        mouse: {
            pointerdown: "mousedown",
            pointerup: "mouseup",
            pointermove: "mousemove",
            pointercancel: "",
            pointerover: "mouseover",
            pointerout: "mouseout"
        },
        touch: {
            pointerdown: "touchstart",
            pointerup: "touchend",
            pointermove: "touchmove",
            pointercancel: "touchcancel",
            pointerover: "",
            pointerout: ""
        },
        MSPointer: {
            pointerdown: "MSPointerDown",
            pointerup: "MSPointerUp",
            pointermove: "MSPointerMove",
            pointercancel: "MSPointerCancel",
            pointerover: "MSPointerOver",
            pointerout: "MSPointerOut"
        }
    };

    if ( "MSPointerEvent" in window ) {
        currentEventType = "MSPointer";
    } else if ( "TouchEvent" in window ) {
        // TODO: Is this good enough?
        currentEventType = "touch";
    } else {
        currentEventType = "mouse";
    }

function processEvent( event, pointerType ) {
    var propLength, touch,
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
        event.isPrimary = true;
        event.pressure = event.button > -1 ? 0.5 : 0;
    } else if ( orig.type.indexOf("touch") !== -1 ) {
        touch = orig.originalEvent.changedTouches[ 0 ];
        event.pageX = touch.pageX;
        event.pageY = touch.pageY;
        event.screenX = touch.screenX;
        event.screenY = touch.screenY;
        event.clientX = touch.clientX;
        event.clientY = touch.clientY;
        event.pointerId = touch.identifier;
        event.pointerType = POINTER_TYPE_TOUCH;
        event.button = 0;
        event.buttons = 1;
        event.pressure = 0.5;
        event.originalEvent = orig;
        // TODO: Properly determine primary pointer
        event.isPrimary = true;
    } else if ( orig.type.indexOf("Pointer") !== -1 ) {
        event.pointerId = orig.originalEvent.pointerId;
        event.pointerType = processMSPointerType( orig.originalEvent.pointerType );
        event.button = orig.originalEvent.button;
        event.buttons = event.pointerType === "touch" ? 1 : orig.originalEvent.buttons;
        event.width = orig.originalEvent.width;
        event.height = orig.originalEvent.height;
        event.pressure = orig.originalEvent.pressure;
        event.tiltX = orig.originalEvent.tiltX;
        event.tiltY = orig.originalEvent.tiltY;
        event.pageX = orig.originalEvent.pageX;
        event.pageY = orig.originalEvent.pageY;
        event.screenX = orig.originalEvent.screenX;
        event.screenY = orig.originalEvent.screenY;
        event.clientX = orig.originalEvent.clientX;
        event.clientY = orig.originalEvent.clientY;
        event.isPrimary = orig.originalEvent.isPrimary;
    }

    return event;
}

function checkHoverSupport( event, toTrigger ) {
    if ( event.type.indexOf("touch") !== -1 || event.originalEvent.pointerType === 2 ) {
        $( event.target ).trigger( processEvent( event, toTrigger ) );
    }
}

function processMSPointerType( type ) {
    if ( type === 2 ) {
        return POINTER_TYPE_TOUCH;
    } else if ( type === 3 ) {
        return POINTER_TYPE_PEN;
    } else if ( type === 4 ) {
        return POINTER_TYPE_MOUSE;
    } else {
        return POINTER_TYPE_UNAVAILABLE;
    }
}

$.event.special.pointerdown = {
    setup: function() {
        $( this ).on( eventMap[ currentEventType ].pointerdown, $.event.special.pointerdown.handler );
    },
    teardown: function() {
        $( this ).off( eventMap[ currentEventType ].pointerdown, $.event.special.pointerdown.handler );
    },
    handler: function( event ) {
        if ( !preventDuplicate ) {
            if ( event.type.indexOf("touch") !== -1 ) {
                // Trigger pointerover for devices that don't support hover
                checkHoverSupport( event, "pointerover" );
            }
            $( event.target ).trigger( processEvent( event, "pointerdown" ) );
        }

        if ( event.type.indexOf("touch") !== -1 ) {
            preventDuplicate = true;
        } else {
            preventDuplicate = false;
        }
    }
};

$.event.special.pointerup = {
    setup: function() {
        $( this ).on( eventMap[ currentEventType ].pointerup, $.event.special.pointerup.handler );
    },
    teardown: function() {
        $( this ).off( eventMap[ currentEventType ].pointerup, $.event.special.pointerup.handler );
    },
    handler: function( event ) {
        if ( !preventDuplicate ) {
            $( event.target ).trigger( processEvent( event, "pointerup" ) );
            if ( event.type.indexOf("touch") !== -1 ) {
                // Trigger pointerout for devices that don't support hover
                checkHoverSupport( event, "pointerout" );
            }
        }

        if ( event.type.indexOf("touch") !== -1 ) {
            preventDuplicate = true;
        } else {
            preventDuplicate = false;
        }
    }
};

$.event.special.pointermove = {
    setup: function() {
        $( this ).on( eventMap[ currentEventType ].pointermove, $.event.special.pointermove.handler );
    },
    teardown: function() {
        $( this ).off( eventMap[ currentEventType ].pointermove, $.event.special.pointermove.handler );
    },
    handler: function( event ) {
        if ( !preventDuplicate ) {
            $( event.target ).trigger( processEvent( event, "pointermove" ) );
        }

        if ( event.type.indexOf("touch") !== -1 ) {
            preventDuplicate = true;
        } else {
            preventDuplicate = false;
        }
    }
};

$.event.special.pointercancel = {
    setup: function() {
        $( this ).on( eventMap[ currentEventType ].pointercancel, $.event.special.pointercancel.handler );
    },
    teardown: function() {
        $( this ).off( eventMap[ currentEventType ].pointercancel, $.event.special.pointercancel.handler );
    },
    handler: function( event ) {
        $( event.target ).trigger( processEvent( event, "pointercancel" ) );
        $( event.target ).trigger( processEvent( event, "pointerout" ) );
    }
};

$.event.special.pointerover = {
    setup: function() {
        $( this ).on( eventMap[ currentEventType ].pointerover, $.event.special.pointerover.handler );
    },
    teardown: function() {
        $( this ).off( eventMap[ currentEventType ].pointerover, $.event.special.pointerover.handler );
    },
    handler: function( event ) {
        $( event.target ).trigger( processEvent( event, "pointerover" ) );
    }
};

$.event.special.pointerout = {
    setup: function() {
        $( this ).on( eventMap[ currentEventType ].pointerout, $.event.special.pointerout.handler );
    },
    teardown: function() {
        $( this ).off( eventMap[ currentEventType ].pointerout, $.event.special.pointerout.handler );
    },
    handler: function( event ) {
        $( event.target ).trigger( processEvent( event, "pointerout" ) );
    }
};
})( jQuery );
