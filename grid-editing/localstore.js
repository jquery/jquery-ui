/*
 * Little abstraction for localStorage access
 *
 * Depends on:
 * widget
 */
(function( $ ) {

var localStorageSupport = (function() {
	try {
		return !!localStorage.getItem;
	} catch(e){
		return false;
	}
})();

$.widget( "demos.localstore", {
	options: {
		key: null,
		initial: null
	},
	_create: function() {
		if (this.options.key === null ) {
			throw "need to configure a key";
		}
		if ( this._fresh() && $.type( this.options.initial ) === "string") {
			var that = this;
			$.ajax({
				dataType: "json",
				url: this.options.initial,
				async: false,
				success: function( result ) {
					that.save( result );
				}
			});
		}
	},
	_fresh: function() {
		var stored = this.load();
		return !stored || stored === this.options.initial;
	},
	load: function() {
		var stored = localStorageSupport
			? JSON.parse( localStorage.getItem( this.options.key ) )
			: this.data;
		if (!stored) {
			return this.options.intial;
		}
		return stored;
	},
	save: function( data ) {
		console.log("save", data)
		localStorageSupport
			? localStorage.setItem( this.options.key, JSON.stringify( data ) )
			: this.data = data;
	}
});


})( jQuery );
