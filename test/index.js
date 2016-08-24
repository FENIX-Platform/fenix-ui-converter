/*global describe, it, require*/
var expect = require("chai").expect;
var Module = require("../src/js/bridge");

describe("Bridge", function () {

    var bridge = new Bridge({
        cache : false,
        environment : "develop"
    });

    it("should be not null", function () {
        expect(bridge.getCacheKey({test: true})).to.be.true;
    });
});

console.log("-*------------------------------------------------")
console.log(Module)

/*


describe("cats", function () {

    var cats = Module.getCats();

    it("is array", function () {
        expect(cats).to.be.instanceOf(Array);
    });

    it("there are 3 cats", function () {
        expect(cats).to.have.lengthOf(3);

    });
});
*/
