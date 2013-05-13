/*
       JavaScript functions for the Fourmilab Calendar Converter

                  by John Walker  --  September, MIM
              http://www.fourmilab.ch/documents/calendar/

                This program is in the public domain.
*/

/*  You may notice that a variety of array variables logically local
    to functions are declared globally here.  In JavaScript, construction
    of an array variable from source code occurs as the code is
    interpreted.  Making these variables pseudo-globals permits us
    to avoid overhead constructing and disposing of them in each
    call on the function in which whey are used.  */

var J0000 = 1721424.5;                // Julian date of Gregorian epoch: 0000-01-01
var J1970 = 2440587.5;                // Julian date at Unix epoch: 1970-01-01
var JMJD  = 2400000.5;                // Epoch of Modified Julian Date system
var J1900 = 2415020.5;                // Epoch (day 1) of Excel 1900 date system (PC)
var J1904 = 2416480.5;                // Epoch (day 0) of Excel 1904 date system (Mac)

var NormLeap = new Array("Normal year", "Leap year");

/*  WEEKDAY_BEFORE  --  Return Julian date of given weekday (0 = Sunday)
                        in the seven days ending on jd.  */

function weekday_before(weekday, jd)
{
    return jd - jwday(jd - weekday);
}

/*  SEARCH_WEEKDAY  --  Determine the Julian date for: 

            weekday      Day of week desired, 0 = Sunday
            jd           Julian date to begin search
            direction    1 = next weekday, -1 = last weekday
            offset       Offset from jd to begin search
*/

function search_weekday(weekday, jd, direction, offset)
{
    return weekday_before(weekday, jd + (direction * offset));
}

//  Utility weekday functions, just wrappers for search_weekday

function nearest_weekday(weekday, jd)
{
    return search_weekday(weekday, jd, 1, 3);
}

function next_weekday(weekday, jd)
{
    return search_weekday(weekday, jd, 1, 7);
}

function next_or_current_weekday(weekday, jd)
{
    return search_weekday(weekday, jd, 1, 6);
}

function previous_weekday(weekday, jd)
{
    return search_weekday(weekday, jd, -1, 1);
}

function previous_or_current_weekday(weekday, jd)
{
    return search_weekday(weekday, jd, 1, 0);
}

function TestSomething()
{
}

//  LEAP_GREGORIAN  --  Is a given year in the Gregorian calendar a leap year ?

function leap_gregorian(year)
{
    return ((year % 4) == 0) &&
            (!(((year % 100) == 0) && ((year % 400) != 0)));
}

//  GREGORIAN_TO_JD  --  Determine Julian day number from Gregorian calendar date

var GREGORIAN_EPOCH = 1721425.5;

function gregorian_to_jd(year, month, day)
{
    return (GREGORIAN_EPOCH - 1) +
           (365 * (year - 1)) +
           Math.floor((year - 1) / 4) +
           (-Math.floor((year - 1) / 100)) +
           Math.floor((year - 1) / 400) +
           Math.floor((((367 * month) - 362) / 12) +
           ((month <= 2) ? 0 :
                               (leap_gregorian(year) ? -1 : -2)
           ) +
           day);
}

//  JD_TO_GREGORIAN  --  Calculate Gregorian calendar date from Julian day

function jd_to_gregorian(jd) {
    var wjd, depoch, quadricent, dqc, cent, dcent, quad, dquad,
        yindex, dyindex, year, yearday, leapadj;

    wjd = Math.floor(jd - 0.5) + 0.5;
    depoch = wjd - GREGORIAN_EPOCH;
    quadricent = Math.floor(depoch / 146097);
    dqc = mod(depoch, 146097);
    cent = Math.floor(dqc / 36524);
    dcent = mod(dqc, 36524);
    quad = Math.floor(dcent / 1461);
    dquad = mod(dcent, 1461);
    yindex = Math.floor(dquad / 365);
    year = (quadricent * 400) + (cent * 100) + (quad * 4) + yindex;
    if (!((cent == 4) || (yindex == 4))) {
        year++;
    }
    yearday = wjd - gregorian_to_jd(year, 1, 1);
    leapadj = ((wjd < gregorian_to_jd(year, 3, 1)) ? 0
                                                  :
                  (leap_gregorian(year) ? 1 : 2)
              );
    month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);
    day = (wjd - gregorian_to_jd(year, month, 1)) + 1;

    return new Array(year, month, day);
}

//  ISO_TO_JULIAN  --  Return Julian day of given ISO year, week, and day

function n_weeks(weekday, jd, nthweek)
{
    var j = 7 * nthweek;

    if (nthweek > 0) {
        j += previous_weekday(weekday, jd);
    } else {
        j += next_weekday(weekday, jd);
    }
    return j;
}

function iso_to_julian(year, week, day)
{
    return day + n_weeks(0, gregorian_to_jd(year - 1, 12, 28), week);
}

//  JD_TO_ISO  --  Return array of ISO (year, week, day) for Julian day

function jd_to_iso(jd)
{
    var year, week, day;

    year = jd_to_gregorian(jd - 3)[0];
    if (jd >= iso_to_julian(year + 1, 1, 1)) {
        year++;
    }
    week = Math.floor((jd - iso_to_julian(year, 1, 1)) / 7) + 1;
    day = jwday(jd);
    if (day == 0) {
        day = 7;
    }
    return new Array(year, week, day);
}

//  ISO_DAY_TO_JULIAN  --  Return Julian day of given ISO year, and day of year

function iso_day_to_julian(year, day)
{
    return (day - 1) + gregorian_to_jd(year, 1, 1);
}

//  JD_TO_ISO_DAY  --  Return array of ISO (year, day_of_year) for Julian day

function jd_to_iso_day(jd)
{
    var year, day;

    year = jd_to_gregorian(jd)[0];
    day = Math.floor(jd - gregorian_to_jd(year, 1, 1)) + 1;
    return new Array(year, day);
}

/*  PAD  --  Pad a string to a given length with a given fill character.  */

function pad(str, howlong, padwith) {
    var s = str.toString();

    while (s.length < howlong) {
        s = padwith + s;
    }
    return s;
}

//  JULIAN_TO_JD  --  Determine Julian day number from Julian calendar date

var JULIAN_EPOCH = 1721423.5;

function leap_julian(year)
{
    return mod(year, 4) == ((year > 0) ? 0 : 3);
}

function julian_to_jd(year, month, day)
{

    /* Adjust negative common era years to the zero-based notation we use.  */

    if (year < 1) {
        year++;
    }

    /* Algorithm as given in Meeus, Astronomical Algorithms, Chapter 7, page 61 */

    if (month <= 2) {
        year--;
        month += 12;
    }

    return ((Math.floor((365.25 * (year + 4716))) +
            Math.floor((30.6001 * (month + 1))) +
            day) - 1524.5);
}

//  JD_TO_JULIAN  --  Calculate Julian calendar date from Julian day

function jd_to_julian(td) {
    var z, a, alpha, b, c, d, e, year, month, day;

    td += 0.5;
    z = Math.floor(td);

    a = z;
    b = a + 1524;
    c = Math.floor((b - 122.1) / 365.25);
    d = Math.floor(365.25 * c);
    e = Math.floor((b - d) / 30.6001);

    month = Math.floor((e < 14) ? (e - 1) : (e - 13));
    year = Math.floor((month > 2) ? (c - 4716) : (c - 4715));
    day = b - d - Math.floor(30.6001 * e);

    /*  If year is less than 1, subtract one to convert from
        a zero based date system to the common era system in
        which the year -1 (1 B.C.E) is followed by year 1 (1 C.E.).  */

    if (year < 1) {
        year--;
    }

    return new Array(year, month, day);
}

//  HEBREW_TO_JD  --  Determine Julian day from Hebrew date

var HEBREW_EPOCH = 347995.5;

//  Is a given Hebrew year a leap year ?

function hebrew_leap(year)
{
    return mod(((year * 7) + 1), 19) < 7;
}

//  How many months are there in a Hebrew year (12 = normal, 13 = leap)

function hebrew_year_months(year)
{
    return hebrew_leap(year) ? 13 : 12;
}

//  Test for delay of start of new year and to avoid
//  Sunday, Wednesday, and Friday as start of the new year.

function hebrew_delay_1(year)
{
    var months, days, parts;

    months = Math.floor(((235 * year) - 234) / 19);
    parts = 12084 + (13753 * months);
    day = (months * 29) + Math.floor(parts / 25920);

    if (mod((3 * (day + 1)), 7) < 3) {
        day++;
    }
    return day;
}

//  Check for delay in start of new year due to length of adjacent years

function hebrew_delay_2(year)
{
    var last, present, next;

    last = hebrew_delay_1(year - 1);
    present = hebrew_delay_1(year);
    next = hebrew_delay_1(year + 1);

    return ((next - present) == 356) ? 2 :
                                     (((present - last) == 382) ? 1 : 0);
}

//  How many days are in a Hebrew year ?

function hebrew_year_days(year)
{
    return hebrew_to_jd(year + 1, 7, 1) - hebrew_to_jd(year, 7, 1);
}

//  How many days are in a given month of a given year

function hebrew_month_days(year, month)
{
    //  First of all, dispose of fixed-length 29 day months

    if (month == 2 || month == 4 || month == 6 ||
        month == 10 || month == 13) {
        return 29;
    }

    //  If it's not a leap year, Adar has 29 days

    if (month == 12 && !hebrew_leap(year)) {
        return 29;
    }

    //  If it's Heshvan, days depend on length of year

    if (month == 8 && !(mod(hebrew_year_days(year), 10) == 5)) {
        return 29;
    }

    //  Similarly, Kislev varies with the length of year

    if (month == 9 && (mod(hebrew_year_days(year), 10) == 3)) {
        return 29;
    }

    //  Nope, it's a 30 day month

    return 30;
}

//  Finally, wrap it all up into...

function hebrew_to_jd(year, month, day)
{
    var jd, mon, months;

    months = hebrew_year_months(year);
    jd = HEBREW_EPOCH + hebrew_delay_1(year) +
         hebrew_delay_2(year) + day + 1;

    if (month < 7) {
        for (mon = 7; mon <= months; mon++) {
            jd += hebrew_month_days(year, mon);
        }
        for (mon = 1; mon < month; mon++) {
            jd += hebrew_month_days(year, mon);
        }
    } else {
        for (mon = 7; mon < month; mon++) {
            jd += hebrew_month_days(year, mon);
        }
    }

    return jd;
}

/*  JD_TO_HEBREW  --  Convert Julian date to Hebrew date
                      This works by making multiple calls to
                      the inverse function, and is this very
                      slow.  */

function jd_to_hebrew(jd)
{
    var year, month, day, i, count, first;

    jd = Math.floor(jd) + 0.5;
    count = Math.floor(((jd - HEBREW_EPOCH) * 98496.0) / 35975351.0);
    year = count - 1;
    for (i = count; jd >= hebrew_to_jd(i, 7, 1); i++) {
        year++;
    }
    first = (jd < hebrew_to_jd(year, 1, 1)) ? 7 : 1;
    month = first;
    for (i = first; jd > hebrew_to_jd(year, i, hebrew_month_days(year, i)); i++) {
        month++;
    }
    day = (jd - hebrew_to_jd(year, month, 1)) + 1;
    return new Array(year, month, day);
}

/*  EQUINOXE_A_PARIS  --  Determine Julian day and fraction of the
                          September equinox at the Paris meridian in
                          a given Gregorian year.  */

function equinoxe_a_paris(year)
{
    var equJED, equJD, equAPP, equParis, dtParis;

    //  September equinox in dynamical time
    equJED = equinox(year, 2);

    //  Correct for delta T to obtain Universal time
    equJD = equJED - (deltat(year) / (24 * 60 * 60));

    //  Apply the equation of time to yield the apparent time at Greenwich
    equAPP = equJD + equationOfTime(equJED);

    /*  Finally, we must correct for the constant difference between
        the Greenwich meridian and that of Paris, 2°20'15" to the
        East.  */

    dtParis = (2 + (20 / 60.0) + (15 / (60 * 60.0))) / 360;
    equParis = equAPP + dtParis;

    return equParis;
}

/*  PARIS_EQUINOXE_JD  --  Calculate Julian day during which the
                           September equinox, reckoned from the Paris
                           meridian, occurred for a given Gregorian
                           year.  */

function paris_equinoxe_jd(year)
{
    var ep, epg;

    ep = equinoxe_a_paris(year);
    epg = Math.floor(ep - 0.5) + 0.5;

    return epg;
}

/*  ANNEE_DE_LA_REVOLUTION  --  Determine the year in the French
                                revolutionary calendar in which a
                                given Julian day falls.  Returns an
                                array of two elements:

                                    [0]  Année de la Révolution
                                    [1]  Julian day number containing
                                         equinox for this year.
*/

var FRENCH_REVOLUTIONARY_EPOCH = 2375839.5;

function annee_da_la_revolution(jd)
{
    var guess = jd_to_gregorian(jd)[0] - 2,
        lasteq, nexteq, adr;

    lasteq = paris_equinoxe_jd(guess);
    while (lasteq > jd) {
        guess--;
        lasteq = paris_equinoxe_jd(guess);
    }
    nexteq = lasteq - 1;
    while (!((lasteq <= jd) && (jd < nexteq))) {
        lasteq = nexteq;
        guess++;
        nexteq = paris_equinoxe_jd(guess);
    }
    adr = Math.round((lasteq - FRENCH_REVOLUTIONARY_EPOCH) / TropicalYear) + 1;

    return new Array(adr, lasteq);
}

/*  JD_TO_FRENCH_REVOLUTIONARY  --  Calculate date in the French Revolutionary
                                    calendar from Julian day.  The five or six
                                    "sansculottides" are considered a thirteenth
                                    month in the results of this function.  */

function jd_to_french_revolutionary(jd)
{
    var an, mois, decade, jour,
        adr, equinoxe;

    jd = Math.floor(jd) + 0.5;
    adr = annee_da_la_revolution(jd);
    an = adr[0];
    equinoxe = adr[1];
    mois = Math.floor((jd - equinoxe) / 30) + 1;
    jour = (jd - equinoxe) % 30;
    decade = Math.floor(jour / 10) + 1;
    jour = (jour % 10) + 1;

    return new Array(an, mois, decade, jour);
}

/*  FRENCH_REVOLUTIONARY_TO_JD  --  Obtain Julian day from a given French
                                    Revolutionary calendar date.  */

function french_revolutionary_to_jd(an, mois, decade, jour)
{
    var adr, equinoxe, guess, jd;

    guess = FRENCH_REVOLUTIONARY_EPOCH + (TropicalYear * ((an - 1) - 1));
    adr = new Array(an - 1, 0);

    while (adr[0] < an) {
        adr = annee_da_la_revolution(guess);
        guess = adr[1] + (TropicalYear + 2);
    }
    equinoxe = adr[1];

    jd = equinoxe + (30 * (mois - 1)) + (10 * (decade - 1)) + (jour - 1);
    return jd;
}

//  LEAP_ISLAMIC  --  Is a given year a leap year in the Islamic calendar ?

function leap_islamic(year)
{
    return (((year * 11) + 14) % 30) < 11;
}

//  ISLAMIC_TO_JD  --  Determine Julian day from Islamic date

var ISLAMIC_EPOCH = 1948439.5;
var ISLAMIC_WEEKDAYS = new Array("al-'ahad", "al-'ithnayn",
                                 "ath-thalatha'", "al-'arb`a'",
                                 "al-khamis", "al-jum`a", "as-sabt");

function islamic_to_jd(year, month, day)
{
    return (day +
            Math.ceil(29.5 * (month - 1)) +
            (year - 1) * 354 +
            Math.floor((3 + (11 * year)) / 30) +
            ISLAMIC_EPOCH) - 1;
}

//  JD_TO_ISLAMIC  --  Calculate Islamic date from Julian day

function jd_to_islamic(jd)
{
    var year, month, day;

    jd = Math.floor(jd) + 0.5;
    year = Math.floor(((30 * (jd - ISLAMIC_EPOCH)) + 10646) / 10631);
    month = Math.min(12,
                Math.ceil((jd - (29 + islamic_to_jd(year, 1, 1))) / 29.5) + 1);
    day = (jd - islamic_to_jd(year, month, 1)) + 1;
    return new Array(year, month, day);
}

/*  TEHRAN_EQUINOX  --  Determine Julian day and fraction of the
                        March equinox at the Tehran meridian in
                        a given Gregorian year.  */

function tehran_equinox(year)
{
    var equJED, equJD, equAPP, equTehran, dtTehran;

    //  March equinox in dynamical time
    equJED = equinox(year, 0);

    //  Correct for delta T to obtain Universal time
    equJD = equJED - (deltat(year) / (24 * 60 * 60));

    //  Apply the equation of time to yield the apparent time at Greenwich
    equAPP = equJD + equationOfTime(equJED);

    /*  Finally, we must correct for the constant difference between
        the Greenwich meridian andthe time zone standard for
	Iran Standard time, 52°30' to the East.  */

    dtTehran = (52 + (30 / 60.0) + (0 / (60.0 * 60.0))) / 360;
    equTehran = equAPP + dtTehran;

    return equTehran;
}


/*  TEHRAN_EQUINOX_JD  --  Calculate Julian day during which the
                           March equinox, reckoned from the Tehran
                           meridian, occurred for a given Gregorian
                           year.  */

function tehran_equinox_jd(year)
{
    var ep, epg;

    ep = tehran_equinox(year);
    epg = Math.floor(ep);

    return epg;
}

/*  PERSIANA_YEAR  --  Determine the year in the Persian
                       astronomical calendar in which a
                       given Julian day falls.  Returns an
             	       array of two elements:

                            [0]  Persian year
                            [1]  Julian day number containing
                                 equinox for this year.
*/


var PERSIAN_EPOCH = 1948320.5;
var PERSIAN_WEEKDAYS = new Array("Yekshanbeh", "Doshanbeh",
                                 "Seshhanbeh", "Chaharshanbeh",
                                 "Panjshanbeh", "Jomeh", "Shanbeh");

function persiana_year(jd)
{
    var guess = jd_to_gregorian(jd)[0] - 2,
        lasteq, nexteq, adr;

    lasteq = tehran_equinox_jd(guess);
    while (lasteq > jd) {
        guess--;
        lasteq = tehran_equinox_jd(guess);
    }
    nexteq = lasteq - 1;
    while (!((lasteq <= jd) && (jd < nexteq))) {
        lasteq = nexteq;
        guess++;
        nexteq = tehran_equinox_jd(guess);
    }
    adr = Math.round((lasteq - PERSIAN_EPOCH) / TropicalYear) + 1;

    return new Array(adr, lasteq);
}

/*  JD_TO_PERSIANA  --  Calculate date in the Persian astronomical
                        calendar from Julian day.  */

function jd_to_persiana(jd)
{
    var year, month, day,
        adr, equinox, yday;

    jd = Math.floor(jd) + 0.5;
    adr = persiana_year(jd);
    year = adr[0];
    equinox = adr[1];
    day = Math.floor((jd - equinox) / 30) + 1;
    
    yday = (Math.floor(jd) - persiana_to_jd(year, 1, 1)) + 1;
    month = (yday <= 186) ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
    day = (Math.floor(jd) - persiana_to_jd(year, month, 1)) + 1;

    return new Array(year, month, day);
}

/*  PERSIANA_TO_JD  --  Obtain Julian day from a given Persian
                    	astronomical calendar date.  */

function persiana_to_jd(year, month, day)
{
    var adr, equinox, guess, jd;

    guess = (PERSIAN_EPOCH - 1) + (TropicalYear * ((year - 1) - 1));
    adr = new Array(year - 1, 0);

    while (adr[0] < year) {
        adr = persiana_year(guess);
        guess = adr[1] + (TropicalYear + 2);
    }
    equinox = adr[1];

    jd = equinox +
            ((month <= 7) ?
                ((month - 1) * 31) :
                (((month - 1) * 30) + 6)
            ) +
    	    (day - 1);
    return jd;
}

/*  LEAP_PERSIANA  --  Is a given year a leap year in the Persian
    	    	       astronomical calendar ?  */

function leap_persiana(year)
{
    return (persiana_to_jd(year + 1, 1, 1) -
    	    persiana_to_jd(year, 1, 1)) > 365;
}

//  LEAP_PERSIAN  --  Is a given year a leap year in the Persian calendar ?

function leap_persian(year)
{
    return ((((((year - ((year > 0) ? 474 : 473)) % 2820) + 474) + 38) * 682) % 2816) < 682;
}

//  PERSIAN_TO_JD  --  Determine Julian day from Persian date

function persian_to_jd(year, month, day)
{
    var epbase, epyear;

    epbase = year - ((year >= 0) ? 474 : 473);
    epyear = 474 + mod(epbase, 2820);

    return day +
            ((month <= 7) ?
                ((month - 1) * 31) :
                (((month - 1) * 30) + 6)
            ) +
            Math.floor(((epyear * 682) - 110) / 2816) +
            (epyear - 1) * 365 +
            Math.floor(epbase / 2820) * 1029983 +
            (PERSIAN_EPOCH - 1);
}

//  JD_TO_PERSIAN  --  Calculate Persian date from Julian day

function jd_to_persian(jd)
{
    var year, month, day, depoch, cycle, cyear, ycycle,
        aux1, aux2, yday;


    jd = Math.floor(jd) + 0.5;

    depoch = jd - persian_to_jd(475, 1, 1);
    cycle = Math.floor(depoch / 1029983);
    cyear = mod(depoch, 1029983);
    if (cyear == 1029982) {
        ycycle = 2820;
    } else {
        aux1 = Math.floor(cyear / 366);
        aux2 = mod(cyear, 366);
        ycycle = Math.floor(((2134 * aux1) + (2816 * aux2) + 2815) / 1028522) +
                    aux1 + 1;
    }
    year = ycycle + (2820 * cycle) + 474;
    if (year <= 0) {
        year--;
    }
    yday = (jd - persian_to_jd(year, 1, 1)) + 1;
    month = (yday <= 186) ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
    day = (jd - persian_to_jd(year, month, 1)) + 1;
    return new Array(year, month, day);
}

//  MAYAN_COUNT_TO_JD  --  Determine Julian day from Mayan long count

var MAYAN_COUNT_EPOCH = 584282.5;

function mayan_count_to_jd(baktun, katun, tun, uinal, kin)
{
    return MAYAN_COUNT_EPOCH +
           (baktun * 144000) +
           (katun  *   7200) +
           (tun    *    360) +
           (uinal  *     20) +
           kin;
}

//  JD_TO_MAYAN_COUNT  --  Calculate Mayan long count from Julian day

function jd_to_mayan_count(jd)
{
    var d, baktun, katun, tun, uinal, kin;

    jd = Math.floor(jd) + 0.5;
    d = jd - MAYAN_COUNT_EPOCH;
    baktun = Math.floor(d / 144000);
    d = mod(d, 144000);
    katun = Math.floor(d / 7200);
    d = mod(d, 7200);
    tun = Math.floor(d / 360);
    d = mod(d, 360);
    uinal = Math.floor(d / 20);
    kin = mod(d, 20);

    return new Array(baktun, katun, tun, uinal, kin);
}

//  JD_TO_MAYAN_HAAB  --  Determine Mayan Haab "month" and day from Julian day

var MAYAN_HAAB_MONTHS = new Array("Pop", "Uo", "Zip", "Zotz", "Tzec", "Xul",
                                  "Yaxkin", "Mol", "Chen", "Yax", "Zac", "Ceh",
                                  "Mac", "Kankin", "Muan", "Pax", "Kayab", "Cumku", "Uayeb");

function jd_to_mayan_haab(jd)
{
    var lcount, day;

    jd = Math.floor(jd) + 0.5;
    lcount = jd - MAYAN_COUNT_EPOCH;
    day = mod(lcount + 8 + ((18 - 1) * 20), 365);

    return new Array (Math.floor(day / 20) + 1, mod(day, 20));
}

//  JD_TO_MAYAN_TZOLKIN  --  Determine Mayan Tzolkin "month" and day from Julian day

var MAYAN_TZOLKIN_MONTHS = new Array("Imix", "Ik", "Akbal", "Kan", "Chicchan",
                                     "Cimi", "Manik", "Lamat", "Muluc", "Oc",
                                     "Chuen", "Eb", "Ben", "Ix", "Men",
                                     "Cib", "Caban", "Etznab", "Cauac", "Ahau");

function jd_to_mayan_tzolkin(jd)
{
    var lcount;

    jd = Math.floor(jd) + 0.5;
    lcount = jd - MAYAN_COUNT_EPOCH;
    return new Array (amod(lcount + 20, 20), amod(lcount + 4, 13));
}

//  BAHAI_TO_JD  --  Determine Julian day from Bahai date

var BAHAI_EPOCH = 2394646.5;
var BAHAI_WEEKDAYS = new Array("Jamál", "Kamál", "Fidál", "Idál",
                               "Istijlál", "Istiqlál", "Jalál");

function bahai_to_jd(major, cycle, year, month, day)
{
    var gy;

    gy = (361 * (major - 1)) + (19 * (cycle - 1)) + (year - 1) +
         jd_to_gregorian(BAHAI_EPOCH)[0];
    return gregorian_to_jd(gy, 3, 20) + (19 * (month - 1)) +
           ((month != 20) ? 0 : (leap_gregorian(gy + 1) ? -14 : -15))  +
           day;
}

//  JD_TO_BAHAI  --  Calculate Bahai date from Julian day

function jd_to_bahai(jd)
{
    var major, cycle, year, month, day,
        gy, bstarty, bys, days, bld;

    jd = Math.floor(jd) + 0.5;
    gy = jd_to_gregorian(jd)[0];
    bstarty = jd_to_gregorian(BAHAI_EPOCH)[0];
    bys = gy - (bstarty + (((gregorian_to_jd(gy, 1, 1) <= jd) && (jd <= gregorian_to_jd(gy, 3, 20))) ? 1 : 0));
    major = Math.floor(bys / 361) + 1;
    cycle = Math.floor(mod(bys, 361) / 19) + 1;
    year = mod(bys, 19) + 1;
    days = jd - bahai_to_jd(major, cycle, year, 1, 1);
    bld = bahai_to_jd(major, cycle, year, 20, 1);
    month = (jd >= bld) ? 20 : (Math.floor(days / 19) + 1);
    day = (jd + 1) - bahai_to_jd(major, cycle, year, month, 1);

    return new Array(major, cycle, year, month, day);
}

//  INDIAN_CIVIL_TO_JD  --  Obtain Julian day for Indian Civil date

var INDIAN_CIVIL_WEEKDAYS = new Array(
    "ravivara", "somavara", "mangalavara", "budhavara",
    "brahaspativara", "sukravara", "sanivara");

function indian_civil_to_jd(year, month, day)
{
    var Caitra, gyear, leap, start, jd, m;

    gyear = year + 78;
    leap = leap_gregorian(gyear);     // Is this a leap year ?
    start = gregorian_to_jd(gyear, 3, leap ? 21 : 22);
    Caitra = leap ? 31 : 30;

    if (month == 1) {
        jd = start + (day - 1);
    } else {
        jd = start + Caitra;
        m = month - 2;
        m = Math.min(m, 5);
        jd += m * 31;
        if (month >= 8) {
            m = month - 7;
            jd += m * 30;
        }
        jd += day - 1;
    }

    return jd;
}

//  JD_TO_INDIAN_CIVIL  --  Calculate Indian Civil date from Julian day

function jd_to_indian_civil(jd)
{
    var Caitra, Saka, greg, greg0, leap, start, year, yday, mday;

    Saka = 79 - 1;                    // Offset in years from Saka era to Gregorian epoch
    start = 80;                       // Day offset between Saka and Gregorian

    jd = Math.floor(jd) + 0.5;
    greg = jd_to_gregorian(jd);       // Gregorian date for Julian day
    leap = leap_gregorian(greg[0]);   // Is this a leap year?
    year = greg[0] - Saka;            // Tentative year in Saka era
    greg0 = gregorian_to_jd(greg[0], 1, 1); // JD at start of Gregorian year
    yday = jd - greg0;                // Day number (0 based) in Gregorian year
    Caitra = leap ? 31 : 30;          // Days in Caitra this year

    if (yday < start) {
        //  Day is at the end of the preceding Saka year
        year--;
        yday += Caitra + (31 * 5) + (30 * 3) + 10 + start;
    }

    yday -= start;
    if (yday < Caitra) {
        month = 1;
        day = yday + 1;
    } else {
        mday = yday - Caitra;
        if (mday < (31 * 5)) {
            month = Math.floor(mday / 31) + 2;
            day = (mday % 31) + 1;
        } else {
            mday -= 31 * 5;
            month = Math.floor(mday / 30) + 7;
            day = (mday % 30) + 1;
        }
    }

    return new Array(year, month, day);
}

/*  updateFromGregorian  --  Update all calendars from Gregorian.
                             "Why not Julian date?" you ask.  Because
                             starting from Gregorian guarantees we're
                             already snapped to an integral second, so
                             we don't get roundoff errors in other
                             calendars.  */

function updateFromGregorian()
{
    var j, year, mon, mday, hour, min, sec,
        weekday, julcal, hebcal, islcal, hmindex, utime, isoweek,
        may_countcal, mayhaabcal, maytzolkincal, bahcal, frrcal,
        indcal, isoday, xgregcal;

    year = new Number(document.gregorian.year.value);
    mon = document.gregorian.month.selectedIndex;
    mday = new Number(document.gregorian.day.value);
    hour = min = sec = 0;
    hour = new Number(document.gregorian.hour.value);
    min = new Number(document.gregorian.min.value);
    sec = new Number(document.gregorian.sec.value);

    //  Update Julian day

    j = gregorian_to_jd(year, mon + 1, mday) +
           (Math.floor(sec + 60 * (min + 60 * hour) + 0.5) / 86400.0);

    document.julianday.day.value = j;
    document.modifiedjulianday.day.value = j - JMJD;

    //  Update day of week in Gregorian box

    weekday = jwday(j);
    document.gregorian.wday.value = Weekdays[weekday];

    //  Update leap year status in Gregorian box

    document.gregorian.leap.value = NormLeap[leap_gregorian(year) ? 1 : 0];

    //  Update Julian Calendar

    julcal = jd_to_julian(j);
    document.juliancalendar.year.value = julcal[0];
    document.juliancalendar.month.selectedIndex = julcal[1] - 1;
    document.juliancalendar.day.value = julcal[2];
    document.juliancalendar.leap.value = NormLeap[leap_julian(julcal[0]) ? 1 : 0];
    weekday = jwday(j);
    document.juliancalendar.wday.value = Weekdays[weekday];

    //  Update Hebrew Calendar

    hebcal = jd_to_hebrew(j);
    if (hebrew_leap(hebcal[0])) {
        document.hebrew.month.options.length = 13;
        document.hebrew.month.options[11] = new Option("Adar I");
        document.hebrew.month.options[12] = new Option("Veadar");
    } else {
        document.hebrew.month.options.length = 12;
        document.hebrew.month.options[11] = new Option("Adar");
    }
    document.hebrew.year.value = hebcal[0];
    document.hebrew.month.selectedIndex = hebcal[1] - 1;
    document.hebrew.day.value = hebcal[2];
    hmindex = hebcal[1];
    if (hmindex == 12 && !hebrew_leap(hebcal[0])) {
        hmindex = 14;
    }
    document.hebrew.hebmonth.src = "figures/hebrew_month_" +
        hmindex + ".gif";
    switch (hebrew_year_days(hebcal[0])) {
        case 353:
            document.hebrew.leap.value = "Common deficient (353 days)";
            break;

        case 354:
            document.hebrew.leap.value = "Common regular (354 days)";
            break;

        case 355:
            document.hebrew.leap.value = "Common complete (355 days)";
            break;

        case 383:
            document.hebrew.leap.value = "Embolismic deficient (383 days)";
            break;

        case 384:
            document.hebrew.leap.value = "Embolismic regular (384 days)";
            break;

        case 385:
            document.hebrew.leap.value = "Embolismic complete (385 days)";
            break;

        default:
            document.hebrew.leap.value = "Invalid year length: " +
                hebrew_year_days(hebcal[0]) + " days.";
            break;
    }

    //  Update Islamic Calendar

    islcal = jd_to_islamic(j);
    document.islamic.year.value = islcal[0];
    document.islamic.month.selectedIndex = islcal[1] - 1;
    document.islamic.day.value = islcal[2];
    document.islamic.wday.value = "yawm " + ISLAMIC_WEEKDAYS[weekday];
    document.islamic.leap.value = NormLeap[leap_islamic(islcal[0]) ? 1 : 0];

    //  Update Persian Calendar

    perscal = jd_to_persian(j);
    document.persian.year.value = perscal[0];
    document.persian.month.selectedIndex = perscal[1] - 1;
    document.persian.day.value = perscal[2];
    document.persian.wday.value = PERSIAN_WEEKDAYS[weekday];
    document.persian.leap.value = NormLeap[leap_persian(perscal[0]) ? 1 : 0];

    //  Update Persian Astronomical Calendar

    perscal = jd_to_persiana(j);
    document.persiana.year.value = perscal[0];
    document.persiana.month.selectedIndex = perscal[1] - 1;
    document.persiana.day.value = perscal[2];
    document.persiana.wday.value = PERSIAN_WEEKDAYS[weekday];
    document.persiana.leap.value = NormLeap[leap_persiana(perscal[0]) ? 1 : 0];

    //  Update Mayan Calendars

    may_countcal = jd_to_mayan_count(j);
    document.mayancount.baktun.value = may_countcal[0];
    document.mayancount.katun.value = may_countcal[1];
    document.mayancount.tun.value = may_countcal[2];
    document.mayancount.uinal.value = may_countcal[3];
    document.mayancount.kin.value = may_countcal[4];
    mayhaabcal = jd_to_mayan_haab(j);
    document.mayancount.haab.value = "" + mayhaabcal[1] + " " + MAYAN_HAAB_MONTHS[mayhaabcal[0] - 1];
    maytzolkincal = jd_to_mayan_tzolkin(j);
    document.mayancount.tzolkin.value = "" + maytzolkincal[1] + " " + MAYAN_TZOLKIN_MONTHS[maytzolkincal[0] - 1];

    //  Update Bahai Calendar

    bahcal = jd_to_bahai(j);
    document.bahai.kull_i_shay.value = bahcal[0];
    document.bahai.vahid.value = bahcal[1];
    document.bahai.year.selectedIndex = bahcal[2] - 1;
    document.bahai.month.selectedIndex = bahcal[3] - 1;
    document.bahai.day.selectedIndex = bahcal[4] - 1;
    document.bahai.weekday.value = BAHAI_WEEKDAYS[weekday];
    document.bahai.leap.value = NormLeap[leap_gregorian(year) ? 1 : 0];  // Bahai uses same leap rule as Gregorian

    //  Update Indian Civil Calendar

    indcal = jd_to_indian_civil(j);
    document.indiancivilcalendar.year.value = indcal[0];
    document.indiancivilcalendar.month.selectedIndex = indcal[1] - 1;
    document.indiancivilcalendar.day.value = indcal[2];
    document.indiancivilcalendar.weekday.value = INDIAN_CIVIL_WEEKDAYS[weekday];
    document.indiancivilcalendar.leap.value = NormLeap[leap_gregorian(indcal[0] + 78) ? 1 : 0];

    //  Update French Republican Calendar

    frrcal = jd_to_french_revolutionary(j);
    document.french.an.value = frrcal[0];
    document.french.mois.selectedIndex = frrcal[1] - 1;
    document.french.decade.selectedIndex = frrcal[2] - 1;
    document.french.jour.selectedIndex = ((frrcal[1] <= 12) ? frrcal[3] : (frrcal[3] + 11)) - 1;

    //  Update Gregorian serial number

    if (document.gregserial != null) {
        document.gregserial.day.value = j - J0000;
    }

    //  Update Excel 1900 and 1904 day serial numbers

    document.excelserial1900.day.value = (j - J1900) + 1 +
            /*  Microsoft marching morons thought 1900 was a leap year.
                Adjust dates after 1900-02-28 to compensate for their
                idiocy.  */
            ((j > 2415078.5) ? 1 : 0)
        ;
    document.excelserial1904.day.value = j - J1904;

    //  Update Unix time()

    utime = (j - J1970) * (60 * 60 * 24 * 1000);
    document.unixtime.time.value = Math.round(utime / 1000);

    //  Update ISO Week

    isoweek = jd_to_iso(j);
    document.isoweek.year.value = isoweek[0];
    document.isoweek.week.value = isoweek[1];
    document.isoweek.day.value = isoweek[2];

    //  Update ISO Day

    isoday = jd_to_iso_day(j);
    document.isoday.year.value = isoday[0];
    document.isoday.day.value = isoday[1];
}

//  calcGregorian  --  Perform calculation starting with a Gregorian date

function calcGregorian()
{
    updateFromGregorian();
}

//  calcJulian  --  Perform calculation starting with a Julian date

function calcJulian()
{
    var j, date, time;

    j = new Number(document.julianday.day.value);
    date = jd_to_gregorian(j);
    time = jhms(j);
    document.gregorian.year.value = date[0];
    document.gregorian.month.selectedIndex = date[1] - 1;
    document.gregorian.day.value = date[2];
    document.gregorian.hour.value = pad(time[0], 2, " ");
    document.gregorian.min.value = pad(time[1], 2, "0");
    document.gregorian.sec.value = pad(time[2], 2, "0");
    updateFromGregorian();
}

//  setJulian  --  Set Julian date and update all calendars

function setJulian(j)
{
    document.julianday.day.value = new Number(j);
    calcJulian();
}

//  calcModifiedJulian  --  Update from Modified Julian day

function calcModifiedJulian()
{
    setJulian((new Number(document.modifiedjulianday.day.value)) + JMJD);
}

//  calcJulianCalendar  --  Update from Julian calendar

function calcJulianCalendar()
{
    setJulian(julian_to_jd((new Number(document.juliancalendar.year.value)),
                           document.juliancalendar.month.selectedIndex + 1,
                           (new Number(document.juliancalendar.day.value))));
}

//  calcHebrew  --  Update from Hebrew calendar

function calcHebrew()
{
    setJulian(hebrew_to_jd((new Number(document.hebrew.year.value)),
                          document.hebrew.month.selectedIndex + 1,
                          (new Number(document.hebrew.day.value))));
}

//  calcIslamic  --  Update from Islamic calendar

function calcIslamic()
{
    setJulian(islamic_to_jd((new Number(document.islamic.year.value)),
                           document.islamic.month.selectedIndex + 1,
                           (new Number(document.islamic.day.value))));
}

//  calcPersian  --  Update from Persian calendar

function calcPersian()
{
    setJulian(persian_to_jd((new Number(document.persian.year.value)),
                           document.persian.month.selectedIndex + 1,
                           (new Number(document.persian.day.value))));
}

//  calcPersiana  --  Update from Persian astronomical calendar

function calcPersiana()
{
    setJulian(persiana_to_jd((new Number(document.persiana.year.value)),
                           document.persiana.month.selectedIndex + 1,
                           (new Number(document.persiana.day.value))) + 0.5);
}

//  calcMayanCount  --  Update from the Mayan Long Count

function calcMayanCount()
{
    setJulian(mayan_count_to_jd((new Number(document.mayancount.baktun.value)),
                                (new Number(document.mayancount.katun.value)),
                                (new Number(document.mayancount.tun.value)),
                                (new Number(document.mayancount.uinal.value)),
                                (new Number(document.mayancount.kin.value))));
}

//  calcBahai  --  Update from Bahai calendar

function calcBahai()
{
    setJulian(bahai_to_jd((new Number(document.bahai.kull_i_shay.value)),
                          (new Number(document.bahai.vahid.value)),
                          document.bahai.year.selectedIndex + 1,
                          document.bahai.month.selectedIndex + 1,
                          document.bahai.day.selectedIndex + 1));
}

//  calcIndianCivilCalendar  --  Update from Indian Civil Calendar

function calcIndianCivilCalendar()
{
    setJulian(indian_civil_to_jd(
                           (new Number(document.indiancivilcalendar.year.value)),
                           document.indiancivilcalendar.month.selectedIndex + 1,
                           (new Number(document.indiancivilcalendar.day.value))));
}

//  calcFrench  -- Update from French Republican calendar

function calcFrench()
{
    var decade, j, mois;

    j = document.french.jour.selectedIndex;
    decade = document.french.decade.selectedIndex;
    mois = document.french.mois.selectedIndex;

    /*  If the currently selected day is one of the sansculottides,
        adjust the index to be within that period and force the
        decade to zero and the month to 12, designating the
        intercalary interval.  */

    if (j > 9) {
        j -= 11;
        decade = 0;
        mois = 12;
    }

    /*  If the selected month is the pseudo-month of the five or
        six sansculottides, ensure that the decade is 0 and the day
        number doesn't exceed six.  To avoid additional overhead, we
        don't test whether a day number of 6 is valid for this year,
        but rather simply permit it to wrap into the first day of
        the following year if this is a 365 day year.  */

    if (mois == 12) {
        decade = 0;
        if (j > 5) {
            j = 0;
        }
    }

    setJulian(french_revolutionary_to_jd((new Number(document.french.an.value)),
                                         mois + 1,
                                         decade + 1,
                                         j + 1));
}

//  calcGregSerial  --  Update from Gregorian serial day number

function calcGregSerial()
{
    setJulian((new Number(document.gregserial.day.value)) + J0000);
}

//  calcExcelSerial1900  --  Perform calculation starting with an Excel 1900 serial date

function calcExcelSerial1900()
{
    var d = new Number(document.excelserial1900.day.value);

    /* Idiot Kode Kiddies didn't twig to the fact
       (proclaimed in 1582) that 1900 wasn't a leap year,
       so every Excel day number in every database on Earth
       which represents a date subsequent to February 28,
       1900 is off by one.  Note that there is no
       acknowledgement of this betrayal or warning of its
       potential consequences in the Excel help file.  Thank
       you so much Mister Talking Paper Clip.  Some day
       we're going to celebrate your extinction like it was
       February 29 ... 1900.  */

    if (d > 60) {
        d--;
    }

    setJulian((d - 1) + J1900);
}

//  calcExcelSerial1904  --  Perform calculation starting with an Excel 1904 serial date

function calcExcelSerial1904()
{
    setJulian((new Number(document.excelserial1904.day.value)) + J1904);
}

//  calcUnixTime  --  Update from specified Unix time() value

function calcUnixTime()
{
    var t = new Number(document.unixtime.time.value);

    setJulian(J1970 + (t / (60 * 60 * 24)));
}

//  calcIsoWeek  --  Update from specified ISO year, week, and day

function calcIsoWeek()
{
    var year = new Number(document.isoweek.year.value),
        week = new Number(document.isoweek.week.value),
        day = new Number(document.isoweek.day.value);

    setJulian(iso_to_julian(year, week, day));
}

//  calcIsoDay  --  Update from specified ISO year and day of year

function calcIsoDay()
{
    var year = new Number(document.isoday.year.value),
        day = new Number(document.isoday.day.value);

    setJulian(iso_day_to_julian(year, day));
}


/*  setDateToToday  --  Preset the fields in
    the request form to today's date.  */

function setDateToToday()
{
    var today = new Date();

    /*  The following idiocy is due to bizarre incompatibilities
        in the behaviour of getYear() between Netscrape and
        Exploder.  The ideal solution is to use getFullYear(),
        which returns the actual year number, but that would
        break this code on versions of JavaScript prior to
        1.2.  So, for the moment we use the following code
        which works for all versions of JavaScript and browsers
        for all year numbers greater than 1000.  When we're willing
        to require JavaScript 1.2, this may be replaced by
        the single line:

            document.gregorian.year.value = today.getFullYear();

        Thanks to Larry Gilbert for pointing out this problem.
    */

    var y = today.getYear();
    if (y < 1000) {
        y += 1900;
    }

    document.gregorian.year.value = y;
    document.gregorian.month.selectedIndex = today.getMonth();
    document.gregorian.day.value = today.getDate();
    document.gregorian.hour.value =
    document.gregorian.min.value =
    document.gregorian.sec.value = "00";
}

/*  presetDataToRequest  --  Preset the Gregorian date to the
    	    	    	     date requested by the URL
			     search field.  */
			     
function presetDataToRequest(s)
{
    var eq = s.indexOf("=");
    var set = false;
    if (eq != -1) {
    	var calendar = s.substring(0, eq),
	    date = decodeURIComponent(s.substring(eq + 1));
	if (calendar.toLowerCase() == "gregorian") {
	    var d = date.match(/^(\d+)\D(\d+)\D(\d+)(\D\d+)?(\D\d+)?(\D\d+)?/);
	    if (d != null) {
	    	// Sanity check date and time components
	    	if ((d[2] >= 1) && (d[2] <= 12) &&
		    (d[3] >= 1) && (d[3] <= 31) &&
		    ((d[4] == undefined) ||
		    	((d[4].substring(1) >= 0) && (d[4].substring(1) <= 23))) &&
		    ((d[5] == undefined) ||
		    	((d[5].substring(1) >= 0) && (d[5].substring(1) <= 59))) &&
		    ((d[6] == undefined) ||
		    	((d[6].substring(1) >= 0) && (d[6].substring(1) <= 59)))) {
		    document.gregorian.year.value = d[1];
		    document.gregorian.month.selectedIndex = d[2] - 1;
		    document.gregorian.day.value = Number(d[3]);
		    document.gregorian.hour.value = d[4] == undefined ? "00" :
			d[4].substring(1);
		    document.gregorian.min.value = d[5] == undefined ? "00" :
			d[5].substring(1);
    	    	    document.gregorian.sec.value = d[6] == undefined ? "00" :
			d[6].substring(1);
		    calcGregorian();
		    set = true;
		} else {
	    	    alert("Invalid Gregorian date \"" + date +
			"\" in search request");
		}
	    } else {
	    	alert("Invalid Gregorian date \"" + date +
		    "\" in search request");
	    }
	    
	} else if (calendar.toLowerCase() == "julian") {
	    var d = date.match(/^(\d+)\D(\d+)\D(\d+)(\D\d+)?(\D\d+)?(\D\d+)?/);
	    if (d != null) {
	    	// Sanity check date and time components
	    	if ((d[2] >= 1) && (d[2] <= 12) &&
		    (d[3] >= 1) && (d[3] <= 31) &&
		    ((d[4] == undefined) ||
		    	((d[4].substring(1) >= 0) && (d[4].substring(1) <= 23))) &&
		    ((d[5] == undefined) ||
		    	((d[5].substring(1) >= 0) && (d[5].substring(1) <= 59))) &&
		    ((d[6] == undefined) ||
		    	((d[6].substring(1) >= 0) && (d[6].substring(1) <= 59)))) {
		    document.juliancalendar.year.value = d[1];
		    document.juliancalendar.month.selectedIndex = d[2] - 1;
		    document.juliancalendar.day.value = Number(d[3]);
		    calcJulianCalendar();
		    document.gregorian.hour.value = d[4] == undefined ? "00" :
			d[4].substring(1);
		    document.gregorian.min.value = d[5] == undefined ? "00" :
			d[5].substring(1);
    	    	    document.gregorian.sec.value = d[6] == undefined ? "00" :
			d[6].substring(1);
		    set = true;
		} else {
	    	    alert("Invalid Julian calendar date \"" + date +
			"\" in search request");
		}
	    } else {
	    	alert("Invalid Julian calendar date \"" + date +
		    "\" in search request");
	    }

	} else if (calendar.toLowerCase() == "jd") {
	    var d = date.match(/^(\-?\d+\.?\d*)/);
	    if (d != null) {
	    	setJulian(d[1]);
		set = 1;
	    } else {
	    	alert("Invalid Julian day \"" + date +
		    "\" in search request");
	    }
	    
	} else if (calendar.toLowerCase() == "mjd") {
	    var d = date.match(/^(\-?\d+\.?\d*)/);
	    if (d != null) {
	    	document.modifiedjulianday.day.value = d[1];
	    	calcModifiedJulian();
		set = 1;
	    } else {
	    	alert("Invalid Modified Julian day \"" + date +
		    "\" in search request");
	    }
	    
	} else if (calendar.toLowerCase() == "unixtime") {
	    var d = date.match(/^(\-?\d+\.?\d*)/);
	    if (d != null) {
	    	document.unixtime.time.value = d[1];
	    	calcUnixTime();
		set = 1;
	    } else {
	    	alert("Invalid Modified Julian day \"" + date +
		    "\" in search request");
	    }
	    
	} else if (calendar.toLowerCase() == "iso") {
	    var d;
	    if ((d = date.match(/^(\-?\d+)\-(\d\d\d)/)) != null) {
	    	document.isoday.year.value = d[1];
		document.isoday.day.value= d[2];
	    	calcIsoDay();
		set = 1;
	    } else if ((d = date.match(/^(\-?\d+)\-?W(\d\d)\-?(\d)/i)) != null) {
    	    	document.isoweek.year.value = d[1];
    	    	document.isoweek.week.value = d[2];
    	    	document.isoweek.day.value = d[3];
	    	calcIsoWeek();
		set = 1;
	    } else {
	    	alert("Invalid ISO-8601 date \"" + date +
		    "\" in search request");
	    }
	    
	} else if (calendar.toLowerCase() == "excel") {
	    var d = date.match(/^(\-?\d+\.?\d*)/);
	    if (d != null) {
	    	document.excelserial1900.day.value = d[1];
	    	calcExcelSerial1900();
		set = 1;
	    } else {
	    	alert("Invalid Excel serial day (1900/PC) \"" + date +
		    "\" in search request");
	    }
	    
	} else if (calendar.toLowerCase() == "excel1904") {
	    var d = date.match(/^(\-?\d+\.?\d*)/);
	    if (d != null) {
	    	document.excelserial1904.day.value = d[1];
	    	calcExcelSerial1904();
		set = 1;
	    } else {
	    	alert("Invalid Excel serial day (1904/Mac) \"" + date +
		    "\" in search request");
	    }
	
	} else {
	    alert("Invalid calendar \"" + calendar +
	    	"\" in search request");
	}
    } else {
    	alert("Invalid search request: " + s);
    }
    
    if (!set) {
    	setDateToToday();
	calcGregorian();
    }
}
