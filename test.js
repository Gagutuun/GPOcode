const { exec } = require('child_process');
const iconv = require('iconv-lite');

const cp866 = 'cp866';
const utf8 = 'utf-8';

function getUserInfo(username) {
    return new Promise((resolve, reject) => {
        const user_info = `net user ${username}`;
        exec(user_info, { encoding: cp866 }, (err, stdout, stderr) => {
            if (err) {
                reject(err);
                return;
            }
            if (stdout.length != 0) {
                resolve(iconv.decode(stdout, cp866).toString(utf8));
                return;
            }
            reject(iconv.decode(stderr, cp866).toString(utf8));
        })
    })
}

module.exports = { getUserInfo };