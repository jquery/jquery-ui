/**
 * helper接受的第一个参数严格为ui
 * 
 * @author 13
 */
(function($,root){
	var ya=root.ya,
		sl=ya.sl,
		uihelper=ya.uihelper||{},
		Solution=sl.Solution;
	_.extend(uihelper,{
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
		} 
	});
	
	ya.uihelper=uihelper;
}(jQuery,this));