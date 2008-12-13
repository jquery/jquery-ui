<style>

#divTabs, #divAddTabs {
	height:30px;
}

</style>

<div id="containerDemo"></div>

<script type="text/javascript">

	var model = {

		renderAt: '#containerDemo',

		title: 'Tabs Demos',

		demos: [

			{
				title: 'Simple Tabs',
				html: ['<div><ul id="divTabs">',
							'<li><a href="#tabs-fragment-1"><span>One</span></a></li>',
                			'<li><a href="#tabs-fragment-2"><span>Two</span></a></li>',
                			'<li><a href="#tabs-fragment-3"><span>Three</span></a></li>',
            			'</ul>',
            			'<div id="tabs-fragment-1">',
                			'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                			'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
            			'</div>',
            			'<div id="tabs-fragment-2">',
                			'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                			'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
							'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
            			'</div>',
            			'<div id="tabs-fragment-3">',
                			'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                			'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                			'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
							'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
            			'</div></div>'].join(''),
				destroy: '$("#divTabs").tabs("destroy");',

				options: [
					{	desc: 'Simple Tabs',	source: '$("#divTabs").tabs();' },
					{	desc: 'Simple Cloned Tabs',	source: '$("#divTabs").clone().tabs();' },
                    {	desc: 'Simple Empty Tabs',	source: '$("#divTabs").tabs();' },
                    {	desc: 'Simple Detached Tabs',	source: '$("<div></div>").tabs();' }
				]
			},
			{
				title: 'Add A Tab',
				html: ['<div><ul id="divAddTabs">',
							'<li><a href="#addtabs-fragment-1"><span>One</span></a></li>',
                			'<li><a href="#addtabs-fragment-2"><span>Two</span></a></li>',
                			'<li><a href="#addtabs-fragment-3"><span>Three</span></a></li>',
            			'</ul>',
            			'<div id="addtabs-fragment-1">',
                			'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                			'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
            			'</div>',
            			'<div id="addtabs-fragment-2">',
                			'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                			'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
            			'</div>',
            			'<div id="addtabs-fragment-3">',
                			'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                			'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                			'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
            			'</div></div>'].join(''),
				destroy: '$("#divAddTabs").tabs("destroy");',

				options: [
					{	desc: 'Simple Dialog',	source: '$("#divAddTabs").tabs("add", "#", "Added");' }
				]
			},
		]

	};

	$(window).load(function(){

		uiRenderDemo(model);

	});

</script>
