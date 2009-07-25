/*
 * jQuery UI Stackfix @VERSION
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Stackfix
 */

(function($){

// This is only for IE6
$.fn.stackfix = $.browser.msie && /msie 6\.0/i.test(navigator.userAgent) ? function(s) {
	s = $.extend({
		top     : 'auto', // auto == .currentStyle.borderTopWidth
		left    : 'auto', // auto == .currentStyle.borderLeftWidth
		width   : 'auto', // auto == offsetWidth
		height  : 'auto', // auto == offsetHeight
		opacity : true,
		src     : 'javascript:false;'
	}, s || {});
	var prop = function(n){return n&&n.constructor==Number?n+'px':n;},
	    html = '<iframe class="ui-stackfix" frameborder="0" tabindex="-1" src="'+s.src+'" '+
	               'style="display:block;position:absolute;z-index:-1;'+
		               (s.opacity !== false?'filter:Alpha(Opacity=\'0\');':'')+
				       'top:'+(s.top=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\')':prop(s.top))+';'+
				       'left:'+(s.left=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\')':prop(s.left))+';'+
				       'width:'+(s.width=='auto'?'expression(this.parentNode.offsetWidth+\'px\')':prop(s.width))+';'+
				       'height:'+(s.height=='auto'?'expression(this.parentNode.offsetHeight+\'px\')':prop(s.height))+';'+
				'"/>';
	return this.each(function() {
		if ( $('> iframe.ui-stackfix', this).length == 0 )
			this.insertBefore( document.createElement(html), this.firstChild );
	});
} : function() {
	return this;
};

})(jQuery);