(function( $ ) {
    $.widget( "custom.carousel", {
        // default options
        options: {
            orientation: 'vertical',
            classBase:'ui-carousel',
            width:'none',
            height:'none',
            classItemDefault:'ui-state-default',   
            classItemOver:'ui-state-hover',
            classItemActive:'ui-state-active',       
            classItemFocus:'ui-state-hover',
            classCapDefault:'ui-state-default',
            classCapOver:'ui-state-hover',
            uiRoundedCaps:true,
            uiRoundedItems:false,
            activeItem:null,
            focusItem:0,
            focusStep:3,
            caps:'standart',
            capSize:20,
            animationEasing:'swing',
            animationSpeed:'fast',
            hoverItemIn:null,
            hoverItemOut:null,
            hoverCapIn:null,
            hoverCapOut:null,
            click:null

        },  
        _setOption: function( key, value ) {
            if ( key == "focusItem" ) {
                // if user sets new focus item roll to focus
                this.options.focusItem = value;
                this._setview();
            }else{
                this._super( key, value );
            }
        },                     
        _create: function() {
            // adding base class to main container
            this.element.addClass( this.options.classBase );
            // and reloading
            this.refresh();  
        },
        refresh: function(){
            // if width is already set
            if(this.options.width == 'none'){ 
                this.options.width = this.element.width()
            }
            // it height is already set
            if(this.options.height == 'none'){ 
                this.options.height = this.element.height();
            }
            // resize the widget   
            this.element.width(this.options.width).height(this.options.height);
            // declare classBase for easier access
            var classBase = this.options.classBase;
            // create internal li element to contain the list 
            if(this.element.children('li.' + classBase + '-items').length ==0){
                this.element.append($('<li class="'+classBase+'-items">').append($('<ul class="'+classBase+'-items">')));
            }
            // move the elements to the internal list
            this.element.children( "li:not(."+classBase+"-items,."+classBase+"-cap-1,."+classBase+"-cap-2)" ).each( $.proxy(function( i, el ) {

                // Add the class so this option will not be processed next time the list is refreshed
                var $el = $( el ).addClass( classBase+'-item '+this.options.classItemDefault);
                // adding 100% width for verticals/height for horizontals
                if(this.options.orientation === 'vertical'){
                    $el.width(this.options.width); 
                }else if(this.options.orientation === 'horizontal'){
                    $el.height(this.options.height); 
                } 
                //add round corners
                if(this.options.uiRoundedItems)$el.addClass('ui-corner-all');

                // adding mouse hover handlers
                $el.hover(  $.proxy(function(eventobject){
                    this._hoverItemIn( eventobject );      
                },this), 
                $.proxy(function(eventobject){ 
                    this._hoverItemOut( eventobject );      
                },this));
                // adding click handler
                $el.click(  $.proxy(function(eventobject){
                    this._onClick(eventobject);  
                },this));
                // move the new item to the internal list
                this.element.find('ul.'+classBase + '-items').append($el);
            },this));
            //checking if there shoud be any caps
            if(this.options.caps == 'standart'){
                //check and making caps as needed
                // adding top/left cap
                if(this.element.children('.'+classBase+'-cap-1').length== 0){
                    //apply rounded corners 
                    if(this.options.orientation === 'vertical'){
                        this.element.prepend($('<li>').addClass(classBase +'-cap-1 '+this.options.classCapDefault).append($('<span class="ui-icon ui-icon-circle-triangle-n">')));   
                        if(this.options.uiRoundedCaps) this.element.children('li.'+classBase+'-cap-1').addClass('ui-corner-top');

                    }else if(this.options.orientation === 'horizontal'){
                        this.element.prepend($('<li>').addClass(classBase +'-cap-1 '+this.options.classCapDefault).append($('<span class="ui-icon ui-icon-circle-triangle-w">')));   
                        if(this.options.uiRoundedCaps) this.element.children('li.'+classBase+'-cap-1').addClass('ui-corner-left');

                    }



                    // adding hover handler to cap
                    this.element.children('li.'+classBase+'-cap-1').hover(  $.proxy(function(eventobject){

                        this._hoverCapIn(eventobject );      
                    },this), 
                    $.proxy(function(eventobject){ 
                        this._hoverCapOut(eventobject );      
                    },this));
                }
                // adding bottom/right cap
                if(this.element.children('.'+classBase+'-cap-2').length== 0){
                    //apply rounded corners 
                    if(this.options.orientation === 'vertical'){
                        this.element.append($('<li>').addClass(classBase +'-cap-2 '+this.options.classCapDefault).append($('<span class="ui-icon ui-icon-circle-triangle-s">')));   
                        if(this.options.uiRoundedCaps) this.element.children('li.'+classBase+'-cap-2').addClass('ui-corner-bottom');
                    }else if(this.options.orientation === 'horizontal'){
                        this.element.append($('<li>').addClass(classBase +'-cap-2 '+this.options.classCapDefault).append($('<span class="ui-icon ui-icon-circle-triangle-e">')));   
                        if(this.options.uiRoundedCaps) this.element.children('li.'+classBase+'-cap-2').addClass('ui-corner-right');

                    }

                    // adding hover handler to cap 
                    this.element.children('li.'+classBase+'-cap-2').hover(  $.proxy(function(eventobject){

                        this._hoverCapIn(eventobject );      
                    },this), 
                    $.proxy(function(eventobject){ 
                        this._hoverCapOut(eventobject );          
                    },this));
                }
                // aranging caps and list 
                this.element.children().css('float','left');
                if(this.options.orientation === 'vertical'){   
                    this.element.children('li.'+classBase+'-items').css({'width':this.options.width,'height':this.options.height-(this.options.capSize*2)});
                    var sumOfChildrenHeight = 0; 
                    this.element.find('ul.'+classBase+'-items').children().each(function() 
                    { 
                        sumOfChildrenHeight += $(this).outerHeight(); 
                    });
                    this.element.find('ul.'+classBase+'-items').width(this.options.width).height(sumOfChildrenHeight);
                    // getting content height from known outerHeight;
                    var capHeight = this.options.capSize 
                    -parseFloat(this.element.children('li.'+classBase+'-cap-1').css('border-top-width'))
                    -parseFloat(this.element.children('li.'+classBase+'-cap-1').css('border-bottom-width'))
                    -parseFloat(this.element.children('li.'+classBase+'-cap-1').css('padding-top'))
                    -parseFloat(this.element.children('li.'+classBase+'-cap-1').css('padding-bottom'));
                    // getting content width from known outerWidth; 
                    var capWidth = this.options.width 
                    -parseFloat(this.element.children('li.'+classBase+'-cap-1').css('border-left-width'))
                    -parseFloat(this.element.children('li.'+classBase+'-cap-1').css('border-right-width'))
                    -parseFloat(this.element.children('li.'+classBase+'-cap-1').css('padding-left'))
                    -parseFloat(this.element.children('li.'+classBase+'-cap-1').css('padding-right'));

                    this.element.children('li.'+classBase+'-cap-1,li.'+classBase+'-cap-2').height(capHeight).width(capWidth);
                }else if(this.options.orientation === 'horizontal'){
                    this.element.children('li.'+classBase+'-items').css({'width':this.options.width-(this.options.capSize*2),'height':this.options.height});
                    var sumOfChildrenWidth = 0; 
                    this.element.find('ul.'+classBase+'-items').children().each(function() 
                    { 
                        sumOfChildrenWidth += $(this).outerWidth(); 
                    });
                    this.element.find('ul.'+classBase+'-items').height(this.options.height).width(sumOfChildrenWidth);
                    // getting content height from known outerHeight;
                    var capHeight = this.options.height 
                    -parseFloat(this.element.children('li.'+classBase+'-cap-1').css('border-top-width'))
                    -parseFloat(this.element.children('li.'+classBase+'-cap-1').css('border-bottom-width'))
                    -parseFloat(this.element.children('li.'+classBase+'-cap-1').css('padding-top'))
                    -parseFloat(this.element.children('li.'+classBase+'-cap-1').css('padding-bottom'));
                    // getting content width from known outerWidth; 
                    var capWidth = this.options.capSize 
                    -parseFloat(this.element.children('li.'+classBase+'-cap-1').css('border-left-width'))
                    -parseFloat(this.element.children('li.'+classBase+'-cap-1').css('border-right-width'))
                    -parseFloat(this.element.children('li.'+classBase+'-cap-1').css('padding-left'))
                    -parseFloat(this.element.children('li.'+classBase+'-cap-1').css('padding-right'));

                    this.element.children('li.'+classBase+'-cap-1,li.'+classBase+'-cap-2').height(capHeight).width(capWidth); 
                }
                //adding click handler to caps
                this.element.children('li.'+classBase+'-cap-1').click(  $.proxy(function(eventobject){
                    this._viewback(eventobject);      
                },this));
                this.element.children('li.'+classBase+'-cap-2').click(  $.proxy(function(eventobject){
                    this._viewforward(eventobject);      
                },this));
            }


            this._setview();


        },
        _viewback:function(event){ 
            if(this.options.focusItem > 0)this.options.focusItem-=1;
            this._setview();

        },
        _viewforward:function(event){ 
            if(this.options.focusItem <  (this.element.find('ul.'+this.options.classBase+'-items').children().length-1)) this.options.focusItem+=1;
            this._setview();     
        },
        //the actual hover methods
        _setview:function(){  
            this.element.find('ul.'+this.options.classBase+'-items').children().removeClass(this.options.classItemFocus).addClass(this.options.classItemDefault);
            this.element.find('ul.'+this.options.classBase+'-items').children(':eq('+this.options.focusItem+')').removeClass(this.options.classItemDefault).addClass(this.options.classItemFocus);
            if(this.options.orientation ==='vertical'){
                var heightContainer=  this.element.find('li.'+this.options.classBase+'-items').height();
                var heightList=  this.element.find('ul.'+this.options.classBase+'-items').outerHeight();

                var topFocusItem=    this.element.find('ul.'+this.options.classBase+'-items').children(':eq('+this.options.focusItem+')').position().top;
                var heightFocusItem =  this.element.find('ul.'+this.options.classBase+'-items').children(':eq('+this.options.focusItem+')').outerHeight(); 
                var animationTarget = -(topFocusItem+(heightFocusItem/2))+(heightContainer/2);
                if(animationTarget > 0)  animationTarget = 0;
                if(animationTarget < -(heightList-heightContainer))animationTarget = -(heightList-heightContainer);    

                this.element.find('ul.'+this.options.classBase+'-items').animate({'top':animationTarget},this.options.animationSpeed,this.options.animationEasing);
            }else if(this.options.orientation ==='horizontal'){
                var widthContainer=  this.element.find('li.'+this.options.classBase+'-items').width();
                var widthList=  this.element.find('ul.'+this.options.classBase+'-items').outerWidth();

                var leftFocusItem=    this.element.find('ul.'+this.options.classBase+'-items').children(':eq('+this.options.focusItem+')').position().left;
                var widthFocusItem =  this.element.find('ul.'+this.options.classBase+'-items').children(':eq('+this.options.focusItem+')').outerWidth(); 
                var animationTarget = -(leftFocusItem+(widthFocusItem/2))+(widthContainer/2);
                if(animationTarget > 0)  animationTarget = 0;
                if(animationTarget < -(widthList-widthContainer))animationTarget = -(widthList-widthContainer);    
                this.element.find('ul.'+this.options.classBase+'-items').animate({'left':animationTarget},this.options.animationSpeed,this.options.animationEasing);

            }
        },
        _onClick:function(event){

            var target = $(event.currentTarget);
            target.siblings().removeClass(this.options.classItemActive).addClass(this.options.classItemDefault);
            target.removeClass(this.options.classItemDefault).addClass(this.options.classItemActive);
            this.options.focusItem = target.index();
            this._setview();     
            this._trigger( "click", null,  {'target':target,'index':target.index()} );      
        },
        _hoverItemIn:function(event){    
            var target = $(event.currentTarget);     
            $(target).removeClass(this.options.classItemDefault);               
            $(target).addClass(this.options.classItemOver);                         

            this._trigger( "hoverItemIn", null,  {'target':target,'index':target.index()} );      

        },
        _hoverItemOut:function(event){           
            var target = $(event.currentTarget);     
            $(target).removeClass(this.options.classItemOver);               
            $(target).addClass(this.options.classItemDefault);                         
            this._trigger( "hoverItemOut", null,  {'target':target,'index':target.index()} );  
        },
        _hoverCapIn:function(event){    
            var target = $(event.currentTarget);     
            $(target).removeClass(this.options.classCapDefault);               
            $(target).addClass(this.options.classCapOver);                         
            this._trigger( "hoverCapIn", null,  {'target':target} );      
        },
        _hoverCapOut:function(event){           
            var target = $(event.currentTarget);     
            $(target).removeClass(this.options.classCapOver);               
            $(target).addClass(this.options.classCapDefault);                         
            this._trigger( "hoverCapOut", null,  {'target':target} );      

        }
    });
}( jQuery ));
