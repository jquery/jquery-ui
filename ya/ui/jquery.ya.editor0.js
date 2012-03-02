/**
 * 即时编辑器
 * 
 * @author 13
 */
(function($,root){
	var ya=root.ya,
		sl=ya.sl,
		regx=ya.regx,
		uihelper=ya.uihelper,
		Solution=sl.Solution;
	
	$.widget('ya.editor0',{
		options: {
			advancedTheme:{	//设置widget的高级主题效果
				shadow:false,	//设置背景阴影，默认存在
				corner:false
			},
			name:'',
			cls:'',	//编辑器css类名
			handlerSelector:null,
			editType:null
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
			
			var editJq=$('<span class="'+options.cls+' ui-editor ui-editor-textfield ui-widget ui-helper-reset" style="display:none;"></span>');	//编辑控件
			var editInputJq=$('<input class="ui-textfield ui-state-default" type="text" name="'+options.name+'" />').val(element.text()).appendTo(editJq);
			editJq.insertAfter(self.element);
			//绑定事件
			$(document).click(function(e){
				if(e.target===element.get(0)||e.target===$(options.handlerSelector).get(0)||e.target===editInputJq.get(0)){
					element.hide();
					editInputJq.val(element.text());
					editJq.show();
					if(e.target!==editInputJq.get(0)){
						editInputJq.get(0).select();
					}
				}else{
					element.text(editInputJq.val()).show();
					editJq.hide();
				}
			});		
			//设置引用
			self.editJq=editJq;
		},
		_textareaEditor:function(){
			var self=this,
				element=self.element,
				options=self.options;
			
			var editJq=$('<span class="'+options.cls+' ui-editor ui-editor-textarea ui-widget ui-helper-reset" style="display:none;"></span>');	//编辑控件
			var editInputJq=$('<textarea class="ui-textarea ui-state-default" name="'+options.name+'" /></textarea>').val(element.text()).appendTo(editJq);
			editJq.insertAfter(self.element);
			//绑定事件
			$(document).click(function(e){
				if(e.target===element.get(0)||e.target===$(options.handlerSelector).get(0)||e.target===editInputJq.get(0)){
					element.hide();
					editInputJq.val(element.text());
					editJq.show();
					if(e.target!==editInputJq.get(0)){
						editInputJq.get(0).select();
					}
				}else{
					element.text(editInputJq.val()).show();
					editJq.hide();
				}
			});		
			//设置引用
			self.editJq=editJq;
		}
	});
}(jQuery,this));