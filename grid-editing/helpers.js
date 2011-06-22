// demo helpers, may become part of some abstraction later

function set(object, name, value) {
	var fields = name.split("."),
		field = fields.pop();
	get(object, fields)[field] = value;
}
function get(object, name) {
	var fields = $.type(name) === "string" ? name.split(".") : name,
		field;
	if (fields.length === 0) {
		return object;
	}
	while (fields.length > 1) {
		field = fields.shift(),
		object = object[field];
	}
	return object[fields[0]];
}

function serializeForm(form, target) {
	// TODO flatten arrays (object.name occuring multiple times)
	$.each( $( form ).serializeArray(), function( index, object ) {
		set( target, object.name, object.value );
	});
}
function deserializeForm(form, source) {
	$(form).find("input:text").each(function() {
		$(this).val(get(source, this.name));
	});
}

function capitalize( value ) {
	return value.replace(/^(.)(.*)$/, function(match, first, rest) {
		return first.toUpperCase() + rest.toLowerCase();
	});
}
function meta( input ) {
	var output = [];
	for ( key in input ) {
		var field = {
			name: key,
			label: capitalize(key),
			value: input[ key ]
		};
		if ( $.isPlainObject(field.value) ) {
			for (subkey in field.value) {
				field.name += "." + subkey;
				field.value = field.value[ subkey ];
			}
		}
		output.push(field);
	}
	return output;
}

// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(searchElement /*, fromIndex */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0)
      return -1;

    var n = 0;
    if (arguments.length > 0)
    {
      n = Number(arguments[1]);
      if (n !== n) // shortcut for verifying if it's NaN
        n = 0;
      else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0))
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }

    if (n >= len)
      return -1;

    var k = n >= 0
          ? n
          : Math.max(len - Math.abs(n), 0);

    for (; k < len; k++)
    {
      if (k in t && t[k] === searchElement)
        return k;
    }
    return -1;
  };
}
