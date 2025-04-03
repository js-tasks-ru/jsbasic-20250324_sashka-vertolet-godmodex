let calculator = {
  a: 0,
  b: 0,

read(a, b) {
  this.a = a;
  this.b = b;
},

sum() {
  return this.a + this.b;
},

mul() {
  return this.a * this.b;
}

};

calculator.read(3, 5);
console.log(calculator.sum());
console.log(calculator.mul());


// НЕ УДАЛЯТЬ СТРОКУ, НУЖНА ДЛЯ ПРОВЕРКИ
window.calculator = calculator; 
