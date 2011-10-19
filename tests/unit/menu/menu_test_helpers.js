function menu_log( message, clear ) {
	if ( clear ) {
		$( "#log" ).empty();
	}
	if ( message === undefined ) {
		message = $( "#log" ).data( "lastItem" );
	}
	$( "#log" ).prepend( $.trim( message ) + "," );
}

function menu_click( menu, item ) {
	$( "#log" ).data( "lastItem", item );
	menu.children( ":eq(" + item + ")" ).find( "a:first" ).trigger( "click" );
}