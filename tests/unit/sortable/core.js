define( [
	"qunit",
	"jquery",
	"lib/helper",
	"./helper",
	"ui/widgets/sortable"
], function( QUnit, $, helper, testHelper ) {
"use strict";

QUnit.module( "sortable: core", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "#9314: Sortable: Items cannot be dragged directly into bottom position", function( assert ) {
	assert.expect( 1 );

	var el = $( ".connectWith" ).sortable( {
			connectWith: ".connectWith"
		} );

	testHelper.sort( assert, $( "li", el[ 1 ] )[ 0 ], 0, -12, 5, "Dragging the sortable into connected sortable" );
} );

QUnit.test( "ui-sortable-handle applied to appropriate element", function( assert ) {
	assert.expect( 8 );
	var item = "<li><p></p></li>",
		el = $( "<ul>" + item + item + "</ul>" )
			.sortable()
			.appendTo( "#qunit-fixture" );

	assert.hasClasses( el.find( "li" ).first(), "ui-sortable-handle" );
	assert.hasClasses( el.find( "li" ).last(), "ui-sortable-handle" );

	el.sortable( "option", "handle", "p" );
	assert.lacksClasses( el.find( "li" )[ 0 ], "ui-sortable-handle" );
	assert.lacksClasses( el.find( "li" )[ 1 ], "ui-sortable-handle" );
	assert.hasClasses( el.find( "p" )[ 0 ], "ui-sortable-handle" );
	assert.hasClasses( el.find( "p" )[ 1 ], "ui-sortable-handle" );

	el.append( item ).sortable( "refresh" );
	assert.hasClasses( el.find( "p" ).last(), "ui-sortable-handle" );

	el.sortable( "destroy" );
	assert.equal( el.find( ".ui-sortable-handle" ).length, 0, "class name removed on destroy" );
} );

// gh-1998
QUnit.test( "drag & drop works with a zero-height container", function( assert ) {
	var ready = assert.async();
	assert.expect( 3 );

	var el = $( "<ul class='list-gh-1998'>\n" +
		"	<style>" +
		"		.list-gh-1998 {\n" +
		"			margin: 0;\n" +
		"			padding: 0;\n" +
		"		}\n" +
		"		.list-item-gh-1998 {\n" +
		"			float: left;\n" +
		"			display: block;\n" +
		"			width: 100px;\n" +
		"			height: 100px;\n" +
		"		}\n" +
		"	</style>\n" +
		"	<li class='list-item-gh-1998'>Item 1</li>\n" +
		"	<li class='list-item-gh-1998'>Item 2</li>\n" +
		"	<li class='list-item-gh-1998'>Item 3</li>\n" +
		"</ul>" )
		.sortable()
		.appendTo( "#qunit-fixture" );

	function step1() {
		el.find( "li" ).eq( 0 ).simulate( "drag", {
			dx: 100,
			dy: 3,
			moves: 3
		} );
		setTimeout( step2 );
	}

	function step2() {
		el.find( "li" ).eq( 2 ).simulate( "drag", {
			dx: -200,
			dy: -3,
			moves: 3
		} );
		setTimeout( step3 );
	}

	function step3() {
		assert.equal( el.find( "li" ).eq( 0 ).text(), "Item 3" );
		assert.equal( el.find( "li" ).eq( 1 ).text(), "Item 2" );
		assert.equal( el.find( "li" ).eq( 2 ).text(), "Item 1" );
		ready();
	}

	step1();
} );

} );
