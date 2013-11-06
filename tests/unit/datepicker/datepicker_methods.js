/*
 * datepicker_methods.js
 */
(function( $ ) {

module( "datepicker: methods" );

test( "destroy", function() {
	expect( 9 );
	var inl,
		inp = TestHelpers.datepicker.init( "#inp" );

	ok( inp.datepicker( "instance" ), "instance created" );
	ok( inp.attr( "aria-owns" ), "aria-owns attribute added" );
	ok( inp.attr( "aria-haspopup" ), "aria-haspopup attribute added" );
	inp.datepicker( "destroy" );
	ok( !inp.datepicker( "instance" ), "instance removed" );
	ok( !inp.attr( "aria-owns" ), "aria-owns attribute removed" );
	ok( !inp.attr( "aria-haspopup" ), "aria-haspopup attribute removed" );

	inl = TestHelpers.datepicker.init( "#inl" );
	ok( inl.datepicker( "instance" ), "instance created" );
	ok( inl.children().length > 0, "inline datepicker has children" );
	inl.datepicker( "destroy" );
	ok( !inl.datepicker( "instance" ), "instance removed" );
	// TODO: Destroying inline datepickers currently does not work.
	// ok( inl.children().length === 0, "inline picker no longer has children" );
});

test("enableDisable", function() {
	expect( 33 );
	var inl, dp,
		inp = TestHelpers.datepicker.init("#inp");
	ok(!inp.datepicker("isDisabled"), "Enable/disable - initially marked as enabled");
	ok(!inp[0].disabled, "Enable/disable - field initially enabled");
	inp.datepicker("disable");
	ok(inp.datepicker("isDisabled"), "Enable/disable - now marked as disabled");
	ok(inp[0].disabled, "Enable/disable - field now disabled");
	inp.datepicker("enable");
	ok(!inp.datepicker("isDisabled"), "Enable/disable - now marked as enabled");
	ok(!inp[0].disabled, "Enable/disable - field now enabled");
	inp.datepicker("destroy");
	// With a button
	inp = TestHelpers.datepicker.init("#inp", {showOn: "button"});
	ok(!inp.datepicker("isDisabled"), "Enable/disable button - initially marked as enabled");
	ok(!inp[0].disabled, "Enable/disable button - field initially enabled");
	ok(!inp.next("button")[0].disabled, "Enable/disable button - button initially enabled");
	inp.datepicker("disable");
	ok(inp.datepicker("isDisabled"), "Enable/disable button - now marked as disabled");
	ok(inp[0].disabled, "Enable/disable button - field now disabled");
	ok(inp.next("button")[0].disabled, "Enable/disable button - button now disabled");
	inp.datepicker("enable");
	ok(!inp.datepicker("isDisabled"), "Enable/disable button - now marked as enabled");
	ok(!inp[0].disabled, "Enable/disable button - field now enabled");
	ok(!inp.next("button")[0].disabled, "Enable/disable button - button now enabled");
	inp.datepicker("destroy");
	// With an image button
	inp = TestHelpers.datepicker.init("#inp", {showOn: "button", buttonImageOnly: true,
		buttonImage: "images/calendar.gif"});
	ok(!inp.datepicker("isDisabled"), "Enable/disable image - initially marked as enabled");
	ok(!inp[0].disabled, "Enable/disable image - field initially enabled");
	ok(parseFloat(inp.next("img").css("opacity")) === 1, "Enable/disable image - image initially enabled");
	inp.datepicker("disable");
	ok(inp.datepicker("isDisabled"), "Enable/disable image - now marked as disabled");
	ok(inp[0].disabled, "Enable/disable image - field now disabled");
	ok(parseFloat(inp.next("img").css("opacity")) !== 1, "Enable/disable image - image now disabled");
	inp.datepicker("enable");
	ok(!inp.datepicker("isDisabled"), "Enable/disable image - now marked as enabled");
	ok(!inp[0].disabled, "Enable/disable image - field now enabled");
	ok(parseFloat(inp.next("img").css("opacity")) === 1, "Enable/disable image - image now enabled");
	inp.datepicker("destroy");
	// Inline
	inl = TestHelpers.datepicker.init("#inl", {changeYear: true});
	dp = $(".ui-datepicker-inline", inl);
	ok(!inl.datepicker("isDisabled"), "Enable/disable inline - initially marked as enabled");
	ok(!dp.children().is(".ui-state-disabled"), "Enable/disable inline - not visually disabled initially");
	ok(!dp.find("select").prop("disabled"), "Enable/disable inline - form element enabled initially");
	inl.datepicker("disable");
	ok(inl.datepicker("isDisabled"), "Enable/disable inline - now marked as disabled");
	ok(dp.children().is(".ui-state-disabled"), "Enable/disable inline - visually disabled");
	ok(dp.find("select").prop("disabled"), "Enable/disable inline - form element disabled");
	inl.datepicker("enable");
	ok(!inl.datepicker("isDisabled"), "Enable/disable inline - now marked as enabled");
	ok(!dp.children().is(".ui-state-disabled"), "Enable/disable inline - not visiually disabled");
	ok(!dp.find("select").prop("disabled"), "Enable/disable inline - form element enabled");
	inl.datepicker("destroy");
});

})( jQuery );
