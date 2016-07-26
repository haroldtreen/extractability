const assert = require('chai').assert;

const HtmlLoader = require('../lib/html-loader');
const assertions = require('../assertions');

describe('Expectations', () => {
    before((done) => {
        HtmlLoader.load().then(() => {
            done();
        }).catch(done);
    });

    it('each have a matching html file', () => {
        assertions.forEach((expectation) => {
            assert.isDefined(HtmlLoader.files[expectation.fixture]);
        });
    });
});
