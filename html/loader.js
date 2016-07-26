const fs = require('fs');
const path = require('path');

const fileToPromise = (filename) => {
    const filepath = path.join(__dirname, filename);
    return new Promise((resolve) => {
        fs.readFile(filepath, (err, content) => {
            const value = err ? null : content.toString();
            resolve(value);
        });
    });
};

class Html {
    static load() {
        return new Promise((resolve, reject) => {
            fs.readdir(this.path, (err, files) => {
                if (err) {
                    return reject(err);
                }

                const htmlFiles = files.filter((file) => /\.html/.test(file));
                const promises = htmlFiles.map((file) => fileToPromise(file));

                Promise.all(promises).then((contents) => {
                    Html.files = {};
                    htmlFiles.forEach((file, index) => {
                        Html.files[path.basename(file, '.html')] = contents[index];
                    });
                    Html.filesCount = Object.keys(Html.files).length;
                    resolve(Html);
                });
            });
        });
    }
}

Html.path = __dirname;

module.exports = Html;
