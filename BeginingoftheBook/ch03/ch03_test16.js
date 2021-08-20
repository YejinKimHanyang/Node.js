function add( a, b, callback){
    var result = a + b;
    callback(result);

    //내부 함수를 만들고 그 값을 return 해준다.
    var history = function(){
        return a + '+' + b +'=' + result;
    };
    return history;
}

var add_history = add(10,10,function(result){
    console.log('파라미터로 전달된 콜백 함수 호출됨.');
    console.log('더하기 (10,10)의 결과: %d', result);
});

console.log('add_h9istory 의 자료형: ' + typeof(add_history));
console.log('결과 값으로 받은 함수 실행 결과: ' + add_history());