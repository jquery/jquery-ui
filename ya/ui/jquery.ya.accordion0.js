/**
 * @author 13
 */
(function($,root){
	var ya=root.ya,
		sl=ya.sl,
		uihelper=ya.uihelper,
		Solution=sl.Solution;
	var Base=$.ui.accordion;
	$.widget('ya.accordion0',Base,{
		options: {
			advancedTheme:{	//设置widget的高级主题效果
				shadow:true,	//设置背景阴影，默认存在
				corner:true
			}
		},
		_create:function(){
			var self=this,
				options=self.options,
				advancedTheme=options.advancedTheme;
			Base.prototype._create.call(this);
			
			if(advancedTheme){
				for(var n in advancedTheme){
					if(advancedTheme[n]){
						uihelper.advancedThemeH(self,n,self.element);
					}		
				}
			}
			//去除虚线
			uihelper.removeOutline(self,self.uiAccordion);
		}
		
	});
}(jQuery,this));

