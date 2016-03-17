---
layout: post
title: "Ilya and Escalator"
subline: 概率DP
categories: coding
tags: ['algorithm']
img: 3
---

题意是电梯前有n个人，每个人进电梯的概率位p，问在p秒时电梯内人数的期望

题目有一个地方要注意的是电梯外的人是在排队的，当最前面的人这个时刻不进电梯时后面的人等在排队等着。

可以定义DP状态：dp[i][j] //表示前i秒进j个人的概率

初始状态很容易定义：dp[i][0] = dp[i-1][0]*(1-p);

可以知道dp[i][j] = dp[i-1][j-1]*p + dp[i-1][j]*(1-p)

而这个状态对于j==n并不适应，当j==n时，已经没有人在排队，状态转移方程变为：

dp[i][n] = dp[i-1][j-1]*p + dp[i-1][n];

代码如下：

{% highlight cpp %}

#include <cstdio>
#include <cstring>
#include <iostream>
#define MAXN 2100
using namespace std;

double dp[MAXN][MAXN];

int main(void) {
    int t, n;
    double p;
    double ans;
    cin >> n >> p >> t;
    dp[0][0] = 1;
    for(int i=1; i<=t; ++i) {
        dp[i][0] = (1-p)*dp[i-1][0];
        for(int j=1; j<n; ++j) {
            dp[i][j] = dp[i-1][j-1]*p + dp[i-1][j]*(1-p);
        }
        dp[i][n] = p*dp[i-1][n-1]+dp[i-1][n];
    }
    ans = 0.0;
    for(int i=1; i<=n; ++i) {
        ans += dp[t][i]*i;
    }
    printf("%.6lf\n", ans);

    return 0;
}

{% endhighlight %}
