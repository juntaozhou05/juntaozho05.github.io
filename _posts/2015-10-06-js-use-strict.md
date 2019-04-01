---

layout: post
title: "js 严格模式和非严格模式的区别"
subtitle: 'Using Vim with non-english input method'
author: "Hux"
header-style: text
tags:

- Js

1.  严格模式下，不允许给未声明的变量赋值
2.  严格模式下，arguments 变为参数的静态副本。非严格模式下，arguments 对象里的元素和对应的参数是指向同一个值的引用。传的参数是对象除外。arguments 和形参共享传递。
    ```
    !function(a) {
    	'use strict';
    	console.log(a.x);  //1
    	arguments[0].x = 100;
    	console.log(a.x);  //100
    }({x: 1});
    ```
3.  严格模式下，删除参数名，函数名报错。非严格模式返回 false，静默失败。(静默失败：不报错也没有任何效果)

    ```
    !function(a) {
    	console.log(a);  //1
    	console.log(delete a);  //false
    	console.log(a);  //1
    }(1);

    !function(a) {
    	'use strict';
    	console.log(a);  //1
    	delete a;  //SyntaxError（语法错误）
    	console.log(a);  //1
    }(1)
    ```

4.  严格模式下，函数参数名重复报错。非严格模式最后一个重名参数会覆盖之前的重名参数。

    ```
    !function (a, a, b) {
        console.log(a + b);  //5
    }(1, 2, 3);

    !function (a, a, b) {
    	'use strict';
        console.log(a + b);  //SyntaxError
    }(1, 2, 3);
    ```

5.  严格模式下，删除不可配置(configurable=false)的属性报错。非严格模式返回 false，静默失败。
    `!function (a){ var obj={}; Object.defineProperty(obj,'a',{ configurable: false }); console.log(delete obj.a); //flase }(1); !function (a){ 'use strict'; var obj={}; Object.defineProperty(obj, 'a', { configurable: false }); console.log(delete obj.a); //TypeError }(1);` 6.严格模式下，修改不可写(writable=false)的属性报错。
    `!function () { var obj = { a: 1 }; Object.defineProperty(obj, 'a', { writable: false }); obj.a = 2; console.log(obj.a); //1 //证明没有被修改 }(); !function () { 'use strict'; var obj = { a: 1 }; Object.defineProperty(obj, 'a', {writable: false}); obj.a = 2; //TypeError }();`
6.  严格模式下，对象字面量重复属性名报错。
    `!function() { var obj = { x: 1, x: 2 }; console.log(obj.x); //2 }(); !function() { 'use strict'; var obj = { x: 1, x: 2 }; console.log(obj.x); //IE10+报错。IE7~9、Chrome、FF不报错，结果为：2 }();` 8.严格模式下，给只读属性赋值报错。

        ```
        !function () {
            'use strict';
            var obj = { get x() { return 17; } };
        	obj.x = 5;  //TypeError
        }();
        ```

    9.严格模式下，给不可扩展对象的新属性赋值报错

        ```
        !function () {
        	'use strict';
            var fixed = { oldProp: "hello" };
            Object.preventExtensions(fixed);
            fixed.newProp = "world"; //TypeError
        }();
        ```

    10.ES6 中，严格模式下，禁止设置五种基本类型值的属性。

```
!function () {
	'use strict';
    undefined.aaa = 'aaa';  //TypeError
    null.bbb = 'bbb';  //TypeError
    false.ccc = 'ccc';  //TypeError
    (123).ddd = 'ddd';  //TypeError
    "hello".eee = 'eee';  //TypeError
}();
```

11.严格模式下，一般函数调用(不是对象的方法调用，也不使用 apply/call/bind 等修改 this)，this 指向 undefined，而不是全局对象。  
12.严格模式下，使用 apply/call/bind，当传入参数是 null/undefined 时，this 指向 null/undefined，而不是全局对象。  
13.严格模式下，不再支持 arguments.callee  
 严格模式下，不再支持 arguments.caller

14.
