TestHelpers.sortable = {
	sort: function(handle, dx, dy, index, msg) {
		$(handle).simulate("drag", {
			dx: dx || 0,
			dy: dy || 0
		});
		equal($(handle).parent().children().index(handle), index, msg);
	}
};