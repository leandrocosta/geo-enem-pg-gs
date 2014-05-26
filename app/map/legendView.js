define(function(require) {
    'use strict';

    var Backbone = require('backbone');

    var View = Backbone.View.extend({
        className: 'map-legend',

        render: function() {
            var URL = this.model.baseLayer.url;
            var LAYER = this.model.baseLayer.params.LAYERS;
            var STYLE = this.model.baseLayer.params.STYLES;

            this.$el.html('<p>Nota média</p><img src="' + URL +
              '?REQUEST=GetLegendGraphic&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=' +
              LAYER + '&STYLE=' + STYLE + '">');

            return this;
        }
    });

    return View;
});