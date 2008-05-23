;(function($) {
  
  $.effects.pulsate = function(o) {

    return this.queue(function() {
      
      // Create element
      var el = $(this);
      
      // Set options
      var mode = $.effects.setMode(el, o.options.mode || 'show'); // Set Mode
      var times = o.options.times || 5; // Default # of times
      
      // Adjust
      if (mode != 'hide') times--;
      if (el.is(':hidden')) { // Show fadeIn
        el.css('opacity', 0);
        el.show(); // Show
        el.animate({opacity: 1}, o.duration / 2, o.options.easing);
        times--;
      }
      
      // Animate
      for (var i = 0; i < times; i++) { // Pulsate
        el.animate({opacity: 0}, o.duration / 2, o.options.easing).animate({opacity: 1}, o.duration / 2, o.options.easing);
      };
      if (mode == 'hide') { // Last Pulse
        el.animate({opacity: 0}, o.duration / 2, o.options.easing, function(){
          el.hide(); // Hide
          if(o.callback) o.callback.apply(this, arguments); // Callback
        });
      } else {
        el.animate({opacity: 0}, o.duration / 2, o.options.easing).animate({opacity: 1}, o.duration / 2, o.options.easing, function(){
          if(o.callback) o.callback.apply(this, arguments); // Callback
        });
      };
      el.queue('fx', function() { el.dequeue(); });
      el.dequeue();
    });
    
  };
  
})(jQuery);