/*
 * menu_events.js
 */
(function($) {

module("menu: events");

test("handle click on menu", function() {
	expect(1);
	var ac = $('#menu1').menu({
		select: function(event, ui) {
			log();
		}
	});
	log("click",true);
	clickMenu($('#menu1'),"1");
	log("afterclick");
	clickMenu( ac,"2");
	clickMenu($('#menu1'),"3");
	clickMenu( ac,"1");
	equals( $("#log").html(), "1,3,2,afterclick,1,click,", "Click order not valid.");
});

})(jQuery);
