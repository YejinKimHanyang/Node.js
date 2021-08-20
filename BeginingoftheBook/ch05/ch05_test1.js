var http = require('http');

//웹 서버 객체를 만든다
var server = http.createServer();

//웹 서버를 시작하여 3000번 포트에서 대기한다
var host = 'localhost';
var port = 3000;
server.listen(port, host, '50000', function(){  //접속가능한 client 의 수가 50000으로 제한한다는 뜻 
    console.log('웹 서버가 시작되었습니다:',  host, ':', port);
});

//응답을 주지 않기 때문에 web browser 에서 반응이 없는 것이다
