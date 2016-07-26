const readability = require('node-readability');

function NodeReadabilityWrapper(html) {
    return new Promise((resolve, reject) => {
        readability(html, (err, article) => {
            if (err) {
                reject(err);
            } else {
                article.close();
                resolve({
                    content: article.content,
                    title: article.title,
                });
            }
        });
    });
}

module.exports = NodeReadabilityWrapper;
