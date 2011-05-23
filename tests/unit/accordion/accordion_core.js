/*
 * accordion_core.js
 */


(function($) {

module("accordion: core");

test("handle click on header-descendant", function() {
	var ac = $('#navigation').accordion({ autoHeight: false });
	$('#navigation h2:eq(1) a').trigger("click");
	state(ac, 0, 1, 0);
});

test("accessibility", function () {
	expect(13);
	var ac = $('#list1').accordion().accordion("activate", 1);
	var headers = $(".ui-accordion-header");

	equals( headers.eq(1).attr("tabindex"), "0", "active header should have tabindex=0");
	equals( headers.eq(0).attr("tabindex"), "-1", "inactive header should have tabindex=-1");
	equals( ac.attr("role"), "tablist", "main role");
	equals( headers.attr("role"), "tab", "tab roles");
	equals( headers.next().attr("role"), "tabpanel", "tabpanel roles");
	equals( headers.eq(1).attr("aria-expanded"), "true", "active tab has aria-expanded");
	equals( headers.eq(0).attr("aria-expanded"), "false", "inactive tab has aria-expanded");
	equals( headers.eq(1).attr("aria-selected"), "true", "active tab has aria-selected");
	equals( headers.eq(0).attr("aria-selected"), "false", "inactive tab has aria-selected");
	ac.accordion("activate", 0);
	equals( headers.eq(0).attr("aria-expanded"), "true", "newly active tab has aria-expanded");
	equals( headers.eq(1).attr("aria-expanded"), "false", "newly inactive tab has aria-expanded");
	equals( headers.eq(0).attr("aria-selected"), "true", "active tab has aria-selected");
	equals( headers.eq(1).attr("aria-selected"), "false", "inactive tab has aria-selected");
});

})(jQuery);
