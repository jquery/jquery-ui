/**
 * @author 13
 */
(function($){
	 /**
     * treenode: { text:'node1', expanded:true}
     */
    $.treeview = {};
    var CLASSES = ($.treeview.classes = {
            open: "open",
            closed: "closed",
            expandable: "expandable",
            expandableHitarea: "expandable-hitarea",
            lastExpandableHitarea: "lastExpandable-hitarea",
            collapsable: "collapsable",
            collapsableHitarea: "collapsable-hitarea",
            lastCollapsableHitarea: "lastCollapsable-hitarea",
            lastCollapsable: "lastCollapsable",
            lastExpandable: "lastExpandable",
            last: "last",
            hitarea: "hitarea"
        });
    
    $.widget("ya.tree0", {
        _swapClass: function(target, c1, c2) {
            var c1Elements = target.filter('.' + c1);
            target.filter('.' + c2).removeClass(c2).addClass(c1);
            c1Elements.removeClass(c1).addClass(c2);
        },
        
        /**
         * target: treenode LI DOM 
         */
        _getParentNode :function (target){
            if(target){
                var pnode = $(target).parent().parent();
                if(pnode && pnode.hasClass("ui-tree-node")) {
                    return pnode;
                }
            }
            return null;
        },
        
        _setParentCheckbox: function (node){
            var pnode = this._getParentNode(node);
            if (pnode){
                var checkbox = pnode.find(">ul >li >div.tree-checkbox");
                var allChild = checkbox.length;
                var full_len = checkbox.filter(".checkbox_full").length;
                var part_len = checkbox.filter(".checkbox_part").length;
                var pnode_checkbox = pnode.find(">div.tree-checkbox"); 
                pnode_checkbox.removeClass("checkbox_full checkbox_part");
                if(full_len == allChild) {
                    pnode_checkbox.addClass("checkbox_full");
                } else if(full_len > 0 || part_len > 0) {
                    pnode_checkbox.addClass("checkbox_part");
                }
                this._setParentCheckbox(pnode);
            }
        },
        
        _setChildCheckbox : function (node, checked){
            var childck = node.find(">ul").find('.tree-checkbox');
            childck.removeClass("checkbox_part checkbox_full");
            if(checked) {
                childck.addClass("checkbox_full");
            }
        },
        
        // target equal the li elements
        _applyEvents: function(target) {
            var self = this,
                options = self.options,
                onClick = options.onClick,
                onDblClick = options.onDblClick,
                onRightClick = options.onRightClick,
                onDrag =options.onDrag,
                onSelect = options.onSelect,
                onDrop = options.onDrop;
            target.find("span a").bind("click",function(e){
            	var node = self.element.data("nodes")[$(this).parent().parent().attr("id")];
           	    onClick && onClick.call(self, node, e);
                self.select(node);
                return false;
            }).bind("dblclick", function(e){
            	var nDom = $(this).parent().parent();
                var node = self.element.data("nodes")[nDom.attr("id")];
                if ( nDom.has("ul").length >0 && $(e.target, this) )
                    self.toggler(nDom);
                onDblClick && onDblClick.call(self, node, e);
            }).bind("contextmenu", function(e){
                     var node = self.element.data("nodes")[$(this).parent().parent().attr("id")];
                     onRightClick && onRightClick.call(self, node, e);
            }).bind("mouseover mouseout", function(e){
                      if(e.type == "mouseover"){
                          $(this).addClass("hover");
                      }
                      else if(e.type == "mouseout"){
                          $(this).removeClass("hover");
                      }
                      return false;
            });
            self._bindHitEvent(target);
			
			 target.find("div.tree-checkbox").click(function(e){
                var node = $(this).parent();
                var nodedata = self.findByNId(node.attr("id"));
                self._toggleCheck(node, self.isCheck(nodedata));
            });
            if (self.options.draggable) {
                target.omDraggable({
                    revert: "invalid",
                    onDrag: function(e) {
                        onDrag && onDrag(node, e);
                    }
                });
                target
                .find(">span")
                .omDroppable({
                    accept : "li.ui-tree-node",
                    hoverClass : "treenode-droppable",
                    onDrop : function(event, source) {
                        var pnode,bnode,$item = source;
                        var $drop = $(event.target).parent();
                        var $list = $drop.find(">ul");
                        $item.css("left", "");
                        $item.css("top", "");
                        var dragnode = self.findByNId($item.attr("id"));
                        if($drop.has("ul").length > 0){
                           pnode = self.findByNId($drop.attr("id"));
                        }else{
                           bnode = self.findByNId($drop.attr("id")); 
                        }
                        self.remove(dragnode);
                        self.insert(dragnode, pnode, bnode, true);
                        var node = self.findByNId($item.parent().find("li").attr("id"));
                        onDrop && onDrop(node, event);
                    }
                });
            }
            target.bind("mousedown", function(e){
                e.stopPropagation();                
            });
        },
        _bindHitEvent: function(target){
        	var self=this;
        	target.find("div.hitarea").click(function() {
                var node = $(this).parent();
                self.toggler(node);
            });
        },
        options: /** @lends tree0#*/{
            /* 暂不支持
             * 树初始状态时展开的层级.
             * @type Number
             * @default 0
             * @example
             * $("#mytree").tree0({initExpandLevel:2});
             */
            initExpandLevel: 0,
            /**
             * 数据源属性，可以设置为后台获取数据的URL，比如dataSource : 'treedata.json'
             * 也可以设置为静态数据，数据必须为JSON格式数组，比如dataSource : [{"text":"iPhone"},{"text":"iPad"}]；
             * 其中JSON格式为
             * <pre>
             * {
             *     text: 'node1', // 树节点显示文本，必需
             *     expanded: true, // 是否默认展开
             *     classes: 'folder', // 树节点样式，非必需，默认有folder和file，用户可自定制此样式
             *     hasChildren: false // 树节点懒加载的情况下，该节点在展开时自动向后台取数
             * }
             * </pre>
             * @name tree0#dataSource
             * @type String,Array[JSON]
             * @default 无
             * @example
             * dataSource : 'treedata.json'
             * 或者
             * dataSource : [{"text":"iPhone"},{"text":"iPad"}]
             */
            /* 暂不支持
             * 鼠标划过某个节点时是否高亮。
             * @type Boolean
             * @default false
             * @example
             * $("#mytree").tree0({lineHover:false});
             */
            lineHover: false,
            /**
             * 树节点是否显示图标。
             * @type Boolean
             * @default true
             * @example
             * $("#mytree").tree0({showIcon:false});
             */
            showIcon: true,
            /* 暂不支持
             * 树节点之间是否显示连线。
             * @type Boolean
             * @default true
             * @example
             * $("#mytree").tree0({showLine:true});
             */
            showLine: true,
            /**
             * 是否显示checkbox。
             * @type Boolean
             * @default false
             * @example
             * $("#mytree").tree0({showCheckbox:false});
             */
            showCheckbox: false,
            /**
             * 是否级联选中，该属性在showCheckbox为true的时候生效。
             * @type Boolean
             * @default true
             * @example
             * $("#mytree").tree0({cascadeCheck:true});
             */
            cascadeCheck: true,
            /**
             * 树节点是否可拖拽。
             * @type Boolean
             * @default false
             * @example
             * $("#mytree").tree0({draggable:true});
             */
            draggable: false,
            /*
             * 暂不支持，通过方法过滤树节点，该方法会被每个树节点调用，当返回为false，该节点会被过滤掉。
             * @type function
             * @default null
             * @example
             * 将叶子节点过滤掉
             * fucntion fn(node){
             *   if(node.children){
             *      return true;
             *   }
             *   retrun false;
             * } 
             * $("#mytree").tree0({filter:fn});
             */
            filter: null,
            // before refresh the node ,you can change the node
            // nodeFomatter:null,
            nodeCount:0
        },
        _create: function() {
            var self = this, options = self.options;
            if ( options.toggle ) {
                var callback = options.toggle;
                options.toggle = function() {
                    return callback.apply($(this).parent()[0], arguments);
                };
            }
            var elem = self.element;
            
            elem.data("nodes", []);
            elem.data("selected", "");
            
            // add treeview class to activate styles
            elem.addClass("treeview");
            
        },
       
        updateNode: function(target) {
            var self = this, options = self.options;
            // prepare branches and find all tree items with child lists
            var branches = target.find("li");
            //.prepareBranches(options);
            
            //self._applyClasses(branches);
            self._applyEvents(branches);
            
            if(options.control) {
                self._treeController(self, options.control);
            }
        },
        
        
        
        // handle toggle event
        // change the target to the treenode (li dom)
        toggler: function(target) {
            var self = this,
                options = self.options;
            var nid = target.attr("id");
            var node = self.findByNId(nid);
            var hidden = target.hasClass(CLASSES.expandable);
            
            if ( hidden ) {
                var onBeforeExpand = options.onBeforeExpand;
                if(onBeforeExpand && false === onBeforeExpand(node)){
                    return self;
                }
            } else {
                var onBeforeCollapse = options.onBeforeCollapse;
                if(onBeforeCollapse && false === onBeforeCollapse(node)){
                    return self;
                }
            }
            
            // swap classes for hitarea
            var hitarea = target.find( target.find(">.hitarea") );
            self._swapClass(hitarea, CLASSES.collapsableHitarea, CLASSES.expandableHitarea);
            self._swapClass(hitarea, CLASSES.lastCollapsableHitarea, CLASSES.lastExpandableHitarea);
            
            // swap classes for li
            self._swapClass(target, CLASSES.collapsable, CLASSES.expandable);
            self._swapClass(target, CLASSES.lastCollapsable, CLASSES.lastExpandable);
            
            // find child lists
            target.find( ">ul" )
                .each(function(){
                    if ( hidden ) {
                        $(this).show();
                        var onExpand = options.onExpand;
                        onExpand && onExpand.call(this, node);
                    } else {
                        $(this).hide();
                        var onCollapse = options.onCollapse;
                        onCollapse && onCollapse.call(this, node);
                    }
                });
        },
        
        _init: function() {
            var self = this, options = self.options,
                target = self.element,
                source = options.dataSource;
            target.data("init_dataSource", source);
            if(source) {
                if(typeof source == 'string'){
                    self._ajaxLoad(target, source);
                }else if(typeof source == 'object'){
                    self._appendNodes.apply(self, [target, source]);
                    self.updateNode(target);
                }
            }
        },
        
        _ajaxLoad:function(target, url){
            var self = this,
                options = this.options,
                onBeforeLoad = options.onBeforeLoad,
                onSuccess = options.onSuccess,
                onError = options.onError;
            onBeforeLoad && onBeforeLoad(self.findByNId(target.parent().attr("id")));
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                success: function(data){
                    self._appendNodes.apply(self, [target, data]);
                    self.setData(data);
                    self.updateNode(target);
                    onSuccess && onSuccess.call(self, data);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    onError && onError.call(self, XMLHttpRequest, textStatus, errorThrown);
                }
            });
        },
        /* -------------------- check and select node ------------------- */
        /**
         * 将指定节点前的勾选框设置为被勾选状态，该方法只有在属性showCheckbox为true时才生效。
         * @name tree0#check
         * @function
         * @param target 指定节点的JSON数据对象，并且该节点数据中包括了nid属性
         * @example
         * //将target节点的勾选状态设置为被勾选状态
         * var target = $('#myTree').tree0("findNode", "text", "node1");
         * $('#myTree').tree0('check',target);
         */  
        check: function(target) {
            this._toggleCheck($("#" + target.nid), false);
        },
        /**
         * 将指定节点前的勾选框设置为未被勾选状态，该方法只有在属性showCheckbox为true时才生效。
         * @name tree0#uncheck
         * @function
         * @param target 指定节点的JSON数据对象，并且该节点数据中包括了nid属性
         * @example
         * //将target节点的勾选状态设置为不被勾选状态
         * var target = $('#myTree').tree0("findNode", "text", "node1");
         * $('#myTree').tree0('uncheck',target);
         */  
        uncheck: function(target) {
            this._toggleCheck($("#" + target.nid), true);
        },
        
        // target equal le elem
        _toggleCheck: function(target, checked) {
            var checkbox_item = target.find(">div.tree-checkbox"), self = this,
            options = self.options,
            onCheck = options.onCheck;
            if(checked) {
                checkbox_item
                    .removeClass("checkbox_part checkbox_full");
            } else {
                checkbox_item
                    .removeClass("checkbox_part")
                    .addClass("checkbox_full");
            }
            if(self.options.cascadeCheck) {
                self._setChildCheckbox(target, !checked);
                self._setParentCheckbox(target);
            }
            onCheck && onCheck(self.findByNId(target.attr("id")));
        },
        /**
         * 将所有节点的勾选框设置为被勾选状态，该方法只有在属性showCheckbox为true时才生效。
         * @name tree0#checkAll
         * @function
         * @param checked 指定勾选框的勾选状态，checked为true为被勾选状态，为false为未被勾选状态
         * @example
         * //将所有节点的勾选框都设置为被勾选状态
         * $('#myTree').tree0('checkAll',true);
         */  
        checkAll: function(checked) {
            if(checked) {
                this.element
                    .find(".tree-checkbox")
                    .removeClass("checkbox_part")
                    .addClass("checkbox_full");
            } else {
                this.element
                    .find(".tree-checkbox")
                    .removeClass("checkbox_part checkbox_full");
            }
        },
        /**
         * 判断指定节点的勾选状态，该方法只有在属性showCheckbox为true时才生效。
         * @name tree0#isCheck
         * @function
         * @param target 指定节点的JSON数据对象，并且该节点数据中包括了nid属性
         * @returns true or false
         * @example
         * //判断target节点的勾选状态
         * var target = $('#myTree').tree0("findNode", "text", "node1");
         * $('#myTree').tree0('isCheck',target);
         */  
        isCheck: function(target) {
            return $("#"+target.nid)
                       .find(">div.tree-checkbox")
                       .hasClass("checkbox_full");
        },
        /**
         * 获取所有被勾选或未被勾选节点的JSON数据对象集合。
         * @name tree0#getChecked
         * @function
         * @param checked 指定勾选框的勾选状态，checked为true为被勾选状态，为false为未被勾选状态，默认为false
         * @returns JSON数据对象集合
         * @example
         * //获取所有被勾选节点的JSON数据对象集合
         * $('#myTree').tree0('getChecked',true);
         */      
        getChecked: function(checked) {
            var self = this,
                nodes = [];
            var filter_config = checked?".checkbox_full":":not(.checkbox_full)";
            this.element
                .find(".tree-checkbox")
                .filter(filter_config).each(function(i,name){
                    nodes.push(self.element.data("nodes")[$(this).parent().attr("id")]);
                });
            return nodes;
        },
        /**
         * 将指定节点设置为选中状态。
         * @name tree0#select
         * @function
         * @param target 指定节点的JSON数据，并且该节点数据中包括了nid属性。
         * @example
         * //将target节点设置为选中状态
         * var target = $('#myTree').tree0("findNode", "text", "node1");
         * $('#myTree').tree0('select',target);
         */  
        select: function(target) {
            var self = this,
                options = this.options,
                onBeforeSelect = options.onBeforeSelect,
                onSelect = options.onSelect;
            if(onBeforeSelect && false === onBeforeSelect(target)) {
                return self;
            }
            var node = $("#" + target.nid);
            var a = $(" >span >a", node);
            a.addClass("ui-state-selected");
            var oldSelected = self.element.data("selected");
            var curSelected = node.attr("id");
            if(oldSelected != "" && !(oldSelected == curSelected)) {
                $("#" + oldSelected + " >span >a").removeClass("ui-state-selected");
            }
            self.element.data("selected", curSelected);
            onSelect && onSelect.call(self, target);
        },
        /**
         * 将指定节点设置为未选中状态。
         * @name tree0#unselect
         * @function
         * @param target 指定节点的JSON数据，并且该节点数据中包括了nid属性
         * @example
         * //将target节点设置为未选中状态
         * var target = $('#myTree').tree0("findNode", "text", "node1");
         * $('#myTree').tree0('unselect',target);
         */
        unselect: function(target) {
            var self = this;
            var node = $("#" + target.nid);
            var a = $(" >span >a", node);
            a.removeClass("ui-state-selected");
            var oldSelected = self.element.data("selected");
            var curSelected = node.attr("id");
            if( oldSelected == curSelected) {
                self.element.data("selected", "");
            }
        },
        /**
         * 获取被选中的节点的JSON数据对象。
         * @name tree0#getSelected
         * @function
         * @returns JSON数据对象
         * @example
         * //获取被选中节点的JSON数据对象
         * $('#myTree').tree0('getSelected');
         */
        getSelected: function() {
            var selected = this.element.data("selected");
            return selected ? this.element.data("nodes")[selected] : null;
        },
        
        /* -------------------- find node ------------------- */
        /**
         * 根据节点数据的属性精确查找节点 pNode 下面的子节点中的 JSON 数据对象集合。
         * @name tree0#findNodes
         * @function
         * @param key 进行查找的节点数据的属性名称
         * @param value 属性值
         * @param pNode 可选，指定的父节点，默认为查找所有节点
         * @param deep 可选，是否递归查找子节点，默认为递归查找子节点
         * @returns JSON数据对象集合
         * @example
         * //查找所有树节点中属性“classes”等于“folder”的节点
         * $('#myTree').tree0('findNodes', "classes", 'folder', "",true);
         */
        findNodes: function(key, value, pNode, deep) {
            var result = [], len;
            var data = pNode ? pNode.children :this.getData();
            deep = (deep!=false)? true : deep;
            if(data && (len = data.length) > 0) {
                for(var i = 0; i < len; i++){
                  result = this._searchNode.apply(data[i], [key, value, this._searchNode, result, false, deep]);
                }
           }
            return result.length > 0 ? result : null;
        },
        /**
         * 根据节点数据的属性精确查找节点 pNode 的子节点中满足条件的 JSON 数据对象。
         * 查找到第一个满足条件的节点则停止查找，返回该节点。
         * @name tree0#findNode
         * @function
         * @param key 进行查找的节点数据的属性名称
         * @param value 属性值
         * @param pNode 可选，指定的父节点，默认为查找所有节点
         * @param deep 可选，是否递归查找子节点，默认为递归查询子节点
         * @returns JSON数据对象
         * @example
         * //查找所有树节点中第一个满足属性“classes”等于“folder”的节点
         * $('#myTree').tree0('findNode', "classes", 'folder', "",true);
         */
        findNode: function(key, value, pNode, deep){
            var res, len, data = pNode ? pNode.children : this.getData();
            deep = (deep!=false)? true : deep;
            if(data && (len = data.length)> 0) {
                for(var i = 0; i < len; i++){
                  res = this._searchNode.apply(data[i], [key, value, this._searchNode, [], true, deep]);
                  if(res != null){
                      return res;
                  }
               }
           }
            return null;
        },
        /**
         * 根据id精确查找节点。查找到第一个满足条件的节点则停止查找，返回该节点。
         * @name tree0#findByNId
         * @function
         * @param nid 节点的唯一标识,该值是自动生成的，生成规则为treeId+ "_" + 计数
         * @returns JSON数据对象
         * @example
         * //查找“nid”等于“treeId_4”的节点
         * $('#myTree').tree0('findByNId','treeId_4');
         */
        findByNId : function(nid) {
            return this.element.data("nodes")[nid];
        },
        /**
         * 根据指定函数fn精确查找指定pNode的子节点中满足条件的JSON数据对象集合，函数fn中可以定义复杂的查询逻辑。
         * @name tree0#findNodesBy
         * @function
         * @param fn 指定的查找函数，参数为节点的JSON数据对象，函数返回为true则改节点满足查找条件，反之false则不满足条件
         * @param pNode 可选，指定的父节点，默认为查找所有节点
         * @param deep 可选，是否递归查找子节点，默认为递归查找子节点
         * @returns JSON数据对象集合
         * @example
         * //根据函数fn查找符合条件的所有节点的JSON数据对象集合
         * $('#myTree').tree0('findNodesBy',fn);
         */
        findNodesBy: function(fn, pNode, deep){
            var res, data = pNode ? pNode.children : this.getData();
            deep = (deep!=false)? true : deep;
            var result = [];
            if(data && (len = data.length)> 0) {
             for(var i = 0; i < len; i++){
                if(fn.call(data[i], data[i]) === true){
                    result.push(data[i]);
                }
                if(deep && data[i].children){
                    res = this.findNodesBy(fn, data[i], deep);
                    if(res){
                        result = result.concat(res);
                    }
                }
              }
            }
            return result.length > 0 ? result : null;
        },
        /**
         * 根据指定函数fn精确查找指定pNode的子节点中满足条件的第一个节点的JSON数据对象，函数fn中可以定义复杂的查询逻辑。
         * 查找到第一个满足条件的节点则停止查找，返回该节点的JSON数据对象。
         * @name tree0#findNodeBy
         * @function
         * @param fn 指定的查找函数，拥有一个参数为节点的JSON数据对象，函数返回为true则该节点满足查找条件，反之false则不满足条件
         * @param pNode 可选，指定的父节点，默认为查找所有节点
         * @param deep 可选，是否递归查找子节点，默认为不递归查找子节点
         * @returns JSON数据对象
         * @example
         * //根据函数fn查找符合条件的第一个子节点的JSON数据对象
         * $('#myTree').tree0('findNodeBy',fn);
         */       
        findNodeBy: function(fn, pNode, deep){
            var res, data = pNode ? pNode.children : this.getData();
            deep = (deep!=false)? true : deep;
            if(data && (len = data.length)> 0) {
              for(var i = 0, len = data.length; i < len; i++){
                if(fn.call(data[i], data[i]) === true){
                    return data[i];
                }
                if(deep){
                    res = this.findNodeBy(fn, data[i], deep);
                    if(res != null){
                        return res;
                    }
                }
              }
            }
            return null;
         },
         
        _searchNode: function(key, value, _searchNode, result, isSingle, deep) {
            if(isSingle){
                if(this[key] == value)
                return this;
                if(this.children && this.children.length && deep) {
                    for(var i in this.children){
                        var temp=_searchNode.apply(this.children[i],[key,value,_searchNode,[],true,deep]);	//fixed,缺少deep参数
                        if(temp) return temp;
                    }
                }
            }else{
                if(this[key] == value){      
                    result.push(this);
                }
                if(this.children && this.children.length && deep) {
                    $.each(this.children, _searchNode, [key, value, _searchNode, result, false, deep]);
                }
                return result;
            }
        },
        /**
         * 获取指定节点的父节点。
         * @name tree0#getParent
         * @function
         * @param target 指定节点的JSON数据对象，并且该节点数据中包括了nid属性
         * @returns JSON数据对象
         * @example
         * //查找target的父节点的JSON数据对象
         * var target = $('#myTree').tree0("findNode", "text", "node1");
         * $('#myTree').tree0('getParent',target);
         */  
        getParent: function(target) {
            var pid = this.element.data("nodes")["pid" + target.nid];
            return pid?this.findByNId(pid):null;
        },
        /**
         * 获取指定节点的所有父节点。
         * @name tree0#getParents
         * @function
         * @param target 指定节点的JSON数据对象，并且该节点数据中包括了nid属性
         * @returns {Array} 返回所有父节点组成的数据
         * @example
         * //查找target的父节点的JSON数据对象
         * var target = $('#myTree').tree0("findNode", "text", "node1");
         * $('#myTree').tree0('getParents',target);
         */  
        getParents: function(target) {
        	var parentNodes=[],
        		parentNode=this.getParent(target);
        	while(parentNode){
        		parentNodes.push(parentNode);
        		parentNode=this.getParent(parentNode);
        	}
            return parentNodes;
        },
        /**
         * 获取指定节点的所有子节点的JSON数据对象集合。
         * @name tree0#getChildren
         * @function
         * @param target 指定节点的JSON数据对象，并且该节点数据中包括了nid属性
         * @returns JSON数据对象集合
         * @example
         * //查找target的父节点的JSON数据对象
         * var target = $('#myTree').tree0("findNode", "text", "node1");
         * $('#myTree').tree0('getChildren',target);
         */      
        getChildren: function(target) {
            return target.children;
        },
        /**
         * 获取树的dataSource对应的静态数据。
         * @name tree0#getData
         * @function
         * @returns JSON数据对象集合
         * @example
         * //获取dataSource对应的静态数据
         * $('#myTree').tree0('getData');
         */
        getData: function() {
            return this.options.dataSource;
        },
        /**
         * 设置树的dataSource所对应的静态数据。
         * @name tree0#setData
         * @function
         * @example
         * //设置dataSource对应的静态数据
         * var data=[{text:'node2',children:[{text:'node21'},{text:'node22'}]},
         *             {text:'node3'}
         *      ];
         * $('#myTree').tree0('setData',data);
         * 
         * //设置dataSource对应的动态数据
         * $('#myTree').tree0('setData','../../tree0.json');
         */
        setData: function(data) {
            this.options.dataSource = data;
            this.element.data("init_dataSource", data);
        },
        /* -------------------- expand and collapse node ------------------- */
        /**
         * 展开指定节点。
         * @name tree0#expand
         * @function
         * @param target 指定节点的JSON数据对象
         * @example
         * //将target节点展开
         * $('#myTree').tree0('expand',target);
         */  
        expand: function(target) {
            if(target.nid) {
                this._collapseHandler(CLASSES.expandable, $("#" + target.nid));
            }
        },
        /**
         * 收缩指定节点。
         * @name tree0#collapse
         * @function
         * @param target 指定节点的JSON数据对象
         * @example
         * //将target节点收缩
         * $('#myTree').tree0('collapse',target);
         */  
        collapse: function(target) {
            if(target.nid) {
                this._collapseHandler(CLASSES.collapsable, $("#" + target.nid));
            }
        },
        /**
         * 展开所有的树节点。
         * @name tree0#expandAll
         * @function
         * @example
         * //将所有的树节点展开
         * $('#myTree').tree0('expandAll');
         */  
        expandAll: function() {
            this._collapseHandler(CLASSES.expandable, this.element);
        },
        /**
         * 收缩所有的树节点。
         * @name tree0#collapseAll
         * @function
         * @example
         * //将所有的树节点收缩
         * $('#myTree').tree0('collapseAll');
         */
        collapseAll: function() {
            this._collapseHandler(CLASSES.collapsable, this.element);
        },
        
        // filter: the class filter by the toggler
        // elem: from witch element
        _collapseHandler: function(filter, target) {
            this.toggler( $("div." + CLASSES.hitarea, target).filter(function(){
                return filter ? $(this).parent("." + filter).length : true;
            }).parent() );
            return false;
        },
        /* -------------------- edit node ------------------- */ 
        /**
         * 刷新指定树节点及其子节点。
         * @name tree0#refresh
         * @param target 可选，指定节点的JSON数据对象。不传参数则刷新整棵树。
         * @function
         * @example
         * //刷新整棵树
         * $('#myTree').tree0('refresh');
         */
        refresh: function( target ) {
            var self = this, tree=self.element;
            var data = self.getData();
            	if( !target ){
            		tree.data("nodes",[]);
            		self.setData([]);
            		tree.html("");
            		tree.data("init_dataSource", data);
            		if(typeof data == 'string'){
                        self._ajaxLoad(tree, data);
                    }else if(typeof data == 'object'){
            		   for(var i = 0; i < data.length; i ++ ) {
            			  self.insert(data[i]);
            		   }
            	  }
            	} else {
            		var nextNode = $("#" + target.nid).next();
            		var pid = tree.data("nodes")["pid" + target.nid];
            		self.remove( target );
            		self.insert(target, self.findByNId(pid),self.findByNId(nextNode.attr("id")));
            	}
            
        },
        
        // target equal the ul emelemt
        
        _appendNodes: function(target, nodes, bNode, isDrop) {
            var self = this, ht=[];
            var checkable = self.options.showCheckbox;
            var treeid=self.element.attr("id")?self.element.attr("id"):("treeId"+parseInt(Math.random()*1000));
            self.element.attr("id",treeid);
            for(var i = 0, l = nodes.length; i < l; i++){
                var node = nodes[i], isLastNode = (i == (nodes.length - 1));
                var nodeClass = "ui-tree-node " + (checkable?"treenode-checkable ":"")+(node.hasChildren ? "hasChildren ":"");
                var nid=treeid+"_"+(++self.options.nodeCount);
                node.nid=nid;
                var caches = self.element.data("nodes");
                caches[node.nid] = node;
                if(typeof target == "string"){
                    caches["pid"+node.nid] = target;
                    if(isLastNode){
                        target = null;
                    }
                }else{
                    caches["pid"+node.nid] = target.parent("li").attr("id");
                }
                var childHtml = [];
                if(node.children && node.children.length > 0){
                    childHtml.push((self._appendNodes(node.nid, node.children)).join(""));
                }
                var len = 0;
                if (node.children && (len=node.children.length)>0||node.hasChildren) {
                    if(node.expanded){
                        nodeClass=nodeClass+"open "+CLASSES.collapsable+" "+(isLastNode ? CLASSES.lastCollapsable:"");
                    }else{
                        nodeClass=nodeClass+CLASSES.expandable+" "+(isLastNode ? CLASSES.lastExpandable:"");
                    }
                }else{
                    nodeClass=nodeClass+(isLastNode ? CLASSES.last:"");
                }
                ht.push("<li id='", node.nid, "' class='" ,nodeClass ,"'>");
                if(node.hasChildren || len >0){
                	var classes = "";
                    $.each(nodeClass.split(" "), function() {
                        classes += this + "-hitarea ";
                    });
                	ht.push("<div class='", CLASSES.hitarea +" "+classes, "'/>");
                }
                if(checkable){
                    ht.push("<div class='tree-checkbox'/>");
                }
                var spanClass = (node.classes?node.classes:"");
                if(self.options.showIcon){
                    if(node.hasChildren || node.children && node.children.length>0){
                        spanClass = spanClass + " folder ";
                    }else{
                        spanClass = spanClass + " file ";
                    }    
                }
                ht.push("<span class='", spanClass, "'>", "<a href='#'>", node.text, "</a></span>");
                if (node.hasChildren || len>0) {
                    ht.push("<ul", " style='display:", (node.expanded ? "block": "none"),"'>");
                    ht.push(childHtml.join(''));
                    ht.push("</ul>");
                }
                ht.push("</li>");
            }
            if(bNode){
                if(isDrop){
                    $("#"+bNode.nid).after(ht.join(""));
                }else{
                    $("#"+bNode.nid).before(ht.join(""));
                }
            }else if(target){
                target.append(ht.join(""));
            }
            return ht;
        },
        /**
         * 删除指定pNode的子节点中对应的JSON数据对象为target的节点。
         * @name tree0#remove
         * @function
         * @param target 需要被删除的节点对应的JSON数据，并且该节点数据中包括了nid属性
         * @param pNode 可选，指定的父节点对应的JSON数据对象，不传入，则为树的根节点
         * @example
         * //删除树种对应JSON数据对象为target的节点
         * var target = $('#myTree').tree0("findNode", "text", "node1");
         * $('#myTree').tree0('remove',target);
         */  
        remove: function(target, pNode) {
            var flag, self = this, data=pNode ? pNode.children : self.getData();
            for(var i in data){
                if(data[i] == target){
                    var ids = [];
                    ids = self._findChildrenId(target, ids);
                    ids.push(target.nid);
                    for(var n = 0, len = ids.length; n < len ; n++){
                        delete self.element.data("nodes")[ids[n]];
                        delete self.element.data("nodes")["pid"+ids[n]];
                    }
                    if(target.nid == self.element.data("selected")){
                        this.element.data("selected",null);
                    }
                    var pre = $("#"+target.nid).prev();
                    if($("#"+target.nid).next().length<1 && pre.length > 0){
                        if(pre.hasClass(CLASSES.collapsable)){
                            pre.addClass(CLASSES.lastCollapsable);
                            pre.find("div.hitarea").addClass(CLASSES.lastCollapsableHitarea);
                        }else if(pre.hasClass(CLASSES.expandable)){
                            pre.addClass(CLASSES.lastExpandable);
                            pre.find("div.hitarea").addClass(CLASSES.lastExpandableHitarea);
                        }else{
                            pre.addClass(CLASSES.last);
                        }
                    }
                    $("#"+target.nid).remove();
                    data.splice(i, 1);
                    if(pNode&&pNode.nid&&data.length < 1){
                    	self._changeToFolderOrFile(pNode,false);
                    }
                    return true;
                }else if(data[i].children){
                    flag = self.remove(target, data[i]);
                    if(flag){
                        return true;
                    }
                }
            }
            return false;
        },
        /**
         * 清空所有节点
         */
        removeAll:function(){
            var self=this;
            self.setData([]);
            self.refresh();
        },
        _findChildrenId: function(target, ids){
            if(target.children){
                for(var i = 0, children = target.children, len = children.length; i < len; i++){
                    ids.push(children[i].nid);
                    if(children[i].children){
                        this._findChildrenId(children[i], ids);
                    }
                }
            }
            return ids;
        },
        /**
         * 在指定pNode的子节点中插入一个JSON数据对象为target的节点，并且被插入的节点在指定bNode节点前。
         * @name tree0#insert
         * @function
         * @param target 需要被插入的节点对应的JSON数据对象，并且该节点数据中包括了nid属性
         * @param pNode 可选，指定的父节点对应的JSON数据对象，，并且该节点数据中包括了nid属性，不传入，则为树的根节点
         * @param bNode 可选，指定被插入节点位置，，并且该节点数据中包括了nid属性，不传入，则在pNode子节点的最后插入节点
         * @example
         * //在pNode的子节点后插入对应JSON数据对象为target的节点
         * var target = $('#myTree').tree0("findNode", "text", "node1");
         * $('#myTree').tree0('insert',target，pNode);
         */  

        insert : function(target, pNode, bNode, isDrop) {
            var self = this, nodes=[], parent, otherChildren, flag = $.isArray(target);
            if(flag){
            	nodes = target;
            } else{
            	nodes.push(target);
            }
            if (bNode) { 
                pNode = pNode || self.findByNId(self.element.data("nodes")["pid" + bNode.nid]);
            }
            var index, data = pNode ? pNode.children : self.getData();
            if (pNode && (!pNode.children||pNode.children.length<1)) {
            	if(!pNode.hasChildren){           		
            		self._changeToFolderOrFile(pNode,true);
            		self._bindHitEvent($("#" + pNode.nid));
            	}
                data = pNode.children = [];
            }
            parent = pNode ? $("#" + pNode.nid).children("ul").first() : self.element;
            otherChildren = parent.find("li");
            if (bNode && ((index = $.inArray(bNode, data)) >= 0)) {
                self._appendNodes(parent, nodes, bNode, isDrop);
                data.splice(index, 0, target);
            } else {
                self._appendNodes(parent, nodes, bNode, isDrop);
                if(flag){
                    $.merge(data, target);             
                }else{
                	data.push(target);
                }
            }
            var m = parent.find("li")
                        .filter("." + CLASSES.last + ",." + CLASSES.lastCollapsable+",."+CLASSES.lastExpandable)
                        .not(parent.find("li")
                        .filter(":last-child:not(ul)"));
            m.removeClass(CLASSES.last + " " + CLASSES.lastCollapsable + " " + CLASSES.lastExpandable);
            m.find(" >div").removeClass(CLASSES.lastCollapsableHitarea+" "+CLASSES.lastExpandableHitarea);
            var tdom = parent.find("li").not(otherChildren);                        
            self._applyEvents(tdom);
        },
        
        _changeToFolderOrFile: function(node,isToFolder){
        	var nDom = $("#" + node.nid),self=this;
        	if(isToFolder){
        		var parent = $("<ul/>").css("display",  "block").appendTo(nDom);
        		nDom.addClass("open "+CLASSES.collapsable);
        		self._swapClass(nDom, CLASSES.last, CLASSES.lastCollapsable);
        		node.children = [];
        	}else{
        		nDom.find("ul").remove();
        		nDom.find("div."+CLASSES.hitarea).remove();
        		nDom.filter("."+CLASSES.lastCollapsable+",."+CLASSES.lastExpandable)
        		.removeClass(CLASSES.lastCollapsable+" "+CLASSES.lastExpandable).addClass(CLASSES.last);
        		nDom.removeClass("open "+CLASSES.collapsable+" "+CLASSES.expandable);
        	}
            if(self.options.showIcon) {
                self._swapClass(nDom.children("span"),"file","folder");
            }
        	var hitarea = nDom.filter(":has(>ul)").prepend("<div class=\"" + CLASSES.hitarea + "\"/>").find("div." + CLASSES.hitarea);
            hitarea.each(function() {
                var classes = "";
                $.each($(this).parent().attr("class").split(" "), function() {
                    classes += this + "-hitarea ";
                });
                $(this).addClass( classes );
            });
        },
        
        
        /**
         * 在指定pNode的子节点中将JSON数据对象为target的节点修改其JSON数据对象为newNode。
         * @name tree0#modify
         * @function
         * @param target 需要修改的节点的JSON数据对象，并且该节点数据中包括了nid属性
         * @param newNode 修改后节点的JSON数据对象，并且该节点数据中包括了nid属性
         * @param pNode 可选，指定的父节点对应的JSON数据对象，，并且该节点数据中包括了nid属性，不传入，则为树的根节点
         * @example
         * //将JSON数据对象为target的节点修改其JSON数据对象为newNode
         * var target = $('#myTree').tree0("findNode", "text", "node1");
         * var newNode ={text: "node5"};
         * $('#myTree').tree0('insert',target，newNode);
         */  
        modify: function(target, newNode, pNode) {
        	if(target&&newNode){
        		var self = this, nextNode = $("#" + target.nid).next(), bNode;
                pNode = pNode || this.findByNId(self.element.data("nodes")["pid" + target.nid]);
                if(nextNode.is("ul") || nextNode.is("li"))
                    bNode = self.findByNId(nextNode.attr("id"));
                self.remove(target, pNode);
                self.insert(newNode, pNode, bNode);	
        	}
        },
        /* -------------------- disable and enable node ------------------- */
        disable: function() {
            
        },
        enable: function() {
            
        }
        
        /**
         * 更新数据异常后执行的方法 .错误信息为jQuery.ajax返回的异常信息，可参考jQuery.ajax官方文档。
         * @event
         * @name tree0#onError
         * @param xmlHttpRequest XMLHttpRequest 对象
         * @param textStatus 错误信息
         * @param errorThrown （可选）捕获的异常对象
         * @example
         *  $(".selector").tree0({
         *      onError:function(xmlHttpRequest,textStatus,errorThrown){
         *          alert('error occured');
         *      }
         *  });
         */
        /**
         * 单击树节点触发事件。
         * @event
         * @name tree0#onClick
         * @param nodeData 树节点的json对象
         * @param event 标准的 js event 对象
         * @example
         *  $("#tree").tree0({
         *      onClick: function(nodeData, event){ ... }
         *  });
         */
        /**
         * 双击树节点触发事件。
         * @event
         * @name tree0#onDblClick
         * @param nodeData 树节点的json对象
         * @param event 标准的 js event 对象
         * @example
         *  $("#tree").tree0({
         *      onDblClick: function(nodeData, event){ ... }
         *  });
         */
        /**
         * 右键树节点触发事件。
         * @event
         * @name tree0#onRightClick
         * @param nodeData 树节点的json对象
         * @param event 标准的 js event 对象
         * @example
         *  $("#tree").tree0({
         *      onRightClick: function(nodeData, event){ ... }
         *  });
         */
        /**
         * 树节点装载前触发事件。
         * @event
         * @name tree0#onBeforeLoad
         * @param nodeData 树节点的json对象
         * @example
         *  $("#tree").tree0({
         *      onBeforeLoad: function(nodeData){ ... }
         *  });
         */
        /**
         * 树节点装载成功后触发事件。
         * @event
         * @name tree0#onSuccess
         * @param data 装载成功后获取的数据json
         * @example
         *  $("#tree").tree0({
         *      onSuccess: function(data){ ... }
         *  });
         */
        /**
         * 树节点拖动时触发事件。
         * @event
         * @name tree0#onDrag
         * @param nodeData 树节点的json对象
         * @param event 标准的 js event 对象
         * @example
         *  $("#tree").tree0({
         *      onDrag: function(nodeData, event){ ... }
         *  });
         */
        /**
         * 树节点拖动时触发事件。
         * @event
         * @name tree0#onDrop
         * @param nodeData 树节点的json对象
         * @param event 标准的 js event 对象
         * @example
         *  $("#tree").tree0({
         *      onDrop: function(nodeData, event){ ... }
         *  });
         */
        /**
         * 树节点展开前触发事件。
         * @event
         * @name tree0#onBeforeExpand
         * @param nodeData 树节点的json对象
         * @example
         *  $("#tree").tree0({
         *      onBeforeExpand: function(nodeData){ ... }
         *  });
         */
        /**
         * 树节点收缩前触发事件。
         * @event
         * @name tree0#onBeforeCollapse
         * @param nodeData 树节点的json对象
         * @example
         *  $("#tree").tree0({
         *      onBeforeCollapse: function(nodeData){ ... }
         *  });
         */
        /**
         * 树节点展开后触发事件。
         * @event
         * @name tree0#onExpand
         * @param nodeData 树节点的json对象
         * @example
         *  $("#tree").tree0({
         *      onExpand: function(nodeData){ ... }
         *  });
         */
        /**
         * 树节点收缩后触发事件。
         * @event
         * @name tree0#onCollapse
         * @param nodeData 树节点的json对象
         * @example
         *  $("#tree").tree0({
         *      onCollapse: function(nodeData){ ... }
         *  });
         */
        /**
         * 树节点选中后触发事件。
         * @event
         * @name tree0#onCheck
         * @param nodeData 树节点的json对象
         * @param event 标准的 js event 对象
         * @example
         *  $("#tree").tree0({
         *      onCheck: function(nodeData){ ... }
         *  });
         */
        /**
         * 树节点选择后触发事件。
         * @event
         * @name tree0#onSelect
         * @param nodeData 树节点的json对象
         * @example
         *  $("#tree").tree0({
         *      onSelect: function(nodeData){ ... }
         *  });
         */
        /**
         * 树节点选择前触发事件。
         * @event
         * @name tree0#onBeforeSelect
         * @param nodeData 树节点的json对象
         * @example
         *  $("#tree").tree0({
         *      onBeforeSelect: function(nodeData){ ... }
         *  });
         */
    });
}(jQuery));
