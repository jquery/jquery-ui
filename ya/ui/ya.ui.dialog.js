/**
 * Depends:
 *	jquery.ui.dialog.js
 */
(function(root){
	var $=root.jQuery,
		_=root._;
	var ya=root.ya,
		ui=ya.ui,
		util=ya.util,
		uiHelper=ya.uiHelper;
	ya.doUi('Dialog',function(selector,opts){
		var me=this;
		var hostJq=$(selector);
		this._applyParams({
			"hostJq":hostJq
		});
		var applyOpts={};
		_.extend(applyOpts,(opts=opts||{}));
		//通过ui helper创建dialog附加背景层
		if(_.isFunction(opts.create)){
			applyOpts.create=function(){
				uiHelper.createBgH(me,applyOpts.uiBgCss).apply(this,arguments);
				opts.create.apply(this,arguments);
			};
		}else{
			applyOpts.create=uiHelper.createBgH(me,applyOpts.uiBgCss);
		}
		hostJq.dialog(applyOpts);	
	});
}(this));