const fs = require('fs');
const pdf =  require('pdf-parse');

async function parsePDF(path) {
    let textData;
    let dataBuf = fs.readFileSync(path);
    await pdf(dataBuf).then((data) => {
        textData = data.text;
    })
<<<<<<< HEAD
=======
    fs.writeFileSync('pdf.txt',textData,(err)=>{console.error(err)});
>>>>>>> 692b39fee651af06668f3d5f384d776d2a3e9379
    return textData;
}

module.exports = {parsePDF};