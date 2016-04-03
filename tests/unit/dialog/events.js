define( [
	"qunit",
	"jquery",
	"./helper",
	"ui/widgets/dialog"
], function( QUnit, $, testHelper ) {

QUnit.module( "dialog: events" );

QUnit.test( "open", function( assert ) {
	assert.expect( 13 );

	var element = $( "<div></div>" );
	element.dialog( {
		open: function( ev, ui ) {
			assert.ok( element.dialog( "instance" )._isOpen, "interal _isOpen flag is set" );
			assert.ok( true, "autoOpen: true fires open callback" );
			assert.equal( this, element[ 0 ], "context of callback" );
			assert.equal( ev.type, "dialogopen", "event type in callback" );
			assert.deepEqual( ui, {}, "ui hash in callback" );
		}
	} );
	element.remove();

	element = $( "<div></div>" );
	element.dialog( {
		autoOpen: false,
		open: function( ev, ui ) {
			assert.ok( true, ".dialog('open') fires open callback" );
			assert.equal( this, element[ 0 ], "context of callback" );
			assert.equal( ev.type, "dialogopen", "event type in callback" );
			assert.deepEqual( ui, {}, "ui hash in callback" );
		}
	} ).on( "dialogopen", function( ev, ui ) {
		assert.ok( element.dialog( "instance" )._isOpen, "interal _isOpen flag is set" );
		assert.ok( true, "dialog('open') fires open event" );
		assert.equal( this, element[ 0 ], "context of event" );
		assert.deepEqual( ui, {}, "ui hash in event" );
	} );
	element.dialog( "open" );
	element.remove();
} );

QUnit.test( "focus", function( assert ) {
	assert.expect( 5 );
	var element, other;
	element = $( "#dialog1" ).dialog( {
		autoOpen: false
	} );
	other = $( "#dialog2" ).dialog( {
		autoOpen: false
	} );

	element.one( "dialogopen", function() {
		assert.ok( true, "open, just once" );
	} );
	element.one( "dialogfocus", function() {
		assert.ok( true, "focus on open" );
	} );
	other.dialog( "open" );

	element.one( "dialogfocus", function() {
		assert.ok( true, "when opening and already open and wasn't on top" );
	} );
	other.dialog( "open" );
	element.dialog( "open" );

	element.one( "dialogfocus", function() {
		assert.ok( true, "when calling moveToTop and wasn't on top" );
	} );
	other.dialog( "moveToTop" );
	element.dialog( "moveToTop" );

	element.on( "dialogfocus", function() {
		assert.ok( true, "when mousedown anywhere on the dialog and it wasn't on top" );
	} );
	other.dialog( "moveToTop" );
	element.trigger( "mousedown" );

	// Triggers just once when already on top
	element.dialog( "open" );
	element.dialog( "moveToTop" );
	element.trigger( "mousedown" );

	element.add( other ).remove();
} );

QUnit.test( "dragStart", function( assert ) {
	assert.expect( 9 );

	var handle,
		element = $( "<div></div>" ).dialog( {
			dragStart: function( ev, ui ) {
				assert.ok( true, "dragging fires dragStart callback" );
				assert.equal( this, element[ 0 ], "context of callback" );
				assert.equal( ev.type, "dialogdragstart", "event type in callback" );
				assert.ok( ui.position !== undefined, "ui.position in callback" );
				assert.ok( ui.offset !== undefined, "ui.offset in callback" );
			}
		} ).on( "dialogdragstart", function( ev, ui ) {
			assert.ok( true, "dragging fires dialogdragstart event" );
			assert.equal( this, element[ 0 ], "context of event" );
			assert.ok( ui.position !== undefined, "ui.position in callback" );
			assert.ok( ui.offset !== undefined, "ui.offset in callback" );
		} );

	handle = $( ".ui-dialog-titlebar", element.dialog( "widget" ) );
	testHelper.drag( element, handle, 50, 50 );
	element.remove();
} );

QUnit.test( "drag", function( assert ) {
	assert.expect( 9 );
	var handle,
		hasDragged = false,
		element = $( "<div></div>" ).dialog( {
			drag: function( ev, ui ) {
				if ( !hasDragged ) {
					assert.ok( true, "dragging fires drag callback" );
					assert.equal( this, element[ 0 ], "context of callback" );
					assert.equal( ev.type, "dialogdrag", "event type in callback" );
					assert.ok( ui.position !== undefined, "ui.position in callback" );
					assert.ok( ui.offset !== undefined, "ui.offset in callback" );

					hasDragged = true;
				}
			}
		} ).one( "dialogdrag", function( ev, ui ) {
			assert.ok( true, "dragging fires dialogdrag event" );
			assert.equal( this, element[ 0 ], "context of event" );
			assert.ok( ui.position !== undefined, "ui.position in callback" );
			assert.ok( ui.offset !== undefined, "ui.offset in callback" );
		} );

	handle = $( ".ui-dialog-titlebar", element.dialog( "widget" ) );
	testHelper.drag( element, handle, 50, 50 );
	element.remove();
} );

QUnit.test( "dragStop", function( assert ) {
	assert.expect( 9 );

	var handle,
		element = $( "<div></div>" ).dialog( {
			dragStop: function( ev, ui ) {
				assert.ok( true, "dragging fires dragStop callback" );
				assert.equal( this, element[ 0 ], "context of callback" );
				assert.equal( ev.type, "dialogdragstop", "event type in callback" );
				assert.ok( ui.position !== undefined, "ui.position in callback" );
				assert.ok( ui.offset !== undefined, "ui.offset in callback" );
			}
		} ).on( "dialogdragstop", function( ev, ui ) {
			assert.ok( true, "dragging fires dialogdragstop event" );
			assert.equal( this, element[ 0 ], "context of event" );
			assert.ok( ui.position !== undefined, "ui.position in callback" );
			assert.ok( ui.offset !== undefined, "ui.offset in callback" );
		} );

	handle = $( ".ui-dialog-titlebar", element.dialog( "widget" ) );
	testHelper.drag( element, handle, 50, 50 );
	element.remove();
} );

QUnit.test( "resizeStart", function( assert ) {
	assert.expect( 13 );

	var handle,
		element = $( "<div></div>" ).dialog( {
			resizeStart: function( ev, ui ) {
				assert.ok( true, "resizing fires resizeStart callback" );
				assert.equal( this, element[ 0 ], "context of callback" );
				assert.equal( ev.type, "dialogresizestart", "event type in callback" );
				assert.ok( ui.originalPosition !== undefined, "ui.originalPosition in callback" );
				assert.ok( ui.originalSize !== undefined, "ui.originalSize in callback" );
				assert.ok( ui.position !== undefined, "ui.position in callback" );
				assert.ok( ui.size !== undefined, "ui.size in callback" );
			}
		} ).on( "dialogresizestart", function( ev, ui ) {
			assert.ok( true, "resizing fires dialogresizestart event" );
			assert.equal( this, element[ 0 ], "context of event" );
			assert.ok( ui.originalPosition !== undefined, "ui.originalPosition in callback" );
			assert.ok( ui.originalSize !== undefined, "ui.originalSize in callback" );
			assert.ok( ui.position !== undefined, "ui.position in callback" );
			assert.ok( ui.size !== undefined, "ui.size in callback" );
		} );

	handle = $( ".ui-resizable-se", element.dialog( "widget" ) );
	testHelper.drag( element, handle, 50, 50 );
	element.remove();
} );

QUnit.test( "resize", function( assert ) {
	assert.expect( 13 );
	var handle,
		hasResized = false,
		element = $( "<div></div>" ).dialog( {
			resize: function( ev, ui ) {
				if ( !hasResized ) {
					assert.ok( true, "resizing fires resize callback" );
					assert.equal( this, element[ 0 ], "context of callback" );
					assert.equal( ev.type, "dialogresize", "event type in callback" );
					assert.ok( ui.originalPosition !== undefined, "ui.originalPosition in callback" );
					assert.ok( ui.originalSize !== undefined, "ui.originalSize in callback" );
					assert.ok( ui.position !== undefined, "ui.position in callback" );
					assert.ok( ui.size !== undefined, "ui.size in callback" );

					hasResized = true;
				}
			}
		} ).one( "dialogresize", function( ev, ui ) {
			assert.ok( true, "resizing fires dialogresize event" );
			assert.equal( this, element[ 0 ], "context of event" );
			assert.ok( ui.originalPosition !== undefined, "ui.originalPosition in callback" );
			assert.ok( ui.originalSize !== undefined, "ui.originalSize in callback" );
			assert.ok( ui.position !== undefined, "ui.position in callback" );
			assert.ok( ui.size !== undefined, "ui.size in callback" );
		} );

	handle = $( ".ui-resizable-se", element.dialog( "widget" ) );
	testHelper.drag( element, handle, 50, 50 );
	element.remove();
} );

QUnit.test( "resizeStop", function( assert ) {
	assert.expect( 13 );

	var handle,
		element = $( "<div></div>" ).dialog( {
			resizeStop: function( ev, ui ) {
				assert.ok( true, "resizing fires resizeStop callback" );
				assert.equal( this, element[ 0 ], "context of callback" );
				assert.equal( ev.type, "dialogresizestop", "event type in callback" );
				assert.ok( ui.originalPosition !== undefined, "ui.originalPosition in callback" );
				assert.ok( ui.originalSize !== undefined, "ui.originalSize in callback" );
				assert.ok( ui.position !== undefined, "ui.position in callback" );
				assert.ok( ui.size !== undefined, "ui.size in callback" );
			}
		} ).on( "dialogresizestop", function( ev, ui ) {
			assert.ok( true, "resizing fires dialogresizestop event" );
			assert.equal( this, element[ 0 ], "context of event" );
				assert.ok( ui.originalPosition !== undefined, "ui.originalPosition in callback" );
				assert.ok( ui.originalSize !== undefined, "ui.originalSize in callback" );
				assert.ok( ui.position !== undefined, "ui.position in callback" );
				assert.ok( ui.size !== undefined, "ui.size in callback" );
		} );

	handle = $( ".ui-resizable-se", element.dialog( "widget" ) );
	testHelper.drag( element, handle, 50, 50 );
	element.remove();
} );

QUnit.test( "close", function( assert ) {
	var ready = assert.async();
	assert.expect( 14 );

	var element = $( "<div></div>" ).dialog( {
		close: function( ev, ui ) {
			assert.ok( true, ".dialog('close') fires close callback" );
			assert.equal( this, element[ 0 ], "context of callback" );
			assert.equal( ev.type, "dialogclose", "event type in callback" );
			assert.deepEqual( ui, {}, "ui hash in callback" );
		}
	} ).on( "dialogclose", function( ev, ui ) {
		assert.ok( true, ".dialog('close') fires dialogclose event" );
		assert.equal( this, element[ 0 ], "context of event" );
		assert.deepEqual( ui, {}, "ui hash in event" );
	} );
	element.dialog( "close" );
	element.remove();

	// Close event with an effect
	element = $( "<div></div>" ).dialog( {
		hide: 10,
		close: function( ev, ui ) {
			assert.ok( true, ".dialog('close') fires close callback" );
			assert.equal( this, element[ 0 ], "context of callback" );
			assert.equal( ev.type, "dialogclose", "event type in callback" );
			assert.deepEqual( ui, {}, "ui hash in callback" );
			ready();
		}
	} ).on( "dialogclose", function( ev, ui ) {
		assert.ok( true, ".dialog('close') fires dialogclose event" );
		assert.equal( this, element[ 0 ], "context of event" );
		assert.deepEqual( ui, {}, "ui hash in event" );
	} );
	element.dialog( "close" );
} );

QUnit.test( "beforeClose", function( assert ) {
	assert.expect( 14 );

	var element = $( "<div></div>" ).dialog( {
		beforeClose: function( ev, ui ) {
			assert.ok( true, ".dialog('close') fires beforeClose callback" );
			assert.equal( this, element[ 0 ], "context of callback" );
			assert.equal( ev.type, "dialogbeforeclose", "event type in callback" );
			assert.deepEqual( ui, {}, "ui hash in callback" );
			return false;
		}
	} );

	element.dialog( "close" );
	assert.ok( element.dialog( "widget" ).is( ":visible" ), "beforeClose callback should prevent dialog from closing" );
	element.remove();

	element = $( "<div></div>" ).dialog();
	element.dialog( "option", "beforeClose", function( ev, ui ) {
		assert.ok( true, ".dialog('close') fires beforeClose callback" );
		assert.equal( this, element[ 0 ], "context of callback" );
		assert.equal( ev.type, "dialogbeforeclose", "event type in callback" );
		assert.deepEqual( ui, {}, "ui hash in callback" );
		return false;
	} );
	element.dialog( "close" );

	assert.ok( element.dialog( "widget" ).is( ":visible" ), "beforeClose callback should prevent dialog from closing" );
	element.remove();

	element = $( "<div></div>" ).dialog().on( "dialogbeforeclose", function( ev, ui ) {
		assert.ok( true, ".dialog('close') triggers dialogbeforeclose event" );
		assert.equal( this, element[ 0 ], "context of event" );
		assert.deepEqual( ui, {}, "ui hash in event" );
		return false;
	} );
	element.dialog( "close" );
	assert.ok( element.dialog( "widget" ).is( ":visible" ), "dialogbeforeclose event should prevent dialog from closing" );
	element.remove();
} );

// #8789 and #8838
QUnit.test( "ensure dialog's container doesn't scroll on resize and focus", function( assert ) {
	var ready = assert.async();
	assert.expect( 2 );

	var element = $( "#dialog1" ).dialog(),
		initialScroll = $( window ).scrollTop();
	element.dialog( "option", "height", 600 );
	assert.equal( $( window ).scrollTop(), initialScroll, "scroll hasn't moved after height change" );
	setTimeout( function() {
		$( ".ui-dialog-titlebar-close" ).simulate( "mousedown" );
		assert.equal( $( window ).scrollTop(), initialScroll, "scroll hasn't moved after focus moved to dialog" );
		element.dialog( "destroy" );
		ready();
	} );
} );

QUnit.test( "#5184: isOpen in dialogclose event is true", function( assert ) {
	assert.expect( 3 );

	var element = $( "<div></div>" ).dialog( {
			close: function() {
				assert.ok( !element.dialog( "isOpen" ), "dialog is not open during close" );
			}
		} );
	assert.ok( element.dialog( "isOpen" ), "dialog is open after init" );
	element.dialog( "close" );
	assert.ok( !element.dialog( "isOpen" ), "dialog is not open after close" );
	element.remove();
} );

QUnit.test( "ensure dialog keeps focus when clicking modal overlay", function( assert ) {
	assert.expect( 2 );

	var element = $( "<div></div>" ).dialog( {
			modal: true
		} );
	assert.equal( $( document.activeElement ).closest( ".ui-dialog" ).length, 1, "focus is in dialog" );
	$( ".ui-widget-overlay" ).simulate( "mousedown" );
	assert.equal( $( document.activeElement ).closest( ".ui-dialog" ).length, 1, "focus is still in dialog" );
	element.remove();
} );

} );
