/*
 * jQuery UI menubar
 *
 * backported from Michael Lang's fork: http://www.nexul.com/prototypes/toolbar/demo.html
 */
(function($) {

$.widget("ui.menubar", {
	_create: function() {
		var self = this;
		var items = this.element.children("button, a");
		items.next("ul").each(function(i, elm) {
			$(elm).flyoutmenu({
				select: self.options.select
			}).hide().addClass("ui-menu-flyout").keydown(function(event) {
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
			input.bind("click focus mouseenter", function(event) {
				if (menu.length && (!/^mouse/.test(event.type) || self.active && self.active.is(":visible") )) {
					self._open(event, menu);
				}
				event.preventDefault();
				event.stopPropagation();
			}).button({
				icons: {
					secondary: menu.length ? 'ui-icon-triangle-1-s' : ''
				}
			});
		});
		$(document).click(function() {
			!$(event.target).closest(".ui-menubar").length && items.next("ul").hide();
		});
	},
	
	_open: function(event, menu) {
		this.active && this.active.flyoutmenu("hide");
		this.active = menu.flyoutmenu("show").css({
			position: "absolute",
			top: 0,
			left: 0
		}).position({
			my: "left top",
			at: "left bottom",
			offset: "0 -1",
			of: menu.prev()
		}).focus();
	},
	
	left: function(event) {
		var prev = this.active.prevAll( ".ui-menu-flyout" ).eq( 0 );
		if (prev.length) {
			this._open(event, prev);
		} else {
			this._open(event, this.element.children(".ui-menu-flyout:last"));
		}
	},
	
	right: function(event) {
		var next =  this.active.nextAll( ".ui-menu-flyout" ).eq( 0 );
		if (next.length) {
			this._open(event, next);
		} else {
			this._open(event, this.element.children(".ui-menu-flyout:first"));
		}
	}
});

}(jQuery));
