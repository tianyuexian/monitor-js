/*
 * @Description: 
 * @Author: tianyuexian
 * @Date: 2022-01-04 17:13:33
 * @LastEditors: tianyuexian
 * @LastEditTime: 2022-04-24 16:30:43
 */
// 请求参数处理接受口
import {utilDecorators} from './decorators'

@utilDecorators
class JsError{
  constructor({errorCatchconfig,closeReport = false,Vue,wrapperElements,blankScreenWrapperElements,WeChat}){
    this.errorCatchconfig =  errorCatchconfig
    this.closeReport = closeReport
    this.Vue = Vue
    this.WeChat = WeChat
    this.params = {}
    this.lastEvent = null,
    this.blankScreenWrapperElements = blankScreenWrapperElements || ['html','body','#app']
    this.lastEventSelector = null,
    this.reportType = ['js错误','vue错误','unhandledPromise错误','白屏错误','手动上报错误']
  }
  get currentUrl(){
    if(this.WeChat){ // 微信小程序
      const pages = getCurrentPages()
      const currentPage = pages.length ? pages[pages.length - 1] : ''
      const url = currentPage.route
      return url
    }else{
      return this.setUrl(window.location.href)
    }
  }

  get navigator(){
    let _nav
    if(this.WeChat){
      this.WeChat.getSystemInfo({
        success(res){
          _nav = res
        }
      })
    }else{
      _nav = navigator.userAgent
    }
    return _nav
  }
  // 接受口
  errorMonitoring() {
    if(this.closeReport) return
    // vue错误路径url转换
    // if (this.params.type === 1) {
    //   if (this.params.attrs.stack) {
    //     this.params.attrs.stack = setUrl(this.params.attrs.stack.split('\n')[1])
    //   }
    // }
    const nowTime = Date.parse(new Date())

    const set = {
      url: this.currentUrl,
      date: this.timestampToTime(nowTime),
      UserAgent: this.navigator,
      lastEvent: this.lastEvent ? this.lastEvent.type : '',
      lastEventSelector: this.lastEvent ? this.getSelectors(this.lastEvent.path) : ''
    }

    const data = Object.assign(set, this.params)
    // 发送请求
    try {
      this.query(data)
    } catch (error) {
    }
  }
  weChatRequest(data){
    if(!this.WeChat) return
    wx.request({
      url: this.errorCatchconfig.queryUrl, 
      data:data,
      success (res) {
      }
    })
  }

   // 请求发送函数
  query(data) {
    // 多参数拼接
    const publickParam = this.errorCatchconfig || {}
    const config = {
      queryUrl: publickParam.queryUrl || '',
      timeout: publickParam.timeout || 4000
    }
    let args = ''
    data.userId = publickParam.userId || ''
    data.appId = publickParam.appId || ''

    // 判断是否是小程序
    if(this.WeChat){
      // 获取用户信息
      this.WeChat.getUserInfo({
        success:(res)=>{
          data.userId = res?.userInfo
          this.weChatRequest(data)
        }
      })
      return
    }
    for (const i in data) {
      if (args != '') {
        args += '&'
      }
      if (typeof data[i] === 'object') {
        args += i + '=' + encodeURIComponent(JSON.stringify(data[i]))
      } else {
        args += i + '=' + encodeURIComponent(data[i])
      }
    }
    // console.log('上报参数',decodeURIComponent(args))
    if (config.queryUrl) {
      const img = new Image()
      img.src = config.queryUrl + '?' + args

      const timer = setTimeout(function() {
        if (!img.complete) {
          img.src = ''
        }
        clearTimeout(timer)
      }, timeout)
    } else {
      console.error('错误监控没有传递请求前缀')
    }
  }

  

  init(){
    try{
      this.vueErrorCatch()
      this.getLastEvent()
      // this.blankScreen()
      // js错误监控
      window.onerror = (msg, url, line, col, error)=> {
        // console.log('这是一条js报错信息-----',err)
        // 没有URL/错误原因不上报
        if (error === null) {
          return
        }
        
        try {
          this.params = {
            type: 0,
            attrs: {
              errUrl: this.setUrl(url),
              line: line,
              col: col,
              error: error.toString(),
              errorMsg: msg
            }
          }  
          this.errorMonitoring()
        } catch (error) {
          console.log(error)
        }
      }

      window.addEventListener('unhandledrejection', (error) => {
        // 如果reson里面包含message 那说明是promise里面逻辑抛出的错误, 如果因为里面写了reject但是没有被捕获那么就不走错误逻辑
        if(!error.reason || !error.reason.message) return
        
        try {
          this.params = {
            type: 2,
            attrs: {
              errorMsg: error.reason.message,
              error: error.reason.stack || error.reason.message,
              errorType: error.type
            }
          }
          this.errorMonitoring()
        } catch (error) {
          console.log(error)
        }
      }, true);


    } catch(error){
      console.log(error)
    }
    
  }

  // 微信小程序初始化，自动上报
  weChatInit(){
  if(!this.WeChat) return
  try{
    // this.WeChat.onError((error)=>{

    //   console.log('小程序报错',error)
    // })
    this.vueErrorCatch()
  }catch(error){
    console.log(error)
  }
}
}

export default JsError
