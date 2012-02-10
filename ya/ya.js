/**
 * core
 * Depends:
 *   jquery.js
 *   underscore.js
 * 	 underscore.string.js
 */

(function(root){
	var _=root._,
		$=root.jQuery;
	//定义命名空间
	var ya={},
		util={},
		ui={},
		uiHelper={};
	//ui helper
	_.extend(uiHelper,{
		/**
		 * 创建dialog的附加背景层,
		 * class='ui-'+组件名+'-bg'
		 * 
		 * @param uiYa {Object}
		 * @param uiBgCss {Object}
		 */
		createBgH:function(uiYa,uiBgCss){
			var uiName="dialog",
				hostJq=uiYa.hostJq;
			return function(){
				var wrapperJq=hostJq.data('dialog')['ui'+_.str.capitalize(uiName)];
				$('<div class="ui-'+uiName+'-bg"></div>').css(_.extend({
					width:"100%",
					height:"100%",
					position:"absolute",
					top:"0px",
					left:"0px"
				},uiBgCss||{})).prependTo(wrapperJq);
			}
		},
		/**
		 * 为低能浏览器创建兼容css3，具备pie能干的一切(圆角、渐变色、阴影)
		 */
		pieH:function(uiYa){
			var hostJq=uiYa.hostJq;
			return function(){
				if(window.PIE){
					hostJq.find('pie-fixed').each(function(){
						PIE.attach(this);
					});
					if(hostJq.hasClass('pie-fixed')){
						PIE.attach(hostJq[0]);
					}
				}	
			};	
		}
	});
	_.extend(ya,{
		util:util,
		ui:ui,
		uiHelper:uiHelper,
		/**
		 * 工厂函数
		 */
		define:function(){},
		doUi:function(){
			var uiName=arguments[0];
			var uiConstructor=arguments[1];
			_.extend(uiConstructor.prototype,{
				_applyParams:function(opts){
					_.extend(this,opts||{});
				}
			});
			ui[_.str.capitalize(uiName)]=uiConstructor;
		},
		/**
		 * ui组件构造器
		 * @param type {Boolean} true返回jquery对象，默认为false
		 */
		newUi:function(opts,type){
			var defaultOpts=_.extend({
				hostSelector:null,
				uiName:null,
				opts:null
			},opts);
			var defaultType=!!type;
			var uiConstructorName=_.str.capitalize(defaultOpts.uiName);
			var uiYa=new ui[uiConstructorName](defaultOpts.hostSelector,defaultOpts.opts); 
			if(!defaultType){
				return uiYa; 
			}else{
				return uiYa.hostJq;
			}
		}
	});
	//注册到全局空间
	root.ya=ya;
}(this));