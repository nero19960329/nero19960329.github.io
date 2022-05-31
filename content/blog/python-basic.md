---
title: "Python Basic"
date: 2022-05-22T03:06:41+08:00
draft: false
tags:
- Python
---

## Priority Queue / heapq

https://docs.python.org/zh-cn/3/library/heapq.html

可以用堆来实现。比如从一个已存在的列表构造堆，并取前 10 大的元素：

```python
# define `a` as a list
a = heapq.heapify(a)
a_top10 = heapq.nlargest(10, a)
```

## collections.defaultdict

可以使用 `defaultdict(default_factory)` 来构造一个带默认构造方式的字典。
