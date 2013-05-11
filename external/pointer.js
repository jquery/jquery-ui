(function( $ ) {
var currentEventType, currentEventMap, eventName,
	POINTER_TYPE_UNAVAILABLE = "",
	POINTER_TYPE_TOUCH = "touch",
	POINTER_TYPE_PEN = "pen",
	POINTER_TYPE_MOUSE = "mouse",
	eventMap = {
		touch: {
			pointerdown: "touchstart mousedown",
			pointerup: "touchend mouseup",
			pointermove: "touchmove mousemove",
			pointercancel: "touchcancel",
			pointerover: "mouseover",
			pointerout: "mouseout"
		},
		MSPointer: {
			pointerdown: "MSPointerDown",
			pointerup: "MSPointerUp",
			pointermove: "MSPointerMove MSPointerHover",
			pointercancel: "MSPointerCancel",
			pointerover: "MSPointerOver",
			pointerout: "MSPointerOut"
		}
	};

	if ( "MSPointerEvent" in window ) {
		currentEventType = "MSPointer";
	} else {
		currentEventType = "touch";
	}
	currentEventMap = eventMap[ currentEventType ];

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
		event.button = event.button !== undefined ? event.button : -1,
		event.buttons = event.buttons !== undefined ? event.buttons : 0,
		event.pressure = event.buttons > 0 ? 0.5 : 0;
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
	if ( event.type.indexOf("touch") !== -1 ) {
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

function createSpecialEvent( eventName, currentEventMap ) {
	$.event.special[ eventName ] = {
		setup: function() {
			$( this ).on( currentEventMap[ eventName ], $.event.special[ eventName ].handler );
		},
		teardown: function() {
			$( this ).off( currentEventMap[ eventName ], $.event.special[ eventName ].handler );
		},
		handler: function( event ) {
			if ( eventName === "pointerdown" && event.type.indexOf("touch") !== -1 ) {
				$( event.target ).trigger( processEvent( event, "pointerover" ) );
			}
			$( event.target ).trigger( processEvent( event, eventName ) );
			if ( eventName === "pointerup" && event.type.indexOf("touch") !== -1 ) {
				$( event.target ).trigger( processEvent( event, "pointerout" ) );
			}
		}
	};
}

for ( eventName in currentEventMap ) {
	createSpecialEvent( eventName, currentEventMap );
}
})( jQuery );
