/**
 * 模拟html控件(select/checkbox/radio)
 * @author 13
 */
(function($,root){
	var ya=root.ya,
		sl=ya.sl,
		regx=ya.regx,
		uihelper=ya.uihelper,
		Solution=sl.Solution;
		
	//var cssPropertys='width height float position top left';
	var cssPropertys='';
	
	$.widget('ya.theme0',{
		options: {
			advancedTheme:{	//设置widget的高级主题效果
				shadow:false,	//设置背景阴影，默认存在
				corner:false
			},
			triggerType:"click"	//触发事件类型(click/hover)
		},
		_create:function(){
			var self=this;
			var element=self.element,
				options=self.options,
				advancedTheme=options.advancedTheme;
			
			if(advancedTheme){
				for(var n in advancedTheme){
					if(advancedTheme[n]){
						uihelper.advancedThemeH(self,n,self.element);
					}		
				}
			}
			//设置控件类型
			self._setHtmlType();
			//主题化入口
			self._theme();
			
		},
		_setHtmlType:function(){
			var self=this;
			var elementDom=self.element.get(0);
			var tagName=elementDom.tagName.toLowerCase();
			if(tagName=="select"){
				self.htmlType="select";
			}
			if(tagName=="input"){
				if(elementDom.type=="checkbox"){
					self.htmlType="checkbox";
				}else if(elementDom.type=="radio"){
					self.htmlType="radio";
				}
			}
		},
		_theme:function(){
			var self=this,
				htmlType=self.htmlType;
			switch(htmlType){
				case "select":
					self._selectTheme();
					break;
				default:
					break;
			}
		},
		_selectTheme:function(){
			var self=this,
				element=self.element,
				options=self.options,
				htmlArr=[];
			var listJq,
				headerJq,
				selectedIndex=0;
			var clickState='hidden';	//hidden or shown
			
			var wrapperJq=$('<div class="ui-select ui-widget ui-helper-reset"></div>');
			$('<div class="ui-select-header"><div class="ui-select-header-content"></div><span class="ui-icon ui-icon-triangle-1-s"></span></div><ul class="ui-select-options ui-widget-content ui-helper-reset" style="display:none;"></ul>').appendTo(wrapperJq);
			//预定义的几个css属性
			cssPropertys.replace(regx.rword,function(cssPropertyName){
				wrapperJq.css(cssPropertyName,self.element.css(cssPropertyName));
			});
			wrapperJq.insertAfter(self.element.hide());
			//设置引用
			self.wrapperJq=wrapperJq;
			listJq=$('.ui-select-options',wrapperJq);
			headerJq=$('.ui-select-header-content',wrapperJq);
			
			$('option',element).each(function(i){
				var thisJq=$(this);
				if(thisJq.attr('selected')){
					selectedIndex=i;
				}
				htmlArr[i]='<li class="ui-select-option ui-state-default'+(thisJq.attr('selected')?' ui-select-option-selected':'')+'" val="'+thisJq.val()+'">'+thisJq.text()+'</li>';
			});
			headerJq.text($('option',element).eq(selectedIndex).text());
			listJq.html(htmlArr.join(''));
			//设置初始化被选中的option索引
			self.selectedIndex=selectedIndex;
			
			//绑定事件
			if(options.triggerType=="click"){			
				wrapperJq.click(function(e){				
					//控制显示
					if(clickState=="hidden"){
						listJq.show();
						clickState="shown";
					}else if(clickState=="shown"){
						listJq.hide();
						clickState="hidden";
					}
				});
			}else if(options.triggerType=="hover"){
				wrapperJq.hover(function(){
					listJq.show();
				},function(){
					listJq.hide();
				});
			}
			wrapperJq.on('click','.ui-select-option',function(){
				//选中
				var targetJq=$(this);
				targetJq.addClass('ui-select-option-selected').siblings().removeClass('ui-select-option-selected');
				headerJq.text(targetJq.text());
				self.selectedIndex=$('.ui-select-option',listJq).index(targetJq);
				//设置隐藏控件值
				element.val(targetJq.val());
				$('option',element).eq(self.selectedIndex).attr('selected','selected').siblings().removeAttr('selected');
				//隐藏options
				listJq.hide();
			});
			//option state控制
			$('.ui-select-option',listJq).hover(function(){
				$(this).addClass('ui-state-hover');
			},function(){
				$(this).removeClass('ui-state-hover');
			});
		},
		disable:function(){
			var self=this,
				wrapperJq=self.wrapperJq,
				options=self.options,
				disabledWJq=wrapperJq.data('disabledWrapper');
			var offsetSize=wrapperJq.offset();
			if(_.isUndefined(disabledWJq)){
				disabledWJq=$('<div class="ui-state-disabled-wrapper"></div>').css({
					"position":"absolute",
					"top":"0px",
					"left":"0px",
					"display":"none"
				}).appendTo('body');
				wrapperJq.data('disabledWrapper',disabledWJq);
			}
			disabledWJq.css({
				left:offsetSize.left,
				top:offsetSize.top,
				width:wrapperJq.outerWidth(),
				height:wrapperJq.outerHeight(),
				"z-index":10000
			}).addClass('ui-state-disabled').show();
		}
		
	});
}(jQuery,this));