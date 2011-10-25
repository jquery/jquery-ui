var fs = require( "fs" ),
	stdin = process.openStdin(),
	rsize = /(\d+).*?(jquery\S+)/g,
	oldsizes = {},
	sizes = {},
	input = "";

stdin.setEncoding( "utf8" );

try {
	oldsizes = JSON.parse( fs.readFileSync(  __dirname + "/.sizecache.json", "utf8" ) );
} catch(e) {
	oldsizes = {};
};

function lpad( str, len, chr ) {
	return ( Array(len+1).join( chr || " ") + str ).substr( -len );
}

stdin.on( "data" , function( chunk ) {
	input += chunk;
});
stdin.on( "end", function() {
	var match;

	while ( match = rsize.exec( input ) ) {
		sizes[ match[2] ] = parseInt( match[1], 10 );
	}

	fs.writeFileSync( __dirname + "/.sizecache.json", JSON.stringify( sizes, true ), "utf8" );
	for ( var key in sizes ) {
		var diff = oldsizes[ key ] && ( sizes[ key ] - oldsizes[ key ] );
		if ( diff > 0 ) {
			diff = "+" + diff;
		}
		console.log( "%s %s %s", lpad( sizes[ key ], 8 ), lpad( oldsizes[key] ? "(" + diff + ")" : "(-)", 8 ), key );
	}
	process.nextTick(function() {
		process.exit();
	});
});