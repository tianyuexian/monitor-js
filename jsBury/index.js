/*
 * @Description: 
 * @Author: tianyuexian
 * @Date: 2022-01-18 12:01:02
 * @LastEditors: tianyuexian
 * @LastEditTime: 2022-01-19 11:57:08
 */
class JsBury{
  constructor({buryConfig,Router}){
    this.buryConfig = buryConfig
    this.params = {}
    this.router = Router || null
  }
  get presetParams(){
    return {
      userAgent: navigator.userAgent,
      userName: this.buryConfig.userId || '',
      appId: this.buryConfig.appId || '',
      pageName: this.buryConfig.pageName || ''
    }
  }
  // 手动上报
  trackEvent({id, desc, attrs}) {
    return new Promise(async (reslove) => {
      this.params = {
        logType: 2,
        eventId: id,
        eventDesc: desc || '',
        attrs: attrs || '',
        reportTime: Date.now(),
  
        // traceId: Date.now() * Math.random() * 10000,
        url: window.location.href,
        referrer: '',
        ...this.presetParams
      }
      try {
        await this.request()
        reslove()
      } catch(e) {
      }
    })
    
  }

  request() {
    return new Promise(reslove => {
      let args = '';
      for (let i in this.params) {
        if (args != '') {
            args += '&';
        }
        if (typeof this.params[i] === 'object') {
          args += i + '=' + encodeURIComponent(JSON.stringify(this.params[i]));
        } else {
          args += i + '=' + encodeURIComponent(this.params[i]);
        }
      }
      if (this.buryConfig.url) {
        console.log(this.buryConfig.url + '?' + args)
        let img = new Image();
        img.src = this.buryConfig.url + '?' + args;
      }
      reslove()
    })
  }

  init(){
    // if(this.router){
    //   this.router.beforeEach((to,from,next)=>{
    //     console.log(to,from)
    //     next()
    //   })
    // }
    
  }
}

export default JsBury