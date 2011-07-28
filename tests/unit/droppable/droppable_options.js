/*
 * droppable_options.js
 */
(function($) {

module("droppable: options");

test("{ addClasses: true }, default", function() {
	equals(droppable_defaults.addClasses, true);

	el = $("<div></div>").droppable({ addClasses: true });
	ok(el.is(".ui-droppable"), "'ui-droppable' class added");
	el.droppable("destroy");
});

test("{ addClasses: false }", function() {
	el = $("<div></div>").droppable({ addClasses: false });
	ok(!el.is(".ui-droppable"), "'ui-droppable' class not added");
	el.droppable("destroy");
});

})(jQuery);
