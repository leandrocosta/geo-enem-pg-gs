define(function(require) {
    'use strict';

    var Backbone = require('backbone');

    var Model = Backbone.Model.extend({
        defaults: {
            'year':'2012',
            'metric':'media',
            'zoom': '5',
            'lat': '-14.23607626946754',
            'lon': '-51.4193958444208'
        },

        schema: {
            year: { title: 'Ano', type: 'Select', options: ['2012', '2011', '2010'] },
            metric: {title: 'Nota', type: 'Select', options: [
                {val: 'cn', label: 'ciências da natureza'},
                {val: 'ch', label: 'ciências humanas'},
                {val: 'lc', label: 'linguagens e códigos'},
                {val: 'mt', label: 'matemática'},
                {val: 'redacao', label: 'redação'},
                {val: 'media', label: 'média'}]}
        }
    });

    return Model;
});