var MongoClient = require('mongodb').MongoClient;

var database;
function connectDB(){
    var databaseUrl = 'mongodb://localhost:27017/local';

    MongoClient.connect(databaseUrl, function(err, client){
        if(err){
            console.log('데이터베이스 연결 시 에러 발생함');
            return;
        }
        console.log('데이터베이스에 연결됨: ' + databaseUrl);
        database = client.db('local'); //parameter 로 전달받은 db 객체를 database 에 할당해준다.  //version 3.0 이상일 경우 이렇게 db.db('') 이렇게 명시해 줘야 함. 
        // var adminDb = client.db('local').admin();
        // // List all the available databases
        // adminDb.listDatabases(function(err, dbs) {
        // console.log(dbs);
        // client.close();
        // });
        var collection = database.collection('users');
        var id = 'test01';
        var password = '123456';
        collection.insertOne({name: 'Yejin', age: '25'}, function(){
            collection.find({"id":id, "password": password}).toArray(function(err,docs){
                console.log(docs);
            });
        });
    });
}
//promise 보기
connectDB();

