define([
    'loglevel',
    'jquery',
    'underscore',
    '../../../src/js/index',
    '../models/catalog'
], function (log, $, _, Converter, CatalogItems) {

    'use strict';

    var s = {
            CONVERT: "[data-role='convert']"
        };

    function Dev() {

        this._importThirdPartyCss();

        console.clear();

        //trace, debug, info, warn, error, silent
        log.setLevel('trace');

        this.start();

    }

    Dev.prototype.start = function () {

        log.trace("Dev started");

        this._render();

    };

    Dev.prototype._render = function () {

      $(s.CONVERT).on("click", function() {
         console.log(Converter.toFilter(CatalogItems, {
             values : {
                 contextSystem : ["uneca"],
                 freeText : ["test"]
             }
         }))
      })
    };

    // utils

    Dev.prototype._importThirdPartyCss = function () {

        //Bootstrap
        require('bootstrap/dist/css/bootstrap.css');
    };

    return new Dev();

});