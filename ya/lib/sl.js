/**
 * 一些常见问题解决方案
 * @author 13
 * Depends:
 *     jquery.js
 *     underscore.js
 * 	   underscore.string.js
 *     modernizr.js
 *     ya.js
 *     regex.js
 */
//简单工厂模式
(function($,root){
	var ya=root.ya,
		sl=ya.sl||{},
		regx=ya.regx,
		Interface=ya.Interface;
	//定义接口
	var slInterface=new Interface('slInterface',['doSolution']);
	var Solution=function(name,opts){
		this.name=name;		//名称
		this.opts=_.extend({
			hostSelector:document
		},opts||{});
		this.core=this.createSolution();
	};
	Solution.prototype.createSolution=function(){
		var slName=_.str.capitalize(this.name),
			opts=this.opts,
			sl=new Solution.types[slName](opts.hostSelector,opts);	//首字母大写
		Interface.ensureImplements(sl, slInterface); // 确保实现slInterface接口
		return sl;
	};
	Solution.prototype.doSolution=function(){
		this.core.doSolution();
	};
	Solution.types={};
	_.extend(Solution.types,{
		"Minmax":(function(){
			var Cls=function(hostSelector,opts){
				this.hostJq=$(hostSelector);
				this.opts=_.extend({
					minWidth:-1,
					maxWidth:-1,
					minHeight:-1,
					maxHeight:-1
				},opts||{});
			};
			Cls.prototype.doSolution=function(){
				var opts=this.opts,
					hostJq=this.hostJq;
				if(!Modernizr.testProp('minWidth')){
					hostJq.on('resize0',function(){
						'minWidth,maxWidth,minHeight,maxHeight'.replace(regx.rword,function(propName){
							var methodName=propName.slice(3).toLowerCase();	//获得对应的width()或height()方法名部分					
							if(propName.search('min')!=-1){	//最小约束			
								if(opts[propName]>0){
									var fixedMaxValue=hostJq.data('fixedmax'+methodName);	//获得最大约束值
									hostJq[methodName](fixedMinValue||'auto');	
									if(hostJq[methodName]()<opts[propName]){
										$('#console-message').text(hostJq[methodName]());
										hostJq[methodName](opts[propName]).data('fixedmin'+methodName,opts[propName]);
									}else{
										hostJq.data('fixedmin'+methodName,0);
									}
								}
							}else if(propName.search('max')!=-1){	//最大约束
								if(opts[propName]>0){
									var fixedMinValue=hostJq.data('fixedmin'+methodName);	//获得最小约束值
									hostJq[methodName](fixedMinValue||'auto')
									if(hostJq[methodName]()>opts[propName]){
										hostJq[methodName](opts[propName]).data('fixedmax'+methodName,opts[propName]);
									}else{
										hostJq.data('fixedmax'+methodName,0);
									}
								}
							}
						});
					});
				}else{
					hostJq.css({
						"minWidth":opts.minWidth,
						"maxWidth":opts.maxWidth,
						"minHeight":opts.minHeight,
						"maxHeight":opts.maxHeight
					});
				}
			};
			return Cls;
		}()),
		"Shadow":(function(){
			var Cls=function(hostSelector,opts){
				this.hostJq=$(hostSelector);
				this.opts=_.extend({
					slClsName:'',
					type:'pie'	//pie or filter
				},opts||{});
			};
			Cls.prototype.doSolution=function(){
				var opts=this.opts,
					slClsName=opts.slClsName,
					type=opts.type,
					hostJq=this.hostJq;
				hostJq.addClass('sl-shadow '+slClsName);
				if(type=="pie"&&!hostJq.data('pied')&&window.PIE){
					hostJq.each(function(){
						this.style.filter='';
						PIE.attach(this);
					});
					hostJq.data('pied',false);
				}
			};
			return Cls;
		}()),
		"Corner":(function(){
			var Cls=function(hostSelector,opts){
				this.hostJq=$(hostSelector);
				this.opts=_.extend({
					slClsName:'',
					type:'pie'	//pie or filter
				},opts||{});
			};
			Cls.prototype.doSolution=function(){
				var opts=this.opts,
					slClsName=opts.slClsName,
					type=opts.type,
					hostJq=this.hostJq;
				hostJq.addClass('sl-npx-round-corner '+slClsName);
				if(type=="pie"&&!hostJq.data('pied')&&window.PIE){
					hostJq.each(function(){
						this.style.filter='';
						PIE.attach(this);
					});
					hostJq.data('pied',false);
				}
			};
			return Cls;
		}()),
		"Iframeautoheight":(function(){
			var Cls=function(hostSelector,opts){
				this.hostJq=$(hostSelector);
				this.opts=_.extend({
					autoHeight:-1	//最小高度
				},opts||{});
			};
			Cls.prototype={
				doSolution:function(){
					var me=this,
						hostJq=me.hostJq,
						tid;
					hostJq.load(function(){
						var frame=this;
						me.reSetIframe(frame);
						clearInterval(tid);
						tid=setInterval(function(){
							me.reSetIframe(frame);
						},600);
					});
				},
				reSetIframe:function(frame){
					var opts=this.opts,
						hostJq=this.hostJq;
					var frameContent = frame.contentWindow.document,
		                bodyHeight = Math.max(frameContent.documentElement.scrollHeight,frameContent.body.scrollHeight);
		            if (bodyHeight != $(frame).height()){
		            	if((opts.autoHeight>0)&&(bodyHeight<opts.autoHeight)){
		            		$(frame).height(opts.autoHeight);
		            	}else{
		            		$(frame).height(bodyHeight);
		            	}
		            }
				}
				
			};
			return Cls;
		}())
	});
	sl.Solution=Solution;
	ya.sl=sl;	//重新指向
}(jQuery,this));
