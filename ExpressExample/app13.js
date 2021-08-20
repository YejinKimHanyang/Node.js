var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
const { runInNewContext } = require('vm');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var multer = require('multer'); //파일을 upload 할 때 도와줌
var fs = require('fs'); //file 과 관련된 거면 이거 사용

var cors = require('cors'); //다중 서버 접속. 어디서든 다중 서버 접속에 문제를 해결하기 위한 것. 
const { Z_DATA_ERROR } = require('zlib');

var app = express();

//static 은 특정 폴더의 파일들을 특정 패스로 접근할 수 있돌고 만들어 준다. 
app.set('port', process.env.PORT || 3000);
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads'))); //요청패스와 특정 폴더를 매핑해주겠다는 뜻. uploads 이라고 web browser 에서 쓰면 'uploads' 폴더와 매핑해줌. 


//application/x-www-form-urlencoded 형식으로 전달된 요청 파라미터를 파싱할 수 있다. 
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

app.use(cors()); //이렇게 cors 실행

var storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, 'uploads'); //어떤 폴더로 upload 할 건지 
    },
    filename: function(req, file, callback){
        //callback(null, file.orginalname + Date.now());

        // 파일이 upload 될 때 이름을 어떻게 할 것인지
        var extension = path.extname(file.originalname); //확장자만 빼내는 것임
        var basename = path.basename(file.originalname, extension); // 이름만 넣는 것임
        callback(null, basename + Date.now() + extension);
    }
});

//몇개까지 올릴 수 있게 할 것인지
var upload = multer({
    storage:storage,
    limits:{
        files:10,
        fileSize:1024*1024*1024
    }
});


var router = express.Router();

//routing 함수 등록하기.
//클라이언트에서 /procfes/photo 를 요청할경우 post 방식으로 응답한다. 
router.route('/process/photo').post(upload.array('photo', 1), 
function(req, res) { //photo 라는 이름으로 넘어온 파일이 있으면 1개가 넘어오더라도 배열로 들어가도록 함
    console.log('/process/photo 라우팅 함수 호출됨.');

    var files = req.files;
    console.log('=== 업로드된 파일 ===');
    if(files.length > 0){
        console.dir(files[0]);
    }else{
        console.dir('파일이 없습니다.');
    }
    var originalname;
    var filename;
    var mimetype;
    var size;

    if(Array.isArray(files)){
        for(var i = 0; i < files.length; i++){
            originalname = files[i].originalname;
            filename = files[i].filename;
            mimetype = files[i].mimetype;
            size = files[i].size;
        }
    }
    res.writeHead(200, {"Content-Type": "text/html;charset=utf8"});
    res.write("<h1>파일 업로드 성공</h1>");
    res.write("<p>원본파일: " +  originalname + "</p>"); //어떤 파일인지 넣을려면 이것이 필요함 
    res.write("<p>저장파일: " + filename + "</p>"); //중복되지 않도록 이름을 변경한다.
    res.end();


});

router.route('/process/product').get(function(req, res){
    console.log('/process/product  라우팅 함수 호출됨.');

    //로그인을 할때 아이디가 맞을 때와 그렇지 않을 때
    if(req.session.user){
        res.redirect('/public/product.html');
    }else{
        res.redirect('/public/login2.html');
    }
});
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
