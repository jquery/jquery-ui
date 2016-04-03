define( [
	"qunit",
	"jquery",
	"./helper",
	"ui/widgets/droppable"
], function( QUnit, $, testHelper ) {

QUnit.module( "droppable: core" );

QUnit.test( "element types", function( assert ) {
	var typeNames = ( "p,h1,h2,h3,h4,h5,h6,blockquote,ol,ul,dl,div,form" +
		",table,fieldset,address,ins,del,em,strong,q,cite,dfn,abbr" +
		",acronym,code,samp,kbd,var,img,hr" +
		",input,button,label,select,iframe" ).split( "," );

	assert.expect( typeNames.length );

	$.each( typeNames, function( i ) {
		var typeName = typeNames[ i ],
			el = $( document.createElement( typeName ) ).appendTo( "body" );

		( typeName === "table" && el.append( "<tr><td>content</td></tr>" ) );
		el.droppable();
		testHelper.shouldDrop( assert );
		el.droppable( "destroy" );
		el.remove();
	} );
} );

} );
