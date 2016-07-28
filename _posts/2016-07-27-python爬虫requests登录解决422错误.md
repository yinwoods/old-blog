---
layout: post
title: python爬虫requests登录解决422错误
categories: ['myshare']
tags: ['python', '爬虫']
published: True
img: 52

---

小伙伴[崔崔](http://blog.csdn.net/cumtcyf)今天要爬取[北航ACT实验室的车联网](http://ucar.act.buaa.edu.cn/users/sign_in)的信息，已有账号密码。模拟登录使用的是python的requests.session().post(),通过chrome的network观察post的表单数据，发现有一个`authenticity_token`，这个数据是每次刷网页动态生成的，存放在页面header的meta标签中，问题不大，直接用beautifulsoup获取就可以了。

问题出现在post之后，总是得到HTTP 422错误。通过查询了解到这里的422错误是指验证错误，可是token是即时获取的，其他信息也是完全按照表单要求填写，并且对提交数据进行了urlencode并使用`gbk`encode，实在是想不通原因。然后通过神奇的谷歌居然搜到了相同问题的博客。。。连代码都写得和我的惊人的相似。。。我都开始怀疑是不是和我爬的同一个网站了。。。

正确的爬取姿势是带着cookie验证，我猜这里的`authenticity_token`与cookie是相关联的，因为爬取时没带上cookie，所以无法验证成功。如果想要带上cookie只需使用`requests.Session()`来post即可。

[requests.Session()简介](http://docs.python-requests.org/zh_CN/latest/user/advanced.html#advanced)

简单介绍一下：

Session作为一个会话对象，会在同一个Session实例发出所有请求之间保存cookie。其实这里可以类比一下：当你登录淘宝后，短时间内访问淘宝的其他页面，不需要重新登录。

完整的代码如下：

```python
#author : yinwoods
import urllib
import requests
import urllib.request
from bs4 import BeautifulSoup

def main():

    url = 'http://ucar.act.buaa.edu.cn/users/sign_in'


    headers = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip,deflate',
        'Accept-Language': 'zh-CN,zh;q=0.8',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Host': 'ucar.act.buaa.edu.cn',
        'Origin': 'http://ucar.act.buaa.edu.cn',
        'Referer': 'http://ucar.act.buaa.edu.cn/stat',
        'User-Agent': 'Mozilla/5.0(X11;Linux x86_64) AppleWebKit/537.36(KHTML, like Gecko) Ubuntu Chromium/51.0.2704.79 Chrome/51.0.2704.79 Safari / 537.36'
    }

    #先获取页面源码，提取token
    session = requests.Session()
    html = session.get(url, headers=headers).text

    htmlDoc = BeautifulSoup(html, 'html.parser')
    token = htmlDoc.find_all('meta')[-1]['content']

    print(token)

    datas = urllib.parse.urlencode({
        'utf8': '✓',
        'authenticity_token': token,
        'user[username]': username,
        'user[password]': password,
        'user[remember_me]': '1',
        'commit': '登录'
    }).encode('gbk')

    requests.session().post()

    print(datas)

    print(session.post(url=url, params=datas, headers=headers))

    res = session.get('http://ucar.act.buaa.edu.cn/users/sign_in').text
    print(res)


if __name__ == '__main__':
    main()

```

打印页面后可以发现登录成功，状态码返回200。事后反思，意识到`token+cookie`可能这是一种比较通用的验证机制，自己不了解一方面是因为经验不足，另一方面可能就是之前爬的网站大都比较简单（是属于开放类门户网站），能够爬取成功并不代表自己的能力很高。

不过话又说回来自己想学的东西太多了。。。目前在看CSAPP，后面有时间再学习《HTTP权威指南》。