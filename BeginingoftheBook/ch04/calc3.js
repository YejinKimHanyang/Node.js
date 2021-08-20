var util = require('util');
var EventEmitter = require('events').EventEmitter;

//prototype 객체
var Calc = function(){
    var self = this;

    this.on('stop', function(){  //이 계산기 객체로 전달되는 stop 이벤트를 처리하기 위해 Calc 객체 안에는 on() 메소드를 호출하는 부분.
        console.log('Calc 에 stop event 전달됨.');
    });
};

util.inherits(Calc, EventEmitter);

//new 연산자를 이용해 Calc 객체의 instance 객체를 만들었을 때 add() 함수를 사용할 수 있다. 
Calc.prototype.add = function(a, b){
    return a + b;
}

//calc3.js  파일에 정의한 모듈을 불러들이는 쪽에서 Calc 객체를 참조할 수 있도록 export 해줌. 
module.exports = Calc;
module.exports.title = 'calculator';
