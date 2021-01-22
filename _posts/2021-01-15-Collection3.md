---
layout: post
title: "算法总结3-双指针"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - js
---

1.最接近的三数之和
给定一个包括  n 个整数的数组  nums  和 一个目标值  target。找出  nums  中的三个整数，使得它们的和与  target  最接近。返回这三个数的和。假定每组输入只存在唯一答案。

示例：

输入：nums = [-1,2,1,-4], target = 1
输出：2
解释：与 target 最接近的和是 2 (-1 + 2 + 1 = 2) 。

思路：
先按照升序排序，然后分别从左往右依次选择一个基础点 i（0 <= i <= nums.length - 3），在基础点的右侧用双指针去不断的找最小的差值。

假设基础点是 i，初始化的时候，双指针分别是：

left：i + 1，基础点右边一位。
right: nums.length - 1 数组最后一位。
然后求此时的和，如果和大于 target，那么可以把右指针左移一位，去试试更小一点的值，反之则把左指针右移。

在这个过程中，不断更新全局的最小差值 min，和此时记录下来的和 res。

最后返回 res 即可。

解答：
```
let threeSumClosest = function (nums, target) {
    let n = nums.length
    if (n === 3) {
        return getSum(nums)
    }
    // 先升序排序 此为解题的前置条件
    nums.sort((a, b) => a - b)

    let min = Infinity // 和 target 的最小差
    let res

    // 从左往右依次尝试定一个基础指针 右边至少再保留两位 否则无法凑成3个
    for (let i = 0; i <= nums.length - 3; i++) {
        let basic = nums[i]
        let left = i + 1; // 左指针先从 i 右侧的第一位开始尝试
        let right = n - 1 // 右指针先从数组最后一项开始尝试

        while (left < right) {
            let sum = basic + nums[left] + nums[right] // 三数求和
            // 更新最小差
            let diff = Math.abs(sum - target)
            if (diff < min) {
                min = diff
                res = sum
            }
            if (sum < target) {
                // 求出的和如果小于目标值的话 可以尝试把左指针右移 扩大值
                left++
            } else if (sum > target) {
                // 反之则右指针左移
                right--
            } else {
                // 相等的话 差就为0 一定是答案
                return sum
            }
        }
    }

    return res
};

function getSum(nums) {
    return nums.reduce((total, cur) => total + cur, 0)
}
```

2.判断子序列
给定字符串 s 和 t ，判断 s 是否为 t 的子序列。

你可以认为 s 和 t 中仅包含英文小写字母。字符串 t 可能会很长（长度 ~= 500,000），而 s 是个短字符串（长度 <=100）。

字符串的一个子序列是原始字符串删除一些（也可以不删除）字符而不改变剩余字符相对位置形成的新字符串。（例如，"ace"是"abcde"的一个子序列，而"aec"不是）。

示例 1:
s = "abc", t = "ahbgdc"

返回 true.

示例 2:
s = "axc", t = "ahbgdc"

返回 false.

思路：
判断字符串 s 是否是字符串 t 的子序列，我们可以建立一个 i 指针指向「当前 s 已经在 t 中成功匹配的字符下标后一位」。之后开始遍历 t 字符串，每当在 t 中发现 i 指针指向的目标字符时，就可以把 i 往后前进一位。

一旦i === t.length ，就代表 t 中的字符串全部按顺序在 s 中找到了，返回 true。
当遍历 s 结束后，就返回 false，因为 i 此时并没有成功走 t 的最后一位。

解答：
```
const isSubsequence = (s, t) => {
    let sl = s.length;
    if(!sl) return true;

    let i = 0;
    for(let j = 0; j < t.length; j++) {
        let target = s[i];
        let cur = t[j];
        if(target === cur) {
            i++;
            if(i === sl){
                return true;
            }
        }
    }
    return false;
}
```

3.分发饼干
假设你是一位很棒的家长，想要给你的孩子们一些小饼干。但是，每个孩子最多只能给一块饼干。对每个孩子 i ，都有一个胃口值 gi ，这是能让孩子们满足胃口的饼干的最小尺寸；并且每块饼干 j ，都有一个尺寸 sj 。如果 sj >= gi ，我们可以将这个饼干 j 分配给孩子 i ，这个孩子会得到满足。你的目标是尽可能满足越多数量的孩子，并输出这个最大数值。

注意：

你可以假设胃口值为正。
一个小朋友最多只能拥有一块饼干。

示例 1:

输入: [1,2,3], [1,1]

输出: 1

解释: 
你有三个孩子和两块小饼干，3个孩子的胃口值分别是：1,2,3。
虽然你有两块小饼干，由于他们的尺寸都是1，你只能让胃口值是1的孩子满足。
所以你应该输出1。
示例 2:

输入: [1,2], [1,2,3]

输出: 2

解释: 
你有两个孩子和三块小饼干，2个孩子的胃口值分别是1,2。
你拥有的饼干数量和尺寸都足以让所有孩子满足。
所以你应该输出2.

思路：
把饼干和孩子的需求都排序好，然后从最小的饼干分配给需求最小的孩子开始，不断的尝试新的饼干和新的孩子，这样能保证每个分给孩子的饼干都恰到好处的不浪费，又满足需求。

利用双指针不断的更新 i 孩子的需求下标和 j饼干的值，直到两者有其一达到了终点位置：

如果当前的饼干不满足孩子的胃口，那么把 j++ 寻找下一个饼干，不用担心这个饼干被浪费，因为这个饼干更不可能满足下一个孩子（胃口更大）。
如果满足，那么 i++; j++; count++ 记录当前的成功数量，继续寻找下一个孩子和下一个饼干。

解答：
```
const findContentChildren = (g, s) => {
  g.sort((a, b) => a - b);
  s.sort((a, b) => a - b);

  let i = 0;
  let j = 0;

  let count = 0;
  while(j < s.length && i < g.length) {
    let need = g[i];
    let cookie = s[j];
    if(cookie >= need) {
      i++;
      j++;
      count++;
    }else {
      j++;
    }
  }
  return count;
}
```

4.验证回文串

给定一个字符串，验证它是否是回文串，只考虑字母和数字字符，可以忽略字母的大小写。

说明：本题中，我们将空字符串定义为有效的回文串。

示例 1:

输入: "A man, a plan, a canal: Panama"
输出: true
示例 2:

输入: "race a car"
输出: false

思路：
先根据题目给出的条件，通过正则把不匹配字符去掉，然后转小写。

建立双指针 i, j 分别指向头和尾，然后两个指针不断的向中间靠近，每前进一步就对比两端的字符串是否相等，如果不相等则直接返回 false。

如果直到 i >= j 也就是指针对撞了，都没有返回 false，那就说明符合「回文」的定义，返回 true。

解答：
```
let isPalindrome = function(s) {
  s = s.replace(/[^0-9a-zA-Z]/g, '').toLowerCase();
  let i = 0;
  let j = s.length - 1;
   while(i < j) {
     let head = s[i];
     let tail = s[j];

     if(head !== tail) {
       return false;
     }else {
       i++;
       j--;
     }
   }
   return true
}
```

5.合并两个有序数组

给你两个有序整数数组 nums1 和 nums2，请你将 nums2 合并到 nums1 中，使 nums1 成为一个有序数组。

说明:

初始化 nums1 和 nums2 的元素数量分别为 m 和 n 。
你可以假设 nums1 有足够的空间（空间大小大于或等于 m + n）来保存 nums2 中的元素。

示例:

输入:

nums1 = [1,2,3,0,0,0], m = 3
nums2 = [2,5,6],       n = 3

输出: [1,2,2,3,5,6]

思路：
从后往前的双指针思路，先定义指针 i 和 j 分别指向数组中有值的位置的末尾，再定义指针 k 指向待填充的数组 1 的末尾。

然后不断的迭代 i 和 j 指针，如果 i 位置的值比 j 大，就移动 i 位置的值到 k 位置，反之亦然。

如果 i 指针循环完了，j 指针的数组里还有值未处理的话，直接从 k 位置开始向前填充 j 指针数组即可。因为此时数组 1 原本的值一定全部被填充到了数组 1 的后面位置，且这些值一定全部大于此时 j 指针数组里的值。

解答：
```
let merge = function (arr1, m, arr2, n) {
  // 两个指针指向数组非空位置的末尾
  let i = m - 1;
  let j = n - 1;
  // 第三个指针指向第一个数组的末尾 填充数据
  let k = arr1.length - 1;

  while (i >= 0 && j >= 0) {
    let num1 = arr1[i];
    let num2 = arr2[j];

    if (num1 > num2) {
      arr1[k] = num1;
      i--;
    } else {
      arr1[k] = num2;
      j--;
    }
    k--;
  }

  while (j >= 0) {
    arr1[k] = arr2[j];
    j--;
    k--;
  }
  return arr1;
};
```

6.移动零
给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
示例:

输入: [0,1,0,3,12]
输出: [1,3,12,0,0]
说明:

必须在原数组上操作，不能拷贝额外的数组。尽量减少操作次数。

思路：
暴力法
先遍历一次，找出所有 0 的下标，然后删除掉所有 0 元素，再 push 相应的 0 的个数到末尾。

解答：
```
var moveZeroes = function (nums) {
  let zeros = [];
  for(let i = 0; i < nums.length; i++) {
    if(nums[i] === 0) {
      zeros.push(i);
    }
  }
  for(let i = zeros.length - 1; i >= 0; i--) {
    nums.splice(zeros[i], 1);
  }
  for(let i = 0; i < zeros.length; i++) {
    nums.push(0);
  }
  return nums;
}
```
双指针
慢指针 j 从 0 开始，当快指针 i 遍历到非 0 元素的时候，i 和 j 位置的元素交换,然
后把 j + 1。

也就是说，快指针 i 遍历完毕后, [0, j) 区间就存放着所有非 0 元素，而剩余的[j,
n]区间再遍历一次，用 0 填充满即可。

解答：
```
var moveZeroes = function (nums) {
  let j = 0;

  for(let i = 0; i < nums.length; i++) {
    if(nums[i] !== 0) {
      nums[j] = nums[i];
      j++;
    }
  }
  while(j < nums.length) {
    nums[j] = 0;
    j++;
  }
  return nums;
}
```




















