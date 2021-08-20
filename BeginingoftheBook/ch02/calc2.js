var calc = {};
calc.add = function(a,b){
    return a+ b;
};

module.exports = calc;


//이렇게 만들면 calc 객체는 모듈을 불러들이는 쪽에서 그대로 사용할 수 있다. 


