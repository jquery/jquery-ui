$(document).ready(function() {

	$('.component-links a').history(function() {
		loadDemo( $(this).attr('href').replace(/^#/, "") );
	});

	var instructions = $("#containerDemo").html();
	$.ajaxHistory.initialize(function() {
		$("#containerDemo").html(instructions);
	});

});