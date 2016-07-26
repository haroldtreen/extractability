const fs = require('fs');
const path = require('path');

const fileToPromise = (filename) => {
    const filepath = path.join(HtmlLoader.path, filename);
    return new Promise((resolve) => {
        fs.readFile(filepath, (err, content) => {
            const value = err ? null : content.toString();
            resolve(value);
        });
    });
};

class HtmlLoader {
    static load() {
        if (HtmlLoader.files) {
            return Promise.resolve(HtmlLoader); // cached
        }

        return new Promise((resolve, reject) => {
            fs.readdir(this.path, (err, files) => {
                if (err) {
                    return reject(err);
                }

                const htmlFiles = files.filter((file) => /\.html/.test(file));
                const promises = htmlFiles.map((file) => fileToPromise(file));

                Promise.all(promises).then((contents) => {
                    HtmlLoader.files = {};
                    htmlFiles.forEach((file, index) => {
                        HtmlLoader.files[path.basename(file, '.html')] = contents[index];
                    });
                    HtmlLoader.filesCount = Object.keys(HtmlLoader.files).length;
                    resolve(HtmlLoader);
                });
            });
        });
    }
}

HtmlLoader.path = path.resolve(__dirname, '..', 'html');

module.exports = HtmlLoader;
