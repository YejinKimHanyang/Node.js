//외장 모듈 로딩
var express = require('express');
var http = require('http');
var path = require('path');

//Express의 미들웨어 불러오기
var static = require('serve-static');
var bodyParser = require('body-parser');

//Express 객체 생성
var app = express();

//기본 속성 설정
app.set('port', process.env.PORT || 3000);

//middleware 등록 함수인 use 사용
app.use('/public', static(path.join(__dirname, 'public')));
//웹 브라우저에서 열린 폴더로 접근해서 해당 데이터를 가지고 갈 수 있다. 

//post 방식은 body 영역 안으로 들어간다.
//body-parser 를 사용해 application/x-www-form-urlencoded 파싱 
app.use(bodyParser.urlencoded({extended:false}));
//body-parser 를 사용해 application/json 파싱
app.use(bodyParser.json());

//middleware 를 등록한다(함수이다)
app.use(function(req, res, next){
    console.log('첫번째 미들웨어 호출됨.');
    
    var userAgent = req.header('User-Agent');
    var paramId = req.body.id || req.query.id; //post일 경우 앞, get 일 경우 뒤

    res.send('<h3>서버에서 응답. User-Agent -> ' + userAgent + '</h3><h3>Param Id ->' + paramId + '</h3>');
    
});

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('익스프레스로 웹 서버를 실행함: ' +  app.get('port'));
});

//서버쪽에서 client 가 보낸 데이터, header를 확인할 수 있다. 