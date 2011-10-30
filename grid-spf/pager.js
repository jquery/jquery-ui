$.widget( "spf.pager", {
	defaultElement: "<span>",
	options: {
		source: null,
		template: '<span id="pager">' +
					'<button data-page="start">First</button>' +
					'<button data-page="prev">Prev</button>' +
					'<span style="margin: 0px 10px;">' +
						'Page <input class="current" size="4"/> of <span class="total">0</span>' +
					'</span>' +
					'<button data-page="next">Next</button>' +
					'<button data-page="end">Last</button>' +
				'</span>'
	},
	_create: function() {
		var that = this;

		this._bind( this.options.source, {
			dataviewresponse: "refresh"
		});

		if ( this.options.template ) {
			this.element.html( this.options.template );
		}

		this.buttons = this.element.delegate("button", "click", function() {
			var method = $(this).data("page");
			that[method]();
			that.options.source.refresh();
		}).buttonset().find("button");

		this.buttons.each(function() {
			var button = $(this),
				type = button.data("page");
			button.button("option", "icons." + (/start|prev/.test(type) ? "primary" : "secondary"), "ui-icon-seek-" + type);
		});

		this.element.find(".current").change(function() {
			that.page( +$(this).val() );
			that.options.source.refresh();
		});
	},
	refresh: function() {
		this.buttons.button("enable");

		var source = this.options.source;
		if (!source.options.paging.offset) {
			this.buttons.filter('[data-page="start"], [data-page="prev"]').button("disable");
		}
		if (source.options.paging.offset + source.options.paging.limit >= source.totalCount) {
			this.buttons.filter('[data-page="end"], [data-page="next"]').button("disable");
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

	start: function() {
		this.page(1);
	},

	prev: function() {
		this.page( this.page() - 1 );
	},

	next: function() {
		this.page( this.page() + 1 );
	},

	end: function() {
		this.page( this.totalPages() );
	}
});
