/*
 * @Description: 
 * @Author: tianyuexian
 * @Date: 2022-01-05 10:42:01
 * @LastEditors: tianyuexian
 * @LastEditTime: 2022-03-23 11:53:11
 */
// vue错误上报

export const vueErrorCatch = function(){
  if (!this.Vue) return
  this.Vue.config.productionTip = false
  this.Vue.config.errorHandler = (err, vm, info)=> {
    // 拦截之后vue不会在浏览器console中报错，必须要这样返回回去
    console.log('这是一条vue报错信息-----',err)
    console.error(err)
    
    if(!err.message) return;   
    
    try {
      this.params = {
        type: 1,
        attrs: {
          errorMsg: err.message,
          error: err.stack,
          info: info,
          errorType: err.name
        }
      }
      // eslint-disable-next-line no-undef
      this.errorMonitoring()
    } catch (error) {
      console.log(error)
    }
  }
}