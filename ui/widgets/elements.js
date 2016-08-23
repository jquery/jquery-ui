/*!
 * jQuery UI Extendtion - Elements @VERSION
 * https://github.com/GrayYoung/jQuery.UI.Extension
 *
 * Copyright Gray Young
 * Released under the MIT license.
 * http://jquery.org/license
 *
 */

(function(factory) {
	if (typeof define === 'function' && define.amd) {
		define([ 'jquery' ], factory);
	} else {
		factory(jQuery);
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
		var $this = $(this);
		var $ui = $this.parent('.ui-select');

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
		if($this.children().size() > 0 && !$this.data('dropdownMenu')) {
			var $list = $('<ol role="list" />').addClass('dropdown-menu').css({
				visibility : 'hidden'
			});

			$this.data({
				dropdownMenu : $list
			});
			$ui.append($list);
			$this.children().each(function(index) {
				var $option = $(this), $item = $('<li role="option" class="option' + (($option.prop('selected') || $this.prop('selectedIndex') === $option.prop('index')) ? ' active' : '') + '" data-index="' + $option.prop('index') + '" data-value="' + $option.val() + '"/>').append($('<a href="javascript:void(0);" tabindex="-1" role="presentation" />').text($option.text()));

				$item.bind('click.ui', function(event) {
					var $thisOption =  $(this);

					$thisOption.closest('.ui-select').children('select').prop('selectedIndex', $thisOption.data('index')).focus().change();
				});
				$list.append($item);
			});
			$ui.addClass('open');
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