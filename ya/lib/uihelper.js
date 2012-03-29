/**
 * helper function接受的第一个参数严格为ui
 * 
 * @author 13
 */
(function($,root){
	var yawrap=root.yawrap,
		sl=yawrap.sl,
		regx=yawrap.regx,
		uihelper=yawrap.uihelper||{},
		Solution=sl.Solution;
	//浏览器特征检测
	(function(){
		/*Modernizr.testStyles(' #modernizr { position: fixed; } ', function(elem, rule){ 
			Modernizr.addTest('posfixed', $(elem).css('position') == 'fixed');
		});*/
	}());
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
				errorMsg=opts.errorMsg[opts.vtypeIndex]||'error';	//验证失败提示信息
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
						validMsgJq=elJq.data('validmsg'),
						validMsgContentJq;
					v=$.trim(v);	//v trim过滤
					if(!validMsgJq){
						validMsgJq=$('<div class="ui-form-field-message"></div>').insertAfter(elJq);
						validMsgContentJq=$('<span class="message-content"></span>').appendTo(validMsgJq);
						elJq.data('validmsg',validMsgJq);
						//关闭按钮
						$('<span class="ui-form-field-message-close">&#10005</span>').click(function(){
						    $(this).closest('.ui-form-field-message').hide();
						    return false;
						}).appendTo(validMsgJq);
					}
					validMsgJq.removeClass('ui-state-error');
					validMsgContentJq.empty();
					validV=validateFn.apply(ui,[v,opts]);
					if(!validV&&errorMsg){ //如果未通过验证并且有错误信息
						validMsgJq.addClass('ui-state-error');
						validMsgContentJq.html(errorMsg);
					}
					return validV;
				};
			}
			return false;
		}
	});
	
	yawrap.uihelper=uihelper;
}(jQuery,this));