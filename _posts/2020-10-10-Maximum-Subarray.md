---
layout: post
title: "最大子序和"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - js
---


给定一个整数数组 nums ，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

示例:

输入: [-2,1,-3,4,-1,2,1,-5,4]
输出: 6
解释: 连续子数组 [4,-1,2,1] 的和最大，为 6。

解答：
```
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    const memo = []
    memo[0] = nums[0]

    for(let i=1;i < nums.length;i++) {
        memo[i] = Math.max(nums[i] + memo[i-1],nums[i])
    }

    let max = nums[0]

    for(let i=1;i < memo.length;i++) {
        max = Math.max(max,memo[i])
    }
    return max
};
```
