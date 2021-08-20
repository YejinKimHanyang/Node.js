var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
//오류 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');
// mongodb 모듈 사용
var MongoClient = require('mongodb').MongoClient;

var database;
function connectDB(){
    var databaseUrl = 'mongodb://localhost:27017/local';

    MongoClient.connect(databaseUrl, function(err, db){
        if(err){
            console.log('데이터베이스 연결 시 에러 발생함');
            return;
        }
        console.log('데이터베이스에 연결됨: ' + databaseUrl);
        database = db.db('collection'); //parameter 로 전달받은 db 객체를 database 에 할당해준다.  //version 3.0 이상일 경우 이렇게 db.db('') 이렇게 명시해 줘야 함. 
    });
}

var app = express();

//static 은 특정 폴더의 파일들을 특정 패스로 접근할 수 있돌고 만들어 준다. 
app.set('port', process.env.PORT || 3000);
app.use('/public', static(path.join(__dirname, 'public')));

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




var router = express.Router();

//browser 혹은 client 쪽에서 요청 패스를 정하게 되면 여기에서 정한 것과 매칭이 된다. 
router.route('/process/login').post (function(req, res){
    console.log('/process/login 라우팅 함수 호출됨.');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    console.log('요청 파라미터: ' + paramId + ', ' + paramPassword);

    if(database){
        authUser(database, paramId, paramPassword, function(err, docs){
            if(err){
                console.log('에러발생');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>에러 발생</h1>');
                res.end();
                return;
            }
            if(docs){
                console.dir(docs);

                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 로그인 성공</h1>');
                res.write('<div><p>사용자: ' + docs[0].name + '</p></div>');
                res.write('<br><br><a href="/public/login.html">다시 로그인하기</a>');
                res.end();
            }else{
                console.log('에러발생');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 데이터 조회 안됨.</h1>');
                res.end();
            }
        });
    }else{
        console.log('에러발생');
        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
        res.write('<h1>데이터베이스 연결 안됨.</h1>');
        res.end();
    }
});


router.route('/process/adduser').post(function(req, res){
    console.log('/process/adduser 라우팅 함수 호출됨.');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;

    console.log('요청 파라미터: ' + paramId + ', ' + paramPassword + ', ' +  paramName);

    if(database){
        addUser(database, paramId, paramPassword, paramName, function(err, result){
            if(err){
                console.log('에러발생');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>에러 발생</h1>');
                res.end();
                return;
            }

            if (result){
                console.dir(result);

                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 로그인 성공</h1>');
                res.write('<div><p>사용자: ' + paramName + '</p></div>');
                res.end();
            }else{
                console.log('에러발생');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 데이터 조회 안됨.</h1>');
                res.end();
            }
        })
    } else {
        console.log('에러발생');
        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
        res.write('<h1>데이터베이스 연결 안됨.</h1>');
        res.end();
    }
});

app.use('/', router);

//db 를 사용해서 로그인하는 걸 만들고 싶은 경우
//요청 parameter 를 실행할 수 있게 routing 함수를 추가하면 된다. 
//db에 저장된 데이터를 이용해서 로그인 인식을 하는 함수 만들기

var authUser = function(db, id, password, callback){
    console.log('authUser 호출됨: ' + id + ', ' + password);

    var users = db.collection('users'); //users 이라는 우리가 만든 collection  을 참조할 수 있게 된다. 
    users.find({"id":id, "password":password}).toArray(function(err, docs){ //여기에서 docs 는 record 를 뜻함
        if(err){
            callback(err, null);
            return;
        }
        if(docs.length > 0){
            console.log('일치하는 사용자를 찾음.');
            callback(null, docs);
        }else{
            console.log('일치하는 사용자를 찾지 못함.');
            callback(null, null);
        }
    });
};

var addUser = function(db, id, password, name, callback){
    console.log('addUser 호출됨: ' +  id + ', ' +  password + ', ' + name);
    var users = db.collection('users');

    users.insertMany([{"id":id, "password": password, "name": name}], function(err, result){
        if(err){
            callback(err, null);
            return;
        }
        if(result.insertedCount > 0){
            console.log('사용자 추가됨: ' + result.insertedCount);
            callback(null, result);
        }else{
            console.log('추가된 레코드가 없음.');
            callback(null, null);
        }
    });
};

var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);


http.createServer(app).listen(app.get('port'), function(){
    console.log('익스프레스로 웹 서버를 실행함: ' + app.get('port'));

    //웹 서버 실행 후 db 와 연결 
    connectDB();
});


