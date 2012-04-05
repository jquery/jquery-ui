/**
 * @author 13
 */
(function($,root){
	var yawrap=root.yawrap,
		sl=yawrap.sl,
		regx=yawrap.regx,
		uihelper=yawrap.uihelper,
		Solution=sl.Solution;
	var Base=$.ui.button;
	$.widget('ya.button0',Base,{
		options: {
			advancedTheme:{	//设置widget的高级主题效果
				shadow:false,	//设置背景阴影，默认存在
				corner:false
			},
			cls:null
		},
		_create:function(){
			var self=this,
				options=self.options,
				cls=options.cls,
				advancedTheme=options.advancedTheme;
			Base.prototype._create.call(this);
			
			//为buttonElement提供特殊的class
			var textCls="";
			if(cls){	
				cls.replace(regx.rword,function(v){
					textCls+=v+"-text ";
				});
			}
			self.buttonElement.addClass(cls);
			$('.ui-button-text',self.buttonElement).addClass(textCls);
			if(advancedTheme){
				for(var n in advancedTheme){
					if(advancedTheme[n]){
						uihelper.advancedThemeH(self,n,$('.ui-button-text',self.buttonElement));
					}		
				}
			}
		}
		
	});
}(jQuery,this));