
$(function() {
	var duration = 1000, wait = 500;

	$("div.effect")
		.hover(function() { $(this).addClass("hover"); },
			function() { $(this).removeClass("hover"); });

	var effect = function(el, n, o) {

		$.extend(o, {
			easing: "easeOutQuint"
		});

		$(el).bind("click", function() {

			$(this).addClass("current")
				// delaying the initial animation makes sure that the queue stays in tact
				.delay( 10 )
				.hide( n, o, duration )
				.delay( wait )
				.show( n, o, duration, function() { 
					$( this ).removeClass("current"); 
				});
		});

	};
	
	$("#hide").click(function() {
		var el = $(this);
		el.addClass("current").hide(duration, function() {
			setTimeout(function() {
				el.show(duration, function() { el.removeClass("current"); });
			}, wait);
		});
	});

	effect("#blindLeft", "blind", { direction: "left" });
	effect("#blindUp", "blind", { direction: "up" });
	effect("#blindRight", "blind", { direction: "right" });
	effect("#blindDown", "blind", { direction: "down" });

	effect("#bounce3times", "bounce", { times: 3 });

	effect("#clipHorizontally", "clip", { direction: "horizontal" });
	effect("#clipVertically", "clip", { direction: "vertical" });

	effect("#dropDown", "drop", { direction: "down" });
	effect("#dropUp", "drop", { direction: "up" });
	effect("#dropLeft", "drop", { direction: "left" });
	effect("#dropRight", "drop", { direction: "right" });

	effect("#explode9", "explode", {});
	effect("#explode36", "explode", { pieces: 36 });

	effect("#fade", "fade", {});

	effect("#fold", "fold", { size: 50 });

	effect("#highlight", "highlight", {});

	effect("#pulsate", "pulsate", { times: 2 });

	effect("#puff", "puff", { times: 2 });
	effect("#scale", "scale", {});
	effect("#size", "size", {});
	$("#sizeToggle").bind("click", function() {
		var opts = { to: { width: 300, height: 300 }};
		$(this).addClass('current')
			.toggle("size", opts, duration)
			.delay(wait)
			.toggle("size", opts, duration, function() {
				$(this).removeClass("current");
			});
	});

	$("#shake").bind("click", function() { $(this).addClass("current").effect("shake", {}, 100, function() { $(this).removeClass("current"); }); });

	effect("#slideDown", "slide", { direction: "down" });
	effect("#slideUp", "slide", { direction: "up" });
	effect("#slideLeft", "slide", { direction: "left" });
	effect("#slideRight", "slide", { direction: "right" });

	$("#transfer").bind("click", function() { $(this).addClass("current").effect("transfer", { to: "div:eq(0)" }, 1000, function() { $(this).removeClass("current"); }); });

	$("#addClass").click(function() {
		$(this).addClass(function() {
			window.console && console.log(arguments);
			return "current";
		}, duration, function() {
			$(this).removeClass("current");
		});
	});
	$("#removeClass").click(function() {
		$(this).addClass("current").removeClass(function() {
			window.console && console.log(arguments);
			return "current";
		}, duration);
	});
	$("#toggleClass").click(function() {
		$(this).toggleClass(function() {
			window.console && console.log(arguments);
			return "current";
		}, duration);
	});
});
