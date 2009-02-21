/* tests.js */

$(function() {

var matrix = $("#matrix");

matrix.children("tbody").children("tr").each(function() {

	var tr = $(this), th = tr.find("th"), pluginName = th.text().toLowerCase(),
		staticTd = th.next(), visualTd = staticTd.next(),
		staticHtmlTd = visualTd.next(), visualHtmlTd = staticHtmlTd.next(),
		diffTd = visualHtmlTd.next();

	var className = tr.attr("className");
	var classNames = className.split('-');

	classNames.shift(); // remove 'test'
	var folder = classNames.shift();
	var filename = classNames.join('_') + '.html';

	var staticUrl = 'static/' + folder + '/' + filename;
	var visualUrl = 'visual/' + folder + '/' + filename;

	$.get(staticUrl, function(data) {
		data = data.replace(/<script.*>.*<\/script>/ig,""); // Remove script tags
		data = data.replace(/<\/?link.*>/ig,""); //Remove link tags
		data = data.replace(/<\/?html.*>/ig,""); //Remove html tag
		data = data.replace(/<\/?body.*>/ig,""); //Remove body tag
		data = data.replace(/<\/?head.*>/ig,""); //Remove head tag
		data = data.replace(/<title.*>.*<\/title>/ig,""); // Remove title tags
		data = data.replace(/\s*<\/?!doctype.*>\s*/ig,""); //Remove doctype
		var staticHtml = $("<div></div>").html(data).html();
		staticTd.html(staticHtml);
		staticHtmlTd.append("<textarea>" + staticHtml + "</textarea>");
	});

	visualTd.append('<iframe src="' + visualUrl + '"></iframe>');

	var iframe = visualTd.find("iframe");

	iframe.load(function() {
		var visualHtml = $("body", this.contentDocument).html()
		$(this).after(visualHtml).remove();
		(pluginName == 'dialog') && $("#dialog").parents(".ui-dialog").css({
			position: "relative",
			top: null, left: null
		});
		visualHtmlTd.append("<textarea>" + $.trim(visualHtml) + "</textarea>");
		var diffHtml = diffString(escape(staticHtmlTd.find("textarea").val()), escape(visualHtmlTd.find("textarea").val()));
		console.log(diffHtml);
		diffTd.html(diffHtml);
	});

});

});
