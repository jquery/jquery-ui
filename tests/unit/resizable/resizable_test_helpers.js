TestHelpers.resizable = {
	drag: function(el, dx, dy, complete) {

		// speed = sync -> Drag syncrhonously.
		// speed = fast|slow -> Drag asyncrhonously - animated.

		//this mouseover is to work around a limitation in resizable
		//TODO: fix resizable so handle doesn't require mouseover in order to be used
		$(el).simulate("mouseover");

		return $(el).simulate("drag", {
			dx: dx||0, dy: dy||0, speed: 'sync', complete: complete
		});
	}
};