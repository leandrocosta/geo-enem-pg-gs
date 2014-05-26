require.config({
    paths: {
        text: 'components/requirejs-text/text',
        jquery: '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.min',
        underscore: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min',
        backbone: '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min',
        'backbone-forms': 'components/backbone-forms/distribution.amd/backbone-forms',
        openlayers: '//cdnjs.cloudflare.com/ajax/libs/openlayers/2.13.1/OpenLayers'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        openlayers: {
            exports: 'OpenLayers'
        }
    }
});

require(['backbone', 'router'], function(Backbone, Router) {
    var router = new Router();
    Backbone.history.start({ pushState: true });
});
