test("highlighter", function() {
	equals( jQuery.Autocompleter.defaults.highlight("Peter", "Pe"), "<strong>Pe</strong>ter" );
	equals( jQuery.Autocompleter.defaults.highlight("Peter <em>&lt;Pan&gt;</em>", "Pe"), "<strong>Pe</strong>ter <em>&lt;Pan&gt;</em>" );
	equals( jQuery.Autocompleter.defaults.highlight("Peter <em>&lt;Pan&gt;</em>", "a"), "Peter <em>&lt;P<strong>a</strong>n&gt;</em>" );
	equals( jQuery.Autocompleter.defaults.highlight("Peter <em>(&lt;Pan&gt;)</em>", "(&lt;P"), "Peter <em><strong>(&lt;P</strong>an&gt;)</em>" );
});
