---
layout: post
title: LeetCode 234（单链表+快慢指针）
categories: ['coding']
tags: ['algorithm']
published: True
img: 16

---

题目的意思很简单，给定一个单链表，判断是否回文

我最开始的做法就是每次找到中间的两个位置进行匹配（考虑奇偶）

匹配后删除这两个元素，再从头指针开始找中间位置，重复这个操作直到链表为空

`ps:需要对空表以及只含一个元素的链表进行特殊处理`

这样的思路虽然是正确的，但是太慢了，代码如下：

{% highlight CPP %}
/**

 * Definition for singly-linked list.

 * struct ListNode {

 *     int val;

 *     ListNode *next;

 *     ListNode(int x) : val(x), next(NULL) {}

 * };

 */
class Solution {
    public:
        bool judge(ListNode* head, int cnt) {
            ListNode* tmp = head;
            int t = 0;
            while(tmp) {
                ++t; 
                if(t == cnt>>1) {
                    if(tmp->val != tmp->next->val)
                        return false;
                    else {
                        if(cnt == 2) return true;
                        tmp->val = tmp->next->next->val;
                        tmp->next = tmp->next->next->next;
                        return judge(head, cnt-2);
                    }
                }
                tmp = tmp->next;
            }
        }
        bool isPalindrome(ListNode* head) {
            ListNode* tmp = head;
            int cnt = 0;
            while(tmp) {
                ++cnt;
                tmp = (tmp->next);
            }
            if(cnt == 1 || cnt == 0) return true;
            if(cnt & 1) {
                int t = 0;
                tmp = head;
                while(tmp) {
                    ++t;
                    if(t == (cnt+1)>>1)
                        break;
                    tmp = (tmp->next);
                }
                tmp->val = tmp->next->val;
                tmp->next = tmp->next->next;
                return judge(head, cnt-1);
            } else return judge(head, cnt);
        }
};
{% endhighlight %}

题目中提示存在时间O（n）、空间O（1）的算法

后来苦苦想了几个小时也没想出来，在网上查找相关资料发现有种神奇的`快慢指针`方法

就是先利用`快慢指针`找到链表中间位置，将后半段倒序处理后与前半段一次比较即可（可以借助栈来实现，此时空间复杂度为O（n））

`快慢指针`的应用还有很多，这里限于篇幅就不一一赘述了

改进后代码如下：

{% highlight CPP %}
/**

 * Definition for singly-linked list.

 * struct ListNode {

 *     int val;

 *     ListNode *next;

 *     ListNode(int x) : val(x), next(NULL) {}

 * };

 */
class Solution {
    public:
        void reverse(ListNode* head) {
            if(head==NULL || head->next==NULL) 
                return ;
            ListNode* preNode = NULL;
            ListNode* thisNode = head;
            ListNode* nextNode = head->next;

            while(thisNode) {
                thisNode->next = preNode;
                preNode = thisNode;
                thisNode = nextNode;
                if(nextNode)
                    nextNode = nextNode->next ? nextNode->next : NULL;
            }
        }
        bool isPalindrome(ListNode* head) {
            if(head==NULL || head->next==NULL)
                return true;
            ListNode* fast = head;
            ListNode* slow = head;

            while(fast->next != NULL) {
                fast = fast->next;
                if(fast->next != NULL) {
                    fast = fast->next;
                    slow = slow->next;
                }
            }

            ListNode* mid = slow->next;
            reverse(mid);
            ListNode* p1 = head;
            ListNode* p2 = fast;
            while(p1 && p2) {
                if(p1->val != p2->val) {
                    reverse(fast);
                    slow->next = mid;
                    return false;
                }
                p1 = p1->next;
                p2 = p2->next;
            }
            reverse(fast);
            slow->next = mid;
            return true;
        }
};
{% endhighlight %}

这份代码值得一说的就是在判断完成后又将链表逆置了一遍，从而保证不改变原链表结构
