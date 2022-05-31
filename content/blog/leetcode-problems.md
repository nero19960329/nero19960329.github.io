---
title: "LeetCode Problems"
date: 2022-05-24T21:51:57+08:00
draft: false
tag:
- LeetCode
---

## Greedy Algorithm

### 435. Non-overlapping intervals

https://leetcode.com/problems/non-overlapping-intervals/

题解：

把所有区间按照其终点从小到大排序。然后开始遍历每个区间，每当遇到一个起点不小于当前最大终点的区间时，就认为该区间是一个无重叠的区间；否则，应该删除之。

### 300. Longest Increasing Subsequence

http://leetcode.com/problems/longest-increasing-subsequence/

题解：

维护一个贪心列表，存储当前最长递增子序列。遍历原序列，如果列表为空或者当前元素大于贪心列表中最后一个元素，则直接添加到贪心列表尾部；否则，查找贪心列表中第一个大于当前元素的元素，并覆盖之。

```python
class Solution(object):
    def lengthOfLIS(self, nums: List[int]) -> int:
        """
        :type nums: List[int]
        :rtype: int
        """
        dp = []
        for elem in nums:
            if not dp or elem > dp[-1]:
                dp.append(elem)
            else:
                dp[bisect.bisect_left(dp, elem)] = elem
        return len(dp)
```
