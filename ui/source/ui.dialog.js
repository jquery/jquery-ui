/*
 * jQuery UI Dialog
 *
 * Copyright (c) 2008 Richard D. Worth (rdworth.org)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * 
 * http://docs.jquery.com/UI/Dialog
 *
 * Depends:
 *	ui.core.js
 *	ui.draggable.js
 *	ui.resizable.js
 *
 * Revision: $Id: ui.dialog.js 5608 2008-05-15 14:41:12Z scott.gonzalez $
 */
;(function($) {

var setDataSwitch = {
	dragStart: "start.draggable",
	drag: "drag.draggable",
	dragStop: "stop.draggable",
	maxHeight: "maxHeight.resizable",
	minHeight: "minHeight.resizable",
	maxWidth: "maxWidth.resizable",
	minWidth: "minWidth.resizable",
	resizeStart: "start.resizable",
	resize: "drag.resizable",
	resizeStop: "stop.resizable"
};

$.widget("ui.dialog", {
	init: function() {
		var self = this;
		var options = this.options;
		
		var uiDialogContent = this.element.addClass('ui-dialog-content');
		
		if (!uiDialogContent.parent().length) {
			uiDialogContent.appendTo('body');
		}
		uiDialogContent
			.wrap(document.createElement('div'))
			.wrap(document.createElement('div'));
		var uiDialogContainer = uiDialogContent.parent().addClass('ui-dialog-container').css({position: 'relative'});
		var uiDialog = (this.uiDialog = uiDialogContainer.parent()).hide()
			.addClass('ui-dialog').addClass(options.dialogClass)
			.css({position: 'absolute', width: options.width, height: options.height, overflow: 'hidden'}); 

		var classNames = uiDialogContent.attr('className').split(' ');

		// Add content classes to dialog, to inherit theme at top level of element
		$.each(classNames, function(i, className) {
			((className != 'ui-dialog-content')
				&& uiDialog.addClass(className));
		});

		if ($.fn.resizable) {
			uiDialog.append('<div class="ui-resizable-n ui-resizable-handle"></div>')
				.append('<div class="ui-resizable-s ui-resizable-handle"></div>')
				.append('<div class="ui-resizable-e ui-resizable-handle"></div>')
				.append('<div class="ui-resizable-w ui-resizable-handle"></div>')
				.append('<div class="ui-resizable-ne ui-resizable-handle"></div>')
				.append('<div class="ui-resizable-se ui-resizable-handle"></div>')
				.append('<div class="ui-resizable-sw ui-resizable-handle"></div>')
				.append('<div class="ui-resizable-nw ui-resizable-handle"></div>');
			uiDialog.resizable({
				maxWidth: options.maxWidth,
				maxHeight: options.maxHeight,
				minWidth: options.minWidth,
				minHeight: options.minHeight,
				start: options.resizeStart,
				resize: options.resize,
				stop: function(e, ui) {
					(options.resizeStop && options.resizeStop.apply(this, arguments));
					$.ui.dialog.overlay.resize();
				}
			});
			(!options.resizable && uiDialog.resizable('disable'));
		}

		uiDialogContainer.prepend('<div class="ui-dialog-titlebar"></div>');
		var uiDialogTitlebar = $('.ui-dialog-titlebar', uiDialogContainer);
		this.uiDialogTitlebar = uiDialogTitlebar;
		var title = (options.title) ? options.title : (uiDialogContent.attr('title')) ? uiDialogContent.attr('title') : '';
		uiDialogTitlebar.append('<span class="ui-dialog-title">' + title + '</span>');
		uiDialogTitlebar.append('<a href="#" class="ui-dialog-titlebar-close"><span>X</span></a>');
		this.uiDialogTitlebarClose = $('.ui-dialog-titlebar-close', uiDialogTitlebar)
			.hover(function() { $(this).addClass('ui-dialog-titlebar-close-hover'); }, 
				function() { $(this).removeClass('ui-dialog-titlebar-close-hover'); }
			)
			.mousedown(function(ev) {
				ev.stopPropagation();
			})
			.click(function() {
				self.close();
				return false;
			});
		
		// setting tabindex makes the div focusable
		// setting outline to 0 prevents a border on focus in Mozilla
		uiDialog.attr('tabindex', -1).css('outline', 0).keydown(function(ev) {
			if (options.closeOnEscape) {
				var ESC = 27;
				(ev.keyCode && ev.keyCode == ESC && self.close());
			}
		});
		
		var hasButtons = false;
		$.each(options.buttons, function() { return !(hasButtons = true); });
		if (hasButtons) {
			var uiDialogButtonPane = $('<div class="ui-dialog-buttonpane"/>')
				.appendTo(uiDialog);
			$.each(options.buttons, function(name, fn) {
				$(document.createElement('button'))
					.text(name)
					.click(function() { fn.apply(self.element, arguments); })
					.appendTo(uiDialogButtonPane);
			});
		}
		
		if ($.fn.draggable) {
			uiDialog.draggable({
				handle: '.ui-dialog-titlebar',
				start: function(e, ui) {
					self.activate();
					(options.dragStart && options.dragStart.apply(this, arguments));
				},
				drag: options.drag,
				stop: function(e, ui) {
					(options.dragStop && options.dragStop.apply(this, arguments));
					$.ui.dialog.overlay.resize();
				}
			});
			(!options.draggable && uiDialog.draggable('disable'));
		}
	
		uiDialog.mousedown(function() {
			self.activate();
		});
		uiDialogTitlebar.click(function() {
			self.activate();
		});
		
		(options.bgiframe && $.fn.bgiframe && uiDialog.bgiframe());
		
		(options.autoOpen && this.open());
	},
	
	setData: function(key, value){
		(setDataSwitch[key] && this.uiDialog.data(setDataSwitch[key], value));
		switch (key) {
			case "draggable":
				this.uiDialog.draggable(value ? 'enable' : 'disable');
				break;
			case "height":
				this.uiDialog.height(value);
				break;
			case "position":
				this.position(value);
				break;
			case "resizable":
				this.uiDialog.resizable(value ? 'enable' : 'disable');
				break;
			case "title":
				$(".ui-dialog-title", this.uiDialogTitlebar).text(value);
				break;
			case "width":
				this.uiDialog.width(value);
				break;
		}
		this.options[key] = value;
	},
	
	position: function(pos) {
		var wnd = $(window), doc = $(document),
			pTop = doc.scrollTop(), pLeft = doc.scrollLeft(),
			minTop = pTop;
		
		if ($.inArray(pos, ['center','top','right','bottom','left']) >= 0) {
			pos = [
				pos == 'right' || pos == 'left' ? pos : 'center',
				pos == 'top' || pos == 'bottom' ? pos : 'middle'
			];
		}
		if (pos.constructor != Array) {
			pos = ['center', 'middle'];
		}
		if (pos[0].constructor == Number) {
			pLeft += pos[0];
		} else {
			switch (pos[0]) {
				case 'left':
					pLeft += 0;
					break;
				case 'right':
					pLeft += (wnd.width()) - (this.uiDialog.width());
					break;
				default:
				case 'center':
					pLeft += (wnd.width() / 2) - (this.uiDialog.width() / 2);
			}
		}
		if (pos[1].constructor == Number) {
			pTop += pos[1];
		} else {
			switch (pos[1]) {
				case 'top':
					pTop += 0;
					break;
				case 'bottom':
					pTop += (wnd.height()) - (this.uiDialog.height());
					break;
				default:
				case 'middle':
					pTop += (wnd.height() / 2) - (this.uiDialog.height() / 2);
			}
		}
		
		// prevent the dialog from being too high (make sure the titlebar
		// is accessible)
		pTop = Math.max(pTop, minTop);
		this.uiDialog.css({top: pTop, left: pLeft});
	},
	
	open: function() {
		this.overlay = this.options.modal ? new $.ui.dialog.overlay(this) : null;
		this.uiDialog.appendTo('body');
		this.position(this.options.position);
		this.uiDialog.show();
		this.moveToTop();
		this.activate();
		
		// CALLBACK: open
		var openEV = null;
		var openUI = {
			options: this.options
		};
		this.uiDialogTitlebarClose.focus();
		this.element.triggerHandler("dialogopen", [openEV, openUI], this.options.open);
	},

	activate: function() {
		// Move modeless dialogs to the top when they're activated. Even
		// if there is a modal dialog in the window, the modeless dialog
		// should be on top because it must have been opened after the modal
		// dialog. Modal dialogs don't get moved to the top because that
		// would make any modeless dialogs that it spawned unusable until
		// the modal dialog is closed.
		(!this.options.modal && this.moveToTop());
	},
		
	moveToTop: function() {
		var maxZ = this.options.zIndex, options = this.options;
		$('.ui-dialog:visible').each(function() {
			maxZ = Math.max(maxZ, parseInt($(this).css('z-index'), 10) || options.zIndex);
		});
		(this.overlay && this.overlay.$el.css('z-index', ++maxZ));
		this.uiDialog.css('z-index', ++maxZ);
	},
		
	close: function() {
		(this.overlay && this.overlay.destroy());
		this.uiDialog.hide();

		// CALLBACK: close
		var closeEV = null;
		var closeUI = {
			options: this.options
		};
		this.element.triggerHandler("dialogclose", [closeEV, closeUI], this.options.close);
		$.ui.dialog.overlay.resize();
	},
	
	destroy: function() {
		(this.overlay && this.overlay.destroy());
		this.uiDialog.hide();
		this.element
			.unbind('.dialog')
			.removeData('dialog')
			.removeClass('ui-dialog-content')
			.hide().appendTo('body');
		this.uiDialog.remove();
	}
});

$.extend($.ui.dialog, {
	defaults: {
		autoOpen: true,
		bgiframe: false,
		buttons: {},
		closeOnEscape: true,
		draggable: true,
		height: 200,
		minHeight: 100,
		minWidth: 150,
		modal: false,
		overlay: {},
		position: 'center',
		resizable: true,
		width: 300,
		zIndex: 1000
	},
	
	overlay: function(dialog) {
		this.$el = $.ui.dialog.overlay.create(dialog);
	}
});

$.extend($.ui.dialog.overlay, {
	instances: [],
	events: $.map('focus,mousedown,mouseup,keydown,keypress,click'.split(','),
		function(e) { return e + '.dialog-overlay'; }).join(' '),
	create: function(dialog) {
		if (this.instances.length === 0) {
			// prevent use of anchors and inputs
			// we use a setTimeout in case the overlay is created from an
			// event that we're going to be cancelling (see #2804)
			setTimeout(function() {
				$('a, :input').bind($.ui.dialog.overlay.events, function() {
					// allow use of the element if inside a dialog and
					// - there are no modal dialogs
					// - there are modal dialogs, but we are in front of the topmost modal
					var allow = false;
					var $dialog = $(this).parents('.ui-dialog');
					if ($dialog.length) {
						var $overlays = $('.ui-dialog-overlay');
						if ($overlays.length) {
							var maxZ = parseInt($overlays.css('z-index'), 10);
							$overlays.each(function() {
								maxZ = Math.max(maxZ, parseInt($(this).css('z-index'), 10));
							});
							allow = parseInt($dialog.css('z-index'), 10) > maxZ;
						} else {
							allow = true;
						}
					}
					return allow;
				});
			}, 1);
			
			// allow closing by pressing the escape key
			$(document).bind('keydown.dialog-overlay', function(e) {
				var ESC = 27;
				(e.keyCode && e.keyCode == ESC && dialog.close()); 
			});
			
			// handle window resize
			$(window).bind('resize.dialog-overlay', $.ui.dialog.overlay.resize);
		}
		
		var $el = $('<div/>').appendTo(document.body)
			.addClass('ui-dialog-overlay').css($.extend({
				borderWidth: 0, margin: 0, padding: 0,
				position: 'absolute', top: 0, left: 0,
				width: this.width(),
				height: this.height()
			}, dialog.options.overlay));
		
		(dialog.options.bgiframe && $.fn.bgiframe && $el.bgiframe());
		
		this.instances.push($el);
		return $el;
	},
	
	destroy: function($el) {
		this.instances.splice($.inArray(this.instances, $el), 1);
		
		if (this.instances.length === 0) {
			$('a, :input').add([document, window]).unbind('.dialog-overlay');
		}
		
		$el.remove();
	},
	
	height: function() {
		if ($.browser.msie && $.browser.version < 7) {
			var scrollHeight = Math.max(
				document.documentElement.scrollHeight,
				document.body.scrollHeight
			);
			var offsetHeight = Math.max(
				document.documentElement.offsetHeight,
				document.body.offsetHeight
			);
			
			if (scrollHeight < offsetHeight) {
				return $(window).height() + 'px';
			} else {
				return scrollHeight + 'px';
			}
		} else {
			return $(document).height() + 'px';
		}
	},
	
	width: function() {
		if ($.browser.msie && $.browser.version < 7) {
			var scrollWidth = Math.max(
				document.documentElement.scrollWidth,
				document.body.scrollWidth
			);
			var offsetWidth = Math.max(
				document.documentElement.offsetWidth,
				document.body.offsetWidth
			);
			
			if (scrollWidth < offsetWidth) {
				return $(window).width() + 'px';
			} else {
				return scrollWidth + 'px';
			}
		} else {
			return $(document).width() + 'px';
		}
	},
	
	resize: function() {
		/* If the dialog is draggable and the user drags it past the
		 * right edge of the window, the document becomes wider so we
		 * need to stretch the overlay. If the user then drags the
		 * dialog back to the left, the document will become narrower,
		 * so we need to shrink the overlay to the appropriate size.
		 * This is handled by shrinking the overlay before setting it
		 * to the full document size.
		 */
		var $overlays = $([]);
		$.each($.ui.dialog.overlay.instances, function() {
			$overlays = $overlays.add(this);
		});
		
		$overlays.css({
			width: 0,
			height: 0
		}).css({
			width: $.ui.dialog.overlay.width(),
			height: $.ui.dialog.overlay.height()
		});
	}
});

$.extend($.ui.dialog.overlay.prototype, {
	destroy: function() {
		$.ui.dialog.overlay.destroy(this.$el);
	}
});

})(jQuery);
