test("jQuery.extend(Object, Object)", function() {
	expect(28);

	var settings = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" },
		options = { xnumber2: 1, xstring2: "x", xxx: "newstring" },
		optionsCopy = { xnumber2: 1, xstring2: "x", xxx: "newstring" },
		merged = { xnumber1: 5, xnumber2: 1, xstring1: "peter", xstring2: "x", xxx: "newstring" },
		deep1 = { foo: { bar: true } },
		deep1copy = { foo: { bar: true } },
		deep2 = { foo: { baz: true }, foo2: document },
		deep2copy = { foo: { baz: true }, foo2: document },
		deepmerged = { foo: { bar: true, baz: true }, foo2: document },
		arr = [1, 2, 3],
		nestedarray = { arr: arr };

	jQuery.extend2(settings, options);
	same( settings, merged, "Check if extended: settings must be extended" );
	same( options, optionsCopy, "Check if not modified: options must not be modified" );
	jQuery.extend2(settings, null, options);
	same( settings, merged, "Check if extended: settings must be extended" );
	same( options, optionsCopy, "Check if not modified: options must not be modified" );

	jQuery.extend2(deep1, deep2);
	same( deep1.foo, deepmerged.foo, "Check if foo: settings must be extended" );
	same( deep2.foo, deep2copy.foo, "Check if not deep2: options must not be modified" );
	equals( deep1.foo2, document, "Make sure that a deep clone was not attempted on the document" );

	ok( jQuery.extend2({}, nestedarray).arr === arr, "Don't clone arrays" );
	ok( jQuery.isPlainObject( jQuery.extend2({ arr: arr }, { arr: {} }).arr ), "Cloned object heve to be an plain object" );

	var empty = {};
	var optionsWithLength = { foo: { length: -1 } };
	jQuery.extend2(empty, optionsWithLength);
	same( empty.foo, optionsWithLength.foo, "The length property must copy correctly" );

	empty = {};
	var optionsWithDate = { foo: { date: new Date } };
	jQuery.extend2(empty, optionsWithDate);
	same( empty.foo, optionsWithDate.foo, "Dates copy correctly" );

	var myKlass = function() {};
	var customObject = new myKlass();
	var optionsWithCustomObject = { foo: { date: customObject } };
	empty = {};
	jQuery.extend2(empty, optionsWithCustomObject);
	ok( empty.foo && empty.foo.date === customObject, "Custom objects copy correctly (no methods)" );

	// Makes the class a little more realistic
	myKlass.prototype = { someMethod: function(){} };
	empty = {};
	jQuery.extend2(empty, optionsWithCustomObject);
	ok( empty.foo && empty.foo.date === customObject, "Custom objects copy correctly" );

	var ret = jQuery.extend2({ foo: 4 }, { foo: new Number(5) } );
	ok( ret.foo == 5, "Wrapped numbers copy correctly" );

	var nullUndef;
	nullUndef = jQuery.extend2({}, options, { xnumber2: null });
	ok( nullUndef.xnumber2 === null, "Check to make sure null values are copied");

	nullUndef = jQuery.extend2({}, options, { xnumber2: undefined });
	ok( nullUndef.xnumber2 === options.xnumber2, "Check to make sure undefined values are not copied");

	nullUndef = jQuery.extend2({}, options, { xnumber0: null });
	ok( nullUndef.xnumber0 === null, "Check to make sure null values are inserted");

	// TODO weird test
	/*
	var target = {};
	var recursive = { foo:target, bar:5 };
	jQuery.extend2(target, recursive);
	same( target, { bar:5 }, "Check to make sure a recursive obj doesn't go never-ending loop by not copying it over" );
	*/

	var ret = jQuery.extend(true, { foo: [] }, { foo: [0] } ); // 1907
	equals( ret.foo.length, 1, "Check to make sure a value with coersion 'false' copies over when necessary to fix #1907" );

	var ret = jQuery.extend(true, { foo: "1,2,3" }, { foo: [1, 2, 3] } );
	ok( typeof ret.foo != "string", "Check to make sure values equal with coersion (but not actually equal) overwrite correctly" );

	var ret = jQuery.extend(true, { foo:"bar" }, { foo:null } );
	ok( typeof ret.foo !== "undefined", "Make sure a null value doesn't crash with deep extend, for #1908" );

	var obj = { foo:null };
	jQuery.extend(true, obj, { foo:"notnull" } );
	equals( obj.foo, "notnull", "Make sure a null value can be overwritten" );

	function func() {}
	jQuery.extend(func, { key: "value" } );
	equals( func.key, "value", "Verify a function can be extended" );

	var defaults = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" },
		defaultsCopy = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" },
		options1 = { xnumber2: 1, xstring2: "x" },
		options1Copy = { xnumber2: 1, xstring2: "x" },
		options2 = { xstring2: "xx", xxx: "newstringx" },
		options2Copy = { xstring2: "xx", xxx: "newstringx" },
		merged2 = { xnumber1: 5, xnumber2: 1, xstring1: "peter", xstring2: "xx", xxx: "newstringx" };

	var settings = jQuery.extend({}, defaults, options1, options2);
	same( settings, merged2, "Check if extended: settings must be extended" );
	same( defaults, defaultsCopy, "Check if not modified: options1 must not be modified" );
	same( options1, options1Copy, "Check if not modified: options1 must not be modified" );
	same( options2, options2Copy, "Check if not modified: options2 must not be modified" );
	
	var input = {
		key: [ 1, 2, 3 ]
	}
	var output = jQuery.extend2( {}, input );
	deepEqual( input, output, "don't clone arrays" );
	input.key[0] = 10;
	deepEqual( input, output, "don't clone arrays" );
});
