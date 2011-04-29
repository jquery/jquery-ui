$.widget( "spf.pager", {
	options: {
		source: null,
		pageSize: 2
	},
	_create: function() {
		var that = this;

		// TODO add a datasource method for this
		$( this.options.source ).bind( "datasourceresponse", function() {
			that.refresh();
		});
		
		this.buttons = this.element.delegate("button", "click", function() {
			var method = $(this).data("page");
			that[method]();
			that.options.source.refresh();
		}).buttonset().find("button");

		this.element.find(".current").change(function() {
			that.page( +$(this).val() );
			that.options.source.refresh();
		});
	},
	refresh: function() {	
		this.buttons.button("enable");
		
		var source = this.options.source;
		if (!source.options.paging.offset) {
			this.buttons.slice(0, 3).button("disable")
		}
		if (source.options.paging.offset + source.options.paging.limit >= source.totalCount) {
			this.buttons.slice(3, 6).button("disable")
		}
		this.element.find(".current").val(this.page());
		this.element.find(".total").text(this.totalPages());
		this.element.find(".totalRecords").text(source.totalCount);
	},
	
	totalPages: function() {
		return this.options.source.totalPages();
	},
	
	page: function(pageIndex) {
		return this.options.source.page(pageIndex);
	},
	
	first: function() {
		this.page(1);
	},
	
	prevStep: function() {
		this.options.source.options.paging.offset -= 1;
	},
	
	prev: function() {
		this.page( this.page() - 1 )
	},
	
	next: function() {
		this.page( this.page() + 1 )
	},
	
	nextStep: function() {
		this.options.source.options.paging.offset += 1;
	},
	
	last: function() {
		this.page( this.totalPages() );
	}
});