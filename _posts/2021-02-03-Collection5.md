---
layout: post
title: "算法总结4-滑动窗口"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - js
---

1.最大子数组之和为k
给一个数组nums和目标值k，找到数组中最长的子数组，使其中的元素和为k。如果没有，则返回0。

样例
样例1

输入: nums = [1, -1, 5, -2, 3], k = 3
输出: 4
解释:
子数组[1, -1, 5, -2]的和为3，且长度最大
样例2

输入: nums = [-2, -1, 2, 1], k = 1
输出: 2
解释:
子数组[-1, 2]的和为1，且长度最大

解答：
```
const maxSubArrayLen = (nums, k) => {
  let ret = 0;
  let sum = [0];
  // 算出每个元素与之前元素和
  for(let i = 1; i <= nums.length; i++) {
    sum[i] = sum[i - 1] + nums[i - 1];
  }
  console.log('sum', sum);
  for(let i = 0; i < nums.length; i++) {
    for(let j = 0; j < i; j++) {
      if(sum[i] - sum[j] === k) {
        ret = Math.max(ret, i - j);
      }
    }
  }
  return ret;
}
```

2.最多有k个不同字符的最长子字符串
描述
给定字符串str，计算包括k个不同字符的最长子串的长度。
如给定字符串“eceba”和k=3，则包括3个不同字符的最长子串为“eceb”，其长度为4。

解答：
```

```



























