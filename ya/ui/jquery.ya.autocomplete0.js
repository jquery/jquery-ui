/**
 * @author 13
 */
(function($){
	var Base=$.ui.autocomplete;
	$.widget('ya.autocomplete0',Base,{
		options:{
			"displayField":"value"	//默认在输入框中显示的field(label或value)
		},
		_create:function(){
			var self=this,
				doc = self.element[ 0 ].ownerDocument;
			Base.prototype._create.call(self);
			self.element.bind("input.autocomplete", function() {
				// 修复在Firefox中不支持中文的BUG
			    $(this).trigger('keydown.autocomplete'); 
			});
			self.menu.element.menu('option',{
				focus: function( event, ui ) {
					var item = ui.item.data( "item.autocomplete" );
					var options=self.options;
					if ( false !== self._trigger( "focus", event, { item: item } ) ) {
						// use value to match what will end up in the input, if it was a key event
						if ( /^key/.test(event.originalEvent.type) ) {
							self.element.val( item[options.displayField]||item.value );
						}
					}
				},
				selected: function( event, ui ) {
					var item = ui.item.data( "item.autocomplete" ),
						previous = self.previous;
					var options=self.options;

					// only trigger when focus was lost (click on menu)
					if ( self.element[0] !== doc.activeElement ) {
						self.element.focus();
						self.previous = previous;
						// #6109 - IE triggers two focus events and the second
						// is asynchronous, so we need to reset the previous
						// term synchronously and asynchronously :-(
						setTimeout(function() {
							self.previous = previous;
							self.selectedItem = item;
						}, 1);
					}

					if ( false !== self._trigger( "select", event, { item: item } ) ) {
						self.element.val( item[options.displayField]||item.value );
					}
					// reset the term after the select event
					// this allows custom select handling to work properly
					self.term = self.element.val();

					self.close( event );
					self.selectedItem = item;
				},
				blur: function( event, ui ) {
					// don't set the value of the text field if it's already correct
					// this prevents moving the cursor unnecessarily
					if ( self.menu.element.is(":visible") &&
						( self.element.val() !== self.term ) ) {
						self.element.val( self.term );
					}
				}
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