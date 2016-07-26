const ExtractorTest = require('./extractor-test');
const HtmlLoader = require('./html-loader');
const assertions = require('../assertions');

class DefaultSuite {
    static load() {
        const suite = [];

        if (DefaultSuite.cache) {
            return Promise.resolve(DefaultSuite.cache);
        }

        return HtmlLoader.load().then(() => {
            assertions.forEach((assertion) => {
                const html = HtmlLoader.files[assertion.fixture];
                suite.push(new ExtractorTest(
                    Object.assign({}, { html }, assertion)
                ));
            });
            DefaultSuite.cache = suite;
            return Promise.resolve(suite);
        });
    }
}

module.exports = DefaultSuite;
