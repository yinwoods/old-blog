---
layout: post
title: LeetCode 236 （数据结构+DFS）
categories: ['coding']
tags: ['algorithm']
published: True
img: 15

---

是二叉搜索树求LCA的加强版，这里是对普通的二叉树给定两点p, q求LCA

最初的想法是对于树中每个节点判断两个点p, q是否在它的同一侧，结果超时了

然后就想到在判断两点p, q是否在某个节点同一侧时存在大量的重复性工作

因此想到用深搜找到从根节点到p, q的路径，再找到路径从下到上的第一个公共点

这样就容易做了，但是被卡了很久，因为我理解的两个节点相等是两个节点值相等。。。

所以悲剧了一下午⊙﹏⊙b

> 1、这里是我最开始的想法，大量重复查找因此超时
>
{% highlight cpp %}
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    bool exist(TreeNode* root, TreeNode* tmp) {//判断tmp节点是否是root节点的子节点
        if(root == NULL) return false;
        if(root->val == tmp->val) {
            return true;
        }
        return exist(root->left, tmp)||exist(root->right, tmp);
    }
    int find(TreeNode* root, TreeNode* p, TreeNode* q) {//分别判断左右两侧
        if(exist(root->left, p) && exist(root->left, q)) return -1;
        if(exist(root->right, p) && exist(root->right, q)) return 1;
        return 0;
    }
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        if(find(root, p, q) == -1) return lowestCommonAncestor(root->left, p, q);
        if(find(root, p, q) == 1) return lowestCommonAncestor(root->right, p, q);
        return root;
    }
};
{% endhighlight %}

> 2、深搜找到路径从而求LCA
>
{% highlight cpp %}
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
    public:
        stack<TreeNode*> st;
        bool find(TreeNode* root, TreeNode *tmp, vector<TreeNode*>& ans) {
            st.push(root);
            if(root == tmp) {
                while(!st.empty()) {
                    ans.push_back(st.top());
                    st.pop();
                }
                return true;
            }
            if(root->left != NULL) {
                if(find(root->left, tmp, ans))
                    return true;
            }
            if(root->right != NULL) {
                if(find(root->right, tmp, ans))
                    return true;
            }
            st.pop();      
            return false;
        }
        TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
            vector<TreeNode*> x, y;
            while(!st.empty()) st.pop();
            find(root, p, x);
            while(!st.empty()) st.pop();
            find(root, q, y);
            for(int i=0; i<x.size(); ++i) {
                for(int j=0; j<y.size(); ++j) {
                    if(x[i] == y[j])
                        return x[i];
                }
            }
            return root;
        }
};
{% endhighlight %}

> 3、对于上面的代码，答案虽然是对的，但是写的不好，使用的栈明显多余；看下面这份网友 mako 的 [代码](https://leetcode.com/discuss/46563/c-solution-with-simple-dfs)：
>
{% highlight cpp %}
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
    public:
        bool dfs(TreeNode* root, TreeNode *tmp, vector<TreeNode*>& ans) {
            if(root == NULL) return false;
            ans.push_back(root);
            if(root == tmp) return true;
            if(dfs(root->left, tmp, ans))
                return true;
            if(dfs(root->right, tmp, ans))
                return true;
            ans.pop_back();
            return false;
        }
        TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
            vector<TreeNode*> x, y;
            dfs(root, p, x);
            dfs(root, q, y);
            int cnt = min(x.size(), y.size());
            TreeNode* ans;
            for(int i=0; i<cnt; ++i) {
                if(x[i] == y[i])
                    ans = x[i];
                else break;
            }
            return ans;
        }
};
{% endhighlight %}

虽然后面两份代码跑的样例都是28ms，但理论上来说第三份代码优化地更好，而且具有更好的易读性
