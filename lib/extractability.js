
const DefaultSuite = require('./default-suite');
const assert = require('chai').assert;

class Extractability {
    constructor() {
        DefaultSuite.load().then((suite) => {
            this.tests = suite;
        });

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
            },
        };
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

module.exports = Extractability;
