const UPLINE = "РЕШИЛИ: ";
const TIMETOEND = "Срок исполнения";
const LASTRESH = "Решения предыдущих совещаний";
const OTVETV = "Ответственн";
const ZAMS = "заместители генерального директора";
const DIRECTOR = "Бакало"; 


module.exports = function(data) {
    let regPoruch = new RegExp("\d{1,}[.]");
    let parsedData = new Array();//Матрица данных, которые отправляем в БД
    data = data.replace(data.substr(0, data.indexOf(UPLINE) + 8 ), ""); //Убираем все до "РЕШИЛИ: " включительно. 
    // console.log(data);
    console.log();
    while(data.indexOf(TIMETOEND) != -1) {
        while(data.charAt(0)== ' ' || data.charAt(0)== '\n')
            (data.charAt(0)== ' ')? data = data.replace(" ","") : data = data.replace("\n","");
        if(data.indexOf(LASTRESH) == 0)
            break;
        substrOfData = data.slice(0, data.indexOf(TIMETOEND) + 29);//Вырезаем подстроку для обработки
        console.log(substrOfData);
        data = data.replace(substrOfData, "");//И сразу же удаляем ее
        NameOfAsgmnt = substrOfData.slice(substrOfData.indexOf(OTVETV)+16, substrOfData.indexOf("Срок")); // Выделяем имена ответственных
        if(NameOfAsgmnt.indexOf(DIRECTOR)!=-1||NameOfAsgmnt.indexOf(ZAMS)!=-1){ // Проверяем на наличие нужных имён
            DateOfExe = substrOfData.slice(substrOfData.indexOf(TIMETOEND + " – ") + TIMETOEND.length + 3, substrOfData.lastIndexOf(".")); // Выделяем дату поручения
            TextOfPoruch = substrOfData.slice(substrOfData.search(regPoruch) + regPoruch.length, substrOfData.indexOf(". \n" + OTVETV)); // Выделяем текст поручения
        } else continue;
        console.log();
        data=data.replace(substrOfData, "");
        substrOfData = null;
        let errandData = {
            errandText: TextOfPoruch,
            asgnName: NameOfAsgmnt,
            deadline: DateOfExe
        }
        parsedData.push(errandData);
    }
    return parsedData;
  }