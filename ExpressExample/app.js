//Express 기본 모듈 불러오기
var express= require('express');
var http = require('http');

//익스프레스 객체 생성
var app = express();

//기본 포트를 app 객체에 속성으로 설정
app.set('port', process.env.PORT || 3000);

//express 를 이용해서 web server 를 만든다. 
var server = http.createServer(app).listen(app.get('port'), function(){
    //callback 함수는 웹 서버가 실행됐을 때 실행된다.  
    console.log('익스프레스로 웹 서버를 실행함: ' + app.get('port'));
});
