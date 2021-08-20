var fs = require('fs');

//파일을 비동기식 IO 로 읽어 들입니다
fs.readFile('./package.json', 'utf8', function(err, data){
    //읽어 들인 데이터를 출력합니다
    console.log(data);
});

console.log('프로젝트 폴더 안의 package.json 파일을 읽도록 요청했습니다.');

//readFile 매소드를 먼저 호출하지만 그다음에 작성한 코드가 먼저 실행되는 것을 볼 수 있다. 