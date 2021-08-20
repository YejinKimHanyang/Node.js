console.dir(process.env);
console.log('OS 환경 변수의 값: ' + process.env[OS]);

//OS 변수가 시스템 환경 변수에 들어 있는데도 오류가 발생하는 것은 노드의 process.env 속성에 사용자 정의 환경 변수(user variables)만 들어있기 때문이다.

//process.env 객체에 들어 있는 속성만으로는 OS와 같은 시스템 환경 변수 system variables 에 접근할 수 없다. 
//여기에서의 사용자 정의 환경 변수는: 현재 사용 중인 윈도우 사용자 계정에만 적용되는 값을 말한다. 
//시스템 환경 변수: 모든 윈도우 사용자 계정에 적용되는 값이다. 
