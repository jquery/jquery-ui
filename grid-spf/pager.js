$.widget( "spf.pager", {
	options: {
		source: null
	},
	_create: function() {
		var that = this;

		// TODO add a dataview method for this
		$( this.options.source ).bind( "dataviewresponse", function() {
			that.refresh();
		});

		this.buttons = this.element.delegate("button", "click", function() {
			var method = $(this).data("page");
			that[method]();
			that.options.source.refresh();
		}).buttonset().find("button");

		// TODO refactor
		this.buttons.filter('[data-page="first"]').button("option", "icons.primary", "ui-icon-seek-first");
		this.buttons.filter('[data-page="prev"]').button("option", "icons.primary", "ui-icon-seek-prev");
		this.buttons.filter('[data-page="next"]').button("option", "icons.secondary", "ui-icon-seek-next");
		this.buttons.filter('[data-page="last"]').button("option", "icons.secondary", "ui-icon-seek-end");

		this.element.find(".current").change(function() {
			that.page( +$(this).val() );
			that.options.source.refresh();
		});
	},
	refresh: function() {
		this.buttons.button("enable");

		var source = this.options.source;
		if (!source.options.paging.offset) {
			this.buttons.filter('[data-page="first"], [data-page="prev"], [data-page="prevStep"]').button("disable");
		}
		if (source.options.paging.offset + source.options.paging.limit >= source.totalCount) {
			this.buttons.filter('[data-page="last"], [data-page="next"], [data-page="nextStep"]').button("disable");
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
		this.page( this.page() - 1 );
	},

	next: function() {
		this.page( this.page() + 1 );
	},

	nextStep: function() {
		this.options.source.options.paging.offset += 1;
	},

	last: function() {
		this.page( this.totalPages() );
	}
});
