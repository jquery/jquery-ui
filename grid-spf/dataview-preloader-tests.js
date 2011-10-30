test("preloader", 18, function() {
	var remoteOffset = 0,
		remoteLimit = 10;
	var remote = $.ui.dataviewlocal({
		input: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
		response: function() {
			equal( this.options.paging.offset, remoteOffset );
			equal( this.options.paging.limit, remoteLimit );
		}
	});
	var dataview = $.ui.preloaderDataview({
		paging: {
			limit: 2
		},
		remote: remote
	});
	dataview.refresh();
	deepEqual( dataview.result, [1, 2]);

	dataview.page(2).refresh();
	deepEqual( dataview.result, [3, 4]);

	dataview.page(3).refresh();
	deepEqual( dataview.result, [5, 6]);

	dataview.page(4).refresh();
	deepEqual( dataview.result, [7, 8]);

	remoteOffset = 8;
	dataview.page(5).refresh();
	deepEqual( dataview.result, [9, 10]);

	dataview.page(6).refresh();
	deepEqual( dataview.result, [11, 12]);

	dataview.page(7).refresh();
	deepEqual( dataview.result, [13, 14]);

	dataview.page(8).refresh();
	deepEqual( dataview.result, [15, 16]);

	remoteOffset = 16;
	dataview.page(9).refresh();
	deepEqual( dataview.result, [17, 18]);

	dataview.page(10).refresh();
	deepEqual( dataview.result, [19, 20]);

	dataview.page(11).refresh();
	deepEqual( dataview.result, [21, 22]);

	dataview.page(1).refresh();
	deepEqual( dataview.result, [1, 2]);
});
