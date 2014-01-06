# Contributing to jQuery UI

Welcome! Thanks for your interest in contributing to jQuery UI. Most of our information on how to contribute to this and all other jQuery Foundation projects is over at [contribute.jquery.org](http://contribute.jquery.org). You'll definitely want to take a look at the articles on contributing [code](http://contribute.jquery.org/code).

You may also want to take a look at our [commit & pull request guide](http://contribute.jquery.org/commits-and-pull-requests/) and [style guides](http://contribute.jquery.org/style-guide/) for instructions on how to maintain your fork and submit your code. Before we can merge any pull request, we'll also need you to sign our [contributor license agreement](http://contribute.jquery.org/cla).

You can find us on [IRC](http://irc.jquery.org), specifically in #jqueryui-dev should you have any questions. If you've never contributed to open source before, we've put together [a short guide with tips, tricks, and ideas on getting started](http://contribute.jquery.org/open-source/).

## Getting Involved

There are a number of ways to get involved with the development of jQuery UI. Even if you've never contributed code to an Open Source project before, we're always looking for help identifying bugs, writing and reducing test cases and documentation.

This is the best way to contribute to jQuery UI. Please read through the full guide detailing [How to Report Bugs](http://contribute.jquery.org/bug-reports/).

## Discussion

### Forum and IRC

The jQuery UI development team frequently tracks posts on the [Developing jQuery UI Forum](http://forum.jquery.com/developing-jquery-ui). If you have longer posts or questions please feel free to post them there. If you think you've found a bug please [file it in the bug tracker](http://contribute.jquery.org/bug-reports/).

Additionally most of the jQuery UI development team can be found in the [#jqueryui-dev](http://webchat.freenode.net/?channels=jqueryui-dev) IRC channel on irc.freenode.net.

### Weekly Status Meetings

Every week (unless otherwise noted) the jQuery UI dev team has a meeting to discuss the progress of current work and to bring forward possible new blocker bugs for discussion.

The meeting is held in the [#jquery-meeting](http://webchat.freenode.net/?channels=jquery-meeting) IRC channel on irc.freenode.net at [Noon EST](http://www.timeanddate.com/worldclock/fixedtime.html?month=1&day=17&year=2011&hour=12&min=0&sec=0&p1=43) on Wednesdays.

Past Meeting Notes:
[2008 - 2011](https://docs.google.com/spreadsheet/ccc?key=0AusvKVL7jmFUcHVBQk9tMUxkRGl0emVwZGdLd0QtUlE),
[2012 - 2013](https://docs.google.com/spreadsheet/ccc?key=0ArIM4UVbwE-3dFg1T0k4VlE1bF82Nm9tbW90cVNxN0E)
[2014 - present](https://docs.google.com/spreadsheet/ccc?key=0AgyHrN8YnS0IdER6clpleEd6WnBrRTgybnhUSTVMRUE)


## Tips For Bug Patching

### Environment: localhost w/ PHP, Node & Grunt

jQuery UI uses node & gruntjs to automate the building and validation of source code.

Some tests depend on PHP running locally, so make sure you have the following installed:

* Some kind of localhost server program that supports PHP (any will do)
* Node.js
* NPM (comes with the latest version of Node.js)
* Grunt (install with: `npm install -g grunt`

Maintaining a list of platform specific instructions is outside of the scope of this document and there is plenty of existing documentation for the above technologies.

### Build a Local Copy of jQuery UI

Create a fork of the jQuery UI repo on GitHub at http://github.com/jquery/jquery-ui

Change directory to your web root directory, whatever that might be:

```bash
$ cd /path/to/your/www/root/
```

Clone your jQuery UI fork to work locally.

```bash
$ git clone git@github.com:username/jquery-ui.git
```

Change directory to the newly created directory.

```bash
$ cd jquery-ui
```

Add the official jQuery repository as a remote. We recommend naming it "upstream".

```bash
$ git remote add upstream git://github.com/jquery/jquery-ui.git
```

Get in the habit of pulling in the "upstream" master to stay up to date as jQuery UI receives new commits.

```bash
$ git pull upstream master
```

To lint the JavaScript, HTML, and CSS, as well as run a smoke test in PhantomJS, run grunt:

```bash
$ grunt
```

To run the tests for a specific plugin in your browser, open the approriate file from the `/tests/unit/` directory, for example: `http://localhost/tests/unit/accordion/accordion.html`. The domain will be dependent on your local server configuation; if there is a port, be sure to include it.

Make sure to read our [commits and pull requests documentation](http://dev.contribute.jquery.org/commits-and-pull-requests/) for full details on working with branches and forks, as well as our commit guidelines.

### jQuery UI supports the following browsers:

* Chrome Current-1
* Safari Current-1
* Firefox Current-1
* Opera Current-1
* IE 7+
