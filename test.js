const { exec } = require('child_process');
const iconv = require('iconv-lite');

/**
 * Кодировка cp866
 */
const cp866 = 'cp866';
/**
 * Кодировка utf-8
 */
const utf8 = 'utf-8';

/**
 * Метка для нахождения локальных групп
 */
const LOCAL_GROUPS_MARK = "Членство в локальных группах";
/**
 * Метка на нахождение глобальных групп
 */
const GLOBAL_GROUPS_MARK = "Членство в глобальных группах";
/**
 * Метка "успешного завершения команды" (идет после глобальных групп)
 */
const SUCCESS_MESSAGE = "Команда выполнена успешно.";

/**
 * Возвращает системную информацию о пользователе
 * @param {string} username - имя пользователя
 * @returns Промис на результирующую строку выполнения команды "net user USER_NAME"
 */
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

/**
 * Возвращает массив групп, к которым принадлежит пользователь
 * @param {string} userInfo - информация о пользователе
 * @param {string} start - начальная метка
 * @param {string} end - конечная метка
 * @returns Промис на возвращение массива групп
 */
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

/**
 * Возвращает все локальные группы, к которым принадлежит пользователь
 * @param {string} userInfo - информация о пользователе
 * @returns Промис на массив групп
 */
function getLocalGroups(userInfo) {
    return _getGroups(userInfo, LOCAL_GROUPS_MARK, GLOBAL_GROUPS_MARK);
}

/**
 * Возвращает все глобальные группы, к которым принадлежит пользователь
 * @param {string} userInfo - информация о пользователе
 * @returns Промис на массив групп
 */
function getGlobalGroups(userInfo) {
    return _getGroups(userInfo, GLOBAL_GROUPS_MARK, SUCCESS_MESSAGE);
}

module.exports = { getUserInfo, getLocalGroups, getGlobalGroups };