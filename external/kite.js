/* KITE Is a Template Engine 
   Copyright (c) 2011 Andrew Fedoniouk, http://terrainformatica.com/

  Permission is hereby granted, free of charge, to any person obtaining
  a copy of this software and associated documentation files (the
  "Software"), to deal in the Software without restriction, including
  without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so, subject to
  the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
  WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. */
  
 // KiTE home: http://code.google.com/p/kite/

(kite = function(template, /*optional*/ data)
  {
    var out = "";       // out buffer
    var parts = [];     // compiled template parts
    var context = null; // current context data object
    var context_index = null;   // current context index 
    var formatters = kite.formatters || {};
     
    if( template.charAt(0) == "#" ) { // template is defined by id of <script type="text/x-kite"> element
      var templateElement = null;
      templateElement = document.getElementById(template.substr(1));
      if(!templateElement) throw "Template element #" + templateElement + " not found";
      template = templateElement.innerHTML; // grab its text and proceed with compilation 
    }
   
    function exec_range(from_index, to_index) {
      for( var i = from_index + 1; i < to_index; ) {
        var el = parts[i];
        if( typeof el == "function" ) i += el(); else { out += el; ++i; } 
      }
    }

    function exec_block(data, from_index, to_index) {
      var saved_context = context;
      var saved_index = context_index;
      if( data instanceof Array ) {
        var nm = data.length;
        for( context_index = 0; context_index < nm; ++context_index ) { context = data[context_index];  
            exec_range(from_index, to_index); } }
      else {
        context = data; context_index = undefined;
        exec_range(from_index, to_index); }
      context = saved_context;
      context_index = saved_index;
    }
    
    function exec(data) { // instantiate the template
      out = ""; 
      exec_block(data instanceof Array?({"":data}):data, -1, parts.length ); // execute the block
      return out; //out.join(""); // output is an array of strings, glue them together and return.  
    }
    
    function has_something(v) { // check if 'v' is either non-empty array or !!v === true
      if( !v ) return false;
      if( (v instanceof Array) && v.length == 0 ) return false;
      return true;
    }
    
    function decl_block(name, from_index, to_index, done_index) {
      return function() { // returns block processing function
        var data = context[name];
        if( has_something(data) )
        {
          exec_block(data, from_index, to_index);
          return (done_index || to_index) - from_index;
        }
        return to_index - from_index; };      
    }
    
    function decl_terminal(name)
    {
      var frmf, fmti = name.indexOf("|");
      if( fmti >= 0) { frmf = name.substr(fmti+1); 
                       name = name.substr(0,fmti);
                       frmf = formatters[frmf]; }
      if( name == "." )
      {
        if( frmf ) return function() { out += frmf(context,context); return 1; };
        else       return function() { if( context !== undefined ) out += context; return 1; };
      }
      else
      {
        if( frmf ) return function() { var v = context[name]; out += frmf(v,context); return 1; };
        else       return function() { var v = context[name]; if( v !== undefined ) out += v; return 1; };
      }
    }
    
    function decl_range(from_index, to_index)
    {
      return function() { 
        exec_range(from_index, to_index);
        return to_index - from_index + 1; };
    }  
   
    function decl_condition(text, from_index, to_index, done_index)
    {
      // condition expression, compile into the function:
      var tfun = new Function("_", "at" , "with(_) {return (" + text + ");}" );
      return function() {
        if(tfun( context, context_index )) { 
          exec_range(from_index, to_index);   // <- if condition is true then execute code behind it: 
          return done_index - from_index; }   //    and jump to past else part.
        return to_index - from_index; };      // <- otherwise go to next instruction.
    }
    
    function tokenize() // bild an array of [literal, directive, literal, directive, ...] 
                        // where even elements are directive - stuff inside '{' '}'
                        // and odd elements are literals that shall go to output as they are 
    {
      for(var pos = 0; pos < template.length; ) {
        var i = template.indexOf("{{", pos); if( i < 0 ) break;
        var ic = template.indexOf("}}", i + 2); if( ic < 0) break;
        parts.push(template.substring(pos,i));
        parts.push(template.substring(i+2,ic));
        pos = ic + 2; }
      parts.push(template.substr(pos));
    }
   
    function compile() {
      // 1) tokenize all 
      tokenize();
      // 2) replace all directives by correspondent compiled functions ("parametrised" closures in fact).
      var total_parts = parts.length; // total parts

      function scan_tail(start, et) {  // scan {^} "else" directive, 'et' - expected tail  
        for(var pn = start + 2; pn < total_parts; pn += 2) // jump over all directives (at odd positions)
        {  
          var part = parts[pn];
          switch(part.charAt(0)) {
            case "#": pn = scan_block( pn, part.substr(1)); continue;
            case "?": pn = scan_condition( pn, part.substr(1) ); 
                      if(parts[pn] == "/?") parts[pn] = ""; else pn -= 2; continue;
            case "/": parts[start] = decl_range(start, pn); 
                      if( part.substr(1) == et ) parts[pn] = ""; return pn;
            case "^": parts[start] = decl_range(start, pn); return pn;                    
            default:  parts[pn] = decl_terminal(part); continue;
          }
        }
        return pn;
      }
      
      function scan_block(start, name) { // scan {#name} directive 
        for(var pn = start + 2; pn < total_parts; pn += 2) // jump over all directives
        {  
          var part = parts[pn];
          switch(part.charAt(0)) {
            case "#": pn = scan_block(pn, part.substr(1)); continue;
            case "?": pn = scan_condition(pn, part.substr(1) ); 
                      if(parts[pn] == "/?") parts[pn] = ""; else pn -= 2;  
                      continue;
            case "^": if(part.substr(1) == name) {
                        var pos = pn; 
                        pn = scan_tail(pn,name);
                        parts[start] = decl_block(name, start, pos, pn ); 
                        return pn; }
                      parts[start] = decl_block(name, start, pn, pn ); 
                      return pn - 2;
            case "/": parts[start] = decl_block(name, start, pn); 
                      if( part.substr(1) != name ) return pn - 2;
                      parts[pn] = ""; return pn; 
            default:  parts[pn] = decl_terminal(part); continue; 
          }
        }
        return pn;
      }
      function scan_condition(start, expr) { // scan {?expr} directive 
        for(var pn = start + 2; pn < total_parts; pn += 2) // jump over all directives
        {  
          var part = parts[pn];
          switch(part.charAt(0)) {
            case "#": pn = scan_block(pn, part.substr(1)); continue;
            case "?": var pos = pn; pn = scan_condition(pn, part.substr(1) ); // note: recursive call to handle chain of '?'s
                      parts[start] = decl_condition(expr,start,pos,pn); 
                      return pn;
            case "^": if(part.substr(1) == "?") { 
                        var pos = pn; pn = scan_tail(pn,"?");
                        parts[start] = decl_condition(expr,start,pos,pn); 
                        return pn; }
                      parts[start] = decl_condition(expr,start,pn,pn); 
                      return pn - 2;
            case "/": parts[start] = decl_condition(expr,start,pn,pn);
                      if( part.substr(1) != "?" ) return pn - 2;
                      parts[pn] = ""; return pn; 
            default:  parts[pn] = decl_terminal(part); continue;
          }
        }
        return pn;
      }
      scan_block(-1,""); // scan the sequence 
    }
    compile();
    
    if( data === undefined ) // if no data provided just return compiled version for later use.
      return function(data) { return exec(data); }
    
    return exec(data); // execute the block
  })
// kate.formatters = default set of some usefull formatters 
.formatters = {
  "date"    : function(v)  { // accepts date string as "yyyy-mm-dd"
              var parts = v.split("-");        
              if( parts.length != 3 ) return v;
              return ["January","February","March","April","May","June","July","August","September","October","November","December"][parseInt(parts[1],10)-1]
                    + " " +  parseInt(parts[2],10) + ", " + parts[0]; },
  "escaped" : function(v) { // html escapement
              return v.replace("&","&amp;").replace("\"","&quot;").replace("'","&#39;").replace("<","&lt;").replace(">","&gt;"); }
};
