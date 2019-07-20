# AJAX介绍
今天学习了一下ajax特此记录一下，先放两参考链接
1. <https://blog.csdn.net/weixin_39194176/article/details/80933777>
2. <https://blog.csdn.net/c__dreamer/article/details/80456565>
- Ajax 不是一种新的编程语言，而是一种用于创建更好更快以及交互性更强的Web应用程序的技术。
- Ajax 通过在后台与服务器进行少量数据交换，Ajax可以使网页实现异步更新。这意味着可以在不重新加载整个网页的情况下，对网页的某部分进行更新。
- 传统的网页（不使用 Ajax）如果需要更新内容，必需重载整个网页面。

## ajax的实现步骤
1. 创建```XMLHTTPRequest```对象（异步调用对象）
2. 创建一个新的```HTTP```请求，并指定该```HTTP```请求的方法、```URL```及验证信息
3. 设置相应```HTTP```请求状态变化的函数
4. 发送```HTTP```请求. 
5. 获取异步调用返回的数据. 
6. 使用JavaScript和DOM实现局部刷新.

### 创建XMLHttpRequest对象
```html
var xmlHttp;
    if(window.XMLHttpRequest){
        xmlHttp = new XMLHttpRequest;
    }else{
        // 在IE5、IE6之前使用的是 ActiveXObject
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
```

### 向服务器发送请求
```html
xmlHttp.open('get', 'deom_get.json', 'true');
xmlHttp.send();
```
1. 连接服务器
- 上面创建的ajax对象xhr，使用xhr.open（"请求方式（GET/POST）"，url路径，“异步/同步”）。 
- 第三个参数：true===》异步、false===》同步。
- 当请求方式为POST的时候，代码写法如上；
- 当请求方式为GET的时候，使用xhr.open（"请求方式（GET/POST）"，url路径 + “？”请求数据 +  ，“异步/同步”）。
2. 发送请求
- 使用xhr.send（）发送请求
- 当请求方式为GET的时候，发送请求为xhr.send(null).
- 当请求方式为POST的时候，发送请求为xhr.send(请求数据)。
- 此外使用POST的时候必须在xhr.send（请求数据）上面添加
```
    xmlHttp.open('post', 'deom_get.json', 'true');
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.send('username=ayf&pwd=123456');
```     
## 响应处理   
使用ajax会想用一个事件readystatechange事件：当请求被发送到服务器时，我们需要执行一些基于响应的操作。
- 当readystatechange改变的时候，就会触发这个事件执行。
- readyState：请求的状态，返回的是状态码（0 - 4）：0（未初始化）open还没有调用、1（载入）已经调用了send（）正在发送请求、2（载入完成）send方法已经完成  已经收到了全部的响应内容、3（解析）正在解析响应内容、4（完成）响应内容解析完成  可以在客户端用了。
- status：返回请求的结果码：返回200（成功）、返回404（未找到）、返回5**（5开头）（服务器错误）
-  responseText 获得字符串形式的响应数据。 
- responseXML 获得XML 形式的响应数据。
```html
xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        //请求成功后的操作 这里只打印获取到的数据
        console.log(JSON.parse(xmlHttp.responseText));
    } else if (xmlHttp.status == 404) {
        console.log('找不到页面');
    }
}
```

## 一个简单的Ajax
```html
// 原生js实现 ajax        
function ajax() {
    var xmlHttp;
    if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest;
    } else {
        // 在IE5、IE6之前使用的是 ActiveXObject
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
    // get请求 demo_get.json 中随便写一点json数据 true表示异步请求
    xmlHttp.open('get', 'demo_get.json', 'true');
    xmlHttp.send();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            //请求成功后的操作 这里只打印获取到的数据
            console.log(JSON.parse(xmlHttp.responseText));
        } else if (xmlHttp.status == 404) {
            console.log('找不到页面');
        }
    }
}
```

## Ajax封装 有点jq中ajax的感觉了（不过jq中是用promise写的）
```js
function ajax(obj) {
    if (Object.prototype.toString.call(obj) != '[object Object]') {
        console.log('错误使用');
    }
    // 可以默认部分参数
    obj.type = obj.type || 'get';
    obj.async = obj.async || 'true';
    // 获取data中的数据 这里data必须是一个{};
    if (obj.data && Object.prototype.toString.call(obj) == '[object Object]') {
        var param = '';
        /*下面注释是我一开始能想到的方法*/
        // for (const key in obj.data) {
        //     if (obj.data.hasOwnProperty(key)) {
        //         param += `${key}=${obj.data[key]}&`;
        //     }
        // }
        // 去掉最后两个 &&
        // param = param.slice(0, param.length - 2);

        /*这是链接中'别人家的代码' 别人家的就是优秀*/
        param = formsParams(obj.data);

        function formsParams(data) {
            var arr = [];
            for (var prop in data) {
                arr.push(prop + "=" + data[prop]);
            }
            /*
            join 是Array原型上面的方法；
            join() 方法将一个数组（或一个类数组对象）的所有元素连接成一个字符串并返回这个字符串。
            如果数组只有一个项目，那么将返回该项目而不使用分隔符。
            */
            return arr.join("&");
        }

        var xmlHttp;
        xmlHttp = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject('Microsoft.XMLHTTP');
        // 不区分大小写
        var ignoreCaseGet = /get/i;
        var ignoreCasePost = /post/i;
        if (ignoreCaseGet.test(obj.type)) { //get 请求方式
            obj.url = obj.url + `?${param}`;
            xmlHttp.open(obj.type, obj.url, obj.async);
            xmlHttp.send();
        } else if (ignoreCasePost.test(obj.type)) { //post请求方式
            xmlHttp.open(obj.type, obj.url, obj.async);
            xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlHttp.send(param);
        }
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                obj.success(xmlHttp.responseText);
            } else {
                obj.error();//这个有点假的 以后再搞
            }
        }
    }
}

var obj = {
    url: 'demo_get.json',
    data: {
        username: 'ayf',
        pwd: '123456'
    },
    success: function(res) {
        console.log(res);
    },
    error: function() {
        console.log('网络错误');
    }
}
ajax(obj)
```

## Jq中Ajax的封装（等学了promise再来补充）
