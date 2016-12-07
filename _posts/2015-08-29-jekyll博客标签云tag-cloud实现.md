---
layout: post
title: Jekyll博客标签云（tag_cloud）实现
categories: ['myshare']
tags: ['jekyll']
published: True
img: 23

---

大概半个月之前就想要为博客添加标签云`tag_cloud`的功能了，直到昨晚才抽出时间来搞，开始查了网上很多教程，但是苦于对`ruby`的不了解，基本都会在某一步卡住。最后在这个过程中自己摸索出了怎么实现标签云`tag_cloud`的功能。。。。

先用图展示下实现效果：
![标签云](http://7xlnl2.com1.z0.glb.clouddn.com/post23-tag_cloud1.png)
<hr/>
![](http://7xlnl2.com1.z0.glb.clouddn.com/post23-tag_cloud2.png)

实现过程主要分为以下几步：

> 1、在博客根目录`_includes`下新建`tag_cloud.html`，内容如下：

>>![](http://7xlnl2.com1.z0.glb.clouddn.com/post23-tag_cloud3.png)

>> 这里的`site.BASE_PATH`是在`config.yml`中定义的博客根目录；因为上面的代码直接写在博客里会自动执行，所以在这里用的是截图。

> 2、为自己的博客添加`tags[]`标记，例如本篇博文被我用`tags['jekyll']`标记为`jekyll`，如果需要多个标记，用逗号隔开即可。

> 3、在博客根目录下新建`tags`文件夹，并在该文件夹下新建所有对应`tag`名字的文件夹，例如这里新建`jekyll`文件夹。

> 4、在每个`tag`文件夹下，新建一个`index.html`，内容如下：

>> 
![](http://7xlnl2.com1.z0.glb.clouddn.com/post23-tag_cloud4.png)
把这里的两处`jekyll`出现位置换位对应的`tag`名称即可

> 5、接下来大家编写自己自定义的`CSS`即可。

> 6、目前标签页缺少分页功能，比如对所有在`jekyll`下的文章分页，问题还有待解决。

#####<center>综上就是实现标签云的过程，如果大家有疑问或建议，欢迎讨论^_^![](http://7xlnl2.com1.z0.glb.clouddn.com/post2-卖萌.jpg)</center>