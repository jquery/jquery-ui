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
			triggerType:"click",	//触发事件类型(click/hover)
			themeType:null,	//模拟控件类型
			cls:'',	//主题控件css类名
			width:'auto',
			height:'auto'
		},
		_create:function(){
			var self=this;
			var element=self.element,
				options=self.options,
				advancedTheme=options.advancedTheme;
			
			//设置控件类型
			self._setThemeType();
			//主题化入口
			self._theme();
			//控件高级主题渲染
			if(advancedTheme){
				for(var n in advancedTheme){
					if(advancedTheme[n]){
						uihelper.advancedThemeH(self,n,self.themeJq);
					}		
				}
			}
			
		},
		/**
		 * 设置控件主题类型，顺序为 options.themeType > html自定义属性themetype > tagName
		 */
		_setThemeType:function(){
			var self=this;
			var elementDom=self.element.get(0);
			var options=self.options,
				cusAttr=self.element.attr('themetype'),
				tagName=elementDom.tagName.toLowerCase();
			if(!options.themeType){	//if options.themeType==null
				if(!cusAttr){	//if options.themeType==undefined
					if(tagName=="select"){
						self.themeType="combo";	//select默认为combobox
					}
					if(tagName=="input"){
						if(elementDom.type=="checkbox"){
							self.themeType="checkbox";
						}else if(elementDom.type=="radio"){
							self.themeType="radio";
						}
					}
				}else{
					self.themeType=cusAttr;
				}
			}else{
				self.themeType=options.themeType;
			}
		},
		_theme:function(){
			var self=this,
				themeType=self.themeType;
			switch(themeType){
				case "combo":
					self._comboTheme();
					break;
				case "itemselect":
					self._itemselectTheme();
					break;
				default:
					break;
			}
		},
		_comboTheme:function(){
			var self=this,
				element=self.element,
				options=self.options,
				htmlArr=[];
			var listJq,
				headerJq,
				selectedIndex=0;
			var clickState='hidden';	//hidden or shown
			
			var themeJq=$('<div class="'+options.cls+' ui-combo ui-widget ui-helper-reset"></div>');	//包裹元素
			$('<div class="ui-combo-header"><div class="ui-combo-header-content"></div><span class="ui-icon ui-icon-triangle-1-s"></span></div><ul class="ui-combo-options ui-widget-content ui-helper-reset" style="display:none;"></ul>').appendTo(themeJq);
			//预定义的几个css属性
			cssPropertys.replace(regx.rword,function(cssPropertyName){
				themeJq.css(cssPropertyName,self.element.css(cssPropertyName));
			});
			themeJq.css({
				width:options.width
			}).insertAfter(self.element.hide());
			//设置引用
			self.themeJq=themeJq;
			listJq=$('.ui-combo-options',themeJq);
			headerJq=$('.ui-combo-header-content',themeJq);
			
			$('option',element).each(function(i){
				var thisJq=$(this);
				if(thisJq.attr('selected')){
					selectedIndex=i;
				}
				htmlArr[i]='<li class="ui-combo-option ui-state-default'+(thisJq.attr('selected')?' ui-combo-option-selected':'')+'" val="'+thisJq.val()+'">'+thisJq.text()+'</li>';
			});
			headerJq.text($('option',element).eq(selectedIndex).text());
			listJq.html(htmlArr.join(''));
			//设置初始化被选中的option索引
			self.selectedIndex=selectedIndex;
			
			//绑定事件
			if(options.triggerType=="click"){			
				themeJq.click(function(e){				
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
				themeJq.hover(function(){
					listJq.show();
				},function(){
					listJq.hide();
				});
			}
			themeJq.on('click','.ui-combo-option',function(){
				//选中
				var targetJq=$(this);
				targetJq.addClass('ui-combo-option-selected').siblings().removeClass('ui-combo-option-selected');
				headerJq.text(targetJq.text());
				self.selectedIndex=$('.ui-combo-option',listJq).index(targetJq);
				//设置隐藏控件值
				element.val(targetJq.val());
				$('option',element).eq(self.selectedIndex).attr('selected','selected').siblings().removeAttr('selected');
				//隐藏options
				listJq.hide();
			});
			//option state控制
			$('.ui-combo-option',listJq).hover(function(){
				$(this).addClass('ui-state-hover');
			},function(){
				$(this).removeClass('ui-state-hover');
			});
		},
		_itemselectTheme:function(){
			var self=this,
				element=self.element,
				options=self.options,
				themeJq,
				unselectedJq,
				selectedJq,
				actionJq,
				htmlArr=[];
			themeJq=$('<div class="'+options.cls+' ui-itemselect ui-widget ui-helper-reset"></div>').css({
				width:options.width,
				height:options.height
			});	//包裹元素
			//$('<div class="ui-itemselect-unselected"><ul class="ui-itemselect-options"></ul></div><div class="ui-itemselect-action"><button class="ui-itemselect-selected-handler">&rArr;</button><button class="ui-itemselect-unselected-handler">&lArr;</button></div><div class="ui-itemselect-selected"><ul class="ui-itemselect-options"></ul></div>').appendTo(themeJq);
			$('<ul class="ui-itemselect-options ui-itemselect-unselected"></ul><div class="ui-itemselect-action"><div class="ui-itemselect-handlers"><button class="ui-itemselect-selected-handler">&raquo;</button><button class="ui-itemselect-unselected-handler">&laquo;</button></div></div><ul class="ui-itemselect-selected ui-itemselect-options"></ul>').appendTo(themeJq);
			unselectedJq=$('.ui-itemselect-unselected',themeJq);
			selectedJq=$('.ui-itemselect-selected',themeJq);
			actionJq=$('.ui-itemselect-action',themeJq);
			
			themeJq.insertAfter(element.hide());
			//设置themeJq引用
			self.themeJq=themeJq;
			
			//功能按钮区绝对定位
			var leftSize=(themeJq.width()-actionJq.outerWidth())/2;
			actionJq.css({
				"position":"absolute",
				"top":"0px",
				"left":leftSize
			});
			//选择区与为选择区宽度设置
			unselectedJq.width(leftSize);
			selectedJq.width(leftSize);
			
			//设置select的multiple属性，可多选
			element.attr('multiple','multiple');
			//初始化
			$('option',element).each(function(){
				var thisJq=$(this);
				if(thisJq.attr('selected')){
					$('<li class="ui-itemselect-option ui-state-highlight">'+thisJq.text()+'<div class="ui-itemselect-option-action" style="display:none;"><span class="ui-itemselect-icon-up"></span>&nbsp;&nbsp;<span class="ui-itemselect-icon-down"></span>&nbsp;&nbsp;<span class="ui-itemselect-icon-close"></span></div></li>').data('refoption',thisJq).appendTo(selectedJq);
				}else{
					$('<li class="ui-itemselect-option ui-state-default"'+(thisJq.attr('disabled')?'style="display:none;"':'')+'>'+thisJq.text()+'<div class="ui-itemselect-option-action" style="display:none;"><span class="ui-itemselect-icon-up"></span>&nbsp;&nbsp;<span class="ui-itemselect-icon-down"></span>&nbsp;&nbsp;<span class="ui-itemselect-icon-close"></span></div></li>').data('refoption',thisJq).appendTo(unselectedJq);
				}
			});
			//功能按钮主题化
			$('.ui-itemselect-selected-handler,.ui-itemselect-unselected-handler').button0({
				advancedTheme:{	
					corner:true
				},
				'cls':'ui-button-submit'
			});
			//可拖拽排序
			$('.ui-itemselect-options',themeJq).sortable({
				connectWith: ".ui-itemselect-options",
				update:function(event, ui){
					self._itemselectTheme_sort();
				}
			}).disableSelection();	//使文字不被选中便于拖拽
			//可选中
			$('.ui-itemselect-option',themeJq).click(function(){
				//同一时刻有且只有一个被选中
				$('.ui-itemselect-option',themeJq).removeClass('ui-itemselect-option-selected');
				$(this).addClass('ui-itemselect-option-selected');
			});
			
			//功能按钮事件绑定
			self._itemselectTheme_action();
		},
		_itemselectTheme_sort:function(){
			var self=this,
				element=self.element,
				options=self.options,
				themeJq=self.themeJq,
				unselectedJq=$('.ui-itemselect-unselected',themeJq),
				selectedJq=$('.ui-itemselect-selected',themeJq);
			//清空非disabled状态下的所有option
			//$('option[disabled!="disabled"]',element).remove();
			//先排未选中的再排选中的
			$('.ui-itemselect-option',unselectedJq).each(function(){
				$(this).removeClass('ui-state-highlight').data('refoption').removeAttr('selected').appendTo(element);
				//隐藏option actions,当option从选中区移到非选中区时action icons可能处于显示状态，需要隐藏
				$('.ui-itemselect-option-action',this).hide();
			});
			$('.ui-itemselect-option',selectedJq).each(function(){
				$(this).addClass('ui-state-highlight').data('refoption').attr('selected','selected').appendTo(element);
				//显示option actions
				//$('.ui-itemselect-option-action',this).show();
			});
		},
		_itemselectTheme_action:function(){
			var self=this,
				element=self.element,
				themeJq=self.themeJq,
				selectedJq=$('.ui-itemselect-selected',themeJq),
				unselectedJq=$('.ui-itemselect-unselected',themeJq),
				options=self.options;
			//选择区鼠标划上显示action icons
			/*$('.ui-itemselect-option-action',selectedJq).hover(function(){
				$(this).show();
			},function(){
				$(this).hide();
			});*/
			//鼠标划上option
			$('.ui-itemselect-option',themeJq).hover(function(){
				$(this).addClass('ui-state-hover');
			},function(){
				$(this).removeClass('ui-state-hover');
			});
			selectedJq.on('mouseenter','.ui-itemselect-option',function(){
				$('.ui-itemselect-option-action',this).show();
			}).on('mouseleave','.ui-itemselect-option',function(){
				$('.ui-itemselect-option-action',this).hide();
			});
			$('.ui-itemselect-option-action',themeJq).on('click','span',function(){
				var thisJq=$(this),
					targetJq=thisJq.parent().parent('.ui-itemselect-option');
				if(thisJq.hasClass('ui-itemselect-icon-up')){
					targetJq.insertBefore(targetJq.prev());
				}
				if(thisJq.hasClass('ui-itemselect-icon-down')){
					targetJq.insertAfter(targetJq.next());
				}
				if(thisJq.hasClass('ui-itemselect-icon-close')){	//回到非选择区
					targetJq.appendTo(unselectedJq);
				}
				//重排
				self._itemselectTheme_sort();
				return false;	//阻止回溯
			}).on('mouseenter','span',function(){
				$(this).addClass('ui-state-hover');
			}).on('mouseleave','span',function(){
				$(this).removeClass('ui-state-hover');
			});
			$('.ui-itemselect-handlers',themeJq).on('click','button',function(){
				var thisJq=$(this),
					optionSelectedJq=self._itemselectTheme_getSelect();
				if(thisJq.hasClass('ui-itemselect-selected-handler')){	//移到选择区
					if(optionSelectedJq.parent().hasClass('ui-itemselect-unselected')){	//如果option在非选择区，可以移动
						optionSelectedJq.removeClass('ui-itemselect-option-selected').appendTo(selectedJq);
						//重排
						self._itemselectTheme_sort();
					}
				}
				if(thisJq.hasClass('ui-itemselect-unselected-handler')){	//移到非选择区
					if(optionSelectedJq.parent().hasClass('ui-itemselect-selected')){	//如果option在选择区，可以移动
						optionSelectedJq.removeClass('ui-itemselect-option-selected').appendTo(unselectedJq);
						//重排
						self._itemselectTheme_sort();
					}
				}
				return false;
			});
		},
		_itemselectTheme_getSelect:function(){
			return $('.ui-itemselect-option-selected',this.themeJq);
		},
		disable:function(){
			var self=this,
				themeJq=self.themeJq,
				options=self.options,
				disabledWJq=themeJq.data('disabledWrapper');
			var offsetSize=themeJq.offset();
			if(_.isUndefined(disabledWJq)){
				disabledWJq=$('<div class="ui-state-disabled-wrapper"></div>').css({
					"position":"absolute",
					"top":"0px",
					"left":"0px",
					"display":"none"
				}).appendTo('body');
				themeJq.data('disabledWrapper',disabledWJq);
			}
			disabledWJq.css({
				left:offsetSize.left,
				top:offsetSize.top,
				width:themeJq.outerWidth(),
				height:themeJq.outerHeight(),
				"z-index":10000
			}).addClass('ui-state-disabled').show();
			self._trigger( "disable", null);
		}
		
	});
}(jQuery,this));