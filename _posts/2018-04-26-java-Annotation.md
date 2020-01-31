---
layout: post
title: "java注解"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - java
---

### 一：注解定义：

一种代码级别的说明，是 jdk1.5 以后的特性，与类，枚举，接口是同一个层次。可以声明在包，类，字段，方法，局部变量，方法参数等的前面，用来对这些元素进行说明，注释。

### 二：JDK 的一些注解：

1. @Override：检测是否继承自父类
2. @Deprecated：表示已过时
3. @SuppressWarnings：可以传递参数，压制报警

### 三：自定义注解：

1. 格式：元注解
   public @interface 注解名称（）
2. 本质：本质就是一个接口，接口继承了一个接口
   public interface MyAnno extends java.lang.annotation.Annotation{}
3. 属性：接口中的抽象方法
   - 返回值类型：基本数据类型，String, 枚举，注解。
   - 如果定义属性时给的 default，则使用时不必赋值，只有一个 value 可以直接省略。
