/*
 * jQuery UI Droppable
 *
 * Copyright (c) 2008 Paul Bakaus
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * 
 * http://docs.jquery.com/UI/Droppables
 *
 * Depends:
 *	ui.core.js
 *	ui.draggable.js
 */
(function($) {

$.widget("ui.droppable", {
	init: function() {

		this.element.addClass("ui-droppable");
		this.isover = 0; this.isout = 1;
		
		//Prepare the passed options
		var o = this.options, accept = o.accept;
		o = $.extend(o, {
			accept: o.accept && o.accept.constructor == Function ? o.accept : function(d) {
				return $(d).is(accept);
			}
		});
		
		//Store the droppable's proportions
		this.proportions = { width: this.element[0].offsetWidth, height: this.element[0].offsetHeight };
		
		// Add the reference and positions to the manager
		$.ui.ddmanager.droppables.push(this);
		
	},
	plugins: {},
	ui: function(c) {
		return {
			draggable: (c.currentItem || c.element),
			helper: c.helper,
			position: c.position,
			absolutePosition: c.positionAbs,
			options: this.options,
			element: this.element
		};
	},
	destroy: function() {
		var drop = $.ui.ddmanager.droppables;
		for ( var i = 0; i < drop.length; i++ )
			if ( drop[i] == this )
				drop.splice(i, 1);
		
		this.element
			.removeClass("ui-droppable ui-droppable-disabled")
			.removeData("droppable")
			.unbind(".droppable");
	},
	over: function(e) {
		
		var draggable = $.ui.ddmanager.current;
		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return; // Bail if draggable and droppable are same element
		
		if (this.options.accept.call(this.element,(draggable.currentItem || draggable.element))) {
			$.ui.plugin.call(this, 'over', [e, this.ui(draggable)]);
			this.element.triggerHandler("dropover", [e, this.ui(draggable)], this.options.over);
		}
		
	},
	out: function(e) {
		
		var draggable = $.ui.ddmanager.current;
		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return; // Bail if draggable and droppable are same element
		
		if (this.options.accept.call(this.element,(draggable.currentItem || draggable.element))) {
			$.ui.plugin.call(this, 'out', [e, this.ui(draggable)]);
			this.element.triggerHandler("dropout", [e, this.ui(draggable)], this.options.out);
		}
		
	},
	drop: function(e,custom) {
		
		var draggable = custom || $.ui.ddmanager.current;
		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return false; // Bail if draggable and droppable are same element
		
		var childrenIntersection = false;
		this.element.find(".ui-droppable").not(".ui-draggable-dragging").each(function() {
			var inst = $.data(this, 'droppable');
			if(inst.options.greedy && $.ui.intersect(draggable, $.extend(inst, { offset: inst.element.offset() }), inst.options.tolerance)) {
				childrenIntersection = true; return false;
			}
		});
		if(childrenIntersection) return false;
		
		if(this.options.accept.call(this.element,(draggable.currentItem || draggable.element))) {
			$.ui.plugin.call(this, 'drop', [e, this.ui(draggable)]);
			this.element.triggerHandler("drop", [e, this.ui(draggable)], this.options.drop);
			return true;
		}
		
		return false;
		
	},
	activate: function(e) {
		
		var draggable = $.ui.ddmanager.current;
		$.ui.plugin.call(this, 'activate', [e, this.ui(draggable)]);
		if(draggable) this.element.triggerHandler("dropactivate", [e, this.ui(draggable)], this.options.activate);
		
	},
	deactivate: function(e) {
		
		var draggable = $.ui.ddmanager.current;
		$.ui.plugin.call(this, 'deactivate', [e, this.ui(draggable)]);
		if(draggable) this.element.triggerHandler("dropdeactivate", [e, this.ui(draggable)], this.options.deactivate);
		
	}
});

$.extend($.ui.droppable, {
	defaults: {
		disabled: false,
		tolerance: 'intersect'
	}
});

$.ui.intersect = function(draggable, droppable, toleranceMode) {
	
	if (!droppable.offset) return false;
	
	var x1 = (draggable.positionAbs || draggable.position.absolute).left, x2 = x1 + draggable.helperProportions.width,
		y1 = (draggable.positionAbs || draggable.position.absolute).top, y2 = y1 + draggable.helperProportions.height;
	var l = droppable.offset.left, r = l + droppable.proportions.width,
		t = droppable.offset.top, b = t + droppable.proportions.height;
	
	switch (toleranceMode) {
		case 'fit':
			return (l < x1 && x2 < r
				&& t < y1 && y2 < b);
			break;
		case 'intersect':
			return (l < x1 + (draggable.helperProportions.width / 2) // Right Half
				&& x2 - (draggable.helperProportions.width / 2) < r // Left Half
				&& t < y1 + (draggable.helperProportions.height / 2) // Bottom Half
				&& y2 - (draggable.helperProportions.height / 2) < b ); // Top Half
			break;
		case 'pointer':
			return (l < ((draggable.positionAbs || draggable.position.absolute).left + (draggable.clickOffset || draggable.offset.click).left) && ((draggable.positionAbs || draggable.position.absolute).left + (draggable.clickOffset || draggable.offset.click).left) < r
				&& t < ((draggable.positionAbs || draggable.position.absolute).top + (draggable.clickOffset || draggable.offset.click).top) && ((draggable.positionAbs || draggable.position.absolute).top + (draggable.clickOffset || draggable.offset.click).top) < b);
			break;
		case 'touch':
			return (
					(y1 >= t && y1 <= b) ||	// Top edge touching
					(y2 >= t && y2 <= b) ||	// Bottom edge touching
					(y1 < t && y2 > b)		// Surrounded vertically
				) && (
					(x1 >= l && x1 <= r) ||	// Left edge touching
					(x2 >= l && x2 <= r) ||	// Right edge touching
					(x1 < l && x2 > r)		// Surrounded horizontally
				);
			break;
		default:
			return false;
			break;
		}
	
};

/*
	This manager tracks offsets of draggables and droppables
*/
$.ui.ddmanager = {
	current: null,
	droppables: [],
	prepareOffsets: function(t, e) {
		
		var m = $.ui.ddmanager.droppables;
		var type = e ? e.type : null; // workaround for #2317

		for (var i = 0; i < m.length; i++) {
			if(m[i].options.disabled || (t && !m[i].options.accept.call(m[i].element,(t.currentItem || t.element)))) continue;
			m[i].visible = m[i].element.css("display") != "none"; if(!m[i].visible) continue; //If the element is not visible, continue
			m[i].offset = m[i].element.offset();
			m[i].proportions = { width: m[i].element[0].offsetWidth, height: m[i].element[0].offsetHeight };
			
			if(type == "dragstart" || type == "sortactivate") m[i].activate.call(m[i], e); //Activate the droppable if used directly from draggables
		}
		
	},
	drop: function(draggable, e) {
		
		var dropped = false;
		$.each($.ui.ddmanager.droppables, function() {
			
			if(!this.options) return;
			if (!this.options.disabled && this.visible && $.ui.intersect(draggable, this, this.options.tolerance))
				dropped = this.drop.call(this, e);
			
			if (!this.options.disabled && this.visible && this.options.accept.call(this.element,(draggable.currentItem || draggable.element))) {
				this.isout = 1; this.isover = 0;
				this.deactivate.call(this, e);
			}
			
		});
		return dropped;
		
	},
	drag: function(draggable, e) {
		
		//If you have a highly dynamic page, you might try this option. It renders positions every time you move the mouse.
		if(draggable.options.refreshPositions) $.ui.ddmanager.prepareOffsets(draggable, e);
		
		//Run through all droppables and check their positions based on specific tolerance options

		$.each($.ui.ddmanager.droppables, function() {
			
			if(this.options.disabled || this.greedyChild || !this.visible) return;
			var intersects = $.ui.intersect(draggable, this, this.options.tolerance);
			
			var c = !intersects && this.isover == 1 ? 'isout' : (intersects && this.isover == 0 ? 'isover' : null);
			if(!c) return;
			
			var parentInstance;
			if (this.options.greedy) {
				var parent = this.element.parents('.ui-droppable:eq(0)');
				if (parent.length) {
					parentInstance = $.data(parent[0], 'droppable');
					parentInstance.greedyChild = (c == 'isover' ? 1 : 0);
				}
			}
			
			// we just moved into a greedy child
			if (parentInstance && c == 'isover') {
				parentInstance['isover'] = 0;
				parentInstance['isout'] = 1;
				parentInstance.out.call(parentInstance, e);
			}
			
			this[c] = 1; this[c == 'isout' ? 'isover' : 'isout'] = 0;
			this[c == "isover" ? "over" : "out"].call(this, e);
			
			// we just moved out of a greedy child
			if (parentInstance && c == 'isout') {
				parentInstance['isout'] = 0;
				parentInstance['isover'] = 1;
				parentInstance.over.call(parentInstance, e);
			}
		});
		
	}
};

/*
 * Droppable Extensions
 */

$.ui.plugin.add("droppable", "activeClass", {
	activate: function(e, ui) {
		$(this).addClass(ui.options.activeClass);
	},
	deactivate: function(e, ui) {
		$(this).removeClass(ui.options.activeClass);
	},
	drop: function(e, ui) {
		$(this).removeClass(ui.options.activeClass);
	}
});

$.ui.plugin.add("droppable", "hoverClass", {
	over: function(e, ui) {
		$(this).addClass(ui.options.hoverClass);
	},
	out: function(e, ui) {
		$(this).removeClass(ui.options.hoverClass);
	},
	drop: function(e, ui) {
		$(this).removeClass(ui.options.hoverClass);
	}
});

})(jQuery);
