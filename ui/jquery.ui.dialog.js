<!DOCTYPE html>
<html>
<head>
<link  href="../themes/ui-lightness/jquery.ui.all.css" rel="stylesheet" type="text/css"></link>

<script src="../jquery-1.6.1.js"></script>
<script src="../ui/jquery.ui.core.js"></script>
<script src="../ui/jquery.ui.widget.js"></script>
<script src="../ui/jquery.ui.button.js"></script>
<script src="../ui/jquery.ui.dialog.js"></script>

<script>$(document).ready(function(){
  
  $("#body").dialog({
    bgiframe: true,
    autoOpen: false,
    closeOnEscape: true,
    draggable: true,
    height: 300,
    modal: true,
    resizable: true
  });
  
  $("input").button().not("#btnButton3").click(function(){
    $("#body").dialog("open");
  });
  $("#btnButton3").button().click(function(){
    console.log("hello");
  });
  
});
</script>
<meta charset=utf-8 />
<title>Test</title>

<!-- ui-button ui-widget ui-state-default ui-corner-all -->
<!-- ui-button ui-widget ui-state-default ui-corner-all ui-state-focus -->

<style>
  article, aside, figure, footer, header, hgroup, 
  menu, nav, section { display: block; }
</style>

</head>
<body>
  <div id="body">
    <p>Hello, world!</p>
  </div>
  <input type="button" id="btnButton1" value="Push Me" />
  <input type="button" id="btnButton2" value="Or Me" />
  <input type="button" id="btnButton3" value="But not Me" />
</body>
</html>