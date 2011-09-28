/*
 * jQuery UI Draggable 2.0.0
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Draggables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

$.widget("ui.draggable", {
	widgetEventPrefix: "drag",
	options: {

    helper : false

	},

  drag_el : false, // either element or the helper

  position : {},
  offset   : {},

  _start_coords    : {}, // start X/Y coords of mouse before drag
  _start_position  : {}, // start position of element before drag
  _start_offset    : {}, // start offset of element before drag

	_create: function() {

    this.scrollParent = this.element.scrollParent();

    // Static position elements can't be moved with top/left
    if ( this.element.css( "position" ) === "static" ) {
      this.element.css( "position", "relative" );
    }

    // Prevent browser from hijacking drag
    this.element.disableSelection();

    // Using proxy to avoid anon functions using self to pass "this" along
    this.element.bind( "mousedown." + this.widgetName, $.proxy( this._mouseDown, this ) );

	}, // _create

	destroy: function() {
		return this;
	}, // destroy

  _setPosition : function() {

    var left, top, position, css_position;

    // Helper is appended to body so offset of element is all that's needed
    if ( this.options.helper === true ) {
      return this.element.offset();
    }

    css_position = this.drag_el.css( "position" );;

    // If fixed or absolute
    if ( css_position !== "relative" ) {

      position = this.drag_el.position();

      if ( css_position === "absolute" ) {
        return position;
      }

      // Take into account scrollbar for fixed position
      position.top  = position.top - this.scrollParent.scrollTop();
      position.left = position.left - this.scrollParent.scrollLeft();

      return position;

    } // css_position !+== absolute

    /** When using relative, css values are checked **/

    left = this.drag_el.css( "left" );
    top  = this.drag_el.css( "top" );

    // Webkit will give back auto if there is nothing inline yet
    left = ( left === "auto" ) ? 0 : parseInt( left, 10 );
    top  = ( top === "auto" ) ? 0 : parseInt( top, 10 );

    return {

      left : left,
      top  : top

    };

  }, // _setPosition

  _mouseDown : function( event ) {

    var el_position;
    
    this.drag_el = this.element;

    // Helper required, so clone, hide, and set reference
    if ( this.options.helper === true ) {

      this.drag_el = this.element.clone();

      // If source element has an ID, change ID of helper to avoid overlap
      if ( this.element.attr( 'id' ) ) {

        this.drag_el
          .css({
            position : 'absolute',
            display  : 'none'
          })
          .disableSelection()
          .attr( 'id', this.element.attr( 'id' ) + '-' + this.widgetName );

      } // id

      $('body').append( this.drag_el );

    } // if this.options.helper = true

    // Cache starting absolute and relative positions
    this._start_position = this._setPosition();
    this._start_offset   = this.drag_el.offset();

    // Cache current position and offset
    this.position = $.extend( {}, this._start_position );
    this.offset   = $.extend( {}, this._start_offset );

    this._start_coords = {
      left : event.clientX,
      top  : event.clientY
    };

    this._trigger( "start", event );

    $(document).bind( "mousemove." + this.widgetName, $.proxy( this._mouseMove, this ) );
    $(document).bind( "mouseup." + this.widgetName, $.proxy( this._mouseUp, this ) );


    // Set the helper up by actual element
    if ( this.options.helper === true ) {

      // get the absolute position of element so that helper will know where to go
      el_offset = this.element.offset();

      this.drag_el.css({
        display : 'block',
        top     : el_offset.top + 'px',
        left    : el_offset.left + 'px'
      });

    } // this.options.height = true

  }, // _mouseDown

  _mouseMove : function( event ) {

    var left_diff = event.clientX - this._start_coords.left,
        top_diff  = event.clientY - this._start_coords.top,
        new_left  = left_diff  + this._start_position.left,
        new_top   = top_diff  + this._start_position.top;

    this.position = {
      left : new_left,
      top  : new_top
    };

    // Refresh offset cache with new positions
    this.offset.left   = this._start_offset.left + new_left;
    this.offset.top    = this._start_offset.top + new_top;

    this._trigger( "drag", event );

    // User overriding left/top so shortcut math is no longer valid
    if ( new_left !== this.position.left || new_top !== this.position.top ) {

      // refresh offset using slower functions
      this.offset   = this.drag_el.offset();

    }

    this.drag_el.css({

      left : this.position.left + 'px',
      top  : this.position.top + 'px'

    });

  }, // _mouseMove

	_mouseUp : function( event ) {

    this._trigger( "stop", event );

    this._start_coords = {};

    if ( this.options.helper === true ) {
      this.drag_el.remove();
    }

    $(document).unbind( "mousemove." + this.widgetName );
    $(document).unbind( "mouseup." + this.widgetName );

  }, // _mouseUp

	_trigger: function(type, event, ui) {

		ui = ui || this._uiHash();

		return $.Widget.prototype._trigger.call(this, type, event, ui);
	}, // _trigger

	_uiHash: function(event) {
		return {
			position : this.position,
			offset   : this.offset
		};
	} // _uiHash

});

$.extend($.ui.draggable, {
	version: "2.0.0"
});


})(jQuery);
