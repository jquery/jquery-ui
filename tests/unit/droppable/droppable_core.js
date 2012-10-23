/*
 * droppable_core.js
 */

var el;

TestHelpers.shouldBeDroppable = function() {
	ok(false, 'missing test - untested code is broken code');
};

TestHelpers.shouldNotBeDroppable = function() {
	ok(false, 'missing test - untested code is broken code');
};

(function($) {

module("droppable: core");

test("element types", function() {
	var typeNames = ('p,h1,h2,h3,h4,h5,h6,blockquote,ol,ul,dl,div,form' +
		',table,fieldset,address,ins,del,em,strong,q,cite,dfn,abbr' +
		',acronym,code,samp,kbd,var,img,object,hr' +
		',input,button,label,select,iframe').split(',');

	$.each(typeNames, function(i) {
		var typeName = typeNames[i];
		el = $(document.createElement(typeName)).appendTo('body');
		(typeName === 'table' && el.append("<tr><td>content</td></tr>"));
		el.droppable();
		TestHelpers.shouldBeDroppable();
		el.droppable("destroy");
		el.remove();
	});
});

})(jQuery);
