/*
 * autocomplete_events.js
 */
(function($) {

module("autocomplete: events", {
	teardown: function() {
		$( ":ui-autocomplete" ).autocomplete( "destroy" );
	}
});

var data = [ "Clojure", "COBOL", "ColdFusion", "Java", "JavaScript", "Scala", "Scheme" ];

test("all events", function() {
	expect(14);
	var ac = $("#autocomplete").autocomplete({
		autoFocus: false,
		delay: 0,
		source: data,
		search: function(event) {
			same(event.type, "autocompletesearch");
		},
		response: function(event, ui) {
			same(event.type, "autocompleteresponse");
			same(ui.content, [
				{ label: "Clojure", value: "Clojure" },
				{ label: "Java", value: "Java" },
				{ label: "JavaScript", value: "JavaScript" }
			]);
			ui.content.splice( 0, 1 );
		},
		open: function(event) {
			same(event.type, "autocompleteopen");
		},
		focus: function(event, ui) {
			same(event.type, "autocompletefocus");
			same(ui.item, {label:"Java", value:"Java"});
		},
		close: function(event) {
			same(event.type, "autocompleteclose");
			same( $(".ui-menu:visible").length, 0 );
		},
		select: function(event, ui) {
			same(event.type, "autocompleteselect");
			same(ui.item, {label:"Java", value:"Java"});
		},
		change: function(event, ui) {
			same(event.type, "autocompletechange");
			same(ui.item, {label:"Java", value:"Java"});
			same( $(".ui-menu:visible").length, 0 );
			start();
		}
	});
	stop();
	ac.focus().val("j").keydown();
	setTimeout(function() {
		same( $(".ui-menu:visible").length, 1 );
		ac.simulate("keydown", { keyCode: $.ui.keyCode.DOWN });
		ac.simulate("keydown", { keyCode: $.ui.keyCode.ENTER });
		// blurring through jQuery causes a bug in IE 6 which causes the
		// autocompletechange event to occur twice
		ac[0].blur();
	}, 50);
});

test("all events - contenteditable", function() {
	expect(14);
	var ac = $("#autocomplete-contenteditable").autocomplete({
		autoFocus: false,
		delay: 0,
		source: data,
		search: function(event) {
			same(event.type, "autocompletesearch");
		},
		response: function(event, ui) {
			same(event.type, "autocompleteresponse");
			same(ui.content, [
				{ label: "Clojure", value: "Clojure" },
				{ label: "Java", value: "Java" },
				{ label: "JavaScript", value: "JavaScript" }
			]);
			ui.content.splice( 0, 1 );
		},
		open: function(event) {
			same(event.type, "autocompleteopen");
		},
		focus: function(event, ui) {
			same(event.type, "autocompletefocus");
			same(ui.item, {label:"Java", value:"Java"});
		},
		close: function(event) {
			same(event.type, "autocompleteclose");
			same( $(".ui-menu:visible").length, 0 );
		},
		select: function(event, ui) {
			same(event.type, "autocompleteselect");
			same(ui.item, {label:"Java", value:"Java"});
		},
		change: function(event, ui) {
			same(event.type, "autocompletechange");
			same(ui.item, {label:"Java", value:"Java"});
			same( $(".ui-menu:visible").length, 0 );
			start();
		}
	});
	stop();
	ac.focus().text("j").keydown();
	setTimeout(function() {
		same( $(".ui-menu:visible").length, 1 );
		ac.simulate("keydown", { keyCode: $.ui.keyCode.DOWN });
		ac.simulate("keydown", { keyCode: $.ui.keyCode.ENTER });
		// blurring through jQuery causes a bug in IE 6 which causes the
		// autocompletechange event to occur twice
		ac[0].blur();
	}, 50);
});

test("change without selection", function() {
	expect(2);
	stop();
	var ac = $("#autocomplete").autocomplete({
		delay: 0,
		source: data,
		change: function(event, ui) {
			same(event.type, "autocompletechange");
			same(ui.item, null);
			start();
		}
	});
	ac.triggerHandler("focus");
	ac.val("ja").triggerHandler("blur");
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
		same( $(".ui-menu:visible").length, 0 );
		ac.val("java").keydown();
		setTimeout(function() {
			same( $(".ui-menu:visible").length, 1 );
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
