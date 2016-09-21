/*!
 * jQuery UI Extendtion - Elements @VERSION
 * https://github.com/GrayYoung/jQuery.UI.Extension
 *
 * Copyright Gray Young
 * Released under the MIT license.
 * http://jquery.org/license
 *
 */

//>>label: Elements
//>>group: Widgets
// jscs:disable maximumLineLength
//>>description: Displays a status indicator for loading state, standard percentage, and other progress indicators.
// jscs:enable maximumLineLength
//>>docs: https://github.com/GrayYoung/jQuery.UI.Extension/wiki/Customize-UI-of-Form-Eelements
//>>demos: http://grayyoung.github.io/jQuery.UI.Extension/demos/elements
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/elements.scss
//>>css.theme: ../../themes/base/theme.css

(function(factory) {
	if (typeof define === 'function' && define.amd) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery",
			"../version",
			"../widget"
		], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function($) {
	var $document = $(document);

	$document.on('click.ui', ':checkbox, :radio', function(event) {
		var $this = $(this);

		if($.type($this.attr('readonly')) != 'undefined') {
			$this.focus();
			event.preventDefault();

			return false;
		}
	});
	if(/android|ip(hone|od|ad)/i.test(navigator.userAgent)) {
		$(document).on('mousedown.ui keypress.ui', '.ui-select > select', function(event) {
			if($.type($(this).attr('readonly')) != 'undefined') {
				event.preventDefault();
			}
		});

		return;
	}
	$document.on('click.ui', '.ui-select > select', function(event) {
		event.preventDefault();
	}).on('mousedown.ui keypress.ui', '.ui-select > select', function(event) {
		var $this = $(this), $options = $this.children(), $ui = $this.parent('.ui-select');
		var optionsSize = $options.length;

		// Fix the issue that mouse events still happen on IE.
		if($this.prop('disabled') === true) {
			event.preventDefault();

			return false;
		}
		if($.type($this.attr('readonly')) != 'undefined') {
			$this.focus();
			event.preventDefault();

			return false;
		}
		// Avoid when type TAB key then focus on $list.
		if(event.type === 'keypress' && event.key === 'Tab') {
			$this.trigger('close.ui');

			return true;
		}
		// Prevent click event on the primary mouse button has been pressed and on ENTER key.
		// event.button: 0 indicate primary button.
		if((event.type === 'mousedown' && event.button === 0) || (event.type === 'keypress' && event.keyCode === 13)) {
			event.preventDefault();
		} else {
			return true;
		}
		if($ui.hasClass('open') && ((event.type === 'mousedown' && event.buttons === 1) || (event.type === 'keypress' && event.keyCode === 13))) {
			$this.trigger('close.ui');

			return true;
		}
		if(optionsSize > 0 && !$this.data('dropdownMenu')) {
			var $list = $('<ol role="list" />').addClass('dropdown-menu').css({
				visibility : 'hidden'
			});
			var iterations = Math.floor(optionsSize / 8), leftover = optionsSize % 8, i = 0;
			var appendItem = function($option) {
				var $item = $('<li role="option" class="option' + (($option.prop('selected') || $this.prop('selectedIndex') === $option.prop('index')) ? ' active' : '') + '" data-index="' + $option.prop('index') + '" data-value="' + $option.val() + '"/>').append($('<a href="javascript:void(0);" tabindex="-1" role="presentation" />').text($option.text()));

				$item.bind('click.ui', function(event) {
					var $thisOption =  $(this);

					$thisOption.closest('.ui-select').children('select').prop('selectedIndex', $thisOption.data('index')).focus().change();
				});
				$list.append($item);
			};

			if (leftover > 0){
				do {
					appendItem($options.eq(i++));
				} while (--leftover > 0);
			}
			do {
				appendItem($options.eq(i++));
				appendItem($options.eq(i++));
				appendItem($options.eq(i++));
				appendItem($options.eq(i++));
				appendItem($options.eq(i++));
				appendItem($options.eq(i++));
				appendItem($options.eq(i++));
				appendItem($options.eq(i++));
			} while (--iterations > 0);

			$this.data({
				dropdownMenu : $list
			});
			$ui.addClass('open');
			$ui.append($list);
			if(($list.height() + $list.offset().top > $(document).scrollTop() + $(window).height()) && $(document).scrollTop() <= $ui.offset().top - $list.height()) {
				$list.addClass('top');
			}
			$list.bind('mousedown.ui', function() {
				// Have to make focusable parent elements be unfocusable, so the select element could keep focus status and $list can be drag it's scrollbar.
				$(this).parents('[tabindex]').each(function() {
					var $ti = $(this);

					$ti.attr('data-tabindex', $ti.attr('tabindex')).removeAttr('tabindex');
				});
			}).bind('mouseup.ui', function() {
				$(this).parents('[data-tabindex]:not([tabindex])').each(function(index) {
					var $ti = $(this);

					$ti.attr('tabindex', $ti.data('tabindex'));
				});
			}).css('visibility', '');
		}
		$this.trigger('keyup.ui').focus();
	}).on('keyup.ui', '.ui-select > select', function(event) {
		var $this = $(this), $current;

		if(event.keyCode !== 17 && event.keyCode !== 67 && $this.data('dropdownMenu')) {
			$current = $this.data('dropdownMenu').children().eq($this.prop('selectedIndex'));

			$current.addClass('active').siblings('.active').removeClass('active');
			$this.data('dropdownMenu').scrollTop($current.outerHeight(true) * ($this.prop('selectedIndex') + 1) - $this.data('dropdownMenu').height());
		}
	}).on('blur.ui', '.ui-select > select', function(event) {
		$(this).trigger('close.ui');
	}).on('close.ui', '.ui-select > select', function(event) {
		var $this = $(this);

		if($this.data('dropdownMenu')) {
			$this.data('dropdownMenu').fadeOut(200, function() {
				$(this).remove();
				$this.data('dropdownMenu', null).parent('.ui-select.open').removeClass('open');
			});
		}
	});
}));