define(function(require) {
    'use strict';

    var $ = require('jquery');
    var Backbone = require('backbone');
    var OpenLayers = require('openlayers');

    var View = Backbone.View.extend({
        initialize: function(options) {
            _.extend(this, options);
        },

        render: function(){
            this.$el.html('<div id="legend" class="legend"><img src="http://geo-enem.rhcloud.com/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=enem:notas2012_municipio_redacao_avg"></div>');
        }
    });

    return View;
});