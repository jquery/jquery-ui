/*
 * jQuery UI Button @VERSION
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Button
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function($) {

var lastActive,
	baseClasses = "ui-button ui-widget ui-state-default ui-corner-all",
	otherClasses = "ui-state-hover ui-state-active " +
		"ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon ui-button-text-only";

$.widget("ui.button", {
	options: {
		text: true,
		label: null,
		icons: {
			primary: null,
			secondary: null
		}
	},
	_init: function() {
		this._determineButtonType();
		this.hasTitle = !!this.buttonElement.attr('title');

		var self = this,
			options = this.options,
			toggleButton = this.type == 'checkbox' || this.type == 'radio',
			hoverClass = 'ui-state-hover' + (!toggleButton ? ' ui-state-active' : '');

		if (options.label === null) {
			options.label = this.buttonElement.html();
		}

		this.buttonElement
			.addClass(baseClasses)
			.attr('role', 'button')
			.bind("mouseenter.button", function() {
				if (options.disabled) { return; }
				$(this).addClass("ui-state-hover");
				if (this == lastActive) {
					$(this).addClass("ui-state-active");
				}
			})
			.bind("mouseleave.button", function() {
				if (options.disabled) { return; }
				$(this).removeClass(hoverClass);
			});

		switch (this.type) {
			case 'checkbox':
				this.buttonElement.bind('click.button', function() {
					if (options.disabled) { return; }
					$(this).toggleClass("ui-state-active");
					self.element
						.attr("checked", !self.element[0].checked)
						.click();
					self.buttonElement.attr('aria-pressed', self.element[0].checked);
				});
			break;
			case 'radio':
				this.buttonElement.bind('click.button', function() {
					if (options.disabled) { return; }
					$(this).addClass("ui-state-active");
					self.element
						.attr("checked", true)
						.click();
					self.buttonElement.attr('aria-pressed', true);

					var radio = self.element[0],
						name = radio.name,
						form = radio.form,
						radios;
					if (name) {
						if (form) {
							radios = $(form).find('[name=' + name + ']');
						} else {
							radios = $('[name=' + name + ']', radio.ownerDocument)
								.filter(function() {
									return !this.form;
								});
						}
						radios
							.not(radio)
							.map(function() {
								return $(this).button('widget')[0];
							})
							.removeClass('ui-state-active')
							.attr('aria-pressed', false);
					}
				});
			break;
			default:
				this.buttonElement
					.bind("mousedown.button", function() {
						if (options.disabled) { return; }
						$(this).addClass("ui-state-active");
						lastActive = this;
						$(document).one('mouseup', function() {
							lastActive = null;
						});
					})
					.bind("mouseup.button", function() {
						if (options.disabled) { return; }
						$(this).removeClass("ui-state-active");
					});
			break;
		}

		this._resetButton();
	},

	_determineButtonType: function() {
		this.type = this.element.is(':checkbox')
			? 'checkbox'
			: this.element.is(':radio')
				? 'radio'
				: this.element.is('input')
					? 'input'
					: 'button';

		if (this.type == 'checkbox' || this.type == 'radio') {
			this.buttonElement = $("[for=" + this.element.attr("id") + "]");
			this.element.hide();
			
			var checked = this.element.is(':checked');
			if (checked) {
				this.buttonElement.addClass('ui-state-active');
			}
			this.buttonElement.attr('aria-pressed', checked)
		} else {
			this.buttonElement = this.element;
		}
	},

	widget: function() {
		return this.buttonElement;
	},

	destroy: function() {
		this.buttonElement
			.removeClass(baseClasses + " " + otherClasses)
			.removeAttr('role')
			.removeAttr('aria-pressed')
			.html(this.buttonElement.find(".ui-button-text").html());

		if (!this.hasTitle) {
			this.buttonElement.removeAttr('title');
		}

		if (this.type == 'checkbox' || this.type == 'radio') {
			this.element.show();
		}

		$.Widget.prototype.destroy.call(this);
	},

	_setOption: function(key, value) {
		$.Widget.prototype._setOption.apply(this, arguments);
		this._resetButton();
	},

	_resetButton: function() {
		if (this.type == 'input') {
			if (this.options.label) {
				this.element.val(this.options.label);
			}
			return;
		}
		var buttonElement = this.buttonElement,
			buttonText = $("<span></span>")
				.addClass("ui-button-text")
				.html(this.options.label)
				.appendTo(buttonElement.empty())
				.text();

		var icons = this.options.icons,
			multipleIcons = icons.primary && icons.secondary;
		if (icons.primary || icons.secondary) {
			buttonElement.addClass("ui-button-text-icon" +
				(multipleIcons ? "s" : ""));
			if (icons.primary) {
				buttonElement.prepend("<span class='ui-button-icon-primary ui-icon " + icons.primary + "'></span>");
			}
			if (icons.secondary) {
				buttonElement.append("<span class='ui-button-icon-secondary ui-icon " + icons.secondary + "'></span>");
			}
			if (!this.options.text) {
				buttonElement
					.addClass(multipleIcons ? "ui-button-icons-only" : "ui-button-icon-only")
					.removeClass("ui-button-text-icons ui-button-text-icon");
				if (!this.hasTitle) {
					buttonElement.attr("title", buttonText);
				}
			}
		} else {
			buttonElement.addClass("ui-button-text-only");
		}
	}
});

$.widget("ui.buttonset", {
	_init: function() {
		this.element.addClass("ui-button-set");
		this.buttons = this.element.find(':button, :submit, :reset, :checkbox, :radio, a, .ui-button')
			.button()
			.map(function() {
				return $(this).button('widget')[0];
			})
				.removeClass('ui-corner-all')
				.filter(':first')
					.addClass('ui-corner-left')
				.end()
				.filter(':last')
					.addClass('ui-corner-right')
				.end()
			.end();
	},

	_setOption: function(key, value) {
		if (key == 'disabled') {
			this.buttons.button('option', key, value);
		}

		$.Widget.prototype._setOption.apply(this, arguments);
	},

	destroy: function() {
		this.element.removeClass('ui-button-set');
		this.buttons
			.button("destroy")
			.removeClass("ui-corner-left ui-corner-right");

		$.Widget.prototype.destroy.call(this);
	}
});


})(jQuery);
