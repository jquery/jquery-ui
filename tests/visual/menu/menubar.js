/*
 * jQuery UI menubar
 *
 * backported from Michael Lang's fork: http://www.nexul.com/prototypes/toolbar/demo.html
 */
(function($) {

// TODO take non-menubar buttons into account
$.widget("ui.menubar", {
   options: {
      buttons: false,
      menuIcon: false
   },
	_create: function() {
		var self = this;
		var items = this.items = this.element.children("button, a");
		items.slice(1).attr("tabIndex", -1);
		var o = this.options;
				
		this.element.addClass('ui-menubar ui-widget-header ui-helper-clearfix');
		this._focusable(items);
		this._hoverable(items);
		items.next("ul").each(function(i, elm) {
			$(elm).menu({
				select: function(event, ui) {
					ui.item.parents("ul:last").hide()
					self.options.select.apply(this, arguments);
				}
			}).hide().keydown(function(event) {
				var menu = $(this);
				if (menu.is(":hidden")) 
					return;
				event.stopPropagation();
				switch (event.keyCode) {
				case $.ui.keyCode.LEFT:
					self._left(event);
					event.preventDefault();
					break;
				case $.ui.keyCode.RIGHT:
					self._right(event);
					event.preventDefault();
					break;
				};
			}).blur(function( event ) {
				self._close( event );
			});
		});
		items.each(function() {
			var input = $(this),
				   menu = input.next("ul");
			
			input.bind("click focus mouseenter", function(event) {
				// ignore triggered focus event
				if (event.type == "focus" && !event.originalEvent) {
					return;
				}
   				event.preventDefault();
   				event.stopPropagation();
			   	if (event.type == "click" && menu.is(":visible") && self.active && self.active[0] == menu[0]) {
					self._close();
					return;
				}
   				if (self.open || event.type == "click") {
   					self._open(event, menu);
   				}
   			})
			.bind( "keydown", function( event ) {
				switch ( event.keyCode ) {
				case $.ui.keyCode.SPACE:
				case $.ui.keyCode.UP:
				case $.ui.keyCode.DOWN:
					self._open( event, $( this ).next() );
					event.preventDefault();
					break;
				case $.ui.keyCode.LEFT:
					self._prev( event, $( this ) );
					event.preventDefault();
					break;
				case $.ui.keyCode.RIGHT:
					self._next( event, $( this ) );
					event.preventDefault();
					break;
				}
			})
			.addClass("ui-button ui-widget ui-button-text-only ui-menubar-link")
			.wrapInner("<span class='ui-button-text'></span>");
			
			if (o.menuIcon) {
				input.addClass("ui-state-default").append("<span class='ui-button-icon-secondary ui-icon ui-icon-triangle-1-s'></span>");
				input.removeClass("ui-button-text-only").addClass("ui-button-text-icon-secondary");
			}
   			
			if (!o.buttons) {
				input.addClass('ui-menubar-link').removeClass('ui-state-default');
			};			
			
		});
		self._bind(document, {
			click: function(event) {
				if (self.open && !$(event.target).closest(".ui-menubar").length) {
					self._close();
				}
			}
		})
		self._bind({
			keyup: function(event) {
				if (event.keyCode == $.ui.keyCode.ESCAPE && self.open) {
					if (self.active.menu("left", event) !== true) {
						var active = self.active;
						self.active.blur();
						active.prev().focus();
					}
				}
			}
		});
	},
	
	_close: function() {
		this.active.menu("closeAll").hide();
		this.active.prev().removeClass("ui-state-active").removeAttr("tabIndex");
		this.active = null;
		var self = this;
		// delay for the next focus event to see it as still "open"
		self.timer = setTimeout(function() {
			self.open = false;
		}, 13);
	},
	
	_open: function(event, menu) {
		// on a single-button menubar, ignore reopening the same menu
		if (this.active && this.active[0] == menu[0]) {
			return;
		}
		// almost the same as _close above, but don't remove tabIndex
		if (this.active) {
			this.active.menu("closeAll").hide();
			this.active.prev().removeClass("ui-state-active");
		}
		clearTimeout(this.timer);
		this.open = true;
		// set tabIndex -1 to have the button skipped on shift-tab when menu is open (it gets focus)
		var button = menu.prev().addClass("ui-state-active").attr("tabIndex", -1);
		this.active = menu.show().position({
			my: "left top",
			at: "left bottom",
			of: button
		}).focus();
	},
	
	_prev: function( event, button ) {
		button.attr("tabIndex", -1);
		var prev = button.prevAll( ".ui-button" ).eq( 0 );
		if (prev.length) {
			prev.removeAttr("tabIndex")[0].focus();
		} else {
			this.element.children(".ui-button:last").removeAttr("tabIndex")[0].focus();
		}
	},
	
	_next: function( event, button ) {
		button.attr("tabIndex", -1);
		var next =  button.nextAll( ".ui-button" ).eq( 0 );
		if (next.length) {
			next.removeAttr("tabIndex")[0].focus();
		} else {
			this.element.children(".ui-button:first").removeAttr("tabIndex")[0].focus();
		}
	},
	
	_left: function(event) {
		var prev = this.active.prevAll( ".ui-menu" ).eq( 0 );
		if (prev.length) {
			this._open(event, prev);
		} else {
			this._open(event, this.element.children(".ui-menu:last"));
		}
	},
	
	_right: function(event) {
		var next =  this.active.nextAll( ".ui-menu" ).eq( 0 );
		if (next.length) {
			this._open(event, next);
		} else {
			this._open(event, this.element.children(".ui-menu:first"));
		}
	}
});

}(jQuery));
