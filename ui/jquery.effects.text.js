/*
 * jQuery UI Effects Text @VERSION
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/..
 *
 * Depends:
 *	jquery.effects.text.js
 */
(function( $, undefined ) {

	
	var defaultOptions = {
		easing: 'linear',
		words: true,
		text: '',
		distance: 1,
		// move element to/from where * parent.height ()
		direction: 'top',
		reverse: false,
		random: false
	};
	
	$.effects.textExplode = function (o, show) {
	
		var docHeight = $(document).height(),
			docWidth = $(document).width(); /* show is either 1 or null */
			show = show ? 1 : 0;
	
		/* Internal callback to run before animation has started */
	
		function beforeAnimate() {
	
			/* Set the current position of the element */
			var $this = this.css(this.offset());
	/*
				Have to find out why this happends,
				just doing this.css ('position', 'absolute') doesn't work >:-[
				So we use this work around
			*/
			setTimeout(
	
			function () {
				$this.css('position', 'absolute');
			}, 10);
	
		}
	
		function finished() {
			this.empty();
		}
	
		var options = o.options = $.extend({}, defaultOptions, {
			easing: show ? 'easeInSine' : 'easeInCirc'
		}, o.options, {
			finished: show ? null : finished,
			beforeAnimate: beforeAnimate,
			/* animation function */
			animate: function (interval, duration, i, wordCount, parentCoords) {
	
				/* set some basic stuff */
				var offset = this.offset(),
					offsetTo = {},
					width = this.outerWidth(),
					height = this.outerHeight(),
					properties = {},
					/* max top */
					mTop = docHeight - height,
					/* max left */
					mLeft = docWidth - width,
					distance = options.distance * 2,
					distanceY, distanceX, distanceXY, properties = {
						opacity: show ? 1 : 0
					},
					_duration = duration,
					randomX = 0,
					randomY = 0,
					delay = 10;
	
				/* Hide or show the element according to what we're going to do */
				this.css({
					opacity: show ? 0 : 1
				});
	
	
				if (options.random !== false) {
					var seed = (Math.random() * options.random) + Math.max(1 - options.random, 0);
	
					distance *= seed;
					duration *= seed;
	
					// To syncronize, give each piece an appropriate delay so they end together
					//delay = ((args.unhide && args.sync) || (!args.unhide && !args.sync)) ? (args.duration - duration) : 0;
					randomX = Math.random() - 0.5;
					randomY = Math.random() - 0.5;
				}
	
				distanceY = ((parentCoords.height - height) / 2 - (offset.top - parentCoords.top));
				distanceX = ((parentCoords.width - width) / 2 - (offset.left - parentCoords.left));
				distanceXY = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
	
				offsetTo.top = offset.top - distanceY * distance + distanceXY * randomY;
				offsetTo.left = offset.left - distanceX * distance + distanceXY * randomX;
	
				if (offsetTo.top > (docHeight - height)) {
					offsetTo.top = docHeight - height;
				} else if (offsetTo.top < 0) {
					offsetTo.top = 0;
				}
	
				if (offsetTo.left > (docWidth - width)) {
					offsetTo.left = docWidth - width;
				} else if (offsetTo.left < 0) {
					offsetTo.left = 0;
				}
	
				if (show) {
					this.css(offsetTo);
					properties.top = offset.top;
					properties.left = offset.left;
	
				} else {
					this.css(offset);
					properties.top = offsetTo.top;
					properties.left = offsetTo.left;
				}
	
				/* run it */
				this.delay(delay).animate(properties, duration, options.easing);
	
	
	
			}
		});
	
		/* Pass everything to the general text engine */
		$.effects.textAnim.call(this, o);
	};
	
	$.effects.textConverge = function (o) {
		$.effects.textExplode.call(this, o, 1);
	};
	
	$.effects.backspace = function (o, show) { /* show is either 1 or null */
		show = show || 0;
	
		/* Internal callback to run when animation has finished */
	
		function finished() {
			this.empty();
		}
	
		/* Internal callback to run before animation has started */
	
		function beforeAnimate() {
			this.css('opacity', 0);
		}
	
		var options = o.options = $.extend({}, defaultOptions, {
			easing: 'easeInOutSine'
		}, o.options, {
			words: false,
			wordDelay: 0
		}, {
			finished: show ? null : finished,
			beforeAnimate: show ? beforeAnimate : null,
			animate: function (interval, duration, i, wordCount, parentCoords) {
	
	
				var text = this.text(),
					space = /\s/.test(text),
	
					/* default delay */
					delay = show ? (interval * i) : (wordCount - i - 1) * interval;
	
	/*
						Randomize delay if necessary
						Note, reverse doesn't really matter at this time
					*/
				if (options.random !== false && show) {
					var randomDelay = (Math.random() * text.length * interval) * interval;
	
					/* The higher the random % the slower */
					delay = (randomDelay / (2 - options.random)) + options.wordDelay;
					options.wordDelay = delay;
				}
	
	
				/* run it */
				this.delay(delay).animate({
					opacity: show
				}, 10, options.easing);
			}
		});
	
		/* Pass everything to the general text engine */
		$.effects.textAnim.call(this, o);
	};
	
	
	$.effects.type = function (o) { /* Use the backspace, for redundancy purposes */
		$.effects.backspace.call(this, o, 1);
	};
	
	$.effects.disintegrate = function (o, show) {
	
		var docHeight = $(document).height(),
			docWidth = $(document).width(); /* show is either 1 or null (build or disintegrate) */
		show = show ? 1 : 0;
	
		/* Internal callback to run before animation has started */
	
		function beforeAnimate() {
	
			/* Set the current position of the element */
			var $this = this.css(this.offset());
	/*
				Have to find out why this happends,
				just doing this.css ('position', 'absolute') doesn't work >:-[
				So we use this work around
			*/
			setTimeout(
	
			function () {
				$this.css('position', 'absolute');
			}, 10);
	
		}
	
		function finished() {
			this.empty();
		}
	
		var options = o.options = $.extend({}, defaultOptions, {
			easing: show ? 'easeInSine' : 'easeInCirc'
		}, o.options, {
			finished: show ? null : finished,
			beforeAnimate: beforeAnimate,
			/* animation function */
			animate: function (interval, duration, i, wordCount, parentCoords) {
	
				/* set some basic stuff */
				var offset = this.offset(),
					width = this.outerWidth(),
					height = this.outerHeight(),
					properties = {},
					/* max top */
					mTop = docHeight - height,
					/* max left */
					mLeft = docWidth - width;
	
				/* Hide or show the element according to what we're going to do */
				this.css({
					opacity: show ? 0 : 1
				});
	
				var top, left;
				if (show) { /* we're going to build */
					properties.top = offset.top;
					properties.left = offset.left;
					properties.opacity = 1;
					if (options.direction.indexOf('top') !== -1) {
						top = offset.top - parentCoords.height * options.distance;
	
						this.css('top', top < 0 ? 0 : top); // 1 = o.distance
					} else if (options.direction.indexOf('bottom') !== -1) {
						top = offset.top + parentCoords.height * options.distance;
	
						this.css('top', top > mTop ? mTop : top); // 1 = o.distance
					}
	
					if (options.direction.indexOf('left') !== -1) {
						left = offset.left - parentCoords.width * options.distance;
	
						this.css('left', left < 0 ? 0 : left); // 1 = o.distance
					} else if (options.direction.indexOf('right') !== -1) {
						left = offset.left + parentCoords.width * options.distance;
	
						this.css('left', left > mLeft ? mLeft : left); // 1 = o.distance
					}
	
				} else { /* We're going to disintegrate */
					if (options.direction.indexOf('bottom') !== -1) {
						top = offset.top + parentCoords.height * options.distance;
	
						properties.top = top > mTop ? mTop : top; // 1 = o.distance
					} else if (options.direction.indexOf('top') !== -1) {
						var top = offset.top - parentCoords.height * options.distance
	
						properties.top = top < 0 ? 0 : top; // 1 = o.distance
					}
	
					if (options.direction.indexOf('right') !== -1) {
						left = offset.left + parentCoords.width * options.distance;
	
						properties.left = left > mLeft ? mLeft : left; // 1 = o.distance
					} else if (options.direction.indexOf('left') !== -1) {
						left = offset.left - parentCoords.width * options.distance;
	
						properties.left = left < 0 ? 0 : left; // 1 = o.distance
					}
					properties.opacity = 0;
				}
	
				/* default delay */
				var delay = interval * i;
	
	/*
						Randomize delay if necessary
						Note, reverse doesn't really matter at this time
					*/
				if (options.random !== false) {
	
					var randomDelay = Math.random() * wordCount * interval,
						/* If interval or random is negative, start from the bottom instead of top */
						uniformDelay = options.reverse ? ((wordCount - i) * interval) : (i * interval);
	
					delay = randomDelay * options.random + Math.max(1 - options.random, 0) * uniformDelay;
				}
	
	
				/* run it */
				this.delay(delay + 10 /* fixes stuff in chrome*/ ).animate(properties, duration, options.easing);
			}
		});
	
		/* Pass everything to the general text engine */
		$.effects.textAnim.call(this, o);
	};
	
	$.effects.build = function (o) { /* Use the disintegrate, for redundancy purposes */
		$.effects.disintegrate.call(this, o, 1);
	};
	
	$.effects.blockFadeOut = function (o, show) { /* show is either 1 or null */
		show = show || 0;
	
		/* Internal callback to run when animation has finished */
	
		function finished() {
			this.empty();
		}
	
		/* Internal callback to run before animation has started */
	
		function beforeAnimate() {
			this.css('opacity', 0);
		}
	
	
		var options = o.options = $.extend({}, defaultOptions, {
			easing: 'easeInOutSine'
		}, o.options, { /* only run when we fadeOut */
			finished: !show ? finished : null,
			/* only run when we fadeIn */
			beforeAnimate: show ? beforeAnimate : null,
			/* animation function */
			animate: function (interval, duration, i, wordCount, parentCoords) {
	
				/* default delay */
				var delay = interval * i;
	
	/*
						Randomize delay if necessary
						Note, reverse doesn't really matter at this time
					*/
				if (options.random !== false) {
	
					var randomDelay = Math.random() * wordCount * interval,
						/* If interval or random is negative, start from the bottom instead of top */
						uniformDelay = options.reverse ? ((wordCount - i) * interval) : (i * interval);
	
					delay = randomDelay * options.random + Math.max(1 - options.random, 0) * uniformDelay;
				}
	
				/* run it */
				this.delay(delay).animate({
					opacity: show
				}, duration, options.easing);
			}
		});
	
		/* Pass everything to the general text engine */
		$.effects.textAnim.call(this, o);
	};
	
	
	$.effects.blockFadeIn = function (o) { /* Use the blockFadeOut, for redundancy purposes */
		$.effects.blockFadeOut.call(this, o, 1);
	};
	
	$.effects.textAnim = function (o) {
	
		var options = o.options;
	
		return this.queue(
	
		function () {
	
			var replaceWith, tagReg, reg, html, i, $set, set, wordCount, duration, interval, parentCoords, $this = $(this); /* No height etc. */
			$this.width($this.width());
			$this.height($this.height());
	
	
	/*
					The following regular expression courtesy of Phil Haack
					http://haacked.com/archive/2004/10/25/usingregularexpressionstomatchhtml.aspx
				*/
			tagReg = /(<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>)/g;
	
			/* Translation: /(HTML tag plus spaces)|(word/letter without '<' plus spaces)/g */
			if (options.words) {
				reg = /(<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>)\s*|([^\s<]+\s*)/g;
			} else {
				reg = /(<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>)\s*|([^\s<]\s*)/g;
			}
	
			/* Make sure the correct html is in place */
			if (options.text !== '') {
				$this.html(options.text);
			}
	
			/* Set the current text to use */
			options.text = $this.html();
	
			/* Get the words */
			words = options.text.match(reg);
	
			/* Array for HTML, will join later */
			html = [];
	
			/* Loop over the words and seperate them (put 'em in a span) */
			for (i = 0, l = words.length; i < l; i++) {
				var word = words[i];
	
				if (!word.match(tagReg)) {
					html.push('<span>' + word + '</span>');
				} else {
					html.push(word);
				}
			}
	
	
			/* See how many words there are */
			wordCount = html.length;
	
			/* No words? halt */
			if (!wordCount) {
				return;
			}
	
			/* Put the newer correct html in place */
			$this.html(html.join(''));
	
			/* Retreive the total set of elements */
			$set = $this.find('span:not(:has(span))');
			set = $set.get();
	
			/* Calculate the duration and interval points */
			interval = (o.duration / (1.5 * wordCount));
	
			duration = (o.duration - wordCount * interval);
	
			/* If the cycle needs to reverse, reverse it all */
			if (options.reverse) {
				set.reverse();
			}
	
			/* Width, height, left, top of parent for calculations */
			parentCoords = $.extend($this.offset(), {
				width: $this.width(),
				height: $this.height()
			});
	
			/* Iterate over all the elements run their animation function on it */
			for (i = 0, l = set.length; i < l; i++) {
				var $word = $(set[i]);
	
				/* Do something to the element before the animation starts */
				$.type(options.beforeAnimate) === 'function' && options.beforeAnimate.call($word);
	
	/*
						Call the animation per element
						This way each method can define it's manipulation per element
					*/
				options.animate.call($word, interval, duration, i, wordCount, parentCoords);
			}
	
			setTimeout(
	
			function () { /* internal callback when event has finished, therefor pass object */
				$.type(options.finished) === 'function' && options.finished.call($this);
	
				/* normal object, expecting domElement, so give it */
				$.type(o.callback) === 'function' && o.callback.call($this[0]);
	
				/* dequeue the shizzle */
				$this.dequeue();
			}, o.duration);
	
		});
	};

})(jQuery);
