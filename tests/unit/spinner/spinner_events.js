/*
 * spinner_events.js
 */
(function($) {

module("spinner: events");

test("start", function() {
	var start = 0,
			el = $( "#spin" ).spinner({
				start: function(){
					start++;
				}
			});

	simulateKeyDownUp(el, $.ui.keyCode.UP);

	equals(start, 1, "Start triggered");
});

test("spin", function() {
	var spin = 0;
	
	var el = $("#spin").spinner({
		spin: function(){
			spin++;
		}
	});

	simulateKeyDownUp(el, $.ui.keyCode.UP);
	
	equals(spin, 1, "Spin triggered");
});

test("stop", function() {
	var stop = 0;
	
	var el = $("#spin").spinner({
		stop: function(){
			stop++;
		}
	});

	simulateKeyDownUp(el, $.ui.keyCode.DOWN);
	
	equals(stop, 1, "Stop triggered");
});

test("change", function() {
	var change = 0;
	
	var el = $("#spin").spinner({
		change: function(){
			change++;
		}
	});

	simulateKeyDownUp(el, $.ui.keyCode.UP);

	equals(change, 1, "Change triggered");
});

test( "ensure proper event order", function() {
	var events = [],
        pushEvent = function(e,ui) {
            events.push(e.type);
        },
        el = $( "#spin" ).spinner({
            start: pushEvent,
            spin: pushEvent,
            stop: pushEvent,
            change: pushEvent
        });

	simulateKeyDownUp(el, $.ui.keyCode.UP);

	deepEqual(events, [ "spinstart", "spin", "spinstop", "spinchange" ], "start then spin then stop then change");
});

test( "canceling 'start' should prevent spin, stop, and change", function() {
	var events = [],
			pushEvent = function(e,ui) {
					events.push(e.type);
			},
			el = $( "#spin").spinner({
					start: function(e,ui){
							pushEvent(e,ui);
							return false;
					},
					spin: pushEvent,
					stop: pushEvent,
					change: pushEvent
			});

	simulateKeyDownUp(el, $.ui.keyCode.UP);

	deepEqual(events, [ "spinstart" ], "only 'start' was fired and canceled, suppressing other events");
});
// These tests are suppressed until the relevant fixes for the change event have been implemented.
/*
test( "change should only fire if the value of the spinner has changed", function() {
  expect(4);
  var changed = 0,
      el = $( "#spin2" ).spinner({
          change: function(e,ui) {
              changed++;
              val = $(this).spinner( "option", "value" );
          }
      }),
      originalValue = el.spinner( "option", "value" ),
      val;

      simulateKeyDownUp(el, $.ui.keyCode.UP);

  notEqual(originalValue,val, "the value changed");
  equal(changed, 1, "the change event ran after the value changed");

  el.spinner("option","spin",function() {
    return false;
  });
  originalValue = el.spinner("option","value"),
  simulateKeyDownUp(el, $.ui.keyCode.UP);

  equal(originalValue, val, "the value didn't change because 'spin' was canceled'");
  equal(changed, 1, "the change event did not run a second time ");

});

test( "changing value option should fire change event", function() {
  var changed = false,
      el = $( "#spin2" ).spinner({
          change: function(e,ui) {
              changed = true;
              val = $(this).spinner( "option", "value" );
      }
  });

  el.spinner( "option", "value", 7);

  equals(changed, true, "change event was fired");
});
*/

})(jQuery);
