<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" />
	
	<xsl:template name="ref">
		<xsl:text>link-</xsl:text>
		<xsl:value-of select="translate(@name, '$.|', '')"/>
		<xsl:text>-</xsl:text>
		<xsl:for-each select="params">
			<xsl:value-of select="translate(@name, '&lt;&gt;|$.', '')" />
		</xsl:for-each>
	</xsl:template>

	<xsl:template name="href">
		<xsl:attribute name="href">
			<xsl:text>#</xsl:text>
			<xsl:call-template name="ref" />
		</xsl:attribute>
	</xsl:template>
	
	<xsl:template name="id">
		<xsl:attribute name="id">
			<xsl:call-template name="ref" />
		</xsl:attribute>
	</xsl:template>
	
	<xsl:template name="return">
		<xsl:attribute name="title">
			<xsl:choose>
				<xsl:when test="@return='jQuery'">A jQuery object.</xsl:when>
				<xsl:when test="@return='Boolean'">true or false.</xsl:when>
				<xsl:when test="@return='Object'">A simple Javascript object..</xsl:when>
				<xsl:when test="@return='String'">A string of characters.</xsl:when>
				<xsl:when test="@return='Number'">A valid numeric.</xsl:when>
				<xsl:when test="@return='String|Number'">A string of characters or a number.</xsl:when>
				<xsl:when test="@return='Element'">The Javascript object representation of a DOM Element.</xsl:when>
				<xsl:when test="@return='Element|Array&lt;Element&gt;'">One or more DOM Elements (a single one or an array).</xsl:when>
				<xsl:when test="@return='Map'">A Javascript object that contains key/value pairs in the form of properties and values.</xsl:when>
				<xsl:when test="@return='Array&lt;Element&gt;'">An Array of DOM Elements.</xsl:when>
				<xsl:when test="@return='Array&lt;String&gt;'">An Array of strings.</xsl:when>
				<xsl:when test="@return='Function'">A reference to a Javascript function.</xsl:when>
				<xsl:when test="@return='XMLHttpRequest'">An XMLHttpRequest object (referencing a HTTP request).</xsl:when>
			</xsl:choose>
		</xsl:attribute>
		<xsl:value-of select="@return"/>
	</xsl:template>

	<xsl:template name="type">
		<xsl:attribute name="title">
			<xsl:choose>
				<xsl:when test="@type='jQuery'">A jQuery object.</xsl:when>
				<xsl:when test="@type='Boolean'">true or false.</xsl:when>
				<xsl:when test="@type='Object'">A simple Javascript object..</xsl:when>
				<xsl:when test="@type='String'">A string of characters.</xsl:when>
				<xsl:when test="@type='Number'">A valid numeric.</xsl:when>
				<xsl:when test="@type='String|Number'">A string of characters or a number.</xsl:when>
				<xsl:when test="@type='Element'">The Javascript object representation of a DOM Element.</xsl:when>
				<xsl:when test="@type='Element|Array&lt;Element&gt;'">One or more DOM Elements (a single one or an array).</xsl:when>
				<xsl:when test="@type='Map'">A Javascript object that contains key/value pairs in the form of properties and values.</xsl:when>
				<xsl:when test="@type='Array&lt;Element&gt;'">An Array of DOM Elements.</xsl:when>
				<xsl:when test="@type='Array&lt;String&gt;'">An Array of strings.</xsl:when>
				<xsl:when test="@type='Function'">A reference to a Javascript function.</xsl:when>
				<xsl:when test="@type='XMLHttpRequest'">An XMLHttpRequest object (referencing a HTTP request).</xsl:when>
			</xsl:choose>
		</xsl:attribute>
		<xsl:value-of select="@type"/>
	</xsl:template>
	
	<xsl:template name="break">
		<xsl:value-of select="." disable-output-escaping="yes" />
	</xsl:template>
	
	<xsl:template name="option">
		<div class="param">
			<div class="param-header">
				<h3><span><xsl:value-of select="@name"/></span></h3>
				<p class="param-type"><span><xsl:call-template name="type" /></span></p>
				<p class="param-default">Default: <xsl:value-of select="@default"/></p>
			</div>
			<div class="param-details">
				<p><xsl:value-of select="desc"/></p>
				<!-- TODO select all examples -->
				<xsl:for-each select="following-sibling::example[1]">
					<h4>Code sample:</h4>
					<p><xsl:value-of select="desc" disable-output-escaping="yes"/></p>
					<code>
						<xsl:value-of select="code"/>
					</code>
				</xsl:for-each>
			</div>
		</div>
	</xsl:template>
	
	<xsl:template match="/*">
		<div id="widget-docs">
			<ul>
				<li><a href="#docs-overview"><span>Overview</span></a></li>
				<li><a href="#docs-options"><span>Options</span></a></li>
				<li><a href="#docs-methods"><span>Methods</span></a></li>
				<li><a href="#docs-theming"><span>Theming</span></a></li>
			</ul>
			
		<!-- TAB 1 -->
			<div id="docs-overview">
				<div id="docs-overview-sidebar">
					<h4>Dependencies:</h4>
					<ul>							
						<li><a href="#">ui.core.js</a></li>
						<li><a href="#">ui.draggable.js <span>(Optional)</span></a></li>
						<li><a href="#">ui.resizable.js <span>(Optional)</span></a></li>
					</ul>
				</div>
				<div id="docs-overview-main">
					<p>
						<xsl:for-each select="//function[1]/desc">
							<xsl:call-template name="break" />
						</xsl:for-each>
					</p>
					<p>
						<xsl:for-each select="//function[1]/longdesc">
							<xsl:call-template name="break" />
						</xsl:for-each>
					</p>
				</div>
			</div>
			
		<!-- TAB 2 -->
			<div id="docs-options">
				<p class="intro"><xsl:value-of select="//function[1]/params/desc"/></p>
				
				<div class="docs-list-header clearfix">
					<h2>Property options</h2>
					<p><a href="#">Show details</a> | <a href="#">Hide details</a></p>
				</div>
				
				<div class="docs-list clearfix">
					<xsl:for-each select="//function[1]/option[not(starts-with(@type, 'function'))]">
						<xsl:call-template name="option"/>
					</xsl:for-each>
				</div><!-- /property options -->
				
				<div class="docs-list-header clearfix">
					<h2>Event options</h2>
					<p><a href="#">Show details</a> | <a href="#">Hide details</a></p>
				</div>
				
				<div class="docs-list clearfix">
					<xsl:for-each select="//function[1]/option[starts-with(@type, 'function')]">
						<xsl:call-template name="option"/>
					</xsl:for-each>
				</div><!-- /event options -->
			</div>
		
		<!-- TAB 3 -->	
			<div id="docs-methods">
				<p class="intro">A brief description of methods and their uses goes here so their use is clearly explained and any caveats can be mentioned up front.</p>
				
				<div class="docs-list-header clearfix">
					<h2>Methods</h2>
					<p><a href="#">Show details</a> | <a href="#">Hide details</a></p>
				</div>
				
				<div class="docs-list clearfix">
					<xsl:for-each select="//function[position() != 1]">
						<div class="param">
							<div class="param-header">
								<h3><span><xsl:value-of select="//function[1]/@name"/>( <xsl:value-of select="params[1]/@name"/>
								<xsl:for-each select="params[position() != 1]">
									<xsl:text>, </xsl:text><xsl:value-of select="@name"/>
								</xsl:for-each>
								 )</span></h3>
								<p class="param-type">Returns: <span><xsl:call-template name="return" /></span></p>
							</div>
							<div class="param-details">
								<p><xsl:value-of select="desc"/></p>
								<p><xsl:value-of select="longdesc"/></p>
								<h4>Arguments:</h4>
								<table class="param-args" summary="Arguments for this method" cellspacing="0">
									<tbody>
										<xsl:for-each select="params[position() != 1]">
											<tr>
												<td><xsl:value-of select="@name"/></td>
												<td><xsl:value-of select="@type"/></td>
												<td><xsl:value-of select="."/></td>
											</tr>
										</xsl:for-each>
									</tbody>
								</table>
								
								<h4>Code sample:</h4>
								<xsl:for-each select="example">
									<h5><xsl:value-of select="desc"/></h5>
									<code>
										<xsl:value-of select="code"/>
									</code>
								</xsl:for-each>
							</div>
						</div>
					</xsl:for-each>
					
				</div><!-- /methods -->
			</div>
			
		<!-- TAB 4 -->
			<div id="docs-theming">
				<p class="intro">ui.dialog uses the jQuery UI CSS styles framework for all major components, e.g. for the titlebar, the resize handle, etc., some of which are borrowed from ui.resizable.</p>
				
				<h3>Sample code with CSS classes</h3>
				
				<p>Use the classes highlighted in bold to customize the dialog:</p>
				
				<!-- Remove all framework classes (those from ui.core.css and ui.theme.css) from the markup sample, and highlight all remaining widget classes in bold (<strong>).  
				We decided to omit framework classes to avoid confusion and focus the user on the classes that are necessary for customizing the widget.  I've bolded a few for illustration, 
				but in the working code ALL of them should be bolded. -->
				
				<code>
				&lt;div class="<strong>ui-dialog</strong>" role="dialog" aria-labelledby="ui-dialog-title-1"><br />
				&#160;&#160;&lt;div class="<strong>ui-dialog-titlebar</strong>"><br />
				&#160;&#160;&#160;&#160;&lt;span class="<strong>ui-dialog-title</strong>" id="ui-dialog-title-1">Dialog Title&lt;/span><br />
				&#160;&#160;&#160;&#160;&lt;a href="#" class="<strong>ui-dialog-titlebar-close</strong>" role="button" title="Close"><br />
				&#160;&#160;&#160;&#160;&lt;span class="<strong>ui-icon ui-icon-closethick</strong>">Close&lt;/span>&lt;/a><br />
				&#160;&#160;&lt;/div><br />
				&#160;&#160;&lt;div class="<strong>ui-dialog-content</strong>" style="height: 13em;"><br />
				&#160;&#160;&#160;&#160;&lt;p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt&lt;/p><br />
				&#160;&#160;&lt;/div><br />
				&#160;&#160;&lt;div class="<strong>ui-dialog-buttonpane</strong>"><br />
				&#160;&#160;&#160;&#160;&lt;button class="ui-state-default ui-priority-primary ui-corner-all">Primary&lt;/button><br />
				&#160;&#160;&#160;&#160;&lt;button class="ui-state-default ui-priority-secondary ui-corner-all">Secondary&lt;/button><br />
				&#160;&#160;&#160;&#160;&lt;button class="ui-state-default ui-state-disabled ui-corner-all">Disabled&lt;/button><br />
				&#160;&#160;&lt;/div><br />
				&#160;&#160;&lt;div class="ui-resizable-n ui-resizable-handle">&lt;/div><br />
				&#160;&#160;&lt;div class="ui-resizable-s ui-resizable-handle">&lt;/div><br />
				&#160;&#160;&lt;div class="ui-resizable-e ui-resizable-handle">&lt;/div><br />
				&#160;&#160;&lt;div class="ui-resizable-w ui-resizable-handle">&lt;/div><br />
				&#160;&#160;&lt;div class="ui-resizable-ne ui-resizable-handle">&lt;/div><br />
				&#160;&#160;&lt;div class="ui-resizable-se ui-resizable-handle ui-icon ui-icon-grip-diagonal-se">&lt;/div><br />
				&#160;&#160;&lt;div class="ui-resizable-sw ui-resizable-handle">&lt;/div><br />
				&#160;&#160;&lt;div class="ui-resizable-nw ui-resizable-handle">&lt;/div><br />
				&lt;/div>
				</code>
				
				<h3>See also</h3>
				<ul>
					<li><a href="#">UI/Resizables plugin documentation</a></li>
					<li><a href="#">How to create a custom theme</a></li>
					<li><a href="#">jQuery UI CSS Framework documentation</a></li>
					<li><a href="#">ThemeRoller: Create your own custom theme</a></li>
				</ul>
				
			</div>				
		</div>
	</xsl:template>

</xsl:stylesheet>
