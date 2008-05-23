/*
 * jQuery UI Selectable
 *
 * Copyright (c) 2008 Richard D. Worth (rdworth.org)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * 
 * http://docs.jquery.com/UI/Selectables
 *
 * Depends:
 *	ui.core.js
 *
 * Revision: $Id: ui.selectable.js 5581 2008-05-13 16:58:03Z scott.gonzalez $
 */
;(function($) {

	$.widget("ui.selectable", {
		init: function() {
			var instance = this;
			
			this.element.addClass("ui-selectable");
			
			this.dragged = false;
	
			// cache selectee children based on filter
			var selectees;
			this.refresh = function() {
				selectees = $(instance.options.filter, instance.element[0]);
				selectees.each(function() {
					var $this = $(this);
					var pos = $this.offset();
					$.data(this, "selectable-item", {
						element: this,
						$element: $this,
						left: pos.left,
						top: pos.top,
						right: pos.left + $this.width(),
						bottom: pos.top + $this.height(),
						startselected: false,
						selected: $this.hasClass('ui-selected'),
						selecting: $this.hasClass('ui-selecting'),
						unselecting: $this.hasClass('ui-unselecting')
					});
				});
			};
			this.refresh();
	
			this.selectees = selectees.addClass("ui-selectee");
	
			//Initialize mouse interaction
			this.element.mouse({
				executor: this,
				appendTo: 'body',
				delay: 0,
				distance: 0,
				dragPrevention: ['input','textarea','button','select','option'],
				start: this.start,
				stop: this.stop,
				drag: this.drag,
				condition: function(e) {
					var isSelectee = false;
					$(e.target).parents().andSelf().each(function() {
						if($.data(this, "selectable-item")) isSelectee = true;
					});
					return this.options.keyboard ? !isSelectee : true;
				}
			});
			
			this.helper = $(document.createElement('div')).css({border:'1px dotted black'});
		},
		toggle: function() {
			if(this.disabled){
				this.enable();
			} else {
				this.disable();
			}
		},
		destroy: function() {
			this.element
				.removeClass("ui-selectable ui-selectable-disabled")
				.removeData("selectable")
				.unbind(".selectable")
				.mouse("destroy");
		},
		enable: function() {
			this.element.removeClass("ui-selectable-disabled");
			this.disabled = false;
		},
		disable: function() {
			this.element.addClass("ui-selectable-disabled");
			this.disabled = true;
		},
		start: function(ev, element) {
			
			this.opos = [ev.pageX, ev.pageY];
			
			if (this.disabled)
				return;

			var options = this.options;

			this.selectees = $(options.filter, element);

			// selectable START callback
			this.element.triggerHandler("selectablestart", [ev, {
				"selectable": element,
				"options": options
			}], options.start);

			$('body').append(this.helper);
			// position helper (lasso)
			this.helper.css({
				"z-index": 100,
				"position": "absolute",
				"left": ev.clientX,
				"top": ev.clientY,
				"width": 0,
				"height": 0
			});

			if (options.autoRefresh) {
				this.refresh();
			}

			this.selectees.filter('.ui-selected').each(function() {
				var selectee = $.data(this, "selectable-item");
				selectee.startselected = true;
				if (!ev.ctrlKey) {
					selectee.$element.removeClass('ui-selected');
					selectee.selected = false;
					selectee.$element.addClass('ui-unselecting');
					selectee.unselecting = true;
					// selectable UNSELECTING callback
					$(this.element).triggerHandler("selectableunselecting", [ev, {
						selectable: element,
						unselecting: selectee.element,
						options: options
					}], options.unselecting);
				}
			});
		},
		drag: function(ev, element) {
			this.dragged = true;
			
			if (this.disabled)
				return;

			var options = this.options;

			var x1 = this.opos[0], y1 = this.opos[1], x2 = ev.pageX, y2 = ev.pageY;
			if (x1 > x2) { var tmp = x2; x2 = x1; x1 = tmp; }
			if (y1 > y2) { var tmp = y2; y2 = y1; y1 = tmp; }
			this.helper.css({left: x1, top: y1, width: x2-x1, height: y2-y1});

			this.selectees.each(function() {
				var selectee = $.data(this, "selectable-item");
				//prevent helper from being selected if appendTo: selectable
				if (!selectee || selectee.element == element)
					return;
				var hit = false;
				if (options.tolerance == 'touch') {
					hit = ( !(selectee.left > x2 || selectee.right < x1 || selectee.top > y2 || selectee.bottom < y1) );
				} else if (options.tolerance == 'fit') {
					hit = (selectee.left > x1 && selectee.right < x2 && selectee.top > y1 && selectee.bottom < y2);
				}

				if (hit) {
					// SELECT
					if (selectee.selected) {
						selectee.$element.removeClass('ui-selected');
						selectee.selected = false;
					}
					if (selectee.unselecting) {
						selectee.$element.removeClass('ui-unselecting');
						selectee.unselecting = false;
					}
					if (!selectee.selecting) {
						selectee.$element.addClass('ui-selecting');
						selectee.selecting = true;
						// selectable SELECTING callback
						$(this.element).triggerHandler("selectableselecting", [ev, {
							selectable: element,
							selecting: selectee.element,
							options: options
						}], options.selecting);
					}
				} else {
					// UNSELECT
					if (selectee.selecting) {
						if (ev.ctrlKey && selectee.startselected) {
							selectee.$element.removeClass('ui-selecting');
							selectee.selecting = false;
							selectee.$element.addClass('ui-selected');
							selectee.selected = true;
						} else {
							selectee.$element.removeClass('ui-selecting');
							selectee.selecting = false;
							if (selectee.startselected) {
								selectee.$element.addClass('ui-unselecting');
								selectee.unselecting = true;
							}
							// selectable UNSELECTING callback
							$(this.element).triggerHandler("selectableunselecting", [ev, {
								selectable: element,
								unselecting: selectee.element,
								options: options
							}], options.unselecting);
						}
					}
					if (selectee.selected) {
						if (!ev.ctrlKey && !selectee.startselected) {
							selectee.$element.removeClass('ui-selected');
							selectee.selected = false;

							selectee.$element.addClass('ui-unselecting');
							selectee.unselecting = true;
							// selectable UNSELECTING callback
							$(this.element).triggerHandler("selectableunselecting", [ev, {
								selectable: element,
								unselecting: selectee.element,
								options: options
							}], options.unselecting);
						}
					}
				}
			});
		},
		stop: function(ev, element) {
			this.dragged = false;
			
			var options = this.options;

			$('.ui-unselecting', this.element).each(function() {
				var selectee = $.data(this, "selectable-item");
				selectee.$element.removeClass('ui-unselecting');
				selectee.unselecting = false;
				selectee.startselected = false;
				$(this.element).triggerHandler("selectableunselected", [ev, {
					selectable: element,
					unselected: selectee.element,
					options: options
				}], options.unselected);
			});
			$('.ui-selecting', this.element).each(function() {
				var selectee = $.data(this, "selectable-item");
				selectee.$element.removeClass('ui-selecting').addClass('ui-selected');
				selectee.selecting = false;
				selectee.selected = true;
				selectee.startselected = true;
				$(this.element).triggerHandler("selectableselected", [ev, {
					selectable: element,
					selected: selectee.element,
					options: options
				}], options.selected);
			});
			$(this.element).triggerHandler("selectablestop", [ev, {
				selectable: element,
				options: this.options
			}], this.options.stop);
			
			this.helper.remove();
		}
	});
	
	$.ui.selectable.defaults = {
		appendTo: 'body',
		autoRefresh: true,
		filter: '*',
		tolerance: 'touch'
	};
	
})(jQuery);
