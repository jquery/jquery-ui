/**
 * @author 13
 */
(function($,root){
	var yawrap=root.yawrap,
		sl=yawrap.sl,
		regx=yawrap.regx,
		uihelper=yawrap.uihelper,
		Solution=sl.Solution;
		
	$.widget('ya.form0',{
		options: {
			advancedTheme:{	//设置widget的高级主题效果
				shadow:false,	//设置背景阴影，默认存在
				corner:false
			},
			//ajaxOptions:null,	//ajax请求参数，如果为null则进行一般的form请求，默认为null
			/**
			 * items=[{
			 * 	"selector":{selector},	//jquery选择符
			 * 	"name":{String},	//提交给后台的变量名
			 * 	"vtype":{mix},	//验证类型
			 * 	"errorMsg":{String},	//验证失败提示信息
			 *  "errorTpl":{String}, //错误提示信息模板
			 *  "defaultValue":{String|Array},	//默认值
			 * 	"handler":{Function}	//点击后触发
			 * }]
			 */
			items:[]
		},
		_create:function(){
			var self=this;
			var element=self.element,
				options=self.options,
				advancedTheme=options.advancedTheme;
			//设置items
			
			self._items();
			self._actions();
			
			//控件高级主题渲染
			if(advancedTheme){
				for(var n in advancedTheme){
					if(advancedTheme[n]){
						uihelper.advancedThemeH(self,n,self.element);
					}		
				}
			}
			
		},
		_items:function(){
			var self=this;
			var element=self.element,
				options=self.options,
				i,
				itemConfig;
			var items=[];
			for(i=0;itemConfig=options.items[i++];){
				/*items[i-1]=_.extend({
					"element":$(item.selector,element),
					"errorTpl":'<span class="ui-icon-error"></span><div class="message-content">${content}</div><div class="pointy-tip-shadow"></div><div class="pointy-tip"></div>'
				},item);
				if(items[i-1].vtype){
					items[i-1].vtype=[].concat(item.vtype);
				}
				if(items[i-1].errorMsg){
					items[i-1].errorMsg=[].concat(item.errorMsg);
				}*/
				items[i-1]=self._initItem(itemConfig);
			}
			self.items=items;
		},
		_initItem:function(itemConfig){
		    var self=this,
		        element=self.element;
		    var item=_.extend({
                //"element":$(itemConfig.selector,element), //修改为即时验证，不对item进行缓存
                "errorTpl":'<span class="ui-icon-error"></span><div class="message-content">${content}</div><div class="pointy-tip-shadow"></div><div class="pointy-tip"></div>'
            },itemConfig);
            if(item.vtype){
                item.vtype=[].concat(item.vtype);
            }
            if(item.errorMsg){
                item.errorMsg=[].concat(item.errorMsg);
            }
            return item;
		},
		_actions:function(){
			var self=this,
				element=self.element,
				options=self.options;
			//handler句柄绑定
			element.on('click',function(e){
				var targetJq=$(e.target),
					item=self.getItem(targetJq);
				if(item&&item.handler){
					item.handler.call($(item.selector,element),e);
				}
			});
		},
		/**
		 * 可定义多个vtype，对应相应个数的errorMsg
		 */
		vField:function(selector){
			var self=this,
				item=self.getItem(selector),
				vtype=item.vtype;
				vtypeFn=[],
				passed=true;
			_.each(vtype,function(everyVtype,i){
				vtypeFn[i]=uihelper.vtype(self,everyVtype,$.extend({
					vtypeIndex:i
				},item));
			});
			//开始逐个vtype验证
			if(vtypeFn.length>0){
				_.any(vtypeFn,function(fn){
					passed=fn.call(self);
					return !passed;
				});
				return passed;
			}
			return true;
		},
		vForm:function(){
			var self=this,
				noError=true,
				items=self.items;
			_.each(items,function(item){
				if(item.vtype){
					var validV=self.vField(item.selector);
					if(validV===false&&noError){
						noError=false;
						try{
						    $(item.selector,element).get(0).select(); //试着将焦点定位到第一个出错地
						}catch(e){}
						
					}
				}
			});
			return noError;
		},
		getValues:function(){
			var self=this,
				element=self.element,
				items=self.items;
			var values={};
			_.each(items,function(v){
				var itemJq=$(v.selector,element),
				    name=v.name||itemJq.attr('name');
				values[name]=[];
				if(itemJq.is(':text,textarea')){	    
				    itemJq.each(function(){
				        values[name].push($(this).val());
				    });
				}else if(itemJq.is(':radio,:checkbox')){
					itemJq.each(function(){
						var thisJq=$(this);
						if(thisJq.attr('checked')){
							values[name].push(thisJq.val());
						}
					});
				}else if(itemJq.is('select')){	//select以数组形式提交
					$('option',itemJq).each(function(i){
						var thisJq=$(this);
						if(thisJq.attr('selected')){
							values[name].push(thisJq.val());
						}
					});
				}else{
				    itemJq.each(function(){
				        var thisJq=$(this);
                        //普通dom
                        if(!_.isUndefined(thisJq.data('value'))){
                            values[v.name].push(thisJq.data('value'));
                        }else{
                            values[v.name].push(thisJq.attr('val'));
                        }
                    });
				}
				if(values[name].length==1){
				    values[name]=values[name][0];
				}
			});
			return values;
		},
		reset:function(){
			var self=this,
				element=self.element,
				items=self.items;
			_.each(items,function(v){
				var itemJq=$(v.selector,element),
				    validMsgJq=itemJq.data('validmsg'),
					defaultValue;
				if(_.isString(v.defaultValue)){
					defaultValue=[].concat(v.defaultValue);
					if(itemJq.is(':text')){
						itemJq.val(defaultValue[0]);
					}else if(itemJq.is(':radio,:checkbox')){
						itemJq.each(function(){
							var thisJq=$(this);
							if(_.include(defaultValue,thisJq.val())){
								thisJq.attr('checked',true);
							}
						});
					}else if(itemJq.is('textarea')){
						itemJq.val(defaultValue[0]).text(defaultValue[0]);
					}else if(itemJq.is('select')){
						$('option',itemJq).each(function(i){
							var thisJq=$(this);
							if(_.include(defaultValue,thisJq.val())){
								thisJq.attr('selected',true);
							}
						});
					}else{
						//普通dom
						itemJq.text(defaultValue[0]).data('value',defaultValue[0]);
					}
				}
				//清空error
				itemJq.each(function(){
				    var thisJq=$(this),
				        validMsgJq=thisJq.data('validmsg');
				    if(validMsgJq){
				        validMsgJq.removeClass('ui-state-error').hide();
                        $('.message-content-wrapper',validMsgJq).empty();
				    }
				});
			});
		},
		/**
		 * 不推荐使用，参见addItemVtype
		 */
		addItem:function(itemsConfig){
			var self=this,
				element=self.element,
				items=[];
			items=_.map([].concat(itemsConfig),function(itemConfig){
				if(!self.getItem(itemConfig.selector)){	//去重
					return self._initItem(itemConfig);
				}else{
					return null;
				}
			});
			//筛除所有item为null的配置项
			items=_.filter(items,function(item){
				return item!==null;
			});
			self.items=self.items.concat(items);
		},
		/**
         * 不推荐使用，参见removeItemVtype
         */
		removeItem:function(itemSelector){
		  var self=this,
		      element=self.element,
		      items=self.items;
		  self.items=_.filter(items,function(item){
		    	var itemElJq=$(item.selector,element),  //可能length>1或length==0,如果length==0,表明对应的dom不存在了,于是去掉配置项
		          	matched=itemElJq.length==0||itemElJq.is(itemSelector);
		      if(matched){
		          itemElJq.each(function(){
		              $(this).data('validmsg').remove();
		              $(this).removeClass('ui-form-field-error').removeData('validmsg')
		          });
		      }
		      return !matched;
		  });  
		},
		addItemVtype:function(){
		  this.addItem.apply(this,arguments);
		},
		removeItemVtype:function(){
          this.removeItem.apply(this,arguments);
        },
		/**
		 * 推荐用注册selector筛选效率高
		 */
		getItem:function(selector){
			var self=this,
			     element=self.element,
				items=self.items;
			return _.find(items,function(item){
				if($(item.selector,element).is(selector)){
				    return true; 
				}
			});
		}
		
	});
}(jQuery,this));