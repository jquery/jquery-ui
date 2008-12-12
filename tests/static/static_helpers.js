/* static_helpers.js
 */
$(function(){
	//add hover states on the static widgets
	$('.ui-state-default:not(.ui-state-disabled, .ui-slider-range, .ui-progressbar-value), a.ui-datepicker-next, a.ui-datepicker-prev, .ui-dialog-titlebar-close').hover(
		function(){ $(this).addClass('ui-state-hover'); }, 
		function(){ $(this).removeClass('ui-state-hover'); }
	);
});
