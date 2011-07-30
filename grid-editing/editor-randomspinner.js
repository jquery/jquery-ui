$.ui.editor.editors.randomSpinner = function( input, options ) {
	return $.ui.editor.editors.spinner( input, $.extend({
		step: Math.floor( Math.random() * 10 ) + 1
	}, options ) );
};
