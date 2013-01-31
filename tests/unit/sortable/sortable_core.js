/*
 * sortable_core.js
 */

test("#9036: grid sort with connectWith prop, sorted error.", function () {
    expect( 2 );

    var containers = $(".connect");

    containers.each(function(i, item){
        $(item).sortable({
            connectWith: ".connect"
        });
    });

    containers.eq(0).find("li:eq(0)").simulate( "drag", {
        dx: 1,
        dy: 1
    });

    ok(containers.eq(0).find("li:eq(0)").text() === "Item 1", "inner sort error.");

    containers.eq(0).find("li:eq(3)").simulate( "drag", {
        dy: 10
    });

    ok(containers.eq(1).find("li:eq(0)").text() === "Item 4", "cross container sort error.");
});