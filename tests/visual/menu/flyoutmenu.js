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
		this.activeItem = this.element.children("li").first();
		// hide submenus and create indicator icons
		this.element.find("ul").addClass("ui-menu-flyout").hide().prev("a").prepend('<span class="ui-icon ui-icon-carat-1-e"></span>');
		
		this.element.find("ul").andSelf().menu({
			select: function(event) {
				self._select(event);
			},
			focus: function(event, ui) {
				self.activeItem = ui.item;
				ui.item.parent().focus();
				ui.item.parent().find("ul").hide();
				var nested = $(">ul", ui.item);
				if (nested.length && event.originalEvent && /^mouse/.test(event.originalEvent.type)) {
					self._open(nested);
					nested.focus();
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
			}
		});
	},
	
	_open: function(submenu) {
		// TODO restrict to widget
		//only one menu can have items open at a time.
		$(document).find(".ui-menu-flyout").not(submenu.parents()).hide().data("menu").blur();
		
		var position = $.extend({}, {
			of: this.activeItem
		}, $.type(this.options.position) == "function"
			? this.options.position(this.activeItem)
			: this.options.position
		);
		
		submenu.show().position(position);
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
		var parent = item.parent();
		parent.data("menu").focus(event, item);
		this.activeItem = item;
		parent.focus();
	},
	show: function() {
		this.element.show();
	},
	hide: function() {
		this.activeItem = this.element.children("li").first();
		this.element.find("ul").andSelf().menu("blur").hide();
	}
});

}(jQuery));
