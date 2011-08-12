/*
 * Grid Navigator
 *
 * Depends on:
 * widget
 */
(function( $ ) {

$.widget( "ui.navigator", {
	_create: function() {
		this.active = $();
		this.element.attr( "tabIndex", 0 );
		this._bind({
			focusin: "activate",
			focusout: "deactivate",
			keydown: "move",
			keyup: "enter",
			click: "select"
		});
	},
	select: function( event ) {
		var target = $( event.target ).closest( "td" );
		if (target.length) {
			this.deactivate();
			this.active = target;
			this.activate();
		}
	},
	activate: function() {
		if ( this._noneActive() ) {
			this.active = this._lookup();
		}
		this.active.addClass("navigator-active");
		this.x = this.active[ 0 ].cellIndex;
		this.y = this.active.parent().index();
	},
	_noneActive: function() {
		return !this.active.length || !this.active.parents("body").length;
	},
	_lookup: function() {
		var result = this.element.find( "tbody > tr" ).eq( this.y ).find( "td" ).eq( this.x );
		if ( !result.length ) {
			return this.element.find("tbody td:first");
		}
		return result;
	},
	deactivate: function() {
		this.active.removeClass("navigator-active");
	},
	move: function( event ) {
		switch ( event.keyCode ) {
		case $.ui.keyCode.RIGHT:
			this.right(); break;
		case $.ui.keyCode.LEFT:
			this.left(); break;
		case $.ui.keyCode.UP:
			this.up(); break;
		case $.ui.keyCode.DOWN:
			this.down(); break;
		default:
			return;
		}
		// prevent page from scrolling when a key is matched
		event.preventDefault();
	},
	enter: function( event ) {
		switch ( event.keyCode ) {
		case $.ui.keyCode.ENTER:
			this.click(); break;
		}
	},
	right: function() {
		var next = this.active.next();
		if (next.length) {
			this.deactivate();
			this.active = next;
			this.activate();
		}
	},
	left: function() {
		var next = this.active.prev();
		if (next.length) {
			this.deactivate();
			this.active = next;
			this.activate();
		}
	},
	up: function() {
		var index = this.active[ 0 ].cellIndex;
		var next = this.active.parent().prev().children( "td" ).eq( index );
		if (next.length) {
			this.deactivate();
			this.active = next;
			this.activate();
		}
	},
	down: function() {
		var index = this.active[ 0 ].cellIndex;
		var next = this.active.parent().next().children( "td" ).eq( index );
		if (next.length) {
			this.deactivate();
			this.active = next;
			this.activate();
		}
	},
	click: function() {
		this.active.trigger("dblclick");
	}
});

})( jQuery );
