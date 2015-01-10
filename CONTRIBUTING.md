# Contributing to jQuery UI

Welcome! Thanks for your interest in contributing to jQuery UI. Most of our information on how to contribute to this and all other jQuery Foundation projects is over at [contribute.jquery.org](http://contribute.jquery.org). You'll definitely want to take a look at the articles on contributing [code](http://contribute.jquery.org/code).

You may also want to take a look at our [commit & pull request guide](http://contribute.jquery.org/commits-and-pull-requests/) and [style guides](http://contribute.jquery.org/style-guide/) for instructions on how to maintain your fork and submit your code. Before we can merge any pull request, we'll also need you to sign our [contributor license agreement](http://contribute.jquery.org/cla).

You can find us on [IRC](http://irc.jquery.org), specifically in #jqueryui-dev should you have any questions. If you've never contributed to open source before, we've put together [a short guide with tips, tricks, and ideas on getting started](http://contribute.jquery.org/open-source/). For other forms of discussion and support, please see the [jQuery UI support center](http://jqueryui.com/support/).

## Getting Involved

There are a number of ways to get involved with the development of jQuery UI. Even if you've never contributed code to an Open Source project before, we're always looking for help identifying bugs, writing and reducing test cases and documentation.

This is the best way to contribute to jQuery UI. Please read through the full guide detailing [How to Report Bugs](http://contribute.jquery.org/bug-reports/).

### Weekly Meetings

Every week (unless otherwise noted) the jQuery UI team has a meeting to discuss the progress of current work and to bring forward possible new blockers for discussion. The meeting is held on [IRC](http://irc.jquery.org) in the #jquery-meeting channel at [Noon EST](http://www.timeanddate.com/worldclock/fixedtime.html?month=1&day=17&year=2011&hour=12&min=0&sec=0&p1=43) on Wednesdays. Meeting notes are posted on http://meetings.jquery.org/category/ui/ after each meeting.

## Tips for Getting Started

### Environment: Minimum Required

If you are contributing changes you will need a fork of jquery-ui (see [Getting the Source](#environment-getting-the-source)). If you just want the source code you could clone jquery-ui directly:

```bash
git clone git://github.com/jquery/jquery-ui.git
cd jquery-ui
```

The tests can run in any local web server. Ideally you should test your patch in appropriate web browsers and if possible run `grunt` to lint the code and run automated tests (this will happen automatically when you create a pull request). See the [Recommended Setup](#environment-recommended-setup) for setting up Node.js so that the grunt command works.

### Environment: Getting the Source

* Create a fork of the jQuery UI repo on GitHub at http://github.com/jquery/jquery-ui. This will create a fork of jquery-ui in your Github account.
* You may want to clone jquery-ui under the path to your web server. If so, change to the required directory

```bash
cd /path/to/your/www/root/
```

* Clone your jQuery UI git repo.

```bash
git clone git://github.com/[USERNAME]/jquery-ui.git
cd jquery-ui
```

*Note: be sure to replace `[USERNAME]` with your GitHub username.*

* Add the official jQuery repository as a remote. We recommend naming it "upstream".

```bash
git remote add upstream git://github.com/jquery/jquery-ui.git
```

* Get in the habit of pulling in the "upstream" master to stay up to date as jQuery UI receives new commits.

```bash
git pull upstream master
```

### Environment: Recommended Setup

jQuery UI uses Node.js & Grunt to automate the building and validation of source code. Here is how to set that up:

* Get [Node.js](http://nodejs.org/) (includes NPM, necessary for the next step)
* Install Grunt cli:

```bash
npm install -g grunt-cli
```

* Install local Node.js modules

```bash
npm install
```

The tests require a local web server and the samples contain some PHP, so a PHP web server may be useful.

* Install a web server. Here are some you could use:
  * Windows: [WAMP download](http://www.wampserver.com/en/)
  * Mac: [MAMP download](http://www.mamp.info/en/index.html)
  * Linux: [Setting up LAMP](https://www.linux.com/learn/tutorials/288158-easy-lamp-server-installation)
  * [Mongoose (most platforms)](http://code.google.com/p/mongoose/)
  * [http-server](https://www.npmjs.com/package/http-server)

### Running the Tests

To lint the JavaScript, HTML, and CSS, as well as run a smoke test in PhantomJS, run grunt:

```bash
grunt
```

To run the tests for a specific plugin in your browser, open the appropriate file from the `/tests/unit/` directory, for example: `http://localhost/tests/unit/accordion/accordion.html`. The domain will be dependent on your local server configuration; if there is a port, be sure to include it.

Ideally you would test in all of our [supported browsers](http://jqueryui.com/browser-support/), but if you don't have all of these browsers available, that's ok.
