/**
 * helper function接受的第一个参数严格为ui
 * 
 * @author 13
 */
(function($,root){
	var ya=root.ya,
		sl=ya.sl,
		regx=ya.regx,
		uihelper=ya.uihelper||{},
		Solution=sl.Solution;
	_.extend(uihelper,{
		vtypes:{
			"trim":"trim",
			"email":regx.email,
			"mobile":regx.mobile,
			"user":regx.user,
			"pwd":regx.pwd,
			/**
			 * @param {Object} opts 额外配置
			 */
			"confirmpwd":function(v,opts){
				var pwdJq=$(opts.pwdSelector,this.element),
					pwdValue=$.trim(pwdJq.val());
				if(v==pwdValue){
					return true;
				}else{
					return false;
				}
			}
		},
		/**
		 * 添加圆角
		 * @param {Object} ui 
		 * @param {Jq} boxJq 需要圆角效果的box
		 * @return
		 */
		"addCornerH":function(ui,boxJq){
			boxJq.addClass('sl-npx-round-corner');
		},
		"addPieH":function(ui,effectNames,boxJq){
			var effectJq=boxJq.children('.ui-pie-effect'),
				effectArr=effectNames.split(/\s/);
			effectArr=_.map(effectArr,function(effectName){
				return 'ui-pie-'+effectName;
			});
			if(effectJq.length===0){
				boxJq.wrapInner('<div class="ui-pie-effect '+effectArr.join(' ')+'"></div>');
				effectJq=boxJq.children('.ui-pie-effect');
				if(window.PIE){
					PIE.attach(effectJq.get(0));
				}
				boxJq.addClass('ui-widget-pie');			
			}
		},
		advancedThemeH:function(ui,effectNames,boxJq){
			var effectArr=effectNames.split(/\s/);
			_.each(effectArr,function(v){
				new Solution(v,{
					hostSelector:boxJq,
					//slClsName:'ui-widget-shadow'
					slClsName:""
				}).doSolution();
			});
		},
		removeOutline:function(ui,boxJq){
			if($.browser.msie){	//ie
				$('a,button,input[type="button"],input[type="submit"]',boxJq).attr('hidefocus',true);
			}
		},
		/**
		 * 添加和获取vtype
		 */
		vtype:function(ui,vtypeName,opts){
			var vtypes=uihelper.vtypes,
				vtype=vtypes[vtypeName],
				validateFn,
				elJq=opts.element,	//待验证的dom
				errorMsg=opts.errorMsg;	//验证失败提示信息
			if(!!vtype){
				if(_.isFunction(vtype)){
					validateFn=function(v){
						return vtype.apply(this,arguments);
					};
				}else if(_.isRegExp(vtype)){
					validateFn=function(v){
						return vtype.test(v);
					};
				}else if(_.isString(vtype)){
					if(vtype=="trim"){
						validateFn=function(v){
							if(v.length>0){
								return true;
							}else{
								return false;
							}
						};
					}
				}
				return function(v){
					var validV,
						validMsgJq=elJq.data('validmsg');
					v=$.trim(v);	//v trim过滤
					if(!validMsgJq){
						validMsgJq=$('<div class="ui-form-field-message"></div>').insertAfter(elJq);
						elJq.data('validmsg',validMsgJq);
					}
					validMsgJq.removeClass('ui-state-error').empty();
					validV=validateFn.apply(ui,[v,opts]);
					if(!validV&&errorMsg){
						validMsgJq.addClass('ui-state-error').html(errorMsg);
					}
					return validV;
				};
			}
			return false;
		}
	});
	
	ya.uihelper=uihelper;
}(jQuery,this));