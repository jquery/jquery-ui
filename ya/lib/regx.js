/**
 * @author 13
 */
(function($,root){
	var ya=root.ya,
		regx=ya.regx||{};
	_.extend(regx,{
		"rword":/[^, ]+/g 
	});
	
	ya.regx=regx;
}(jQuery,this));
