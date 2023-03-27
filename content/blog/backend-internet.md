---
title: "How does the internet work? - Backend Developer Roadmap #1"
date: 2023-03-27T18:27:00+08:00
draft: false
tags:
- Backend Develop
- Internet
---

本文介绍了因特网的基本工作原理，其在后端工程师路线图中的位置如下：

```mermaid
graph LR
Internet
Lang[Learn a Language]
A[How does the internet work?]
B[What is HTTP?]
C[Browsers and how they work?]
D[DNS and how it works?]
E[What is Domain Name?]
F[What is hosting?]
# Internet, Lang are save level, yellow color
style Internet fill:#f9f,stroke:#333,stroke-width:4px
style Lang fill:#f9f,stroke:#333,stroke-width:4px
# A, B, C, D, E, F are Internet's children, orange color
style A fill:#ff9,stroke:#333,stroke-width:4px
style B fill:#ff9,stroke:#333,stroke-width:4px
style C fill:#ff9,stroke:#333,stroke-width:4px
style D fill:#ff9,stroke:#333,stroke-width:4px
style E fill:#ff9,stroke:#333,stroke-width:4px
style F fill:#ff9,stroke:#333,stroke-width:4px
# write the relationship
# Internet connects to Lang, with same level
# Internet's children are: A~F
Internet --> Lang
Internet --> A
Internet --> B
Internet --> C
Internet --> D
Internet --> E
Internet --> F
```

Roadmap 来源于 https://roadmap.sh/backend .

## 
