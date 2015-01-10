# [jQuery UI](http://jqueryui.com/) - Interactions and Widgets for the web

jQuery UI is a curated set of user interface interactions, effects, widgets, and themes built on top of jQuery. Whether you're building highly interactive web applications, or you just need to add a date picker to a form control, jQuery UI is the perfect choice.

If you want to use jQuery UI, go to [jqueryui.com](http://jqueryui.com) to get started, [jqueryui.com/demos/](http://jqueryui.com/demos/) for demos, [api.jqueryui.com](http://api.jqueryui.com/) for API documentation, or the [Using jQuery UI Forum](http://forum.jquery.com/using-jquery-ui) for discussions and questions.

If you want to report a bug/issue, please visit [bugs.jqueryui.com](http://bugs.jqueryui.com).

If you are interested in helping develop jQuery UI, you are in the right place.
To discuss development with team members and the community, visit the [Developing jQuery UI Forum](http://forum.jquery.com/developing-jquery-ui) or [#jqueryui-dev on irc.freenode.net](http://irc.jquery.org/).


## For Contributors

If you want to help and provide a patch for a bugfix or new feature, please take
a few minutes and look at [our Getting Involved guide](http://wiki.jqueryui.com/w/page/35263114/Getting-Involved).
In particular check out the [Coding standards](http://wiki.jqueryui.com/w/page/12137737/Coding-standards)
and [Commit Message Style Guide](http://contribute.jquery.org/commits-and-pull-requests/#commit-guidelines).

In general, fork the project, create a branch for a specific change and send a
pull request for that branch. Don't mix unrelated changes. You can use the commit
message as the description for the pull request.

For more information, see the [contributing page](CONTRIBUTING.md).

## Running the Unit Tests

Run the unit tests manually with appropriate browsers and any local web server. See our [environment setup](CONTRIBUTING.md#environment-minimum-required) and [information on running tests](CONTRIBUTING.md#running-the-tests).

You can also run the unit tests inside phantomjs by [setting up your environment](CONTRIBUTING.md#user-content-environment-recommended-setup).

## Building jQuery UI

jQuery UI uses the [Grunt](http://gruntjs.com/) build system.

To build jQuery UI, [setup your environment]([setting up your environment](CONTRIBUTING.md#environment-minimum-required)) and then run the following commands:

```sh
# Run the concat task to concatenate files
grunt concat

# There are many other tasks that can be run through Grunt.
# For a list of all tasks:
grunt --help
```
