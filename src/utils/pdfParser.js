const fs = require('fs');
const pdf =  require('pdf-parse');

async function parsePDF(path) {
    let textData;
    let dataBuf = fs.readFileSync(path);
    await pdf(dataBuf).then((data) => {
        textData = data.text;
    })
    return textData;
}

module.exports = {parsePDF};