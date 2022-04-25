<!--
 * @Description: 
 * @Author: tianyuexian
 * @Date: 2022-04-25 16:04:48
 * @LastEditors: tianyuexian
 * @LastEditTime: 2022-04-25 17:26:28
-->
> A javascript and vue error report for vue project 

## Install
``` shell
npm install monitor-js -S
```
## Quick Start
在vue入口地方做上报vue的上报，获取一下用户的userId
queryUrl：新业态url都是固定的---/monitor/api/webPageReport/reportError
appId： 表示项目的唯一值，根据项目不同而不同
``` javascript
import Vue from 'vue'
import { jsErrorReport } from 'monitor-js'
if (process.env.NODE_ENV !== 'development') {
  Vue.prototype.$errorReport = jsErrorReport({
    errorCatchconfig: {
      queryUrl: '/monitor/api/webPageReport/reportError',
      userId: this.$store.state.user?.info?.name || '',
      appId: 'zebra-bus'
    },
    Vue: Vue
  })
  this.$errorReport.init()
}
```
如果项目中中存在手动上报那可以调用
``` javascript
this.$errorReport.handleErrorCatch({
  attrs: {
    error: '这是个手动报错',(比较详细的报错参数)
    errorType: '错误了错误了'(简单的报错描述)
  }
})
```

## Example
错误信息上报的消息包含以下几个项目
通过图片格式进行上报(可支持跨域并且能把普通接口和上报区分开来)，需要后端开发相应的上报接口上报url参考queryUrl
``` javascript
{
url: http://localhost:8080/zebra-monitor/jserror?pageSize=10%26pageNum=1
date: 2022-04-25 17:19:48
UserAgent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.83 Safari/537.36
lastEvent: mouseover
lastEventSelector: html>body>div#app
type: 1
attrs: {"errorMsg":"aa is not defined","error":"ReferenceError: aa is not defined\n    at VueComponent.created (webpack-internal:///./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/views/jsError/index.vue?vue&type=script&lang=js&:196:17)\n    at invokeWithErrorHandling (webpack-internal:///./node_modules/vue/dist/vue.runtime.esm.js:1853:57)\n    at callHook (webpack-internal:///./node_modules/vue/dist/vue.runtime.esm.js:4213:7)\n    at VueComponent.Vue._init (webpack-internal:///./node_modules/vue/dist/vue.runtime.esm.js:4998:5)\n    at new VueComponent (webpack-internal:///./node_modules/vue/dist/vue.runtime.esm.js:5144:12)\n    at createComponentInstanceForVnode (webpack-internal:///./node_modules/vue/dist/vue.runtime.esm.js:3280:10)\n    at init (webpack-internal:///./node_modules/vue/dist/vue.runtime.esm.js:3111:45)\n    at merged (webpack-internal:///./node_modules/vue/dist/vue.runtime.esm.js:3298:5)\n    at createComponent (webpack-internal:///./node_modules/vue/dist/vue.runtime.esm.js:5968:9)\n    at createElm (webpack-internal:///./node_modules/vue/dist/vue.runtime.esm.js:5915:9)","info":"created hook","errorType":"ReferenceError"}
userId: tianyuexianceshi1212
appId: zebra-bus
}
```

## other
本项目没有添加sourcemap解码定位功能
如果想快速定位错误位置，可以自己保存一份sourcemap文件，然后执行本git仓库根目录下的sourcemap.js文件，修改searchSource的文件名和输入行列
