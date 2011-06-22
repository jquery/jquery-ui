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
		if ( !this.active.length || !this.active.parents("body").length ) {
			this.active = this.element.find("td:first");
		}
		this.active.addClass("navigator-active");
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
		}
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
		this.active.trigger("click");
	}
});

})( jQuery );
