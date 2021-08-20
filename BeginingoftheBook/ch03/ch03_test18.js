//틀로 사용할 수 있는 함수를 prototype 객체라고 불른다. 

function Person(name, age){
    this.name = name; //this 는 함수를 호출하는 객체이다. 
    this.age = age;
}

Person.prototype.walk = function(speed){ //여기에서 prototype 을 써야한다. 이것을 사용하면 메모리를 효율적으로 관리할 수 있다. 
    console.log(speed + 'km 속도로 걸어갑니다.');
}

//틀을 사용해서 만들게 되면 위에 있는 함수까지 포함해서 가지고 있다.
var person01 = new Person('소녀시대', 20); //생성자
var person02 = new Person('걸스데이', 22);

console.log(person01.name + '객체의 walk(10)을 호출합니다.');
person01.walk(10);
