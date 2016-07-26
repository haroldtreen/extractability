const assert = require('chai').assert;
const ExtractorTest = require('../lib/extractor-test');
const DefaultSuite = require('../lib/default-suite');

let suite;

describe('Default suite', () => {
    before((done) => {
        DefaultSuite.load().then((extractorTests) => {
            suite = extractorTests;
            done();
        }).catch(done);
    });

    it('is an array of extractor tests', () => {
        suite.forEach((test) => {
            assert.instanceOf(test, ExtractorTest);
        });
    });
});
