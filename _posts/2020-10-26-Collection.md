---
layout: post
title: "不同路径"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - js
---

1.有效的括号

给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。

有效字符串需满足：

左括号必须用相同类型的右括号闭合。
左括号必须以正确的顺序闭合。
注意空字符串可被认为是有效字符串。

示例 1:

输入: "()"
输出: true
示例 2:

输入: "()[]{}"
输出: true
示例 3:

输入: "(]"
输出: false

解答：
```
var isValid = function(s) {
    const mappings = new Map();
    mappings.set('(',')');
    mappings.set('[',']');
    mappings.set('{','}');

    const stack = []
    for(let i = 0; i < s.length; i++) {
        if(mappings.has(s[i])) {
            stack.push(mappings.get(s[i]))
        }else {
            if (stack.pop() !== s[i]) {
                return false;
            }
        }
    }

    if(stack.length !== 0) {
        return false;
    }
    return true
}
```

2.跳水板

你正在使用一堆木板建造跳水板。有两种类型的木板，其中长度较短的木板长度为shorter，长度较长的木板长度为longer。你必须正好使用k块木板。编写一个方法，生成跳水板所有可能的长度。

返回的长度需要从小到大排列。

思路：长短若相同，直接返回积，长板一次乘，短板补余量

解答：
```
var divingBoard = function(shorter, longer, k) {
    if(k === 0) return [];

    if(longer === shorter) {
        return [longer * k];
    }
    let ans = []
    for(let i = 0; i <= k; i++) {
        let rest = k - i;
        ans[i] = longer * i + shorter * rest;
    }
    return ans;
};
```

3.合并二维有序数组成一维有序数组，归并排序的思路

思路：双指针 从头到尾比较 两个数组的第一个值，根据值的大小依次插入到新的数组中

解答：
```
function　merge(arr1, arr2){
    var　result=[];
    while(arr1.length>0 && arr2.length>0){
        if(arr1[0]<arr2[0]){
              /*shift()方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。*/
            result.push(arr1.shift());
        }else{
            result.push(arr2.shift());
        }
    }
    return　result.concat(arr1).concat(arr2);
}

function mergeSort(arr){
    let lengthArr = arr.length;
    if(lengthArr === 0){
     return [];
    }
    while(arr.length > 1){
     let arrayItem1 = arr.shift();
     let arrayItem2 = arr.shift();
     let mergeArr = merge(arrayItem1, arrayItem2);
     arr.push(mergeArr);
    }
    return arr[0];
}
let arr1 = [[1,2,3],[4,5,6],[7,8,9],[1,2,3],[4,5,6]];
let arr2 = [[1,4,6],[7,8,10],[2,6,9],[3,7,13],[1,5,12]];
mergeSort(arr1);
mergeSort(arr2);
```

4.二分查找

给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target  ，写一个函数搜索 nums 中的 target，如果目标值存在返回下标，否则返回 -1。

示例 1:

输入: nums = [-1,0,3,5,9,12], target = 9
输出: 4
解释: 9 出现在 nums 中并且下标为 4
示例 2:

输入: nums = [-1,0,3,5,9,12], target = 2
输出: -1
解释: 2 不存在 nums 中因此返回 -1

思路：
二分查找是个很经典的算法了，它的一个典型的特点就是“思路容易，细节非常易错”。

这里就主要讲讲代码里的细节吧：

首先，为什么是 while (left <= right) 而不是 while (left < right)？
这是因为要考虑到 left 和 right 相等的情况，也就是查找区间里只有一个值。

为什么 left = mid + 1，这个 +1 是什么？
这是因为 mid 位置的值已经查找过了，可以往右边跳一位。

什么情况 left 会超出 right？如果二分查找到的值一直小于目标值，left会不断右移，直到最后数组区间里只有一个值，如果此时这个目标值还是大于这个值，left 会继续加一，此时 left 会超过 right。

反之，则 right 会超出 left。

解答：
```
function search(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while(left <= right) {
    let mid = Math.round((right + left) / 2);
    if(arr[mid] === target) {
      return mid;
    }
    if(arr[mid] < target) {
      return mid + 1;
    }
    if(arr[mid] > target) {
      return mid - 1;
    }
  }
}
```














