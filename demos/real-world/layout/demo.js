(function($){
	function updateUpDown(sortable) {
		$('dl:not(.ui-sortable-helper)', sortable)
			.removeClass('first').removeClass('last')
			.find('.up, .down').removeClass('disabled').end()
			.filter(':first').addClass('first').find('.up').addClass('disabled').end().end()
			.filter(':last').addClass('last').find('.down').addClass('disabled').end().end();
	};

	function moveUpDown() {
		var link = $(this),
			dl = link.parents('dl'),
			prev = dl.prev('dl'),
			next = dl.next('dl');

		if(link.is('.up') && prev.length > 0)
			dl.insertBefore(prev);

		if(link.is('.down') && next.length > 0)
			dl.insertAfter(next);

		updateUpDown(dl.parent());
	};

	function addControls() {
		$(this).append('<span class="options"><a class="up">up</a><a class="down">down</a></span>')
			.find('a.up, a.down').bind('click', moveUpDown);
		updateUpDown($(this).parents(".ui-sortable:first"));
	}

	var counter = 1;
	function addItem() {
		var sortable = $(this).parents('.ui-sortable:first');
		var options = '<span class="options"><a class="up">up</a><a class="down">down</a></span>';
		var tpl = '<dl class="sort"><dt>{name}' + options + '</dt><dd>{desc}</dd></dl>';
		var html = tpl.replace(/{name}/g, 'Dynamic name ' + counter).replace(/{desc}/g, 'Description');
		counter += 1;
		sortable.append(html).sortable('refresh').find('a.up, a.down').bind('click', moveUpDown);
		updateUpDown(sortable);
	};

	function emptyTrashCan(item) {
		item.remove();
	};

	function sortableChange(event, ui) {
		if(ui.sender){
			var w = ui.element.width();
			ui.placeholder.width(w);
			ui.helper.css("width",ui.element.children().width());
		}
	};

	function sortableUpdate(event, ui) {
		if(ui.element[0].id == 'trashcan'){
			emptyTrashCan(ui.item);
		} else {
			updateUpDown(ui.element[0]);
			if(ui.sender)
				updateUpDown(ui.sender[0]);
		}
	};

	$(document).ready(function(){
		var els = ['#header', '#content', '#sidebar', '#footer', '#trashcan'];
		var $els = $(els.toString());

		$('h2', $els.slice(0,-1)).append('<span class="options"><a class="add">add</a></span>');
		$('dt', $els).each(addControls);
		//$('dt', $els).append('<span class="options"><a class="up">up</a><a class="down">down</a></span>');

		$('a.add').bind('click', addItem);
		//$('a.up, a.down').bind('click', moveUpDown);

		$els.each(function(){
			updateUpDown(this);
		});

		$els.sortable({
			items: '> dl',
			handle: 'dt',
			cursor: 'move',
			//cursorAt: { top: 2, left: 2 },
			//opacity: 0.8,
			//helper: 'clone',
			appendTo: 'body',
			//placeholder: 'clone',
			//placeholder: 'placeholder',
			connectWith: els,
			start: function(event,ui) {
				ui.helper.css("width", ui.item.parent().width());
			},
			change: sortableChange,
			update: sortableUpdate
		}).bind("sortreceive", function(event, ui) {
			$(ui.item).removeClass('ui-draggable').find('dt').each(addControls);
		});
		$('#components > dl').draggable({
			connectToSortable: $els.not("#trashcan"),
			helper: 'clone',
			handle: 'dt'
		})
	});

	$(window).bind('load',function(){
		setTimeout(function(){
			// fixes the weird scrolling in IE while killing the fade
			$(document.body).css("height", "auto")
			$('#overlay').fadeOut(function(){
				$(this).remove();
			});
		}, 500);
	});
})(jQuery);