/**
 * 即时编辑器
 * 
 * @author 13
 */
(function($,root){
	var yawrap=root.yawrap,
		sl=yawrap.sl,
		regx=yawrap.regx,
		uihelper=yawrap.uihelper,
		Solution=sl.Solution;
	
	$.widget('ya.ieditor0',{
		options: {
			advancedTheme:{	//设置widget的高级主题效果
				shadow:false,	//设置背景阴影，默认存在
				corner:false
			},
			name:'',
			cls:'',	//编辑器css类名
			handlerSelector:null,
			editType:null,
			themeType:0	//编辑器显示方式 0-不带操作按钮；1-带操作按钮
		},
		_create:function(){
			var self=this;
			var element=self.element,
				options=self.options,
				advancedTheme=options.advancedTheme;
			
			//设置控件类型
			self._setEditType();
			//主题化入口
			self._editor();
			//actions
			self._action();
			//控件高级主题渲染
			if(advancedTheme){
				for(var n in advancedTheme){
					if(advancedTheme[n]){
						uihelper.advancedThemeH(self,n,self.editJq);
					}		
				}
			}
			
		},
		/**
		 * 设置编辑器类型，顺序为 options.editType > html自定义属性editType > tagName
		 */
		_setEditType:function(){
			var self=this;
			var elementDom=self.element.get(0);
			var options=self.options,
				cusAttr=self.element.attr('editType'),
				tagName=elementDom.tagName.toLowerCase();
			if(!options.editType){	//if options.editType==null
				if(cusAttr){	//如果存在dom自定义属性
					self.editType=cusAttr;
				}
			}else{
				self.editType=options.editType;
			}
		},
		_action:function(){
			var self=this,
				element=self.element,
				options=self.options,
				editJq=self.editJq,
				editInputJq=$('.ui-ieditor-input',editJq);
			if(options.themeType==1){
				//设置操作按钮
				var actionJq=$('<span class="ui-ieditor-actions"></span>').appendTo(editJq);
				$('<button>保存</button>').click(function(){
					element.text(editInputJq.val()).show();
					editJq.hide();
				}).button0().appendTo(actionJq);
				
				$('<button>取消</button>').click(function(){
					var originVal=editInputJq.data('originval');
					element.text(originVal).show();
					editJq.hide();
				}).button0().appendTo(actionJq);
			}
			//绑定事件
			$(document).click(function(e){
				if(e.target===element.get(0)||e.target===$(options.handlerSelector).get(0)||e.target===editInputJq.get(0)){
					element.hide();
					editInputJq.val(element.text()).data('originval',element.text());
					editJq.show();
					if(e.target!==editInputJq.get(0)){
						editInputJq.get(0).select();
					}
				}else{
					if(options.themeType==0){
						element.text(editInputJq.val()).show();
						editJq.hide();
					}
				}
			});		
		},
		_editor:function(){
			var self=this,
				editType=self.editType;
			switch(editType){
				case "textfield":
					self._textfieldEditor();
					break;
				case "textarea":
					self._textareaEditor();
					break;
				default:
					break;
			}
		},
		_textfieldEditor:function(){
			var self=this,
				element=self.element,
				options=self.options;
			
			var editJq=$('<span class="'+options.cls+' ui-ieditor ui-ieditor-textfield ui-widget ui-helper-reset" style="display:none;"></span>');	//编辑控件
			var editInputJq=$('<input class="ui-textfield ui-ieditor-input ui-state-default" type="text" name="'+options.name+'" />').val(element.text()).appendTo(editJq);
			editJq.insertAfter(self.element);	
			//设置引用
			self.editJq=editJq;
		},
		_textareaEditor:function(){
			var self=this,
				element=self.element,
				options=self.options;
			
			var editJq=$('<span class="'+options.cls+' ui-ieditor ui-ieditor-textarea ui-widget ui-helper-reset" style="display:none;"></span>');	//编辑控件
			var editInputJq=$('<textarea class="ui-textarea ui-ieditor-input ui-state-default" name="'+options.name+'" /></textarea>').val(element.text()).appendTo(editJq);
			editJq.insertAfter(self.element);	
			//设置引用
			self.editJq=editJq;
		}
	});
}(jQuery,this));