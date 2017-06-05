(function($) {
    var highlight = function(text, escapedTerm){
      return text.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + escapedTerm + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
    };

    $.widget("ui.combobox", {
        options: {
            filter: null,
            prepareFilter: null,
            placeholder: null,
            preventFormSubmit: true
        },

        clear: function() {
            $(this).val("");
            this.element.val("");
            this.input.data("autocomplete").term = "";
            this.input.val("");
        },

        _create: function() {
            var options = this.options;


            var self = this,
                    $select = this.element.hide(),
                    selected = $select.children(":selected"),
                    value = selected.val() ? selected.text() : "";
            var $input = this.input = $("<input class='combobox'>")
                    .insertAfter($select)
                    .val(value);

            var filter = options['filter'],
                    prepareFilter = options['prepareFilter'],
                    placeholder = $select.attr('data-placeholder') || options['placeholder'];

            if (placeholder) {
                $input.attr('placeholder', placeholder);
            }

            if (options.preventFormSubmit) {
                $input.keydown(function(event){
                   if (event.keyCode == 13) {
                       event.preventDefault();
                       $input.autocomplete('option', 'change').call($input, event, {});
                       $input.autocomplete('close')
                   }
                });
            }

            var data = $select.find("option").map(function() {
                if (!this.value) {
                    return null;
                }
                var text = this.innerText || this.textContent;
                return {
                    original: text,
                    trimmed: text.trim(),
                    option: this
                };
            });

            $input.autocomplete({
                delay: 0,
                minLength: 0,

                // Show only matched items
                source: function(request, response) {
                    var termForRegex = $.ui.autocomplete.escapeRegex(request.term),
                            matcher = new RegExp(termForRegex, "i");
                    prepareFilter && prepareFilter(request.term);
                    response(data.map(function() {
                        if (this && (!request.term || matcher.test(this.trimmed)) && !(filter && filter(this)))
                            return {
                                label: highlight(this.original, termForRegex),
                                value: this.trimmed,
                                option: this.option
                            };
                    }));
                },

                change: function(event, ui) {
                    if (ui.item) {
                        return false;
                    }
                    var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($(this).val()) + "$", "i"),
                            valid = false;
                    prepareFilter && prepareFilter($(this).val());
                    data.each(function() {
                        if (matcher.test(this.trimmed) && !(filter && filter(this))) {
                            this.option.selected = valid = true;
                            self._trigger("selected", event, {
                                item: this.option
                            });
                            return false;
                        }
                    });

                    if (!valid) {
                        // remove invalid value, as it didn't match anything
                        self.clear();
                    }
                    return false;
                },

                select: function(event, ui) {
                    // Clear the box if not item was selected and the value typed in does not match anything
                    ui.item.option.selected = true;
                    return self._trigger("selected", event, {
                        item: ui.item.option
                    });
                }
            });

            $input.addClass("ui-widget ui-widget-content ui-corner-left");

            $input.data("autocomplete")._renderItem = function(ul, item) {
                return $("<li></li>")
                        .data("item.autocomplete", item)
                        .append("<a>" + item.label + "</a>")
                        .appendTo(ul);
            };

            this.button = $("<button type='button' class='combobox'>&nbsp;</button>")
                    .attr("tabIndex", -1)
                    .attr("title", "Show All Items")
                    .insertAfter($input)
                    .button({
                                icons: {
                                    primary: "ui-icon-triangle-1-s"
                                },
                                text: false
                            })
                    .removeClass("ui-corner-all")
                    .addClass("ui-corner-right ui-button-icon")
                    .click(function() {
                // close if already visible
                if ($input.autocomplete("widget").is(":visible")) {
                    $input.autocomplete("close");
                    return;
                }

                // pass empty string as value to search for, displaying all results
                $input.autocomplete("search", "");
                $input.focus();
            });
        },

        destroy: function() {
            this.input.remove();
            this.button.remove();
            this.element.show();
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);