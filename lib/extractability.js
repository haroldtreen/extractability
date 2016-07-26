const expectations = require('../expectations');
const Html = require('../html/loader');
const assert = require('chai').assert;

class Extractability {
    constructor() {
        this.testFunctions = {
            include: (result, include) => {
                include.forEach((substring) => {
                    assert.include(result.content, substring);
                });
            },
            notInclude: (result, notInclude) => {
                notInclude.forEach((substring) => {
                    assert.notInclude(result.content, substring);
                });
            },
            title: (result, title) => {
                assert.equal(result.title, title);
            }
        }
    }

    runTest(result, test) {
        const errors = [];
        Object.keys(test.assertions).forEach((assertionName) => {
            const testFn = this.testFunctions[assertionName];
            if (testFn) {
                const testInput = test.assertions[assertionName];
                try {
                    testFn(result, testInput);
                } catch (e) {
                    errors.push(e);
                }
            }
        });

        return {
            html: test.html,
            title: result.title,
            content: result.content,
            fixture: test.fixture,
            errors,
        };
    }

    run(extractor) {
        return new Promise((resolve) => {
            const successes = [];
            const failures = [];
            this.tests.forEach((test) => {
                extractor(test.html).then((result) => {
                    const testResult = this.runTest(result, test);
                    if (testResult.errors.length === 0) {
                        successes.push(testResult);
                    } else {
                        failures.push(testResult);
                    }
                });
            });
            resolve({ successes, failures });
        });
    }

    setTests(tests) {
        this.tests = tests;
    }

    getTests() {
        return this.tests;
    }
}

Extractability.tests = {
    include: (result, include) => {
        include.forEach()
    }
}

function ExtractabilityA(extractor, options) {
    return Html.load().then(() => {
        const assertionPromises = expectations.map((expectation) =>
            Extractability.assertExpectation(extractor, expectation)
        );

        return Promise.all(assertionPromises).then((results) => {
            const successes = [];
            const fails = [];

            results.forEach((result) => {
                if (result.error) {
                    fails.push(result);
                } else {
                    successes.push(result);
                }
            });

            return Promise.resolve({
                successes,
                fails,
            });
        });
    });
}

Extractability.assertExpectation = (extractor, expectation) => {
    console.log(`Testing ${expectation.fixture}`);
    const html = Html.files[expectation.fixture];
    let extractedArticle;
    return extractor(html).then((article) => {
        extractedArticle = article;
        if (expectation.title && article.title) {
            assert.equal(expectation.title, article.title);
        }

        if (expectation.include) {
            expectation.include.forEach((substring) => {
                assert.include(article.content, substring);
            });
        }

        if (expectation.notInclude) {
            expectation.notInclude.forEach((substring) => {
                assert.notInclude(article.content, substring);
            });
        }

        return Promise.resolve({
            input: html,
            output: article.content,
        });
    }).catch((error) =>
        Promise.resolve({
            error,
            input: html,
            output: extractedArticle.content,
        })
    );
};

Extractability.expectations = expectations;

module.exports = Extractability;
