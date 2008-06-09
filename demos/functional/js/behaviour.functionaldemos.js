$(document).ready(function() {
	
	$('.component-links a').click(function() {
		var comp = $(this).attr('href').replace(/^#/, "");
		loadDemo(comp);
	});

	// hash listener
	if (location.hash) {
		loadDemo(location.hash.replace(/^#/, ""));
	}
	
});