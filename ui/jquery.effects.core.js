/*
 * jQuery UI Effects @VERSION
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/
 */
;jQuery.effects || (function($, undefined) {

$.effects = {};



/******************************************************************************/
/****************************** COLOR ANIMATIONS ******************************/
/******************************************************************************/


/**
 * jQuery Colors
 * @license Copyright 2010 Enideo. Released under dual MIT and GPL licenses.
*/

/**
 * jQuery Colors Core
 * Copyright 2010 Enideo. Released under dual MIT and GPL licenses.
*/

var Color = function(color, format, model){

  if( this instanceof Color === false ) return new Color(color, format, model);

  if( color && color instanceof Color ){
    return color;
  }

  this.currentModel = Color.defaultModel;

  if( color ){

    if( typeof color == 'string' ) {
      color = $.trim(color);
    }

    this.inputColor = color;

    /// valid input format
    if( format && format in Color.formats &&
      Color.formats[ format ].validate( color )===true ){

      this.inputFormat = format;

    /// otherwise try to guess the format
    }else{

      if( model===undefined ){
        model = format;
      }

      for( format in Color.formats ){
        if( Color.formats[ format ].validate(color)===true ){
          this.inputFormat = format;
          break;
        }
      }

    }


    if( this.inputFormat ){

      format = Color.formats[ format ];

      this.inputModel = model || format.model || Color.defaultInputModel ;

      ///apply input format conversion to it's default model
      color = applyModelMethod( format.toModel , this.inputModel, color );

      if( this.inputModel != this.currentModel ){

        color = Color.models[ this.inputModel ].sanitize( color );

        ///convert input color to default model
        color = applyModelMethod( Color.convertModels[ this.inputModel ], this.currentModel, color );

      }

      this.color = Color.models[ this.currentModel ].sanitize( color );

    }

  }else{

    /// creates random with no arguments
    this.color = Color.models[ this.currentModel ].sanitize( );

  }

  if( this.color ){

    return this;

  }else{

    throw('Color format unknown: ' + color);

  }


}


/// provides auto detection of model methods and fallback through RGB model if models are missing

function applyModelMethod(listModelMethods, modelName, color){

  /// check if model exists
  if( modelName in listModelMethods){

    return listModelMethods[modelName]( color );

  /// else convert through RGB if possible
  }else{

    if ( modelName=='RGB' || 'RGB' in Color.convertModels[modelName] ){

      if ( modelName!='RGB' ) color = Color.convertModels[modelName].RGB( color );

      for( var existingModel in listModelMethods ){

        if ( existingModel=='RGB' || existingModel in Color.convertModels.RGB ){

          if ( existingModel!='RGB' ) color = Color.convertModels.RGB[existingModel]( color );

          /// integer format
          color = $.colors.formats.array3Octet1Normalized.fromModel.RGB(color);

          return listModelMethods[ existingModel ]( color );

        }

      }

    }

  }

  /// else throw

  throw('No valid conversion methods for this color model: ' + modelName);

}

function getSetParameter(parameter, value){
  var index,
    haystack = $.colors.models[ this.currentModel ].parameterIndexes,
    color = this.currentModel == 'RGB' ? this.format('array3Octet1Normalized') : this.color; /// integer format

  if( parameter ){
    parameter = parameter.toLowerCase();

    if( parameter in haystack ){

      if( value!==undefined ){
        this.color[ haystack[parameter] ] = value;
        this.color = $.colors.models[ this.currentModel ].sanitize(this.color);
      }else{
        return color[ haystack[parameter] ];
      }

    }else{
      throw('Parameter not in the current color model: ' + parameter );
    }
  }else{
    return color;
  }

  return this;
};


Color.prototype = {

  get : getSetParameter,
  set : getSetParameter,

  model : function( newModel ){

    if( newModel === undefined ){

      return this.currentModel;

    }else if (newModel == this.currentModel ) {

      return this;

    }else if (newModel in Color.models) {

      this.color = applyModelMethod( Color.convertModels[this.currentModel] , newModel, this.color );
      this.currentModel = newModel;

      return this;

    }else{

      throw('Model does not exist');

    }

  },

  format : function( format ){

    var color = (this.currentModel == 'RGB' && format!=='array3Octet1Normalized' )
      ? this.format('array3Octet1Normalized') : this.color; /// integer format

    if ( format && format in Color.formats ){

      return applyModelMethod( Color.formats[ format ].fromModel , this.currentModel, color );

    }else{

      throw('Format does not exist');

    }

  },

  toString : function( format ){

    if( !format || format in Color.formats === false ){
      format = Color.defaultString;
    }

    try{
      return this.format( format ).toString();
    }catch(e){
      return this.format( Color.defaultString ).toString();
    }

  },


  isFormat : function( format ){

    if ( format && format in Color.formats ){
      return Color.formats[ format ].validate( this.inputColor );
    }else{
      throw('Format does not exist');
    }

  },


  mixWith : function( colorsToAdd, options ){

    var a=0, newBlend, mixer, model, baseDosage;

    if( typeof options=='number'){
      baseDosage = options;
    }

    newBlend = this.get();
    model = this.model();

    /// check array not a valid format before assuming multiple colors
    if( $.isArray(colorsToAdd) ){
      try{
        mixer = Color(colorsToAdd);
      }catch(e){
        for ( a=0; a<colorsToAdd.length; a++ ){
          if( colorsToAdd[a] instanceof Color == false ){
            colorsToAdd[a] = Color(colorsToAdd[a]);
          }

          if(a==0){
            mixer = colorsToAdd[a].model(model);
          }else{
            /// need to weigh in the mixers progressively stronger to get an overall equal blend
            mixer = mixer.mixWith( colorsToAdd[a], a/(a+1) );
          }
        }
      }

    }else{
      if( colorsToAdd instanceof Color == false ){
        colorsToAdd = Color(colorsToAdd);
      }
      mixer = colorsToAdd;
    }

    mixer = mixer.model(model).get();

    newBlend = newBlend.slice(0);
    mixer = mixer.slice(0);

    if( baseDosage==undefined ){
      if(a){
        baseDosage = 1/(a+1);
      }else{
        baseDosage = 0.5;
      }
    }

    for ( a=0; a<newBlend.length; a++ ){

      if( 'cycleMixes' in Color.models[ model ] && Color.models[ model ].cycleMixes[a] ){
        if( Color.models[ model ].cycleMixes[a] > 0 ){
          while( newBlend[a] > mixer[a] ) mixer[a] += Color.models[ model ].cycleMixes[a];
        }else{
          while( newBlend[a] < mixer[a] ) mixer[a] += Color.models[ model ].cycleMixes[a];
        }
      }

      newBlend[a] = newBlend[a]*baseDosage + mixer[a]*(1-baseDosage) ;

    }

    newBlend = Color.models[model].sanitize(newBlend);

    return $.extend($.colors(),{color: newBlend, currentModel:model});

  }


};


Color.formats = {

  'array3Octet' : {

    validate : function( color, maxLength ){

      var a=0, maxLength = maxLength || 3;

      if( $.isArray(color) && color.length==maxLength ){
        while ( a<maxLength ){
          if( typeof color[a] == 'number' && color[a]>=0 &&
          ( a<3 && color[a]<=255 && /^\d+$/.test(color[a].toString()) ) ||
          ( a==3 && color[a]<=1 ) ){
            a++;
          }else{
            break;
          }
        }
        if( a==maxLength ){
          return true;
        }
      }

      return false;

    },

    toModel : {

      'RGB' : function ( color ){

        return color.slice(0,3);

      }

    },

    fromModel : {

      'RGB' : function ( color ){

        return color.slice(0,3);

      }

    }
  },

  'array3Octet1Normalized' : {

    validate : function( color ){

      return Color.formats.array3Octet.validate( color, 4 );

    },

    toModel : {

      'RGB' : function ( color ){

        return color.slice(0,4);

      }

    },

    fromModel : {

      'RGB' : function ( color ){

        var a=0;

        color = color.slice(0,4)

        while(a<3){
          color[a] = Math.round( color[a] );
          a++;
        }

        return color;

      }

    }
  },

  'rgb' : {

    validate : function( color, returnTuples ){

      var a=1, result;

      if( color && typeof color == 'string' &&
        (result = /^rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)$/.exec(color)) ){

        while ( a<4 ){
          result[a] = parseInt(result[a])
          if( result[a] < 256 ){
            a++;
          }else{
            break;
          }
        }

        if( a==4 ){
          if( returnTuples ){
            result.shift();
            return result.slice(0);
          }else{
            return true;
          }
        }

      }
      return false;
    },

    fromModel : {

      'RGB' : function(rgb){
        return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
      }
    },

    toModel : {

      'RGB' : function(rgbString){
        var result = Color.formats.rgb.validate(rgbString,true);
        if(result===false){
          return null;
        }else{
          return result;
        }

      }
    },
    model : 'RGB'
  }

}


Color.models = {
  'RGB' : {

    sanitize : function( rgb ){
      var a;

      if ( !rgb || !$.isArray(rgb) ){
        rgb = [
          Math.floor(256*Math.random()),
          Math.floor(256*Math.random()),
          Math.floor(256*Math.random()),
          Math.random()
        ];
      }

      while( rgb.length<4 ){

        if(rgb.length==3){
          rgb.push( 1 );
        }else{
          rgb.push( 0 );
        }

      }

      rgb = rgb.slice(0,4);

      for( a=0; a<rgb.length; a++ ){

        if ( !rgb[a] ){
          rgb[a] = 0;
        }

        if( a<3 ){

          if( rgb[a] > 255 ){
            rgb[a] = 255;
          }
          if( rgb[a] < 0 ){
            rgb[a] = 0;
          }
        }else if ( a==3 ){
          rgb[a] = parseFloat(rgb[a])
          if( rgb[a] > 1 ){
            rgb[a] = 1;
          }
          if( rgb[a] < 0 ){
            rgb[a] = 0;
          }
        }
      }

      return rgb;
    },

    parameterIndexes : {
      'r':0,
      'g':1,
      'b':2,
      'a':3,
      'red':0,
      'green':1,
      'blue':2,
      'alpha':3
    }

  }
};

Color.convertModels = {};

Color.defaultInputModel = Color.defaultModel = 'RGB';
Color.defaultString = 'rgb';

if($.colors===undefined){
  $.extend({colors:Color});
}
/**
 * jQuery Colors Hex String
 * Copyright 2010 Enideo. Released under dual MIT and GPL licenses.
*/

var hexStringObject = {
  'hex' : {

    /// Based on http://github.com/jquery/jquery-color

    validate : function( color, returnTuples ){

      var result;

      if( color && typeof color == 'string' ){

        if ( result = /^#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})$/.exec(color) ){

          if( returnTuples ){
            return [
              parseInt(result[1],16),
              parseInt(result[2],16),
              parseInt(result[3],16)
            ];
          }else{
            return true;
          }

        }else if( result = /^#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])$/.exec(color) ){

          if( returnTuples ){
            return [
              parseInt(result[1]+result[1],16),
              parseInt(result[2]+result[2],16),
              parseInt(result[3]+result[3],16)
            ];
          }else{
            return true;
          }

        }

      }
      return false;
    },

    /// From http://acko.net/dev/farbtastic

    fromModel : {

      'RGB' : function(rgb){
        return '#' +
          (rgb[0] < 16 ? '0' : '') + rgb[0].toString(16) +
          (rgb[1] < 16 ? '0' : '') + rgb[1].toString(16) +
          (rgb[2] < 16 ? '0' : '') + rgb[2].toString(16);
      }
    },

    toModel : {

      'RGB' : function(hexString){
        var result = hexStringObject.hex.validate(hexString,true);
        if(result===false){
          return null;
        }else{
          return result;
        }
      }

    }
  }
};

$.extend($.colors.formats,hexStringObject);/**
 * jQuery Colors transparent format
 * Copyright 2010 Enideo. Released under dual MIT and GPL licenses.
*/

$.extend($.colors.formats,{

  'transparent' : {

    validate : function( color ){

      return ( color && typeof color == 'string' && /^transparent$/i.test(color) );

    },

    fromModel : {

      'RGB' : function(rgb){
        if( rgb[3]==0 ) {
          return 'transparent';
        }else{
          throw('Color is not transparent: ' + rgb.toString() );
        }
      }
    },

    toModel : {

      'RGB' : function( ){
        return [255,255,255,0];
      }

    }
  }

});/**
 * jQuery Colors Name
 * Copyright 2010 Enideo. Released under dual MIT and GPL licenses.
*/
var namedStrings = {

  'name' : {

    /// http://www.w3.org/TR/css3-color/#svg-color
    list : {
      aliceblue :[ 240,248,255 ],
      antiquewhite :[ 250,235,215 ],
      aqua :[ 0,255,255 ],
      aquamarine :[ 127,255,212 ],
      azure :[ 240,255,255 ],
      beige :[ 245,245,220 ],
      bisque :[ 255,228,196 ],
      black :[ 0,0,0 ],
      blanchedalmond :[ 255,235,205 ],
      blue :[ 0,0,255 ],
      blueviolet :[ 138,43,226 ],
      brown :[ 165,42,42 ],
      burlywood :[ 222,184,135 ],
      cadetblue :[ 95,158,160 ],
      chartreuse :[ 127,255,0 ],
      chocolate :[ 210,105,30 ],
      coral :[ 255,127,80 ],
      cornflowerblue :[ 100,149,237 ],
      cornsilk :[ 255,248,220 ],
      crimson :[ 220,20,60 ],
      cyan :[ 0,255,255 ],
      darkblue :[ 0,0,139 ],
      darkcyan :[ 0,139,139 ],
      darkgoldenrod :[ 184,134,11 ],
      darkgray :[ 169,169,169 ],
      darkgreen :[ 0,100,0 ],
      darkgrey :[ 169,169,169 ],
      darkkhaki :[ 189,183,107 ],
      darkmagenta :[ 139,0,139 ],
      darkolivegreen :[ 85,107,47 ],
      darkorange :[ 255,140,0 ],
      darkorchid :[ 153,50,204 ],
      darkred :[ 139,0,0 ],
      darksalmon :[ 233,150,122 ],
      darkseagreen :[ 143,188,143 ],
      darkslateblue :[ 72,61,139 ],
      darkslategray :[ 47,79,79 ],
      darkslategrey :[ 47,79,79 ],
      darkturquoise :[ 0,206,209 ],
      darkviolet :[ 148,0,211 ],
      deeppink :[ 255,20,147 ],
      deepskyblue :[ 0,191,255 ],
      dimgray :[ 105,105,105 ],
      dimgrey :[ 105,105,105 ],
      dodgerblue :[ 30,144,255 ],
      firebrick :[ 178,34,34 ],
      floralwhite :[ 255,250,240 ],
      forestgreen :[ 34,139,34 ],
      fuchsia :[ 255,0,255 ],
      gainsboro :[ 220,220,220 ],
      ghostwhite :[ 248,248,255 ],
      gold :[ 255,215,0 ],
      goldenrod :[ 218,165,32 ],
      gray :[ 128,128,128 ],
      green :[ 0,128,0 ],
      greenyellow :[ 173,255,47 ],
      grey :[ 128,128,128 ],
      honeydew :[ 240,255,240 ],
      hotpink :[ 255,105,180 ],
      indianred :[ 205,92,92 ],
      indigo :[ 75,0,130 ],
      ivory :[ 255,255,240 ],
      khaki :[ 240,230,140 ],
      lavender :[ 230,230,250 ],
      lavenderblush :[ 255,240,245 ],
      lawngreen :[ 124,252,0 ],
      lemonchiffon :[ 255,250,205 ],
      lightblue :[ 173,216,230 ],
      lightcoral :[ 240,128,128 ],
      lightcyan :[ 224,255,255 ],
      lightgoldenrodyellow :[ 250,250,210 ],
      lightgray :[ 211,211,211 ],
      lightgreen :[ 144,238,144 ],
      lightgrey :[ 211,211,211 ],
      lightpink :[ 255,182,193 ],
      lightsalmon :[ 255,160,122 ],
      lightseagreen :[ 32,178,170 ],
      lightskyblue :[ 135,206,250 ],
      lightslategray :[ 119,136,153 ],
      lightslategrey :[ 119,136,153 ],
      lightsteelblue :[ 176,196,222 ],
      lightyellow :[ 255,255,224 ],
      lime :[ 0,255,0 ],
      limegreen :[ 50,205,50 ],
      linen :[ 250,240,230 ],
      magenta :[ 255,0,255 ],
      maroon :[ 128,0,0 ],
      mediumaquamarine :[ 102,205,170 ],
      mediumblue :[ 0,0,205 ],
      mediumorchid :[ 186,85,211 ],
      mediumpurple :[ 147,112,219 ],
      mediumseagreen :[ 60,179,113 ],
      mediumslateblue :[ 123,104,238 ],
      mediumspringgreen :[ 0,250,154 ],
      mediumturquoise :[ 72,209,204 ],
      mediumvioletred :[ 199,21,133 ],
      midnightblue :[ 25,25,112 ],
      mintcream :[ 245,255,250 ],
      mistyrose :[ 255,228,225 ],
      moccasin :[ 255,228,181 ],
      navajowhite :[ 255,222,173 ],
      navy :[ 0,0,128 ],
      oldlace :[ 253,245,230 ],
      olive :[ 128,128,0 ],
      olivedrab :[ 107,142,35 ],
      orange :[ 255,165,0 ],
      orangered :[ 255,69,0 ],
      orchid :[ 218,112,214 ],
      palegoldenrod :[ 238,232,170 ],
      palegreen :[ 152,251,152 ],
      paleturquoise :[ 175,238,238 ],
      palevioletred :[ 219,112,147 ],
      papayawhip :[ 255,239,213 ],
      peachpuff :[ 255,218,185 ],
      peru :[ 205,133,63 ],
      pink :[ 255,192,203 ],
      plum :[ 221,160,221 ],
      powderblue :[ 176,224,230 ],
      purple :[ 128,0,128 ],
      red :[ 255,0,0 ],
      rosybrown :[ 188,143,143 ],
      royalblue :[ 65,105,225 ],
      saddlebrown :[ 139,69,19 ],
      salmon :[ 250,128,114 ],
      sandybrown :[ 244,164,96 ],
      seagreen :[ 46,139,87 ],
      seashell :[ 255,245,238 ],
      sienna :[ 160,82,45 ],
      silver :[ 192,192,192 ],
      skyblue :[ 135,206,235 ],
      slateblue :[ 106,90,205 ],
      slategray :[ 112,128,144 ],
      slategrey :[ 112,128,144 ],
      snow :[ 255,250,250 ],
      springgreen :[ 0,255,127 ],
      steelblue :[ 70,130,180 ],
      tan :[ 210,180,140 ],
      teal :[ 0,128,128 ],
      thistle :[ 216,191,216 ],
      tomato :[ 255,99,71 ],
      turquoise :[ 64,224,208 ],
      violet :[ 238,130,238 ],
      wheat :[ 245,222,179 ],
      white :[ 255,255,255 ],
      whitesmoke :[ 245,245,245 ],
      yellow :[ 255,255,0 ],
      yellowgreen :[ 154,205,50]
    },

    validate : function( color ){

      if( !color || typeof color != 'string' || /^\w+$/.test(color)==false ){
        return false;
      }

      color = color.toLowerCase();

      return ( color in this.list  )

    },

    fromModel : {

      'RGB' : function(rgb){

        var name;

        rgb = rgb.slice(0,3).toString();

        for( name in namedStrings.name.list ){
          if ( namedStrings.name.list[name].toString() == rgb ){
            return name;
          }
        }

        throw('No name corresponds to the color: ' + rgb.toString() );

      }

    },

    toModel : {

      'RGB' : function(name){

        name = name.toLowerCase();

        return namedStrings.name.list[name];

      }

    }

  }

};

$.extend($.colors.formats,namedStrings);/**
 * jQuery Colors rgba format
 * Copyright 2010 Enideo. Released under dual MIT and GPL licenses.
*/
$.extend($.colors.formats,{

  'rgba' : {

    validate : function( color, returnTuples ){

      var a=1, result;

      if( color && typeof color == 'string' &&
        (result = /^rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*(0|1|0\.[0-9]+)\s*\)$/.exec(color)) ){

        while ( a<4 ){
          result[a] = parseInt(result[a])
          if( result[a] < 256 ){
            a++;
          }else{
            break;
          }
        }

        if( a==4 && result[4]>=0 && result[4]<=1 ){
          result[a] = parseFloat(result[a])
          a++;
        }

        if( a==5 ){
          if( returnTuples ){
            result.shift();
            return result.slice(0);
          }else{
            return true;
          }
        }

      }
      return false;
    },

    fromModel : {

      'RGB' : function(rgb){
        return 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + rgb[3] + ')';
      }
    },

    toModel : {

      'RGB' : function(rgbaString){
        var result = Color.formats.rgba.validate(rgbaString,true);
        if(result===false){
          return null;
        }else{
          return result;
        }
      }
    },
    model : 'RGB'
  }

});/**
 * jQuery Colors Animate
 * Copyright 2010 Enideo. Released under dual MIT and GPL licenses.
*/

/// Based on http://github.com/jquery/jquery-color

/// We override the animation for all of these color styles
  $.each(['backgroundColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'color', 'outlineColor'], function(i,attr){
    $.fx.step[attr] = function(fx){
      var prefferedModel;

      if ( !fx.colorInit ) {
        fx.colorInit = true;

        fx.start = $.colors( $(fx.elem).visibleColor( attr ) );

        if( /^(|transparent)$/i.test( $.curCSS(fx.elem, attr) ) ){

          /// in case rgba is supported, ensure a gradual change to transparent
          fx.start.model('RGB').set('alpha',0);
          /// RGB provides best gradual fade if alpha is not supported by the browser
          prefferedModel = 'RGB';
        }


        if( fx.end=='transparent' ){
          fx.middle = $.colors( $(fx.elem).parent().visibleColor( attr ) );
          /// in case rgba is supported, ensure a gradual change to transparent
          fx.middle.model('RGB').set('alpha',0);
          /// RGB provides best gradual fade if alpha is not supported by the browser
          prefferedModel = 'RGB';
        }else if( fx.end=='' ){
          $(fx.elem).css(attr,'');
          fx.middle = $.colors( $(fx.elem).css(attr) );
        }else{
          fx.middle = $.colors(fx.end);
        }

        if(fx.options.mixModel!==undefined){
          prefferedModel = fx.options.mixModel;
        }
        if(prefferedModel!==undefined){
          fx.start.model(prefferedModel);
          fx.middle.model(prefferedModel);
        }

      }

      if(fx.pos!=1){
        fx.elem.style[attr] = fx.start.mixWith( fx.middle, Math.max(Math.min(1-fx.pos,1),0) ).toString();
      }else{
        fx.elem.style[attr] = fx.end;
      }

    }
  });


  jQuery.fn.visibleColor = function(attr) {
    var color, elem = this.get(0);

    do {
      color = $.curCSS(elem, attr);

      /// Keep going until we find an element that has color, or we hit the body
      if ( color != '' && color != 'transparent' ) break;

      if( $.nodeName(elem, "body") ){
        color = 'transparent';
        break;
      }

      attr = "backgroundColor";
    } while ( elem = elem.parentNode );

    return color;
  };/**
 * jQuery Colors Browser Support
 * Copyright 2010 Enideo. Released under dual MIT and GPL licenses.
*/

  $.extend($.support,{
    rgba : /rgba/.test( $('<div/>').attr('style','background:#f00;background:rgba(0,0,0,0.5);').css('background-color') ),
    hsl : /hsl/.test( $('<div/>').attr('style','background:#f00;background:hsl(0,0,0);').css('background-color') ),
    hsla : /hsla/.test( $('<div/>').attr('style','background:#f00;background:hsla(0,0,0,0.5);').css('background-color') )
  });

  if( 'rgba' in $.support && $.support.rgba ){
    $.colors.defaultString = 'rgba';
  }/**
 * jQuery Colors HSL
 * Copyright 2010 Enideo. Released under dual MIT and GPL licenses.
*/

var hslRgbConversion = {
  /// Credits to http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
  'RGB' : {
    'HSL' : function(rgb){

      var r = rgb[0]/255,
        g = rgb[1]/255,
        b = rgb[2]/255,
        max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        delta = max - min,
        h, s,
        l = (max + min) / 2;

      if(max == min){
          h = s = 0; // achromatic
      }else{
          s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
          if( max==r ){

              h = (g - b) / delta + (g < b ? 6 : 0);

          }else if ( max==g ){

              h = (b - r) / delta + 2;

          }else{ /// max==b

            h = (r - g) / delta + 4;

          }
          h /= 6;
      }

      return [h*360, s*100, l*100, rgb[3]];
    }

  },

  'HSL' : {
    'RGB' : function(hsl){

      var r, g, b, q, p,
        h = hsl[0]/360,
        s = hsl[1]/100,
        l = hsl[2]/100;

      if(s == 0){
          r = g = b = l; // achromatic

      }else{

          q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          p = 2 * l - q;
          r = hue2rgb(p, q, h + 1/3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1/3);
      }

      return [r * 255, g * 255, b * 255, hsl[3]];

      function hue2rgb(p, q, t){
        if( t<0 ) t+=1;
        if( t>1 ) t-=1;

        if(t < 1/6) {
          return p + (q - p) * 6 * t;
        }else if(t < 1/2) {
          return q;
        }else if(t < 2/3) {
          return p + (q - p) * (2/3 - t) * 6;
        }else{
          return p;
        }
      }

    }
  }
},

  hslModel = {
    'HSL' : {
      sanitize : function( hsl ){
        var a;

        if ( !hsl || !$.isArray(hsl) ){
          hsl = [
            Math.floor(361*Math.random()),
            Math.floor(101*Math.random()),
            Math.floor(101*Math.random()),
            Math.random()
          ];
        }


        while( hsl.length<4 ){
          if(hsl.length==3){
            hsl.push( 1 );
          }else{
            hsl.push( 0 );
          }
        }

        hsl = hsl.slice(0,4);

        for( a=0; a<hsl.length; a++ ){

          if (!hsl[a] ){
            hsl[a] = 0;
          }

          hsl[a] = parseFloat(hsl[a]);

          if( a==0 ){

            while( hsl[a] > 360 ){
              hsl[a] -= 360;
            }
            if( hsl[a] < 0 ){
              hsl[a] += 360;
            }

          }else if( a<3 ){

            while( hsl[a] > 100 ){
              hsl[a] = 100;
            }
            if( hsl[a] < 0 ){
              hsl[a] = 0;
            }
          }else if ( a==3 ){

            if( hsl[a] > 1 ){
              hsl[a] = 1;
            }
            if( hsl[a] < 0 ){
              hsl[a] = 0;
            }
          }
        }

        return hsl;
      },

      parameterIndexes : {
        'h':0,
        's':1,
        'l':2,
        'a':3,
        'hue':0,
        'saturation':1,
        'lightness':2,
        'alpha':3
      },

      cycleMixes : [360,0,0,0],

      reverseCylce : function ( parameter ){
        this.cycleMixes[ this.parameterIndexes[ parameter ] ] *= -1;
      }

    }

  },

  hslFormats = {

    'array1Circle2Percentage' : {

      validate : function( color, maxLength ){

        var a=0, maxLength = maxLength || 3;

        if( $.isArray(color) && color.length==maxLength ){
          while ( a<maxLength ){
            if( typeof color[a] == 'number' && color[a]>=0 &&
              ( ( a==0 && color[a]<=360 ) || ((a==1||a==2) && color[a]<=100 ) || ( a==3 && color[a]<=1 ) ) ){
              a++;
            }else{
              break;
            }
          }
          if( a==maxLength ){
            return true;
          }
        }

        return false;

      },

      toModel : {
        'HSL' : function ( color ){
          return color.slice(0,3);
        }
      },
      fromModel : {
        'HSL' : function ( color ){
          return color.slice(0,3);
        }
      }

    },

    'array1Circle2Percentage1Normalized' : {

      validate : function( color ){

        return hslFormats.array1Circle2Percentage.validate( color, 4 );

      },

      toModel : {
        'HSL' : function ( color ){
          return color.slice(0,4);
        }
      },
      fromModel : {
        'HSL' : function ( color ){
          return color.slice(0,4);
        }
      }

    }


  };

$.extend(true, $.colors.convertModels,hslRgbConversion);
$.extend($.colors.models,hslModel);
$.extend($.colors.formats,hslFormats);



/******************************************************************************/
/****************************** CLASS ANIMATIONS ******************************/
/******************************************************************************/

var classAnimationActions = ['add', 'remove', 'toggle'],
	shorthandStyles = {
		border: 1,
		borderBottom: 1,
		borderColor: 1,
		borderLeft: 1,
		borderRight: 1,
		borderTop: 1,
		borderWidth: 1,
		margin: 1,
		padding: 1
	};

function getElementStyles() {
	var style = document.defaultView
			? document.defaultView.getComputedStyle(this, null)
			: this.currentStyle,
		newStyle = {},
		key,
		camelCase;

	// webkit enumerates style porperties
	if (style && style.length && style[0] && style[style[0]]) {
		var len = style.length;
		while (len--) {
			key = style[len];
			if (typeof style[key] == 'string') {
				camelCase = key.replace(/\-(\w)/g, function(all, letter){
					return letter.toUpperCase();
				});
				newStyle[camelCase] = style[key];
			}
		}
	} else {
		for (key in style) {
			if (typeof style[key] === 'string') {
				newStyle[key] = style[key];
			}
		}
	}
	
	return newStyle;
}

function filterStyles(styles) {
	var name, value;
	for (name in styles) {
		value = styles[name];
		if (
			// ignore null and undefined values
			value == null ||
			// ignore functions (when does this occur?)
			$.isFunction(value) ||
			// shorthand styles that need to be expanded
			name in shorthandStyles ||
			// ignore scrollbars (break in IE)
			(/scrollbar/).test(name) ||

			// only colors or values that can be converted to numbers
			(!(/color/i).test(name) && isNaN(parseFloat(value)))
		) {
			delete styles[name];
		}
	}
	
	return styles;
}

function styleDifference(oldStyle, newStyle) {
	var diff = { _: 0 }, // http://dev.jquery.com/ticket/5459
		name;

	for (name in newStyle) {
		if (oldStyle[name] != newStyle[name]) {
			diff[name] = newStyle[name];
		}
	}

	return diff;
}

$.effects.animateClass = function(value, duration, easing, callback) {
	if ($.isFunction(easing)) {
		callback = easing;
		easing = null;
	}

	return this.each(function() {

		var that = $(this),
			originalStyleAttr = that.attr('style') || ' ',
			originalStyle = filterStyles(getElementStyles.call(this)),
			newStyle,
			className = that.attr('className');

		$.each(classAnimationActions, function(i, action) {
			if (value[action]) {
				that[action + 'Class'](value[action]);
			}
		});
		newStyle = filterStyles(getElementStyles.call(this));
		that.attr('className', className);

		that.animate(styleDifference(originalStyle, newStyle), duration, easing, function() {
			$.each(classAnimationActions, function(i, action) {
				if (value[action]) { that[action + 'Class'](value[action]); }
			});
			// work around bug in IE by clearing the cssText before setting it
			if (typeof that.attr('style') == 'object') {
				that.attr('style').cssText = '';
				that.attr('style').cssText = originalStyleAttr;
			} else {
				that.attr('style', originalStyleAttr);
			}
			if (callback) { callback.apply(this, arguments); }
		});
	});
};

$.fn.extend({
	_addClass: $.fn.addClass,
	addClass: function(classNames, speed, easing, callback) {
		return speed ? $.effects.animateClass.apply(this, [{ add: classNames },speed,easing,callback]) : this._addClass(classNames);
	},

	_removeClass: $.fn.removeClass,
	removeClass: function(classNames,speed,easing,callback) {
		return speed ? $.effects.animateClass.apply(this, [{ remove: classNames },speed,easing,callback]) : this._removeClass(classNames);
	},

	_toggleClass: $.fn.toggleClass,
	toggleClass: function(classNames, force, speed, easing, callback) {
		if ( typeof force == "boolean" || force === undefined ) {
			if ( !speed ) {
				// without speed parameter;
				return this._toggleClass(classNames, force);
			} else {
				return $.effects.animateClass.apply(this, [(force?{add:classNames}:{remove:classNames}),speed,easing,callback]);
			}
		} else {
			// without switch parameter;
			return $.effects.animateClass.apply(this, [{ toggle: classNames },force,speed,easing]);
		}
	},

	switchClass: function(remove,add,speed,easing,callback) {
		return $.effects.animateClass.apply(this, [{ add: add, remove: remove },speed,easing,callback]);
	}
});



/******************************************************************************/
/*********************************** EFFECTS **********************************/
/******************************************************************************/

$.extend($.effects, {
	version: "@VERSION",

	// Saves a set of properties in a data storage
	save: function(element, set) {
		for(var i=0; i < set.length; i++) {
			if(set[i] !== null) element.data("ec.storage."+set[i], element[0].style[set[i]]);
		}
	},

	// Restores a set of previously saved properties from a data storage
	restore: function(element, set) {
		for(var i=0; i < set.length; i++) {
			if(set[i] !== null) element.css(set[i], element.data("ec.storage."+set[i]));
		}
	},

	setMode: function(el, mode) {
		if (mode == 'toggle') mode = el.is(':hidden') ? 'show' : 'hide'; // Set for toggle
		return mode;
	},

	getBaseline: function(origin, original) { // Translates a [top,left] array into a baseline value
		// this should be a little more flexible in the future to handle a string & hash
		var y, x;
		switch (origin[0]) {
			case 'top': y = 0; break;
			case 'middle': y = 0.5; break;
			case 'bottom': y = 1; break;
			default: y = origin[0] / original.height;
		};
		switch (origin[1]) {
			case 'left': x = 0; break;
			case 'center': x = 0.5; break;
			case 'right': x = 1; break;
			default: x = origin[1] / original.width;
		};
		return {x: x, y: y};
	},

	// Wraps the element around a wrapper that copies position properties
	createWrapper: function(element) {

		// if the element is already wrapped, return it
		if (element.parent().is('.ui-effects-wrapper')) {
			return element.parent();
		}

		// wrap the element
		var props = {
				width: element.outerWidth(true),
				height: element.outerHeight(true),
				'float': element.css('float')
			},
			wrapper = $('<div></div>')
				.addClass('ui-effects-wrapper')
				.css({
					fontSize: '100%',
					background: 'transparent',
					border: 'none',
					margin: 0,
					padding: 0
				});

		element.wrap(wrapper);
		wrapper = element.parent(); //Hotfix for jQuery 1.4 since some change in wrap() seems to actually loose the reference to the wrapped element

		// transfer positioning properties to the wrapper
		if (element.css('position') == 'static') {
			wrapper.css({ position: 'relative' });
			element.css({ position: 'relative' });
		} else {
			$.extend(props, {
				position: element.css('position'),
				zIndex: element.css('z-index')
			});
			$.each(['top', 'left', 'bottom', 'right'], function(i, pos) {
				props[pos] = element.css(pos);
				if (isNaN(parseInt(props[pos], 10))) {
					props[pos] = 'auto';
				}
			});
			element.css({position: 'relative', top: 0, left: 0 });
		}

		return wrapper.css(props).show();
	},

	removeWrapper: function(element) {
		if (element.parent().is('.ui-effects-wrapper'))
			return element.parent().replaceWith(element);
		return element;
	},

	setTransition: function(element, list, factor, value) {
		value = value || {};
		$.each(list, function(i, x){
			unit = element.cssUnit(x);
			if (unit[0] > 0) value[x] = unit[0] * factor + unit[1];
		});
		return value;
	}
});


function _normalizeArguments(effect, options, speed, callback) {
	// shift params for method overloading
	if (typeof effect == 'object') {
		callback = options;
		speed = null;
		options = effect;
		effect = options.effect;
	}
	if ($.isFunction(options)) {
		callback = options;
		speed = null;
		options = {};
	}
        if (typeof options == 'number' || $.fx.speeds[options]) {
		callback = speed;
		speed = options;
		options = {};
	}
	if ($.isFunction(speed)) {
		callback = speed;
		speed = null;
	}

	options = options || {};

	speed = speed || options.duration;
	speed = $.fx.off ? 0 : typeof speed == 'number'
		? speed : $.fx.speeds[speed] || $.fx.speeds._default;

	callback = callback || options.complete;

	return [effect, options, speed, callback];
}

$.fn.extend({
	effect: function(effect, options, speed, callback) {
		var args = _normalizeArguments.apply(this, arguments),
			// TODO: make effects takes actual parameters instead of a hash
			args2 = {
				options: args[1],
				duration: args[2],
				callback: args[3]
			},
			effectMethod = $.effects[effect];
		
		return effectMethod && !$.fx.off ? effectMethod.call(this, args2) : this;
	},

	_show: $.fn.show,
	show: function(speed) {
		if (!speed || typeof speed == 'number' || $.fx.speeds[speed] || !$.effects[speed] ) {
			return this._show.apply(this, arguments);
		} else {
			var args = _normalizeArguments.apply(this, arguments);
			args[1].mode = 'show';
			return this.effect.apply(this, args);
		}
	},

	_hide: $.fn.hide,
	hide: function(speed) {
		if (!speed || typeof speed == 'number' || $.fx.speeds[speed] || !$.effects[speed] ) {
			return this._hide.apply(this, arguments);
		} else {
			var args = _normalizeArguments.apply(this, arguments);
			args[1].mode = 'hide';
			return this.effect.apply(this, args);
		}
	},

	// jQuery core overloads toggle and creates _toggle
	__toggle: $.fn.toggle,
	toggle: function(speed) {
		if (!speed || typeof speed == 'number' || $.fx.speeds[speed] || !$.effects[speed]  ||
			typeof speed == 'boolean' || $.isFunction(speed)) {
			return this.__toggle.apply(this, arguments);
		} else {
			var args = _normalizeArguments.apply(this, arguments);
			args[1].mode = 'toggle';
			return this.effect.apply(this, args);
		}
	},

	// helper functions
	cssUnit: function(key) {
		var style = this.css(key), val = [];
		$.each( ['em','px','%','pt'], function(i, unit){
			if(style.indexOf(unit) > 0)
				val = [parseFloat(style), unit];
		});
		return val;
	}
});



/******************************************************************************/
/*********************************** EASING ***********************************/
/******************************************************************************/

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 *
 * Open source under the BSD License.
 *
 * Copyright 2008 George McGinley Smith
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
$.easing.jswing = $.easing.swing;

$.extend($.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert($.easing.default);
		return $.easing[$.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - $.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return $.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return $.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

})(jQuery);
