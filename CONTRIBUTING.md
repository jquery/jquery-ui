# Contributing to jQuery UI

Welcome! Thanks for your interest in contributing to jQuery UI. Most of our information on how to contribute to this and all other jQuery projects is over at [contribute.jquery.org](https://contribute.jquery.org). You'll definitely want to take a look at the articles on contributing [code](https://contribute.jquery.org/code).

You may also want to take a look at our [commit & pull request guide](https://contribute.jquery.org/commits-and-pull-requests/) and [style guides](https://contribute.jquery.org/style-guide/) for instructions on how to maintain your fork and submit your code. Before we can merge any pull request, we'll also need you to sign our [contributor license agreement](https://contribute.jquery.org/cla).

You can find us on [IRC](https://irc.jquery.org), specifically in #jqueryui-dev should you have any questions. If you've never contributed to open source before, we've put together [a short guide with tips, tricks, and ideas on getting started](https://contribute.jquery.org/open-source/). For other forms of discussion and support, please see the [jQuery UI support center](https://jqueryui.com/support/).

## Getting Involved

There are a number of ways to get involved with the development of jQuery UI. Even if you've never contributed code to an Open Source project before, we're always looking for help identifying bugs, writing and reducing test cases and documentation.

This is the best way to contribute to jQuery UI. Please read through the full guide detailing [How to Report Bugs](https://contribute.jquery.org/bug-reports/).

## Tips for Getting Started

### Environment: Minimum Required

If you are contributing changes you will need a fork of jquery-ui (see [Getting the Source](#environment-getting-the-source)). If you just want the source code you could clone jquery-ui directly:

```bash
git clone git://github.com/jquery/jquery-ui.git
cd jquery-ui
```

The tests can run in any local web server. Ideally you should test your patch in appropriate web browsers and if possible run `npm test` to lint the code and run automated tests (this will happen automatically when you create a pull request). See the [Recommended Setup](#environment-recommended-setup) for setting up Node.js so that the `npm test` command works.

### Environment: Getting the Source

* Create a fork of the jQuery UI repo on GitHub at https://github.com/jquery/jquery-ui. This will create a fork of jquery-ui in your Github account.
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

* Get in the habit of pulling in the "upstream" main branch to stay up to date as jQuery UI receives new commits.

```bash
git pull upstream main
```

### Environment: Recommended Setup

jQuery UI uses Node.js to automate the building and validation of source code. Here is how to set that up:

* Get [Node.js](https://nodejs.org/) (includes NPM, necessary for the next step)
* Install local Node.js modules

```bash
npm install
```

The tests require a local web server and the samples contain some PHP, so a PHP web server may be useful.

* Install a web server. Here are some you could use:
  * Windows: [WAMP download](https://www.wampserver.com/en/)
  * Mac: [MAMP download](https://www.mamp.info/en/mac/)
  * Linux: [Setting up LAMP](https://www.linux.com/learn/tutorials/288158-easy-lamp-server-installation)
  * [Mongoose (most platforms)](https://code.google.com/archive/p/mongoose/)
  * [http-server](https://www.npmjs.com/package/http-server)

### Running the Tests

To lint the JavaScript, HTML, and CSS, as well as run the full test suite in Headless Chrome:

```bash
npm test
```

To run the tests for a specific plugin in your browser, open the appropriate file from the `/tests/unit/` directory, for example: `http://localhost/tests/unit/accordion/accordion.html`. The domain will be dependent on your local server configuration; if there is a port, be sure to include it.

Ideally you would test in all of our [supported browsers](https://jqueryui.com/browser-support/), but if you don't have all of these browsers available, that's ok.
