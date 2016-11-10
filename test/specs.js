/*global describe, it, require*/
var expect = require("chai").expect,
    Converter = require("../src/js/index"),
    catalogSelectors = require("./models/catalog");

describe("Converter", function () {
    it("should be not null", function () {
        expect(Converter.toD3P({}, {})).to.be.not.null;
    });

    it("should order filter", function () {
        expect(Converter.toFilter(catalogSelectors, {
            values : {
                referenceArea : ["18"],
                resourceType : ["dataset"]
            }
        })).to.be.not.null;
    });
});