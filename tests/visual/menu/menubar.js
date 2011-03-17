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
					self.left(event);
					event.preventDefault();
					break;
				case $.ui.keyCode.RIGHT:
					self.right(event);
					event.preventDefault();
					break;
				};
			}).blur(function() {
				$(this).hide().prev().removeClass("ui-state-active").removeAttr("tabIndex");
				self.timer = setTimeout(function() {
					self.open = false;
				}, 13);
			});
		});
		items.each(function() {
			var input = $(this),
				   menu = input.next("ul");
			
			input.bind("click focus mouseenter", function(event) {
   				event.preventDefault();
   				event.stopPropagation();
			   	if (menu.is(":visible") && self.active && self.active[0] == menu[0]) {
					self._close();
					return;
				}
   				if (menu.length && (self.open || event.type == "click")) {
   					self._open(event, menu);
   				}
   			})
			.bind( "keydown", function( event ) {
				switch ( event.keyCode ) {
				case $.ui.keyCode.UP:
				case $.ui.keyCode.DOWN:
					self._open( event, $( this ).next() );
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
				!$(event.target).closest(".ui-menubar").length && self._close();
			}
		})
		self._bind({
			keyup: function(event) {
				if (event.keyCode == $.ui.keyCode.ESCAPE) {
					if (self.active.menu("left", event) !== true) {
						self._close( event );
						// bypass the focus event handler above
						self.active.prev()[0].focus();
					}
				}
			}
		});
	},
	
	_close: function() {
		this.items.next("ul").hide();
		this.items.removeClass("ui-state-active").removeAttr("tabIndex");
		this.open = false;
	},
	
	_open: function(event, menu) {
		if (this.active) {
			this.active.menu("closeAll").hide();
			this.active.prev().removeClass("ui-state-active").removeAttr("tabIndex");
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
	
	left: function(event) {
		var prev = this.active.prevAll( ".ui-menu" ).eq( 0 );
		if (prev.length) {
			this._open(event, prev);
		} else {
			this._open(event, this.element.children(".ui-menu:last"));
		}
	},
	
	right: function(event) {
		var next =  this.active.nextAll( ".ui-menu" ).eq( 0 );
		if (next.length) {
			this._open(event, next);
		} else {
			this._open(event, this.element.children(".ui-menu:first"));
		}
	}
});

}(jQuery));
