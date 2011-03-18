/*
 * autocomplete_options.js
 */
(function($) {

module("autocomplete: options", {
	teardown: function() {
		$( ":ui-autocomplete" ).autocomplete( "destroy" );
	}
});


/* disabled until autocomplete actually has built-in support for caching 
// returns at most 4 items
function source(request) {
	ok(true, "handling a request");
	switch(request.term) {
	case "cha":
		return ["Common Pochard", "Common Chiffchaff", "Common Chaffinch", "Iberian Chiffchaff"]
	case "chaf":
	case "chaff":
		return ["Common Chiffchaff", "Common Chaffinch", "Iberian Chiffchaff"]
	case "chaffi":
		return ["Common Chaffinch"]
	case "schi":
		return ["schifpre"]
	}
}

function search(input) {
	var autocomplete = input.data("autocomplete");
	autocomplete.search("cha");
	autocomplete.close();
	autocomplete.search("chaf");
	autocomplete.close();
	autocomplete.search("chaff");
	autocomplete.close();
	autocomplete.search("chaffi");
	autocomplete.close();
	autocomplete.search("schi");
}
	
test("cache: default", function() {
	expect(2);
	search($("#autocomplete").autocomplete({
		source: source
	}));
});

test("cache: {limit:4}", function() {
	expect(3);
	search($("#autocomplete").autocomplete({
		cache: {
			limit: 4
		},
		source: source
	}));
});

test("cache: false", function() {
	expect(5);
	search($("#autocomplete").autocomplete({
		cache: false,
		source: source
	}));
});
*/

var data = ["c++", "java", "php", "coldfusion", "javascript", "asp", "ruby", "python", "c", "scala", "groovy", "haskell", "perl"];

test( "appendTo", function() {
	var ac = $( "#autocomplete" ).autocomplete();
	same( ac.autocomplete( "widget" ).parent()[0], document.body, "defaults to body" );
	ac.autocomplete( "destroy" );

	ac.autocomplete({
		appendTo: "#ac-wrap2"
	});
	same( ac.autocomplete( "widget" ).parent()[0], $( "#ac-wrap2" )[0], "id" );
	ac.autocomplete( "destroy" );

	ac.autocomplete({
		appendTo: ".ac-wrap"
	});
	same( ac.autocomplete( "widget" ).parent()[0], $( "#ac-wrap1" )[0], "class" );
	same( $( "#ac-wrap2 .ui-autocomplete").length, 0, "class - only appends to one element")
	ac.autocomplete( "destroy" );

	ac.autocomplete({
		appendTo: null
	});
	same( ac.autocomplete( "widget" ).parent()[0], document.body, "null" );
	ac.autocomplete( "destroy" );
	
	ac.autocomplete().autocomplete( "option", "appendTo", "#ac-wrap1" );
	same( ac.autocomplete( "widget" ).parent()[0], $( "#ac-wrap1" )[0], "modified after init" );
	ac.autocomplete( "destroy" );
});

function autoFocusTest( afValue, focusedLength ) {
	var ac = $( "#autocomplete" ).autocomplete({
		autoFocus: afValue,
		delay: 0,
		source: data,
		open: function( event, ui ) {
			equal( ac.autocomplete( "widget" ).children( ".ui-menu-item:first .ui-state-hover" ).length, focusedLength, "first item is " + afValue ? "" : "not" + " auto focused" );
			start();			
		}
	});
	ac.val( "ja" ).keydown();
	stop();
}

test( "autoFocus: false", function() {
	autoFocusTest( false, 0 );
});

test( "autoFocus: true", function() {
	autoFocusTest( true, 1 );
});

test("delay", function() {
	var ac = $("#autocomplete").autocomplete({
		source: data,
		delay: 50
	});
	ac.val("ja").keydown();
	
	same( $(".ui-menu:visible").length, 0 );
	
	// wait half a second for the default delay to open the menu
	stop();
	setTimeout(function() {
		same( $(".ui-menu:visible").length, 1 );
		ac.autocomplete("destroy");
		start();		
	}, 100);
});

test("disabled", function() {
	var ac = $("#autocomplete").autocomplete({
		source: data,
		delay: 0,
		disabled: true
	});
	ac.val("ja").keydown();
	
	same( $(".ui-menu:visible").length, 0 );
	
	stop();
	setTimeout(function() {
		same( $(".ui-menu:visible").length, 0 );
		ac.autocomplete("destroy");
		start();
	}, 50);
});

test("minLength", function() {
	var ac = $("#autocomplete").autocomplete({
		source: data
	});
	ac.autocomplete("search", "");
	same( $(".ui-menu:visible").length, 0, "blank not enough for minLength: 1" );
	
	ac.autocomplete("option", "minLength", 0);
	ac.autocomplete("search", "");
	same( $(".ui-menu:visible").length, 1, "blank enough for minLength: 0" );
	ac.autocomplete("destroy");
});

test("source, local string array", function() {
	var ac = $("#autocomplete").autocomplete({
		source: data
	});
	ac.val("ja").autocomplete("search");
	same( $(".ui-menu .ui-menu-item").text(), "javajavascript" );
	ac.autocomplete("destroy");
});

function source_test(source, async) {
	var ac = $("#autocomplete").autocomplete({
		source: source
	});
	ac.val("ja").autocomplete("search");
	function result(){
		same( $(".ui-menu .ui-menu-item").text(), "javajavascript" );
		ac.autocomplete("destroy");
		async && start();
	}
	if (async) {
		stop();
		$(document).one("ajaxStop", result);
	} else {
		result();
	}
}

test("source, local object array, only label property", function() {
	source_test([
		{label:"java"},
		{label:"php"},
		{label:"coldfusion"},
		{label:"javascript"}
	]);
});

test("source, local object array, only value property", function() {
	source_test([
		{value:"java"},
		{value:"php"},
		{value:"coldfusion"},
		{value:"javascript"}
	]);
});

test("source, url string with remote json string array", function() {
	source_test("remote_string_array.txt", true);
});

test("source, url string with remote json object array, only value properties", function() {
	source_test("remote_object_array_values.txt", true);
});

test("source, url string with remote json object array, only label properties", function() {
	source_test("remote_object_array_labels.txt", true);
});

test("source, custom", function() {
	source_test(function(request, response) {
		same( request.term, "ja" );
		response(["java", "javascript"]);
	});
});

test("source, update after init", function() {
	var ac = $("#autocomplete").autocomplete({
		source: ["java", "javascript", "haskell"]
	});
	ac.val("ja").autocomplete("search");
	same( $(".ui-menu .ui-menu-item").text(), "javajavascript" );
	ac.autocomplete("option", "source", ["php", "asp"]);
	ac.val("ph").autocomplete("search");
	same( $(".ui-menu .ui-menu-item").text(), "php" );
	ac.autocomplete("destroy");
});

})(jQuery);
