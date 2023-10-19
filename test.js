const os = require('os');
const { exec } = require('child_process');
const iconv = require('iconv-lite');
const cp866 = 'cp866';
const utf8 = 'utf-8';
const user_info = `net user ${os.userInfo().username}`;

exec(user_info, { encoding: cp866 }, (err, stdout, stderr) => {
    if (err) {
        console.error(err);
        return;
    }
    if (stdout.length != 0)
        console.log(iconv.decode(stdout, cp866).toString(utf8));
    else
        console.log(iconv.decode(stderr, cp866).toString(utf8));
})