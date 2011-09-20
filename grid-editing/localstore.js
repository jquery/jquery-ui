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
			return this._bindArray(this.options.intial);
		}
		return this._bindArray(stored);
	},
	save: function() {
		if (localStorageSupport) {
			localStorage.setItem( this.options.key, JSON.stringify( this.data ) );
		}
	},
	_bindObjects: function( items ) {
		$.each( items, $.proxy(function( index, item ) {
			$.observable( item ).bind( "change", $.proxy( this.save, this ) );
		}, this));
	},
	_bindArray: function( data ) {
		if (!data)
			return;
		this.data = data;
		$.observable( data ).bind( "insert remove", $.proxy(function(event, ui) {
			// TODO unbind on remove?
			if (event.type == "insert") {
				this._bindObjects( ui.items );
			}
			this.save( this );
		}, this));
		this._bindObjects( data );
		return data;
	}
});


})( jQuery );
