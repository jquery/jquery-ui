var uid = 0;

/**
 * Render a demo template page
 * @author Eduardo Lundgren (braeker)
 * @param {Object} model
 */
var uiRenderDemo = function(model) {

	var title = model.title, renderAt = $(model.renderAt);

	function nl2br( str ) {
    return str.replace(/([^>])\n/g, '$1<br />\n');
	}

	var js2html = function(code) {
		var src = (js_beautify(code) || "");

		//if ($.browser.msie)
		//	src = src.replace(/([^>])\n/g, '$1<br />\n');

		return src;
	};

	renderAt.append(
		'<h3>'+ title +'</h3>'
	);

	$.each(model.demos, function(i, demo) {

		/**
		 * Rendering each demo
		 */

		if (!demo) return;

		var uiHtmlRendered = $('<div class="ui-html-rendered"></div>');

		if (model.onRenderStart) model.onRenderStart.apply(window);

		var gid = 'ui-gen-'+uid++, demoBox = $('<div id="'+gid+'"></div>');

		renderAt.append(demoBox);

		var detailsHtml = $(
			'<br><div class="ui-details"><div class="menutitle">'+demo.title+'</div></div>'
		);

		var descBox = $(
			'<div class="ui-demo-description">'+(demo.desc||'')+'</div>'
		);

		var optionsBox = $(
			'<div class="ui-demo-options"><label for="select-'+gid+'">Try more options on the fly: </label></div>'
		);

		var codesBox = $(
			'<div id="code-'+gid+'"></div>'
		)
		.css({display: 'none'});

		var sourceTmpl = $(
			'<div></div>'
		);

		var preTmpl = $(
			'<span style="white-space: pre;"></span>'
		);

		var codeTmpl = $(
			'<code></code>'
		);

		var htmlCode = '', sourceHtml = sourceTmpl.clone(), sourceJs = sourceTmpl.clone(), entitiesHtml = function(html) {
			return html.replace(/</g,"&lt;").replace(/>/g,"&gt;");
		};

		// Render simple HTML
		if (typeof demo.html == 'string') {
			uiHtmlRendered.html(demo.html);
			htmlCode = demo.html;
		}
		// Render data html by URL
		if (typeof demo.html == 'object' && demo.html.url) {

			uiHtmlRendered.html("<img src='/images/ajax-loader.gif'>");

			$.ajax({ 
				type: "GET", 
				url: demo.html.url,
				cache: false,
				success: function(data) {
					uiHtmlRendered.html(data);
					htmlCode = data;

					// set html code view
					sourceHtml.html(preTmpl.clone().html( codeTmpl.clone().addClass('colored html').html(entitiesHtml(htmlCode)) ));

					$.each(demo.options, function(x, o) {
						// eval the first source of <select>
						if (!x) jQuery.globalEval(o.source);
					});

					$('#'+gid).find('.colored.html').chili();

					// fire renderEnd callback to ajax async transactions
					if (model.onRenderEnd) model.onRenderEnd.apply(window);
				}
			});

		}
		// set html code view
		sourceHtml.html(preTmpl.clone().html( codeTmpl.clone().addClass('colored html').html(entitiesHtml(htmlCode)) ));

		var select = $('<select id="select-'+ gid+'"></select>').change(function() {
			var ecode = decodeURIComponent($(this).val());

			jQuery.globalEval(demo.destroy);
			jQuery.globalEval(ecode);

			sourceJs.html(preTmpl.html( codeTmpl.clone().addClass('colored javascript').html(js2html(ecode, 4)) ));
			$('.colored.javascript').chili();
		});

		var a = $('<a>View Source</a>').attr('href', 'javascript:void(0);').addClass('link-view-source').toggle(function() {
			var self = this;
			$(codesBox).show("fast");
			$(this).text("Hide Source");
		},
		function() {
			$(codesBox).hide();
			$(this).text("Show Source");
		});

		demoBox.append(
			detailsHtml, descBox, uiHtmlRendered, optionsBox.append(
				select, a, '<br>', codesBox.append('<br>JavaScript:<br>', sourceJs, '<br>HTML:<br>', sourceHtml)
			)
		);

		// population select with the demo options
		$.each(demo.options, function(x, o) {
			if (o && o.desc) {
				var source = encodeURIComponent(o.source);
	  		select.append($('<option>' + o.desc + '</option>').val(source));
	  		// eval the first source of <select>
				if (!x) {
					sourceJs.html(preTmpl.html(codeTmpl.clone().addClass('colored javascript').html(js2html(o.source, 4))));
					jQuery.globalEval(o.source);
				}
			}
		});

		$('#'+gid).find('.colored.javascript').chili();
		$('#'+gid).find('.colored.html').chili();

		// fire renderEnd callback to direct-html-render
		if (typeof demo.html != 'object' && model.onRenderEnd) model.onRenderEnd.apply(window);

	});
};

var loadDemo = function(comp) {

	$("#dialog").dialog().remove();

	$('#containerDemo').html("<img src='images/ajax-loader.gif'>");

	 $("#containerDemo").ajaxError(function(request, settings){ 
	   $(this).html("Oops, there is no template file for this component."); 
	 });

	$.get('templates/'+comp+'.html', function(data) {
		$('#containerDemo').html(data);
	});

};