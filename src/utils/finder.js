const UPLINE = "РЕШИЛИ: ";
const LAST_MEETINGS = "Решения предыдущих совещаний";
/**
 * Регекс поиска поручений (их номеров), g - глобальный
 */
const ERRAND_NUMBER_REG_EX = /(^|\n)\d+[.]/g;
/**
 * Регекс поиска ответсвенных(-ого), i - невосприимчив к регистру
 */
const RESPONSIBLES_REG_EX = /ответственны.[ ]?.[ ]?/i;
/**
 * Регекс поиска ЗГД или Бакало, i - невосприимчив к регистру; u - использует unicode (чтобы \w работал); g - глобальный
 */
const RIGHT_RESPONSIBLE_NAME_REG_EX = /(заместители генерального директора)|(бакало [а-я][.][а-я][.])/ig
/**
 * Регекс поиска дедлайна, i - невосприимчив к регистру
 */
const DEADLINE_REG_EX = /((\d{1,2}\.){2}\d{4})|(постоянно)/i

/**
 * Функция поиска поручений в тексте протокола
 * @param {string} protocolText - текст протокола
 * @returns Массив структур, содержащих: текст поручения, его ответсвенных и дедлайн
 */
function findNewErrands(protocolText) {
    // Подготовка текста pdf для поиска поручений
    protocolText = _prepareText(protocolText);
    // Итераторы на все поручения в тексте
    const errandNumbersIterator = protocolText.matchAll(ERRAND_NUMBER_REG_EX);
    // Текущее значение итератора с номером поручения
    let currentIterator = errandNumbersIterator.next();
    let nextIterator = !currentIterator.done ? errandNumbersIterator.next() : null;
    let errands = [];
    let currentErrand;
    do {
        currentErrand = protocolText.substring(
            protocolText.charAt(currentIterator.value.index) != '\n'
                ? currentIterator.value.index
                : currentIterator.value.index + 1,
            nextIterator == null || nextIterator.done
                ? undefined
                : nextIterator.value.index
        );
        if (/^\d+[.][\n]/.exec(currentErrand) != null) {
            let incorrectNumber = /^\d+[.][\n]/.exec(currentErrand)[0];
            currentErrand = currentErrand.replace(incorrectNumber, incorrectNumber.substring(0, incorrectNumber.indexOf('.') + 1));
        }
        console.log(currentErrand);
        if (RIGHT_RESPONSIBLE_NAME_REG_EX.exec(currentErrand) != null) {
            errands.push({
                errandText: currentErrand.substring(0, currentErrand.indexOf(`\n${RESPONSIBLES_REG_EX.exec(currentErrand)[0]}`)).trim(),
                asgnName: currentErrand.match(RIGHT_RESPONSIBLE_NAME_REG_EX),
                deadline: currentErrand.match(DEADLINE_REG_EX)[0],
                toString() {
                    return `{\n\terrandText: '${this.errandText}',\n\tasgnName: '${this.asgnName}',\n\tdeadline: '${this.deadline}'\n}`
                }
            })
        }
        currentIterator = nextIterator;
        nextIterator = nextIterator.done ? null : errandNumbersIterator.next();
    } while (nextIterator != null);
    console.log("DEBUG");
    console.log(errands);
    return errands;
}

/**
 * Подготавливает текст протокола к поиску
 * @param {string} protocolText - текст протокола
 * @returns - обрезанный текст протокола
 */
function _prepareText(protocolText) {
    return _cutErrands(protocolText).replace(_cutLastErrands(protocolText), "").replace(LAST_MEETINGS, "").trim();
}

/**
 * Вырезает ненужный блок протокола (Шапку)
 * @param {string} protocolText - изначальный текст протокола
 * @returns текст протокола без шапки
 */
function _cutErrands(protocolText) {
    return protocolText.substring(protocolText.indexOf(UPLINE) + UPLINE.length).trim();
}

/**
 * Вырезает решения прошлых совещаний
 * @param {string} protocolText - текст протокола
 * @returns - решения прошлых совещаний
 */
function _cutLastErrands(protocolText) {
    return protocolText.substring(protocolText.indexOf(LAST_MEETINGS) + LAST_MEETINGS.length).trim();
}

module.exports = findNewErrands;