# api-cache

JavaScript对API数据的缓存组件，可以利用localStorage来存储不常更新但经常访问的接口数据，通过设置缓存时间来控制实际发起请求的最小时间间隔。

### 浏览器兼容性

需要支持`localStorage`和`JSON`，请参考[http://caniuse.com/#search=localStorage](http://caniuse.com/#search=localStorage)、[http://caniuse.com/#feat=json](http://caniuse.com/#feat=json)

### 依赖

目前依赖[jQuery](http://jquery.com)，如果不希望依赖jQuery可以自己去实现函数`$.extend`方法

### 使用示例

```js
    var one = new ApiCache({
        name: "sidebar",
        callback: function(ret){ //对数据处理的回调函数
            console.log(ret);
        },
        ajax: function(){ //发起请求的函数，需要返回Promise对象
            return $.ajax({
                url: "/user/sidebar",
                dataType: "json"
            });
        }
    });
    one.start();
```
