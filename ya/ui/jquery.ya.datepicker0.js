/**
 * @author 13
 */
(function($,root){
	var yawrap=root.yawrap,
		sl=yawrap.sl,
		uihelper=yawrap.uihelper,
		Solution=sl.Solution;
	$.widget('ya.datepicker0',{
		options: {
			advancedTheme:{	//设置widget的高级主题效果
				shadow:false,	//设置背景阴影，默认存在
				corner:false
			}
		},
		_create:function(){
			var self=this,
				options=self.options,
				advancedTheme=options.advancedTheme;
			self.element.datepicker(options);
			if(advancedTheme){
				for(var n in advancedTheme){
					if(advancedTheme[n]){
						uihelper.advancedThemeH(self,n,'#ui-datepicker-div');
					}		
				}
			}
			
		}
		
	});
}(jQuery,this));
