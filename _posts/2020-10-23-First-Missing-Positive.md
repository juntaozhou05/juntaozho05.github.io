---
layout: post
title: "缺失的第一个正数"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - js
---

给你一个未排序的整数数组，请你找出其中没有出现的最小的正整数。


示例 1:

输入: [1,2,0]
输出: 3
示例 2:

输入: [3,4,-1,1]
输出: 2
示例 3:

输入: [7,8,9,11,12]
输出: 1

解答：
```
/**
 * @param {number[]} nums
 * @return {number}
 */
var firstMissingPositive = function(nums) {
    if(nums.length === 0) {
        return 1
    }
    let len = nums.length;
        for(let i = 0; i < len; i++) {
            /**
             * while循环保证i位置上的数满足nums[i] == i+1或者nums[i] == 0
             * nums[i] == 0，即i+1缺失
             * */
            while(nums[i] != i+1 && nums[i] > 0 && nums[i] <= len) {
                if(nums[nums[i]-1] === nums[i]) {
                    nums[i] = 0;
                    break;
                }
                let temp = nums[nums[i] - 1];
                nums[nums[i]-1] = nums[i];
                nums[i] = temp;
            }
        }
 
        for(let index = 0; index <= len; index++) {
            if(nums[index] !== index+1) {
                return index+1;
            }
        }
        
};
```
