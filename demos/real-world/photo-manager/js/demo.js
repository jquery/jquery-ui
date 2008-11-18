/*
 * The very first increment of Droppables&Draggables demo. The code is going to
 * be more concise (remove unnecessary code repetitions etc.). And imho the
 * photo management is a good candidate for demonstration of more jQuery UI
 * components (sortables, selectables...). More to come...
 *
 */

$(window).bind('load', function() {
	// make images in the gallery draggable
	$('ul.gallery img').addClass('img_content').draggable({
		helper: 'clone'
	});

	// make the trash box droppable, accepting images from the content section only
	$('#trash div').droppable({
		accept: '.img_content',
		activeClass: 'active',
		drop: function(ev, ui) {
			var $that = $(this);
			ui.draggable.parent().fadeOut('slow', function() {
				ui.draggable
					.hide()
					.appendTo($that)
					.fadeIn('slow')
					.animate({
						width: '72px',
						height: '54px'
					})
					.removeClass('img_content')
					.addClass('img_trash');
				$(this).remove();
			});
		}
	});

	// make the shredder box droppable, accepting images from both content and trash sections
	$('#shred div').droppable({
		accept: '.img_content, .img_trash',
		activeClass: 'active',
		drop: function(ev, ui) {
			var $that = $(this);
			// images from the content
			if (ui.draggable.hasClass('img_content')) {
				ui.draggable.parent().fadeOut('slow', function() {
					ui.draggable
						.appendTo($that)
						.animate({
							width: '0',
							height: '0'
						}, 'slow', function(){
							$(this).remove();
						});
					$(this).remove();
				});
			}
			// images from the trash
			else if (ui.draggable.hasClass('img_trash')) {
				ui.draggable
					.appendTo($that)
					.animate({
						width: '0',
						height: '0'
					}, 'slow', function(){
						$(this).remove();
					});
			}
		}
	});

	// make the gallery droppable as well, accepting images from the trash only
	$('ul.gallery').droppable({
		accept: '.img_trash',
		activeClass: 'active',
		drop: function(ev, ui) {
			var $that = $(this);
			ui.draggable.fadeOut('slow', function() {
				var $item = createGalleryItem(this).appendTo($that);
				$(this)
					.removeClass('img_trash')
					.addClass('img_content')
					.css({ width: '144px', height: '108px' })
					.show();
				$item.fadeIn('slow');
			});
		}
	});

	// handle the trash icon behavior
	$('a.tb_trash').livequery('click', function() {
		var $this = $(this);
		var $img = $this.parent().siblings('img');
		var $item = $this.parents('li');

		$item.fadeOut('slow', function() {
			$img
				.hide()
				.appendTo('#trash div')
				.fadeIn('slow')
				.animate({
					width: '72px',
					height: '54px'
				})
				.removeClass('img_content')
				.addClass('img_trash');
			$(this).remove();
		});

		return false;
	});

	// handle the magnify button
	$('a.tb_supersize').livequery('click', function() {
		$('<img width="576" height="432">')
			.attr('src', $(this).attr('href'))
			.appendTo('#body_wrap')
			.displayBox();
		return false;
	});


	var sliderChange = function(event, ui){
		$('.img_content').each(function(index, item){
			var _new = 1.44	* $('#sliderSize').slider("value");

			$(this).css("width", _new+'px')
				.parent().css("width", (_new+16)+'px');

		});
	}
	$('#sliderSize').slider({
		startValue : 100,
		min : 50,
		max : 100,
		stepping : 5,
		slide : sliderChange,
		change : sliderChange
	});

});

function createGalleryItem(img) {
	var title = img.getAttribute('alt');
	var href = img.getAttribute('src').replace(/thumbs\//, '');

	var $item = $('<li><p>'+title+'</p><div><a href="#" title="Trash me" class="tb_trash">Trash me</a><a href="'+href+'" title="See me supersized" class="tb_supersize">See me supersized</a></div></li>').hide();
	$item.prepend($(img));

	return $item;
}
