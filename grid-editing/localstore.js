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
		if ( this._fresh() ) {
			if ($.type( this.options.initial ) === "string") {
				var that = this;
				$.ajax({
					dataType: "json",
					url: this.options.initial,
					async: false,
					success: function( result ) {
						that.save( result );
					}
				});
			} else {
				this.save( this.options.initial );
			}
		}
	},
	_fresh: function() {
		var stored = this.load();
		return !stored || stored === this.options.initial;
	},
	load: function() {
		var stored = [];
		if ( localStorageSupport ) {
			stored = localStorage.getItem( this.options.key );
			if ( stored ) {
				stored = jQuery.parseJSON( stored );
			}
		} else {
			stored = this.data;
		}
		if (!stored) {
			return this.options.intial;
		}
		return stored;
	},
	save: function( data ) {
		localStorageSupport
			? localStorage.setItem( this.options.key, JSON.stringify( data ) )
			: this.data = data;
	}
});


})( jQuery );
