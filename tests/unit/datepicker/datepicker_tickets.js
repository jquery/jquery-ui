/*
 * datepicker_tickets.js
 */
(function($) {

module("datepicker: tickets");

// http://forum.jquery.com/topic/several-breaking-changes-in-jquery-ui-1-8rc1
test('beforeShowDay-getDate', function() {
	var inp = init('#inp', {beforeShowDay: function(date) { inp.datepicker('getDate'); return [true, '']; }});
	var dp = $('#ui-datepicker-div');
	inp.val('01/01/2010').datepicker('show');
	// contains non-breaking space
	equals($('div.ui-datepicker-title').text(), 'January 2010', 'Initial month');
	$('a.ui-datepicker-next', dp).click();
	$('a.ui-datepicker-next', dp).click();
	// contains non-breaking space
	equals($('div.ui-datepicker-title').text(), 'March 2010', 'After next clicks');
	inp.datepicker('hide').datepicker('show');
	$('a.ui-datepicker-prev', dp).click();
	$('a.ui-datepicker-prev', dp).click();
	// contains non-breaking space
	equals($('div.ui-datepicker-title').text(), 'November 2009', 'After prev clicks');
	inp.datepicker('hide');
});

test('Ticket 6827: formatDate day of year calculation is wrong during day lights savings time', function(){
    var time = $.datepicker.formatDate("oo", new Date("2010/03/30 12:00:00 CDT")); 
    equals(time, "089");
});

test('Ticket #7244: date parser does not fail when too many numbers are passed into the date function', function() {
    var date;
    try{
        date = $.datepicker.parseDate('dd/mm/yy', '18/04/19881');
        ok(false, "Did not properly detect an invalid date");
    }catch(e){
        ok("invalid date detected");
    }

    try {
      date = $.datepicker.parseDate('dd/mm/yy', '18/04/1988 @ 2:43 pm');
      equal(date.getDate(), 18);
      equal(date.getMonth(), 3);
      equal(date.getFullYear(), 1988);
    } catch(e) {
      ok(false, "Did not properly parse date with extra text separated by whitespace");
    }
});

test('Ticket #7228: Add Oridinal Suffix to Date Picker Formatting', function () {
  var date, fmtd, prsd
      settings = {
        monthNames: [
          'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
        ]
      };
  
  date = new Date('January 01, 2011');
  fmtd = $.datepicker.formatDate('MM dS', date, settings);
  equal(fmtd, 'January 1st');
  prsd = $.datepicker.parseDate('MM dS', 'January 1st', settings);
  equal(prsd.getMonth(), 0);
  equal(prsd.getDate(), 1);

  date = new Date('January 02, 2011');
  fmtd = $.datepicker.formatDate('MM dS', date, settings);
  equal(fmtd, 'January 2nd');
  prsd = $.datepicker.parseDate('MM dS', 'January 2nd', settings);
  equal(prsd.getMonth(), 0);
  equal(prsd.getDate(), 2);

  date = new Date('January 03, 2011');
  fmtd = $.datepicker.formatDate('MM dS', date, settings);
  equal(fmtd, 'January 3rd');
  prsd = $.datepicker.parseDate('MM dS', 'January 3rd', settings);
  equal(prsd.getMonth(), 0);
  equal(prsd.getDate(), 3);

  date = new Date('January 04, 2011');
  fmtd = $.datepicker.formatDate('MM dS', date, settings);
  equal(fmtd, 'January 4th');
  prsd = $.datepicker.parseDate('MM dS', 'January 4th', settings);
  equal(prsd.getMonth(), 0);
  equal(prsd.getDate(), 4);

  date = new Date('January 11, 2011');
  fmtd = $.datepicker.formatDate('MM dS', date, settings);
  equal(fmtd, 'January 11th');

  date = new Date('January 12, 2011');
  fmtd = $.datepicker.formatDate('MM dS', date, settings);
  equal(fmtd, 'January 12th');

  date = new Date('January 13, 2011');
  fmtd = $.datepicker.formatDate('MM dS', date, settings);
  equal(fmtd, 'January 13th');

  date = new Date('January 14, 2011');
  fmtd = $.datepicker.formatDate('MM dS', date, settings);
  equal(fmtd, 'January 14th');

  date = new Date('January 21, 2011');
  fmtd = $.datepicker.formatDate('MM dS', date, settings);
  equal(fmtd, 'January 21st');

  date = new Date('January 22, 2011');
  fmtd = $.datepicker.formatDate('MM dS', date, settings);
  equal(fmtd, 'January 22nd');

  date = new Date('January 23, 2011');
  fmtd = $.datepicker.formatDate('MM dS', date, settings);
  equal(fmtd, 'January 23rd');

  date = new Date('January 24, 2011');
  fmtd = $.datepicker.formatDate('MM dS', date, settings);
  equal(fmtd, 'January 24th');

});

})(jQuery);
