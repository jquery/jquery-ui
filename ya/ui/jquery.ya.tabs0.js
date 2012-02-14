/**
 * @author 13
 */
(function($){
	var Base=$.ui.tabs;
	$.widget('ya.tabs0',Base,{
		options: {
			closable:false
		},
		_create:function(){
			var self=this;
			var element=self.element,
				options=this.options;
			if(options.closable){
				options.tabTemplate='<li><a href="#{href}">#{label}</a><span class="ui-icon ui-icon-close">Remove Tab</span>';
				element.on('click','.ui-icon-close',function(){
					var thisJq=$(this);
					var headerListJq=self.lis,
						curHeaderJq=thisJq.parent();
					var index = headerListJq.index(curHeaderJq);
					self.remove(index);
				});
			}
			Base.prototype._create.call(this);
		}
		
	});
}(jQuery));
