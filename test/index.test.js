const assert = require('assert');
const sinon = require('sinon');
const { getBranches } = require('../index.js');

describe('#getBranches()', () => {
  it('should exit with status 1 when the command is executed unsucessfully', () => {
    sinon.stub(process, 'exit');
    getBranches();

    assert(process.exit.called);
    assert(process.exit.calledWith(1));
  });

  it('should return a list of branch', () => {
    const output = '  develop\n  feature/GC-483\n*  master\n';
    const callback = sinon.fake.returns(output);

    assert(getBranches(callback), output);
  });

  it('should exit with status 1 when there is no branches', () => {
    const callback = sinon.fake.returns('');

    getBranches(callback);

    assert(process.exit.called);
    assert(process.exit.calledWith(1));
  });

  it('should return an array with all branches', () => {
    const outputCmd = '  develop\n  feature/GC-483\n*  master\n';
    const outputExpected = ['develop', 'feature/GC-483', 'master'];

    const callback = sinon.fake.returns(outputCmd);

    assert.deepEqual(getBranches(callback), outputExpected);
  });
});
