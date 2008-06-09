/*
===============================================================================
Chili is the jQuery code highlighter plugin
...............................................................................
                                               Copyright 2007 / Andrea Ercolino
-------------------------------------------------------------------------------
LICENSE: http://www.opensource.org/licenses/mit-license.php
WEBSITE: http://noteslog.com/chili/
===============================================================================
*/

/*
this file shows how to configure a static setup
it must be linked from the head of a page like:
<script type="text/javascript" src="chili/recipes.js"></script>
*/

ChiliBook.recipeLoading = false;

ChiliBook.recipes[ "jquery.js" ] = 
{ 
	steps:
	{
		  mlcom   : { exp: /\/\*[^*]*\*+(?:[^\/][^*]*\*+)*\// }
		, com     : { exp: /\/\/.*/ }
		, regexp  : { exp: /\/[^\/\\\n]*(?:\\.[^\/\\\n]*)*\/[gim]*/ }
		, string  : { exp: /(?:\'[^\'\\\n]*(?:\\.[^\'\\\n]*)*\')|(?:\"[^\"\\\n]*(?:\\.[^\"\\\n]*)*\")/ }
		, numbers : { exp: /\b[+-]?(?:\d*\.?\d+|\d+\.?\d*)(?:[eE][+-]?\d+)?\b/ }
		, keywords: { exp: /\b(arguments|break|case|catch|continue|default|delete|do|else|false|for|function|if|in|instanceof|new|null|return|switch|this|true|try|typeof|var|void|while|with)\b/ }
		, global  : { exp: /\b(toString|valueOf|window|element|prototype|constructor|document|escape|unescape|parseInt|parseFloat|setTimeout|clearTimeout|setInterval|clearInterval|NaN|isNaN|Infinity)\b/ }

		, "jquery utilities"  : { 
			  exp        : /(?:\$\.browser|\$\.each|\$\.extend|\$\.grep|\$\.map|\$\.merge|\$\.trim)\b/
			, replacement: '<span class="jquery" title="$0"><span class="global">$$</span></span>'
		}
		,"jquery private"     : {
			  exp        : /(?:\$\.find|\$\.parents|\$\.sibling|\.domManip|\.eventTesting|\.extend|\.get|\.init|\.jquery|\.pushStack)\b/
			, replacement: '<span class="jquery" title="$0"><span class="private">$$</span></span>'
		}
		,"jquery ajax"        : {
			  exp        : /(?:\$\.ajax|\$\.ajaxSetup|\$\.ajaxTimeout|\$\.get|\$\.getIfModified|\$\.getJSON|\$\.getScript|\$\.post|.ajaxComplete|.ajaxError|.ajaxSend|.ajaxStart|.ajaxStop|.ajaxSuccess|.load|.loadIfModified|.serialize)\b/
			, replacement: '<span class="jquery" title="$0"><span class="ajax">$$</span></span>'
		}
		, "jquery object"     : { 
			  exp        : /jQuery|\$(?=\W)/
			, replacement: '<span class="jquery" title="$0"><span class="object">$$</span></span>'
		}
		,"jquery core"        : {
			  exp        : /\$\.extend|\$\.noConflict|\.(?:each|eq|get|gt|index|lt|size)\b/
			, replacement: '<span class="jquery" title="$0"><span class="core">$$</span></span>'
		}
		,"jquery css"         : {
			  exp        : /\.(?:css|height|width)\b/
			, replacement: '<span class="jquery" title="$0"><span class="css">$$</span></span>'
		}
		,"jquery attributes"  : {
			  exp        : /\.(?:addClass|attr|html|removeAttr|removeClass|text|toggleClass|val)\b/
			, replacement: '<span class="jquery" title="$0"><span class="attributes">$$</span></span>'
		}
		,"jquery traversing"  : {
			  exp        : /\.(?:add|children|contains|end|filter|find|is|next|not|parent|parents|prev|siblings)\b/
			, replacement: '<span class="jquery" title="$0"><span class="traversing">$$</span></span>'
		}
		,"jquery manipulation": {
			  exp        : /\.(?:after|append|appendTo|before|clone|empty|insertAfter|insertBefore|prepend|prependTo|remove|wrap)\b/
			, replacement: '<span class="jquery" title="$0"><span class="manipulation">$$</span></span>'
		}
		,"jquery effects"     : {
			  exp        : /\.(?:animate|fadeIn|fadeOut|fadeTo|hide|show|slideDown|slideToggle|slideUp|toggle)\b/
			, replacement: '<span class="jquery" title="$0"><span class="effects">$$</span></span>'
		}
		,"jquery events"      : {
			  exp        : /\.(?:bind|blur|change|click|dblclick|error|focus|hover|keydown|keypress|keyup|load|mousedown|mousemove|mouseout|mouseover|mouseup|one|ready|resize|scroll|select|submit|toggle|trigger|unbind|unload)\b/
			, replacement: '<span class="jquery" title="$0"><span class="events">$$</span></span>'
		}
	}
}; 

ChiliBook.recipes[ "html.js" ] = 
{
    steps: {
          mlcom : { exp: /\<!--(?:\w|\W)*?--\>/ }
        , tag   : { exp: /(?:\<\!?[\w:]+)|(?:\>)|(?:\<\/[\w:]+\>)|(?:\/\>)/ }
		, php   : { exp: /(?:\<\?php\s)|(?:\<\?)|(?:\?\>)/ }
        , aname : { exp: /\s+?[\w-]+:?\w+(?=\s*=)/ }
        , avalue: { exp: /(=\s*)(([\"\'])(?:(?:[^\3\\]*?(?:\3\3|\\.))*?[^\3\\]*?)\3)/
			, replacement: '$1<span class="$0">$2</span>' }
        , entity: { exp: /&[\w#]+?;/ }
    }
};

ChiliBook.recipes[ "javascript.js" ] = 
{
	steps: {
		  mlcom   : { exp: /\/\*[^*]*\*+(?:[^\/][^*]*\*+)*\// }
		, com     : { exp: /\/\/.*/ }
		, regexp  : { exp: /\/[^\/\\\n]*(?:\\.[^\/\\\n]*)*\/[gim]*/ }
		, string  : { exp: /(?:\'[^\'\\\n]*(?:\\.[^\'\\\n]*)*\')|(?:\"[^\"\\\n]*(?:\\.[^\"\\\n]*)*\")/ }
		, numbers : { exp: /\b[+-]?(?:\d*\.?\d+|\d+\.?\d*)(?:[eE][+-]?\d+)?\b/ }
		, keywords: { exp: /\b(arguments|break|case|catch|continue|default|delete|do|else|false|for|function|if|in|instanceof|new|null|return|switch|this|true|try|typeof|var|void|while|with)\b/ }
		, global  : { exp: /\b(toString|valueOf|window|self|element|prototype|constructor|document|escape|unescape|parseInt|parseFloat|setTimeout|clearTimeout|setInterval|clearInterval|NaN|isNaN|Infinity)\b/ }
	}
};

ChiliBook.recipes[ "mysql.js" ] = 
{
	  ignoreCase: true
	, steps: {
		  mlcom     : { exp: /\/\*[^*]*\*+([^\/][^*]*\*+)*\// }
		, com       : { exp: /(?:--\s+.*)|(?:[^\\]\#.*)/ }
		, string    : { exp: /([\"\'])(?:(?:[^\1\\\r\n]*?(?:\1\1|\\.))*[^\1\\\r\n]*?)\1/ }
		, quid      : { exp: /(`)(?:(?:[^\1\\\r\n]*?(?:\1\1|\\.))*[^\1\\\r\n]*?)\1/ }
		, value     : { exp: /\b(?:NULL|TRUE|FALSE)\b/ }
		, number    : { exp: /\b[+-]?(\d*\.?\d+|\d+\.?\d*)([eE][+-]?\d+)?\b/ }
		, hexnum    : { exp: /\b0[xX][\dA-Fa-f]+\b|\b[xX]([\'\"])[\dA-Fa-f]+\1/ }
		, op        : { exp: /!=|&&|<|<<|<=|<=>|<>|=|>|>=|>>|\|\|/ }
		, variable  : { exp: /@([$.\w]+|([`\"\'])(?:(?:[^\2\\\r\n]*?(?:\2\2|\\.))*[^\2\\\r\n]*?)\2)/
			, replacement: '<span class="keyword">@</span><span class="variable">$1</span>' }
		, keyword   : { exp: /\b(?:A(?:CTION|DD|FTER|G(?:AINST|GREGATE)|L(?:GORITHM|L|TER)|N(?:ALYZE|D|Y)|S(?:C(?:II|)|ENSITIVE|)|UTO_INCREMENT|VG(?:_ROW_LENGTH|))|B(?:ACKUP|DB|E(?:FORE|GIN|RKELEYDB|TWEEN)|I(?:GINT|N(?:ARY|LOG)|T)|LOB|O(?:OL(?:EAN|)|TH)|TREE|Y(?:TE|))|C(?:A(?:CHE|LL|S(?:CADE(?:D|)|E))|H(?:A(?:IN|NGE(?:D|)|R(?:ACTER|SET|))|ECK(?:SUM|))|IPHER|L(?:IENT|OSE)|O(?:DE|L(?:LAT(?:E|ION)|UMN(?:S|))|M(?:M(?:ENT|IT(?:TED|))|P(?:ACT|RESSED))|N(?:CURRENT|DITION|NECTION|S(?:ISTENT|TRAINT)|T(?:AINS|INUE)|VERT))|R(?:EATE|OSS)|U(?:BE|R(?:RENT_(?:DATE|TIME(?:STAMP|)|USER)|SOR)))|D(?:A(?:T(?:A(?:BASE(?:S|)|)|E(?:TIME|))|Y(?:_(?:HOUR|MI(?:CROSECOND|NUTE)|SECOND)|))|E(?:ALLOCATE|C(?:IMAL|LARE|)|F(?:AULT|INER)|L(?:AY(?:ED|_KEY_WRITE)|ETE)|S(?:C(?:RIBE|)|_KEY_FILE)|TERMINISTIC)|I(?:RECTORY|S(?:ABLE|CARD|TINCT(?:ROW|))|V)|O(?:UBLE|)|ROP|U(?:AL|MPFILE|PLICATE)|YNAMIC)|E(?:ACH|LSE(?:IF|)|N(?:ABLE|CLOSED|D|GINE(?:S|)|UM)|RRORS|SCAPE(?:D|)|VENTS|X(?:ECUTE|I(?:STS|T)|P(?:ANSION|LAIN)|TENDED))|F(?:A(?:LSE|ST)|ETCH|I(?:ELDS|LE|RST|XED)|L(?:OAT(?:4|8|)|USH)|O(?:R(?:CE|EIGN|)|UND)|R(?:AC_SECOND|OM)|U(?:LL(?:TEXT|)|NCTION))|G(?:E(?:OMETRY(?:COLLECTION|)|T_FORMAT)|LOBAL|R(?:ANT(?:S|)|OUP))|H(?:A(?:NDLER|SH|VING)|ELP|IGH_PRIORITY|O(?:STS|UR(?:_(?:MI(?:CROSECOND|NUTE)|SECOND)|)))|I(?:DENTIFIED|F|GNORE|MPORT|N(?:DEX(?:ES|)|FILE|N(?:ER|O(?:BASE|DB))|OUT|SE(?:NSITIVE|RT(?:_METHOD|))|T(?:1|2|3|4|8|E(?:GER|RVAL)|O|)|VOKER|)|O_THREAD|S(?:OLATION|SUER|)|TERATE)|JOIN|K(?:EY(?:S|)|ILL)|L(?:A(?:NGUAGE|ST)|E(?:A(?:DING|VE(?:S|))|FT|VEL)|I(?:KE|MIT|NES(?:TRING|))|O(?:AD|C(?:AL(?:TIME(?:STAMP|)|)|K(?:S|))|GS|NG(?:BLOB|TEXT|)|OP|W_PRIORITY))|M(?:A(?:STER(?:_(?:CONNECT_RETRY|HOST|LOG_(?:FILE|POS)|P(?:ASSWORD|ORT)|S(?:ERVER_ID|SL(?:_(?:C(?:A(?:PATH|)|ERT|IPHER)|KEY)|))|USER)|)|TCH|X_(?:CONNECTIONS_PER_HOUR|QUERIES_PER_HOUR|ROWS|U(?:PDATES_PER_HOUR|SER_CONNECTIONS)))|E(?:DIUM(?:BLOB|INT|TEXT|)|RGE)|I(?:CROSECOND|DDLEINT|GRATE|N(?:UTE(?:_(?:MICROSECOND|SECOND)|)|_ROWS))|O(?:D(?:E|IF(?:IES|Y)|)|NTH)|U(?:LTI(?:LINESTRING|PO(?:INT|LYGON))|TEX))|N(?:A(?:ME(?:S|)|T(?:IONAL|URAL))|CHAR|DB(?:CLUSTER|)|E(?:W|XT)|O(?:NE|T|_WRITE_TO_BINLOG|)|U(?:LL|MERIC)|VARCHAR)|O(?:FFSET|LD_PASSWORD|N(?:E(?:_SHOT|)|)|P(?:EN|TI(?:MIZE|ON(?:ALLY|)))|R(?:DER|)|UT(?:ER|FILE|))|P(?:A(?:CK_KEYS|RTIAL|SSWORD)|HASE|O(?:INT|LYGON)|R(?:E(?:CISION|PARE|V)|I(?:MARY|VILEGES)|OCE(?:DURE|SS(?:LIST|)))|URGE)|QU(?:ARTER|ERY|ICK)|R(?:AID(?:0|_(?:CHUNKS(?:IZE|)|TYPE))|E(?:A(?:D(?:S|)|L)|COVER|DUNDANT|FERENCES|GEXP|L(?:AY_(?:LOG_(?:FILE|POS)|THREAD)|EASE|OAD)|NAME|P(?:AIR|EAT(?:ABLE|)|L(?:ACE|ICATION))|QUIRE|S(?:ET|T(?:ORE|RICT)|UME)|TURN(?:S|)|VOKE)|IGHT|LIKE|O(?:LL(?:BACK|UP)|UTINE|W(?:S|_FORMAT|))|TREE)|S(?:AVEPOINT|CHEMA(?:S|)|E(?:C(?:OND(?:_MICROSECOND|)|URITY)|LECT|NSITIVE|PARATOR|RIAL(?:IZABLE|)|SSION|T)|H(?:ARE|OW|UTDOWN)|I(?:GNED|MPLE)|LAVE|MALLINT|NAPSHOT|O(?:ME|NAME|UNDS)|P(?:ATIAL|ECIFIC)|QL(?:EXCEPTION|STATE|WARNING|_(?:B(?:IG_RESULT|UFFER_RESULT)|CA(?:CHE|LC_FOUND_ROWS)|NO_CACHE|SMALL_RESULT|T(?:HREAD|SI_(?:DAY|FRAC_SECOND|HOUR|M(?:INUTE|ONTH)|QUARTER|SECOND|WEEK|YEAR)))|)|SL|T(?:A(?:RT(?:ING|)|TUS)|O(?:P|RAGE)|R(?:AIGHT_JOIN|I(?:NG|PED)))|U(?:BJECT|PER|SPEND))|T(?:ABLE(?:S(?:PACE|)|)|E(?:MP(?:ORARY|TABLE)|RMINATED|XT)|HEN|I(?:ME(?:STAMP(?:ADD|DIFF|)|)|NY(?:BLOB|INT|TEXT))|O|R(?:A(?:ILING|NSACTION)|IGGER(?:S|)|U(?:E|NCATE))|YPE(?:S|))|U(?:N(?:COMMITTED|D(?:EFINED|O)|I(?:CODE|ON|QUE)|KNOWN|LOCK|SIGNED|TIL)|P(?:DATE|GRADE)|S(?:AGE|E(?:R(?:_RESOURCES|)|_FRM|)|ING)|TC_(?:DATE|TIME(?:STAMP|)))|V(?:A(?:LUE(?:S|)|R(?:BINARY|CHAR(?:ACTER|)|IABLES|YING))|IEW)|W(?:ARNINGS|EEK|H(?:E(?:N|RE)|ILE)|ITH|ORK|RITE)|X(?:509|A|OR)|YEAR(?:_MONTH|)|ZEROFILL)\b/ }
		, func      : { exp: /\b(?:A(?:BS|COS|DD(?:DATE|TIME)|ES_(?:DECRYPT|ENCRYPT)|REA|S(?:BINARY|IN|TEXT|WK(?:B|T))|TAN(?:2|))|B(?:ENCHMARK|I(?:N|T_(?:AND|COUNT|LENGTH|OR|XOR)))|C(?:AST|E(?:IL(?:ING|)|NTROID)|HAR(?:ACTER_LENGTH|_LENGTH)|O(?:ALESCE|ERCIBILITY|MPRESS|N(?:CAT(?:_WS|)|NECTION_ID|V(?:ERT_TZ|))|S|T|UNT)|R(?:C32|OSSES)|UR(?:DATE|TIME))|D(?:A(?:TE(?:DIFF|_(?:ADD|FORMAT|SUB))|Y(?:NAME|OF(?:MONTH|WEEK|YEAR)))|E(?:CODE|GREES|S_(?:DECRYPT|ENCRYPT))|I(?:MENSION|SJOINT))|E(?:LT|N(?:C(?:ODE|RYPT)|DPOINT|VELOPE)|QUALS|X(?:P(?:ORT_SET|)|T(?:ERIORRING|RACT)))|F(?:I(?:ELD|ND_IN_SET)|LOOR|O(?:RMAT|UND_ROWS)|ROM_(?:DAYS|UNIXTIME))|G(?:E(?:OM(?:COLLFROM(?:TEXT|WKB)|ETRY(?:COLLECTIONFROM(?:TEXT|WKB)|FROM(?:TEXT|WKB)|N|TYPE)|FROM(?:TEXT|WKB))|T_LOCK)|LENGTH|R(?:EATEST|OUP_(?:CONCAT|UNIQUE_USERS)))|HEX|I(?:FNULL|N(?:ET_(?:ATON|NTOA)|STR|TER(?:IORRINGN|SECTS))|S(?:CLOSED|EMPTY|NULL|SIMPLE|_(?:FREE_LOCK|USED_LOCK)))|L(?:AST_(?:DAY|INSERT_ID)|CASE|E(?:AST|NGTH)|INE(?:FROM(?:TEXT|WKB)|STRINGFROM(?:TEXT|WKB))|N|O(?:AD_FILE|CATE|G(?:10|2|)|WER)|PAD|TRIM)|M(?:A(?:KE(?:DATE|TIME|_SET)|STER_POS_WAIT|X)|BR(?:CONTAINS|DISJOINT|EQUAL|INTERSECTS|OVERLAPS|TOUCHES|WITHIN)|D5|I(?:D|N)|LINEFROM(?:TEXT|WKB)|ONTHNAME|PO(?:INTFROM(?:TEXT|WKB)|LYFROM(?:TEXT|WKB))|ULTI(?:LINESTRINGFROM(?:TEXT|WKB)|PO(?:INTFROM(?:TEXT|WKB)|LYGONFROM(?:TEXT|WKB))))|N(?:AME_CONST|OW|U(?:LLIF|M(?:GEOMETRIES|INTERIORRINGS|POINTS)))|O(?:CT(?:ET_LENGTH|)|RD|VERLAPS)|P(?:ERIOD_(?:ADD|DIFF)|I|O(?:INT(?:FROM(?:TEXT|WKB)|N)|LY(?:FROM(?:TEXT|WKB)|GONFROM(?:TEXT|WKB))|SITION|W(?:ER|)))|QUOTE|R(?:A(?:DIANS|ND)|E(?:LEASE_LOCK|VERSE)|O(?:UND|W_COUNT)|PAD|TRIM)|S(?:E(?:C_TO_TIME|SSION_USER)|HA(?:1|)|I(?:GN|N)|LEEP|OUNDEX|PACE|QRT|RID|T(?:ARTPOINT|D(?:DEV(?:_(?:POP|SAMP)|)|)|R(?:CMP|_TO_DATE))|U(?:B(?:DATE|STR(?:ING(?:_INDEX|)|)|TIME)|M)|YS(?:DATE|TEM_USER))|T(?:AN|IME(?:DIFF|_(?:FORMAT|TO_SEC))|O(?:UCHES|_DAYS)|RIM)|U(?:CASE|N(?:COMPRESS(?:ED_LENGTH|)|HEX|I(?:QUE_USERS|X_TIMESTAMP))|PPER|UID)|V(?:AR(?:IANCE|_(?:POP|SAMP))|ERSION)|W(?:EEK(?:DAY|OFYEAR)|ITHIN)|X|Y(?:EARWEEK|))(?=\()/ }
		, id        : { exp: /[$\w]+/ }
	}
};


ChiliBook.recipes[ "php.js" ] = 
{
	steps: {
		  mlcom   : { exp: /\/\*[^*]*\*+([^\/][^*]*\*+)*\// }
		, com     : { exp: /(?:\/\/.*)|(?:[^\\]\#.*)/ }
		, string1 : { exp: /\'[^\'\\]*(?:\\.[^\'\\]*)*\'/ }
		, string2 : { exp: /\"[^\"\\]*(?:\\.[^\"\\]*)*\"/ }
		, value   : { exp: /\b(?:[Nn][Uu][Ll][Ll]|[Tt][Rr][Uu][Ee]|[Ff][Aa][Ll][Ss][Ee])\b/ }
		, number  : { exp: /\b[+-]?(\d*\.?\d+|\d+\.?\d*)([eE][+-]?\d+)?\b/ }
		, const1  : { exp: /\b(?:DEFAULT_INCLUDE_PATH|E_(?:ALL|CO(?:MPILE_(?:ERROR|WARNING)|RE_(?:ERROR|WARNING))|ERROR|NOTICE|PARSE|STRICT|USER_(?:ERROR|NOTICE|WARNING)|WARNING)|P(?:EAR_(?:EXTENSION_DIR|INSTALL_DIR)|HP_(?:BINDIR|CONFIG_FILE_(?:PATH|SCAN_DIR)|DATADIR|E(?:OL|XTENSION_DIR)|INT_(?:MAX|SIZE)|L(?:IBDIR|OCALSTATEDIR)|O(?:S|UTPUT_HANDLER_(?:CONT|END|START))|PREFIX|S(?:API|HLIB_SUFFIX|YSCONFDIR)|VERSION))|__COMPILER_HALT_OFFSET__)\b/ }
		, const2  : { exp: /\b(?:A(?:B(?:DAY_(?:1|2|3|4|5|6|7)|MON_(?:1(?:0|1|2|)|2|3|4|5|6|7|8|9))|LT_DIGITS|M_STR|SSERT_(?:ACTIVE|BAIL|CALLBACK|QUIET_EVAL|WARNING))|C(?:ASE_(?:LOWER|UPPER)|HAR_MAX|O(?:DESET|NNECTION_(?:ABORTED|NORMAL|TIMEOUT)|UNT_(?:NORMAL|RECURSIVE))|R(?:EDITS_(?:ALL|DOCS|FULLPAGE|G(?:ENERAL|ROUP)|MODULES|QA|SAPI)|NCYSTR|YPT_(?:BLOWFISH|EXT_DES|MD5|S(?:ALT_LENGTH|TD_DES)))|URRENCY_SYMBOL)|D(?:AY_(?:1|2|3|4|5|6|7)|ECIMAL_POINT|IRECTORY_SEPARATOR|_(?:FMT|T_FMT))|E(?:NT_(?:COMPAT|NOQUOTES|QUOTES)|RA(?:_(?:D_(?:FMT|T_FMT)|T_FMT|YEAR)|)|XTR_(?:IF_EXISTS|OVERWRITE|PREFIX_(?:ALL|I(?:F_EXISTS|NVALID)|SAME)|SKIP))|FRAC_DIGITS|GROUPING|HTML_(?:ENTITIES|SPECIALCHARS)|IN(?:FO_(?:ALL|C(?:ONFIGURATION|REDITS)|ENVIRONMENT|GENERAL|LICENSE|MODULES|VARIABLES)|I_(?:ALL|PERDIR|SYSTEM|USER)|T_(?:CURR_SYMBOL|FRAC_DIGITS))|L(?:C_(?:ALL|C(?:OLLATE|TYPE)|M(?:ESSAGES|ONETARY)|NUMERIC|TIME)|O(?:CK_(?:EX|NB|SH|UN)|G_(?:A(?:LERT|UTH(?:PRIV|))|C(?:ONS|R(?:IT|ON))|D(?:AEMON|EBUG)|E(?:MERG|RR)|INFO|KERN|L(?:OCAL(?:0|1|2|3|4|5|6|7)|PR)|MAIL|N(?:DELAY|EWS|O(?:TICE|WAIT))|ODELAY|P(?:ERROR|ID)|SYSLOG|U(?:SER|UCP)|WARNING)))|M(?:ON_(?:1(?:0|1|2|)|2|3|4|5|6|7|8|9|DECIMAL_POINT|GROUPING|THOUSANDS_SEP)|_(?:1_PI|2_(?:PI|SQRTPI)|E|L(?:N(?:10|2)|OG(?:10E|2E))|PI(?:_(?:2|4)|)|SQRT(?:1_2|2)))|N(?:EGATIVE_SIGN|O(?:EXPR|STR)|_(?:CS_PRECEDES|S(?:EP_BY_SPACE|IGN_POSN)))|P(?:ATH(?:INFO_(?:BASENAME|DIRNAME|EXTENSION)|_SEPARATOR)|M_STR|OSITIVE_SIGN|_(?:CS_PRECEDES|S(?:EP_BY_SPACE|IGN_POSN)))|RADIXCHAR|S(?:EEK_(?:CUR|END|SET)|ORT_(?:ASC|DESC|NUMERIC|REGULAR|STRING)|TR_PAD_(?:BOTH|LEFT|RIGHT))|T(?:HOUS(?:ANDS_SEP|EP)|_FMT(?:_AMPM|))|YES(?:EXPR|STR))\b/ }
		, global  : { exp: /(?:\$GLOBALS|\$_COOKIE|\$_ENV|\$_FILES|\$_GET|\$_POST|\$_REQUEST|\$_SERVER|\$_SESSION|\$php_errormsg)\b/ }
		, keyword : { exp: /\b(?:__CLASS__|__FILE__|__FUNCTION__|__LINE__|__METHOD__|abstract|and|array|as|break|case|catch|cfunction|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exception|exit|extends|extends|final|for|foreach|function|global|if|implements|include|include_once|interface|isset|list|new|old_function|or|php_user_filter|print|private|protected|public|require|require_once|return|static|switch|this|throw|try|unset|use|var|while|xor)\b/ }
		, variable: { exp: /\$(\w+)/
			, replacement: '<span class="keyword">$</span><span class="variable">$1</span>' }
		, heredoc : { exp: /(\<\<\<\s*)(\w+)((?:(?!\2).*\n)+)(\2)\b/
			, replacement: '<span class="keyword">$1</span><span class="string1">$2</span><span class="string2">$3</span><span class="string1">$4</span>' }
	}
};

ChiliBook.recipes[ "css.js" ] = 
{
	steps: {
		  mlcom : { exp: /\/\*[^*]*\*+(?:[^\/][^*]*\*+)*\// }
		, string: { exp: /(?:\'[^\'\\\n]*(?:\\.[^\'\\\n]*)*\')|(?:\"[^\"\\\n]*(?:\\.[^\"\\\n]*)*\")/ }
		, number: { exp: /(?:\b[+-]?(?:\d*\.?\d+|\d+\.?\d*))(?:%|(?:(?:px|pt|em|)\b))/ }
		, attrib: { exp: /\b(?:z-index|x-height|word-spacing|widths|width|widows|white-space|volume|voice-family|visibility|vertical-align|units-per-em|unicode-range|unicode-bidi|text-transform|text-shadow|text-indent|text-decoration|text-align|table-layout|stress|stemv|stemh|src|speech-rate|speak-punctuation|speak-numeral|speak-header|speak|slope|size|right|richness|quotes|position|play-during|pitch-range|pitch|pause-before|pause-after|pause|page-break-inside|page-break-before|page-break-after|page|padding-top|padding-right|padding-left|padding-bottom|padding|overflow|outline-width|outline-style|outline-color|outline|orphans|min-width|min-height|max-width|max-height|mathline|marks|marker-offset|margin-top|margin-right|margin-left|margin-bottom|margin|list-style-type|list-style-position|list-style-image|list-style|line-height|letter-spacing|height|font-weight|font-variant|font-style|font-stretch|font-size-adjust|font-size|font-family|font|float|empty-cells|elevation|display|direction|descent|definition-src|cursor|cue-before|cue-after|cue|counter-reset|counter-increment|content|color|clip|clear|centerline|caption-side|cap-height|bottom|border-width|border-top-width|border-top-style|border-top-color|border-top|border-style|border-spacing|border-right-width|border-right-style|border-right-color|border-right|border-left-width|border-left-style|border-left-color|border-left|border-color|border-collapse|border-bottom-width|border-bottom-style|border-bottom-color|border-bottom|border|bbox|baseline|background-repeat|background-position|background-image|background-color|background-attachment|background|azimuth|ascent)\b/ }
		, value : { exp: /\b(?:xx-small|xx-large|x-soft|x-small|x-slow|x-low|x-loud|x-large|x-high|x-fast|wider|wait|w-resize|visible|url|uppercase|upper-roman|upper-latin|upper-alpha|underline|ultra-expanded|ultra-condensed|tv|tty|transparent|top|thin|thick|text-top|text-bottom|table-row-group|table-row|table-header-group|table-footer-group|table-column-group|table-column|table-cell|table-caption|sw-resize|super|sub|status-bar|static|square|spell-out|speech|solid|soft|smaller|small-caption|small-caps|small|slower|slow|silent|show|separate|semi-expanded|semi-condensed|se-resize|scroll|screen|s-resize|run-in|rtl|rightwards|right-side|right|ridge|rgb|repeat-y|repeat-x|repeat|relative|projection|print|pre|portrait|pointer|overline|outside|outset|open-quote|once|oblique|nw-resize|nowrap|normal|none|no-repeat|no-open-quote|no-close-quote|ne-resize|narrower|n-resize|move|mix|middle|message-box|medium|marker|ltr|lowercase|lower-roman|lower-latin|lower-greek|lower-alpha|lower|low|loud|local|list-item|line-through|lighter|level|leftwards|left-side|left|larger|large|landscape|justify|italic|invert|inside|inset|inline-table|inline|icon|higher|high|hide|hidden|help|hebrew|handheld|groove|format|fixed|faster|fast|far-right|far-left|fantasy|extra-expanded|extra-condensed|expanded|embossed|embed|e-resize|double|dotted|disc|digits|default|decimal-leading-zero|decimal|dashed|cursive|crosshair|cross|crop|counters|counter|continuous|condensed|compact|collapse|code|close-quote|circle|center-right|center-left|center|caption|capitalize|braille|bottom|both|bolder|bold|block|blink|bidi-override|below|behind|baseline|avoid|auto|aural|attr|armenian|always|all|absolute|above)\b/ }
		, color : { exp: /(?:\#[a-zA-Z0-9]{3,6})|(?:yellow|white|teal|silver|red|purple|olive|navy|maroon|lime|green|gray|fuchsia|blue|black|aqua)/ }
	}
};





ChiliBook.elementPath  = '.colored';
ChiliBook.elementClass =  'colored';