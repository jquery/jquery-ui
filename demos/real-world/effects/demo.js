$(document).ready(function() {

	$("div.effect")
		.hover(function() {
			$(this).addClass("hover");
		}, function() {
			$(this).removeClass("hover");
		})
		;


	var effect = function(el, n, o) {

		$.extend(o, {
			easing: "easeOutQuint"
		});

		$(el).bind("click", function() {

			$(this).addClass("current").hide(n, o, 1000, function() {
				var self = this;
				window.setTimeout(function() {
					$(self).show(n, o, 1000, function() { $(this).removeClass("current"); });
				},500);
			});
		});

	};


	effect("#blindHorizontally", "blind", { direction: "horizontal" });
	effect("#blindVertically", "blind", { direction: "vertical" });

	effect("#bounce3times", "bounce", { times: 3 });

	effect("#clipHorizontally", "clip", { direction: "horizontal" });
	effect("#clipVertically", "clip", { direction: "vertical" });

	effect("#dropDown", "drop", { direction: "down" });
	effect("#dropUp", "drop", { direction: "up" });
	effect("#dropLeft", "drop", { direction: "left" });
	effect("#dropRight", "drop", { direction: "right" });

	effect("#explode9", "explode", {  });
	effect("#explode36", "explode", { pieces: 36 });

	effect("#fold", "fold", { size: 50 });

	effect("#highlight", "highlight", {  });

	effect("#pulsate", "pulsate", { times: 2 });

	effect("#puff", "puff", { times: 2 });
	effect("#scale", "scale", {  });

	$("#shake").bind("click", function() { $(this).addClass("current").effect("shake", {}, 100, function() { $(this).removeClass("current"); }); });

	effect("#slideDown", "slide", { direction: "down" });
	effect("#slideUp", "slide", { direction: "up" });
	effect("#slideLeft", "slide", { direction: "left" });
	effect("#slideRight", "slide", { direction: "right" });

	$("#transfer").bind("click", function() { $(this).addClass("current").effect("transfer", { to: "div:eq(0)" }, 1000, function() { $(this).removeClass("current"); }); });

});