/**
 * @author 13
 */
(function($,root){
	var ya=root.ya,
		sl=ya.sl,
		uihelper=ya.uihelper,
		Solution=sl.Solution;
	var Base=$.ui.tabs;
	$.widget('ya.tabs0',Base,{
		options: {
			closable:false,
			advancedTheme:{	//设置widget的高级主题效果
				shadow:true,	//设置背景阴影，默认存在
				corner:true
			}
		},
		_create:function(){
			var self=this;
			var element=self.element,
				options=self.options,
				advancedTheme=options.advancedTheme;
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
			Base.prototype._create.call(self);
			var listJq=self.list;
			if(options.closable){
				listJq.addClass('ui-tabs-nav-closable');
			}
			if(advancedTheme){
				for(var n in advancedTheme){
					if(advancedTheme[n]){
						uihelper.advancedThemeH(self,n,self.element);
					}		
				}
			}
			//nav item顶部圆角
			uihelper.advancedThemeH(self,'corner',self.lis);
		}
		
	});
}(jQuery,this));
