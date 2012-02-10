/**
 * @author 13
 */
(function($){
	var Column = function(order, columnWidth){
		this.order = order;
		this.maxHeight = 0;
		this.columnWidth = columnWidth;
		this.left = this.columnWidth * order;
		this.lastItem = null;
		this.positioned = false;
	};
	Column.prototype={
		setReferItem:function(item){
			this.lastItem = item;
		},
		getHeight:function(){
			if(this.lastItem){
				this.maxHeight = this.lastItem.getBottom();
			}
			return this.maxHeight;
		},
		getLeft:function(){
			return this.left;
		}
	};
	var Item = function(referDomJq){
		this.referDomJq = referDomJq;
		this.bottom = -1;
		this.positioned = false;
		this.height = null;
	};
	Item.prototype = {
		/*
		*set the refer node's top
		* @param value: Number
		*/
		setTop: function(value){
			this.referDomJq.get(0).style.top = value + 'px';
		},
		/*
		*set the refer node's left
		* @param value: Number
		*/
		setLeft: function(value){
			this.referDomJq.get(0).style.left = value + 'px';
		},
		/*
		*get the refer node bottom position
		*/
		getBottom: function(){
			if(this.positioned){
				this.bottom = parseInt(this.referDomJq.position().top) + this.getHeight();
				return this.bottom;
			}else{
				throw("current node has not been positioned!");
			}
		},
		getHeight: function(){
			if(!this.height){
				this.height = this.referDomJq.height();
			}
			return this.height;
		},
		setPosition: function(column){
			this.positioned = true;
			this.setLeft(column.getLeft());
			this.setTop(column.getHeight() + 10);
			column.setReferItem(this);
		}
	}; 
	$.widget('ya.waterfall0',{
		options:{
			maxHeight: 0,
			columnWidth: 180,
			itemTpl:'<div class="ui-waterfall-item">${item}</div>',
			initData:null,
			onWinScroll:function(){},
			topBtnSelector:'.btn-top'
		},
		_create:function(){
			this.columns=[];
			this.cachedItems=[];
		},
		_init:function(){
			var options=this.options,
				self=this;
			var wrapperWidth = this.element.width();
			var columnCount = parseInt(wrapperWidth/ options.columnWidth);
			//init the columns
			for(var i = 0, len = columnCount; i < len; i++){
				this.columns.push(new Column(i,options.columnWidth));
			}	
			//init tempData
			self.tempData=options.initData||[];
			//init events
			self._initEvents();
			//render
			self.append();
		},
		_initEvents: function(){
			var winJq=$(window),
				self=this,
				options=self.options;
			winJq.scroll(function(e){
				options.onWinScroll.call(self);
			}).resize(function(e){
				if(!self.timer){
					clearTimeout(self.timer);
				}
				self.timer = setTimeout(function(){self.reRender();}, 1000);
			});
		},
		append:function(){
			var self=this,
				options=self.options,
				itemJq;
			for(var i=0,itemData;itemData=self.tempData[i++];){
				itemJq=$.tmpl(options.itemTpl, itemData);
				self.addNewItem(itemJq);
				itemJq.css({
					"position":"absolute",
					"width":options.columnWidth,
					"overflow":"hidden"
				}).appendTo(self.element);
			}
		},
		reRender: function(){
			var self=this;
			var wrapperWidth = self.element.width(),
				options=this.options;
			var columnCount = parseInt(wrapperWidth/ options.columnWidth);
			//this.columnCount = columnCount; 
			
			//var totalWidth = options.columnWidth * columnCount - 10;
			//self.element.width(totalWidth);
			self.columns = [];
			for(var i = 0, len = columnCount; i < len; i++){
				self.columns.push(new Column(i, options.columnWidth));
			}
			
			for(var i = 0, len = self.cachedItems.length; i < len; i++){
				self.cachedItems[i].setPosition(this._getMinHeightColumn());
			}
			
			self.element.height(this._getMaxHeight());
			self.timer = null;
		},
		_getMinHeightColumn: function(){
			var minHeight = -1, tempColumn = null;
			
			for(var i = 0,len = this.columns.length; i < len; i++){
				if(minHeight > this.columns[i].getHeight() || minHeight == -1){
					minHeight = this.columns[i].getHeight();
					tempColumn = this.columns[i];
				}
			}
			
			return tempColumn;
		},
		
		_getMaxHeight: function(){
			var maxHeight = -1;
			for(var i = 0, len = this.columns.length; i < len; i++){
				if(maxHeight < this.columns[i].getHeight()){
					maxHeight = this.columns[i].getHeight();
				}
			}
			
			return maxHeight;
		},
		addNewItem: function(liItem){
			var item = new Item(liItem);
			item.setPosition(this._getMinHeightColumn());
			this.cachedItems.push(item);
			this.element.height(this._getMaxHeight());
		}
	});
}(jQuery));