/**
 * @author 13
 */
(function($,root){
	var ya=root.ya,
		sl=ya.sl,
		regx=ya.regx,
		uihelper=ya.uihelper,
		Solution=sl.Solution;
		
	$.widget('ya.overlay0',{
		options: {
			advancedTheme:{	//设置widget的高级主题效果
				shadow:false,	//设置背景阴影，默认存在
				corner:false
			},
			cls:'',
			styles:null
		},
		_create:function(){
			var self=this;
			var element=self.element,
				options=self.options,
				advancedTheme=options.advancedTheme;
			//设置overlay
			var overlayJq=$('<div class="ui-overlay '+options.cls+'"></div>').css(options.styles||{}).hide().appendTo(element);
			overlayJq.bgiframe();	//ie6 select遮不住fixed
			self.overlayJq=overlayJq;
			self.updateOverlay(true);
			
			//控件高级主题渲染
			if(advancedTheme){
				for(var n in advancedTheme){
					if(advancedTheme[n]){
						uihelper.advancedThemeH(self,n,self.overlayJq);
					}		
				}
			}
			
		},
		updateOverlay:function(hidden){
			var self=this,
				element=self.element,
				overlayJq=self.overlayJq;
			var boxSize={
				width:element.outerWidth(),
				height:element.outerHeight()
			},offsetSize=element.offset();
			overlayJq.css({
				width:boxSize.width,
				height:boxSize.height,
				top:offsetSize.top,
				left:offsetSize.left
			});
			!hidden&&self.show();	//update后立即显示
		},
		show:function(){
			var self=this,
				element=self.element,
				overlayJq=self.overlayJq;
			overlayJq.show();
			self._trigger('show',null);
		},
		hide:function(){
			var self=this,
				element=self.element,
				overlayJq=self.overlayJq;
			overlayJq.hide();
			self._trigger('hide',null);
		}
	});
}(jQuery,this));