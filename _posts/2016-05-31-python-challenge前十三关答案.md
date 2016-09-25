---
layout: post
title: python challenge前十三关答案
categories: ['coding']
tags: ['python']
published: True
img: 47

---

偶然间发现了一个很有趣的python练习网站[Python Challenge](http://www.pythonchallenge.com/)，具体每一关的玩法是根据提供的线索编程得到进入下一关的URL。游戏一共有33关，我玩了一下午，到第十三关发现逻辑性、趣味性已经弱了很多，也就不打算继续玩下去了，所以这里之给出前十三关答案。（PS：就个人来说，前面的一些关卡逻辑性比较强，自己多推理都可以解决，但后面真的是靠脑洞了，可能确实需要查看一些网上的提示才能过关。）

### 第0关

线索：`网页中间显示一张图片，图片上是一个显示器，显示2的38次方；图片下方是提示：尝试修改URL地址。`

因此想到，把url最后的0换为2的38次方。

具体代码如下：

{% highlight python %}

import requests

id = 2**38
url = 'http://www.pythonchallenge.com/pc/def/' + str(id) + '.html'
print(url)

req = requests.get(url)
print(req.text)

{% endhighlight %}

成功进入下一关[http://www.pythonchallenge.com/pc/def/274877906944.html](http://www.pythonchallenge.com/pc/def/274877906944.html)！

### 第1关

线索：`图片是一个笔记本，给出K->M O->Q E->G；发现对应的字母ascii码相差2，图片下方给出一段紫色的完全不知道含义的英文。`

可以想到，对下面的这段英文解密，解密的关键就是每个字母的ascii循环加2。

具体实现代码如下：

{% highlight python %}
str = "g fmnc wms bgblr rpylqjyrc gr zw fylb. rfyrq ufyr amknsrcpq ypc dmp. " \
      "bmgle gr gl zw fylb gq glcddgagclr ylb rfyr'q ufw rfgq rcvr gq qm jmle. " \
      "sqgle qrpgle.kyicrpylq() gq pcamkkclbcb. lmu ynnjw ml rfc spj."

for char in str:
    if ord(char) <= 122 and ord(char) >= 97:
        asc = ord(char) + 2
        if asc > 122:
            asc -= 26
        print(chr(asc), end='')
    else:
        print(char, end='')
print()

{% endhighlight %}

运行后得到输出：`i hope you didnt translate it by hand. thats what computers are for. doing it in by hand is inefficient and that's why this text is so long. using string.maketrans() is recommended. now apply on the url.`

查了下str.maketrans()发现用这个替换更方便，因此直接用如下方法实现：

{% highlight python %}

str = "g fmnc wms bgblr rpylqjyrc gr zw fylb. rfyrq ufyr amknsrcpq ypc dmp. " \
      "bmgle gr gl zw fylb gq glcddgagclr ylb rfyr'q ufw rfgq rcvr gq qm jmle. " \
      "sqgle qrpgle.kyicrpylq() gq pcamkkclbcb. lmu ynnjw ml rfc spj."
print(str.translate(str.maketrans('abcdefghijklmnopqrstuvwxyz', 'cdefghijklmnopqrstuvwxyzab')))
#此时的url被重定向为map.html
print('map'.translate(str.maketrans('abcdefghijklmnopqrstuvwxyz', 'cdefghijklmnopqrstuvwxyzab')))

{% endhighlight %}

运行后得到下一关入口：[http://www.pythonchallenge.com/pc/def/ocr.html](http://www.pythonchallenge.com/pc/def/ocr.html)

### 第2关

线索：`文字提示识别字符，字符可能在书中也可能在其他地方。`

因为我直接用得request获取网页源码，所以看到了一堆注释的乱七八糟的符号，要做的其实就是提取出这些符号中的字符。

实现代码如下：

{% highlight python %}
import requests
req = requests.get('http://www.pythonchallenge.com/pc/def/ocr.html')
left = req.text.rfind('<!--')
right = req.text.rfind('-->')

str = req.text[left+4:right]
for chs in str:
    if chs.isalpha():
        print(chs, end='')
{% endhighlight %}

运行后输出eequality， 因此得到下一关入口：[http://www.pythonchallenge.com/pc/def/equality.html](http://www.pythonchallenge.com/pc/def/equality.html)

### 第3关

线索：`提示：每边都有且仅有3个大保镖的小字符。（莫名萌感）`

不得不说这里是个坑（也怪自己英语理解能力功力不够），我开始以为是找到九宫格中仅有中间一格内是小写字符的所有字符，结果找出了一堆乱七八糟的字符。囧

看了答案才知道，提示里的EXACTLY着重在“3个”，而不是“每条边”，所以真正的含义是找到所有的恰好左侧和右侧都只有3个大写字符的小写字符。

直到真实含义后自己又实现了下，后来发现用正则表达式一行就够了。。。看来自己的姿势还是不够多，不够pythonic。

具体实现如下：

{% highlight python %}
def judgeItem(mat, i, j):
    if i < 0 or j < 0:
        return -1
    if i >= len(mat) or j >= len(mat[i]):
        return -1
    char = mat[i][j]
    if char >= 'A' and char <= 'Z':
        return 1
    if char >= 'a' and char <= 'z':
        return 0
    return -1

def judge(mat, i, j):
    if mat[i][j] >= 'a' and mat[i][j] <= 'z':
        bodyGds = judgeItem(mat, i, j-3) + judgeItem(mat, i, j-2) + judgeItem(mat, i, j-1)
        bodyGds += judgeItem(mat, i, j+1) + judgeItem(mat, i, j+2) + judgeItem(mat, i, j+3)
        if bodyGds == 6 and judgeItem(mat, i, j-4) == 0 and judgeItem(mat, i, j+4) == 0:
            return True

import re
import requests
req = requests.get('http://www.pythonchallenge.com/pc/def/equality.html')
left = req.text.rfind('<!--')
right = req.text.rfind('-->')

str = req.text[left+4:right]

mat = []
for line in str.split('\n'):
    if not line == '':
        mat.append(line)

for i in range(len(mat)):
    for j in range(len(mat[i])):
        if judge(mat, i, j):
            print(mat[i][j], end='')

#以上为我的实现方式。。。。
#简洁的方法
print(''.join(re.findall("[^A-Z]+[A-Z]{3}([a-z])[A-Z]{3}[^A-Z]", str)))
{% endhighlight %}

anyway，得到了下一关的入口：[http://www.pythonchallenge.com/pc/def/linkedlist.html](http://www.pythonchallenge.com/pc/def/linkedlist.html)

### 第4关

线索：`打开后显示linkedlist.php，因此手动转入，发现页面标题是follow the chain， 另外图片是一个链接`

感觉好像没什么线索，因为我还是用request获取源码，所以看到了额外的信息...

'''
<!-- urllib may help. DON'T TRY ALL NOTHINGS, since it will never 
end. 400 times is more than enough. -->
'''

结合点击图片后进入的页面可以猜想这是一个超过400个节点的链，我们要做的其实就是用爬虫来走这个链，一直走到终点得到答案。

实现代码如下：

{% highlight python %}
import re
import requests

baseUrl = 'http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing='
req = requests.get('http://www.pythonchallenge.com/pc/def/linkedlist.php')
res = re.findall('(\d+)', req.text)

req = requests.get(baseUrl + res[1])
print(baseUrl+res[1], req.text)
res = re.findall('(\d+)', req.text)

#while True:
#    req = requests.get(baseUrl + res[0])
#    print(baseUrl+res[0], req.text)
#    res = re.findall('(\d+)', req.text)
#    if res == '':
#        break
#    print(res)

#运行之后中间会断一次，需要除以2之后再跑
#http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=16044 Yes. Divide by two and keep going.

#后期还会给出两个nothing的例子，这个加一个判断就好，如果出现两个就取第二个

res.clear()
res.append(str(16044/2))
while True:
    if len(res) == 2:
        url = baseUrl + res[1]
    else:
        url = baseUrl + res[0]
    req = requests.get(url)
    print(url, req.text)
    res = re.findall('(\d+)', req.text)
    if len(res) == 0:
        break
{% endhighlight %}

最终得到peak.html

因此得到下一关入口：[http://www.pythonchallenge.com/pc/def/peak.html](http://www.pythonchallenge.com/pc/def/peak.html)

### 第5关

这一关就是阅读理解了。。。

线索：`进入后发现有张图片，命名为peakhell.jpg，下面提示pronounce it，另外页面源码可以发现一个peakhell标签，指向banner.p链接，并提示peak hell听起来熟悉吗？`

这道题我是没想出来，google之后发现是进入banner.p链接后，根据python的pickle模块来处理。

代码如下：

{% highlight python %}

import pickle
import  requests
import urllib.request
req = requests.get('http://www.pythonchallenge.com/pc/def/peak.html')
print(req.text) #得到banner.p
req = urllib.request.urlopen('http://www.pythonchallenge.com/pc/def/banner.p')
req = pickle.loads(req.read())
for line in req:
    print(''.join(elmt[0] * elmt[1] for elmt in line))

{% endhighlight %}

得到下一关的入口：[http://www.pythonchallenge.com/pc/def/channel.html](http://www.pythonchallenge.com/pc/def/channel.html)

### 第6关

线索：`页面内可用信息极其少，下方的捐款信息毫无疑问不能算是线索，只有一个注释zip`

根据zip可知这关可能需要解压模块zip，可是解压什么呢？尝试进入zip.html会得到一条信息：yes. find the zip。那么说明这个思路是对的，从而想到把channel.html换成channel.zip会下载到这个文件。解压后发现里面有个README文件，又是nothing...下面就是和第4关类似的操作了，不同的是第4关是网页，这次是文件。

代码如下：

{% highlight python %}

import re
import zipfile
import requests

req = requests.get('http://www.pythonchallenge.com/pc/def/channel.html')
print(req.text)#http://www.pythonchallenge.com/pc/def/channel.zip 下载
zpfile = zipfile.ZipFile("channel.zip")

id = 90052#源自README
res = []

while True:
    try:
        id = re.search('(\d+)', str(zpfile.read(str(id) + '.txt'))).group(1)
    except:
        print(zpfile.read(str(id) + '.txt'))
        break
    print(id)
    res.append(zpfile.getinfo(str(id) + '.txt').comment.decode('utf-8'))

print(''.join(res))#HOCKEY

req = requests.get('http://www.pythonchallenge.com/pc/def/hockey.html')

#提示结果是空气的成分，观察HOCKEY的组成，发现是oxygen
print(req.text)#OXYGEY

{% endhighlight %}

得到下一关的入口：[http://www.pythonchallenge.com/pc/def/oxygen.html](http://www.pythonchallenge.com/pc/def/oxygen.html)

### 第7关

线索：`页面仅有一张打码的图片`

自己想不出来，在网上看到说是对图片的打码部分按ascii解码。。。不明觉厉。（PS：从这里开始，感觉逻辑性就弱了很多）

代码如下：

{% highlight python %}
import PIL.Image
import urllib.request
#req = requests.get('http://www.pythonchallenge.com/pc/def/oxygen.html')
#print(req.text)
img = PIL.Image.open(urllib.request.urlopen('http://www.pythonchallenge.com/pc/def/oxygen.png'))
row = [chr(img.getpixel((x, 45))[0]) for x in range(0, 609, 7)]
print(''.join(row))
row = [chr(x) for x in [105, 110, 116, 101, 103, 114, 105, 116, 121]]
print(''.join(row))
{% endhighlight %}

得到单词integrity，从而得到下一关入口：[http://www.pythonchallenge.com/pc/def/integrity.html](http://www.pythonchallenge.com/pc/def/integrity.html)

### 第8关

线索：`进入后发现图片中的蜜蜂是一个链接，另外页面源码中包含un和pw两个字符串`

点击链接后提示输入用户名、密码，结合un、pw可以猜想这二者对应username,password。

看答案知道是用bz2解密。。。

代码如下：

{% highlight python %}
import bz2
import requests
req = requests.get('http://www.pythonchallenge.com/pc/def/integrity.html')
print(req.text)
print(bz2.decompress(b'BZh91AY&SYA\xaf\x82\r\x00\x00\x01\x01\x80\x02\xc0\x02\x00 \x00!\x9ah3M\x07<]\xc9\x14\xe1BA\x06\xbe\x084'))
print(bz2.decompress(b'BZh91AY&SY\x94$|\x0e\x00\x00\x00\x81\x00\x03$ \x00!\x9ah3M\x13<]\xc9\x14\xe1BBP\x91\xf08'))
{% endhighlight %}

得到用户名：huge 密码：file

点击链接输入后得到下一关入口：[http://www.pythonchallenge.com/pc/return/good.html](http://www.pythonchallenge.com/pc/return/good.html)

### 第9关

线索：`标题为connect the dots， 页面图片中也包含了很多黑点；另外源码中给出first second， 并问first + second = ?`

结合first second中数值特点可以猜想是坐标集，下面索要做的就是分别把first和second中的坐标连接起来。

代码如下：

{% highlight python %}
from PIL import Image
from PIL import ImageDraw

img = Image.open('good.jpg')
draw = ImageDraw.Draw(img)

first = [ 146,399,163,403,170,393,169,391,166,386,170,381,170,371,170,355,169,346,167,335,170,329,170,320,170,
310,171,301,173,290,178,289,182,287,188,286,190,286,192,291,194,296,195,305,194,307,191,312,190,316,
190,321,192,331,193,338,196,341,197,346,199,352,198,360,197,366,197,373,196,380,197,383,196,387,192,
389,191,392,190,396,189,400,194,401,201,402,208,403,213,402,216,401,219,397,219,393,216,390,215,385,
215,379,213,373,213,365,212,360,210,353,210,347,212,338,213,329,214,319,215,311,215,306,216,296,218,
290,221,283,225,282,233,284,238,287,243,290,250,291,255,294,261,293,265,291,271,291,273,289,278,287,
279,285,281,280,284,278,284,276,287,277,289,283,291,286,294,291,296,295,299,300,301,304,304,320,305,
327,306,332,307,341,306,349,303,354,301,364,301,371,297,375,292,384,291,386,302,393,324,391,333,387,
328,375,329,367,329,353,330,341,331,328,336,319,338,310,341,304,341,285,341,278,343,269,344,262,346,
259,346,251,349,259,349,264,349,273,349,280,349,288,349,295,349,298,354,293,356,286,354,279,352,268,
352,257,351,249,350,234,351,211,352,197,354,185,353,171,351,154,348,147,342,137,339,132,330,122,327,
120,314,116,304,117,293,118,284,118,281,122,275,128,265,129,257,131,244,133,239,134,228,136,221,137,
214,138,209,135,201,132,192,130,184,131,175,129,170,131,159,134,157,134,160,130,170,125,176,114,176,
102,173,103,172,108,171,111,163,115,156,116,149,117,142,116,136,115,129,115,124,115,120,115,115,117,
113,120,109,122,102,122,100,121,95,121,89,115,87,110,82,109,84,118,89,123,93,129,100,130,108,132,110,
133,110,136,107,138,105,140,95,138,86,141,79,149,77,155,81,162,90,165,97,167,99,171,109,171,107,161,
111,156,113,170,115,185,118,208,117,223,121,239,128,251,133,259,136,266,139,276,143,290,148,310,151,
332,155,348,156,353,153,366,149,379,147,394,146,399]
second = [156,141,165,135,169,131,176,130,187,134,191,140,191,146,186,150,179,155,175,157,168,157,163,157,159,
157,158,164,159,175,159,181,157,191,154,197,153,205,153,210,152,212,147,215,146,218,143,220,132,220,
125,217,119,209,116,196,115,185,114,172,114,167,112,161,109,165,107,170,99,171,97,167,89,164,81,162,
77,155,81,148,87,140,96,138,105,141,110,136,111,126,113,129,118,117,128,114,137,115,146,114,155,115,
158,121,157,128,156,134,157,136,156,136]

draw.line(first, fill='#0000FF')
draw.line(second, fill='#FF0000')
img.show()
{% endhighlight %}

连线的结果是一头牛，我想到的关键词是cow，输入后404，看答案说是bull(公牛)。。。

anyway，下一关的入口是：[http://www.pythonchallenge.com/pc/return/bull.html](http://www.pythonchallenge.com/pc/return/bull.html)

### 第10关

线索：`图片中牛是一条链接，点击后显示a = [1, 11, 21, 1211, 111221, 另外网页中图片下方提问len(a[30])=?`

可以想到是根据线索推算出a[30]，并计算a[30]的长度；可能是以前接触过，所以我一下就看出a的规律了，1->11是一个1的意思，...，1211->111221是一个1，一个2，两个1的意思。

因此写出以下代码推算a[30]：

{% highlight python %}
def compute(num):
    res = []
    pre = str(num)[0]
    cnt = 1
    for val in str(num)[1:]:
        if val == pre:
            cnt += 1
        else:
            res.append(str(cnt))
            res.append(str(pre))
            cnt = 1
        pre = val
    res.append(str(cnt))
    res.append(str(pre))
    #print(''.join(res))
    return ''.join(res)

a = []
a.append(1)
while len(a) < 32:
    a.append(compute(a[-1]))
print(len(a[30]))
{% endhighlight %}

得到结果5808，从而得到下一关入口：[http://www.pythonchallenge.com/pc/return/5808.html](http://www.pythonchallenge.com/pc/return/5808.html)

### 第11关

线索：`一张模糊的图片，标题提示odd or even`

完全没有思路，看了别人答案说是根据奇偶坐标生成一个新图...orz

代码如下：

{% highlight python %}
from PIL import Image
img = Image.open('cave.jpg')
img_value = img.load()
width, height = img.size
new_img = Image.new('RGB', (int(width/2), int(height/2)))

new_img_value = new_img.load()
for i in range(int(width/2)):
    for j in range(int(height/2)):
    	#下面两条语句执行效果是一样的
        new_img_value[i, j] = img_value[2*i, 2*j]
        #new_img_value[i, j] = img_value[2*i+1, 2*j+1]

new_img.show()
{% endhighlight %}

隐约可以看到图片上显示evil,所以得到下一关入口：[http://www.pythonchallenge.com/pc/return/evil.html](http://www.pythonchallenge.com/pc/return/evil.html)

### 第12关

线索：`只有一张图片`

没有任何线索，玩到这里感觉逻辑性已经很弱了，答案解释的理由也很牵强，直接给出参考的答案链接把[Python Challenge 第十二关 From 博客园](http://www.cnblogs.com/dukeleo/p/3467947.html)

照例贴一下代码：

{% highlight python %}

img = open('evil2.gfx', 'rb')
content = img.read()
img.close()

for i in range(5):
    img = open('%d.jpg' % i, 'wb')
    img.write(content[i::5])
    img.close()

{% endhighlight %}

根据5张图片上的字符组合成一个单词disproportional，得到下一关入口：[http://www.pythonchallenge.com/pc/return/disproportional.html](http://www.pythonchallenge.com/pc/return/disproportional.html)

### 结语

我就玩到这里了，因为到这里已经没有什么趣味性可言了，更多的是一种任务性在驱动，感觉无趣，就没有再玩下去了，如果有兴趣的朋友可以尝试继续挑战！