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
	$.each( $( form ).serializeArray(), function( index, object ) {
		set( target, object.name, object.value );
	});
}
function deserializeForm(form, source) {
	$(form).find("input:text").each(function() {
		$(this).val(get(source, this.name));
	});
}
