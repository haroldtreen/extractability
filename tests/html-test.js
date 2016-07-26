const assert = require('chai').assert;
const Html = require('../lib/html-loader');

const path = require('path');
const fs = require('fs');

let htmlFiles;

describe('Html files', () => {
    before((done) => {
        Html.load().then(() => {
            fs.readdir(Html.path, (err, files) => {
                if (err) {
                    done(err);
                }

                htmlFiles = files;
                done();
            });
        });
    });

    it('loads all the html files', () => {
        const filesCount = htmlFiles.reduce((l, r) => {
            const newCount = /\.html/.test(r) ? l + 1 : l;
            return newCount;
        }, 0);
        assert.equal(Html.filesCount, filesCount);
    });

    it('creates a map of html files', (done) => {
        fs.readFile(path.join(Html.path, htmlFiles[0]), (err, content) => {
            if (err) {
                return done(err);
            }
            const key = path.basename(htmlFiles[0], '.html');
            assert.equal(Html.files[key], content.toString());
            return done();
        });
    });
});
