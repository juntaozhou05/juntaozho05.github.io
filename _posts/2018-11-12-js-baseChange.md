---
layout: post
title: "js隐式转换"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - js
---

### 一：js 基本数据类型

js 的数据类型分为六种，分别为 null,undefined,boolean,string,number,object。object 是引用类型，其它的五种是基本类型或者是原始类型。我们可以用 typeof 方法打印来某个是属于哪个类型的。不同类型的变量比较要先转类型，叫做类型转换，类型转换也叫隐式转换。隐式转换通常发生在运算符加减乘除，等于，还有小于，大于等。。

### 基本类型的转换

下面先讲加减乘除：

1. 字符串加数字,数字就会转成字符串。
2. 数字减字符串，字符串转成数字。如果字符串不是纯数字就会转成 NaN。字符串减数字也一样。两个字符串相减也先转成数字。
3. 乘，除，大于，小于跟减的转换也是一样。

```
//隐式转换 + - * == /
// +
10 + '20'    //2010
// -
10 - '20'    //-10
10 - 'one'   //NaN
10 - '100a'  //NaN
// *
10*'20'      //200
'10'*'20'    //200
// /
20/'10'      //2
'20'/'10'    //2
'20'/'one'　 //NaN
```

再来看看一组 == 的

1. undefined 等于 null
2. 字符串和数字比较时，字符串转数字
3. 数字为布尔比较时，布尔转数字
4. 字符串和布尔比较时，两者转数字

```
// ==
undefined == null;    //true
'0' == 0;        　　  //true,字符串转数字
0 == false;           //true,布尔转数字
'0' == false;    　　　//true,两者转数字
null == false;     　 //false
undefined == false; 　//false
```

### 引用类型的转换

基本类型间的比较相对简单。引用类型和基本类型的比较就相对复杂一些，先要把引用类型转成基本类型，再按上述的方法比较。引用类型转布尔全是 true。比如空数组，只要是对象就是引用类型，所以[]为 true。引用类型转数字或者字符串就要用 valueOf()或者 toString();对象本身就继承了 valuOf()和 toString(),还可以自定义 valueOf()和 toString()。根据不同的对象用继承的 valueOf()转成字符串,数字或本身，而对象用 toString 就一定转为字符串。一般对象默认调用 valueOf()。

1. 对象转数字时，调用 valueOf();
2. 对象转字符串时，调用 toString();

先看看下面的例子：

```
0 == [];        // true, 0 == [].valueOf(); -> 0 == 0;
'0' == [];      // false, '0' == [].toString(); -> '0' == '';
2 == ['2'];     // true, 2 == ['2'].valueOf(); -> 2 == '2' -> 2 == 2;
'2' == [2];     // true, '2' == [2].toString(); -> '2' =='2';

[] == ![];      //true, [].valueOf() == !Boolean([]) -> 0 == false -> 0 == 0;
```

对象转成数字时，调用 valueOf()，在这之前先调用的是 toString();所以我猜 valueOf 方法是这样的。So 上面的例子 `0 == []要改成下面更合理。无论如何，[]`最后是转成 0 的。

自定义的 valueOf()和 toString();

1. 自定义的 valueOf()和 toString()都存在，会默认调用 valueOf();
2. 如果只有 toString(),则调用 toString();

```
var a = [1];

a.valueOf = function (){ return 1;}
a.toString = function (){ return '1';}

a + 1;         // 2, valueOf()先调用
```

去掉 valueOf()就会调用 toString()。

```
var a = [1];

a.valueOf = function (){ return 1;}
a.toString = function (){ return '1';}

a + 1;         // 2, 先调用valueOf()
//去掉valueOf
delete a.valueOf;
a + 1;        // '11', 调用toString()
```

如果返回其它会怎么样呢？

```
var a = [1];

a.valueOf = function (){return ;}
a.toString = function (){return 1 ;};

1 - a;        //NaN
```

其它对象 调用 valueOf()转成不同的类型：

```
var a = {};
a.valueOf();    //Object {}
var a = [];
a.valueOf();    //[]    自己本身
var a = new Date();
a.valueOf();    //1423812036234  数字
var a = new RegExp();
a.valueOf();    //    /(?:)/  正则对象
```

引用类型之间的比较是内存地址的比较，不需要进行隐式转换，这里不多说。

```
[] == []  //false 地址不一样

var a = [];
b = a;
b == a   //true
```

### 显式转换

显式转换比较简单，可以直接用类当作方法直接转换。

```
Number([]);        //0
String([]);        //''
Boolean([]);       //true
```

还有更简单的转换方法。

```
3 + ''    // 字符串'3'
+'3'      // 数字3
!!'3'     // true
```
