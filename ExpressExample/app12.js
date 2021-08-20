var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
const { runInNewContext } = require('vm');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');


var app = express();

app.set('port', process.env.PORT || 3000);
app.use('/public', static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//middleware 로 등록하기 
app.use(cookieParser());
app.use(expressSession({
    //session 에 대한 설정 정보
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

var router = express.Router();

router.route('/process/product').get(function(req, res){
    console.log('/process/product  라우팅 함수 호출됨.');

    //user 세션이 있는지 없는지 확인.
    if(req.session.user){
        res.redirect('/public/product.html');
    }else{
        res.redirect('/public/login2.html');
    }
});
///////////
//login할 때 post 방식으로 받는다. 
router.route('/process/login').post(function(req, res){
    console.log('/process/login 라우팅 함수 호출됨.');

   var paramId = req.body.id || req.query.id;
   var paramPassword = req.body.password || req.query.password;

   //parameter 가 어떤 것이 넘어왔는지 알고 싶으면
   console.log('요청 파라미터: ' + paramId + ',' + paramPassword);

    //session 안에 이미 user 이라는 정보가 들어있다면 이미 로그인을 한 것임.
    if (req.session.user){
        console.log('이미 로그인되어 있습니다.');
        
        res.redirect('/public/product.html');
    }else{
        //세션 저장
        req.session.user = {
            id: paramId,
            name: '소녀시대',
            authorized: true
        };
        res.writeHead(200, {"Content-Type": "text/html;charset=utf8"});
        res.write('<h1>로그인 성공</h1>');
        res.write('<p>Id: ' + paramId + '</p>');
        res.write('<br><br><a href="/process/product">상품 페이지로 이동하기</a>');//상품 페이지로 이동할 수 있는 링크 제공.  //session 정보를 이용해서 접근을 하게 된다.
        res.end();
        //로그인에 대한 코드 임.
        }
});


//아이디와 비밀번호를 입력한 후 [전송] 버튼을 누른다. 그러면 서버에서 로그인 상태를 유지하기 위해 user 세션을 저장한 후 로그인이 성공했다는 웹 문서를 보여준다. 

//connet.sild 쿠키는 웹 브라우저에서 세션 정보를 저장할 떄 만들어진 것이다. 
//즉, cookie 를 사용해 세션 정보를 저장하는 방식이다. 

///////////
//로그아웃에 대한 코드.
router.route('/process/logout').get(function(req, res){
    console.log('/process/logout 라우팅 함수 호출됨.');

    if(req.session.user){
        console.log('로그아웃합니다.');
        //session 정보를 없앤다.
        req.session.destroy(function(err){
            if(err){
                console.log('세션 삭제 시 에러 발생.');
                return;
            }
            console.log('세션 삭제 성공.');
            res.redirect('/public/login2.html');
        });
    }else{
        console.log('로그인되어 있지 않습니다. ');
        res.redirect('/public/login2.html');
    }
});


router.route('/process/setUserCookie').get(function(req, res){
    console.log('/process/setUserCookie 라우팅 함수 호출됨.');
    //응답 객체에 cookie 라는 함수를 사용할 수 있게 된다.
    res.cookie('user',{
        id: 'mike',
        name: '소녀시대',
        authorized: true
    });

    //setUserCookie 를 쓰면 웹 서버에서 브라우저에게 그것을 저장해 달라고 하는 것이다. 

    res.redirect('/process/showCookie');
});
//설정된 cookie 정보를 보는 것. 웹 브라우저에서 쿠키 정보를 가지고 있다. 
router.route('/process/showCookie').get(function(req, res){
    console.log('/process/showCookie 라우팅 함수 호출됨.');
    //client쪽으로 데이터를 보낸다. 
    res.send(req.cookies);
});

router.route('/process/login').post(function(req, res){
    console.log('/process/login 라우팅 함수에서 받음.');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    res.writeHead(200, {"Content-Type": "text/html;charset=utf8"});
    res.write("<h1>서버에서 로그인 응답</h1>");
    res.write("<div><p>" + paramId + "</p></div>");
    res.write("<div><p>" + paramPassword + "</p></div>");
    res.end();
});


app.use('/', router);

app.all('*', function(req, res){
    res.status(404).send('<h1>요청하신 페이지는 없어요.</h1>');
});


app.use(function(req, res, next){
    console.log('첫번째 미들웨어 호출됨.');

    var userAgent = req.header('User-Agent');
    var paramId = req.body.id || req.query.id;

    res.send('<h3>서버에서 응담. User-Agent ->' +userAgent + '</h3><h3>Param Id ->' + paramId + '</h3>');
});

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('익스프레스로 웹 서버를 실행함: ' + app.get('port'));
});
