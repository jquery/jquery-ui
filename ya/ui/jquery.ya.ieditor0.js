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
			editType:null,   //textfield,textarea,combo,datepicker,checkbox
			themeType:0,	//编辑器显示方式 0-不带操作按钮；1-带操作按钮
			buttonHandler:{  //针对themeType==1的按钮调用句柄配置
			    saveHandler:null,    //点击成功按钮的调用句柄
			    cancelHandler:null   //点击取消按钮的调用句柄
			},
			selectValues:null,    //for combobox,提供可选值
			dateFormat:'mm/dd/yy'    //for datepicker
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
				buttonHandler=options.buttonHandler,
				editJq=self.editJq,
				editInputJq=$('.ui-ieditor-input',editJq);
			if(options.themeType==1){
				//设置操作按钮
				var actionJq=$('<span class="ui-ieditor-actions"></span>').appendTo(editJq);
				$('<button class="ui-button-submit">保存</button>').click(function(){
					if(buttonHandler.saveHandler){ //如果有自定义save调用句柄
					    buttonHandler.saveHandler.apply(element,[element,editJq]);
					    return false;
					}
					if(!_.isUndefined(editInputJq.data('label'))){
                        element.text(editInputJq.data('label'));
                        element.data('value',editInputJq.val());
                    }else{
                        element.text(editInputJq.val());
                    }
                    element.show();
					editJq.hide();
					//显示handlerSelector
                    if(options.handlerSelector){
                        $(options.handlerSelector).show();
                    }
					return false;
				}).button0({
				    cls:"ui-button-submit"
				}).appendTo(actionJq);
				
				$('<button>取消</button>').click(function(){
					var originVal=editInputJq.data('originval'),
					   originLabel=editInputJq.data('originlabel');
					if(buttonHandler.cancelHandler){ //如果有自定义cancel调用句柄
                        buttonHandler.cancelHandler.apply(element,[element,editJq]);
                        return false;
                    }
					if(!_.isUndefined(originLabel)){
                        element.text(originLabel);
                        element.data('value',originVal);
                    }else{
                        element.text(originVal);
                    }
                    element.show();
					//element.text(originVal).show();
					editJq.hide();
					//显示handlerSelector
                    if(options.handlerSelector){
                        $(options.handlerSelector).show();
                    }
					return false;
				}).button0({
				    cls:"ui-button-cancel"
				}).appendTo(actionJq);
			}
			//绑定事件
			$(document).click(function(e){
			    if(!element.hasClass('ui-state-disabled')){  //如果element可用
    				if(e.target===element.get(0)||e.target===$(options.handlerSelector).get(0)||editInputJq.parent('.ui-ieditor').find(e.target).length!=0){ //如果点击dom是element 或 handler 或 编辑器本身
    					element.hide();
    					self.show();
    					if(e.target!==editInputJq.get(0)){
    						try{
    						    editInputJq.get(0).select();
    						}catch(e){}
    					}
    					//隐藏handlerSelector
    					if(options.handlerSelector){
    						$(options.handlerSelector).hide();
    					}
    				}else{
    					if(options.themeType==0){
    						//element.text(editInputJq.val()).show();
    						if(!_.isUndefined(editInputJq.data('label'))){
    						    element.text(editInputJq.data('label'));
    						    element.data('value',editInputJq.val());
    						}else{
    						    element.text(editInputJq.val());
    						}
    						element.show();
    						editJq.hide();
    						//显示handlerSelector
                            if(options.handlerSelector){
                                $(options.handlerSelector).show();
                            }
    					}
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
				case "combo":
                    self._comboEditor();
                    break;
                case "datepicker":
                    self._dpEditor();
                    break;
                case "singlecheckbox":
                    self._singleCbEditor();
                    break;
				default:
					break;
			}
		},
		_textfieldEditor:function(){
			var self=this,
				element=self.element,
				options=self.options;
			
			var editJq=$('<span class="'+options.cls+' ui-ieditor ui-ieditor-textfield-wrapper ui-widget ui-helper-reset" style="display:none;"></span>');	//编辑控件
			var editInputJq=$('<input class="ui-ieditor-textfield ui-ieditor-input ui-state-default" type="text" name="'+options.name+'" />').val(element.text()).appendTo(editJq);
			editJq.insertAfter(self.element);	
			//设置引用
			self.editJq=editJq;
		},
		_textareaEditor:function(){
			var self=this,
				element=self.element,
				options=self.options;
			
			var editJq=$('<span class="'+options.cls+' ui-ieditor ui-ieditor-textarea-wrapper ui-widget ui-helper-reset" style="display:none;"></span>');	//编辑控件
			var editInputJq=$('<textarea class="ui-ieditor-textarea ui-ieditor-input ui-state-default" name="'+options.name+'" /></textarea>').val(element.text()).appendTo(editJq);
			editJq.insertAfter(self.element);	
			//设置引用
			self.editJq=editJq;
		},
		_comboEditor:function(){
		    var self=this,
                element=self.element,
                options=self.options,
                selectValues=options.selectValues; 
            var htmlArr=[]; 
            var value=element.data('value')||element.attr('val')||element.text(),   //初始值
                label=element.text();   //初始display值

            var editJq=$('<span class="'+options.cls+' ui-ieditor ui-ieditor-combo-wrapper ui-widget ui-helper-reset" style="display:none;"></span>');   //编辑控件
            var editInputJq=$('<select class="ui-ieditor-combo ui-ieditor-input ui-state-default" name="'+options.name+'"></select>').appendTo(editJq);
            if(_.isString(selectValues)){
                selectValues.replace(regx.rword,function(v){
                    htmlArr.push('<option value="'+v+'"'+(v==value?' selected="selected"':'')+'>'+v+'</option>');
                });
            }else if(_.isArray(selectValues)){
                _.each(selectValues,function(v,i){
                    htmlArr[i]='<option value="'+v.value+'"'+(v.value==value?' selected="selected"':'')+'>'+(v.label||v.value)+'</option>';
                });
            }
            editInputJq.html(htmlArr.join(''));
            editJq.insertAfter(self.element);   
            editInputJq.data('label',label);
            //主题化
            if($.ya.theme0){
                editInputJq.theme0({
                    themeType:'combo',
                    select:function(e,data){
                        editInputJq.data('label',data.label);
                    }
                });
            }
            //设置引用
            self.editJq=editJq;
		},
		_dpEditor:function(){
		     var self=this,
                element=self.element,
                options=self.options,
                dateFormat=options.dateFormat;
                
            var editJq=$('<span class="'+options.cls+' ui-ieditor ui-ieditor-datepicker-wrapper ui-widget ui-helper-reset" style="display:none;"></span>');  //编辑控件
            var editInputJq=$('<input class="ui-ieditor-datepicker ui-ieditor-input ui-state-default" type="text" name="'+options.name+'" />').val(element.text()).appendTo(editJq);
            editJq.insertAfter(self.element);
            //设置datepicker
            if($.ya.datepicker0){
                editInputJq.datepicker0({
                    "dateFormat":dateFormat
                });
            }
            //设置引用
            self.editJq=editJq;
		},
		_singleCbEditor:function(){
		     var self=this,
                element=self.element,
                options=self.options,
                selectValues=options.selectValues; 
                
             var value=element.data('value')||element.attr('val')||element.text(),   //初始值
                label=element.text();   //初始display值 
                
            var editJq=$('<span class="'+options.cls+' ui-ieditor ui-ieditor-checkbox-wrapper ui-widget ui-helper-reset" style="display:none;"></span>');  //编辑控件
            var editInputJq=$('<input class="ui-ieditor-checkbox ui-ieditor-input ui-state-default" type="checkbox" name="'+options.name+'" />').val('1').appendTo(editJq);
            
            _.each(selectValues,function(item){
                if(item.label==label&&item.value){
                    editInputJq.attr('checked',true);
                }
            });
            
            editJq.insertAfter(self.element);
            //label控制
            editInputJq.click(function(e){
                var thisJq=$(this),
                    checked=thisJq.attr('checked'),
                    curItem=_.filter(selectValues,function(item){
                        return !!(item.value)==!!checked;
                    })[0];
                thisJq.data('label',curItem.label);
                e.stopPropagation();
            });
            editInputJq.data('label',label);
            //设置引用
            self.editJq=editJq;
		},
		/**
		 * 显示编辑器，特定类型编辑器显示前要进行初始化
		 */
		show:function(){
		    var self=this,
		        element=self.element,
                editJq=self.editJq,
                editType=self.editType,
                editInputJq=$('.ui-ieditor-input',editJq);
                
            var value=element.data('value')||element.attr('val')||element.text();
            switch(editType){
                case "combo":
                    editInputJq.theme0('select',value);
                    break;
                default:
                    editInputJq.val(value).data('originval',value).data('originlabel',editInputJq.data('label'));
                    break;
            }
            editJq.show();
		},
		reset:function(){
		    var self=this,
                options=self.options,
                editJq=self.editJq;
           if(options.themeType==1){
               $('.ui-button-cancel',editJq).click();
           }else{
               $(document).click();
           } 
		}
	});
}(jQuery,this));