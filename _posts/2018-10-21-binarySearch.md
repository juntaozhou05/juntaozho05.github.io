---
layout: post
title: "二分查找"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - js
---

### 二分查找

其输入是一个有序的元素列表（必须是有序的），如果查找的元素包含在列表中，二分查找返回其位置，否则返回NULL

假设数据总量为 N, 因为二分查找每次会减少一半的数据, 所以经过 1 次后, 数据剩下为 N / 2, 经过 2 次后, 数据剩下为 N / 2^2, 二分查找的极限是最后剩下 1 个数据, 假设经过 m 次后, 达到极限, N / 2^m = 1, 即 2^m = N

所以时间复杂度为 logN；

```
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1
    while(left <= right) {
        const middlePoint = Math.floor((left + right)/2)
        let middle = arr[middlePoint];
        if(middle > target) {
        right = middlePoint - 1
        }else if(middle < target) {
        left = middlePoint + 1
        }else {
        return middle
        }
    }
    return "数组中目标元素不存在"
}
//test
console.log(binarySearch([1,2,3,4,5],3))
```