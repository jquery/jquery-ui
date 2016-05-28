(function( root, factory ) {

	// UMD returnExports
	if ( typeof define === "function" && define.amd ) {

		// AMD
		define( ["globalize-runtime/number","globalize-runtime/date"], factory );
	} else if ( typeof exports === "object" ) {

		// Node, CommonJS
		module.exports = factory( require("globalize/dist/globalize-runtime/number"), require("globalize/dist/globalize-runtime/date") );
	} else {

		// Global
		factory( root.Globalize );
	}
}( this, function( Globalize ) {

var validateParameterTypeNumber = Globalize._validateParameterTypeNumber;
var validateParameterPresence = Globalize._validateParameterPresence;
var numberRound = Globalize._numberRound;
var numberFormat = Globalize._numberFormat;
var numberFormatterFn = Globalize._numberFormatterFn;
var validateParameterTypeString = Globalize._validateParameterTypeString;
var numberParse = Globalize._numberParse;
var numberParserFn = Globalize._numberParserFn;
var validateParameterTypeDate = Globalize._validateParameterTypeDate;
var dateFormat = Globalize._dateFormat;
var dateFormatterFn = Globalize._dateFormatterFn;
var dateTokenizer = Globalize._dateTokenizer;
var dateParse = Globalize._dateParse;
var dateParserFn = Globalize._dateParserFn;

Globalize.b376385760 = numberFormatterFn(["",,2,,,,,,,,"","00","-00","-","",numberRound(),"∞","NaN",{".":",",",":".","%":"%","+":"+","-":"-","E":"E","‰":"‰"},]);
Globalize.a1711088039 = numberFormatterFn(["",,1,,,,,,,,"","0","-0","-","",numberRound(),"∞","NaN",{".":".",",":",","%":"%","+":"+","-":"-","E":"E","‰":"‰"},]);
Globalize.a1916379524 = numberFormatterFn(["",,1,,,,,,,,"","0","-0","-","",numberRound(),"∞","ليس رقم",{".":"٫",",":"٬","%":"٪","+":"‏+","-":"‏-","E":"اس","‰":"؉"},"٠١٢٣٤٥٦٧٨٩"]);
Globalize.b1256031091 = numberFormatterFn(["",,2,,,,,,,,"","00","-00","-","",numberRound(),"∞","NaN",{".":",",",":".","%":"%","+":"+","-":"-","E":"E","‰":"‰"},]);
Globalize.b1148906457 = numberFormatterFn(["",,1,,,,,,,,"","0","-0","-","",numberRound(),"∞","NaN",{".":",",",":".","%":"%","+":"+","-":"-","E":"E","‰":"‰"},]);
Globalize.a126395188 = numberFormatterFn(["",,1,,,,,,,,"","0","-0","-","",numberRound(),"∞","NaN",{".":",",",":".","%":"%","+":"+","-":"-","E":"E","‰":"‰"},]);
Globalize.b203855544 = numberFormatterFn(["",,2,,,,,,,,"","00","-00","-","",numberRound(),"∞","NaN",{".":".",",":",","%":"%","+":"+","-":"-","E":"E","‰":"‰"},]);
Globalize.a1378886668 = numberFormatterFn(["",,1,,,,,,,,"","0","-0","-","",numberRound(),"∞","NaN",{".":".",",":",","%":"%","+":"+","-":"-","E":"E","‰":"‰"},]);
Globalize.b1961282698 = numberParserFn(["∞",{".":",",",":".","%":"%","+":"+","-":"-","E":"E","‰":"‰"},"-","",]);
Globalize.b755631779 = numberParserFn(["∞",{".":"decimal",",":"group","%":"percentSign","+":"plusSign","-":"minusSign","E":"exponential","‰":"perMille","٫":".","٬":",","٪":"%","‏+":"+","‏-":"-","اس":"E","؉":"‰"},"-","",{"0":"invalid","1":"invalid","2":"invalid","3":"invalid","4":"invalid","5":"invalid","6":"invalid","7":"invalid","8":"invalid","9":"invalid","٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9"}]);
Globalize.b2002841143 = numberParserFn(["∞",{".":",",",":".","%":"%","+":"+","-":"-","E":"E","‰":"‰"},"-","",]);
Globalize.a1749351181 = numberParserFn(["∞",{".":",",",":".","%":"%","+":"+","-":"-","E":"E","‰":"‰"},"-","",]);
Globalize.b960923264 = numberParserFn(["∞",{".":".",",":",","%":"%","+":"+","-":"-","E":"E","‰":"‰"},"-","",]);
Globalize.b1965900303 = numberParserFn(["∞",{".":".",",":",","%":"%","+":"+","-":"-","E":"E","‰":"‰"},"-","",]);
Globalize.b1293124635 = numberParserFn(["∞",{".":".",",":",","%":"%","+":"+","-":"-","E":"E","‰":"‰"},"-","",]);
Globalize.b2076722823 = numberParserFn(["∞",{".":"decimal",",":"group","%":"percentSign","+":"plusSign","-":"minusSign","E":"exponential","‰":"perMille","٫":".","٬":",","٪":"%","‏+":"+","‏-":"-","اس":"E","؉":"‰"},"-","",{"0":"invalid","1":"invalid","2":"invalid","3":"invalid","4":"invalid","5":"invalid","6":"invalid","7":"invalid","8":"invalid","9":"invalid","٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9"}]);
Globalize.a474049536 = numberParserFn(["∞",{".":",",",":".","%":"%","+":"+","-":"-","E":"E","‰":"‰"},"-","",]);
Globalize.b1370229258 = numberParserFn(["∞",{".":".",",":",","%":"%","+":"+","-":"-","E":"E","‰":"‰"},"-","",]);
Globalize.b729298712 = dateFormatterFn({}, {"pattern":"EEEEEE","timeSeparator":":","days":{"E":{"6":{"sun":"DO","mon":"LU","tue":"MA","wed":"MI","thu":"JU","fri":"VI","sat":"SA"}}}});
Globalize.a52764931 = dateFormatterFn({}, {"pattern":"EEEE","timeSeparator":":","days":{"E":{"4":{"sun":"Sunday","mon":"Monday","tue":"Tuesday","wed":"Wednesday","thu":"Thursday","fri":"Friday","sat":"Saturday"}}}});
Globalize.b617029686 = dateFormatterFn({"1":Globalize("en").numberFormatter({"raw":"0"})}, {"pattern":"w","timeSeparator":":","firstDay":0,"minDays":1});
Globalize.a1636669180 = dateFormatterFn({}, {"pattern":"EEEEE","timeSeparator":":","days":{"E":{"5":{"sun":"S","mon":"M","tue":"T","wed":"W","thu":"T","fri":"F","sat":"S"}}}});
Globalize.b617625506 = dateFormatterFn({"1":Globalize("en").numberFormatter({"raw":"0"})}, {"pattern":"c","timeSeparator":":","firstDay":0});
Globalize.b93641787 = dateFormatterFn({"1":Globalize("en").numberFormatter({"raw":"0"}),"2":Globalize("en").numberFormatter({"raw":"00"})}, {"pattern":"M/d/yy","timeSeparator":":"});
Globalize.b801906653 = dateFormatterFn({}, {"pattern":"EEEEEE","timeSeparator":":","days":{"E":{"6":{"sun":"Su","mon":"Mo","tue":"Tu","wed":"We","thu":"Th","fri":"Fr","sat":"Sa"}}}});
Globalize.a491609039 = dateFormatterFn({"1":Globalize("zh").numberFormatter({"raw":"0"})}, {"pattern":"y年M月d日EEEE","timeSeparator":":","days":{"E":{"4":{"sun":"星期日","mon":"星期一","tue":"星期二","wed":"星期三","thu":"星期四","fri":"星期五","sat":"星期六"}}}});
Globalize.a1351587010 = dateFormatterFn({"1":Globalize("zh").numberFormatter({"raw":"0"})}, {"pattern":"y年M月d日","timeSeparator":":"});
Globalize.a218160295 = dateFormatterFn({"1":Globalize("en").numberFormatter({"raw":"0"})}, {"pattern":"MMMM d, y","timeSeparator":":","months":{"M":{"4":{"1":"January","2":"February","3":"March","4":"April","5":"May","6":"June","7":"July","8":"August","9":"September","10":"October","11":"November","12":"December"}}}});
Globalize.a864358539 = dateFormatterFn({}, {"pattern":"EEEE","timeSeparator":":","days":{"E":{"4":{"sun":"الأحد","mon":"الاثنين","tue":"الثلاثاء","wed":"الأربعاء","thu":"الخميس","fri":"الجمعة","sat":"السبت"}}}});
Globalize.b641817676 = dateFormatterFn({"1":Globalize("en").numberFormatter({"raw":"0"})}, {"pattern":"EEEE, MMMM d, y","timeSeparator":":","days":{"E":{"4":{"sun":"Sunday","mon":"Monday","tue":"Tuesday","wed":"Wednesday","thu":"Thursday","fri":"Friday","sat":"Saturday"}}},"months":{"M":{"4":{"1":"January","2":"February","3":"March","4":"April","5":"May","6":"June","7":"July","8":"August","9":"September","10":"October","11":"November","12":"December"}}}});
Globalize.a682848010 = dateFormatterFn({"1":Globalize("zh").numberFormatter({"raw":"0"})}, {"pattern":"y/M/d","timeSeparator":":"});
Globalize.b285424135 = dateFormatterFn({"1":Globalize("zh").numberFormatter({"raw":"0"})}, {"pattern":"c","timeSeparator":":","firstDay":0});
Globalize.b388886901 = dateFormatterFn({}, {"pattern":"MMMM","timeSeparator":":","months":{"M":{"4":{"1":"يناير","2":"فبراير","3":"مارس","4":"أبريل","5":"مايو","6":"يونيو","7":"يوليو","8":"أغسطس","9":"سبتمبر","10":"أكتوبر","11":"نوفمبر","12":"ديسمبر"}}}});
Globalize.b1382770181 = dateFormatterFn({}, {"pattern":"EEEEEE","timeSeparator":":","days":{"E":{"6":{"sun":"So.","mon":"Mo.","tue":"Di.","wed":"Mi.","thu":"Do.","fri":"Fr.","sat":"Sa."}}}});
Globalize.b1430109660 = dateFormatterFn({}, {"pattern":"EEEEE","timeSeparator":":","days":{"E":{"5":{"sun":"S","mon":"M","tue":"D","wed":"M","thu":"D","fri":"F","sat":"S"}}}});
Globalize.a1754951899 = dateFormatterFn({}, {"pattern":"EEEE","timeSeparator":":","days":{"E":{"4":{"sun":"Sonntag","mon":"Montag","tue":"Dienstag","wed":"Mittwoch","thu":"Donnerstag","fri":"Freitag","sat":"Samstag"}}}});
Globalize.a501706459 = dateFormatterFn({}, {"pattern":"MMMM","timeSeparator":":","months":{"M":{"4":{"1":"Januar","2":"Februar","3":"März","4":"April","5":"Mai","6":"Juni","7":"Juli","8":"August","9":"September","10":"Oktober","11":"November","12":"Dezember"}}}});
Globalize.b1869521166 = dateFormatterFn({"1":Globalize("de").numberFormatter({"raw":"0"})}, {"pattern":"w","timeSeparator":":","firstDay":1,"minDays":4});
Globalize.b1252219604 = dateFormatterFn({"1":Globalize("ar").numberFormatter({"raw":"0"})}, {"pattern":"EEEE، d MMMM، y","timeSeparator":":","days":{"E":{"4":{"sun":"الأحد","mon":"الاثنين","tue":"الثلاثاء","wed":"الأربعاء","thu":"الخميس","fri":"الجمعة","sat":"السبت"}}},"months":{"M":{"4":{"1":"يناير","2":"فبراير","3":"مارس","4":"أبريل","5":"مايو","6":"يونيو","7":"يوليو","8":"أغسطس","9":"سبتمبر","10":"أكتوبر","11":"نوفمبر","12":"ديسمبر"}}}});
Globalize.b1870116986 = dateFormatterFn({"1":Globalize("de").numberFormatter({"raw":"0"})}, {"pattern":"c","timeSeparator":":","firstDay":1});
Globalize.b674505315 = dateFormatterFn({"2":Globalize("de").numberFormatter({"raw":"00"})}, {"pattern":"dd.MM.yy","timeSeparator":":"});
Globalize.a1026267252 = dateFormatterFn({}, {"pattern":"EEEEE","timeSeparator":":","days":{"E":{"5":{"sun":"ح","mon":"ن","tue":"ث","wed":"ر","thu":"خ","fri":"ج","sat":"س"}}}});
Globalize.b284828315 = dateFormatterFn({"1":Globalize("zh").numberFormatter({"raw":"0"})}, {"pattern":"w","timeSeparator":":","firstDay":0,"minDays":1});
Globalize.b194087032 = dateFormatterFn({}, {"pattern":"MMMM","timeSeparator":":","months":{"M":{"4":{"1":"一月","2":"二月","3":"三月","4":"四月","5":"五月","6":"六月","7":"七月","8":"八月","9":"九月","10":"十月","11":"十一月","12":"十二月"}}}});
Globalize.a1446348751 = dateFormatterFn({"1":Globalize("de").numberFormatter({"raw":"0"})}, {"pattern":"d. MMMM y","timeSeparator":":","months":{"M":{"4":{"1":"Januar","2":"Februar","3":"März","4":"April","5":"Mai","6":"Juni","7":"Juli","8":"August","9":"September","10":"Oktober","11":"November","12":"Dezember"}}}});
Globalize.a1059158408 = dateFormatterFn({}, {"pattern":"EEEE","timeSeparator":":","days":{"E":{"4":{"sun":"星期日","mon":"星期一","tue":"星期二","wed":"星期三","thu":"星期四","fri":"星期五","sat":"星期六"}}}});
Globalize.a586370780 = dateFormatterFn({"1":Globalize("de").numberFormatter({"raw":"0"})}, {"pattern":"EEEE, d. MMMM y","timeSeparator":":","days":{"E":{"4":{"sun":"Sonntag","mon":"Montag","tue":"Dienstag","wed":"Mittwoch","thu":"Donnerstag","fri":"Freitag","sat":"Samstag"}}},"months":{"M":{"4":{"1":"Januar","2":"Februar","3":"März","4":"April","5":"Mai","6":"Juni","7":"Juli","8":"August","9":"September","10":"Oktober","11":"November","12":"Dezember"}}}});
Globalize.b1524871401 = dateFormatterFn({}, {"pattern":"EEEEE","timeSeparator":":","days":{"E":{"5":{"sun":"日","mon":"一","tue":"二","wed":"三","thu":"四","fri":"五","sat":"六"}}}});
Globalize.b25416856 = dateFormatterFn({}, {"pattern":"EEEEEE","timeSeparator":":","days":{"E":{"6":{"sun":"周日","mon":"周一","tue":"周二","wed":"周三","thu":"周四","fri":"周五","sat":"周六"}}}});
Globalize.b392241633 = dateFormatterFn({"1":Globalize("ar").numberFormatter({"raw":"0"})}, {"pattern":"d MMMM، y","timeSeparator":":","months":{"M":{"4":{"1":"يناير","2":"فبراير","3":"مارس","4":"أبريل","5":"مايو","6":"يونيو","7":"يوليو","8":"أغسطس","9":"سبتمبر","10":"أكتوبر","11":"نوفمبر","12":"ديسمبر"}}}});
Globalize.b1200480509 = dateFormatterFn({}, {"pattern":"MMMM","timeSeparator":":","months":{"M":{"4":{"1":"January","2":"February","3":"March","4":"April","5":"May","6":"June","7":"July","8":"August","9":"September","10":"October","11":"November","12":"December"}}}});
Globalize.a946274711 = dateFormatterFn({}, {"pattern":"EEEEE","timeSeparator":":","days":{"E":{"5":{"sun":"D","mon":"L","tue":"M","wed":"X","thu":"J","fri":"V","sat":"S"}}}});
Globalize.b1770621176 = dateFormatterFn({}, {"pattern":"EEEE","timeSeparator":":","days":{"E":{"4":{"sun":"domingo","mon":"lunes","tue":"martes","wed":"miércoles","thu":"jueves","fri":"viernes","sat":"sábado"}}}});
Globalize.a1271100680 = dateFormatterFn({}, {"pattern":"MMMM","timeSeparator":":","months":{"M":{"4":{"1":"enero","2":"febrero","3":"marzo","4":"abril","5":"mayo","6":"junio","7":"julio","8":"agosto","9":"septiembre","10":"octubre","11":"noviembre","12":"diciembre"}}}});
Globalize.a1150144485 = dateFormatterFn({"1":Globalize("es").numberFormatter({"raw":"0"})}, {"pattern":"w","timeSeparator":":","firstDay":1,"minDays":4});
Globalize.b79536830 = dateFormatterFn({"1":Globalize("ar").numberFormatter({"raw":"0"})}, {"pattern":"w","timeSeparator":":","firstDay":6,"minDays":1});
Globalize.a1149548665 = dateFormatterFn({"1":Globalize("es").numberFormatter({"raw":"0"})}, {"pattern":"c","timeSeparator":":","firstDay":1});
Globalize.b21033846 = dateFormatterFn({"1":Globalize("es").numberFormatter({"raw":"0"}),"2":Globalize("es").numberFormatter({"raw":"00"})}, {"pattern":"d/M/yy","timeSeparator":":"});
Globalize.b1836232371 = dateFormatterFn({"1":Globalize("ar").numberFormatter({"raw":"0"})}, {"pattern":"d‏/M‏/y","timeSeparator":":"});
Globalize.b1332212145 = dateFormatterFn({"1":Globalize("es").numberFormatter({"raw":"0"})}, {"pattern":"EEEE, d 'de' MMMM 'de' y","timeSeparator":":","days":{"E":{"4":{"sun":"domingo","mon":"lunes","tue":"martes","wed":"miércoles","thu":"jueves","fri":"viernes","sat":"sábado"}}},"months":{"M":{"4":{"1":"enero","2":"febrero","3":"marzo","4":"abril","5":"mayo","6":"junio","7":"julio","8":"agosto","9":"septiembre","10":"octubre","11":"noviembre","12":"diciembre"}}}});
Globalize.b80132650 = dateFormatterFn({"1":Globalize("ar").numberFormatter({"raw":"0"})}, {"pattern":"c","timeSeparator":":","firstDay":6});
Globalize.b472234174 = dateFormatterFn({"1":Globalize("es").numberFormatter({"raw":"0"})}, {"pattern":"d 'de' MMMM 'de' y","timeSeparator":":","months":{"M":{"4":{"1":"enero","2":"febrero","3":"marzo","4":"abril","5":"mayo","6":"junio","7":"julio","8":"agosto","9":"septiembre","10":"octubre","11":"noviembre","12":"diciembre"}}}});
Globalize.a1750470059 = dateFormatterFn({}, {"pattern":"EEEEEE","timeSeparator":":","days":{"E":{"6":{"sun":"الأحد","mon":"الاثنين","tue":"الثلاثاء","wed":"الأربعاء","thu":"الخميس","fri":"الجمعة","sat":"السبت"}}}});
Globalize.b1518991631 = dateParserFn(Globalize("es").numberParser({"raw":"0"}), {"preferredTimeData":"H"}, {"pattern":"d 'de' MMMM 'de' y","timeSeparator":":","gregorian/months/format/wide":{"1":"enero","2":"febrero","3":"marzo","4":"abril","5":"mayo","6":"junio","7":"julio","8":"agosto","9":"septiembre","10":"octubre","11":"noviembre","12":"diciembre"}});
Globalize.a1915997694 = dateParserFn(Globalize("es").numberParser({"raw":"0"}), {"preferredTimeData":"H"}, {"pattern":"EEEE, d 'de' MMMM 'de' y","timeSeparator":":","gregorian/days/format/wide":{"sun":"domingo","mon":"lunes","tue":"martes","wed":"miércoles","thu":"jueves","fri":"viernes","sat":"sábado"},"gregorian/months/format/wide":{"1":"enero","2":"febrero","3":"marzo","4":"abril","5":"mayo","6":"junio","7":"julio","8":"agosto","9":"septiembre","10":"octubre","11":"noviembre","12":"diciembre"}});
Globalize.b82385031 = dateParserFn(Globalize("es").numberParser({"raw":"0"}), {"preferredTimeData":"H"}, {"pattern":"yyyy-MM-dd","timeSeparator":":"});
Globalize.a74024830 = dateParserFn(Globalize("ar").numberParser({"raw":"0"}), {"preferredTimeData":"h"}, {"pattern":"d‏/M‏/y","timeSeparator":":"});
Globalize.b262211828 = dateParserFn(Globalize("de").numberParser({"raw":"0"}), {"preferredTimeData":"H"}, {"pattern":"yyyy-MM-dd","timeSeparator":":"});
Globalize.b460386677 = dateParserFn(Globalize("de").numberParser({"raw":"0"}), {"preferredTimeData":"H"}, {"pattern":"EEEE, d. MMMM y","timeSeparator":":","gregorian/days/format/wide":{"sun":"Sonntag","mon":"Montag","tue":"Dienstag","wed":"Mittwoch","thu":"Donnerstag","fri":"Freitag","sat":"Samstag"},"gregorian/months/format/wide":{"1":"Januar","2":"Februar","3":"März","4":"April","5":"Mai","6":"Juni","7":"Juli","8":"August","9":"September","10":"Oktober","11":"November","12":"Dezember"}});
Globalize.a399591294 = dateParserFn(Globalize("de").numberParser({"raw":"0"}), {"preferredTimeData":"H"}, {"pattern":"d. MMMM y","timeSeparator":":","gregorian/months/format/wide":{"1":"Januar","2":"Februar","3":"März","4":"April","5":"Mai","6":"Juni","7":"Juli","8":"August","9":"September","10":"Oktober","11":"November","12":"Dezember"}});
Globalize.b1438999090 = dateParserFn(Globalize("ar").numberParser({"raw":"0"}), {"preferredTimeData":"h"}, {"pattern":"d MMMM، y","timeSeparator":":","gregorian/months/format/wide":{"1":"يناير","2":"فبراير","3":"مارس","4":"أبريل","5":"مايو","6":"يونيو","7":"يوليو","8":"أغسطس","9":"سبتمبر","10":"أكتوبر","11":"نوفمبر","12":"ديسمبر"}});
Globalize.a1235751886 = dateParserFn(Globalize("de").numberParser({"raw":"0"}), {"preferredTimeData":"H"}, {"pattern":"dd.MM.yy","timeSeparator":":"});
Globalize.a1889223355 = dateParserFn(Globalize("es").numberParser({"raw":"0"}), {"preferredTimeData":"H"}, {"pattern":"d/M/yy","timeSeparator":":"});
Globalize.b2011240140 = dateParserFn(Globalize("en").numberParser({"raw":"0"}), {"preferredTimeData":"h"}, {"pattern":"yyyy-MM-dd","timeSeparator":":"});
Globalize.b1688575133 = dateParserFn(Globalize("en").numberParser({"raw":"0"}), {"preferredTimeData":"h"}, {"pattern":"EEEE, MMMM d, y","timeSeparator":":","gregorian/days/format/wide":{"sun":"Sunday","mon":"Monday","tue":"Tuesday","wed":"Wednesday","thu":"Thursday","fri":"Friday","sat":"Saturday"},"gregorian/months/format/wide":{"1":"January","2":"February","3":"March","4":"April","5":"May","6":"June","7":"July","8":"August","9":"September","10":"October","11":"November","12":"December"}});
Globalize.b1701862085 = dateParserFn(Globalize("zh").numberParser({"raw":"0"}), {"preferredTimeData":"h"}, {"pattern":"y/M/d","timeSeparator":":"});
Globalize.b828597162 = dateParserFn(Globalize("en").numberParser({"raw":"0"}), {"preferredTimeData":"h"}, {"pattern":"MMMM d, y","timeSeparator":":","gregorian/months/format/wide":{"1":"January","2":"February","3":"March","4":"April","5":"May","6":"June","7":"July","8":"August","9":"September","10":"October","11":"November","12":"December"}});
Globalize.b1059122500 = dateParserFn(Globalize("ar").numberParser({"raw":"0"}), {"preferredTimeData":"h"}, {"pattern":"yyyy-MM-dd","timeSeparator":":"});
Globalize.a304829553 = dateParserFn(Globalize("zh").numberParser({"raw":"0"}), {"preferredTimeData":"h"}, {"pattern":"y年M月d日","timeSeparator":":"});
Globalize.a1816615414 = dateParserFn(Globalize("en").numberParser({"raw":"0"}), {"preferredTimeData":"h"}, {"pattern":"M/d/yy","timeSeparator":":"});
Globalize.b555148418 = dateParserFn(Globalize("zh").numberParser({"raw":"0"}), {"preferredTimeData":"h"}, {"pattern":"y年M月d日EEEE","timeSeparator":":","gregorian/days/format/wide":{"sun":"星期日","mon":"星期一","tue":"星期二","wed":"星期三","thu":"星期四","fri":"星期五","sat":"星期六"}});
Globalize.a1997933049 = dateParserFn(Globalize("zh").numberParser({"raw":"0"}), {"preferredTimeData":"h"}, {"pattern":"yyyy-MM-dd","timeSeparator":":"});
Globalize.a1995990235 = dateParserFn(Globalize("ar").numberParser({"raw":"0"}), {"preferredTimeData":"h"}, {"pattern":"EEEE، d MMMM، y","timeSeparator":":","gregorian/days/format/wide":{"sun":"الأحد","mon":"الاثنين","tue":"الثلاثاء","wed":"الأربعاء","thu":"الخميس","fri":"الجمعة","sat":"السبت"},"gregorian/months/format/wide":{"1":"يناير","2":"فبراير","3":"مارس","4":"أبريل","5":"مايو","6":"يونيو","7":"يوليو","8":"أغسطس","9":"سبتمبر","10":"أكتوبر","11":"نوفمبر","12":"ديسمبر"}});

return Globalize;

}));
