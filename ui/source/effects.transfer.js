;(function($) {
  
  $.effects.transfer = function(o) {

    return this.queue(function() {

      // Create element
      var el = $(this);
      
      // Set options
      var mode = $.effects.setMode(el, o.options.mode || 'effect'); // Set Mode
      var target = $(o.options.to); // Find Target
      var position = el.position();
	  var transfer = $('<div id="fxTransfer"></div>').appendTo(document.body)
      
      // Set target css
      transfer.addClass(o.options.className);
      transfer.css({
        top: position['top'],
        left: position['left'],
        height: el.outerHeight({margin:true}) - parseInt(transfer.css('borderTopWidth')) - parseInt(transfer.css('borderBottomWidth')),
        width: el.outerWidth({margin:true}) - parseInt(transfer.css('borderLeftWidth')) - parseInt(transfer.css('borderRightWidth')),
        position: 'absolute'
      });
      
      // Animation
      position = target.position();
      animation = {
        top: position['top'],
        left: position['left'],
        height: target.outerHeight() - parseInt(transfer.css('borderTopWidth')) - parseInt(transfer.css('borderBottomWidth')),
        width: target.outerWidth() - parseInt(transfer.css('borderLeftWidth')) - parseInt(transfer.css('borderRightWidth'))
      };
      
      // Animate
      transfer.animate(animation, o.duration, o.options.easing, function() {
        transfer.remove(); // Remove div
        if(o.callback) o.callback.apply(this, arguments); // Callback
        el.dequeue();
      }); 
      
    });
    
  };
  
})(jQuery);
