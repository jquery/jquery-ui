# [jQuery UI](http://jqueryui.com/) - Interactions and Widgets for the web

jQuery UI is a curated set of user interface interactions, effects, widgets, and themes built on top of jQuery. Whether you're building highly interactive web applications, or you just need to add a date picker to a form control, jQuery UI is the perfect choice.

If you want to use jQuery UI, go to [jqueryui.com](http://jqueryui.com) to get started, [jqueryui.com/demos/](http://jqueryui.com/demos/) for demos, [api.jqueryui.com](http://api.jqueryui.com/) for API documentation, or the [Using jQuery UI Forum](http://forum.jquery.com/using-jquery-ui) for discussions and questions.

If you want to report a bug/issue, please visit [bugs.jqueryui.com](http://bugs.jqueryui.com).

If you are interested in helping develop jQuery UI, you are in the right place.
To discuss development with team members and the community, visit the [Developing jQuery UI Forum](http://forum.jquery.com/developing-jquery-ui) or [#jqueryui-dev on irc.freenode.net](http://irc.jquery.org/).


## For contributors

If you want to help and provide a patch for a bugfix or new feature, please take
a few minutes and look at [our Getting Involved guide](http://wiki.jqueryui.com/w/page/35263114/Getting-Involved).
In particular check out the [Coding standards](http://wiki.jqueryui.com/w/page/12137737/Coding-standards)
and [Commit Message Style Guide](http://contribute.jquery.org/commits-and-pull-requests/#commit-guidelines).

In general, fork the project, create a branch for a specific change and send a
pull request for that branch. Don't mix unrelated changes. You can use the commit
message as the description for the pull request.


## Running the Unit Tests

Run the unit tests with a local server that supports PHP. No database is required. Pre-configured php local servers are available for Windows and Mac. Here are some options:

- Windows: [WAMP download](http://www.wampserver.com/en/)
- Mac: [MAMP download](http://www.mamp.info/en/index.html)
- Linux: [Setting up LAMP](https://www.linux.com/learn/tutorials/288158-easy-lamp-server-installation)
- [Mongoose (most platforms)](http://code.google.com/p/mongoose/)


## Building jQuery UI

jQuery UI uses the [Grunt](http://github.com/gruntjs/grunt) build system.

To build jQuery UI, you must have [node.js](http://nodejs.org/) installed and then run the following commands:

```sh

# Install the Grunt CLI
npm install -g grunt-cli

# Clone the jQuery UI git repo
git clone git://github.com/jquery/jquery-ui.git
cd jquery-ui

# Install the node module dependencies
npm install

# Run the concat task to concatenate files
grunt concat

# There are many other tasks that can be run through Grunt.
# For a list of all tasks:
grunt --help
```
