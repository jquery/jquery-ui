(function( $, undefined ) {

$.widget( "ui.abstractDataSource", {
    _refreshingHandler: null,
    _refreshHandler: null,

    _sort: null,
    _filter: null,
    _skip: null,
    _take: null,

    items: [],
    totalCount: 0,
    defaultElement: null,

	options: {
	},

	min: 0,

    _create: function() {
	},

	_destroy: function() {
        if (this.itemsArray) {
            delete this.itemsArray.__dataSource__;
            this.itemsArray = null;
        }
    },

    refresh: function (options) {
        if (options) {
            var hasDataSourceOptions;
            for (optionName in options) {
                if (optionName !== "all") {
                    hasDataSourceOptions = true;
                    break;
                }
            }
            if (hasDataSourceOptions) {
                // _applyOptions trounces all the old query options, so only call if we really have options here.
                this._applyOptions(options);
            }
        }
        if (this._refreshingHandler) {
            this._refreshingHandler();
        }
        var self = this;
		$(self).trigger("datasourcerequest");
        this._refresh(options, function () {
            if (self._refreshHandler) {
                self._refreshHandler();
            }
			$(self).trigger("datasourceresponse");
        });
        return this;
    },

	_setOption: function( key, value ) {
        switch (key) {
            case "filter":
                this._setFilter(value);
                break;

            case "sort":
                this._setSort(value);
                break;

            case "paging":
                this._setPaging(value);
                break;

            case "refreshing":
                this._refreshingHandler = value;
                break;

            case "refresh":
                this._refreshHandler = value;
                break;
        }
		this._super( "_setOption", key, value );
	},

    _processFilter: function (filter) {
        var filterProperty = filter.property,
            filterValue = filter.value,
            filterOperator;
        if (!filter.operator) {
            filterOperator = "==";
        } else {
            var operatorStrings = {
                    "<": ["<", "islessthan", "lessthan", "less", "lt"],
                    "<=": ["<=", "islessthanorequalto", "lessthanequal", "lte"],
                    "==": ["==", "isequalto", "equals", "equalto", "equal", "eq"],
                    "!=": ["!=", "isnotequalto", "notequals", "notequalto", "notequal", "neq", "not"],
                    ">=": [">=", "isgreaterthanorequalto", "greaterthanequal", "gte"],
                    ">": [">", "isgreaterthan", "greaterthan", "greater", "gt"],
					"like": ["like"]
                },
                lowerOperator = filter.operator.toLowerCase();
            for (op in operatorStrings) {
                if ($.inArray(lowerOperator, operatorStrings[op]) > -1) {
                    filterOperator = op;
                    break;
                }
            }

            if (!filterOperator) {
                throw "Unrecognized filter operator '" + filter.operator + "'.";
            }
        }

        return {
            filterProperty: filterProperty,
            filterOperator: filterOperator,
            filterValue: filterValue
        };
    },

    _refresh: function (options, completed) {
        throw "'_refresh' is a pure virtual function";
    },

    _setFilter: function (filter) {
        throw "'_setFilter' is a pure virtual function";
    },

    _setPaging: function (options) {
        options = options || {};
        this._skip = options.skip;
        this._take = options.take;
    },

    _setSort: function (options) {
		this._sort = options;
    },

	toArray: function() {
		return this._items;
	}
});

function LocalDataSource (options)
{
    $.ui.abstractDataSource.call(this, options);
    this._inputItems = options.source;
    this._setOptions (options);
}

LocalDataSource.prototype = $.extend ({}, new $.ui.abstractDataSource(), {
    _inputItems: [],

    _applyQuery: function () {
        var items = this._inputItems;
        var self = this;

        var filteredItems;
        if (this._filter) {
            filteredItems = $.grep(items, function (item, index) { 
                return self._filter(item);
            });
        } else {
			// copy input array to avoid sorting original
            filteredItems = $.makeArray(items);
        }

        var sortedItems;
        if (this._sort && this._sort.length) {
			function sorter(property, direction, secondary) {
				var order = (direction || "asc").toLowerCase().indexOf("asc") === 0 ? 1 : -1;
				return function (item1, item2) {
	                var value1 = self._normalizePropertyValue(item1, property),
	                    value2 = self._normalizePropertyValue(item2, property);
	                if (value1 == value2) {
						if (secondary.length) {
							var next = secondary[0]
							return sorter(next.property, next.direction, secondary.slice(1))(item1, item2);
						} else {
							return 0;
						}
					}
					return order * (value1 > value2 ? 1 : -1);
	            }
			}
			var first = this._sort[0];
            sortedItems = filteredItems.sort(sorter(first.property, first.direction, this._sort.slice(1)));
        } else {
            sortedItems = filteredItems;
        }

        var skip = this._skip || 0,
            pagedItems = sortedItems.slice(skip);
        if (this._take) {
            pagedItems = pagedItems.slice(0, this._take);
        }

        return { items: pagedItems, totalCount: sortedItems.length };
    },

    _createFilterFunction: function (filter) {
        var self = this;
        if (Object.prototype.toString.call(filter) === "[object Array]") {
            var comparisonFunctions = $.map(filter, function (subfilter) {
                return createFunction(subfilter);
            });
            return function (item) {
                for (var i = 0; i < comparisonFunctions.length; i++) {
                    if (!comparisonFunctions[i](item)) {
                        return false;
                    }
                }
                return true;
            };
        } else {
            return createFunction(filter);
        }

        function createFunction (filter) {
            var processedFilter = self._processFilter(filter),
                filterProperty = processedFilter.filterProperty,
                filterOperator = processedFilter.filterOperator,
                filterValue = processedFilter.filterValue;

            var comparer;
            switch (filterOperator) {
                case "<": comparer = function (propertyValue) { return propertyValue < filterValue; }; break;
                case "<=": comparer = function (propertyValue) { return propertyValue <= filterValue; }; break;
                case "==": comparer = function (propertyValue) { return propertyValue == filterValue; }; break;
                case "!=": comparer = function (propertyValue) { return propertyValue != filterValue; }; break;
                case ">=": comparer = function (propertyValue) { return propertyValue >= filterValue; }; break;
                case ">": comparer = function (propertyValue) { return propertyValue > filterValue; }; break;
                default: throw "Unrecognized filter operator.";
            };

            return function (item) {
                // Can't trust added items, for instance, to have all required property values.
                var propertyValue = self._normalizePropertyValue(item, filterProperty);
                return comparer(propertyValue);
            };
        };
    },

    _normalizePropertyValue: function (item, property) {
        return item[property] || "";
    },

    _refresh: function (options, completed) {
        var self = this;
        if (options && !!options.all) {
            var inputDataSource = $([ this._inputItems ]).dataSource();
            if (inputDataSource) {
                // If the input array is bound to a data source, refresh it as well.
                inputDataSource.refresh({
                    all: true,
                    completed: function () {
                        completeRefresh();
                    }
                });
            }
        } else {
            completeRefresh();
        }

        function completeRefresh() {
            var results = self._applyQuery();
            self.totalCount = results.totalCount;
			self._items = results.items;

            if (options && options.completed && $.isFunction(options.completed)) {
                options.completed();
            }
            completed();
        };
    },

    _setFilter: function (filter) {
        this._filter = (!filter || $.isFunction(filter)) ? filter : this._createFilterFunction(filter);
    }

});


function RemoteDataSource (options) {
    $.ui.abstractDataSource.call(this, options);
    this._setOptions (options);

    this._urlMapper = options.urlMapper || function (path, queryParams) {
        return path + queryParams;
    };
	this._jsonp = options.jsonp;
    this._path = options.path;
    this._queryParams = options.queryParams;
    this._resultsFilter = options.resultsFilter;
};

RemoteDataSource.prototype = $.extend({}, new $.ui.abstractDataSource(), {
    _urlMapper: null,
    _path: null,
    _queryParams: null,
    _resultsFilter: null,

    _refresh: function (options, completed) {
        var self = this,
            queryString = this._urlMapper(this._path, this._queryParams, this._sort, this._filter, this._skip, this._take);
        $.ajax({
            dataType: "jsonp",
            url: queryString,
            jsonp: self._jsonp,
            success: function (data) {
                var newItems = self._resultsFilter ? self._resultsFilter(data) : data;
                // _resultsFilter has the option of setting this.totalCount.
				self._items = newItems;
                completed();
            }
        });
    },

    _setFilter: function (filter) {
        if (!filter) {
            this._filter = null;  // Passing null/undefined means clear filter.
        } else if (Object.prototype.toString.call(filter) === "[object Array]") {
            var self = this;
            this._filter = $.map(filter, function (subfilter) {
                return self._processFilter(subfilter);
            });
        } else {
            this._filter = [ this._processFilter(filter) ];
        }
    }
	
});

$.dataSource = function (options) {
    if($.isArray (options.source))
    {
        return new LocalDataSource (options);
    }
    else
    {
        return new RemoteDataSource (options);
    }

};

// oDataSettings for the RemoteDataSource
$.dataSource.oDataSettings = {
    resultsFilter: function (data) {
        this.totalCount = data.d.__count;
        return data.d.results;
    },

    urlMapper: function (path, queryParams, sort, filter, skip, take) {
        var questionMark = (path.indexOf("?") < 0 ? "?" : "&");
        for (param in queryParams) {
            path = path.split("$" + queryParam).join(queryParams[param]);
        }
        path += questionMark + "$format=json" +
            "&$inlinecount=allpages" +
            "&$skip=" + (skip || 0) +
            (take !== null && take !== undefined ? ("&$top=" + take) : "");

        if (sort && sort.length) {
			var sorts = [];
			$.each(sort, function (index, sortPart) {
				sorts[sorts.length] = sortPart.property + (sortPart.direction && sortPart.direction.toLowerCase().indexOf("desc") === 0 ? "%20desc" : "");
			});
            path += "&$orderby=" + sorts.join(","); 
        }
        if (filter) {
			// see http://www.odata.org/developers/protocols/uri-conventions#FilterSystemQueryOption
            filter = Object.prototype.toString.call(filter) === "[object Array]" ? filter : [ filter ];
			var filters = []
            $.each(filter, function (index, filterPart) {
				if (filterPart.filterOperator == "like") {
					filters[filters.length] = "indexof(" + filterPart.filterProperty + ", '" + filterPart.filterValue + "') ge 0";
				} else {
					var operators = {
						"<": "lt",
						"<=": "le",
						">": "gt",
						">=": "ge",
						"==": "eq",
						"!=": "ne"
					};
	                filters[filters.length] = filterPart.filterProperty + " " + operators[filterPart.filterOperator] + " " + 
	                    (typeof filterPart.filterValue === "string" ? ("'" + filterPart.filterValue + "'") : filterPart.filterValue);
					
				}
				
            });
			path += "&$filter=" + filters.join(" and ");
        }
		console.log("odata url: " + path)
        return path;
    }
}
})( jQuery );
