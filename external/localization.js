/**
 * CLDR data
 */
( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"globalize"
		], factory );
	} else {

		// Browser globals
		factory( Globalize );
	}
}( function( Globalize ) {

Globalize.load({
	"main": {
		"ar": {
			"identity": {
				"version": {
					"_cldrVersion": "27.0.1",
					"_number": "$Revision: 11294 $"
				},
				"generation": {
					"_date": "$Date: 2015-02-23 16:50:24 -0600 (Mon, 23 Feb 2015) $"
				},
				"language": "ar"
			},
			"dates": {
				"calendars": {
					"gregorian": {
						"months": {
							"format": {
								"abbreviated": {
									"1": "يناير",
									"2": "فبراير",
									"3": "مارس",
									"4": "أبريل",
									"5": "مايو",
									"6": "يونيو",
									"7": "يوليو",
									"8": "أغسطس",
									"9": "سبتمبر",
									"10": "أكتوبر",
									"11": "نوفمبر",
									"12": "ديسمبر"
								},
								"narrow": {
									"1": "ي",
									"2": "ف",
									"3": "م",
									"4": "أ",
									"5": "و",
									"6": "ن",
									"7": "ل",
									"8": "غ",
									"9": "س",
									"10": "ك",
									"11": "ب",
									"12": "د"
								},
								"wide": {
									"1": "يناير",
									"2": "فبراير",
									"3": "مارس",
									"4": "أبريل",
									"5": "مايو",
									"6": "يونيو",
									"7": "يوليو",
									"8": "أغسطس",
									"9": "سبتمبر",
									"10": "أكتوبر",
									"11": "نوفمبر",
									"12": "ديسمبر"
								}
							},
							"stand-alone": {
								"abbreviated": {
									"1": "يناير",
									"2": "فبراير",
									"3": "مارس",
									"4": "أبريل",
									"5": "مايو",
									"6": "يونيو",
									"7": "يوليو",
									"8": "أغسطس",
									"9": "سبتمبر",
									"10": "أكتوبر",
									"11": "نوفمبر",
									"12": "ديسمبر"
								},
								"narrow": {
									"1": "ي",
									"2": "ف",
									"3": "م",
									"4": "أ",
									"5": "و",
									"6": "ن",
									"7": "ل",
									"8": "غ",
									"9": "س",
									"10": "ك",
									"11": "ب",
									"12": "د"
								},
								"wide": {
									"1": "يناير",
									"2": "فبراير",
									"3": "مارس",
									"4": "أبريل",
									"5": "مايو",
									"6": "يونيو",
									"7": "يوليو",
									"8": "أغسطس",
									"9": "سبتمبر",
									"10": "أكتوبر",
									"11": "نوفمبر",
									"12": "ديسمبر"
								}
							}
						},
						"days": {
							"format": {
								"abbreviated": {
									"sun": "الأحد",
									"mon": "الاثنين",
									"tue": "الثلاثاء",
									"wed": "الأربعاء",
									"thu": "الخميس",
									"fri": "الجمعة",
									"sat": "السبت"
								},
								"narrow": {
									"sun": "ح",
									"mon": "ن",
									"tue": "ث",
									"wed": "ر",
									"thu": "خ",
									"fri": "ج",
									"sat": "س"
								},
								"short": {
									"sun": "الأحد",
									"mon": "الاثنين",
									"tue": "الثلاثاء",
									"wed": "الأربعاء",
									"thu": "الخميس",
									"fri": "الجمعة",
									"sat": "السبت"
								},
								"wide": {
									"sun": "الأحد",
									"mon": "الاثنين",
									"tue": "الثلاثاء",
									"wed": "الأربعاء",
									"thu": "الخميس",
									"fri": "الجمعة",
									"sat": "السبت"
								}
							},
							"stand-alone": {
								"abbreviated": {
									"sun": "الأحد",
									"mon": "الاثنين",
									"tue": "الثلاثاء",
									"wed": "الأربعاء",
									"thu": "الخميس",
									"fri": "الجمعة",
									"sat": "السبت"
								},
								"narrow": {
									"sun": "ح",
									"mon": "ن",
									"tue": "ث",
									"wed": "ر",
									"thu": "خ",
									"fri": "ج",
									"sat": "س"
								},
								"short": {
									"sun": "الأحد",
									"mon": "الاثنين",
									"tue": "الثلاثاء",
									"wed": "الأربعاء",
									"thu": "الخميس",
									"fri": "الجمعة",
									"sat": "السبت"
								},
								"wide": {
									"sun": "الأحد",
									"mon": "الاثنين",
									"tue": "الثلاثاء",
									"wed": "الأربعاء",
									"thu": "الخميس",
									"fri": "الجمعة",
									"sat": "السبت"
								}
							}
						},
						"quarters": {
							"format": {
								"abbreviated": {
									"1": "الربع الأول",
									"2": "الربع الثاني",
									"3": "الربع الثالث",
									"4": "الربع الرابع"
								},
								"narrow": {
									"1": "١",
									"2": "٢",
									"3": "٣",
									"4": "٤"
								},
								"wide": {
									"1": "الربع الأول",
									"2": "الربع الثاني",
									"3": "الربع الثالث",
									"4": "الربع الرابع"
								}
							},
							"stand-alone": {
								"abbreviated": {
									"1": "الربع الأول",
									"2": "الربع الثاني",
									"3": "الربع الثالث",
									"4": "الربع الرابع"
								},
								"narrow": {
									"1": "١",
									"2": "٢",
									"3": "٣",
									"4": "٤"
								},
								"wide": {
									"1": "الربع الأول",
									"2": "الربع الثاني",
									"3": "الربع الثالث",
									"4": "الربع الرابع"
								}
							}
						},
						"dayPeriods": {
							"format": {
								"abbreviated": {
									"am": "ص",
									"noon": "ظهرا",
									"pm": "م"
								},
								"narrow": {
									"am": "ص",
									"noon": "ظ",
									"pm": "م"
								},
								"wide": {
									"am": "ص",
									"noon": "ظهرا",
									"pm": "م"
								}
							},
							"stand-alone": {
								"abbreviated": {
									"am": "ص",
									"noon": "ظهرا",
									"pm": "م"
								},
								"narrow": {
									"am": "ص",
									"noon": "ظ",
									"pm": "م"
								},
								"wide": {
									"am": "ص",
									"noon": "ظهرا",
									"pm": "م"
								}
							}
						},
						"eras": {
							"eraNames": {
								"0": "قبل الميلاد",
								"0-alt-variant": "BCE",
								"1": "ميلادي",
								"1-alt-variant": "بعد الميلاد"
							},
							"eraAbbr": {
								"0": "ق.م",
								"0-alt-variant": "BCE",
								"1": "م",
								"1-alt-variant": "ب.م"
							},
							"eraNarrow": {
								"0": "ق.م",
								"0-alt-variant": "BCE",
								"1": "م",
								"1-alt-variant": "ب.م"
							}
						},
						"dateFormats": {
							"full": "EEEE، d MMMM، y",
							"long": "d MMMM، y",
							"medium": "dd‏/MM‏/y",
							"short": "d‏/M‏/y"
						},
						"timeFormats": {
							"full": "h:mm:ss a zzzz",
							"long": "h:mm:ss a z",
							"medium": "h:mm:ss a",
							"short": "h:mm a"
						},
						"dateTimeFormats": {
							"full": "{1} {0}",
							"long": "{1} {0}",
							"medium": "{1} {0}",
							"short": "{1} {0}",
							"availableFormats": {
								"E": "ccc",
								"EHm": "E HH:mm",
								"EHms": "E HH:mm:ss",
								"Ed": "E، d",
								"Ehm": "E h:mm a",
								"Ehms": "E h:mm:ss a",
								"Gy": "y G",
								"GyMMM": "MMM y G",
								"GyMMMEd": "E، d MMM، y G",
								"GyMMMd": "d MMM، y G",
								"H": "HH",
								"Hm": "HH:mm",
								"Hms": "HH:mm:ss",
								"Hmsv": "HH:mm:ss v",
								"Hmv": "HH:mm v",
								"M": "L",
								"MEd": "E، d/M",
								"MMM": "LLL",
								"MMMEd": "E، d MMM",
								"MMMMEd": "E، d MMMM",
								"MMMMd": "d MMMM",
								"MMMd": "d MMM",
								"MMdd": "dd‏/MM",
								"Md": "d/‏M",
								"d": "d",
								"h": "h a",
								"hm": "h:mm a",
								"hms": "h:mm:ss a",
								"hmsv": "h:mm:ss a v",
								"hmv": "h:mm a v",
								"ms": "mm:ss",
								"y": "y",
								"yM": "M‏/y",
								"yMEd": "E، d/‏M/‏y",
								"yMM": "MM‏/y",
								"yMMM": "MMM y",
								"yMMMEd": "E، d MMM، y",
								"yMMMM": "MMMM y",
								"yMMMd": "d MMM، y",
								"yMd": "d‏/M‏/y",
								"yQQQ": "QQQ y",
								"yQQQQ": "QQQQ y"
							},
							"appendItems": {
								"Day": "{0} ({2}: {1})",
								"Day-Of-Week": "{0} {1}",
								"Era": "{1} {0}",
								"Hour": "{0} ({2}: {1})",
								"Minute": "{0} ({2}: {1})",
								"Month": "{0} ({2}: {1})",
								"Quarter": "{0} ({2}: {1})",
								"Second": "{0} ({2}: {1})",
								"Timezone": "{0} {1}",
								"Week": "{0} ({2}: {1})",
								"Year": "{1} {0}"
							},
							"intervalFormats": {
								"intervalFormatFallback": "{0} – {1}",
								"H": {
									"H": "HH–HH"
								},
								"Hm": {
									"H": "HH:mm–HH:mm",
									"m": "HH:mm–HH:mm"
								},
								"Hmv": {
									"H": "HH:mm–HH:mm v",
									"m": "HH:mm–HH:mm v"
								},
								"Hv": {
									"H": "HH–HH v"
								},
								"M": {
									"M": "M–M"
								},
								"MEd": {
									"M": "E، d/‏M – E، d/‏M",
									"d": "E، d/‏M –‏ E، d/‏M"
								},
								"MMM": {
									"M": "MMM–MMM"
								},
								"MMMEd": {
									"M": "E، d MMM – E، d MMM",
									"d": "E، d – E، d MMM"
								},
								"MMMM": {
									"M": "LLLL–LLLL"
								},
								"MMMd": {
									"M": "d MMM – d MMM",
									"d": "d–d MMM"
								},
								"Md": {
									"M": "M/d – M/d",
									"d": "M/d – M/d"
								},
								"d": {
									"d": "d–d"
								},
								"h": {
									"a": "h a – h a",
									"h": "h–h a"
								},
								"hm": {
									"a": "h:mm a – h:mm a",
									"h": "h:mm–h:mm a",
									"m": "h:mm–h:mm a"
								},
								"hmv": {
									"a": "h:mm a – h:mm a v",
									"h": "h:mm–h:mm a v",
									"m": "h:mm–h:mm a v"
								},
								"hv": {
									"a": "h a – h a v",
									"h": "h–h a v"
								},
								"y": {
									"y": "y–y"
								},
								"yM": {
									"M": "M‏/y – M‏/y",
									"y": "M‏/y – M‏/y"
								},
								"yMEd": {
									"M": "E، d‏/M‏/y – E، d‏/M‏/y",
									"d": "E، dd‏/MM‏/y – E، dd‏/MM‏/y",
									"y": "E، d‏/M‏/y – E، d‏/M‏/y"
								},
								"yMMM": {
									"M": "MMM – MMM، y",
									"y": "MMM، y – MMM، y"
								},
								"yMMMEd": {
									"M": "E، d MMM – E، d MMM، y",
									"d": "E، d – E، d MMM، y",
									"y": "E، d MMM، y – E، d MMM، y"
								},
								"yMMMM": {
									"M": "MMMM – MMMM، y",
									"y": "MMMM، y – MMMM، y"
								},
								"yMMMd": {
									"M": "d MMM – d MMM، y",
									"d": "d–d MMM، y",
									"y": "d MMM، y – d MMM، y"
								},
								"yMd": {
									"M": "d‏/M‏/y – d‏/M‏/y",
									"d": "d‏/M‏/y – d‏/M‏/y",
									"y": "d‏/M‏/y – d‏/M‏/y"
								}
							}
						}
					}
				}
			},
			"numbers": {
				"defaultNumberingSystem": "arab",
				"otherNumberingSystems": {
					"native": "arab"
				},
				"minimumGroupingDigits": "1",
				"symbols-numberSystem-arab": {
					"decimal": "٫",
					"group": "٬",
					"list": "؛",
					"percentSign": "٪",
					"plusSign": "‏+",
					"minusSign": "‏-",
					"exponential": "اس",
					"superscriptingExponent": "×",
					"perMille": "؉",
					"infinity": "∞",
					"nan": "ليس رقم",
					"timeSeparator": "،"
				},
				"symbols-numberSystem-latn": {
					"decimal": ".",
					"group": ",",
					"list": ";",
					"percentSign": "%",
					"plusSign": "‎+",
					"minusSign": "‎-",
					"exponential": "E",
					"superscriptingExponent": "×",
					"perMille": "‰",
					"infinity": "∞",
					"nan": "NaN",
					"timeSeparator": ":"
				},
				"decimalFormats-numberSystem-arab": {
					"standard": "#,##0.###",
					"long": {
						"decimalFormat": {
							"1000-count-zero": "0 ألف",
							"1000-count-one": "0 ألف",
							"1000-count-two": "0 ألف",
							"1000-count-few": "0 ألف",
							"1000-count-many": "0 ألف",
							"1000-count-other": "0 ألف",
							"10000-count-zero": "00 ألف",
							"10000-count-one": "00 ألف",
							"10000-count-two": "00 ألف",
							"10000-count-few": "00 ألف",
							"10000-count-many": "00 ألف",
							"10000-count-other": "00 ألف",
							"100000-count-zero": "000 ألف",
							"100000-count-one": "000 ألف",
							"100000-count-two": "000 ألف",
							"100000-count-few": "000 ألف",
							"100000-count-many": "000 ألف",
							"100000-count-other": "000 ألف",
							"1000000-count-zero": "0 مليون",
							"1000000-count-one": "0 مليون",
							"1000000-count-two": "0 مليون",
							"1000000-count-few": "0 مليون",
							"1000000-count-many": "0 مليون",
							"1000000-count-other": "0 مليون",
							"10000000-count-zero": "00 مليون",
							"10000000-count-one": "00 مليون",
							"10000000-count-two": "00 مليون",
							"10000000-count-few": "00 مليون",
							"10000000-count-many": "00 مليون",
							"10000000-count-other": "00 مليون",
							"100000000-count-zero": "000 مليون",
							"100000000-count-one": "000 مليون",
							"100000000-count-two": "000 مليون",
							"100000000-count-few": "000 مليون",
							"100000000-count-many": "000 مليون",
							"100000000-count-other": "000 مليون",
							"1000000000-count-zero": "0 بليون",
							"1000000000-count-one": "0 بليون",
							"1000000000-count-two": "0 بليون",
							"1000000000-count-few": "0 بليون",
							"1000000000-count-many": "0 بليون",
							"1000000000-count-other": "0 بليون",
							"10000000000-count-zero": "00 بليون",
							"10000000000-count-one": "00 بليون",
							"10000000000-count-two": "00 بليون",
							"10000000000-count-few": "00 بليون",
							"10000000000-count-many": "00 بليون",
							"10000000000-count-other": "00 بليون",
							"100000000000-count-zero": "000 بليون",
							"100000000000-count-one": "000 بليون",
							"100000000000-count-two": "000 بليون",
							"100000000000-count-few": "000 بليون",
							"100000000000-count-many": "000 بليون",
							"100000000000-count-other": "000 بليون",
							"1000000000000-count-zero": "0 تريليون",
							"1000000000000-count-one": "0 تريليون",
							"1000000000000-count-two": "0 تريليون",
							"1000000000000-count-few": "0 تريليون",
							"1000000000000-count-many": "0 تريليون",
							"1000000000000-count-other": "0 تريليون",
							"10000000000000-count-zero": "00 تريليون",
							"10000000000000-count-one": "00 تريليون",
							"10000000000000-count-two": "00 تريليون",
							"10000000000000-count-few": "00 تريليون",
							"10000000000000-count-many": "00 تريليون",
							"10000000000000-count-other": "00 تريليون",
							"100000000000000-count-zero": "000 تريليون",
							"100000000000000-count-one": "000 تريليون",
							"100000000000000-count-two": "000 تريليون",
							"100000000000000-count-few": "000 تريليون",
							"100000000000000-count-many": "000 تريليون",
							"100000000000000-count-other": "000 تريليون"
						}
					},
					"short": {
						"decimalFormat": {
							"1000-count-zero": "0 ألف",
							"1000-count-one": "0 ألف",
							"1000-count-two": "0 ألف",
							"1000-count-few": "0 ألف",
							"1000-count-many": "0 ألف",
							"1000-count-other": "0 ألف",
							"10000-count-zero": "00 ألف",
							"10000-count-one": "00 ألف",
							"10000-count-two": "00 ألف",
							"10000-count-few": "00 ألف",
							"10000-count-many": "00 ألف",
							"10000-count-other": "00 ألف",
							"100000-count-zero": "000 ألف",
							"100000-count-one": "000 ألف",
							"100000-count-two": "000 ألف",
							"100000-count-few": "000 ألف",
							"100000-count-many": "000 ألف",
							"100000-count-other": "000 ألف",
							"1000000-count-zero": "0 مليو",
							"1000000-count-one": "0 مليو",
							"1000000-count-two": "0 مليو",
							"1000000-count-few": "0 مليو",
							"1000000-count-many": "0 مليو",
							"1000000-count-other": "0 مليو",
							"10000000-count-zero": "00 مليو",
							"10000000-count-one": "00 مليو",
							"10000000-count-two": "00 مليو",
							"10000000-count-few": "00 مليو",
							"10000000-count-many": "00 مليو",
							"10000000-count-other": "00 مليو",
							"100000000-count-zero": "000 مليو",
							"100000000-count-one": "000 مليو",
							"100000000-count-two": "000 مليو",
							"100000000-count-few": "000 مليو",
							"100000000-count-many": "000 مليو",
							"100000000-count-other": "000 مليو",
							"1000000000-count-zero": "0 بليو",
							"1000000000-count-one": "0 بليو",
							"1000000000-count-two": "0 بليو",
							"1000000000-count-few": "0 بليو",
							"1000000000-count-many": "0 بليو",
							"1000000000-count-other": "0 بليو",
							"10000000000-count-zero": "00 بليو",
							"10000000000-count-one": "00 بليو",
							"10000000000-count-two": "00 بليو",
							"10000000000-count-few": "00 بليو",
							"10000000000-count-many": "00 بليو",
							"10000000000-count-other": "00 بليو",
							"100000000000-count-zero": "000 بليو",
							"100000000000-count-one": "000 بليو",
							"100000000000-count-two": "000 بليو",
							"100000000000-count-few": "000 بليو",
							"100000000000-count-many": "000 بليو",
							"100000000000-count-other": "000 بليو",
							"1000000000000-count-zero": "0 ترليو",
							"1000000000000-count-one": "0 ترليو",
							"1000000000000-count-two": "0 ترليو",
							"1000000000000-count-few": "0 ترليو",
							"1000000000000-count-many": "0 ترليو",
							"1000000000000-count-other": "0 ترليو",
							"10000000000000-count-zero": "00 ترليو",
							"10000000000000-count-one": "00 ترليو",
							"10000000000000-count-two": "00 ترليو",
							"10000000000000-count-few": "00 ترليو",
							"10000000000000-count-many": "00 ترليو",
							"10000000000000-count-other": "00 ترليو",
							"100000000000000-count-zero": "000 ترليو",
							"100000000000000-count-one": "000 ترليو",
							"100000000000000-count-two": "000 ترليو",
							"100000000000000-count-few": "000 ترليو",
							"100000000000000-count-many": "000 ترليو",
							"100000000000000-count-other": "000 ترليو"
						}
					}
				},
				"decimalFormats-numberSystem-latn": {
					"standard": "#,##0.###",
					"long": {
						"decimalFormat": {
							"1000-count-zero": "0 ألف",
							"1000-count-one": "0 ألف",
							"1000-count-two": "0 ألف",
							"1000-count-few": "0 آلاف",
							"1000-count-many": "0 ألف",
							"1000-count-other": "0 ألف",
							"10000-count-zero": "00 ألف",
							"10000-count-one": "00 ألف",
							"10000-count-two": "00 ألف",
							"10000-count-few": "00 ألف",
							"10000-count-many": "00 ألف",
							"10000-count-other": "00 ألف",
							"100000-count-zero": "000 ألف",
							"100000-count-one": "000 ألف",
							"100000-count-two": "000 ألف",
							"100000-count-few": "000 ألف",
							"100000-count-many": "000 ألف",
							"100000-count-other": "000 ألف",
							"1000000-count-zero": "0 مليون",
							"1000000-count-one": "0 مليون",
							"1000000-count-two": "0 مليون",
							"1000000-count-few": "0 ملايين",
							"1000000-count-many": "0 مليون",
							"1000000-count-other": "0 مليون",
							"10000000-count-zero": "00 مليون",
							"10000000-count-one": "00 مليون",
							"10000000-count-two": "00 مليون",
							"10000000-count-few": "00 ملايين",
							"10000000-count-many": "00 مليون",
							"10000000-count-other": "00 مليون",
							"100000000-count-zero": "000 مليون",
							"100000000-count-one": "000 مليون",
							"100000000-count-two": "000 مليون",
							"100000000-count-few": "000 مليون",
							"100000000-count-many": "000 مليون",
							"100000000-count-other": "000 مليون",
							"1000000000-count-zero": "0 بليون",
							"1000000000-count-one": "0 بليون",
							"1000000000-count-two": "0 بليون",
							"1000000000-count-few": "0 بلايين",
							"1000000000-count-many": "0 بليون",
							"1000000000-count-other": "0 بليون",
							"10000000000-count-zero": "00 بليون",
							"10000000000-count-one": "00 بليون",
							"10000000000-count-two": "00 بليون",
							"10000000000-count-few": "00 بليون",
							"10000000000-count-many": "00 بليون",
							"10000000000-count-other": "00 بليون",
							"100000000000-count-zero": "000 بليون",
							"100000000000-count-one": "000 بليون",
							"100000000000-count-two": "000 بليون",
							"100000000000-count-few": "000 بليون",
							"100000000000-count-many": "000 بليون",
							"100000000000-count-other": "000 بليون",
							"1000000000000-count-zero": "0 تريليون",
							"1000000000000-count-one": "0 تريليون",
							"1000000000000-count-two": "0 تريليون",
							"1000000000000-count-few": "0 تريليونات",
							"1000000000000-count-many": "0 تريليون",
							"1000000000000-count-other": "0 تريليون",
							"10000000000000-count-zero": "00 تريليون",
							"10000000000000-count-one": "00 تريليون",
							"10000000000000-count-two": "00 تريليون",
							"10000000000000-count-few": "00 تريليون",
							"10000000000000-count-many": "00 تريليون",
							"10000000000000-count-other": "00 تريليون",
							"100000000000000-count-zero": "000 تريليون",
							"100000000000000-count-one": "000 تريليون",
							"100000000000000-count-two": "000 تريليون",
							"100000000000000-count-few": "000 تريليون",
							"100000000000000-count-many": "000 تريليون",
							"100000000000000-count-other": "000 تريليون"
						}
					},
					"short": {
						"decimalFormat": {
							"1000-count-zero": "0 ألف",
							"1000-count-one": "0 ألف",
							"1000-count-two": "0 ألف",
							"1000-count-few": "0 آلاف",
							"1000-count-many": "0 ألف",
							"1000-count-other": "0 ألف",
							"10000-count-zero": "00 ألف",
							"10000-count-one": "00 ألف",
							"10000-count-two": "00 ألف",
							"10000-count-few": "00 ألف",
							"10000-count-many": "00 ألف",
							"10000-count-other": "00 ألف",
							"100000-count-zero": "000 ألف",
							"100000-count-one": "000 ألف",
							"100000-count-two": "000 ألف",
							"100000-count-few": "000 ألف",
							"100000-count-many": "000 ألف",
							"100000-count-other": "000 ألف",
							"1000000-count-zero": "0 مليو",
							"1000000-count-one": "0 مليو",
							"1000000-count-two": "0 مليو",
							"1000000-count-few": "0 مليو",
							"1000000-count-many": "0 مليو",
							"1000000-count-other": "0 مليو",
							"10000000-count-zero": "00 مليو",
							"10000000-count-one": "00 مليو",
							"10000000-count-two": "00 مليو",
							"10000000-count-few": "00 مليو",
							"10000000-count-many": "00 مليو",
							"10000000-count-other": "00 مليو",
							"100000000-count-zero": "000 مليو",
							"100000000-count-one": "000 مليو",
							"100000000-count-two": "000 مليو",
							"100000000-count-few": "000 مليو",
							"100000000-count-many": "000 مليو",
							"100000000-count-other": "000 مليو",
							"1000000000-count-zero": "0 بليو",
							"1000000000-count-one": "0 بليو",
							"1000000000-count-two": "0 بليو",
							"1000000000-count-few": "0 بليو",
							"1000000000-count-many": "0 بليو",
							"1000000000-count-other": "0 بليو",
							"10000000000-count-zero": "00 بليو",
							"10000000000-count-one": "00 بليو",
							"10000000000-count-two": "00 بليو",
							"10000000000-count-few": "00 بليو",
							"10000000000-count-many": "00 بليو",
							"10000000000-count-other": "00 بليو",
							"100000000000-count-zero": "000 بليو",
							"100000000000-count-one": "000 بليو",
							"100000000000-count-two": "000 بليو",
							"100000000000-count-few": "000 بليو",
							"100000000000-count-many": "000 بليو",
							"100000000000-count-other": "000 بليو",
							"1000000000000-count-zero": "0 ترليو",
							"1000000000000-count-one": "0 ترليو",
							"1000000000000-count-two": "0 ترليو",
							"1000000000000-count-few": "0 ترليو",
							"1000000000000-count-many": "0 ترليو",
							"1000000000000-count-other": "0 ترليو",
							"10000000000000-count-zero": "00 ترليو",
							"10000000000000-count-one": "00 ترليو",
							"10000000000000-count-two": "00 ترليو",
							"10000000000000-count-few": "00 ترليو",
							"10000000000000-count-many": "00 ترليو",
							"10000000000000-count-other": "00 ترليو",
							"100000000000000-count-zero": "000 ترليو",
							"100000000000000-count-one": "000 ترليو",
							"100000000000000-count-two": "000 ترليو",
							"100000000000000-count-few": "000 ترليو",
							"100000000000000-count-many": "000 ترليو",
							"100000000000000-count-other": "000 ترليو"
						}
					}
				},
				"scientificFormats-numberSystem-arab": {
					"standard": "#E0"
				},
				"scientificFormats-numberSystem-latn": {
					"standard": "#E0"
				},
				"percentFormats-numberSystem-arab": {
					"standard": "#,##0%"
				},
				"percentFormats-numberSystem-latn": {
					"standard": "#,##0%"
				},
				"currencyFormats-numberSystem-arab": {
					"currencySpacing": {
						"beforeCurrency": {
							"currencyMatch": "[:^S:]",
							"surroundingMatch": "[:digit:]",
							"insertBetween": " "
						},
						"afterCurrency": {
							"currencyMatch": "[:^S:]",
							"surroundingMatch": "[:digit:]",
							"insertBetween": " "
						}
					},
					"accounting": "¤#,##0.00;(¤#,##0.00)",
					"standard": "¤ #,##0.00",
					"unitPattern-count-zero": "{0} {1}",
					"unitPattern-count-one": "{0} {1}",
					"unitPattern-count-two": "{0} {1}",
					"unitPattern-count-few": "{0} {1}",
					"unitPattern-count-many": "{0} {1}",
					"unitPattern-count-other": "{0} {1}"
				},
				"currencyFormats-numberSystem-latn": {
					"currencySpacing": {
						"beforeCurrency": {
							"currencyMatch": "[:^S:]",
							"surroundingMatch": "[:digit:]",
							"insertBetween": " "
						},
						"afterCurrency": {
							"currencyMatch": "[:^S:]",
							"surroundingMatch": "[:digit:]",
							"insertBetween": " "
						}
					},
					"accounting": "¤#,##0.00;(¤#,##0.00)",
					"standard": "¤ #,##0.00",
					"unitPattern-count-zero": "{0} {1}",
					"unitPattern-count-one": "{0} {1}",
					"unitPattern-count-two": "{0} {1}",
					"unitPattern-count-few": "{0} {1}",
					"unitPattern-count-many": "{0} {1}",
					"unitPattern-count-other": "{0} {1}"
				},
				"miscPatterns-numberSystem-arab": {
					"atLeast": "+{0}",
					"range": "{0}–{1}"
				},
				"miscPatterns-numberSystem-latn": {
					"atLeast": "+{0}",
					"range": "{0}–{1}"
				}
			}
		}
	}
});

Globalize.load({
	"main": {
		"es": {
			"identity": {
				"version": {
					"_cldrVersion": "27.0.1",
					"_number": "$Revision: 11321 $"
				},
				"generation": {
					"_date": "$Date: 2015-02-26 14:20:05 -0600 (Thu, 26 Feb 2015) $"
				},
				"language": "es"
			},
			"dates": {
				"calendars": {
					"gregorian": {
						"months": {
							"format": {
								"abbreviated": {
									"1": "ene.",
									"2": "feb.",
									"3": "mar.",
									"4": "abr.",
									"5": "may.",
									"6": "jun.",
									"7": "jul.",
									"8": "ago.",
									"9": "sept.",
									"10": "oct.",
									"11": "nov.",
									"12": "dic."
								},
								"narrow": {
									"1": "E",
									"2": "F",
									"3": "M",
									"4": "A",
									"5": "M",
									"6": "J",
									"7": "J",
									"8": "A",
									"9": "S",
									"10": "O",
									"11": "N",
									"12": "D"
								},
								"wide": {
									"1": "enero",
									"2": "febrero",
									"3": "marzo",
									"4": "abril",
									"5": "mayo",
									"6": "junio",
									"7": "julio",
									"8": "agosto",
									"9": "septiembre",
									"10": "octubre",
									"11": "noviembre",
									"12": "diciembre"
								}
							},
							"stand-alone": {
								"abbreviated": {
									"1": "Ene.",
									"2": "Feb.",
									"3": "Mar.",
									"4": "Abr.",
									"5": "May.",
									"6": "Jun.",
									"7": "Jul.",
									"8": "Ago.",
									"9": "Sept.",
									"10": "Oct.",
									"11": "Nov.",
									"12": "Dic."
								},
								"narrow": {
									"1": "E",
									"2": "F",
									"3": "M",
									"4": "A",
									"5": "M",
									"6": "J",
									"7": "J",
									"8": "A",
									"9": "S",
									"10": "O",
									"11": "N",
									"12": "D"
								},
								"wide": {
									"1": "Enero",
									"2": "Febrero",
									"3": "Marzo",
									"4": "Abril",
									"5": "Mayo",
									"6": "Junio",
									"7": "Julio",
									"8": "Agosto",
									"9": "Septiembre",
									"10": "Octubre",
									"11": "Noviembre",
									"12": "Diciembre"
								}
							}
						},
						"days": {
							"format": {
								"abbreviated": {
									"sun": "dom.",
									"mon": "lun.",
									"tue": "mar.",
									"wed": "mié.",
									"thu": "jue.",
									"fri": "vie.",
									"sat": "sáb."
								},
								"narrow": {
									"sun": "D",
									"mon": "L",
									"tue": "M",
									"wed": "X",
									"thu": "J",
									"fri": "V",
									"sat": "S"
								},
								"short": {
									"sun": "DO",
									"mon": "LU",
									"tue": "MA",
									"wed": "MI",
									"thu": "JU",
									"fri": "VI",
									"sat": "SA"
								},
								"wide": {
									"sun": "domingo",
									"mon": "lunes",
									"tue": "martes",
									"wed": "miércoles",
									"thu": "jueves",
									"fri": "viernes",
									"sat": "sábado"
								}
							},
							"stand-alone": {
								"abbreviated": {
									"sun": "Dom.",
									"mon": "Lun.",
									"tue": "Mar.",
									"wed": "Mié.",
									"thu": "Jue.",
									"fri": "Vie.",
									"sat": "Sáb."
								},
								"narrow": {
									"sun": "D",
									"mon": "L",
									"tue": "M",
									"wed": "X",
									"thu": "J",
									"fri": "V",
									"sat": "S"
								},
								"short": {
									"sun": "DO",
									"mon": "LU",
									"tue": "MA",
									"wed": "MI",
									"thu": "JU",
									"fri": "VI",
									"sat": "SA"
								},
								"wide": {
									"sun": "Domingo",
									"mon": "Lunes",
									"tue": "Martes",
									"wed": "Miércoles",
									"thu": "Jueves",
									"fri": "Viernes",
									"sat": "Sábado"
								}
							}
						},
						"quarters": {
							"format": {
								"abbreviated": {
									"1": "T1",
									"2": "T2",
									"3": "T3",
									"4": "T4"
								},
								"narrow": {
									"1": "1",
									"2": "2",
									"3": "3",
									"4": "4"
								},
								"wide": {
									"1": "1.er trimestre",
									"2": "2.º trimestre",
									"3": "3.er trimestre",
									"4": "4.º trimestre"
								}
							},
							"stand-alone": {
								"abbreviated": {
									"1": "T1",
									"2": "T2",
									"3": "T3",
									"4": "T4"
								},
								"narrow": {
									"1": "1",
									"2": "2",
									"3": "3",
									"4": "4"
								},
								"wide": {
									"1": "1.er trimestre",
									"2": "2.º trimestre",
									"3": "3.er trimestre",
									"4": "4.º trimestre"
								}
							}
						},
						"dayPeriods": {
							"format": {
								"abbreviated": {
									"am": "a. m.",
									"noon": "mediodía",
									"pm": "p. m."
								},
								"narrow": {
									"am": "a.m.",
									"noon": "m.",
									"pm": "p.m."
								},
								"wide": {
									"am": "a. m.",
									"noon": "mediodía",
									"pm": "p. m."
								}
							},
							"stand-alone": {
								"abbreviated": {
									"am": "a. m.",
									"noon": "mediodía",
									"pm": "p. m."
								},
								"narrow": {
									"am": "a.m.",
									"noon": "m.",
									"pm": "p.m."
								},
								"wide": {
									"am": "a. m.",
									"noon": "mediodía",
									"pm": "p. m."
								}
							}
						},
						"eras": {
							"eraNames": {
								"0": "antes de Cristo",
								"0-alt-variant": "antes de la era común",
								"1": "después de Cristo",
								"1-alt-variant": "era común"
							},
							"eraAbbr": {
								"0": "a. C.",
								"0-alt-variant": "a. e. c.",
								"1": "d. C.",
								"1-alt-variant": "e. c."
							},
							"eraNarrow": {
								"0": "a. C.",
								"0-alt-variant": "a. e. c.",
								"1": "d. C.",
								"1-alt-variant": "e. c."
							}
						},
						"dateFormats": {
							"full": "EEEE, d 'de' MMMM 'de' y",
							"long": "d 'de' MMMM 'de' y",
							"medium": "d MMM y",
							"short": "d/M/yy"
						},
						"timeFormats": {
							"full": "H:mm:ss (zzzz)",
							"long": "H:mm:ss z",
							"medium": "H:mm:ss",
							"short": "H:mm"
						},
						"dateTimeFormats": {
							"full": "{1}, {0}",
							"long": "{1}, {0}",
							"medium": "{1} {0}",
							"short": "{1} {0}",
							"availableFormats": {
								"E": "ccc",
								"EHm": "E, H:mm",
								"EHms": "E, H:mm:ss",
								"Ed": "E d",
								"Ehm": "E, h:mm a",
								"Ehms": "E, h:mm:ss a",
								"Gy": "y G",
								"GyMMM": "MMM y G",
								"GyMMMEd": "E, d MMM y G",
								"GyMMMM": "MMMM 'de' y G",
								"GyMMMMEd": "E, d 'de' MMMM 'de' y G",
								"GyMMMMd": "d 'de' MMMM 'de' y G",
								"GyMMMd": "d MMM y G",
								"H": "H",
								"Hm": "H:mm",
								"Hms": "H:mm:ss",
								"Hmsv": "H:mm:ss v",
								"Hmsvvvv": "H:mm:ss (vvvv)",
								"Hmv": "H:mm v",
								"M": "L",
								"MEd": "E, d/M",
								"MMM": "LLL",
								"MMMEd": "E, d MMM",
								"MMMMEd": "E, d 'de' MMMM",
								"MMMMd": "d 'de' MMMM",
								"MMMd": "d MMM",
								"MMd": "d/M",
								"MMdd": "d/M",
								"Md": "d/M",
								"d": "d",
								"h": "h a",
								"hm": "h:mm a",
								"hms": "h:mm:ss a",
								"hmsv": "h:mm:ss a v",
								"hmsvvvv": "h:mm:ss a (vvvv)",
								"hmv": "h:mm a v",
								"ms": "mm:ss",
								"y": "y",
								"yM": "M/y",
								"yMEd": "EEE, d/M/y",
								"yMM": "M/y",
								"yMMM": "MMM y",
								"yMMMEd": "EEE, d MMM y",
								"yMMMM": "MMMM 'de' y",
								"yMMMMEd": "EEE, d 'de' MMMM 'de' y",
								"yMMMMd": "d 'de' MMMM 'de' y",
								"yMMMd": "d MMM y",
								"yMd": "d/M/y",
								"yQQQ": "QQQ y",
								"yQQQQ": "QQQQ 'de' y"
							},
							"appendItems": {
								"Day": "{0} ({2}: {1})",
								"Day-Of-Week": "{0} {1}",
								"Era": "{1} {0}",
								"Hour": "{0} ({2}: {1})",
								"Minute": "{0} ({2}: {1})",
								"Month": "{0} ({2}: {1})",
								"Quarter": "{0} ({2}: {1})",
								"Second": "{0} ({2}: {1})",
								"Timezone": "{0} {1}",
								"Week": "{0} ({2}: {1})",
								"Year": "{1} {0}"
							},
							"intervalFormats": {
								"intervalFormatFallback": "{0}–{1}",
								"H": {
									"H": "H–H"
								},
								"Hm": {
									"H": "H:mm–H:mm",
									"m": "H:mm–H:mm"
								},
								"Hmv": {
									"H": "H:mm–H:mm v",
									"m": "H:mm–H:mm v"
								},
								"Hv": {
									"H": "H–H v"
								},
								"M": {
									"M": "M–M"
								},
								"MEd": {
									"M": "E, d/M–E, d/M",
									"d": "E, d/M–E, d/M"
								},
								"MMM": {
									"M": "MMM–MMM"
								},
								"MMMEd": {
									"M": "E, d MMM–E, d MMM",
									"d": "E, d MMM–E, d MMM"
								},
								"MMMMEd": {
									"M": "E, d 'de' MMMM–E, d 'de' MMMM",
									"d": "E, d 'de' MMMM–E, d 'de' MMMM"
								},
								"MMMMd": {
									"M": "d 'de' MMMM–d 'de' MMMM",
									"d": "d–d 'de' MMMM"
								},
								"MMMd": {
									"M": "d MMM–d MMM",
									"d": "d–d MMM"
								},
								"Md": {
									"M": "d/M–d/M",
									"d": "d/M–d/M"
								},
								"d": {
									"d": "d–d"
								},
								"h": {
									"a": "h a–h a",
									"h": "h–h a"
								},
								"hm": {
									"a": "h:mm a – h:mm a",
									"h": "h:mm – h:mm a",
									"m": "h:mm – h:mm a"
								},
								"hmv": {
									"a": "h:mm a–h:mm a v",
									"h": "h:mm–h:mm a v",
									"m": "h:mm–h:mm a v"
								},
								"hv": {
									"a": "h a–h a v",
									"h": "h–h a v"
								},
								"y": {
									"y": "y–y"
								},
								"yM": {
									"M": "M/y–M/y",
									"y": "M/y–M/y"
								},
								"yMEd": {
									"M": "E, d/M/y–E, d/M/y",
									"d": "E, d/M/y–E, d/M/y",
									"y": "E, d/M/y–E, d/M/y"
								},
								"yMMM": {
									"M": "MMM–MMM y",
									"y": "MMM y–MMM y"
								},
								"yMMMEd": {
									"M": "E, d MMM–E, d MMM y",
									"d": "E, d MMM–E, d MMM y",
									"y": "E, d MMM y–E, d MMM y"
								},
								"yMMMM": {
									"M": "MMMM–MMMM 'de' y",
									"y": "MMMM 'de' y–MMMM 'de' y"
								},
								"yMMMMEd": {
									"M": "E, d 'de' MMMM–E, d 'de' MMMM 'de' y",
									"d": "E, d 'de' MMMM–E, d 'de' MMMM 'de' y",
									"y": "E, d 'de' MMMM 'de' y–E, d 'de' MMMM 'de' y"
								},
								"yMMMMd": {
									"M": "d 'de' MMMM–d 'de' MMMM 'de' y",
									"d": "d–d 'de' MMMM 'de' y",
									"y": "d 'de' MMMM 'de' y–d 'de' MMMM 'de' y"
								},
								"yMMMd": {
									"M": "d MMM–d MMM y",
									"d": "d–d MMM y",
									"y": "d MMM y–d MMM y"
								},
								"yMd": {
									"M": "d/M/y–d/M/y",
									"d": "d/M/y–d/M/y",
									"y": "d/M/y–d/M/y"
								}
							}
						}
					}
				}
			},
			"numbers": {
				"defaultNumberingSystem": "latn",
				"otherNumberingSystems": {
					"native": "latn"
				},
				"minimumGroupingDigits": "1",
				"symbols-numberSystem-latn": {
					"decimal": ",",
					"group": ".",
					"list": ";",
					"percentSign": "%",
					"plusSign": "+",
					"minusSign": "-",
					"exponential": "E",
					"superscriptingExponent": "×",
					"perMille": "‰",
					"infinity": "∞",
					"nan": "NaN",
					"timeSeparator": ":"
				},
				"decimalFormats-numberSystem-latn": {
					"standard": "#,##0.###",
					"long": {
						"decimalFormat": {
							"1000-count-one": "0 mil",
							"1000-count-other": "0 mil",
							"10000-count-one": "00 mil",
							"10000-count-other": "00 mil",
							"100000-count-one": "000 mil",
							"100000-count-other": "000 mil",
							"1000000-count-one": "0 millón",
							"1000000-count-other": "0 millones",
							"10000000-count-one": "00 millones",
							"10000000-count-other": "00 millones",
							"100000000-count-one": "000 millones",
							"100000000-count-other": "000 millones",
							"1000000000-count-one": "0 mil millones",
							"1000000000-count-other": "0 mil millones",
							"10000000000-count-one": "00 mil millones",
							"10000000000-count-other": "00 mil millones",
							"100000000000-count-one": "000 mil millones",
							"100000000000-count-other": "000 mil millones",
							"1000000000000-count-one": "0 billón",
							"1000000000000-count-other": "0 billones",
							"10000000000000-count-one": "00 billones",
							"10000000000000-count-other": "00 billones",
							"100000000000000-count-one": "000 billones",
							"100000000000000-count-other": "000 billones"
						}
					},
					"short": {
						"decimalFormat": {
							"1000-count-one": "0 K",
							"1000-count-other": "0 K",
							"10000-count-one": "00 K",
							"10000-count-other": "00 K",
							"100000-count-one": "000 K",
							"100000-count-other": "000 K",
							"1000000-count-one": "0 M",
							"1000000-count-other": "0 M",
							"10000000-count-one": "00 M",
							"10000000-count-other": "00 M",
							"100000000-count-one": "000 M",
							"100000000-count-other": "000 M",
							"1000000000-count-one": "0000 M",
							"1000000000-count-other": "0000 M",
							"10000000000-count-one": "00 MRD",
							"10000000000-count-other": "00 MRD",
							"100000000000-count-one": "000 MRD",
							"100000000000-count-other": "000 MRD",
							"1000000000000-count-one": "0 B",
							"1000000000000-count-other": "0 B",
							"10000000000000-count-one": "00 B",
							"10000000000000-count-other": "00 B",
							"100000000000000-count-one": "000 B",
							"100000000000000-count-other": "000 B"
						}
					}
				},
				"scientificFormats-numberSystem-latn": {
					"standard": "#E0"
				},
				"percentFormats-numberSystem-latn": {
					"standard": "#,##0 %"
				},
				"currencyFormats-numberSystem-latn": {
					"currencySpacing": {
						"beforeCurrency": {
							"currencyMatch": "[:^S:]",
							"surroundingMatch": "[:digit:]",
							"insertBetween": " "
						},
						"afterCurrency": {
							"currencyMatch": "[:^S:]",
							"surroundingMatch": "[:digit:]",
							"insertBetween": " "
						}
					},
					"accounting": "#,##0.00 ¤",
					"standard": "#,##0.00 ¤",
					"unitPattern-count-one": "{0} {1}",
					"unitPattern-count-other": "{0} {1}"
				},
				"miscPatterns-numberSystem-latn": {
					"atLeast": "Más de {0}",
					"range": "{0}-{1}"
				}
			}
		}
	}
});

Globalize.load({
	"main": {
		"en": {
			"identity": {
				"version": {
					"_cldrVersion": "27.0.1",
					"_number": "$Revision: 11348 $"
				},
				"generation": {
					"_date": "$Date: 2015-03-05 01:15:52 -0600 (Thu, 05 Mar 2015) $"
				},
				"language": "en"
			},
			"numbers": {
				"defaultNumberingSystem": "latn",
				"otherNumberingSystems": {
					"native": "latn"
				},
				"minimumGroupingDigits": "1",
				"symbols-numberSystem-latn": {
					"decimal": ".",
					"group": ",",
					"list": ";",
					"percentSign": "%",
					"plusSign": "+",
					"minusSign": "-",
					"exponential": "E",
					"superscriptingExponent": "×",
					"perMille": "‰",
					"infinity": "∞",
					"nan": "NaN",
					"timeSeparator": ":"
				},
				"decimalFormats-numberSystem-latn": {
					"standard": "#,##0.###",
					"long": {
						"decimalFormat": {
							"1000-count-one": "0 thousand",
							"1000-count-other": "0 thousand",
							"10000-count-one": "00 thousand",
							"10000-count-other": "00 thousand",
							"100000-count-one": "000 thousand",
							"100000-count-other": "000 thousand",
							"1000000-count-one": "0 million",
							"1000000-count-other": "0 million",
							"10000000-count-one": "00 million",
							"10000000-count-other": "00 million",
							"100000000-count-one": "000 million",
							"100000000-count-other": "000 million",
							"1000000000-count-one": "0 billion",
							"1000000000-count-other": "0 billion",
							"10000000000-count-one": "00 billion",
							"10000000000-count-other": "00 billion",
							"100000000000-count-one": "000 billion",
							"100000000000-count-other": "000 billion",
							"1000000000000-count-one": "0 trillion",
							"1000000000000-count-other": "0 trillion",
							"10000000000000-count-one": "00 trillion",
							"10000000000000-count-other": "00 trillion",
							"100000000000000-count-one": "000 trillion",
							"100000000000000-count-other": "000 trillion"
						}
					},
					"short": {
						"decimalFormat": {
							"1000-count-one": "0K",
							"1000-count-other": "0K",
							"10000-count-one": "00K",
							"10000-count-other": "00K",
							"100000-count-one": "000K",
							"100000-count-other": "000K",
							"1000000-count-one": "0M",
							"1000000-count-other": "0M",
							"10000000-count-one": "00M",
							"10000000-count-other": "00M",
							"100000000-count-one": "000M",
							"100000000-count-other": "000M",
							"1000000000-count-one": "0B",
							"1000000000-count-other": "0B",
							"10000000000-count-one": "00B",
							"10000000000-count-other": "00B",
							"100000000000-count-one": "000B",
							"100000000000-count-other": "000B",
							"1000000000000-count-one": "0T",
							"1000000000000-count-other": "0T",
							"10000000000000-count-one": "00T",
							"10000000000000-count-other": "00T",
							"100000000000000-count-one": "000T",
							"100000000000000-count-other": "000T"
						}
					}
				},
				"scientificFormats-numberSystem-latn": {
					"standard": "#E0"
				},
				"percentFormats-numberSystem-latn": {
					"standard": "#,##0%"
				},
				"currencyFormats-numberSystem-latn": {
					"currencySpacing": {
						"beforeCurrency": {
							"currencyMatch": "[:^S:]",
							"surroundingMatch": "[:digit:]",
							"insertBetween": " "
						},
						"afterCurrency": {
							"currencyMatch": "[:^S:]",
							"surroundingMatch": "[:digit:]",
							"insertBetween": " "
						}
					},
					"accounting": "¤#,##0.00;(¤#,##0.00)",
					"standard": "¤#,##0.00",
					"unitPattern-count-one": "{0} {1}",
					"unitPattern-count-other": "{0} {1}"
				},
				"miscPatterns-numberSystem-latn": {
					"atLeast": "{0}+",
					"range": "{0}–{1}"
				}
			},
			"dates": {
				"calendars": {
					"gregorian": {
						"months": {
							"format": {
								"abbreviated": {
									"1": "Jan",
									"2": "Feb",
									"3": "Mar",
									"4": "Apr",
									"5": "May",
									"6": "Jun",
									"7": "Jul",
									"8": "Aug",
									"9": "Sep",
									"10": "Oct",
									"11": "Nov",
									"12": "Dec"
								},
								"narrow": {
									"1": "J",
									"2": "F",
									"3": "M",
									"4": "A",
									"5": "M",
									"6": "J",
									"7": "J",
									"8": "A",
									"9": "S",
									"10": "O",
									"11": "N",
									"12": "D"
								},
								"wide": {
									"1": "January",
									"2": "February",
									"3": "March",
									"4": "April",
									"5": "May",
									"6": "June",
									"7": "July",
									"8": "August",
									"9": "September",
									"10": "October",
									"11": "November",
									"12": "December"
								}
							},
							"stand-alone": {
								"abbreviated": {
									"1": "Jan",
									"2": "Feb",
									"3": "Mar",
									"4": "Apr",
									"5": "May",
									"6": "Jun",
									"7": "Jul",
									"8": "Aug",
									"9": "Sep",
									"10": "Oct",
									"11": "Nov",
									"12": "Dec"
								},
								"narrow": {
									"1": "J",
									"2": "F",
									"3": "M",
									"4": "A",
									"5": "M",
									"6": "J",
									"7": "J",
									"8": "A",
									"9": "S",
									"10": "O",
									"11": "N",
									"12": "D"
								},
								"wide": {
									"1": "January",
									"2": "February",
									"3": "March",
									"4": "April",
									"5": "May",
									"6": "June",
									"7": "July",
									"8": "August",
									"9": "September",
									"10": "October",
									"11": "November",
									"12": "December"
								}
							}
						},
						"days": {
							"format": {
								"abbreviated": {
									"sun": "Sun",
									"mon": "Mon",
									"tue": "Tue",
									"wed": "Wed",
									"thu": "Thu",
									"fri": "Fri",
									"sat": "Sat"
								},
								"narrow": {
									"sun": "S",
									"mon": "M",
									"tue": "T",
									"wed": "W",
									"thu": "T",
									"fri": "F",
									"sat": "S"
								},
								"short": {
									"sun": "Su",
									"mon": "Mo",
									"tue": "Tu",
									"wed": "We",
									"thu": "Th",
									"fri": "Fr",
									"sat": "Sa"
								},
								"wide": {
									"sun": "Sunday",
									"mon": "Monday",
									"tue": "Tuesday",
									"wed": "Wednesday",
									"thu": "Thursday",
									"fri": "Friday",
									"sat": "Saturday"
								}
							},
							"stand-alone": {
								"abbreviated": {
									"sun": "Sun",
									"mon": "Mon",
									"tue": "Tue",
									"wed": "Wed",
									"thu": "Thu",
									"fri": "Fri",
									"sat": "Sat"
								},
								"narrow": {
									"sun": "S",
									"mon": "M",
									"tue": "T",
									"wed": "W",
									"thu": "T",
									"fri": "F",
									"sat": "S"
								},
								"short": {
									"sun": "Su",
									"mon": "Mo",
									"tue": "Tu",
									"wed": "We",
									"thu": "Th",
									"fri": "Fr",
									"sat": "Sa"
								},
								"wide": {
									"sun": "Sunday",
									"mon": "Monday",
									"tue": "Tuesday",
									"wed": "Wednesday",
									"thu": "Thursday",
									"fri": "Friday",
									"sat": "Saturday"
								}
							}
						},
						"quarters": {
							"format": {
								"abbreviated": {
									"1": "Q1",
									"2": "Q2",
									"3": "Q3",
									"4": "Q4"
								},
								"narrow": {
									"1": "1",
									"2": "2",
									"3": "3",
									"4": "4"
								},
								"wide": {
									"1": "1st quarter",
									"2": "2nd quarter",
									"3": "3rd quarter",
									"4": "4th quarter"
								}
							},
							"stand-alone": {
								"abbreviated": {
									"1": "Q1",
									"2": "Q2",
									"3": "Q3",
									"4": "Q4"
								},
								"narrow": {
									"1": "1",
									"2": "2",
									"3": "3",
									"4": "4"
								},
								"wide": {
									"1": "1st quarter",
									"2": "2nd quarter",
									"3": "3rd quarter",
									"4": "4th quarter"
								}
							}
						},
						"dayPeriods": {
							"format": {
								"abbreviated": {
									"am": "AM",
									"am-alt-variant": "am",
									"noon": "noon",
									"pm": "PM",
									"pm-alt-variant": "pm"
								},
								"narrow": {
									"am": "a",
									"noon": "n",
									"pm": "p"
								},
								"wide": {
									"am": "AM",
									"am-alt-variant": "am",
									"noon": "noon",
									"pm": "PM",
									"pm-alt-variant": "pm"
								}
							},
							"stand-alone": {
								"abbreviated": {
									"am": "AM",
									"am-alt-variant": "am",
									"noon": "noon",
									"pm": "PM",
									"pm-alt-variant": "pm"
								},
								"narrow": {
									"am": "a",
									"noon": "n",
									"pm": "p"
								},
								"wide": {
									"am": "AM",
									"am-alt-variant": "am",
									"noon": "noon",
									"pm": "PM",
									"pm-alt-variant": "pm"
								}
							}
						},
						"eras": {
							"eraNames": {
								"0": "Before Christ",
								"0-alt-variant": "Before Common Era",
								"1": "Anno Domini",
								"1-alt-variant": "Common Era"
							},
							"eraAbbr": {
								"0": "BC",
								"0-alt-variant": "BCE",
								"1": "AD",
								"1-alt-variant": "CE"
							},
							"eraNarrow": {
								"0": "B",
								"0-alt-variant": "BCE",
								"1": "A",
								"1-alt-variant": "CE"
							}
						},
						"dateFormats": {
							"full": "EEEE, MMMM d, y",
							"long": "MMMM d, y",
							"medium": "MMM d, y",
							"short": "M/d/yy"
						},
						"timeFormats": {
							"full": "h:mm:ss a zzzz",
							"long": "h:mm:ss a z",
							"medium": "h:mm:ss a",
							"short": "h:mm a"
						},
						"dateTimeFormats": {
							"full": "{1} 'at' {0}",
							"long": "{1} 'at' {0}",
							"medium": "{1}, {0}",
							"short": "{1}, {0}",
							"availableFormats": {
								"E": "ccc",
								"EHm": "E HH:mm",
								"EHms": "E HH:mm:ss",
								"Ed": "d E",
								"Ehm": "E h:mm a",
								"Ehms": "E h:mm:ss a",
								"Gy": "y G",
								"GyMMM": "MMM y G",
								"GyMMMEd": "E, MMM d, y G",
								"GyMMMd": "MMM d, y G",
								"H": "HH",
								"Hm": "HH:mm",
								"Hms": "HH:mm:ss",
								"Hmsv": "HH:mm:ss v",
								"Hmv": "HH:mm v",
								"M": "L",
								"MEd": "E, M/d",
								"MMM": "LLL",
								"MMMEd": "E, MMM d",
								"MMMd": "MMM d",
								"Md": "M/d",
								"d": "d",
								"h": "h a",
								"hm": "h:mm a",
								"hms": "h:mm:ss a",
								"hmsv": "h:mm:ss a v",
								"hmv": "h:mm a v",
								"ms": "mm:ss",
								"y": "y",
								"yM": "M/y",
								"yMEd": "E, M/d/y",
								"yMMM": "MMM y",
								"yMMMEd": "E, MMM d, y",
								"yMMMd": "MMM d, y",
								"yMd": "M/d/y",
								"yQQQ": "QQQ y",
								"yQQQQ": "QQQQ y"
							},
							"appendItems": {
								"Day": "{0} ({2}: {1})",
								"Day-Of-Week": "{0} {1}",
								"Era": "{0} {1}",
								"Hour": "{0} ({2}: {1})",
								"Minute": "{0} ({2}: {1})",
								"Month": "{0} ({2}: {1})",
								"Quarter": "{0} ({2}: {1})",
								"Second": "{0} ({2}: {1})",
								"Timezone": "{0} {1}",
								"Week": "{0} ({2}: {1})",
								"Year": "{0} {1}"
							},
							"intervalFormats": {
								"intervalFormatFallback": "{0} – {1}",
								"H": {
									"H": "HH – HH"
								},
								"Hm": {
									"H": "HH:mm – HH:mm",
									"m": "HH:mm – HH:mm"
								},
								"Hmv": {
									"H": "HH:mm – HH:mm v",
									"m": "HH:mm – HH:mm v"
								},
								"Hv": {
									"H": "HH – HH v"
								},
								"M": {
									"M": "M – M"
								},
								"MEd": {
									"M": "E, M/d – E, M/d",
									"d": "E, M/d – E, M/d"
								},
								"MMM": {
									"M": "MMM – MMM"
								},
								"MMMEd": {
									"M": "E, MMM d – E, MMM d",
									"d": "E, MMM d – E, MMM d"
								},
								"MMMd": {
									"M": "MMM d – MMM d",
									"d": "MMM d – d"
								},
								"Md": {
									"M": "M/d – M/d",
									"d": "M/d – M/d"
								},
								"d": {
									"d": "d – d"
								},
								"h": {
									"a": "h a – h a",
									"h": "h – h a"
								},
								"hm": {
									"a": "h:mm a – h:mm a",
									"h": "h:mm – h:mm a",
									"m": "h:mm – h:mm a"
								},
								"hmv": {
									"a": "h:mm a – h:mm a v",
									"h": "h:mm – h:mm a v",
									"m": "h:mm – h:mm a v"
								},
								"hv": {
									"a": "h a – h a v",
									"h": "h – h a v"
								},
								"y": {
									"y": "y – y"
								},
								"yM": {
									"M": "M/y – M/y",
									"y": "M/y – M/y"
								},
								"yMEd": {
									"M": "E, M/d/y – E, M/d/y",
									"d": "E, M/d/y – E, M/d/y",
									"y": "E, M/d/y – E, M/d/y"
								},
								"yMMM": {
									"M": "MMM – MMM y",
									"y": "MMM y – MMM y"
								},
								"yMMMEd": {
									"M": "E, MMM d – E, MMM d, y",
									"d": "E, MMM d – E, MMM d, y",
									"y": "E, MMM d, y – E, MMM d, y"
								},
								"yMMMM": {
									"M": "MMMM – MMMM y",
									"y": "MMMM y – MMMM y"
								},
								"yMMMd": {
									"M": "MMM d – MMM d, y",
									"d": "MMM d – d, y",
									"y": "MMM d, y – MMM d, y"
								},
								"yMd": {
									"M": "M/d/y – M/d/y",
									"d": "M/d/y – M/d/y",
									"y": "M/d/y – M/d/y"
								}
							}
						}
					}
				}
			}
		}
	}
});

Globalize.load({
	"main": {
		"de": {
			"identity": {
				"version": {
					"_cldrVersion": "27.0.1",
					"_number": "$Revision: 11304 $"
				},
				"generation": {
					"_date": "$Date: 2015-02-24 11:35:18 -0600 (Tue, 24 Feb 2015) $"
				},
				"language": "de"
			},
			"dates": {
				"calendars": {
					"gregorian": {
						"months": {
							"format": {
								"abbreviated": {
									"1": "Jan.",
									"2": "Feb.",
									"3": "März",
									"4": "Apr.",
									"5": "Mai",
									"6": "Juni",
									"7": "Juli",
									"8": "Aug.",
									"9": "Sep.",
									"10": "Okt.",
									"11": "Nov.",
									"12": "Dez."
								},
								"narrow": {
									"1": "J",
									"2": "F",
									"3": "M",
									"4": "A",
									"5": "M",
									"6": "J",
									"7": "J",
									"8": "A",
									"9": "S",
									"10": "O",
									"11": "N",
									"12": "D"
								},
								"wide": {
									"1": "Januar",
									"2": "Februar",
									"3": "März",
									"4": "April",
									"5": "Mai",
									"6": "Juni",
									"7": "Juli",
									"8": "August",
									"9": "September",
									"10": "Oktober",
									"11": "November",
									"12": "Dezember"
								}
							},
							"stand-alone": {
								"abbreviated": {
									"1": "Jan",
									"2": "Feb",
									"3": "Mär",
									"4": "Apr",
									"5": "Mai",
									"6": "Jun",
									"7": "Jul",
									"8": "Aug",
									"9": "Sep",
									"10": "Okt",
									"11": "Nov",
									"12": "Dez"
								},
								"narrow": {
									"1": "J",
									"2": "F",
									"3": "M",
									"4": "A",
									"5": "M",
									"6": "J",
									"7": "J",
									"8": "A",
									"9": "S",
									"10": "O",
									"11": "N",
									"12": "D"
								},
								"wide": {
									"1": "Januar",
									"2": "Februar",
									"3": "März",
									"4": "April",
									"5": "Mai",
									"6": "Juni",
									"7": "Juli",
									"8": "August",
									"9": "September",
									"10": "Oktober",
									"11": "November",
									"12": "Dezember"
								}
							}
						},
						"days": {
							"format": {
								"abbreviated": {
									"sun": "So.",
									"mon": "Mo.",
									"tue": "Di.",
									"wed": "Mi.",
									"thu": "Do.",
									"fri": "Fr.",
									"sat": "Sa."
								},
								"narrow": {
									"sun": "S",
									"mon": "M",
									"tue": "D",
									"wed": "M",
									"thu": "D",
									"fri": "F",
									"sat": "S"
								},
								"short": {
									"sun": "So.",
									"mon": "Mo.",
									"tue": "Di.",
									"wed": "Mi.",
									"thu": "Do.",
									"fri": "Fr.",
									"sat": "Sa."
								},
								"wide": {
									"sun": "Sonntag",
									"mon": "Montag",
									"tue": "Dienstag",
									"wed": "Mittwoch",
									"thu": "Donnerstag",
									"fri": "Freitag",
									"sat": "Samstag"
								}
							},
							"stand-alone": {
								"abbreviated": {
									"sun": "So",
									"mon": "Mo",
									"tue": "Di",
									"wed": "Mi",
									"thu": "Do",
									"fri": "Fr",
									"sat": "Sa"
								},
								"narrow": {
									"sun": "S",
									"mon": "M",
									"tue": "D",
									"wed": "M",
									"thu": "D",
									"fri": "F",
									"sat": "S"
								},
								"short": {
									"sun": "So.",
									"mon": "Mo.",
									"tue": "Di.",
									"wed": "Mi.",
									"thu": "Do.",
									"fri": "Fr.",
									"sat": "Sa."
								},
								"wide": {
									"sun": "Sonntag",
									"mon": "Montag",
									"tue": "Dienstag",
									"wed": "Mittwoch",
									"thu": "Donnerstag",
									"fri": "Freitag",
									"sat": "Samstag"
								}
							}
						},
						"quarters": {
							"format": {
								"abbreviated": {
									"1": "Q1",
									"2": "Q2",
									"3": "Q3",
									"4": "Q4"
								},
								"narrow": {
									"1": "1",
									"2": "2",
									"3": "3",
									"4": "4"
								},
								"wide": {
									"1": "1. Quartal",
									"2": "2. Quartal",
									"3": "3. Quartal",
									"4": "4. Quartal"
								}
							},
							"stand-alone": {
								"abbreviated": {
									"1": "Q1",
									"2": "Q2",
									"3": "Q3",
									"4": "Q4"
								},
								"narrow": {
									"1": "1",
									"2": "2",
									"3": "3",
									"4": "4"
								},
								"wide": {
									"1": "1. Quartal",
									"2": "2. Quartal",
									"3": "3. Quartal",
									"4": "4. Quartal"
								}
							}
						},
						"dayPeriods": {
							"format": {
								"abbreviated": {
									"afternoon": "nachmittags",
									"am": "vorm.",
									"earlyMorning": "morgens",
									"evening": "abends",
									"morning": "vormittags",
									"night": "nachts",
									"noon": "mittags",
									"pm": "nachm."
								},
								"narrow": {
									"am": "vm.",
									"noon": "m.",
									"pm": "nm."
								},
								"wide": {
									"afternoon": "nachmittags",
									"am": "vorm.",
									"earlyMorning": "morgens",
									"evening": "abends",
									"morning": "vormittags",
									"night": "nachts",
									"noon": "mittags",
									"pm": "nachm."
								}
							},
							"stand-alone": {
								"abbreviated": {
									"afternoon": "nachmittags",
									"am": "vorm.",
									"earlyMorning": "morgens",
									"evening": "abends",
									"morning": "vormittags",
									"night": "nachts",
									"noon": "mittags",
									"pm": "nachm."
								},
								"narrow": {
									"am": "vm.",
									"noon": "m.",
									"pm": "nm."
								},
								"wide": {
									"afternoon": "nachmittags",
									"am": "vorm.",
									"earlyMorning": "morgens",
									"evening": "abends",
									"morning": "vormittags",
									"night": "nachts",
									"noon": "mittags",
									"pm": "nachm."
								}
							}
						},
						"eras": {
							"eraNames": {
								"0": "v. Chr.",
								"0-alt-variant": "vor unserer Zeitrechnung",
								"1": "n. Chr.",
								"1-alt-variant": "unserer Zeitrechnung"
							},
							"eraAbbr": {
								"0": "v. Chr.",
								"0-alt-variant": "v. u. Z.",
								"1": "n. Chr.",
								"1-alt-variant": "u. Z."
							},
							"eraNarrow": {
								"0": "v. Chr.",
								"0-alt-variant": "v. u. Z.",
								"1": "n. Chr.",
								"1-alt-variant": "u. Z."
							}
						},
						"dateFormats": {
							"full": "EEEE, d. MMMM y",
							"long": "d. MMMM y",
							"medium": "dd.MM.y",
							"short": "dd.MM.yy"
						},
						"timeFormats": {
							"full": "HH:mm:ss zzzz",
							"long": "HH:mm:ss z",
							"medium": "HH:mm:ss",
							"short": "HH:mm"
						},
						"dateTimeFormats": {
							"full": "{1} 'um' {0}",
							"long": "{1} 'um' {0}",
							"medium": "{1}, {0}",
							"short": "{1}, {0}",
							"availableFormats": {
								"E": "ccc",
								"EHm": "E, HH:mm",
								"EHms": "E, HH:mm:ss",
								"Ed": "E, d.",
								"Ehm": "E h:mm a",
								"Ehms": "E, h:mm:ss a",
								"Gy": "y G",
								"GyMMM": "MMM y G",
								"GyMMMEd": "E, d. MMM y G",
								"GyMMMd": "d. MMM y G",
								"H": "HH 'Uhr'",
								"Hm": "HH:mm",
								"Hms": "HH:mm:ss",
								"Hmsv": "HH:mm:ss v",
								"Hmv": "HH:mm v",
								"M": "L",
								"MEd": "E, d.M.",
								"MMM": "LLL",
								"MMMEd": "E, d. MMM",
								"MMMMEd": "E, d. MMMM",
								"MMMd": "d. MMM",
								"MMd": "d.MM.",
								"MMdd": "dd.MM.",
								"Md": "d.M.",
								"d": "d",
								"h": "h a",
								"hm": "h:mm a",
								"hms": "h:mm:ss a",
								"hmsv": "h:mm:ss a v",
								"hmv": "h:mm a v",
								"ms": "mm:ss",
								"y": "y",
								"yM": "M.y",
								"yMEd": "E, d.M.y",
								"yMM": "MM.y",
								"yMMM": "MMM y",
								"yMMMEd": "E, d. MMM y",
								"yMMMM": "MMMM y",
								"yMMMd": "d. MMM y",
								"yMMdd": "dd.MM.y",
								"yMd": "d.M.y",
								"yQQQ": "QQQ y",
								"yQQQQ": "QQQQ y"
							},
							"appendItems": {
								"Day": "{0} ({2}: {1})",
								"Day-Of-Week": "{0} {1}",
								"Era": "{1} {0}",
								"Hour": "{0} ({2}: {1})",
								"Minute": "{0} ({2}: {1})",
								"Month": "{0} ({2}: {1})",
								"Quarter": "{0} ({2}: {1})",
								"Second": "{0} ({2}: {1})",
								"Timezone": "{0} {1}",
								"Week": "{0} ({2}: {1})",
								"Year": "{1} {0}"
							},
							"intervalFormats": {
								"intervalFormatFallback": "{0} – {1}",
								"H": {
									"H": "HH–HH 'Uhr'"
								},
								"Hm": {
									"H": "HH:mm–HH:mm",
									"m": "HH:mm–HH:mm"
								},
								"Hmv": {
									"H": "HH:mm–HH:mm v",
									"m": "HH:mm–HH:mm v"
								},
								"Hv": {
									"H": "HH–HH 'Uhr' v"
								},
								"M": {
									"M": "M.–M."
								},
								"MEd": {
									"M": "E, dd.MM. – E, dd.MM.",
									"d": "E, dd.MM. – E, dd.MM."
								},
								"MMM": {
									"M": "MMM–MMM"
								},
								"MMMEd": {
									"M": "E, d. MMM – E, d. MMM",
									"d": "E, d. – E, d. MMM"
								},
								"MMMM": {
									"M": "LLLL–LLLL"
								},
								"MMMd": {
									"M": "d. MMM – d. MMM",
									"d": "d.–d. MMM"
								},
								"Md": {
									"M": "dd.MM. – dd.MM.",
									"d": "dd.MM. – dd.MM."
								},
								"d": {
									"d": "d.–d."
								},
								"h": {
									"a": "h a – h a",
									"h": "h–h a"
								},
								"hm": {
									"a": "h:mm a – h:mm a",
									"h": "h:mm–h:mm a",
									"m": "h:mm–h:mm a"
								},
								"hmv": {
									"a": "h:mm a – h:mm a v",
									"h": "h:mm–h:mm a v",
									"m": "h:mm–h:mm a v"
								},
								"hv": {
									"a": "h a – h a v",
									"h": "h–h a v"
								},
								"y": {
									"y": "y–y"
								},
								"yM": {
									"M": "MM.y – MM.y",
									"y": "MM.y – MM.y"
								},
								"yMEd": {
									"M": "E, dd.MM.y – E, dd.MM.y",
									"d": "E, dd.MM.y – E, dd.MM.y",
									"y": "E, dd.MM.y – E, dd.MM.y"
								},
								"yMMM": {
									"M": "MMM–MMM y",
									"y": "MMM y – MMM y"
								},
								"yMMMEd": {
									"M": "E, d. MMM – E, d. MMM y",
									"d": "E, d. – E, d. MMM y",
									"y": "E, d. MMM y – E, d. MMM y"
								},
								"yMMMM": {
									"M": "MMMM–MMMM y",
									"y": "MMMM y – MMMM y"
								},
								"yMMMd": {
									"M": "d. MMM – d. MMM y",
									"d": "d.–d. MMM y",
									"y": "d. MMM y – d. MMM y"
								},
								"yMd": {
									"M": "dd.MM.y – dd.MM.y",
									"d": "dd.MM.y – dd.MM.y",
									"y": "dd.MM.y – dd.MM.y"
								}
							}
						}
					}
				}
			},
			"numbers": {
				"defaultNumberingSystem": "latn",
				"otherNumberingSystems": {
					"native": "latn"
				},
				"minimumGroupingDigits": "1",
				"symbols-numberSystem-latn": {
					"decimal": ",",
					"group": ".",
					"list": ";",
					"percentSign": "%",
					"plusSign": "+",
					"minusSign": "-",
					"exponential": "E",
					"superscriptingExponent": "·",
					"perMille": "‰",
					"infinity": "∞",
					"nan": "NaN",
					"timeSeparator": ":"
				},
				"decimalFormats-numberSystem-latn": {
					"standard": "#,##0.###",
					"long": {
						"decimalFormat": {
							"1000-count-one": "0 Tausend",
							"1000-count-other": "0 Tausend",
							"10000-count-one": "00 Tausend",
							"10000-count-other": "00 Tausend",
							"100000-count-one": "000 Tausend",
							"100000-count-other": "000 Tausend",
							"1000000-count-one": "0 Million",
							"1000000-count-other": "0 Millionen",
							"10000000-count-one": "00 Millionen",
							"10000000-count-other": "00 Millionen",
							"100000000-count-one": "000 Millionen",
							"100000000-count-other": "000 Millionen",
							"1000000000-count-one": "0 Milliarde",
							"1000000000-count-other": "0 Milliarden",
							"10000000000-count-one": "00 Milliarden",
							"10000000000-count-other": "00 Milliarden",
							"100000000000-count-one": "000 Milliarden",
							"100000000000-count-other": "000 Milliarden",
							"1000000000000-count-one": "0 Billion",
							"1000000000000-count-other": "0 Billionen",
							"10000000000000-count-one": "00 Billionen",
							"10000000000000-count-other": "00 Billionen",
							"100000000000000-count-one": "000 Billionen",
							"100000000000000-count-other": "000 Billionen"
						}
					},
					"short": {
						"decimalFormat": {
							"1000-count-one": "0 Tsd'.'",
							"1000-count-other": "0 Tsd'.'",
							"10000-count-one": "00 Tsd'.'",
							"10000-count-other": "00 Tsd'.'",
							"100000-count-one": "000 Tsd'.'",
							"100000-count-other": "000 Tsd'.'",
							"1000000-count-one": "0 Mio'.'",
							"1000000-count-other": "0 Mio'.'",
							"10000000-count-one": "00 Mio'.'",
							"10000000-count-other": "00 Mio'.'",
							"100000000-count-one": "000 Mio'.'",
							"100000000-count-other": "000 Mio'.'",
							"1000000000-count-one": "0 Mrd'.'",
							"1000000000-count-other": "0 Mrd'.'",
							"10000000000-count-one": "00 Mrd'.'",
							"10000000000-count-other": "00 Mrd'.'",
							"100000000000-count-one": "000 Mrd'.'",
							"100000000000-count-other": "000 Mrd'.'",
							"1000000000000-count-one": "0 Bio'.'",
							"1000000000000-count-other": "0 Bio'.'",
							"10000000000000-count-one": "00 Bio'.'",
							"10000000000000-count-other": "00 Bio'.'",
							"100000000000000-count-one": "000 Bio'.'",
							"100000000000000-count-other": "000 Bio'.'"
						}
					}
				},
				"scientificFormats-numberSystem-latn": {
					"standard": "#E0"
				},
				"percentFormats-numberSystem-latn": {
					"standard": "#,##0 %"
				},
				"currencyFormats-numberSystem-latn": {
					"currencySpacing": {
						"beforeCurrency": {
							"currencyMatch": "[:^S:]",
							"surroundingMatch": "[:digit:]",
							"insertBetween": " "
						},
						"afterCurrency": {
							"currencyMatch": "[:^S:]",
							"surroundingMatch": "[:digit:]",
							"insertBetween": " "
						}
					},
					"accounting": "#,##0.00 ¤",
					"standard": "#,##0.00 ¤",
					"unitPattern-count-one": "{0} {1}",
					"unitPattern-count-other": "{0} {1}"
				},
				"miscPatterns-numberSystem-latn": {
					"atLeast": "{0}+",
					"range": "{0}–{1}"
				}
			}
		}
	}
});

Globalize.load({
	"main": {
		"zh": {
			"identity": {
				"version": {
					"_cldrVersion": "27.0.1",
					"_number": "$Revision: 11294 $"
				},
				"generation": {
					"_date": "$Date: 2015-02-23 16:50:24 -0600 (Mon, 23 Feb 2015) $"
				},
				"language": "zh"
			},
			"dates": {
				"calendars": {
					"gregorian": {
						"months": {
							"format": {
								"abbreviated": {
									"1": "1月",
									"2": "2月",
									"3": "3月",
									"4": "4月",
									"5": "5月",
									"6": "6月",
									"7": "7月",
									"8": "8月",
									"9": "9月",
									"10": "10月",
									"11": "11月",
									"12": "12月"
								},
								"narrow": {
									"1": "1",
									"2": "2",
									"3": "3",
									"4": "4",
									"5": "5",
									"6": "6",
									"7": "7",
									"8": "8",
									"9": "9",
									"10": "10",
									"11": "11",
									"12": "12"
								},
								"wide": {
									"1": "一月",
									"2": "二月",
									"3": "三月",
									"4": "四月",
									"5": "五月",
									"6": "六月",
									"7": "七月",
									"8": "八月",
									"9": "九月",
									"10": "十月",
									"11": "十一月",
									"12": "十二月"
								}
							},
							"stand-alone": {
								"abbreviated": {
									"1": "1月",
									"2": "2月",
									"3": "3月",
									"4": "4月",
									"5": "5月",
									"6": "6月",
									"7": "7月",
									"8": "8月",
									"9": "9月",
									"10": "10月",
									"11": "11月",
									"12": "12月"
								},
								"narrow": {
									"1": "1",
									"2": "2",
									"3": "3",
									"4": "4",
									"5": "5",
									"6": "6",
									"7": "7",
									"8": "8",
									"9": "9",
									"10": "10",
									"11": "11",
									"12": "12"
								},
								"wide": {
									"1": "一月",
									"2": "二月",
									"3": "三月",
									"4": "四月",
									"5": "五月",
									"6": "六月",
									"7": "七月",
									"8": "八月",
									"9": "九月",
									"10": "十月",
									"11": "十一月",
									"12": "十二月"
								}
							}
						},
						"days": {
							"format": {
								"abbreviated": {
									"sun": "周日",
									"mon": "周一",
									"tue": "周二",
									"wed": "周三",
									"thu": "周四",
									"fri": "周五",
									"sat": "周六"
								},
								"narrow": {
									"sun": "日",
									"mon": "一",
									"tue": "二",
									"wed": "三",
									"thu": "四",
									"fri": "五",
									"sat": "六"
								},
								"short": {
									"sun": "周日",
									"mon": "周一",
									"tue": "周二",
									"wed": "周三",
									"thu": "周四",
									"fri": "周五",
									"sat": "周六"
								},
								"wide": {
									"sun": "星期日",
									"mon": "星期一",
									"tue": "星期二",
									"wed": "星期三",
									"thu": "星期四",
									"fri": "星期五",
									"sat": "星期六"
								}
							},
							"stand-alone": {
								"abbreviated": {
									"sun": "周日",
									"mon": "周一",
									"tue": "周二",
									"wed": "周三",
									"thu": "周四",
									"fri": "周五",
									"sat": "周六"
								},
								"narrow": {
									"sun": "日",
									"mon": "一",
									"tue": "二",
									"wed": "三",
									"thu": "四",
									"fri": "五",
									"sat": "六"
								},
								"short": {
									"sun": "周日",
									"mon": "周一",
									"tue": "周二",
									"wed": "周三",
									"thu": "周四",
									"fri": "周五",
									"sat": "周六"
								},
								"wide": {
									"sun": "星期日",
									"mon": "星期一",
									"tue": "星期二",
									"wed": "星期三",
									"thu": "星期四",
									"fri": "星期五",
									"sat": "星期六"
								}
							}
						},
						"quarters": {
							"format": {
								"abbreviated": {
									"1": "1季度",
									"2": "2季度",
									"3": "3季度",
									"4": "4季度"
								},
								"narrow": {
									"1": "1",
									"2": "2",
									"3": "3",
									"4": "4"
								},
								"wide": {
									"1": "第一季度",
									"2": "第二季度",
									"3": "第三季度",
									"4": "第四季度"
								}
							},
							"stand-alone": {
								"abbreviated": {
									"1": "1季度",
									"2": "2季度",
									"3": "3季度",
									"4": "4季度"
								},
								"narrow": {
									"1": "1",
									"2": "2",
									"3": "3",
									"4": "4"
								},
								"wide": {
									"1": "第一季度",
									"2": "第二季度",
									"3": "第三季度",
									"4": "第四季度"
								}
							}
						},
						"dayPeriods": {
							"format": {
								"abbreviated": {
									"afternoon": "下午",
									"am": "上午",
									"earlyMorning": "清晨",
									"midDay": "中午",
									"morning": "上午",
									"night": "晚上",
									"noon": "中午",
									"pm": "下午",
									"weeHours": "凌晨"
								},
								"narrow": {
									"afternoon": "下午",
									"am": "上午",
									"earlyMorning": "清晨",
									"midDay": "中午",
									"morning": "上午",
									"night": "晚上",
									"noon": "中午",
									"pm": "下午",
									"weeHours": "凌晨"
								},
								"wide": {
									"afternoon": "下午",
									"am": "上午",
									"earlyMorning": "清晨",
									"midDay": "中午",
									"morning": "上午",
									"night": "晚上",
									"noon": "中午",
									"pm": "下午",
									"weeHours": "凌晨"
								}
							},
							"stand-alone": {
								"abbreviated": {
									"afternoon": "下午",
									"am": "上午",
									"earlyMorning": "清晨",
									"midDay": "中午",
									"morning": "上午",
									"night": "晚上",
									"noon": "中午",
									"pm": "下午",
									"weeHours": "凌晨"
								},
								"narrow": {
									"afternoon": "下午",
									"am": "上午",
									"earlyMorning": "清晨",
									"midDay": "中午",
									"morning": "上午",
									"night": "晚上",
									"noon": "中午",
									"pm": "下午",
									"weeHours": "凌晨"
								},
								"wide": {
									"afternoon": "下午",
									"am": "上午",
									"earlyMorning": "清晨",
									"midDay": "中午",
									"morning": "上午",
									"night": "晚上",
									"noon": "中午",
									"pm": "下午",
									"weeHours": "凌晨"
								}
							}
						},
						"eras": {
							"eraNames": {
								"0": "公元前",
								"0-alt-variant": "BCE",
								"1": "公元",
								"1-alt-variant": "CE"
							},
							"eraAbbr": {
								"0": "公元前",
								"0-alt-variant": "BCE",
								"1": "公元",
								"1-alt-variant": "CE"
							},
							"eraNarrow": {
								"0": "公元前",
								"0-alt-variant": "BCE",
								"1": "公元",
								"1-alt-variant": "CE"
							}
						},
						"dateFormats": {
							"full": "y年M月d日EEEE",
							"long": "y年M月d日",
							"medium": "y年M月d日",
							"short": "yy/M/d"
						},
						"timeFormats": {
							"full": "zzzz ah:mm:ss",
							"long": "z ah:mm:ss",
							"medium": "ah:mm:ss",
							"short": "ah:mm"
						},
						"dateTimeFormats": {
							"full": "{1} {0}",
							"long": "{1} {0}",
							"medium": "{1} {0}",
							"short": "{1} {0}",
							"availableFormats": {
								"E": "ccc",
								"EHm": "EHH:mm",
								"EHms": "EHH:mm:ss",
								"Ed": "d日E",
								"Ehm": "Eah:mm",
								"Ehms": "Eah:mm:ss",
								"Gy": "Gy年",
								"GyMMM": "Gy年M月",
								"GyMMMEd": "Gy年M月d日E",
								"GyMMMd": "Gy年M月d日",
								"H": "H时",
								"Hm": "HH:mm",
								"Hms": "HH:mm:ss",
								"Hmsv": "v HH:mm:ss",
								"Hmv": "v HH:mm",
								"M": "M月",
								"MEd": "M/dE",
								"MMM": "LLL",
								"MMMEd": "M月d日E",
								"MMMMdd": "M月dd日",
								"MMMd": "M月d日",
								"MMdd": "MM/dd",
								"Md": "M/d",
								"d": "d日",
								"h": "ah时",
								"hm": "ah:mm",
								"hms": "ah:mm:ss",
								"hmsv": "v ah:mm:ss",
								"hmv": "v ah:mm",
								"ms": "mm:ss",
								"y": "y年",
								"yM": "y年M月",
								"yMEd": "y/M/dE",
								"yMM": "y年M月",
								"yMMM": "y年M月",
								"yMMMEd": "y年M月d日E",
								"yMMMM": "y年M月",
								"yMMMd": "y年M月d日",
								"yMd": "y/M/d",
								"yQQQ": "y年第Q季度",
								"yQQQQ": "y年第Q季度"
							},
							"appendItems": {
								"Day": "{0} ({2}: {1})",
								"Day-Of-Week": "{0} {1}",
								"Era": "{1} {0}",
								"Hour": "{0} ({2}: {1})",
								"Minute": "{0} ({2}: {1})",
								"Month": "{0} ({2}: {1})",
								"Quarter": "{0} ({2}: {1})",
								"Second": "{0} ({2}: {1})",
								"Timezone": "{1}{0}",
								"Week": "{0} ({2}: {1})",
								"Year": "{1} {0}"
							},
							"intervalFormats": {
								"intervalFormatFallback": "{0} – {1}",
								"H": {
									"H": "HH–HH"
								},
								"Hm": {
									"H": "HH:mm–HH:mm",
									"m": "HH:mm–HH:mm"
								},
								"Hmv": {
									"H": "v HH:mm–HH:mm",
									"m": "v HH:mm–HH:mm"
								},
								"Hv": {
									"H": "v HH–HH"
								},
								"M": {
									"M": "M–M月"
								},
								"MEd": {
									"M": "M/dE至M/dE",
									"d": "M/dE至M/dE"
								},
								"MMM": {
									"M": "LLL至LLL"
								},
								"MMMEd": {
									"M": "M月d日E至M月d日E",
									"d": "M月d日E至d日E"
								},
								"MMMd": {
									"M": "M月d日至M月d日",
									"d": "M月d日至d日"
								},
								"Md": {
									"M": "M/d – M/d",
									"d": "M/d – M/d"
								},
								"d": {
									"d": "d–d日"
								},
								"h": {
									"a": "ah时至ah时",
									"h": "ah时至h时"
								},
								"hm": {
									"a": "ah:mm至ah:mm",
									"h": "ah:mm至h:mm",
									"m": "ah:mm至h:mm"
								},
								"hmv": {
									"a": "vah:mm至ah:mm",
									"h": "vah:mm至h:mm",
									"m": "vah:mm至h:mm"
								},
								"hv": {
									"a": "vah时至ah时",
									"h": "vah时至h时"
								},
								"y": {
									"y": "y–y年"
								},
								"yM": {
									"M": "y年M月至M月",
									"y": "y年M月至y年M月"
								},
								"yMEd": {
									"M": "y/M/dE至y/M/dE",
									"d": "y/M/dE至y/M/dE",
									"y": "y/M/dE至y/M/dE"
								},
								"yMMM": {
									"M": "y年M月至M月",
									"y": "y年M月至y年M月"
								},
								"yMMMEd": {
									"M": "y年M月d日E至M月d日E",
									"d": "y年M月d日E至d日E",
									"y": "y年M月d日E至y年M月d日E"
								},
								"yMMMM": {
									"M": "y年M月至M月",
									"y": "y年M月至y年M月"
								},
								"yMMMd": {
									"M": "y年M月d日至M月d日",
									"d": "y年M月d日至d日",
									"y": "y年M月d日至y年M月d日"
								},
								"yMd": {
									"M": "y/M/d – y/M/d",
									"d": "y/M/d – y/M/d",
									"y": "y/M/d – y/M/d"
								}
							}
						}
					}
				}
			},
			"numbers": {
				"defaultNumberingSystem": "latn",
				"otherNumberingSystems": {
					"native": "hanidec",
					"traditional": "hans",
					"finance": "hansfin"
				},
				"minimumGroupingDigits": "1",
				"symbols-numberSystem-hanidec": {
					"decimal": ".",
					"group": ",",
					"list": ";",
					"percentSign": "%",
					"plusSign": "+",
					"minusSign": "-",
					"exponential": "E",
					"superscriptingExponent": "×",
					"perMille": "‰",
					"infinity": "∞",
					"nan": "NaN",
					"timeSeparator": ":"
				},
				"symbols-numberSystem-latn": {
					"decimal": ".",
					"group": ",",
					"list": ";",
					"percentSign": "%",
					"plusSign": "+",
					"minusSign": "-",
					"exponential": "E",
					"superscriptingExponent": "×",
					"perMille": "‰",
					"infinity": "∞",
					"nan": "NaN",
					"timeSeparator": ":"
				},
				"decimalFormats-numberSystem-hanidec": {
					"standard": "#,##0.###",
					"long": {
						"decimalFormat": {
							"1000-count-other": "0千",
							"10000-count-other": "0万",
							"100000-count-other": "00万",
							"1000000-count-other": "000万",
							"10000000-count-other": "0000万",
							"100000000-count-other": "0亿",
							"1000000000-count-other": "00亿",
							"10000000000-count-other": "000亿",
							"100000000000-count-other": "0000亿",
							"1000000000000-count-other": "0兆",
							"10000000000000-count-other": "00兆",
							"100000000000000-count-other": "000兆"
						}
					},
					"short": {
						"decimalFormat": {
							"1000-count-other": "0千",
							"10000-count-other": "0万",
							"100000-count-other": "00万",
							"1000000-count-other": "000万",
							"10000000-count-other": "0000万",
							"100000000-count-other": "0亿",
							"1000000000-count-other": "00亿",
							"10000000000-count-other": "000亿",
							"100000000000-count-other": "0000亿",
							"1000000000000-count-other": "0兆",
							"10000000000000-count-other": "00兆",
							"100000000000000-count-other": "000兆"
						}
					}
				},
				"decimalFormats-numberSystem-latn": {
					"standard": "#,##0.###",
					"long": {
						"decimalFormat": {
							"1000-count-other": "0千",
							"10000-count-other": "0万",
							"100000-count-other": "00万",
							"1000000-count-other": "000万",
							"10000000-count-other": "0000万",
							"100000000-count-other": "0亿",
							"1000000000-count-other": "00亿",
							"10000000000-count-other": "000亿",
							"100000000000-count-other": "0000亿",
							"1000000000000-count-other": "0兆",
							"10000000000000-count-other": "00兆",
							"100000000000000-count-other": "000兆"
						}
					},
					"short": {
						"decimalFormat": {
							"1000-count-other": "0千",
							"10000-count-other": "0万",
							"100000-count-other": "00万",
							"1000000-count-other": "000万",
							"10000000-count-other": "0000万",
							"100000000-count-other": "0亿",
							"1000000000-count-other": "00亿",
							"10000000000-count-other": "000亿",
							"100000000000-count-other": "0000亿",
							"1000000000000-count-other": "0兆",
							"10000000000000-count-other": "00兆",
							"100000000000000-count-other": "000兆"
						}
					}
				},
				"scientificFormats-numberSystem-hanidec": {
					"standard": "#E0"
				},
				"scientificFormats-numberSystem-latn": {
					"standard": "#E0"
				},
				"percentFormats-numberSystem-hanidec": {
					"standard": "#,##0%"
				},
				"percentFormats-numberSystem-latn": {
					"standard": "#,##0%"
				},
				"currencyFormats-numberSystem-hanidec": {
					"currencySpacing": {
						"beforeCurrency": {
							"currencyMatch": "[:^S:]",
							"surroundingMatch": "[:digit:]",
							"insertBetween": " "
						},
						"afterCurrency": {
							"currencyMatch": "[:^S:]",
							"surroundingMatch": "[:digit:]",
							"insertBetween": " "
						}
					},
					"accounting": "¤#,##0.00;(¤#,##0.00)",
					"standard": "¤ #,##0.00",
					"unitPattern-count-other": "{0}{1}"
				},
				"currencyFormats-numberSystem-latn": {
					"currencySpacing": {
						"beforeCurrency": {
							"currencyMatch": "[:^S:]",
							"surroundingMatch": "[:digit:]",
							"insertBetween": " "
						},
						"afterCurrency": {
							"currencyMatch": "[:^S:]",
							"surroundingMatch": "[:digit:]",
							"insertBetween": " "
						}
					},
					"accounting": "¤#,##0.00;(¤#,##0.00)",
					"standard": "¤ #,##0.00",
					"unitPattern-count-other": "{0}{1}"
				},
				"miscPatterns-numberSystem-hanidec": {
					"atLeast": "{0}+",
					"range": "{0}-{1}"
				},
				"miscPatterns-numberSystem-latn": {
					"atLeast": "{0}+",
					"range": "{0}-{1}"
				}
			}
		}
	}
});

Globalize.load({
	"supplemental": {
		"version": {
			"_unicodeVersion": "7.0.0",
			"_number": "$Revision: 11318 $"
		},
		"generation": {
			"_date": "$Date: 2015-02-25 23:47:56 -0600 (Wed, 25 Feb 2015) $"
		},
		"likelySubtags": {
			"aa": "aa-Latn-ET",
			"ab": "ab-Cyrl-GE",
			"abr": "abr-Latn-GH",
			"ace": "ace-Latn-ID",
			"ach": "ach-Latn-UG",
			"ada": "ada-Latn-GH",
			"ady": "ady-Cyrl-RU",
			"ae": "ae-Avst-IR",
			"aeb": "aeb-Arab-TN",
			"af": "af-Latn-ZA",
			"agq": "agq-Latn-CM",
			"ak": "ak-Latn-GH",
			"akk": "akk-Xsux-IQ",
			"aln": "aln-Latn-XK",
			"alt": "alt-Cyrl-RU",
			"am": "am-Ethi-ET",
			"amo": "amo-Latn-NG",
			"aoz": "aoz-Latn-ID",
			"ar": "ar-Arab-EG",
			"arc": "arc-Armi-IR",
			"arc-Nbat": "arc-Nbat-JO",
			"arc-Palm": "arc-Palm-SY",
			"arn": "arn-Latn-CL",
			"aro": "aro-Latn-BO",
			"arq": "arq-Arab-DZ",
			"ary": "ary-Arab-MA",
			"arz": "arz-Arab-EG",
			"as": "as-Beng-IN",
			"asa": "asa-Latn-TZ",
			"ast": "ast-Latn-ES",
			"atj": "atj-Latn-CA",
			"av": "av-Cyrl-RU",
			"awa": "awa-Deva-IN",
			"ay": "ay-Latn-BO",
			"az": "az-Latn-AZ",
			"az-Arab": "az-Arab-IR",
			"az-IR": "az-Arab-IR",
			"az-RU": "az-Cyrl-RU",
			"azb": "azb-Arab-IR",
			"ba": "ba-Cyrl-RU",
			"bal": "bal-Arab-PK",
			"ban": "ban-Latn-ID",
			"bap": "bap-Deva-NP",
			"bar": "bar-Latn-AT",
			"bas": "bas-Latn-CM",
			"bax": "bax-Bamu-CM",
			"bbc": "bbc-Latn-ID",
			"bbj": "bbj-Latn-CM",
			"bci": "bci-Latn-CI",
			"be": "be-Cyrl-BY",
			"bem": "bem-Latn-ZM",
			"bew": "bew-Latn-ID",
			"bez": "bez-Latn-TZ",
			"bfd": "bfd-Latn-CM",
			"bfq": "bfq-Taml-IN",
			"bft": "bft-Arab-PK",
			"bfy": "bfy-Deva-IN",
			"bg": "bg-Cyrl-BG",
			"bgc": "bgc-Deva-IN",
			"bgx": "bgx-Grek-TR",
			"bh": "bh-Kthi-IN",
			"bhb": "bhb-Deva-IN",
			"bhi": "bhi-Deva-IN",
			"bhk": "bhk-Latn-PH",
			"bho": "bho-Deva-IN",
			"bi": "bi-Latn-VU",
			"bik": "bik-Latn-PH",
			"bin": "bin-Latn-NG",
			"bjj": "bjj-Deva-IN",
			"bjn": "bjn-Latn-ID",
			"bkm": "bkm-Latn-CM",
			"bku": "bku-Latn-PH",
			"blt": "blt-Tavt-VN",
			"bm": "bm-Latn-ML",
			"bmq": "bmq-Latn-ML",
			"bn": "bn-Beng-BD",
			"bo": "bo-Tibt-CN",
			"bpy": "bpy-Beng-IN",
			"bqi": "bqi-Arab-IR",
			"bqv": "bqv-Latn-CI",
			"br": "br-Latn-FR",
			"bra": "bra-Deva-IN",
			"brh": "brh-Arab-PK",
			"brx": "brx-Deva-IN",
			"bs": "bs-Latn-BA",
			"bsq": "bsq-Bass-LR",
			"bss": "bss-Latn-CM",
			"bto": "bto-Latn-PH",
			"btv": "btv-Deva-PK",
			"bua": "bua-Cyrl-RU",
			"buc": "buc-Latn-YT",
			"bug": "bug-Latn-ID",
			"bum": "bum-Latn-CM",
			"bvb": "bvb-Latn-GQ",
			"byn": "byn-Ethi-ER",
			"byv": "byv-Latn-CM",
			"bze": "bze-Latn-ML",
			"ca": "ca-Latn-ES",
			"cch": "cch-Latn-NG",
			"ccp": "ccp-Beng-IN",
			"ccp-Cakm": "ccp-Cakm-BD",
			"ce": "ce-Cyrl-RU",
			"ceb": "ceb-Latn-PH",
			"cgg": "cgg-Latn-UG",
			"ch": "ch-Latn-GU",
			"chk": "chk-Latn-FM",
			"chm": "chm-Cyrl-RU",
			"cho": "cho-Latn-US",
			"chp": "chp-Latn-CA",
			"chr": "chr-Cher-US",
			"cja": "cja-Arab-KH",
			"cjm": "cjm-Cham-VN",
			"ckb": "ckb-Arab-IQ",
			"co": "co-Latn-FR",
			"cop": "cop-Copt-EG",
			"cps": "cps-Latn-PH",
			"cr": "cr-Cans-CA",
			"crj": "crj-Cans-CA",
			"crk": "crk-Cans-CA",
			"crl": "crl-Cans-CA",
			"crm": "crm-Cans-CA",
			"crs": "crs-Latn-SC",
			"cs": "cs-Latn-CZ",
			"csb": "csb-Latn-PL",
			"csw": "csw-Cans-CA",
			"ctd": "ctd-Pauc-MM",
			"cu": "cu-Cyrl-RU",
			"cu-Glag": "cu-Glag-BG",
			"cv": "cv-Cyrl-RU",
			"cy": "cy-Latn-GB",
			"da": "da-Latn-DK",
			"dak": "dak-Latn-US",
			"dar": "dar-Cyrl-RU",
			"dav": "dav-Latn-KE",
			"dcc": "dcc-Arab-IN",
			"de": "de-Latn-DE",
			"den": "den-Latn-CA",
			"dgr": "dgr-Latn-CA",
			"dje": "dje-Latn-NE",
			"dnj": "dnj-Latn-CI",
			"doi": "doi-Arab-IN",
			"dsb": "dsb-Latn-DE",
			"dtm": "dtm-Latn-ML",
			"dtp": "dtp-Latn-MY",
			"dua": "dua-Latn-CM",
			"dv": "dv-Thaa-MV",
			"dyo": "dyo-Latn-SN",
			"dyu": "dyu-Latn-BF",
			"dz": "dz-Tibt-BT",
			"ebu": "ebu-Latn-KE",
			"ee": "ee-Latn-GH",
			"efi": "efi-Latn-NG",
			"egl": "egl-Latn-IT",
			"egy": "egy-Egyp-EG",
			"eky": "eky-Kali-MM",
			"el": "el-Grek-GR",
			"en": "en-Latn-US",
			"en-Shaw": "en-Shaw-GB",
			"eo": "eo-Latn-001",
			"es": "es-Latn-ES",
			"esu": "esu-Latn-US",
			"et": "et-Latn-EE",
			"ett": "ett-Ital-IT",
			"eu": "eu-Latn-ES",
			"ewo": "ewo-Latn-CM",
			"ext": "ext-Latn-ES",
			"fa": "fa-Arab-IR",
			"fan": "fan-Latn-GQ",
			"ff": "ff-Latn-SN",
			"ffm": "ffm-Latn-ML",
			"fi": "fi-Latn-FI",
			"fil": "fil-Latn-PH",
			"fit": "fit-Latn-SE",
			"fj": "fj-Latn-FJ",
			"fo": "fo-Latn-FO",
			"fon": "fon-Latn-BJ",
			"fr": "fr-Latn-FR",
			"frc": "frc-Latn-US",
			"frp": "frp-Latn-FR",
			"frr": "frr-Latn-DE",
			"frs": "frs-Latn-DE",
			"fud": "fud-Latn-WF",
			"fuq": "fuq-Latn-NE",
			"fur": "fur-Latn-IT",
			"fuv": "fuv-Latn-NG",
			"fy": "fy-Latn-NL",
			"ga": "ga-Latn-IE",
			"gaa": "gaa-Latn-GH",
			"gag": "gag-Latn-MD",
			"gan": "gan-Hans-CN",
			"gay": "gay-Latn-ID",
			"gbm": "gbm-Deva-IN",
			"gbz": "gbz-Arab-IR",
			"gcr": "gcr-Latn-GF",
			"gd": "gd-Latn-GB",
			"gez": "gez-Ethi-ET",
			"ggn": "ggn-Deva-NP",
			"gil": "gil-Latn-KI",
			"gjk": "gjk-Arab-PK",
			"gju": "gju-Arab-PK",
			"gl": "gl-Latn-ES",
			"glk": "glk-Arab-IR",
			"gn": "gn-Latn-PY",
			"gom": "gom-Deva-IN",
			"gon": "gon-Telu-IN",
			"gor": "gor-Latn-ID",
			"gos": "gos-Latn-NL",
			"got": "got-Goth-UA",
			"grc": "grc-Cprt-CY",
			"grc-Linb": "grc-Linb-GR",
			"grt": "grt-Beng-IN",
			"gsw": "gsw-Latn-CH",
			"gu": "gu-Gujr-IN",
			"gub": "gub-Latn-BR",
			"guc": "guc-Latn-CO",
			"gur": "gur-Latn-GH",
			"guz": "guz-Latn-KE",
			"gv": "gv-Latn-IM",
			"gvr": "gvr-Deva-NP",
			"gwi": "gwi-Latn-CA",
			"ha": "ha-Latn-NG",
			"ha-CM": "ha-Arab-CM",
			"ha-SD": "ha-Arab-SD",
			"hak": "hak-Hans-CN",
			"haw": "haw-Latn-US",
			"haz": "haz-Arab-AF",
			"he": "he-Hebr-IL",
			"hi": "hi-Deva-IN",
			"hif": "hif-Deva-FJ",
			"hil": "hil-Latn-PH",
			"hmd": "hmd-Plrd-CN",
			"hnd": "hnd-Arab-PK",
			"hne": "hne-Deva-IN",
			"hnj": "hnj-Hmng-LA",
			"hnn": "hnn-Latn-PH",
			"hno": "hno-Arab-PK",
			"ho": "ho-Latn-PG",
			"hoc": "hoc-Deva-IN",
			"hoj": "hoj-Deva-IN",
			"hr": "hr-Latn-HR",
			"hsb": "hsb-Latn-DE",
			"hsn": "hsn-Hans-CN",
			"ht": "ht-Latn-HT",
			"hu": "hu-Latn-HU",
			"hy": "hy-Armn-AM",
			"hz": "hz-Latn-NA",
			"ia": "ia-Latn-FR",
			"iba": "iba-Latn-MY",
			"ibb": "ibb-Latn-NG",
			"id": "id-Latn-ID",
			"ig": "ig-Latn-NG",
			"ii": "ii-Yiii-CN",
			"ik": "ik-Latn-US",
			"ikt": "ikt-Latn-CA",
			"ilo": "ilo-Latn-PH",
			"in": "in-Latn-ID",
			"inh": "inh-Cyrl-RU",
			"is": "is-Latn-IS",
			"it": "it-Latn-IT",
			"iu": "iu-Cans-CA",
			"iw": "iw-Hebr-IL",
			"izh": "izh-Latn-RU",
			"ja": "ja-Jpan-JP",
			"jam": "jam-Latn-JM",
			"jgo": "jgo-Latn-CM",
			"ji": "ji-Hebr-UA",
			"jmc": "jmc-Latn-TZ",
			"jml": "jml-Deva-NP",
			"jut": "jut-Latn-DK",
			"jv": "jv-Latn-ID",
			"jw": "jw-Latn-ID",
			"ka": "ka-Geor-GE",
			"kaa": "kaa-Cyrl-UZ",
			"kab": "kab-Latn-DZ",
			"kac": "kac-Latn-MM",
			"kaj": "kaj-Latn-NG",
			"kam": "kam-Latn-KE",
			"kao": "kao-Latn-ML",
			"kbd": "kbd-Cyrl-RU",
			"kcg": "kcg-Latn-NG",
			"kck": "kck-Latn-ZW",
			"kde": "kde-Latn-TZ",
			"kdt": "kdt-Thai-TH",
			"kea": "kea-Latn-CV",
			"ken": "ken-Latn-CM",
			"kfo": "kfo-Latn-CI",
			"kfr": "kfr-Deva-IN",
			"kfy": "kfy-Deva-IN",
			"kg": "kg-Latn-CD",
			"kge": "kge-Latn-ID",
			"kgp": "kgp-Latn-BR",
			"kha": "kha-Latn-IN",
			"khb": "khb-Talu-CN",
			"khn": "khn-Deva-IN",
			"khq": "khq-Latn-ML",
			"kht": "kht-Mymr-IN",
			"khw": "khw-Arab-PK",
			"ki": "ki-Latn-KE",
			"kiu": "kiu-Latn-TR",
			"kj": "kj-Latn-NA",
			"kjg": "kjg-Laoo-LA",
			"kk": "kk-Cyrl-KZ",
			"kk-AF": "kk-Arab-AF",
			"kk-Arab": "kk-Arab-CN",
			"kk-CN": "kk-Arab-CN",
			"kk-IR": "kk-Arab-IR",
			"kk-MN": "kk-Arab-MN",
			"kkj": "kkj-Latn-CM",
			"kl": "kl-Latn-GL",
			"kln": "kln-Latn-KE",
			"km": "km-Khmr-KH",
			"kmb": "kmb-Latn-AO",
			"kn": "kn-Knda-IN",
			"ko": "ko-Kore-KR",
			"koi": "koi-Cyrl-RU",
			"kok": "kok-Deva-IN",
			"kos": "kos-Latn-FM",
			"kpe": "kpe-Latn-LR",
			"krc": "krc-Cyrl-RU",
			"kri": "kri-Latn-SL",
			"krj": "krj-Latn-PH",
			"krl": "krl-Latn-RU",
			"kru": "kru-Deva-IN",
			"ks": "ks-Arab-IN",
			"ksb": "ksb-Latn-TZ",
			"ksf": "ksf-Latn-CM",
			"ksh": "ksh-Latn-DE",
			"ku": "ku-Latn-TR",
			"ku-Arab": "ku-Arab-IQ",
			"ku-LB": "ku-Arab-LB",
			"kum": "kum-Cyrl-RU",
			"kv": "kv-Cyrl-RU",
			"kvr": "kvr-Latn-ID",
			"kvx": "kvx-Arab-PK",
			"kw": "kw-Latn-GB",
			"kxm": "kxm-Thai-TH",
			"kxp": "kxp-Arab-PK",
			"ky": "ky-Cyrl-KG",
			"ky-Arab": "ky-Arab-CN",
			"ky-CN": "ky-Arab-CN",
			"ky-Latn": "ky-Latn-TR",
			"ky-TR": "ky-Latn-TR",
			"la": "la-Latn-VA",
			"lab": "lab-Lina-GR",
			"lad": "lad-Hebr-IL",
			"lag": "lag-Latn-TZ",
			"lah": "lah-Arab-PK",
			"laj": "laj-Latn-UG",
			"lb": "lb-Latn-LU",
			"lbe": "lbe-Cyrl-RU",
			"lbw": "lbw-Latn-ID",
			"lcp": "lcp-Thai-CN",
			"lep": "lep-Lepc-IN",
			"lez": "lez-Cyrl-RU",
			"lg": "lg-Latn-UG",
			"li": "li-Latn-NL",
			"lif": "lif-Deva-NP",
			"lif-Limb": "lif-Limb-IN",
			"lij": "lij-Latn-IT",
			"lis": "lis-Lisu-CN",
			"ljp": "ljp-Latn-ID",
			"lki": "lki-Arab-IR",
			"lkt": "lkt-Latn-US",
			"lmn": "lmn-Telu-IN",
			"lmo": "lmo-Latn-IT",
			"ln": "ln-Latn-CD",
			"lo": "lo-Laoo-LA",
			"lol": "lol-Latn-CD",
			"loz": "loz-Latn-ZM",
			"lrc": "lrc-Arab-IR",
			"lt": "lt-Latn-LT",
			"ltg": "ltg-Latn-LV",
			"lu": "lu-Latn-CD",
			"lua": "lua-Latn-CD",
			"luo": "luo-Latn-KE",
			"luy": "luy-Latn-KE",
			"luz": "luz-Arab-IR",
			"lv": "lv-Latn-LV",
			"lwl": "lwl-Thai-TH",
			"lzh": "lzh-Hans-CN",
			"lzz": "lzz-Latn-TR",
			"mad": "mad-Latn-ID",
			"maf": "maf-Latn-CM",
			"mag": "mag-Deva-IN",
			"mai": "mai-Deva-IN",
			"mak": "mak-Latn-ID",
			"man": "man-Latn-GM",
			"man-GN": "man-Nkoo-GN",
			"man-Nkoo": "man-Nkoo-GN",
			"mas": "mas-Latn-KE",
			"maz": "maz-Latn-MX",
			"mdf": "mdf-Cyrl-RU",
			"mdh": "mdh-Latn-PH",
			"mdr": "mdr-Latn-ID",
			"men": "men-Latn-SL",
			"mer": "mer-Latn-KE",
			"mfa": "mfa-Arab-TH",
			"mfe": "mfe-Latn-MU",
			"mg": "mg-Latn-MG",
			"mgh": "mgh-Latn-MZ",
			"mgo": "mgo-Latn-CM",
			"mgp": "mgp-Deva-NP",
			"mgy": "mgy-Latn-TZ",
			"mh": "mh-Latn-MH",
			"mi": "mi-Latn-NZ",
			"min": "min-Latn-ID",
			"mk": "mk-Cyrl-MK",
			"ml": "ml-Mlym-IN",
			"mn": "mn-Cyrl-MN",
			"mn-CN": "mn-Mong-CN",
			"mn-Mong": "mn-Mong-CN",
			"mni": "mni-Beng-IN",
			"mnw": "mnw-Mymr-MM",
			"moe": "moe-Latn-CA",
			"moh": "moh-Latn-CA",
			"mos": "mos-Latn-BF",
			"mr": "mr-Deva-IN",
			"mrd": "mrd-Deva-NP",
			"mrj": "mrj-Cyrl-RU",
			"mru": "mru-Mroo-BD",
			"ms": "ms-Latn-MY",
			"ms-CC": "ms-Arab-CC",
			"ms-ID": "ms-Arab-ID",
			"mt": "mt-Latn-MT",
			"mtr": "mtr-Deva-IN",
			"mua": "mua-Latn-CM",
			"mus": "mus-Latn-US",
			"mvy": "mvy-Arab-PK",
			"mwk": "mwk-Latn-ML",
			"mwr": "mwr-Deva-IN",
			"mwv": "mwv-Latn-ID",
			"mxc": "mxc-Latn-ZW",
			"my": "my-Mymr-MM",
			"myv": "myv-Cyrl-RU",
			"myx": "myx-Latn-UG",
			"myz": "myz-Mand-IR",
			"mzn": "mzn-Arab-IR",
			"na": "na-Latn-NR",
			"nan": "nan-Hans-CN",
			"nap": "nap-Latn-IT",
			"naq": "naq-Latn-NA",
			"nb": "nb-Latn-NO",
			"nch": "nch-Latn-MX",
			"nd": "nd-Latn-ZW",
			"ndc": "ndc-Latn-MZ",
			"nds": "nds-Latn-DE",
			"ne": "ne-Deva-NP",
			"new": "new-Deva-NP",
			"ng": "ng-Latn-NA",
			"ngl": "ngl-Latn-MZ",
			"nhe": "nhe-Latn-MX",
			"nhw": "nhw-Latn-MX",
			"nij": "nij-Latn-ID",
			"niu": "niu-Latn-NU",
			"njo": "njo-Latn-IN",
			"nl": "nl-Latn-NL",
			"nmg": "nmg-Latn-CM",
			"nn": "nn-Latn-NO",
			"nnh": "nnh-Latn-CM",
			"no": "no-Latn-NO",
			"nod": "nod-Lana-TH",
			"noe": "noe-Deva-IN",
			"non": "non-Runr-SE",
			"nqo": "nqo-Nkoo-GN",
			"nr": "nr-Latn-ZA",
			"nsk": "nsk-Cans-CA",
			"nso": "nso-Latn-ZA",
			"nus": "nus-Latn-SD",
			"nv": "nv-Latn-US",
			"nxq": "nxq-Latn-CN",
			"ny": "ny-Latn-MW",
			"nym": "nym-Latn-TZ",
			"nyn": "nyn-Latn-UG",
			"nzi": "nzi-Latn-GH",
			"oc": "oc-Latn-FR",
			"om": "om-Latn-ET",
			"or": "or-Orya-IN",
			"os": "os-Cyrl-GE",
			"otk": "otk-Orkh-MN",
			"pa": "pa-Guru-IN",
			"pa-Arab": "pa-Arab-PK",
			"pa-PK": "pa-Arab-PK",
			"pag": "pag-Latn-PH",
			"pal": "pal-Phli-IR",
			"pal-Phlp": "pal-Phlp-CN",
			"pam": "pam-Latn-PH",
			"pap": "pap-Latn-AW",
			"pau": "pau-Latn-PW",
			"pcd": "pcd-Latn-FR",
			"pcm": "pcm-Latn-NG",
			"pdc": "pdc-Latn-US",
			"pdt": "pdt-Latn-CA",
			"peo": "peo-Xpeo-IR",
			"pfl": "pfl-Latn-DE",
			"phn": "phn-Phnx-LB",
			"pka": "pka-Brah-IN",
			"pko": "pko-Latn-KE",
			"pl": "pl-Latn-PL",
			"pms": "pms-Latn-IT",
			"pnt": "pnt-Grek-GR",
			"pon": "pon-Latn-FM",
			"pra": "pra-Khar-PK",
			"prd": "prd-Arab-IR",
			"prg": "prg-Latn-001",
			"ps": "ps-Arab-AF",
			"pt": "pt-Latn-BR",
			"puu": "puu-Latn-GA",
			"qu": "qu-Latn-PE",
			"quc": "quc-Latn-GT",
			"qug": "qug-Latn-EC",
			"raj": "raj-Latn-IN",
			"rcf": "rcf-Latn-RE",
			"rej": "rej-Latn-ID",
			"rgn": "rgn-Latn-IT",
			"ria": "ria-Latn-IN",
			"rif": "rif-Tfng-MA",
			"rif-NL": "rif-Latn-NL",
			"rjs": "rjs-Deva-NP",
			"rkt": "rkt-Beng-BD",
			"rm": "rm-Latn-CH",
			"rmf": "rmf-Latn-FI",
			"rmo": "rmo-Latn-CH",
			"rmt": "rmt-Arab-IR",
			"rmu": "rmu-Latn-SE",
			"rn": "rn-Latn-BI",
			"rng": "rng-Latn-MZ",
			"ro": "ro-Latn-RO",
			"rob": "rob-Latn-ID",
			"rof": "rof-Latn-TZ",
			"rtm": "rtm-Latn-FJ",
			"ru": "ru-Cyrl-RU",
			"rue": "rue-Cyrl-UA",
			"rug": "rug-Latn-SB",
			"rw": "rw-Latn-RW",
			"rwk": "rwk-Latn-TZ",
			"ryu": "ryu-Kana-JP",
			"sa": "sa-Deva-IN",
			"saf": "saf-Latn-GH",
			"sah": "sah-Cyrl-RU",
			"saq": "saq-Latn-KE",
			"sas": "sas-Latn-ID",
			"sat": "sat-Latn-IN",
			"saz": "saz-Saur-IN",
			"sbp": "sbp-Latn-TZ",
			"sc": "sc-Latn-IT",
			"sck": "sck-Deva-IN",
			"scn": "scn-Latn-IT",
			"sco": "sco-Latn-GB",
			"scs": "scs-Latn-CA",
			"sd": "sd-Arab-PK",
			"sd-Deva": "sd-Deva-IN",
			"sd-Khoj": "sd-Khoj-IN",
			"sd-Sind": "sd-Sind-IN",
			"sdc": "sdc-Latn-IT",
			"se": "se-Latn-NO",
			"sef": "sef-Latn-CI",
			"seh": "seh-Latn-MZ",
			"sei": "sei-Latn-MX",
			"ses": "ses-Latn-ML",
			"sg": "sg-Latn-CF",
			"sga": "sga-Ogam-IE",
			"sgs": "sgs-Latn-LT",
			"shi": "shi-Tfng-MA",
			"shn": "shn-Mymr-MM",
			"si": "si-Sinh-LK",
			"sid": "sid-Latn-ET",
			"sk": "sk-Latn-SK",
			"skr": "skr-Arab-PK",
			"sl": "sl-Latn-SI",
			"sli": "sli-Latn-PL",
			"sly": "sly-Latn-ID",
			"sm": "sm-Latn-WS",
			"sma": "sma-Latn-SE",
			"smj": "smj-Latn-SE",
			"smn": "smn-Latn-FI",
			"smp": "smp-Samr-IL",
			"sms": "sms-Latn-FI",
			"sn": "sn-Latn-ZW",
			"snk": "snk-Latn-ML",
			"so": "so-Latn-SO",
			"sou": "sou-Thai-TH",
			"sq": "sq-Latn-AL",
			"sr": "sr-Cyrl-RS",
			"sr-ME": "sr-Latn-ME",
			"sr-RO": "sr-Latn-RO",
			"sr-RU": "sr-Latn-RU",
			"sr-TR": "sr-Latn-TR",
			"srb": "srb-Sora-IN",
			"srn": "srn-Latn-SR",
			"srr": "srr-Latn-SN",
			"srx": "srx-Deva-IN",
			"ss": "ss-Latn-ZA",
			"ssy": "ssy-Latn-ER",
			"st": "st-Latn-ZA",
			"stq": "stq-Latn-DE",
			"su": "su-Latn-ID",
			"suk": "suk-Latn-TZ",
			"sus": "sus-Latn-GN",
			"sv": "sv-Latn-SE",
			"sw": "sw-Latn-TZ",
			"swb": "swb-Arab-YT",
			"swc": "swc-Latn-CD",
			"swv": "swv-Deva-IN",
			"sxn": "sxn-Latn-ID",
			"syl": "syl-Beng-BD",
			"syr": "syr-Syrc-IQ",
			"szl": "szl-Latn-PL",
			"ta": "ta-Taml-IN",
			"taj": "taj-Deva-NP",
			"tbw": "tbw-Latn-PH",
			"tcy": "tcy-Knda-IN",
			"tdd": "tdd-Tale-CN",
			"tdg": "tdg-Deva-NP",
			"tdh": "tdh-Deva-NP",
			"te": "te-Telu-IN",
			"tem": "tem-Latn-SL",
			"teo": "teo-Latn-UG",
			"tet": "tet-Latn-TL",
			"tg": "tg-Cyrl-TJ",
			"tg-Arab": "tg-Arab-PK",
			"tg-PK": "tg-Arab-PK",
			"th": "th-Thai-TH",
			"thl": "thl-Deva-NP",
			"thq": "thq-Deva-NP",
			"thr": "thr-Deva-NP",
			"ti": "ti-Ethi-ET",
			"tig": "tig-Ethi-ER",
			"tiv": "tiv-Latn-NG",
			"tk": "tk-Latn-TM",
			"tkl": "tkl-Latn-TK",
			"tkr": "tkr-Latn-AZ",
			"tkt": "tkt-Deva-NP",
			"tl": "tl-Latn-PH",
			"tly": "tly-Latn-AZ",
			"tmh": "tmh-Latn-NE",
			"tn": "tn-Latn-ZA",
			"to": "to-Latn-TO",
			"tog": "tog-Latn-MW",
			"tpi": "tpi-Latn-PG",
			"tr": "tr-Latn-TR",
			"tru": "tru-Latn-TR",
			"trv": "trv-Latn-TW",
			"ts": "ts-Latn-ZA",
			"tsd": "tsd-Grek-GR",
			"tsf": "tsf-Deva-NP",
			"tsg": "tsg-Latn-PH",
			"tsj": "tsj-Tibt-BT",
			"tt": "tt-Cyrl-RU",
			"ttj": "ttj-Latn-UG",
			"tts": "tts-Thai-TH",
			"ttt": "ttt-Latn-AZ",
			"tum": "tum-Latn-MW",
			"tvl": "tvl-Latn-TV",
			"twq": "twq-Latn-NE",
			"ty": "ty-Latn-PF",
			"tyv": "tyv-Cyrl-RU",
			"tzm": "tzm-Latn-MA",
			"udm": "udm-Cyrl-RU",
			"ug": "ug-Arab-CN",
			"ug-Cyrl": "ug-Cyrl-KZ",
			"ug-KZ": "ug-Cyrl-KZ",
			"ug-MN": "ug-Cyrl-MN",
			"uga": "uga-Ugar-SY",
			"uk": "uk-Cyrl-UA",
			"uli": "uli-Latn-FM",
			"umb": "umb-Latn-AO",
			"und": "en-Latn-US",
			"und-002": "en-Latn-NG",
			"und-003": "en-Latn-US",
			"und-005": "pt-Latn-BR",
			"und-009": "en-Latn-AU",
			"und-011": "en-Latn-NG",
			"und-013": "es-Latn-MX",
			"und-014": "sw-Latn-TZ",
			"und-015": "ar-Arab-EG",
			"und-017": "sw-Latn-CD",
			"und-018": "en-Latn-ZA",
			"und-019": "en-Latn-US",
			"und-021": "en-Latn-US",
			"und-029": "es-Latn-CU",
			"und-030": "zh-Hans-CN",
			"und-034": "hi-Deva-IN",
			"und-035": "id-Latn-ID",
			"und-039": "it-Latn-IT",
			"und-053": "en-Latn-AU",
			"und-054": "en-Latn-PG",
			"und-057": "en-Latn-GU",
			"und-061": "sm-Latn-WS",
			"und-142": "zh-Hans-CN",
			"und-143": "uz-Latn-UZ",
			"und-145": "ar-Arab-SA",
			"und-150": "ru-Cyrl-RU",
			"und-151": "ru-Cyrl-RU",
			"und-154": "en-Latn-GB",
			"und-155": "de-Latn-DE",
			"und-419": "es-Latn-419",
			"und-AD": "ca-Latn-AD",
			"und-AE": "ar-Arab-AE",
			"und-AF": "fa-Arab-AF",
			"und-AL": "sq-Latn-AL",
			"und-AM": "hy-Armn-AM",
			"und-AO": "pt-Latn-AO",
			"und-AQ": "und-Latn-AQ",
			"und-AR": "es-Latn-AR",
			"und-AS": "sm-Latn-AS",
			"und-AT": "de-Latn-AT",
			"und-AW": "nl-Latn-AW",
			"und-AX": "sv-Latn-AX",
			"und-AZ": "az-Latn-AZ",
			"und-Aghb": "lez-Aghb-RU",
			"und-Arab": "ar-Arab-EG",
			"und-Arab-CC": "ms-Arab-CC",
			"und-Arab-CN": "ug-Arab-CN",
			"und-Arab-GB": "ks-Arab-GB",
			"und-Arab-ID": "ms-Arab-ID",
			"und-Arab-IN": "ur-Arab-IN",
			"und-Arab-KH": "cja-Arab-KH",
			"und-Arab-MN": "kk-Arab-MN",
			"und-Arab-MU": "ur-Arab-MU",
			"und-Arab-NG": "ha-Arab-NG",
			"und-Arab-PK": "ur-Arab-PK",
			"und-Arab-TH": "mfa-Arab-TH",
			"und-Arab-TJ": "fa-Arab-TJ",
			"und-Arab-YT": "swb-Arab-YT",
			"und-Armi": "arc-Armi-IR",
			"und-Armn": "hy-Armn-AM",
			"und-Avst": "ae-Avst-IR",
			"und-BA": "bs-Latn-BA",
			"und-BD": "bn-Beng-BD",
			"und-BE": "nl-Latn-BE",
			"und-BF": "fr-Latn-BF",
			"und-BG": "bg-Cyrl-BG",
			"und-BH": "ar-Arab-BH",
			"und-BI": "rn-Latn-BI",
			"und-BJ": "fr-Latn-BJ",
			"und-BL": "fr-Latn-BL",
			"und-BN": "ms-Latn-BN",
			"und-BO": "es-Latn-BO",
			"und-BQ": "pap-Latn-BQ",
			"und-BR": "pt-Latn-BR",
			"und-BT": "dz-Tibt-BT",
			"und-BV": "und-Latn-BV",
			"und-BY": "be-Cyrl-BY",
			"und-Bali": "ban-Bali-ID",
			"und-Bamu": "bax-Bamu-CM",
			"und-Bass": "bsq-Bass-LR",
			"und-Batk": "bbc-Batk-ID",
			"und-Beng": "bn-Beng-BD",
			"und-Bopo": "zh-Bopo-TW",
			"und-Brah": "pka-Brah-IN",
			"und-Brai": "fr-Brai-FR",
			"und-Bugi": "bug-Bugi-ID",
			"und-Buhd": "bku-Buhd-PH",
			"und-CD": "sw-Latn-CD",
			"und-CF": "fr-Latn-CF",
			"und-CG": "fr-Latn-CG",
			"und-CH": "de-Latn-CH",
			"und-CI": "fr-Latn-CI",
			"und-CL": "es-Latn-CL",
			"und-CM": "fr-Latn-CM",
			"und-CN": "zh-Hans-CN",
			"und-CO": "es-Latn-CO",
			"und-CP": "und-Latn-CP",
			"und-CR": "es-Latn-CR",
			"und-CU": "es-Latn-CU",
			"und-CV": "pt-Latn-CV",
			"und-CW": "pap-Latn-CW",
			"und-CY": "el-Grek-CY",
			"und-CZ": "cs-Latn-CZ",
			"und-Cakm": "ccp-Cakm-BD",
			"und-Cans": "cr-Cans-CA",
			"und-Cari": "xcr-Cari-TR",
			"und-Cham": "cjm-Cham-VN",
			"und-Cher": "chr-Cher-US",
			"und-Copt": "cop-Copt-EG",
			"und-Cprt": "grc-Cprt-CY",
			"und-Cyrl": "ru-Cyrl-RU",
			"und-Cyrl-AL": "mk-Cyrl-AL",
			"und-Cyrl-BA": "sr-Cyrl-BA",
			"und-Cyrl-GE": "ab-Cyrl-GE",
			"und-Cyrl-GR": "mk-Cyrl-GR",
			"und-Cyrl-MD": "uk-Cyrl-MD",
			"und-Cyrl-PL": "be-Cyrl-PL",
			"und-Cyrl-RO": "bg-Cyrl-RO",
			"und-Cyrl-SK": "uk-Cyrl-SK",
			"und-Cyrl-TR": "kbd-Cyrl-TR",
			"und-Cyrl-XK": "sr-Cyrl-XK",
			"und-DE": "de-Latn-DE",
			"und-DJ": "aa-Latn-DJ",
			"und-DK": "da-Latn-DK",
			"und-DO": "es-Latn-DO",
			"und-DZ": "ar-Arab-DZ",
			"und-Deva": "hi-Deva-IN",
			"und-Deva-BT": "ne-Deva-BT",
			"und-Deva-FJ": "hif-Deva-FJ",
			"und-Deva-MU": "bho-Deva-MU",
			"und-Deva-PK": "btv-Deva-PK",
			"und-Dupl": "fr-Dupl-FR",
			"und-EA": "es-Latn-EA",
			"und-EC": "es-Latn-EC",
			"und-EE": "et-Latn-EE",
			"und-EG": "ar-Arab-EG",
			"und-EH": "ar-Arab-EH",
			"und-ER": "ti-Ethi-ER",
			"und-ES": "es-Latn-ES",
			"und-ET": "am-Ethi-ET",
			"und-EU": "en-Latn-GB",
			"und-Egyp": "egy-Egyp-EG",
			"und-Elba": "sq-Elba-AL",
			"und-Ethi": "am-Ethi-ET",
			"und-FI": "fi-Latn-FI",
			"und-FO": "fo-Latn-FO",
			"und-FR": "fr-Latn-FR",
			"und-GA": "fr-Latn-GA",
			"und-GE": "ka-Geor-GE",
			"und-GF": "fr-Latn-GF",
			"und-GH": "ak-Latn-GH",
			"und-GL": "kl-Latn-GL",
			"und-GN": "fr-Latn-GN",
			"und-GP": "fr-Latn-GP",
			"und-GQ": "es-Latn-GQ",
			"und-GR": "el-Grek-GR",
			"und-GS": "und-Latn-GS",
			"und-GT": "es-Latn-GT",
			"und-GW": "pt-Latn-GW",
			"und-Geor": "ka-Geor-GE",
			"und-Glag": "cu-Glag-BG",
			"und-Goth": "got-Goth-UA",
			"und-Gran": "sa-Gran-IN",
			"und-Grek": "el-Grek-GR",
			"und-Grek-TR": "bgx-Grek-TR",
			"und-Gujr": "gu-Gujr-IN",
			"und-Guru": "pa-Guru-IN",
			"und-HK": "zh-Hant-HK",
			"und-HM": "und-Latn-HM",
			"und-HN": "es-Latn-HN",
			"und-HR": "hr-Latn-HR",
			"und-HT": "ht-Latn-HT",
			"und-HU": "hu-Latn-HU",
			"und-Hang": "ko-Hang-KR",
			"und-Hani": "zh-Hani-CN",
			"und-Hano": "hnn-Hano-PH",
			"und-Hans": "zh-Hans-CN",
			"und-Hant": "zh-Hant-TW",
			"und-Hebr": "he-Hebr-IL",
			"und-Hebr-CA": "yi-Hebr-CA",
			"und-Hebr-GB": "yi-Hebr-GB",
			"und-Hebr-SE": "yi-Hebr-SE",
			"und-Hebr-UA": "yi-Hebr-UA",
			"und-Hebr-US": "yi-Hebr-US",
			"und-Hira": "ja-Hira-JP",
			"und-Hmng": "hnj-Hmng-LA",
			"und-IC": "es-Latn-IC",
			"und-ID": "id-Latn-ID",
			"und-IL": "he-Hebr-IL",
			"und-IN": "hi-Deva-IN",
			"und-IQ": "ar-Arab-IQ",
			"und-IR": "fa-Arab-IR",
			"und-IS": "is-Latn-IS",
			"und-IT": "it-Latn-IT",
			"und-Ital": "ett-Ital-IT",
			"und-JO": "ar-Arab-JO",
			"und-JP": "ja-Jpan-JP",
			"und-Java": "jv-Java-ID",
			"und-Jpan": "ja-Jpan-JP",
			"und-KE": "sw-Latn-KE",
			"und-KG": "ky-Cyrl-KG",
			"und-KH": "km-Khmr-KH",
			"und-KM": "ar-Arab-KM",
			"und-KP": "ko-Kore-KP",
			"und-KR": "ko-Kore-KR",
			"und-KW": "ar-Arab-KW",
			"und-KZ": "ru-Cyrl-KZ",
			"und-Kali": "eky-Kali-MM",
			"und-Kana": "ja-Kana-JP",
			"und-Khar": "pra-Khar-PK",
			"und-Khmr": "km-Khmr-KH",
			"und-Khoj": "sd-Khoj-IN",
			"und-Knda": "kn-Knda-IN",
			"und-Kore": "ko-Kore-KR",
			"und-Kthi": "bh-Kthi-IN",
			"und-LA": "lo-Laoo-LA",
			"und-LB": "ar-Arab-LB",
			"und-LI": "de-Latn-LI",
			"und-LK": "si-Sinh-LK",
			"und-LS": "st-Latn-LS",
			"und-LT": "lt-Latn-LT",
			"und-LU": "fr-Latn-LU",
			"und-LV": "lv-Latn-LV",
			"und-LY": "ar-Arab-LY",
			"und-Lana": "nod-Lana-TH",
			"und-Laoo": "lo-Laoo-LA",
			"und-Latn-AF": "tk-Latn-AF",
			"und-Latn-AM": "ku-Latn-AM",
			"und-Latn-CN": "za-Latn-CN",
			"und-Latn-CY": "tr-Latn-CY",
			"und-Latn-DZ": "fr-Latn-DZ",
			"und-Latn-ET": "en-Latn-ET",
			"und-Latn-GE": "ku-Latn-GE",
			"und-Latn-IR": "tk-Latn-IR",
			"und-Latn-KM": "fr-Latn-KM",
			"und-Latn-MA": "fr-Latn-MA",
			"und-Latn-MK": "sq-Latn-MK",
			"und-Latn-MM": "kac-Latn-MM",
			"und-Latn-MO": "pt-Latn-MO",
			"und-Latn-MR": "fr-Latn-MR",
			"und-Latn-RU": "krl-Latn-RU",
			"und-Latn-SY": "fr-Latn-SY",
			"und-Latn-TN": "fr-Latn-TN",
			"und-Latn-TW": "trv-Latn-TW",
			"und-Latn-UA": "pl-Latn-UA",
			"und-Lepc": "lep-Lepc-IN",
			"und-Limb": "lif-Limb-IN",
			"und-Lina": "lab-Lina-GR",
			"und-Linb": "grc-Linb-GR",
			"und-Lisu": "lis-Lisu-CN",
			"und-Lyci": "xlc-Lyci-TR",
			"und-Lydi": "xld-Lydi-TR",
			"und-MA": "ar-Arab-MA",
			"und-MC": "fr-Latn-MC",
			"und-MD": "ro-Latn-MD",
			"und-ME": "sr-Latn-ME",
			"und-MF": "fr-Latn-MF",
			"und-MG": "mg-Latn-MG",
			"und-MK": "mk-Cyrl-MK",
			"und-ML": "bm-Latn-ML",
			"und-MM": "my-Mymr-MM",
			"und-MN": "mn-Cyrl-MN",
			"und-MO": "zh-Hant-MO",
			"und-MQ": "fr-Latn-MQ",
			"und-MR": "ar-Arab-MR",
			"und-MT": "mt-Latn-MT",
			"und-MU": "mfe-Latn-MU",
			"und-MV": "dv-Thaa-MV",
			"und-MX": "es-Latn-MX",
			"und-MY": "ms-Latn-MY",
			"und-MZ": "pt-Latn-MZ",
			"und-Mahj": "hi-Mahj-IN",
			"und-Mand": "myz-Mand-IR",
			"und-Mani": "xmn-Mani-CN",
			"und-Mend": "men-Mend-SL",
			"und-Merc": "xmr-Merc-SD",
			"und-Mero": "xmr-Mero-SD",
			"und-Mlym": "ml-Mlym-IN",
			"und-Modi": "mr-Modi-IN",
			"und-Mong": "mn-Mong-CN",
			"und-Mroo": "mru-Mroo-BD",
			"und-Mtei": "mni-Mtei-IN",
			"und-Mymr": "my-Mymr-MM",
			"und-Mymr-IN": "kht-Mymr-IN",
			"und-Mymr-TH": "mnw-Mymr-TH",
			"und-NA": "af-Latn-NA",
			"und-NC": "fr-Latn-NC",
			"und-NE": "ha-Latn-NE",
			"und-NI": "es-Latn-NI",
			"und-NL": "nl-Latn-NL",
			"und-NO": "nb-Latn-NO",
			"und-NP": "ne-Deva-NP",
			"und-Narb": "xna-Narb-SA",
			"und-Nbat": "arc-Nbat-JO",
			"und-Nkoo": "man-Nkoo-GN",
			"und-OM": "ar-Arab-OM",
			"und-Ogam": "sga-Ogam-IE",
			"und-Olck": "sat-Olck-IN",
			"und-Orkh": "otk-Orkh-MN",
			"und-Orya": "or-Orya-IN",
			"und-Osma": "so-Osma-SO",
			"und-PA": "es-Latn-PA",
			"und-PE": "es-Latn-PE",
			"und-PF": "fr-Latn-PF",
			"und-PG": "tpi-Latn-PG",
			"und-PH": "fil-Latn-PH",
			"und-PK": "ur-Arab-PK",
			"und-PL": "pl-Latn-PL",
			"und-PM": "fr-Latn-PM",
			"und-PR": "es-Latn-PR",
			"und-PS": "ar-Arab-PS",
			"und-PT": "pt-Latn-PT",
			"und-PW": "pau-Latn-PW",
			"und-PY": "gn-Latn-PY",
			"und-Palm": "arc-Palm-SY",
			"und-Pauc": "ctd-Pauc-MM",
			"und-Perm": "kv-Perm-RU",
			"und-Phag": "lzh-Phag-CN",
			"und-Phli": "pal-Phli-IR",
			"und-Phlp": "pal-Phlp-CN",
			"und-Phnx": "phn-Phnx-LB",
			"und-Plrd": "hmd-Plrd-CN",
			"und-Prti": "xpr-Prti-IR",
			"und-QA": "ar-Arab-QA",
			"und-QO": "en-Latn-IO",
			"und-RE": "fr-Latn-RE",
			"und-RO": "ro-Latn-RO",
			"und-RS": "sr-Cyrl-RS",
			"und-RU": "ru-Cyrl-RU",
			"und-RW": "rw-Latn-RW",
			"und-Rjng": "rej-Rjng-ID",
			"und-Runr": "non-Runr-SE",
			"und-SA": "ar-Arab-SA",
			"und-SC": "fr-Latn-SC",
			"und-SD": "ar-Arab-SD",
			"und-SE": "sv-Latn-SE",
			"und-SI": "sl-Latn-SI",
			"und-SJ": "nb-Latn-SJ",
			"und-SK": "sk-Latn-SK",
			"und-SM": "it-Latn-SM",
			"und-SN": "fr-Latn-SN",
			"und-SO": "so-Latn-SO",
			"und-SR": "nl-Latn-SR",
			"und-ST": "pt-Latn-ST",
			"und-SV": "es-Latn-SV",
			"und-SY": "ar-Arab-SY",
			"und-Samr": "smp-Samr-IL",
			"und-Sarb": "xsa-Sarb-YE",
			"und-Saur": "saz-Saur-IN",
			"und-Shaw": "en-Shaw-GB",
			"und-Shrd": "sa-Shrd-IN",
			"und-Sidd": "sa-Sidd-IN",
			"und-Sind": "sd-Sind-IN",
			"und-Sinh": "si-Sinh-LK",
			"und-Sora": "srb-Sora-IN",
			"und-Sund": "su-Sund-ID",
			"und-Sylo": "syl-Sylo-BD",
			"und-Syrc": "syr-Syrc-IQ",
			"und-TD": "fr-Latn-TD",
			"und-TF": "fr-Latn-TF",
			"und-TG": "fr-Latn-TG",
			"und-TH": "th-Thai-TH",
			"und-TJ": "tg-Cyrl-TJ",
			"und-TK": "tkl-Latn-TK",
			"und-TL": "pt-Latn-TL",
			"und-TM": "tk-Latn-TM",
			"und-TN": "ar-Arab-TN",
			"und-TO": "to-Latn-TO",
			"und-TR": "tr-Latn-TR",
			"und-TV": "tvl-Latn-TV",
			"und-TW": "zh-Hant-TW",
			"und-TZ": "sw-Latn-TZ",
			"und-Tagb": "tbw-Tagb-PH",
			"und-Takr": "doi-Takr-IN",
			"und-Tale": "tdd-Tale-CN",
			"und-Talu": "khb-Talu-CN",
			"und-Taml": "ta-Taml-IN",
			"und-Tavt": "blt-Tavt-VN",
			"und-Telu": "te-Telu-IN",
			"und-Tfng": "zgh-Tfng-MA",
			"und-Tglg": "fil-Tglg-PH",
			"und-Thaa": "dv-Thaa-MV",
			"und-Thai": "th-Thai-TH",
			"und-Thai-CN": "lcp-Thai-CN",
			"und-Thai-KH": "kdt-Thai-KH",
			"und-Thai-LA": "kdt-Thai-LA",
			"und-Tibt": "bo-Tibt-CN",
			"und-Tirh": "mai-Tirh-IN",
			"und-UA": "uk-Cyrl-UA",
			"und-UG": "sw-Latn-UG",
			"und-UY": "es-Latn-UY",
			"und-UZ": "uz-Latn-UZ",
			"und-Ugar": "uga-Ugar-SY",
			"und-VA": "it-Latn-VA",
			"und-VE": "es-Latn-VE",
			"und-VN": "vi-Latn-VN",
			"und-VU": "bi-Latn-VU",
			"und-Vaii": "vai-Vaii-LR",
			"und-WF": "fr-Latn-WF",
			"und-WS": "sm-Latn-WS",
			"und-Wara": "hoc-Wara-IN",
			"und-XK": "sq-Latn-XK",
			"und-Xpeo": "peo-Xpeo-IR",
			"und-Xsux": "akk-Xsux-IQ",
			"und-YE": "ar-Arab-YE",
			"und-YT": "fr-Latn-YT",
			"und-Yiii": "ii-Yiii-CN",
			"und-ZW": "sn-Latn-ZW",
			"unr": "unr-Beng-IN",
			"unr-Deva": "unr-Deva-NP",
			"unr-NP": "unr-Deva-NP",
			"unx": "unx-Beng-IN",
			"ur": "ur-Arab-PK",
			"uz": "uz-Latn-UZ",
			"uz-AF": "uz-Arab-AF",
			"uz-Arab": "uz-Arab-AF",
			"uz-CN": "uz-Cyrl-CN",
			"vai": "vai-Vaii-LR",
			"ve": "ve-Latn-ZA",
			"vec": "vec-Latn-IT",
			"vep": "vep-Latn-RU",
			"vi": "vi-Latn-VN",
			"vic": "vic-Latn-SX",
			"vls": "vls-Latn-BE",
			"vmf": "vmf-Latn-DE",
			"vmw": "vmw-Latn-MZ",
			"vo": "vo-Latn-001",
			"vot": "vot-Latn-RU",
			"vro": "vro-Latn-EE",
			"vun": "vun-Latn-TZ",
			"wa": "wa-Latn-BE",
			"wae": "wae-Latn-CH",
			"wal": "wal-Ethi-ET",
			"war": "war-Latn-PH",
			"wbp": "wbp-Latn-AU",
			"wbq": "wbq-Telu-IN",
			"wbr": "wbr-Deva-IN",
			"wls": "wls-Latn-WF",
			"wo": "wo-Latn-SN",
			"wtm": "wtm-Deva-IN",
			"wuu": "wuu-Hans-CN",
			"xav": "xav-Latn-BR",
			"xcr": "xcr-Cari-TR",
			"xh": "xh-Latn-ZA",
			"xlc": "xlc-Lyci-TR",
			"xld": "xld-Lydi-TR",
			"xmf": "xmf-Geor-GE",
			"xmn": "xmn-Mani-CN",
			"xmr": "xmr-Merc-SD",
			"xna": "xna-Narb-SA",
			"xnr": "xnr-Deva-IN",
			"xog": "xog-Latn-UG",
			"xpr": "xpr-Prti-IR",
			"xsa": "xsa-Sarb-YE",
			"xsr": "xsr-Deva-NP",
			"yao": "yao-Latn-MZ",
			"yap": "yap-Latn-FM",
			"yav": "yav-Latn-CM",
			"ybb": "ybb-Latn-CM",
			"yi": "yi-Hebr-001",
			"yo": "yo-Latn-NG",
			"yrl": "yrl-Latn-BR",
			"yua": "yua-Latn-MX",
			"za": "za-Latn-CN",
			"zdj": "zdj-Arab-KM",
			"zea": "zea-Latn-NL",
			"zgh": "zgh-Tfng-MA",
			"zh": "zh-Hans-CN",
			"zh-AU": "zh-Hant-AU",
			"zh-BN": "zh-Hant-BN",
			"zh-Bopo": "zh-Bopo-TW",
			"zh-GB": "zh-Hant-GB",
			"zh-GF": "zh-Hant-GF",
			"zh-HK": "zh-Hant-HK",
			"zh-Hant": "zh-Hant-TW",
			"zh-ID": "zh-Hant-ID",
			"zh-MO": "zh-Hant-MO",
			"zh-MY": "zh-Hant-MY",
			"zh-PA": "zh-Hant-PA",
			"zh-PF": "zh-Hant-PF",
			"zh-PH": "zh-Hant-PH",
			"zh-SR": "zh-Hant-SR",
			"zh-TH": "zh-Hant-TH",
			"zh-TW": "zh-Hant-TW",
			"zh-US": "zh-Hant-US",
			"zh-VN": "zh-Hant-VN",
			"zmi": "zmi-Latn-MY",
			"zu": "zu-Latn-ZA",
			"zza": "zza-Latn-TR"
		}
	}
});

Globalize.load({
	"supplemental": {
		"version": {
			"_unicodeVersion": "7.0.0",
			"_number": "$Revision: 11318 $"
		},
		"generation": {
			"_date": "$Date: 2015-02-25 23:47:56 -0600 (Wed, 25 Feb 2015) $"
		},
		"timeData": {
			"001": {
				"_allowed": "H h",
				"_preferred": "H"
			},
			"AD": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"AE": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"AG": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"AL": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"AM": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"AO": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"AS": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"AT": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"AU": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"AW": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"AX": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"BB": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"BD": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"BE": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"BF": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"BH": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"BJ": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"BL": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"BM": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"BN": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"BQ": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"BR": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"BS": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"BT": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"BW": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"CA": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"CD": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"CG": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"CI": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"CN": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"CO": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"CP": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"CV": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"CY": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"CZ": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"DE": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"DJ": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"DK": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"DM": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"DZ": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"EE": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"EG": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"EH": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"ER": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"ET": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"FI": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"FJ": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"FM": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"FR": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"GA": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"GD": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"GF": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"GH": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"GL": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"GM": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"GN": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"GP": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"GR": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"GU": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"GW": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"GY": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"HK": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"HR": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"ID": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"IL": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"IN": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"IQ": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"IS": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"IT": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"JM": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"JO": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"JP": {
				"_allowed": "H K h",
				"_preferred": "H"
			},
			"KH": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"KI": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"KN": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"KP": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"KR": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"KW": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"KY": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"LB": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"LC": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"LR": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"LS": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"LY": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"MA": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"MC": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"MD": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"MF": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"MH": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"ML": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"MO": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"MP": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"MQ": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"MR": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"MW": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"MY": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"MZ": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"NA": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"NC": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"NE": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"NG": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"NL": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"NZ": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"OM": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"PG": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"PK": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"PM": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"PR": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"PS": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"PT": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"PW": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"QA": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"RE": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"RO": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"RU": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"SA": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"SB": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"SD": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"SE": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"SG": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"SI": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"SJ": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"SK": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"SL": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"SM": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"SO": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"SR": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"SS": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"ST": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"SY": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"SZ": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"TC": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"TD": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"TG": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"TN": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"TR": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"TT": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"TW": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"UM": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"US": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"VC": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"VG": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"VI": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"VU": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"WF": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"WS": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"YE": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"YT": {
				"_allowed": "H",
				"_preferred": "H"
			},
			"ZA": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"ZM": {
				"_allowed": "H h",
				"_preferred": "h"
			},
			"ZW": {
				"_allowed": "H h",
				"_preferred": "h"
			}
		}
	}
});

Globalize.load({
	"supplemental": {
		"version": {
			"_unicodeVersion": "7.0.0",
			"_number": "$Revision: 11318 $"
		},
		"generation": {
			"_date": "$Date: 2015-02-25 23:47:56 -0600 (Wed, 25 Feb 2015) $"
		},
		"weekData": {
			"minDays": {
				"001": "1",
				"GU": "1",
				"UM": "1",
				"US": "1",
				"VI": "1",
				"AD": "4",
				"AN": "4",
				"AT": "4",
				"AX": "4",
				"BE": "4",
				"BG": "4",
				"CH": "4",
				"CZ": "4",
				"DE": "4",
				"DK": "4",
				"EE": "4",
				"ES": "4",
				"FI": "4",
				"FJ": "4",
				"FO": "4",
				"FR": "4",
				"GB": "4",
				"GF": "4",
				"GG": "4",
				"GI": "4",
				"GP": "4",
				"GR": "4",
				"HU": "4",
				"IE": "4",
				"IM": "4",
				"IS": "4",
				"IT": "4",
				"JE": "4",
				"LI": "4",
				"LT": "4",
				"LU": "4",
				"MC": "4",
				"MQ": "4",
				"NL": "4",
				"NO": "4",
				"PL": "4",
				"PT": "4",
				"RE": "4",
				"SE": "4",
				"SJ": "4",
				"SK": "4",
				"SM": "4",
				"VA": "4"
			},
			"firstDay": {
				"001": "mon",
				"AD": "mon",
				"AI": "mon",
				"AL": "mon",
				"AM": "mon",
				"AN": "mon",
				"AT": "mon",
				"AX": "mon",
				"AZ": "mon",
				"BA": "mon",
				"BE": "mon",
				"BG": "mon",
				"BM": "mon",
				"BN": "mon",
				"BY": "mon",
				"CH": "mon",
				"CL": "mon",
				"CM": "mon",
				"CR": "mon",
				"CY": "mon",
				"CZ": "mon",
				"DE": "mon",
				"DK": "mon",
				"EC": "mon",
				"EE": "mon",
				"ES": "mon",
				"FI": "mon",
				"FJ": "mon",
				"FO": "mon",
				"FR": "mon",
				"GB": "mon",
				"GE": "mon",
				"GF": "mon",
				"GP": "mon",
				"GR": "mon",
				"HR": "mon",
				"HU": "mon",
				"IS": "mon",
				"IT": "mon",
				"KG": "mon",
				"KZ": "mon",
				"LB": "mon",
				"LI": "mon",
				"LK": "mon",
				"LT": "mon",
				"LU": "mon",
				"LV": "mon",
				"MC": "mon",
				"MD": "mon",
				"ME": "mon",
				"MK": "mon",
				"MN": "mon",
				"MQ": "mon",
				"MY": "mon",
				"NL": "mon",
				"NO": "mon",
				"PL": "mon",
				"PT": "mon",
				"RE": "mon",
				"RO": "mon",
				"RS": "mon",
				"RU": "mon",
				"SE": "mon",
				"SI": "mon",
				"SK": "mon",
				"SM": "mon",
				"TJ": "mon",
				"TM": "mon",
				"TR": "mon",
				"UA": "mon",
				"UY": "mon",
				"UZ": "mon",
				"VA": "mon",
				"VN": "mon",
				"XK": "mon",
				"AE": "sat",
				"AF": "sat",
				"BH": "sat",
				"DJ": "sat",
				"DZ": "sat",
				"EG": "sat",
				"IQ": "sat",
				"IR": "sat",
				"JO": "sat",
				"KW": "sat",
				"LY": "sat",
				"MA": "sat",
				"OM": "sat",
				"QA": "sat",
				"SD": "sat",
				"SY": "sat",
				"AG": "sun",
				"AR": "sun",
				"AS": "sun",
				"AU": "sun",
				"BR": "sun",
				"BS": "sun",
				"BT": "sun",
				"BW": "sun",
				"BZ": "sun",
				"CA": "sun",
				"CN": "sun",
				"CO": "sun",
				"DM": "sun",
				"DO": "sun",
				"ET": "sun",
				"GT": "sun",
				"GU": "sun",
				"HK": "sun",
				"HN": "sun",
				"ID": "sun",
				"IE": "sun",
				"IL": "sun",
				"IN": "sun",
				"JM": "sun",
				"JP": "sun",
				"KE": "sun",
				"KH": "sun",
				"KR": "sun",
				"LA": "sun",
				"MH": "sun",
				"MM": "sun",
				"MO": "sun",
				"MT": "sun",
				"MX": "sun",
				"MZ": "sun",
				"NI": "sun",
				"NP": "sun",
				"NZ": "sun",
				"PA": "sun",
				"PE": "sun",
				"PH": "sun",
				"PK": "sun",
				"PR": "sun",
				"PY": "sun",
				"SA": "sun",
				"SG": "sun",
				"SV": "sun",
				"TH": "sun",
				"TN": "sun",
				"TT": "sun",
				"TW": "sun",
				"UM": "sun",
				"US": "sun",
				"VE": "sun",
				"VI": "sun",
				"WS": "sun",
				"YE": "sun",
				"ZA": "sun",
				"ZW": "sun",
				"BD": "fri",
				"MV": "fri"
			},
			"firstDay-alt-variant": {
				"GB": "sun"
			},
			"weekendStart": {
				"001": "sat",
				"AE": "fri",
				"BH": "fri",
				"DZ": "fri",
				"EG": "fri",
				"IL": "fri",
				"IQ": "fri",
				"IR": "fri",
				"JO": "fri",
				"KW": "fri",
				"LY": "fri",
				"MA": "fri",
				"OM": "fri",
				"QA": "fri",
				"SA": "fri",
				"SD": "fri",
				"SY": "fri",
				"TN": "fri",
				"YE": "fri",
				"AF": "thu",
				"IN": "sun"
			},
			"weekendEnd": {
				"001": "sun",
				"AE": "sat",
				"BH": "sat",
				"DZ": "sat",
				"EG": "sat",
				"IL": "sat",
				"IQ": "sat",
				"JO": "sat",
				"KW": "sat",
				"LY": "sat",
				"MA": "sat",
				"OM": "sat",
				"QA": "sat",
				"SA": "sat",
				"SD": "sat",
				"SY": "sat",
				"TN": "sat",
				"YE": "sat",
				"AF": "fri",
				"IR": "fri"
			}
		}
	}
});

return Globalize;

} ) );
