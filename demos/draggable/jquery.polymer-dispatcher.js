window.PointerEventsPolyfill.externalEventDispatcher = function(type, event) {
    var eventName, orig, prop,
    events = ["pointerdown","pointermove","pointerup","pointerover","pointerout","pointerenter","pointerleave"],
    missingProps = ["height","isPrimary","pointerId","pointerType","pressure","tiltX","tiltY","width"];
    for ( eventName in events ) {
        $.event.fixHooks[ events[ eventName ] ] = $.event.mouseHooks;
        $.event.fixHooks[ events[ eventName ] ].props.push.apply( $.event.fixHooks[ events[ eventName ] ].props, missingProps );
        delete $.event.fixHooks[ events[ eventName ] ].filter;
    }

    event.target = event.target || event.srcElement;
    event.type = type;
    event = $.Event( event );

    // copy original event properties over to the new event
    orig = event.originalEvent;
    if ( orig ) {
        for ( prop in orig ) {
            if ( !( prop in event ) ) {
                event[ prop ] = orig[ prop ];
            }
        }
    }

    // fix missing pageX/pageY in oldIE
    if ( !event.pageX ) {
        event.pageX = event.clientX;
        event.pageY = event.clientY;
    }

    // fix incorrect button/buttons values
    if ( !event.which ) {
        event.button = -1;
        event.buttons = 0;
    } else if ( event.which === 1 ) {
        event.button = 0;
        event.buttons = 1;
    } else if ( event.which === 2 ) {
        event.button = 1;
        event.buttons = 4;
    } else if ( event.which === 3 ) {
        event.button = 2;
        event.buttons = 2;
    }

    $( event.target ).trigger( event );

    //return event.isDefaultPrevented();
    return false;
};
