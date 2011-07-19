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

test( "handle blur: click", function() {
	expect( 4 );
	var $menu = $( "#menu1" ).menu({
		focus: function( event, ui ) {
			equal( event.originalEvent.type, "click", "focus triggered 'click'" );
			equal( event.type, "menufocus", "focus event.type is 'menufocus'" );

		},
		blur: function( event, ui ) {
			console.log( event, ui );
			equal( event.originalEvent.type, "click", "blur triggered 'click'" );
			equal( event.type, "menublur", "blur event.type is 'menublur'" );
		}
	});

	$menu.find( "li a:first" ).trigger( "click" );
	$( "<a/>", { id: "remove"} ).appendTo("body").trigger( "click" );

	$("#remove").remove();
});

})(jQuery);
