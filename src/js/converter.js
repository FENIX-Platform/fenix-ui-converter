if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'jquery',
    'underscore',
    'loglevel',
    'handlebars'
], function ($, _, log, Handlebars) {

    'use strict';

    function Converter() {
        return this;
    }

    /* CONVERTER */

    Converter.prototype.toD3P = function (items, values) {

        var filter = {},
            self = this;

        _.each(values.values, function (val, id) {

            var v = self.cleanArray(val),
                config = items[id] || {},
                formatConfig = config.format || {};

            var key = formatConfig.items || id;

            if (v.length > 0) {
                filter[key] = $.extend(true, {}, self.compileFilter(id, v, items));
            } else {
                log.warn(id + " column excluded from FENIX conversion because it has no values");
            }

        });

        return filter;
    };

    Converter.prototype.toFilter = function (items, values) {

        var filter = {},
            self = this;

        _.each(values.values, function (val, id) {

            var v = self.cleanArray(val),
                config = items[id] || {},
                formatConfig = config.format || {};

            var key = formatConfig.metadataAttribute;

            if (!key) {
                log.warn(id + " impossible to find format.metadataAttribute configuration");
                return;
            }

            if (v.length > 0) {
                filter[key] = $.extend(true, {}, self.compileFilter(id, v, items));
            } else {
                log.warn(id + " column excluded from FENIX filter because it has no values");
            }

        });

        return filter;
    };

    Converter.prototype.compileFilter = function (id, values, items) {

        var config = items[id] || {},
            formatConfig = config.format || {},
            template = formatConfig.template,
            output = formatConfig.output || "codes";

        if (template) {
            return this.compileTemplate(id, values, config, template);
        }

        var key = formatConfig.dimension || id,
            tmpl;

        switch (output.toLocaleLowerCase()) {
            case "codes" :

                tmpl = '{ "codes":[{"uid": "{{{uid}}}", "version": "{{version}}", "codes": [{{{codes}}}] } ]}';
                return this.compileTemplate(id, values, config, key, tmpl);

                break;
            case "time" :

                return this.createTimeFilter(id, values, config, key);
                break;

            case "enumeration" :

                return this.createEnumerationFilter(id, values, config, key);
                break;
            default :
                log.warn(id + " not included in the result set. Missing format configuration.");
                return {};
        }

    };

    Converter.prototype.compileTemplate = function (id, values, config, key, template) {

        /*
         Priority
         - values
         - format configuration
         - code list configuration
         */

        var model = $.extend(true, config.cl, config.format, {codes: '"' + values.join('","') + '"'});

        if (!template) {
            log.error("Impossible to find '" + id + "' process template. Check your '" + id + "'.filter.process configuration.")
        }

        if (!model.uid) {
            log.error("Impossible to find '" + id + "' code list configuration for FENIX output format export.");
            return;
        }

        var tmpl = Handlebars.compile(template),
            process = JSON.parse(tmpl(model)),
            codes = process.codes;

        //Remove empty version attributes
        _.each(codes, function (obj) {
            if (!obj.version) {
                delete obj.version;
            }
        });

        return process;

    };

    Converter.prototype.createTimeFilter = function (id, values, config, key) {

        var time = [],
            valuesAreObject = typeof values[0] === 'object',
            v;

        if (valuesAreObject) {

            var from = _.findWhere(values, {parent: "from"}) || {},
                to = _.findWhere(values, {parent: "to"}) || {},
                couple = {from: null, to: null};

            couple.from = from.value;
            couple.to = to.value;

            time.push($.extend({}, couple));

        } else {

            v = values.map(function (a) {
                return parseInt(a, 10);
            }).sort(function (a, b) {
                return a - b;
            });


            _.each(v, function (i) {
                time.push({from: i, to: i});
            });

        }

        return {time: time};
    };

    Converter.prototype.createEnumerationFilter = function (id, values, config, key) {

        return {enumeration: values};

    };

    Converter.prototype.cleanArray = function (actual) {
        var newArray = [];
        for (var i = 0; i < actual.length; i++) {
            if (actual[i]) {
                newArray.push(actual[i]);
            }
        }
        return newArray;
    };

    return new Converter();

});