const assert = require('chai').assert;

const HtmlLoader = require('../html/loader');
const Expectations = require('../expectations');

describe('Expectations', () => {
    before((done) => {
        HtmlLoader.load().then(() => {
            done();
        }).catch(done);
    });

    it('each have a matching html file', () => {
        Expectations.forEach((expectation) => {
            assert.isDefined(HtmlLoader.files[expectation.fixture]);
        });
    });
});
