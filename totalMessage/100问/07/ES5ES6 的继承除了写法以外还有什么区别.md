先看 ES5 的继承（原型链继承）

```
function a() {
  this.name = 'a';
}

a.prototype.getName = function getName() {
  return this.name
}

function b() {}
b.prototype = new a();

console.log(b.prototype.__proto__ === a.prototype); // true
console.log(b.__proto__ === a); // false
console.log(b.__proto__); // [Function]
```

ES6 继承

```
class A {
  constructor(a) {
    this.name = a;
  }
  getName() {
    return this.name;
  }
}

class B extends A{
  constructor() {
    super();
  }
}

console.log(B.prototype.__proto__ === A.prototype); // true
console.log(B.__proto__ === A); // true
console.log(B.__proto__); // [Function: A]
```

对比代码可以知道，子类的继承都是成功的，但是问题出在，子类的 **proto** 指向不一样。

ES5 的子类和父类一样，都是先创建好，再实现继承的，所以它们的指向都是 [Function] 。

ES6 则得到不一样的结果，它指向父类，那么我们应该能推算出来，它的子类是通过 super 来改造的。

根据 es6--阮一峰 在 class 继承里面的说法，是这样子的：

> 引用阮一峰的 ECMAScript6 入门 的 class 继承篇：
> 子类必须在 constructor 方法中调用 super 方法，否则新建实例时会报错。这是因为子类自己的 this 对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用 super 方法，子类就得不到 this 对象。
> ES5 的继承，实质是先创造子类的实例对象 this，然后再将父类的方法添加到 this 上面（Parent.apply(this)）。ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到 this 上面（所以必须先调用 super 方法），然后再用子类的构造函数修改 this。
