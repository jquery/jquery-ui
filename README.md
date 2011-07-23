[jQuery UI](http://jqueryui.com/) - Interactions and Widgets for the web
================================

jQuery UI provides interactions like Drag and Drop and widgets like Autocomplete, Tabs and Slider and makes these as easy to use as jQuery itself.

If you want to use jQuery UI, go to [jqueryui.com](http://jqueryui.com) to get started. Or visit the [Using jQuery UI Forum](http://forum.jquery.com/using-jquery-ui) for discussions and questions.

If you are interested in helping developing jQuery UI, you are in the right place.
To discuss development with team members and the community, visit the [Developing jQuery UI Forum](http://forum.jquery.com/developing-jquery-ui).

For contributors
---
If you want to help and provide a patch for a bugfix or new feature, please take
a few minutes and look at [our Getting Involved guide](http://wiki.jqueryui.com/w/page/35263114/Getting-Involved),
in particular check out the [Coding standards](http://wiki.jqueryui.com/w/page/12137737/Coding-standards)
and [Commit Message Style Guide](http://wiki.jqueryui.com/w/page/25941597/Commit-Message-Style-Guide).

In general, fork the project, create a branch for a specific change and send a
pull request for that branch. Don't mix unrelated changes. You can use the commit
message as the description for the pull request.


For committers
---
When looking at pull requests, first check for [proper commit messages](http://wiki.jqueryui.com/w/page/12137724/Bug-Fixing-Guide).

Unless everything is fine and you can merge directly via GitHub's interface, fetch the remote first:

    git remote add [username] [his-fork.git] -f

If you want just one commit and edit the commit message:

    git cherry-pick -e [sha-of-commit]

If it should go to the stable brach, cherry-pick it to stable:

    git checkout 1-8-stable
    git cherry-pick -x [sha-of-commit]
