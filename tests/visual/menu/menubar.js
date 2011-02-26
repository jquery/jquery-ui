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
				case $.ui.keyCode.TAB:
					self[ event.shiftKey ? "left" : "right" ]( event );
					event.preventDefault();
					break;
				};
			});
		});
		items.each(function() {
			var input = $(this),
				   menu = input.next("ul");
			
			input
			   .bind("click focus mouseenter", function(event) {
   				if (menu.length && (!/^mouse/.test(event.type) || self.active && self.active.is(":visible") )) {
   					self._open(event, menu);
   				}
   				event.preventDefault();
   				event.stopPropagation();
   			})
   			.button({
   				icons: {
   					secondary: o.menuIcon ? (menu.length ? 'ui-icon-triangle-1-s' : '') : ''   					
   				}
   			});
   			
         if (!o.buttons) {
            input.addClass('ui-menubar-link').removeClass('ui-state-default');
         };			
			
		});
		$(document).click(function(event) {
			!$(event.target).closest(".ui-menubar").length && self._close();
		});
	},
	
	_close: function() {
		this.items.next("ul").hide();
		this.items.removeClass("ui-state-active");
	},
	
	_open: function(event, menu) {
		if (this.active) {
			this.active.menu("closeAll").hide();
			this.active.prev().removeClass("ui-state-active");
		}
		var button = menu.prev().addClass("ui-state-active");
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
