define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var FormView = require('form/view');

    var View = Backbone.View.extend({
        className: 'pure-menu pure-menu-open pure-menu-horizontal',

        initialize: function(options) {
            console.log('MenuView.initialize(', options.model.attributes, ')');
            _.extend(this, options);

            this.form = new FormView({ model: this.model });

            this.form.on('year:change', this.onFormInputChange);
            this.form.on('metric:change', this.onFormInputChange);
        },

        render: function(){
            this.$el.html('<a class="pure-menu-heading">Geo-Enem</a>');
            this.$el.append(this.form.render().el);
            return this;
        },

        onFormInputChange: function(form, editor, extra) {
            form.model.set(editor.getName(), editor.getValue());
        }
    });

    return View;
});