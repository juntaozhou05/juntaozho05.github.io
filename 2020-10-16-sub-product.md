---
layout: post
title: "乘积最大子数组"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - js
---

给你一个整数数组 nums ，请你找出数组中乘积最大的连续子数组（该子数组中至少包含一个数字），并返回该子数组所对应的乘积。

示例 1:

输入: [2,3,-2,4]
输出: 6
解释: 子数组 [2,3] 有最大乘积 6。
示例 2:

输入: [-2,0,-1]
输出: 0
解释: 结果不能为 2, 因为 [-2,-1] 不是子数组。

解答：
```
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = function(nums) {
    if(nums.length == 1) {
        return nums[0]
    }
    let maxProduct = []
    let minProduct = []
    maxProduct[0] = nums[0]
    minProduct[0] = nums[0]

    let max = nums[0]

    for(let i=1;i<nums.length;i++) {
        maxProduct[i] = Math.max(nums[i],nums[i]*maxProduct[i-1],nums[i]*minProduct[i-1])
        minProduct[i] = Math.min(nums[i],nums[i]*maxProduct[i-1],nums[i]*minProduct[i-1])
        max = Math.max(maxProduct[i],max)
    }
    return max
};
```



