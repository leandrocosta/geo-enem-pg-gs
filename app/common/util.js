define(function(require) {
    'use strict';

    var _ = require('underscore');

    function parseQueryString(queryString){
        if (! queryString) {
            return null;
        }

        var params = {};

        _.each(
            _.map(decodeURI(queryString).split(/&/g),function(el,i){
                var aux = el.split('='), o = {};
                if(aux.length >= 1){
                    var val;
                    if(aux.length == 2)
                        val = aux[1];
                    o[aux[0]] = val;
                }
                return o;
            }),
            function(o){
                _.extend(params,o);
            }
        );

        return params;
    }

    return {
        parseQueryString:parseQueryString
    };
});