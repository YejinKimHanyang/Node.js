process.on('tick', function(count){
    console.log('tick 이벤트 발생함: %s', count);
});

setTimeout(function(){
    console.log('2초 후에 tick 이벤트 전달 시도함.');

    process.exit('tick', '2');
}, 2000);


/*
tick 이벤트를 만들고 2초 후에 setTimeout() 메소드를 사용해 process.emit() 메소드를 호출하면서 tick 이벤트를 process 객체로 전달했다.
process.on() 메소드를 호출하면서 tick 이벤트를 process 객체로 전달했다. process.on() 메소드를 호출하여 이벤트를 등록하면 이 메소드를 호출하면서 
파라미터로 전달한 tick 이벤트가 발생했을 때 그 다음에 나오는 콜백 함수가 실행된다. 
*/
