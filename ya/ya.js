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
		util={},	//工具箱
		sl={},	//solutions
		regx={};	//通用正则表达式容器
	//接口定义
	(function(){
		/**
		 * 接口
		 * @param {String} name 接口名称
		 * @param {Array} methods 方法
		 */
		var Interface=function(name,methods){
			 if(arguments.length != 2) {  
		        throw new Error("Interface constructor called with " + arguments.length + "arguments, but expected exactly 2.");  
		    }  
		      
		    this.name = name;  
		    this.methods = [];  
		    for(var i = 0, len = methods.length; i < len; i++) {  
		        if(typeof methods[i] !== "string") {  
		            throw new Error("Interface constructor expects method names to be passed in as a string.");  
		        }  
		        this.methods.push(methods[i]);          
		    }      
		};
		Interface.ensureImplements = function(obj) {  
		    if(arguments.length < 2) {  
		        throw new Error("Function Interface.ensureImplements called with " +   
		          arguments.length  + "arguments, but expected at least 2.");  
		    }  
		  
		    for(var i = 1, len = arguments.length; i < len; i++) {  
		        var interfaceObj = arguments[i];  
		        if(interfaceObj.constructor !== Interface) {  
		            throw new Error("Function Interface.ensureImplements expects arguments "     
		              + "two and above to be instances of Interface.");  
		        }  
		        for(var j = 0, methodsLen = interfaceObj.methods.length; j < methodsLen; j++) {  
		            var method = interfaceObj.methods[j];  
		            if(!obj[method] || typeof obj[method] !== "function") {  
		                throw new Error("Function Interface.ensureImplements: object "   
		                  + "does not implement the " + interfaceObj.name   
		                  + " interface. Method " + method + " was not found.");  
		            }  
		        }  
		    }   
		};
		_.extend(ya,{
			"Interface":Interface
		}); 
	}());
	_.extend(ya,{
		"util":util,
		"sl":sl
	});
	//注册到全局空间
	root.ya=ya;
	
}(this));