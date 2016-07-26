const assert = require('chai').assert;

const ExtractorTest = require('../lib/extractor-test');
const Extractability = require('../index');

let runner;

const buildReadability = (output) => {
    return (html) => {
        return Promise.resolve(output);
    };
};

describe('Extractability', () => {
    beforeEach(() => {
        runner = new Extractability();
    });

    it('can be set with custom tests', () => {
        const test = new ExtractorTest({
            include: ['hello'],
        });

        runner.setTests([test]);

        assert.lengthOf(runner.getTests(), 1);
        assert.include(runner.getTests(), test);
    });

    it('runs the set tests', (done) => {
        const test = new ExtractorTest({
            html: 'hello, world',
            title: 'title',
            include: ['hello'],
            notInclude: ['world'],
        });
        runner.setTests([test]);

        const readability = buildReadability({ content: 'hello', title: 'title' });
        runner.run(readability).then((results) => {
            assert.lengthOf(results.successes, 1);
            assert.lengthOf(results.failures, 0);
            done();
        }).catch(done);
    });

    it('can return failures', (done) => {
        const test = new ExtractorTest({
            html: 'hello world',
            title: 'good title',
        });

        runner.setTests([test]);

        const readability = buildReadability({ title: 'bad title' });

        runner.run(readability).then((results) => {
            assert.lengthOf(results.successes, 0);
            assert.lengthOf(results.failures, 1);
            assert.include(results.failures[0].errors[0].message, 'good title');
            assert.include(results.failures[0].errors[0].message, 'bad title');
            done();
        }).catch(done);
    });
});
