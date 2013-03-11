# Contributing to jQuery UI

1. [Getting Involved](#getting-involved)
2. [Discussion](#discussion)
3. [How To Report Bugs](#how-to-report-bugs)
4. [jQuery UI Coding Standards](#jquery-ui-coding-standards)
5. [Tips For Bug Patching](#tips-for-bug-patching)



## Getting Involved

There are a number of ways to get involved with the development of jQuery UI. Even if you've never contributed code to an Open Source project before, we're always looking for help identifying bugs, writing and reducing test cases and documentation.

This is the best way to contribute to jQuery UI. Please read through the full guide detailing [How to Report Bugs](#how-to-report-bugs).

## Discussion

### Forum and IRC

The jQuery UI development team frequently tracks posts on the [Developing jQuery UI Forum](http://forum.jquery.com/developing-jquery-ui). If you have longer posts or questions please feel free to post them there. If you think you've found a bug please [file it in the bug tracker](#how-to-report-bugs).

Additionally most of the jQuery UI development team can be found in the [#jqueryui-dev](http://webchat.freenode.net/?channels=jqueryui-dev) IRC channel on irc.freenode.net.

### Weekly Status Meetings

Every week (unless otherwise noted) the jQuery UI dev team has a meeting to discuss the progress of current work and to bring forward possible new blocker bugs for discussion.

The meeting is held in the [#jquery-meeting](http://webchat.freenode.net/?channels=jquery-meeting) IRC channel on irc.freenode.net at [Noon EST](http://www.timeanddate.com/worldclock/fixedtime.html?month=1&day=17&year=2011&hour=12&min=0&sec=0&p1=43) on Wednesdays.

Past Meeting Notes:
[2008 - 2011](https://docs.google.com/spreadsheet/ccc?key=0AusvKVL7jmFUcHVBQk9tMUxkRGl0emVwZGdLd0QtUlE),
[2012 - current](https://docs.google.com/spreadsheet/ccc?key=0ArIM4UVbwE-3dFg1T0k4VlE1bF82Nm9tbW90cVNxN0E)


## How to Report Bugs

### Make sure it is a jQuery UI bug

Many bugs reported to our bug tracker are actually bugs in user code, not in jQuery UI code. Keep in mind that just because your code throws an error and the console points to a line number inside of jQuery or jQuery UI, this does *not* mean the bug is a jQuery UI bug.

If you are new to jQuery and/or jQuery UI, it is usually a much better idea to ask for help first in the [Using jQuery Forum](http://forum.jquery.com/using-jquery), the [Using jQuery UI Forum](http://forum.jquery.com/using-jquery-ui) or the [jQuery IRC channel](http://webchat.freenode.net/?channels=%23jquery). You will get much quicker support, and you will help avoid tying up the jQuery UI team with invalid bug reports. These same resources can also be useful if you want to confirm that your bug is indeed a bug in jQuery UI before filing any tickets.


### Disable any browser extensions

Make sure you have reproduced the bug with all browser extensions and add-ons disabled, as these can sometimes cause things to break in interesting and unpredictable ways. Try using incognito, stealth or anonymous browsing modes.


### Try the latest version of jQuery UI

Bugs in old versions of jQuery UI may have already been fixed. In order to avoid reporting known issues, make sure you are always testing against the latest stable release.

### Try an older version of jQuery UI

Sometimes, bugs are introduced in newer versions of jQuery UI that do not exist in previous versions. When possible, it can be useful to try testing with an older release.

### Reduce, reduce, reduce!

When you are experiencing a problem, the most useful thing you can possibly do is to [reduce your code](http://webkit.org/quality/reduction.html) to the bare minimum required to reproduce the issue. This makes it *much* easier to isolate and fix the offending code. Bugs that are reported without reduced test cases generally take much longer to fix than bugs that are submitted with them, so you really should try to do this if at all possible.

## jQuery UI Coding Standards

See: [jQuery UI Coding Standards](http://wiki.jqueryui.com/w/page/12137737/Coding%20standards)

## Tips For Bug Patching


### Environment: localhost w/ PHP, Node & Grunt

jQuery UI uses node & gruntjs to automate the building and validation of source code.

Some tests depend on PHP running locally, so make sure you have the following installed:

* Some kind of localhost server program that supports PHP (any will do)
* Node.js
* NPM (comes with the latest version of Node.js)
* Grunt (install with: `npm install grunt -g`


Maintaining a list of platform specific instructions is outside of the scope of this document and there is plenty of existing documentation for the above technologies.


### Build a Local Copy of jQuery UI

Create a fork of the jQuery UI repo on github at http://github.com/jquery/jquery-ui

Change directory to your web root directory, whatever that might be:

```bash
$ cd /path/to/your/www/root/
```

Clone your jQuery UI fork to work locally

```bash
$ git clone git@github.com:username/jquery-ui.git
```

Change directory to the newly created dir jquery-ui/

```bash
$ cd jquery-ui
```

Add the jQuery master as a remote. I label mine "upstream"

```bash
$ git remote add upstream git://github.com/jquery/jquery-ui.git
```

Get in the habit of pulling in the "upstream" master to stay up to date as jQuery UI receives new commits

```bash
$ git pull upstream master
```

To lint the JavaScript, HTML, and CSS, as well as run a smoke test in PhantomJS, run grunt:

```bash
$ grunt
```

To run the tests for a specific plugin in your browser, open the approriate file from the /tests/unit/ directory, for example: http://localhost/tests/unit/accordion/accordion.html. The domain will be dependent on your local server configuation; if there is a port, be sure to include it.

Success! You just tested jQuery UI!


### Fix a bug from a ticket filed at bugs.jqueryui.com:

**NEVER write your patches to the master branch** - it gets messy (I say this from experience!)

**ALWAYS USE A "TOPIC" BRANCH!** Like so (#### = the ticket #)...

Make sure you start with your up-to-date master:

```bash
$ git checkout master
```

Create and checkout a new branch that includes the ticket #

```bash
$ git checkout -b bug_####

# ( Explanation: this useful command will:
# "checkout" a "-b" (branch) by the name of "bug_####"
# or create it if it doesn't exist )
```

Now you're on branch: bug_####

Determine the file you'll be working in...

Open up the corresponding /tests/unit/?????.js and add the initial failing unit tests. This may seem awkward at first, but in the long run it will make sense. To truly and efficiently patch a bug, you need to be working against that bug.

Next, open the source files and make your changes

Run http://localhost/tests/unit/???? --> **ALL TESTS MUST PASS**

Once you're satisfied with your patch...

Stage the files to be tracked:

```bash
$ git add filename
# (you can use "git status" to list the files you've changed)
```


( I recommend NEVER, EVER using "git add . " )

Once you've staged all of your changed files, go ahead and commit them

```bash
$ git commit -m "Component: Brief description of fix. Fixes #0000 - Ticket description."
```

See the [commit message style guide](http://wiki.jqueryui.com/w/page/25941597/Commit%20Message%20Style%20Guide) for more details on how to format your commit message.

For a multiple line commit message, leave off the `-m "description"`.

You will then be led into vi (or the text editor that you have set up) to complete your commit message.

Then, push your branch with the bug fix commits to your github fork

```bash
$ git push origin -u bug_####
```

Before you tackle your next bug patch, return to the master:

```bash
$ git checkout master
```



### jQuery UI supports the following browsers:

* Chrome Current-1
* Safari Current-1
* Firefox Current-1
* Opera Current-1
* IE 7+
