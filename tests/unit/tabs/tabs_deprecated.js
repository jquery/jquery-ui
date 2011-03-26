(function( $ ) {

module("tabs (deprecated): cache and ajaxoptions");

test('ajaxOptions', function() {
	ok(false, "missing test - untested code is broken code.");
});

test('cache', function() {
	ok(false, "missing test - untested code is broken code.");
});

module("tabs (deprecated): spinner");

test('spinner', function() {
	expect(4);
	stop();

	el = $('#tabs2');

	el.tabs({
		selected: 2,
		load: function() {
			// spinner: default spinner
			setTimeout(function() {
				equals($('li:eq(2) > a > span', el).length, 1, "should restore tab markup after spinner is removed");
				equals($('li:eq(2) > a > span', el).html(), '3', "should restore tab label after spinner is removed");
				el.tabs('destroy');
				el.tabs({
					selected: 2,
					spinner: '<img src="spinner.gif" alt="">',
					load: function() {
						// spinner: image
						equals($('li:eq(2) > a > span', el).length, 1, "should restore tab markup after spinner is removed");
						equals($('li:eq(2) > a > span', el).html(), '3', "should restore tab label after spinner is removed");
						start();
					}
				});
			}, 1);
		}
	});
});

module("tabs (deprecated): enable/disable events");

test('enable', function() {
	expect(4);

	var uiObj;
	el = $('#tabs1').tabs({
		disabled: [ 0, 1 ],
		enable: function (event, ui) {
			uiObj = ui;
		}
	});
	el.tabs('enable', 1);
	ok(uiObj !== undefined, 'trigger callback');
	equals(uiObj.tab, $('a', el)[1], 'contain tab as DOM anchor element');
	equals(uiObj.panel, $('div', el)[1], 'contain panel as DOM div element');
	equals(uiObj.index, 1, 'contain index');
});

test('disable', function() {
	expect(4);

	var uiObj;
	el = $('#tabs1').tabs({
		disable: function (event, ui) {
			uiObj = ui;
		}
	});
	el.tabs('disable', 1);
	ok(uiObj !== undefined, 'trigger callback');
	equals(uiObj.tab, $('a', el)[1], 'contain tab as DOM anchor element');
	equals(uiObj.panel, $('div', el)[1], 'contain panel as DOM div element');
	equals(uiObj.index, 1, 'contain index');
});

}( jQuery ) );
