/*
 * tooltip_options.js
 */
(function($) {

module("tooltip: options", {
	teardown: function() {
		$(":ui-tooltip").tooltip("destroy");
	}
});


test("option: items", function() {
	var event = $.Event("mouseenter");
	event.target = $("[data-tooltip]");
	$("#qunit-fixture").tooltip({
		items: "[data-tooltip]",
		content: function() {
			return $(this).attr("data-tooltip");
		}
	}).tooltip("open", event);
	same( $(".ui-tooltip").text(), "text" );
});

test("content: default", function() {
	$("#tooltipped1").tooltip().tooltip("open");
	same( $(".ui-tooltip").text(), "anchortitle" );
});

test("content: return string", function() {
	$("#tooltipped1").tooltip({
		content: function() {
			return "customstring";
		}
	}).tooltip("open");
	same( $(".ui-tooltip").text(), "customstring" );
});

test("content: return jQuery", function() {
	$("#tooltipped1").tooltip({
		content: function() {
			return $("<div></div>").html("cu<b>s</b>tomstring");
		}
	}).tooltip("open");
	same( $(".ui-tooltip").text(), "customstring" );
});

test("content: callback string", function() {
	stop();
	$("#tooltipped1").tooltip({
		content: function(response) {
			response("customstring2");
			setTimeout(function() {
				same( $(".ui-tooltip").text(), "customstring2" );
				start();
			}, 100)
		}
	}).tooltip("open");

});

test("option: disabled true on init", function() {

    var tooltip = $("#tooltipped1"),
        widget = tooltip.tooltip({
          disabled: true
        }).simulate("mouseover", { target: tooltip[0] }).tooltip("widget");

    ok(widget.is(":hidden"));

});

test("option: disabled false on init", function() {

    var tooltip = $("#tooltipped1"),
        widget = tooltip.tooltip({
          disabled: true
        }).simulate("mouseover", { target: tooltip[0] }).tooltip("widget");

    ok(widget.is(":hidden"));

});

test("option: disabled set to false using disabled option", function() {

    expect(5);
    stop();

    var div = $( "#tooltipped1" ),
        widget = div.tooltip().tooltip("widget"),
        tests = {
          13: function() {
            ok( widget.is(":hidden") );
            div.simulate( "mouseover", { target: div[0] });
          },
          500: function() {
            ok( widget.is(":visible") );
            div.simulate( "mouseout", { target: div[0] });
          },
          1000: function() {
            ok( widget.is(":hidden") );
            div.tooltip("option","disabled",true);
            div.simulate( "mouseover", { target: div[0] });
          },
          1500: function() {
            ok( widget.is(":hidden") );
            div.simulate( "mouseout", { target: div[0] });
          },
          2000: function() {
            ok( widget.is(":hidden") );
            start();
          }
      };


      for (var f in tests) {
        setTimeout(tests[f],f);
      }

});
test("option: disabled true on init, set to false using disabled option", function() {

    expect(5);
    stop();

    var div = $( "#tooltipped1" ),
        widget = div.tooltip({disabled:true}).tooltip("widget"),
        tests = {
          13: function() {
            ok( widget.is(":hidden") );
            div.simulate( "mouseover", { target: div[0] });
          },
          500: function() {
            ok( widget.is(":hidden") );
            div.simulate( "mouseout", { target: div[0] });
          },
          1000: function() {
            ok( widget.is(":hidden") );
            div.tooltip("option","disabled",false);
            div.simulate( "mouseover", { target: div[0] });
          },
          1500: function() {
            ok( widget.is(":visible") );
            div.simulate( "mouseout", { target: div[0] });
          },
          2000: function() {
            ok( widget.is(":hidden") );
            start();
          }
      };

      for (var f in tests) {
        setTimeout(tests[f],f);
      }

});

})(jQuery);
