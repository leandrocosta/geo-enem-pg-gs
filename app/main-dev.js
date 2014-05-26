require.config({
    paths: {
        text: 'components/requirejs-text/text',
        jquery: 'components/jquery/dist/jquery',
        underscore: 'components/underscore/underscore',
        backbone: 'components/backbone/backbone',
        'backbone-forms': 'components/backbone-forms/distribution.amd/backbone-forms',
        openlayers: 'components/openlayers/OpenLayers'
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
