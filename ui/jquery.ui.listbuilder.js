/*!
 * jQuery UI Listbuilder @VERSION
 *
 * Copyright 2012 Michael Lang, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.menu.js
 *	jquery.ui.mouse.js
 *	jquery.ui.sortable.js
 *	jquery.ui.position.js
 *	jquery.ui.autocomplete.js
 */
(function ($) {
	$.widget("ui.listbuilder", {
		options: {
			delimeter: ",",
			duplicates: false,
			sortable: false, /*simple true or false*/
			autocomplete: false, /*default no autocomplete, if specified these are the options to pass to the autocomplete*/
			onSelect: null
		},
		_create: function () {
			if (!this.element.is(':text') && !this.element.is('textarea')) { return; }
			var self = this,
				key = $.ui.keyCode
			o = self.options,
				el = self.element,
				elDisabled = el.attr("disabled"),
				container = $("<div/>").addClass("ui-listbuilder ui-state-default ui-listbuilder")
					.css({ width: el.width(), "min-height": el.height() })
					.insertAfter(el);

			self._sorting = false;
			this.disabled = (elDisabled || elDisabled == "disabled");
			var listWidth = el.width() - 5;
			this._list = $("<ul/>").addClass("ui-listbuilder-items")
					.css({ width: listWidth, "min-height": el.height() })
					.appendTo(container);
			if (this.options.sortable) {
				this._list.sortable({
					items: 'li:not(:last)',
					start: function (event, ui) {
						self._sorting = true;
					},
					stop: function (event, ui) {
						$(document).one("mouseup", function () {
							//after mouseup bubbles up to document, then sorting should be considered over.
							self._sorting = false;
						});
						self._write();
					}
				});
			}

			if (!this.disabled) {
				var item0 = $("<li/>").addClass("ui-listbuilder-item-input")
					.attr("tabIndex", -1)
					.appendTo(this._list);
				var editWidth = this._list.width();
				if (this.options.autocomplete && this.options.autocomplete.minLength == 0) {
					editWidth = el.width() - 30;
				}
				this._tokenEditor = $("<input/>").attr("type", "text")
					.addClass("ui-listbuilder-input")
					.css({ width: editWidth })
					.appendTo(item0)
					.bind("focusout", function () {
						if (self.options.autocomplete && self._tokenEditor.autocomplete("widget").is(":visible")) { return; }
						self.listblur();
					})
					.bind("focusin", function () {
						self._selectItem(self._list.find('>li:last'));
					}).data("original", this.element);
				if (this.options.autocomplete) {
					this._tokenEditor.autocomplete(this.options.autocomplete);
					if (this.options.autocomplete.minLength == 0) {
						$("<div>&nbsp;</div>")
						.attr("title", "Show All Items")
						.insertAfter(this._tokenEditor)
						.addClass("ui-icon")
						.addClass("ui-icon-circle-triangle-s")
						.css("float", "right")
						.click(function (e) {
							if (self._tokenEditor.autocomplete("widget").is(":visible")) {
								self._tokenEditor.autocomplete("close");
								return;
							}
							self._tokenEditor.autocomplete("search", "");
							e.stopPropagation();
							e.preventDefault();
						});
					}
					self._tokenEditor.bind("autocompleteselect", function (e, ui) {
						self._add(ui.item.value);
						e.stopPropagation();
						e.preventDefault();
						self._tokenEditor.val("");
						self._write();
					});
					self._tokenEditor.bind("autocompleteopen", function (event, ui) {
						$(document).one("click", function () {
							self.listblur();
						});
					});
					this._suggester = $("<div/>").addClass("ui-state-active")
							.text("Type to receive suggestions")
							.hide().appendTo(item0);
				}

				this._list.bind("click", function (e) {
					self._selectItem($(e.target).closest('ul').find('>li:last'));
				})
					.bind("keydown", function (e) {
						if (!self.focused) { return; }
						var focus;

						switch (e.keyCode) {
							case key.LEFT:
								if (self._focusli.hasClass("ui-listbuilder-item-input")) {
									if (self._tokenEditor.val().length == 0 || self._tokenEditor.selectionStart < 1 || self._tokenEditor[0].selectionStart < 1) {
										focus = self._focusli.prev('li');
									}
								} else {
									focus = self._focusli.prev('li');
								}
								break;
							case key.UP:
								focus = self._focusli.prev('li');
								break;
							case key.BACKSPACE:
								if (self._focusli.hasClass("ui-listbuilder-item-input")) {
									if (self._tokenEditor.val().length == 0 || self._tokenEditor.selectionStart < 1 || self._tokenEditor[0].selectionStart < 1) {
										self._removeItem(self._focusli.prev('li'));
										focus = self._focusli.prev('li');
									}
								} else {
									focus = self._focusli.prev('li');
									self._removeItem(self._focusli);
								}
								break;
							case key.RIGHT:
							case key.DOWN:
								focus = self._focusli.next('li');
								break;
							case key.DELETE:
								if (!self._focusli.hasClass("ui-listbuilder-item-input")) {
									focus = self._focusli.next('li');
									self._removeItem(self._focusli);
								}
								break;
							case key.HOME:
							case key.PAGE_UP:
								focus = self._list.find('>li:first');
								break;
							case key.END:
							case key.PAGE_DOWN:
								focus = self._list.find('>li:last');
								break;
							case 13: /*ENTER*/
								if (self._focusli.hasClass("ui-listbuilder-item-input")) {
									if (self._tokenEditor.val().length > 0) {
										self._add(self._tokenEditor.val());
										self._tokenEditor.val("");
										self._write();
									}
								}
								return;
							default: //typing in edit box
								self._selectItem(self._tokenEditor.parent("li"));
								return;
						}
						if (focus && focus.length > 0) {
							self._selectItem(focus[0]);
						}
					});
			}

			this._read();
			el.hide();
		},
		_read: function () {
			//read text input value(s) and update list of displayed tokens
			var self = this,
				el = self.element,
				text = el.val(),
				tokens = text.split(self.options.delimeter);
			this._list.children(">li:not(:last)").remove();
			for (var i = 0; i < tokens.length; i++) {
				self._add(tokens[i]);
			}
		},
		_write: function () {
			var texts = [], items = this._list.children("li:not(:last)").children("span");
			for (var i = 0; i < items.length; i++) {
				if (this.options.duplicates || $.inArray(items[i].innerHTML, texts) === -1) {
					texts[texts.length] = items[i].innerHTML;
				} else {
					$(items[i]).parent("li").remove();
				}
			}
			var text = texts.join(this.options.delimeter);
			this.element.val(text);
			this.element.change();
		},
		_add: function (token) {
			token = $.trim(token);
			if (!token.length || token.length < 1) { return; }
			if (!this.options.duplicates) {
				this._list.find('li>span').each(function (index, elem) {
					if ($(elem).html().match('^' + token + '$')) { return; }
				});
			}

			var self = this,
				beforeItem = this._list.find('>li:last');
			var li = $("<li/>")
				.attr("tabIndex", -1)
				.addClass("ui-listbuilder-item ui-widget-content ui-corner-all");
			if (beforeItem.length && beforeItem.length > 0) {
				li.insertBefore(beforeItem);
			} else { //disabled list
				li.appendTo(this._list);
			}

			if (this.disabled) {
				li.addClass("ui-state-disabled");
			} else {
				li.hover(
					function (event) {
						$(this).addClass("ui-state-hover");
						if ($.isFunction(self.options.onSelect) && !self._sorting) {
							self._trigger("onSelect", event, { item: $(this) });
						}
					},
					function () { $(this).removeClass("ui-state-hover"); }
				);
				li.click(function (event) {
					self._selectItem($(this));
					if (self.options.onSelect && $.isFunction(self.options.onSelect) && !self._sorting) {
						self._trigger("onSelect", event, { item: $(this) });
					}
				});
			}
			var label = $("<span/>")
				.text(token)
				.appendTo(li);
			if (!this.disabled) {
				var lir = $("<a/>")
					.addClass("ui-icon ui-icon-circle-close")
					.attr("title", "remove")
					.appendTo(li)
					.hover(
						function () { $(this).addClass("ui-icon-close").removeClass("ui-icon-circle-close"); },
						function () { $(this).removeClass("ui-icon-close").addClass("ui-icon-circle-close"); }
					)
					.bind("click", function (e) {
						$(this);
						self._removeItem(li);
						e.stopPropagation();
						e.preventDefault();
					});
				li.bind("click", function (e) {
					self._selectItem(this);
				});
			}

			var previousItem = li.prev(),
				previousToken = previousItem.find('span').html(),
				previousStartsWithToken = (previousToken != null && token.toLowerCase().match(previousToken.toLowerCase()) == previousToken.toLowerCase());
			if (!this.focused && previousStartsWithToken) {
				this._removeItem(previousItem); //lost focus to autocomplete list, remove the partial item.
			}
		},
		_removeItem: function (li) {
			if (li.next().length > 0) {
				if (this.focused && this._focusli[0] == li[0]) {
					this._selectItem(li.next());
				}
				li.remove();
				this._write();
			}
		},
		_selectItem: function (li) {
			var self = this;
			//this._tokenEditor.focus(); //ensure focus is taken away from outside elements //stack overflow - recursive
			this._list.parent("div").addClass("ui-state-selected").removeClass("ui-state-default");
			this.focused = true;
			if (this._focusli) {
				this._focusli.removeClass("ui-state-focus ui-state-hover");
			}
			this._focusli = $(li).show();
			var children = this._focusli.children();
			if (children.filter(this._tokenEditor).length > 0) {
				if (this._suggester) {
					this._suggester.show();
				}
			} else {
				this._focusli.addClass("ui-state-focus");
				if (this._suggester) {
					this._suggester.hide();
				}
			}
		},
		add: function (token) {
			if (typeof token == 'string') {
				this._add(token);
			} else if (token.text) {
				this._add(token.text());
			}
			this._write();
		},
		remove: function (li) {
			this._removeItem(li);
			this._write();
		},
		editItem: function (li) {
			this._tokenEditor.val(li.children("span").text());
			this.remove(li);
		},
		selectedItem: function () {
			return this._focusli;
		},
		listblur: function () {
			var self = this;
			if (this._tokenEditor.val().length > 0) {
				this.add(this._tokenEditor.val());
				this._tokenEditor.val("");
			}
			this._list.parent("div").addClass("ui-state-default").removeClass("ui-state-selected ui-state-focus");
			//this._tokenEditor.blur();
			if (self.options.autocomplete) {
				this._tokenEditor.autocomplete("close");
			}
			this._list.children().removeClass("ui-state-focus ui-state-hover");
			if (this._suggester) {
				this._suggester.hide();
			}
			this.focused = false;
		},
		destroy: function () {
			this.element.show();
			this._list.parent().remove(); //parent div of list is the top level element
		}
	});
})(jQuery);