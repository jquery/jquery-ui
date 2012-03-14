/**
 * @author 13
 */
(function($,root){
	var yawrap=root.yawrap,
		regx=yawrap.regx||{};
	_.extend(regx,{
		"rword":/[^, ]+/g,
		"email":/^(?:\w+\.?)*\w+@(?:\w+\.?)*\w+$/,
		"user":/^w+$/,	//只能输入由数字、26个英文字母或者下划线组成的字符串
		"pwd":/^[a-zA-Z]w{5,17}$/, //正确格式为：以字母开头，长度在6-18之间，只能包含字符、数字和下划线。
		"mobile":/^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/
	});
	
	yawrap.regx=regx;
}(jQuery,this));
