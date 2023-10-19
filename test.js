const { exec } = require('child_process');
const iconv = require('iconv-lite');

const cp866 = 'cp866';
const utf8 = 'utf-8';

const LOCAL_GROUPS_MARK = "Членство в локальных группах";
const GLOBAL_GROUPS_MARK = "Членство в глобальных группах";
const SUCCESS_MESSAGE = "Команда выполнена успешно.";

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

function _getGroups(userInfo, start, end) {
    return new Promise((resolve, reject) => {
        try {
            userInfo = userInfo.substring(userInfo.indexOf(start), userInfo.indexOf(`\n${end}`));
            userInfo = userInfo.substring(userInfo.indexOf("*"));
            let groups = userInfo.split("\r\n");
            for (let i = 0; i < groups.length; i++)
                groups[i] = groups[i].trim();
            resolve(groups);
        } catch (error) {
            reject(error);
        }
    });
}

function getLocalGroups(userInfo) {
    return _getGroups(userInfo, LOCAL_GROUPS_MARK, GLOBAL_GROUPS_MARK);
}

function getGlobalGroups(userInfo) {
    return _getGroups(userInfo, GLOBAL_GROUPS_MARK, SUCCESS_MESSAGE);
}

module.exports = { getUserInfo, getLocalGroups, getGlobalGroups };