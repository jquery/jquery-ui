function menu_log( message, clear ) {
	if ( clear ) {
		$( "#log" ).empty();
	}
	if ( message === undefined ) {
		message = $( "#log" ).data( "lastItem" );
	}
	$( "#log" ).prepend( message + "," );
}

function menu_click( menu, item ) {
	$( "#log" ).data( "lastItem", item );
	menu.find( "li:eq(" + item + ") a" ).trigger( "click" );
}
