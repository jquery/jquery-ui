/*
 * accordion_core.js
 */


(function($) {

module("accordion (deprecated): expanded active option, activate method", accordionSetupTeardown() );

test("activate", function() {
	var expected = $('#list1').accordion(),
		actual = expected.accordion('activate', 2);
	equals(actual, expected, 'activate is chainable');
});

test("activate, numeric", function() {
	var ac = $('#list1').accordion({ active: 1 });
	state(ac, 0, 1, 0);
	ac.accordion("activate", 2);
	state(ac, 0, 0, 1);
	ac.accordion("activate", 0);
	state(ac, 1, 0, 0);
	ac.accordion("activate", 1);
	state(ac, 0, 1, 0);
	ac.accordion("activate", 2);
	state(ac, 0, 0, 1);
});

test("activate, boolean and numeric, collapsible:true", function() {
	var ac = $('#list1').accordion({collapsible: true}).accordion("activate", 2);
	state(ac, 0, 0, 1);
	ok("x", "----");
	ac.accordion("activate", 0);
	state(ac, 1, 0, 0);
	ok("x", "----");
	ac.accordion("activate", -1);
	state(ac, 0, 0, 0);
});

test("activate, boolean, collapsible: false", function() {
	var ac = $('#list1').accordion().accordion("activate", 2);
	state(ac, 0, 0, 1);
	ac.accordion("activate", false);
	state(ac, 0, 0, 1);
});

test("activate, string expression", function() {
	var ac = $('#list1').accordion({ active: "h3:last" });
	state(ac, 0, 0, 1);
	ac.accordion("activate", ":first");
	state(ac, 1, 0, 0);
	ac.accordion("activate", ":eq(1)");
	state(ac, 0, 1, 0);
	ac.accordion("activate", ":last");
	state(ac, 0, 0, 1);
});

test("activate, jQuery or DOM element", function() {
	var ac = $('#list1').accordion({ active: $("#list1 h3:last") });
	state(ac, 0, 0, 1);
	ac.accordion("activate", $("#list1 h3:first"));
	state(ac, 1, 0, 0);
	ac.accordion("activate", $("#list1 h3")[1]);
	state(ac, 0, 1, 0);
});

test("{ active: Selector }", function() {
	var ac = $("#list1").accordion({
		active: "h3:last"
	});
	state(ac, 0, 0, 1);
	ac.accordion('option', 'active', "h3:eq(1)");
	state(ac, 0, 1, 0);
});

test("{ active: Element }", function() {
	var ac = $("#list1").accordion({
		active: $("#list1 h3:last")[0]
	});
	state(ac, 0, 0, 1);
	ac.accordion('option', 'active', $("#list1 h3:eq(1)")[0]);
	state(ac, 0, 1, 0);
});

test("{ active: jQuery Object }", function() {
	var ac = $("#list1").accordion({
		active: $("#list1 h3:last")
	});
	state(ac, 0, 0, 1);
	ac.accordion('option', 'active', $("#list1 h3:eq(1)"));
	state(ac, 0, 1, 0);
});






module("accordion (deprecated) - height options", accordionSetupTeardown() );

test("{ autoHeight: true }, default", function() {
	equalHeights($('#navigation').accordion({ autoHeight: true }), 95, 130);
});

test("{ autoHeight: false }", function() {
	var accordion = $('#navigation').accordion({ autoHeight: false });
	var sizes = [];
	accordion.find(".ui-accordion-content").each(function() {
		sizes.push($(this).height());
	});
	ok( sizes[0] >= 70 && sizes[0] <= 90, "was " + sizes[0] );
	ok( sizes[1] >= 98 && sizes[1] <= 126, "was " + sizes[1] );
	ok( sizes[2] >= 42 && sizes[2] <= 54, "was " + sizes[2] );
});

// fillSpace: false == autoHeight: true, covered above
test("{ fillSpace: true }", function() {
	$("#navigationWrapper").height(500);
	equalHeights($('#navigation').accordion({ fillSpace: true }), 446, 458);
});

test("{ fillSpace: true } with sibling", function() {
	$("#navigationWrapper").height(500);
	var sibling = $("<p>Lorem Ipsum</p>");
	$("#navigationWrapper").prepend( sibling.height(100) );
	//sibling.outerHeight(true) == 126
	equalHeights($('#navigation').accordion({ fillSpace: true}), 320, 332);
});

test("{ fillSpace: true } with multiple siblings", function() {
	$("#navigationWrapper").height(500);
	var sibling = $("<p>Lorem Ipsum</p>");
	$("#navigationWrapper")
		.prepend( sibling.clone().height(100) )
		.prepend( sibling.clone().height(100).css( "position", "absolute" ) )
		.prepend( sibling.clone().height(50) );
	//sibling.outerHeight(true) == 126
	equalHeights($('#navigation').accordion({ fillSpace: true}), 244, 256);
});




module("accordion (deprecated) - icons", accordionSetupTeardown() );

test("change headerSelected option after creation", function() {
	var list = $("#list1");
	list.accordion( { icons: { "activeHeader": "test" } } );
	equals( $( "#list1 span.test" ).length, 1);
	list.accordion( "option", "icons", { "headerSelected": "deprecated" } );
	equals( $( "#list1 span.deprecated" ).length, 1);
});





module( "accordion (deprecated) - resize", accordionSetupTeardown() );

test( "resize", function() {
	var expected = $( "#navigation" )
		.parent()
			.height( 300 )
		.end()
		.accordion({
			heightStyle: "fill"
		});
	equalHeights( expected, 246, 258 );

	expected.parent().height( 500 );
	expected.accordion( "resize" );
	equalHeights( expected, 446, 458 );
});




module( "accordion (deprecated) - navigation", accordionSetupTeardown() );

test("{ navigation: true, navigationFilter: header }", function() {
	$("#navigation").accordion({
		navigation: true,
		navigationFilter: function() {
			return /\?p=1\.1\.3$/.test(this.href);
		}
	});
	equals( $("#navigation .ui-accordion-content:eq(2)").size(), 1, "third content active" );
});

test("{ navigation: true, navigationFilter: content }", function() {
	$("#navigation").accordion({
		navigation: true,
		navigationFilter: function() {
			return /\?p=1\.1\.3\.2$/.test(this.href);
		}
	});
	equals( $("#navigation .ui-accordion-content:eq(2)").size(), 1, "third content active" );
});

})(jQuery);
