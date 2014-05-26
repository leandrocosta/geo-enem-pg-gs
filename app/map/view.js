define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var OpenLayers = require('openlayers');
    var popupTemplate = require('text!map/popupTemplate.html');
    var LegendView = require('map/legendView');
    var FormModel = require('form/model');

    var WMS_PATH = '/geoserver/enem/wms';

    function buildWMSLayerNotas(name, layer, style) {
        return new OpenLayers.Layer.WMS(name, WMS_PATH, {
            'layers': layer,
            'styles': style,
            'transparent': false,
            'format': 'image/png'}, {isBaseLayer: true});
    }

    function getLayerName(model) {
        return model.get('year') + ':' + model.get('metric');
    }

    var View = Backbone.View.extend({
        className: 'content-wrapper',

        initialize: function(options) {
            console.log('MapView.initialize(', options.model.attributes, ')');
            _.extend(this, options);

            this.layers = [];

            var years = FormModel.prototype.schema.year.options;
            var metrics = FormModel.prototype.schema.metric.options;

            for (var i in years) {
                for (var j in metrics) {
                    var year = years[i];
                    var metric = metrics[j].val;
                    this.layers.push(buildWMSLayerNotas(year+':'+metric, 'enem:vw_notas'+year+'_municipio', 'notas'+year+'_'+metric+'_ntile10'));
                }
            }

            this.layers.push(new OpenLayers.Layer.WMS("BR-UFs",
                WMS_PATH,
                {'layers': 'enem:lm_uf', transparent: true, format: 'image/png'},
                {isBaseLayer: false}
            ));

            this.layers.push(new OpenLayers.Layer.WMS("BR-Municípios",
                WMS_PATH,
                {'layers': 'enem:lm_municipio', transparent: true, format: 'image/png'},
                {isBaseLayer: false}
            ));
        },

        render: function(){
            this.$el.html('<div id="map" class="map"></div>');

            var map = this.map = new OpenLayers.Map({
                div: "map",
                projection: new OpenLayers.Projection("EPSG:4326"),
                layers: this.layers
            });

            var wmsGetFeatureInfoControl = new OpenLayers.Control.WMSGetFeatureInfo({
                url: WMS_PATH,
                maxFeatures: 12,
                layers: [this.layers[0], this.layers[6], this.layers[12]],
                vendorParams: {propertyName:[
                    'uf', 'nm_nng', 'candidatos_count', 'notas_count',
                    'nu_nt_cn_avg', 'nu_nt_ch_avg', 'nu_nt_lc_avg', 'nu_nt_mt_avg',
                    'nu_nota_comp1_avg', 'nu_nota_comp2_avg', 'nu_nota_comp3_avg',
                    'nu_nota_comp4_avg', 'nu_nota_comp5_avg', 'nu_nota_redacao_avg',
                    'nu_nota_media_avg'
                ]},
                infoFormat: 'application/json',
                /*title: 'Informações',*/
                eventListeners: {
                    getfeatureinfo: function(event) {
                        var json = JSON.parse(event.text);
                        var html = _.template(popupTemplate, {features:json.features});
                        map.addPopup(new OpenLayers.Popup.FramedCloud(
                            'info',
                            map.getLonLatFromPixel(event.xy),
                            null,
                            html, /*event.text,*/
                            null,
                            true
                        ));
                    }
                }
            });

            map.addControl(wmsGetFeatureInfoControl);
            wmsGetFeatureInfoControl.activate();

            /*wms2012redacao.mergeNewParams({'CQL_FILTER':"uf = 'MG'"});
            wms2012redacao.redraw();*/

            map.setBaseLayer(map.getLayersByName(getLayerName(this.model))[0]);
            map.setCenter(new OpenLayers.LonLat(this.model.get('lon'), this.model.get('lat')), this.model.get('zoom'));

            map.events.register('moveend', this, this.onMapMoveEnd);
            map.events.register('changelayer', this, this.onMapChangeLayer);
            this.model.on('change', this.onModelChange, this);

            this.legendView = new LegendView({ model:map });
            this.$el.append(this.legendView.render().$el);

            return this;
        },

        onModelChange: function(model) {
            console.log('MapView.onModelChange(', model.attributes, ')');
            var map = this.map;
            var layerName = getLayerName(model);

            if (layerName !== map.baseLayer.name) {
                console.log('change layer from ' + map.baseLayer.name + ' to ' + layerName);
                map.setBaseLayer(map.getLayersByName(layerName)[0]);
            }

            var center = map.getCenter();

            if (center.lat.toString() !== model.get('lat') ||
                center.lon.toString() !== model.get('lon') ||
                map.getZoom().toString() !== model.get('zoom')) {
                console.log('change center from (' + center.lat + ', ' + center.lon + ', ' + map.getZoom() + ') to (' + model.get('lat') + ', ' + model.get('lon') + ', ' + model.get('zoom') + ')');
                map.setCenter(new OpenLayers.LonLat(model.get('lon'), model.get('lat')), model.get('zoom'));
            }
        },

        onMapMoveEnd: function() {
            console.log('MapView.onMapMoveEnd()');
            var zoom = this.map.getZoom();
            var center = this.map.getCenter();
            this.model.set({
                zoom: zoom.toString(),
                lat: center.lat.toString(),
                lon: center.lon.toString()
            });
        },

        onMapChangeLayer: function() {
            console.log('MapView.onMapChangeLayer()');

            if (this.map.baseLayer.params.LAYERS !== 'enem:lm_uf') {
                this.legendView.render();
            }
        }
    });

    return View;
});
