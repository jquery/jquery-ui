/**
 * @author 13
 */
(function($,root){
	var yawrap=root.yawrap,
		sl=yawrap.sl,
		uihelper=yawrap.uihelper,
		Solution=sl.Solution;
	var Base=$.ui.dialog;
	
	var attrFn = $.attrFn || {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true,
		click: true
	};
	$.widget('ya.dialog0',Base,{
		options: {
			advancedTheme:{	//设置widget的高级主题效果
				shadow:false,	//设置背景阴影，默认存在
				corner:false
			}
		},
		_create:function(){
			var self=this,
				options=self.options,
				advancedTheme=options.advancedTheme;
			Base.prototype._create.call(this);
			
			if(advancedTheme){
				for(var n in advancedTheme){
					if(advancedTheme[n]){
						uihelper.advancedThemeH(self,n,self.uiDialog);
					}		
				}
			}
			//按钮添加圆角,移到button组件中实现
			//var buttonJq=$('.ui-dialog-buttonset .ui-button span',self.uiDialog);	//buttons
			//uihelper.advancedThemeH(self,'corner',buttonJq);
			//去除虚线
			uihelper.removeOutline(self,self.uiDialog);
		},
		_createButtons: function(buttons) {
			var self = this,
				hasButtons = false,
				uiDialogButtonPane = $('<div></div>')
					.addClass(
						'ui-dialog-buttonpane ' +
						'ui-widget-content ' +
						'ui-helper-clearfix'
					),
				uiButtonSet = $( "<div></div>" )
					.addClass( "ui-dialog-buttonset" )
					.appendTo( uiDialogButtonPane );
	
			// if we already have a button pane, remove it
			self.uiDialog.find('.ui-dialog-buttonpane').remove();
	
			if (typeof buttons === 'object' && buttons !== null) {
				$.each(buttons, function() {
					return !(hasButtons = true);
				});
			}
			if (hasButtons) {
				$.each(buttons, function(name, props) {
					props = $.isFunction( props ) ?
						{ click: props, text: name } :
						props;
					var button = $('<button type="button"></button>')
						.click(function() {
							props.click.apply(self.element[0], arguments);
						})
						.appendTo(uiButtonSet);
					// can't use .attr( props, true ) with jQuery 1.3.2.
					$.each( props, function( key, value ) {
						if ( key === "click" ) {
							return;
						}
						if ( key in attrFn ) {
							button[ key ]( value );
						} else if(key!="options"){
							button.attr( key, value );
						}
					});
					if ($.fn.button0) {
						button.button0(props.options||{});	//替换为button0
					}
				});
				uiDialogButtonPane.appendTo(self.uiDialog);
			}
		}
		
	});
}(jQuery,this));

