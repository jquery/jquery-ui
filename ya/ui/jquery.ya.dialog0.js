/**
 * @author 13
 */
(function($){
	var Base=$.ui.dialog;
	$.widget('ya.dialog0',Base,{
		_create:function(){
			Base.prototype._create.call(this);
			var uiDialog=this.uiDialog,
				options=this.options;
			$('<div class="ui-dialog-bg"></div>').css(_.extend({
				width:"100%",
				height:"100%",
				position:"absolute",
				top:"0px",
				left:"0px"
			},options.uiBgCss||{})).prependTo(uiDialog);
		}
		
	});
}(jQuery));

