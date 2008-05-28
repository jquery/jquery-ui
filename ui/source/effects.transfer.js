;(function($) {
  
  $.effects.transfer = function(o) {

    return this.queue(function() {

      // Create element
      var el = $(this);
      
      // Set options
      var mode = $.effects.setMode(el, o.options.mode || 'effect'); // Set Mode
      var target = $(o.options.to); // Find Target
      var position = el.offset();
	  var transfer = $('<div class="ui-effects-transfer"></div>').appendTo(document.body);
      
      // Set target css
      transfer.addClass(o.options.className);
      transfer.css({
        top: position.top,
        left: position.left,
        height: el.outerHeight(true) - parseInt(transfer.css('borderTopWidth')) - parseInt(transfer.css('borderBottomWidth')),
        width: el.outerWidth(true) - parseInt(transfer.css('borderLeftWidth')) - parseInt(transfer.css('borderRightWidth')),
        position: 'absolute'
      });
      
      // Animation
      position = target.offset();
      animation = {
        top: position.top,
        left: position.top,
        height: target.outerHeight() - parseInt(transfer.css('borderTopWidth')) - parseInt(transfer.css('borderBottomWidth')),
        width: target.outerWidth() - parseInt(transfer.css('borderLeftWidth')) - parseInt(transfer.css('borderRightWidth'))
      };
      
      // Animate
      transfer.animate(animation, o.duration, o.options.easing, function() {
        transfer.remove(); // Remove div
        if(o.callback) o.callback.apply(el[0], arguments); // Callback
        el.dequeue();
      }); 
      
    });
    
  };
  
})(jQuery);
