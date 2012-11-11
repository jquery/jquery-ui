/*
 * sortable_tickets.js
 */
(function($) {

module("sortable: tickets");

test("#3019: Stop fires too early", function() {
    expect(2);

	var helper = null,
        el = $("#sortable").sortable({
            stop: function(event, ui) {
                helper = ui.helper;
            }
        });

	TestHelpers.sortable.sort($("li", el)[0], 0, 44, 2, 'Dragging the sortable');
	equal(helper, null, "helper should be false");

});

test('#4752: link event firing on sortable with connect list', function () {
    expect( 10 );

    var fired = {},
        hasFired = function (type) { return (type in fired) && (true === fired[type]); };

    $('#sortable').clone().attr('id', 'sortable2').insertAfter('#sortable');

    $('#qunit-fixture ul').sortable({
        connectWith: '#qunit-fixture ul',
        change: function () {
            fired.change = true;
        },
        receive: function () {
            fired.receive = true;
        },
        remove: function () {
            fired.remove = true;
        }
    });

    $('#qunit-fixture ul').bind('click.ui-sortable-test', function () {
        fired.click = true;
    });

    $('#sortable li:eq(0)').simulate('click');
    ok(!hasFired('change'), 'Click only, change event should not have fired');
    ok(hasFired('click'), 'Click event should have fired');

    // Drag an item within the first list
    fired = {};
    $('#sortable li:eq(0)').simulate('drag', { dx: 0, dy: 40 });
    ok(hasFired('change'), '40px drag, change event should have fired');
    ok(!hasFired('receive'), 'Receive event should not have fired');
    ok(!hasFired('remove'), 'Remove event should not have fired');
    ok(!hasFired('click'), 'Click event should not have fired');

    // Drag an item from the first list to the second, connected list
    fired = {};
    $('#sortable li:eq(0)').simulate('drag', { dx: 0, dy: 150 });
    ok(hasFired('change'), '150px drag, change event should have fired');
    ok(hasFired('receive'), 'Receive event should have fired');
    ok(hasFired('remove'), 'Remove event should have fired');
    ok(!hasFired('click'), 'Click event should not have fired');
});

})(jQuery);
