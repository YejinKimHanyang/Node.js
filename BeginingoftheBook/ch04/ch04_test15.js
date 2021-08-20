//3개의 외장모듈을 사용
var winston = require('winston');
var winstonDaily = require('winston-daily-rotate-file');
var moment = require('moment');


function timeStampFormat(){
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ');
}

var logger = new (winston.Logger)({
    //설정 정보
    transports: [
        new (winstonDaily)({
            name: 'info-file',
            filename: './log/server',
            datePattern: '_yyyy-MM-dd.log',
            colorize: false,
            maxsize: 50000000,
            maxFiles: 1000,
            level: 'info',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        }), //함수를 실행하고 그 안에 객체가 들어간다. 
        new (winston.transports.Console)({
            name: 'debug-console',
            colorize: true,
            level:'debug',
            showlevel: true,
            json: false,
            timestamp: timeStampFormat
        })
    ]
});

logger.debug('디버깅 메시지입니다.');
logger.error('에러 메시지입니다.');


//실행이 안됨!!!
