const UPLINE = "РЕШИЛИ: ";
const TIMETOEND = "Срок исполнения";
const LASTRESH = "Решения предыдущих совещаний";
const OTVETV = "Ответственн";
const ZAMS = "заместители генерального директора";
const DIRECTOR = "Бакало";

// ---------------------------------------------------------------
const { Pool } = require('pg'); 
 
 const pool = new Pool({ 
 user: 'postgres', 
 host: 'localhost', 
 database: 'GAZPROM', 
 password: '523087', 
 port: 5432, 
 }); 
 
 pool.connect();
//---------------------------------------------------------------

const officeParser = require('officeparser');

officeParser.parseWordAsync("protokol.docx", false)
.then((data) => {
    Finder(data)
    })

function Finder(data) {
    let regPoruch = new RegExp("\d{1,}[.]");

    data = data.replace(data.substr(0, data.indexOf(UPLINE) + 8 ), ""); //Убираем все до "РЕШИЛИ: " включительно. 
    console.log(data);
    console.log();
    while(data.indexOf(TIMETOEND) != -1) {
        while(data.charAt(0)== ' ')
            data = data.replace(" ","");
        if(data.indexOf(LASTRESH) == 0)
            data = data.replace(LASTRESH + ' ',"");
        substrOfData = data.slice(0, data.indexOf(TIMETOEND) + 29);//Вырезаем подстроку для обработки
        data = data.replace(substrOfData, "");//И сразу же удаляем ее
        NameOfAsgmnt = substrOfData.slice(substrOfData.indexOf(OTVETV)+16, substrOfData.indexOf("Срок")); // Выделяем имена ответственных
        if(NameOfAsgmnt.indexOf(DIRECTOR)!=-1||NameOfAsgmnt.indexOf(ZAMS)!=-1){ // Проверяем на наличие нужных имён
            DateOfExe = substrOfData.slice(substrOfData.indexOf(TIMETOEND + " – ") + 18, substrOfData.indexOf(". П")); // Выделяем дату поручения
            TextOfPoruch = substrOfData.slice(substrOfData.search(regPoruch) + regPoruch.length, substrOfData.indexOf(". " + OTVETV)); // Выделяем текст поручения
        } else continue;
        console.log(substrOfData);
        //ReqToBase();
        data=data.replace(substrOfData, "");
        substrOfData = null;
    }
}

function ReqToBase() {
    pool.query('INSERT INTO data(data, otvet, poruch, date) VALUES($1, $2, $3, $4)', [substrOfData, NameOfAsgmnt, TextOfPoruch, DateOfExe], (err, res) => {
        if (err) throw err
            console.log("Запрос успешно выполнен!")
      })
}