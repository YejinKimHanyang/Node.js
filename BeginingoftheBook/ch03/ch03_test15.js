function add (a, b, callback){
    var result = a+ b;
    callback(result); //더하기 연산을 한 결과 값은 파라미터로 전달된 콜백 함수로 호출하면서 그 콜백 함수로 전달한다. 
    //즉, 함수 쪽으로 결과값을 전달하겠다는 뜻
    
}

add(10, 10, function(result){
    console.log('파라미터로 전달된 콜백 함수 호출됨');
    console.log('더하기 (10,10)의 결과 : %d', result);
});
 