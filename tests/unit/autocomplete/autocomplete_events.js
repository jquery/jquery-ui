/*
 * autocomplete_events.js
 */
(function($) {

module("autocomplete: events");

var data = ["c++", "java", "php", "coldfusion", "javascript", "asp", "ruby", "python", "c", "scala", "groovy", "haskell", "pearl"];

test("all events", function() {
	expect(11);
	var ac = $("#autocomplete").autocomplete({
		delay: 0,
		source: data,
		search: function(event) {
			same(event.type, "autocompletesearch");
		},
		open: function(event) {
			same(event.type, "autocompleteopen");
		},
		focus: function(event, ui) {
			same(event.type, "autocompletefocus");
			same(ui.item, {label:"java", value:"java"});
		},
		close: function(event) {
			same(event.type, "autocompleteclose");
			same( $(".ui-menu").length, 1 );
		},
		select: function(event, ui) {
			same(event.type, "autocompleteselect");
			same(ui.item, {label:"java", value:"java"});
		},
		change: function(event) {
			same(event.type, "autocompletechange");
			same( $(".ui-menu").length, 0 );
		}
	});
	stop();
	ac.val("ja").keydown();
	setTimeout(function() {
		same( $(".ui-menu").length, 1 );
		ac.simulate("keydown", { keyCode: $.ui.keyCode.DOWN });
		ac.simulate("keydown", { keyCode: $.ui.keyCode.ENTER });
		start();
	}, 50);
});

test("cancel search", function() {
	expect(6);
	var first = true;
	var ac = $("#autocomplete").autocomplete({
		delay: 0,
		source: data,
		search: function() {
			if (first) {
				same( ac.val(), "ja" );
				first = false;
				return false;
			}
			same( ac.val(), "java" );
		},
		open: function() {
			ok(true);
		}
	});
	stop();
	ac.val("ja").keydown();
	setTimeout(function() {
		same( $(".ui-menu").length, 0 );
		ac.val("java").keydown();
		setTimeout(function() {
			same( $(".ui-menu").length, 1 );
			same( $(".ui-menu .ui-menu-item").length, 2 );
			start();
		}, 50);
	}, 50);
});

test("cancel focus", function() {
	expect(1);
	var customVal = 'custom value';
	var ac = $("#autocomplete").autocomplete({
		delay: 0,
		source: data,
		focus: function(event, ui) {
			$(this).val(customVal);
			return false;
		}
	});
	stop();
	ac.val("ja").keydown();
	setTimeout(function() {
		ac.simulate("keydown", { keyCode: $.ui.keyCode.DOWN });
		same( ac.val(), customVal );
		start();
	}, 50);
});

test("cancel select", function() {
	expect(1);
	var customVal = 'custom value';
	var ac = $("#autocomplete").autocomplete({
		delay: 0,
		source: data,
		select: function(event, ui) {
			$(this).val(customVal);
			return false;
		}
	});
	stop();
	ac.val("ja").keydown();
	setTimeout(function() {
		ac.simulate("keydown", { keyCode: $.ui.keyCode.DOWN });
		ac.simulate("keydown", { keyCode: $.ui.keyCode.ENTER });
		same( ac.val(), customVal );
		start();
	}, 50);
});

})(jQuery);
