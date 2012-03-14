/**
 * @author 13
 */
(function($,root){
	var yawrap=root.yawrap,
		sl=yawrap.sl,
		regx=yawrap.regx,
		uihelper=yawrap.uihelper,
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
							
			//区分全局遮罩和局部遮罩
			if(element.get(0)===window||element.get(0)===document||element.is('body')){
				self.element=$(window);
				overlayJq=$('<div class="ui-overlay ui-overlay-global '+options.cls+'"></div>').css(options.styles||{}).hide().appendTo('body');
				self.type="screen";
			}else{
				overlayJq=$('<div class="ui-overlay ui-overlay-part '+options.cls+'"></div>').css(options.styles||{}).hide().appendTo(element);
				self.type="part";
			}
			overlayJq.bgiframe();	//ie6 select遮不住fixed
			self.overlayJq=overlayJq;
			
			self.updateOverlay(false);
			
			self._action();
			
			//控件高级主题渲染
			if(advancedTheme){
				for(var n in advancedTheme){
					if(advancedTheme[n]){
						uihelper.advancedThemeH(self,n,self.overlayJq);
					}		
				}
			}
			
		},
		updateOverlay:function(callShowFn){
			var self=this,
				element=self.element,
				overlayJq=self.overlayJq;
			var boxSize={
				width:element.width(),
				height:element.height()
			},offsetSize=element.offset();
			if(!offsetSize){
				offsetSize={
					top:0,
					left:0
				};
			}
			overlayJq.css({
				width:boxSize.width,
				height:boxSize.height,
				top:offsetSize.top,
				left:offsetSize.left
			});
			!!callShowFn&&self.show();	//update后立即显示
		},
		_action:function(){
			var self=this,
				element=self.element,
				overlayJq=self.overlayJq,
				winJq=$(window);
			if(self.type=="screen"){
				//var posSize=overlayJq.position(),
				var resizeTid;
				if($.browser.msie&&$.browser.version<=6){
					overlayJq.css({
						"position":"absolute"
					});
					winJq.scroll(function(){
						var winJq=$(this);
						overlayJq.css({
							top:winJq.scrollTop(),
							left:winJq.scrollLeft()
						});
					}).scroll();
				}else{
					overlayJq.css({
						"position":"fixed"
					});
				}
				winJq.resize(function(){
					var winJq=$(this);
					clearTimeout(resizeTid);
					resizeTid=setTimeout(function(){		
						self.updateOverlay(false);
						if($.browser.msie&&$.browser.version<=6){
							winJq.scroll();
						}
					},80);
				});
			}
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
	//loadding global overlay
	var winJq;
	$(function($){
		winJq=$(window).overlay0();
		var overlayJq=winJq.data('overlay0').overlayJq;
		$('<div class="loading"></div>').appendTo(overlayJq);
		overlayJq.addClass('ui-overlay-loading');
	});
	_.extend($.ya,{
		showLoading:function(){
			winJq.overlay0('show');
		},
		hideLoading:function(){
			winJq.overlay0('hide');
		}
	});
}(jQuery,this));