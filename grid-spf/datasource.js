// port from https://github.com/brado23/jquery-ui/tree/borisGrid/grid-datamodel2
(function ($) {

$.dataSource = function (options) {
	return $.isArray(options.source)
		? new LocalDataSource(options)
		: new RemoteDataSource(options);
};

$.dataSource.oDataSettings = {
    resultsFilter: function (data) {
        this.totalCount = data.d.__count;
        return data.d.results;
    },

    urlMapper: function (path, queryParams, sortProperty, sortDir, filter, skip, take, includeTotalCount) {
        var questionMark = (path.indexOf("?") < 0 ? "?" : "&");
        for (param in queryParams) {
            path = path.split("$" + queryParam).join(queryParams[param]);
        }
        path += questionMark + "$format=json" +
            // TODO -- Without inlineCount, the form of the AJAX result changes and resultsFilter breaks.
            // (includeTotalCount ? "&$inlinecount=allpages" : "") +
            "&$inlinecount=allpages" +
            "&$skip=" + (skip || 0) +
            (take !== null && take !== undefined ? ("&$top=" + take) : "");

        if (sortProperty) {
            path += "&$orderby=" + sortProperty + (sortDir && sortDir.toLowerCase().indexOf("desc") === 0 ? "%20desc" : "");
        }
        if (filter) {
            filter = Object.prototype.toString.call(filter) === "[object Array]" ? filter : [ filter ];
            $.each(filter, function (index, filterPart) {
                path +=
                    "&$filter=" + filterPart.filterProperty + filterPart.filterOperator + 
                    (typeof filterPart.filterBy === "string" ? ("'" + filterPart.filterBy + "'") : filterPart.filterBy);
            });
        }
        return path;
    }
}

function DataSource (options) {
	if (!options) {
		return;
	}
    this._applyOptions(options);
};

DataSource.prototype = {
    _refreshingHandler: null,
    _refreshHandler: null,

    _sortProperty: null,  // TODO -- Generalize these to [ { property: ..., direction: ... } ].
    _sortDir: null,
    _filter: null,
    _skip: null,
    _take: null,
    _includeTotalCount: false,

    items: [],
    totalCount: 0,

    destroy: function () {
        if (this.itemsArray) {
            delete this.itemsArray.__dataSource__;
            this.itemsArray = null;
        }
    },

    option: function (option, value) {
        this._applyOption(option, value);
        return this;
    },

    options: function (options) {
        this._applyOptions(options);
        return this;
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
        this._refresh(options, function () {
            if (self._refreshHandler) {
                self._refreshHandler();
            }
			$(self).trigger("datasourcerefresh");
        });
        return this;
    },

    _applyOption: function (option, value) {
        switch (option) {
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

            default:
                throw "Unrecognized option '" + option + "'";
        }
    },

    // N.B.  Null/undefined option values will unset the given option.
    _applyOptions: function (options) {
        options = options || {};

        var self = this;
        $.each([ "filter", "sort", "paging", "refreshing", "refresh" ], function (index, optionName) {
            self._applyOption(optionName, options[optionName]);
        });
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
                    ">": [">", "isgreaterthan", "greaterthan", "greater", "gt"]
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
        this._includeTotalCount = !!options.includeTotalCount;
    },

    _setSort: function (options) {
        options = options || {};
        this._sortProperty = options.property;
        this._sortDir = options.direction;
    },
	
	toArray: function() {
		return this._items;
	}
};

function LocalDataSource (options) {
    DataSource.call(this, options);
    this._inputItems = options.source;
};

LocalDataSource.prototype = $.extend({}, new DataSource(), {
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
            filteredItems = items;
        }

        var sortedItems;
        if (this._sortProperty) {
            var isAscending = (this._sortDir || "asc").toLowerCase().indexOf("asc") === 0;
            sortedItems = filteredItems.sort(function (item1, item2) {
                var propertyValue1 = self._normalizePropertyValue(item1, self._sortProperty),
                    propertyValue2 = self._normalizePropertyValue(item2, self._sortProperty);
                if (propertyValue1 == propertyValue2) {
                    return 0;
                } else if (propertyValue1 > propertyValue2) {
                    return isAscending ? 1 : -1;
                } else {
                    return isAscending ? -1 : 1;
                }
            });
        } else {
            sortedItems = filteredItems;
        }

        var skip = this._skip || 0,
            pagedItems = sortedItems.slice(skip);
        if (this._take) {
            pagedItems = pagedItems.slice(0, this._take);
        }
        var totalCount = this._includeTotalCount ? sortedItems.length : undefined;

        return { items: pagedItems, totalCount: totalCount };
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
    DataSource.apply(this, [ options ]);

    this._urlMapper = options.urlMapper || function (path, queryParams) {
        return path + queryParams;
    };
	this._jsonp = options.jsonp;
    this._path = options.path;
    this._queryParams = options.queryParams;
    this._resultsFilter = options.resultsFilter;
};

RemoteDataSource.prototype = $.extend({}, new DataSource(), {
    _urlMapper: null,
    _path: null,
    _queryParams: null,
    _resultsFilter: null,

    _refresh: function (options, completed) {
        var self = this,
            queryString = this._urlMapper(this._path, this._queryParams, this._sortProperty, 
                this._sortDir, this._filter, this._skip, this._take, this._includeTotalCount);
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

})(jQuery);
