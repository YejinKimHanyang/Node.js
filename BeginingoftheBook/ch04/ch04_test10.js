//buffer 객체를 크기만 지정하여 만든 후 문자열을 씁니다
var output = '안녕1!';
var buffer1 = new Buffer(10);
var len = buffer1.write(output, 'utf8');
console.log('첫 번째 버퍼의 문자열:', buffer1.toString());

//buffer 객체를 문자열을 이용해 만듭니다
var buffer2 = new Buffer('안녕2!', 'utf8');
console.log('두 번째 버퍼의 문자열: ', buffer2.toString());

//타입을 확인한다
console.log('버퍼 객체의 타입: ', Buffer.isBuffer(buffer1));

//buffer 객체에 들어 있는 문자열 데이터를 문자열 변수로 만든다. 
var byteLen = Buffer.byteLength(output);
var str1 = buffer1.toString('utf8', 0, byteLen);
var str2 = buffer2.toString('utf8');

console.log('문자열 변수로 바꿨을 때: ', str1);
console.log('문자열 변수로 바꿨을 때: ', str2);

// ?? 문자열 데이터를 사용하는 이유, 문자열 변수를 사용하는 이유? 

//첫번째 buffer 객체의 문자열을 2번째 buffer 객체로 복사합니다
buffer1.copy(buffer2, 0, 0, len);
console.log('두 번째 버퍼에 복사한 후의 문자열: ', buffer2.toString('utf8'));


//2 개의 buffer를 붙여 줍니다
var buffer3 = Buffer.concat([buffer1, buffer2]);
console.log('두 개의 버퍼를 붙인 후의 문자열: ', buffer3.toString('utf8'));
