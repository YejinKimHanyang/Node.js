function add( a, b, callback){
    var result = a + b;
    callback(result);

    //function 안에 function 을 넣고 그것을 count 한다.
    var count = 0;
    var history = function(){
        count+=1;
        return count + ':' + a + '+' + b +'=' + result;
    };
    return history;
}

var add_history = add(20,20,function(result){
    console.log('더하기 (10,10)의 결과: %d', result);
});

console.log('결과 값으로 받은 함수 실행 결과: ' + add_history());
console.log('결과 값으로 받은 함수 실행 결과: ' + add_history());
console.log('결과 값으로 받은 함수 실행 결과: ' + add_history());