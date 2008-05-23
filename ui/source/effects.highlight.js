;(function($) {
  
  $.effects.highlight = function(o) {

    return this.queue(function() {
      
      // Create element
      var el = $(this), props = ['backgroundImage','backgroundColor','opacity'];
      
      // Set options
      var mode = $.effects.setMode(el, o.options.mode || 'show'); // Set Mode
      var color = o.options.color || "#ffff99"; // Default highlight color
      
      // Adjust
      $.effects.save(el, props); el.show(); // Save & Show
      el.css({backgroundImage: 'none', backgroundColor: color}); // Shift
      
      // Animation
      var animation = {backgroundColor: $.data(this, "ec.storage.backgroundColor")};
      if (mode == "hide") animation['opacity'] = 0;
      
      // Animate
      el.animate(animation, { queue: false, duration: o.duration, easing: o.options.easing, complete: function() {
        if(mode == "hide") el.hide();
        $.effects.restore(el, props);
	    if (mode == "show" && jQuery.browser.msie) this.style.removeAttribute('filter'); 
        if(o.callback) o.callback.apply(this, arguments);
        el.dequeue();
      }});
      
    });
    
  };
  
})(jQuery);