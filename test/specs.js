/*global describe, it, require*/
var expect = require("chai").expect;
var Converter = require("../src/js/index");

describe("Converter", function () {
    it("should be not null", function () {
        expect(Converter.toD3P({}, {})).to.be.not.null;
    });
});