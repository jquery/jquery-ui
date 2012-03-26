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
			},
			closeText:'&#10005'
		},
		_create:function(){
			var self=this,
				options=self.options,
				advancedTheme=options.advancedTheme;
			Base.prototype._create.call(this);
			//设置closeText(html方式)
			self.uiDialogTitlebarCloseText.html(options.closeText);
			
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
	//alert单体弹框
	(function(){
		var alertJq=$('#ui-alert'),
			alertCls='ui-alert-error ui-alert-success ui-alert-info',
			resizeTid;
		//保证window resize/scroll时居中显示
		var fixedCenter=function(){
		    clearTimeout(resizeTid);
            resizeTid=setTimeout(function(){
               alertJq.dialog0('option','position','center'); 
            },300);
		};
		$(window).resize(function(){
		    fixedCenter();
		}).scroll(function(){
		    fixedCenter();
		});
		_.extend($.ya,{
			alert:function(title,content,type,callback,opts){
				var uiDialogJq;
				type=type||'error'
				if(alertJq.length==0){
					//$('<div id="ui-alert"><div class="ui-alert-content-wrapper"><span class="ui-icon-alert"></span><span class="ui-alert-content-inner"></span></div></div></div>').appendTo('body');
					alertJq=$('<div id="ui-alert"></div>').html('<div class="ui-alert-content-wrapper"><span class="ui-icon-alert"></span><span class="ui-alert-content-inner"></span></div></div>').appendTo('body');
					alertJq.dialog0($.extend({
						modal:true,
						resizable:false,
						hide:true,
						autoOpen:false,
						minHeight:22,
						minWidth:285,
						advancedTheme:{	
							shadow:true,	
							corner:true
						},
						open:function(){
						   //保证ie8的高级效果层有一个正确的z-index
						   $(window).scroll(); 
						   if(opts.autoHide){
						       setTimeout(function(){
						           alertJq.dialog0('close');
						       },opts.autoHide);
						   }
						}
					},opts||{}));
					alertJq.data('dialog0').uiDialog.addClass('ui-dialog-alert');
				}
				//设置title
				alertJq.dialog0('option',"title",title);
				//设置内容
				$('.ui-alert-content-inner',alertJq).html(content);
				uiDialogJq=alertJq.data('dialog0').uiDialog;
				if(!title){
					uiDialogJq.addClass('ui-alert-notitle');
				}else{
					uiDialogJq.removeClass('ui-alert-notitle');
				}
				switch(type){
					case 'error':
						uiDialogJq.removeClass(alertCls).addClass('ui-alert-error');
						break;
					case 'success':
						uiDialogJq.removeClass(alertCls).addClass('ui-alert-success');
						break;
					case 'info':
						uiDialogJq.removeClass(alertCls).addClass('ui-alert-info');
						break;
					default:
						break;
				}
				//显示提示框
				alertJq.dialog0('open');
			}
		});		
	}());
}(jQuery,this));

