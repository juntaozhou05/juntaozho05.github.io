---
layout: post
title: "矩阵置零"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - js
---

给定一个 m x n 的矩阵，如果一个元素为 0，则将其所在行和列的所有元素都设为 0。请使用原地算法。

示例 1:

输入: 
[
  [1,1,1],
  [1,0,1],
  [1,1,1]
]
输出: 
[
  [1,0,1],
  [0,0,0],
  [1,0,1]
]
示例 2:

输入: 
[
  [0,1,2,0],
  [3,4,5,2],
  [1,3,1,5]
]
输出: 
[
  [0,0,0,0],
  [0,4,5,0],
  [0,3,1,0]
]

解答：
```
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var setZeroes = function(matrix) {
    let hasColZore = false
    let hasRowZore = false
    for(let i =0;i < matrix.length;i++) {
        if(matrix[i][0] === 0) {
            hasColZore = true
        }
    }
    for(let i =0;i < matrix[0].length;i++) {
        if(matrix[0][i] === 0) {
            hasRowZore = true
        }
    }
    for(let row = 1;row < matrix.length;row++) {
        for(let col = 1;col < matrix[0].length;col++) {
            if(matrix[row][col] === 0) {
                matrix[row][0] = 0
                matrix[0][col] = 0
            }
        }
    }
    for(let row = 1;row < matrix.length;row++) {
        for(let col = 1;col < matrix[0].length;col++) {
            if(matrix[row][0] === 0 || matrix[0][col] === 0) {
                matrix[row][col] = 0
            }
        }
    }
    if(hasRowZore === true) {
        for(let i =0;i < matrix[0].length;i++) {
            matrix[0][i] = 0
        }
    }
    if(hasColZore === true) {
        for(let i =0;i < matrix.length;i++) {
            matrix[i][0] = 0
        }
    }
    return matrix
};
```


