var fs = require('fs');

//파일에 데이터를 씁니다
fs.writeFile('./output.txt', 'Hello World!', function(err){ //작업이 끝나면 호출될 콜백 함수이다. 작업 중 오류가 발생하면 콜백 함수로 오류 객체가 전달된다. 오류 객체가 NULL 값으로 전달되면 데이터 쓰기가 완료된 것이다. 
    if(err){
        console.log('Error: ' + err);
    }
    console.log('output.txt 파일에 데이터 쓰기 완료.');
});
