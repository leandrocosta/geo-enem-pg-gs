define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    require('backbone-forms');
    var template = require('text!form/template.html');

    var View = Backbone.Form.extend({
        template: _.template(template),
        schema: {
            year: { title: 'Ano', type: 'Select', options: ['2012', '2011', '2010'] },
            metric: {title: 'Nota', type: 'Select', options: ['Matemática', 'Redação', 'Média']}
        }
    });

    return View;
});