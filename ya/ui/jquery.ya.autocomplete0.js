/**
 * @author 13
 */
(function($){
	var Base=$.ui.autocomplete;
	$.widget('ya.autocomplete0',Base,{
		_create:function(){
			var self=this;
			Base.prototype._create.call(this);
			this.element.bind("input.autocomplete", function() {
				// 修复在Firefox中不支持中文的BUG
			    $(this).trigger('keydown.autocomplete'); 
			});
		}
		
	});
	$.extend( $.ui.autocomplete, {
		escapeRegex: function( value ) {
			return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
		},
		filter: function(array, term) {
			var matcher = new RegExp( $.ui.autocomplete.escapeRegex(term), "i" );
			return $.grep( array, function(value) {
				return matcher.test( value.label || value.value || value );
			});
		}
	});
}(jQuery));