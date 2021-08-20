var http = require('http');

//웹 서버 객체를 만든다.
var server = http.createServer();

//웹 서버를 시작하여 3000번 포트에서 대기하도록 설정한다. 
var host = 'localhost';
var port = 3000;
server.listen(port, host, 50000, function(){
    console.log('웹서버 실행됨.');
});

//클라이언트 연결 이벤트 처리
server.on('connection', function(socket){ //connection 이라는 것이 실행되었을 때 이 callback 함수를 실행해달라는 뜻.
    console.log('클라이언트가 접속했습니다.');
});

//클라이언트 요청 이벤트 처리
server.on('request', function(req, res){ //client 에서 요청이 들어오면 req, res 를 전달한다. req 는 요청객체, res 는 응답객체이다. 
    console.log('클라이언트 요청이 들어왔습니다.');
    //console.dir(req);
    res.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});
    res.write('<h1>웹서버로부터 받은 응답</h1>');
    res.end();
    //write 가 실제 웹 페이지의 내용을 응답으로 보내준다는 뜻

});
//요청이 들어왔다라는 것은 connection event 가 발생했고, request event 도 발생했다라는 뜻. 



