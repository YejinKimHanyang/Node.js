var express = require('express');
var http = require('http');

var app = express();

app.set('port', process.env.PORT || 3000);

//middleware 를 등록한다(함수이다)
app.use(function(req, res, next){
    console.log('첫번째 미들웨어 호출됨.');

    req.user = 'mike';
    //위의 middleware 를 떠나게 됨
    next();
});

//req 에 속성을 넣어서 전달할 수 있다.
app.use(function(req, res, next){
    console.log('두번째 미들웨어 호출됨.')
    //send 가 간단하게 응답을 보낼 수 있다. 
    //res.send('<h1>서버에서 응답한 결과입니다:' + req.user + '</h1>'); //end()를 호출하여 응답을 보내면 처리 과정은 완전히 끝난다.
    var person = {name: '소녀시대', age:20};
    //자바스크립트를 넣을 경우
    //res.send(person);
    //json format 으로 나옴 (요즘 자주 사용되는 방식)
    //----------------------------------------------
    //자바스크립트 객체를 json형태로 바꿔서 보냈음. 
    //var personStr = JSON.stringify(person);
    //res.send(personStr);

    //body 안에 들어가는 type 을 적어줌. 
    res.writeHead(200, {"Content-Type": "text/html;charset=utf8"});
    res.write(person);
    res.end();

    //send 로 보낼 수도 있고 나누어서 writeHead 처럼 보낼 수 있다. 

})

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('익스프레스로 웹 서버를 실행함: ' +  app.get('port'));
});

