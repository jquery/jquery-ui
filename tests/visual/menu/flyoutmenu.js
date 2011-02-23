/*
 * jQuery UI flyoutmenu
 *
 * backported from Michael Lang's fork: http://www.nexul.com/prototypes/toolbar/demo.html
 */
(function($) {

$.widget("ui.flyoutmenu", {
	
	options: {
		position: {
			my: "left top",
			at: "right top"
		}
	},
	
	_create: function() {
		var self = this;
		this.active = this.element;
		this.activeItem = this.element.children("li").first();
		// hide submenus and create indicator icons
		this.element.find("ul").addClass("ui-menu-flyout").hide().prev("a").prepend('<span class="ui-icon ui-icon-carat-1-e"></span>');
		
		this.element.find("ul").andSelf().menu({
			select: function(event) {
				self._select(event);
			},
			focus: function(event, ui) {
				self.active = ui.item.parent();
				self.activeItem = ui.item;
				ui.item.parent().find("ul").hide();
				var nested = $(">ul", ui.item);
				if (nested.length && event.originalEvent && /^mouse/.test(event.originalEvent.type)) {
					self._open(nested);
				}
			}
		}).keydown(function(event) {
			if (self.element.is(":hidden")) 
				return;
			switch (event.keyCode) {
			case $.ui.keyCode.LEFT:
				if (self.left(event)) {
					event.stopImmediatePropagation();
				}
				event.preventDefault();
				break;
			case $.ui.keyCode.RIGHT:
				if (self.right(event)) {
					event.stopImmediatePropagation();
				} 
				event.preventDefault();
				break;
			case $.ui.keyCode.ESCAPE:
				self.hide();
				break;
			default:
				clearTimeout(self.filterTimer);
				var prev = self.previousFilter || "";
				var character = String.fromCharCode(event.keyCode);
				var skip = false;
				if (character == prev) {
					skip = true;
				} else {
					character = prev + character;
				}
				function escape(value) {
					return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
				}
				var match = self.activeItem.parent("ul").children("li").filter(function() {
					// TODO why filter child anchor here, but not in the filter below?
					return new RegExp("^" + escape(character), "i").test($("a", this).text());
				});
				var match = skip && match.index(self.active.next()) != -1 ? match.next() : match;
				if (!match.length) {
					character = String.fromCharCode(event.keyCode);
					// TODO why use self.widget() here instead of self.activeItem??
					match = self.widget().children("li").filter(function() {
						return new RegExp("^" + escape(character), "i").test($(this).text());
					});
				}
				if (match.length) {
					self.activate(event, match);
					if (match.length > 1) {
						self.previousFilter = character;
						self.filterTimer = setTimeout(function() {
							delete self.previousFilter;
						}, 1000);
					} else {
						delete self.previousFilter;
					}
				} else {
					delete self.previousFilter;
				}
			}
		});
	},
	_open: function(submenu) {
		// TODO restrict to widget
		//only one menu can have items open at a time.
		$(document).find(".ui-menu-flyout").not(submenu.parents()).hide();
		
		var position = $.extend({}, {
			of: this.activeItem
		}, $.type(this.options.position) == "function"
			? this.options.position(this.activeItem)
			: this.options.position
		);
		
		submenu.show().css({
			top: 0,
			left: 0
		}).position(position);
	},
	_select: function(event) {
		event.stopPropagation();
		// TODO make _select cancelable?
		this._trigger( "select", event, { item: this.activeItem } );
		this.hide();
	},
	left: function(event) {
		var newItem = this.activeItem.parents("li").first();
		if (newItem.length) {
			this.activate(event, newItem);
			return true;
		}
	},
	right: function(event) {
		var newItem = this.activeItem.children("ul").children("li").first();
		if (newItem.length) {
			this._open(newItem.parent());
			this.activate(event, newItem);
			return true;
		}
	},
	activate: function(event, item) {
		if (item) {
			item.parent().data("menu").widget().show();
			item.parent().data("menu").activate(event, item);
		}
		this.activeItem = item;
		this.active = item.parent("ul")
		this.active.focus();
	},
	show: function() {
		this.active = this.element;
		this.element.show();
	},
	hide: function() {
		this.activeItem = this.element.children("li").first();
		this.element.find("ul").andSelf().menu("deactivate").hide();
	}
});

}(jQuery));
