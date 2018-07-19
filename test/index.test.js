const assert = require("assert");
const sinon = require("sinon");
const { getBranches } = require("../index.js");

describe("#getBranches()", () => {
  before(() => {
    sinon.stub(process, "exit");
  });

  after(() => {
    process.exit.restore();
  });

  it("should exit with status 1 when there is no branches", () => {
    const callback = sinon.fake.returns("");

    getBranches(callback);

    assert(process.exit.called);
    assert(process.exit.calledWith(1));
  });

  it("should return an array with all branches", () => {
    const outputCmd = "  develop\n  feature/GC-483\n*  master\n";
    const outputExpected = ["develop", "feature/GC-483", "master"];

    const callback = sinon.fake.returns(outputCmd);

    assert.deepEqual(getBranches(callback), outputExpected);
  });
});
