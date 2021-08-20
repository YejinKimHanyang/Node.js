console.log('argv 속성의 파라미터 수: ' + process.argv.length);
console.dir(process.argv);

//javascript file 을 실행하기 위해 사용한 node.exe 파일의 이름이 첫 번째 파라미터가 되고
//javascript file의 패스가 두 번째 파라미터가 된다. 


if (process.argv.length>2){
    console.log('세 번째 파라미터의 값: %s', process.argv[2]);
}

process.argv.forEach(function(item, index){
    console.log(index + ' : ', item);
});