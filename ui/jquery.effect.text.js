var defaultOptions	= {
	easing: 'linear',
	words: false,
	text: '',
	reverse: false,
	random: false,
	start: $.noop,
	finished: $.noop
};
	

$.effects.blockFadeOut	= function (o) {
	
	function finished ($set) {
		$(this).empty ();
	}
	
	var options = o.options	= $.extend ({},
			defaultOptions,
			o.options,
			{
				finished: finished,
				animate: function (interval, duration, delay) {
					this.delay (delay).animate ({opacity: 0}, 0, options.easing);
				}
			}
	);
	
	$.effects.textAnim.call (this, o);
}


$.effects.blockFadeIn	= function (o) {
	
	var options = o.options	= $.extend ({},
			defaultOptions,
			o.options,
			{
				animate: function (interval, duration, delay) {
					this.css ('opacity', 0);
					this.delay (delay).animate ({opacity: 1}, duration, options.easing);
				}
			}
	);
	
	$.effects.textAnim.call (this, o);
}

$.effects.textAnim	= function (o) {

	var options	= o.options;
	return this.queue (
		function () {

			var replaceWith, tagReg, reg, html, i, $set, set, wordCount, duration, interval;
			var $this	= $(this);
			/* No height etc. */
			$this.width ($this.width ());
			$this.height ($this.height ());

			// The following regular expression courtesy of Phil Haack
	 		// http://haacked.com/archive/2004/10/25/usingregularexpressionstomatchhtml.aspx
			tagReg = /(<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>)/g;
			
			// Translation: /(HTML tag plus spaces)|(word/letter without '<' plus spaces)/g
			if (options.words) {
				reg = /(<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>)\s*|([^\s<]+\s*)/g;
			}else{
				reg = /(<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>)\s*|([^\s<]\s*)/g;
			}
			
			/* Make sure the correct html is in place */
			if (options.text !== '') {
				$this.html (options.text);
			}
			
			/* Set the current text to use */
			options.text	= $this.html ();
			
			/* Get the words */
			words	= options.text.match (reg);
			
			/* Array for HTML, will join later */
			html	= [];
			
			/* Loop over the words and seperate them (put 'em in a span) */
			for (i = 0, l = words.length; i < l; i++) {
				var word	= words[i];
				
				if (!word.match (tagReg)) {
					html.push ('<span>' + word + '</span>');
				} else {
					console.log (word);
					html.push (word);
				}
			}
			
			
			/* See how many words there are */
			wordCount	= html.length;

			/* No words? halt */
			if (!wordCount) {
				return;
			}

			/* Put the newer correct html in place */
			$this.html (html.join (''));

			/* Retreive the total set of elements */
			$set	= $this.find ('span:not(:has(span))')
			set		= $set.get ();
			
			/* Calculate the duration and interval points */
			interval = (o.duration / (1.5 * wordCount));
			duration = (o.duration - wordCount * interval);
			
			/* If the cycle needs to reverse, reverse it all */
			if (options.reverse) {
				set.reverse ();
			}
			i			= 0;
			
			/* Iterate over all the elements run their animation function on it */
			for (i = 0, l = set.length; i < l; i++) {
				var $word	= $(set[i]),
					delay	= interval * i;
				
				/* Randomize if necessary */
				if (options.random !== false) {
					
					var randomDelay = Math.random() * wordCount * interval,
					// If interval or random is negative, start from the bottom instead of top
					uniformDelay = options.reverse ?
						((wordCount - i) * interval) : (i * interval);
					
					delay = randomDelay * options.random + Math.max(1 - options.random, 0) * uniformDelay;
				}
				
				options.animate.call ($word, interval, duration, delay);
			}
			
			setTimeout (
				function () {
					$.type (options.finished) === 'function' && options.finished.call ($this[0], $set);
					$.type (o.callback) === 'function' && o.callback.call ($this[0]);

			
					$this.dequeue ();
				}, o.duration
			);
			
		}
	);
};