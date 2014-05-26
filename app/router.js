define(function(require) {
    "use strict";

    var $ = require('jquery');
    var Backbone = require("backbone");
    var MenuView = require('menu/view');
    var FormModel = require('form/model');
    var MapView = require('map/view');
    var util = require('common/util');

    var formModel = new FormModel();
    var menuView = new MenuView({ model:formModel });
    var mapView = new MapView({ model:formModel });

    $('body').append(menuView.el, mapView.el);
    menuView.render();
    mapView.render();

    return Backbone.Router.extend({
        routes: {
            "": "index",
            "/?*queryString": "index",
        },

        initialize: function(options) {
            formModel.on('change', this.onModelChange, this);
        },

        index: function(queryString) {
            var params = util.parseQueryString(queryString) || FormModel.prototype.defaults;
            console.log("Welcome to /", queryString, params);

            var attributes = _.extend(_.clone(formModel.attributes), params);
            console.log('attributes: ', attributes);

            formModel.set(attributes);
            menuView.form.setValue(attributes);
        },

        onModelChange: function(model) {
            console.log('Router.onModelChange(', model.attributes, ')');
            this.navigate(
                '/?year='+model.get('year') +
                '&metric='+model.get('metric')+
                '&zoom='+model.get('zoom') +
                '&lat='+model.get('lat') +
                '&lon='+model.get('lon'));
        }
    });
});