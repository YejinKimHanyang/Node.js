var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
//오류 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

var app = express();


app.set('port', process.env.PORT || 3000);
app.use('/public', static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//라우터 객체 참조
var router = express.Router();


//routing 함수는 middleware 처럼 모두 받는 것이 아니라 요청 pass 만 처리한다. 요청 pass 가 아닌것에 대해서는 처리를 해줄 수 없다. 
//route에 요청 pass 를 지정하는 것이다. 요청 pass 로 들어온 것에 대해서 post 방식으로 처리하겠다는 뜻.
router.route('/process/login').post(function(req, res){ //이 요청 pass 로 들어온 것에 대해서만 처리하겠다는 뜻
    console.log('/process/login 라우팅 함수에서 받음.');

    //id 와 password 를 확인 할 수 있다. 
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password; 

    //응답 코드
    res.writeHead(200, {"Content-Type": "text/html;charset=utf8"});
    res.write("<h1>서버에서 로그인 응답</h1>");
    res.write("<div><p>" +  paramId + "</p></div>");
    res.write("<div><p>" +  paramPassword + "</p></div>");
    res.end();
});
//등록되지 않은 패스에 대해 페이지 오류 응답.
app.all('*', function(req, res){
    res.status(404).send('<h1>요청하신 페이지는 없어요.</h1>');
});

var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

//middleware 로 등록한다. router 함수를 사용할 수 있다. 
app.use('/', router);

app.use(function(req, res, next){
    console.log('첫번째 미들웨어 호출됨.');

    var userAgent = req.header('User-Agent');
    var paramId = req.body.id || req.query.id;

    res.send('<h3>서버에서 응답. User-Agent ->' + userAgent + '</h3><h3>Param Id ->' + paramId + '</h3>');
});

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('익스프레스로 웹 서버를 실행함: ' + app.get('port'));
});

