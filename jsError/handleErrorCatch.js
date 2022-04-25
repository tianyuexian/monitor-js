/*
 * @Description: 
 * @Author: tianyuexian
 * @Date: 2022-01-05 10:42:10
 * @LastEditors: tianyuexian
 * @LastEditTime: 2022-01-18 15:58:18
 */
  // 手动错误上报
export const handleErrorCatch = function(handleParams) {
    if (handleParams) {
      if (!handleParams.attrs || !handleParams.attrs.error || !handleParams.attrs.errorType) {
        console.error('手动错误上报：attrs参数内置需要有error和errorType属性')
        return
      }
      this.params = {
        type: handleParams.type || 4,
        attrs: handleParams.attrs || {}
      }
      try {
        this.errorMonitoring()
      } catch (error) {
        console.log(error)
      }
    }
  }