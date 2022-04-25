/*
 * @Description: 
 * @Author: tianyuexian
 * @Date: 2022-01-05 10:43:07
 * @LastEditors: tianyuexian
 * @LastEditTime: 2022-01-11 15:09:20
 */

// 白屏统计
export const blankScreen = function (params) {
  let wrapperElements = ['html','body','#app','.app-warp__main'], emptyPoints = 0;
  
  const getSelector = function(element) {
    
    if(element.id){
      return '#' + element.id
    }else if(element.className){
      return '.' + element.className.split(' ').filter(item => !!item).join('.');
    }else{
      return element.nodeName.toLowerCase()
    }
  }

  const isWrapper = function(element) {
    let selector = getSelector(element);
    if(wrapperElements.indexOf(selector) != -1){
      emptyPoints ++ 
    }
  }
  try {
    this.checkLoaded().then(()=>{
      for(let i = 1; i <= 9; i++){
        let xElements = document.elementsFromPoint(window.innerWidth * i /10, window.innerHeight / 2);
        let yElements = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight * i /10);
        isWrapper(xElements[0])
        isWrapper(yElements[0])
      }
      if(emptyPoints > 15){
        const centerElements = document.elementsFromPoint(window.innerHeight / 2, window.innerHeight / 2)
        this.params = {
          type: 3,
          attrs: {
            emptyPoints,
            screen: window.screen.width + 'X' + window.screen.height,
            viewPort: window.innnerWidth + 'X' + window.innerHeight,
            error: `页面白屏 白屏点数${emptyPoints}`,
            errorMsg: '页面白屏',
          }
        }
        this.errorMonitoring()
      }
    }).catch((error)=>{
      console.log(error)
    })
    
  }catch(error){
    console.log(error)
  }
  
}