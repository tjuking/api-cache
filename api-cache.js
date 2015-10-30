/*
 * api-cache.js 0.2
 * https://github.com/tjuking/api-cache
 * 可用于缓存接口数据到localStorage中
 */

(function (global, factory) {

    "use strict";

    if (typeof define === "function" && define.amd) {
        define(["jquery"], function ($) {
            return factory($, global);
        });
    } else if (typeof exports !== "undefined") {
        module.exports = factory(require("jquery"), global);
    } else {
        global.ApiCache = factory(jQuery, global);
    }

})(typeof window !== "undefined" ? window : this, function ($, window) {

    "use strict";

    var storageSupport = supportStorage(); //localStorage支持性
    var jsonSupport = supportJson(); //JSON支持性
    var noop = function () { //空函数

    };

    function ApiCache(options) {
        var defaultOptions = {
            prefix: "api_", //localStorage存储接口数据key值的前缀
            name: "", //localStorage存储接口数据key值后半部分，必填
            timePrefix: "t_api_", //localStorage存储时间戳key值的前缀
            callback: noop, //callback是得到数据后的回调函数，必填
            ajax: noop, //ajax是发起请求的函数，需要返回Promise对象，必填
            time: 300000 //默认缓存五分钟
        };
        $.extend(this.option, defaultOptions, options);
    }

    ApiCache.prototype = {

        constructor: ApiCache,

        //所需支持性的检测，name不能为空
        check: function () {
            return storageSupport && jsonSupport && this.name;
        },

        //入口函数，无需请求接口返回值为true，否则返回false
        start: function () {
            if (this.check()) {
                var now = +new Date();
                var lastTime = localStorage.getItem(this.timePrefix + this.name);
                var lastData = localStorage.getItem(this.prefix + this.name);
                //存在数据且小于缓存时间
                if (lastData && (now - lastTime < this.time)) {
                    lastData = JSON.parse(lastData);
                    this.callback.call(window, lastData);
                    return true;
                }
            }
            this.sendAjax();
            return false;
        },

        //请求接口数据
        sendAjax: function () {
            var _this = this;
            this.ajax().done(this.callback).done(function (ret) {
                _this.set(ret); //请求到数据后需要存储数据和标记时间
            });
        },

        //设置存储的接口数据和时间戳
        set: function (ret) {
            if (this.check()) {
                localStorage.setItem(this.prefix + this.name, JSON.stringify(ret));
                localStorage.setItem(this.timePrefix + this.name, +new Date());
            }
        },

        //清除存储的接口数据和时间戳
        empty: function () {
            if (this.check()) {
                localStorage.removeItem(this.prefix + this.name);
                localStorage.removeItem(this.timePrefix + this.name);
            }
        }
    };

    //是否支持localStorage的特性检测
    function supportStorage() {
        try {
            localStorage.setItem("storageSupport", "1");
            localStorage.removeItem("storageSupport");
            return true;
        } catch (e) {
            return false;
        }
    }

    //是否支持JSON的检测
    function supportJson() {
        return window.JSON && JSON.stringify && typeof JSON.stringify == "function" && JSON.parse && typeof JSON.parse == "function";
    }

    return ApiCache;

});