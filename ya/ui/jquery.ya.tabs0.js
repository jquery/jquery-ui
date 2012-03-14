/**
 * @author 13
 */
(function($,root){
	var yawrap=root.yawrap,
		sl=yawrap.sl,
		uihelper=yawrap.uihelper,
		Solution=sl.Solution;
	var Base=$.ui.tabs;
	$.widget('ya.tabs0',Base,{
		options: {
			closable:false,
			advancedTheme:{	//设置widget的高级主题效果
				shadow:false,	//设置背景阴影，默认不存在
				corner:false
			}
		},
		_create:function(){
			var self=this;
			var element=self.element,
				options=self.options,
				advancedTheme=options.advancedTheme;
			if(options.closable){
				options.tabTemplate='<li><a href="#{href}">#{label}</a><span class="ui-icon ui-icon-close">Remove Tab</span>';
				element.on('click','.ui-icon-close',function(){
					var thisJq=$(this);
					var headerListJq=self.lis,
						curHeaderJq=thisJq.parent();
					var index = headerListJq.index(curHeaderJq);
					self.remove(index);
				});
			}
			Base.prototype._create.call(self);
			var listJq=self.list;
			if(options.closable){
				listJq.addClass('ui-tabs-nav-closable');
			}
			//设置panels的父元素引用,提供新面板的插入位置
			self.panelsWrapperJq=$(self.panels[ 0 ].parentNode);
			
			if(advancedTheme){
				for(var n in advancedTheme){
					if(advancedTheme[n]){
						uihelper.advancedThemeH(self,n,self.element);
					}		
				}
			}
			//nav item顶部圆角
			uihelper.advancedThemeH(self,'corner',self.lis);
		},
		/**
		 * 添加一个新的tab
		 * 
		 * @override
		 */
		add: function( url, label, index ) {
			if ( index === undefined ) {
				index = this.anchors.length;
			}
	
			var self = this,
				o = this.options,
				$li = $( o.tabTemplate.replace( /#\{href\}/g, url ).replace( /#\{label\}/g, label ) ),
				id = !url.indexOf( "#" ) ? url.replace( "#", "" ) : this._tabId( $( "a", $li )[ 0 ] );
	
			$li.addClass( "ui-state-default ui-corner-top" ).data( "destroy.tabs", true );
	
			// try to find an existing element before creating a new one
			var $panel = self.element.find( "#" + id );
			if ( !$panel.length ) {
				$panel = $( o.panelTemplate )
					.attr( "id", id )
					.data( "destroy.tabs", true );
			}
			$panel.addClass( "ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide" );
	
			if ( index >= this.lis.length ) {
				$li.appendTo( this.list );
				$panel.appendTo( this.panelsWrapperJq );		//new panel追加到面板父元素里
			} else {
				$li.insertBefore( this.lis[ index ] );
				$panel.insertBefore( this.panels[ index ] );
			}
	
			o.disabled = $.map( o.disabled, function( n, i ) {
				return n >= index ? ++n : n;
			});
	
			this._tabify();
	
			if ( this.anchors.length == 1 ) {
				o.selected = 0;
				$li.addClass( "ui-tabs-selected ui-state-active" );
				$panel.removeClass( "ui-tabs-hide" );
				this.element.queue( "tabs", function() {
					self._trigger( "show", null, self._ui( self.anchors[ 0 ], self.panels[ 0 ] ) );
				});
	
				this.load( 0 );
			}
	
			this._trigger( "add", null, this._ui( this.anchors[ index ], this.panels[ index ] ) );
			return this;
		}
		
	});
}(jQuery,this));
