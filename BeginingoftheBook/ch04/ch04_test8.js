var fs = require('fs');

//파일에 데이터를 씁니다
fs.open('./output.txt', 'w', function(err, fd){
    if(err) throw err;
    //콜백함수 안임.
    var buf = new Buffer('안녕!\n');
    fs.write(fd, buf, 0, buf.length, null, function(err, written, buffer){ //fd 는 위에function(err, fd) 에서 전달받은 파라미터임. 0 부터 buf.length 까지 출력하도록 함. 
        if(err) throw err;

            console.log(err, '+' , written, '+', buffer);
            fs.close(fd, function(){
                console.log('파일 열고 데이터 쓰고 파일 닫기 완료.');
            });
    });
});

//각 메소드를 호출할 때마ㅏㄷ 콜백 함수를 파라미터로 전달하므로 각각의 기능이 실행을 끝냈을 때 그다음 메소드를 실행합니다. 


//fs open 의 callback 함수가 실행되었을 때 fs write 가 실행되고, fs write 의 callback 함수가 실행되었을 때 fs close 가 실행된다. 