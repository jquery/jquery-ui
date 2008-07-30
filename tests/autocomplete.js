test("init", function() {
	expect(6);

	el = $("#autocomplete").autocomplete();
	ok(true, '.autocomplete() called on element');

	$([]).autocomplete();
	ok(true, '.autocomplete() called on empty collection');

	$("<input/>").autocomplete();
	ok(true, '.autocomplete() called on disconnected DOMElement');

	$("<input/>").autocomplete().autocomplete("foo");
	ok(true, 'arbitrary method called after init');

	$("<input/>").autocomplete().data("foo.autocomplete");
	ok(true, 'arbitrary option getter after init');

	$("<input/>").autocomplete().data("foo.autocomplete", "bar");
	ok(true, 'arbitrary option setter after init');
});

test("destroy", function() {
	expect(6);

	$("#autocomplete").autocomplete().autocomplete("destroy");	
	ok(true, '.autocomplete("destroy") called on element');

	$([]).autocomplete().autocomplete("destroy");
	ok(true, '.autocomplete("destroy") called on empty collection');

	$("<input/>").autocomplete().autocomplete("destroy");
	ok(true, '.autocomplete("destroy") called on disconnected DOMElement');

	$("<input/>").autocomplete().autocomplete("destroy").autocomplete("foo");
	ok(true, 'arbitrary method called after destroy');

	$("<input/>").autocomplete().autocomplete("destroy").data("foo.autocomplete");
	ok(true, 'arbitrary option getter after destroy');

	$("<input/>").autocomplete().autocomplete("destroy").data("foo.autocomplete", "bar");
	ok(true, 'arbitrary option setter after destroy');
});


test("highlighter", function() {
	equals( jQuery.Autocompleter.defaults.highlight("Peter", "Pe"), "<strong>Pe</strong>ter" );
	equals( jQuery.Autocompleter.defaults.highlight("Peter <em>&lt;Pan&gt;</em>", "Pe"), "<strong>Pe</strong>ter <em>&lt;Pan&gt;</em>" );
	equals( jQuery.Autocompleter.defaults.highlight("Peter <em>&lt;Pan&gt;</em>", "a"), "Peter <em>&lt;P<strong>a</strong>n&gt;</em>" );
	equals( jQuery.Autocompleter.defaults.highlight("Peter <em>(&lt;Pan&gt;)</em>", "(&lt;P"), "Peter <em><strong>(&lt;P</strong>an&gt;)</em>" );
});
