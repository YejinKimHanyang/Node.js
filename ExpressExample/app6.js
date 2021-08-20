var express = require('express');
var http = require('http');

var app = express();

app.set('port', process.env.PORT || 3000);

//middleware 를 등록한다(함수이다)
app.use(function(req, res, next){
    console.log('첫번째 미들웨어 호출됨.');
    
    var userAgent = req.header('User-Agent');
    var paramName = req.query.name;

    res.send('<h3>서버에서 응답. User-Agent -> ' + userAgent + '</h3><h3>Param Name ->' + paramName + '</h3>');
    
});

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('익스프레스로 웹 서버를 실행함: ' +  app.get('port'));
});

//서버쪽에서 client 가 보낸 데이터, header를 확인할 수 있다. 