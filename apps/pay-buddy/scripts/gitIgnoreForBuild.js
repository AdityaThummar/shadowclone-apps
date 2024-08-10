const fs = require('fs');
const gitignorePath = '../.gitignore';

function makeProd() {
    try {
        console.log("------!!---------MAKING-CHANGES-FOR-PROD---------!!--------")
        const data = fs.readFileSync(gitignorePath, 'utf8');
        const newData = data?.replace("configs/*", "#configs/*")
        fs.writeFileSync(gitignorePath, newData, 'utf8');
        console.log("------!!---CONFIGS-ARE-REMOVED-FROM-GIT-IGNORE---!!--------")
    } catch (err) {
        console.error('Error reading .gitignore:', err);
    }
}

makeProd();