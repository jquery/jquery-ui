# Mouse Wheel ChangeLog


# 3.0.2

* Fixed delta being opposite value in latest Opera
* No longer fix pageX, pageY for older mozilla browsers
* Removed browser detection
* Cleaned up the code


# 3.0.1

* Bad release... creating a new release due to plugins.jquery.com issue :(


# 3.0

* Uses new special events API in jQuery 1.2.2+
* You can now treat "mousewheel" as a normal event and use .bind, .unbind and .trigger
* Using jQuery.data API for expandos


# 2.2

* Fixed pageX, pageY, clientX and clientY event properties for Mozilla based browsers


# 2.1.1

* Updated to work with jQuery 1.1.3
* Used one instead of bind to do unload event for clean up.


# 2.1

* Fixed an issue with the unload handler


# 2.0

* Major reduction in code size and complexity (internals have change a whole lot)


# 1.0

* Fixed Opera issue
* Fixed an issue with children elements that also have a mousewheel handler
* Added ability to handle multiple handlers