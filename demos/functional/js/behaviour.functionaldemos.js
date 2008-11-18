$(document).ready(function() {

	$('.component-links a').history(function() {
		loadDemo( $(this).attr('href').replace(/^#/, "") );
	});

	$.ajaxHistory.initialize();

});