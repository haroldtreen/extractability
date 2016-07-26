class ExtractorTest {
    constructor(test) {
        this.html = test.html;
        this.assertions = test || {};
    }
}

module.exports = ExtractorTest;
