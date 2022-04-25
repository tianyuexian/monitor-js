(function(w, d) {
  let data = w.JZbury;
  function urlChange(callback) {
    let _wr = function(type) {
      let orig = history[type];
      return function() {
          let rv = orig.apply(this, arguments);
          let e = new Event(type);
          e.arguments = arguments;
          window.dispatchEvent(e);
          return rv;
      };
    };
    history.pushState = _wr('pushState');
    history.replaceState = _wr('replaceState');
    let time = null

      window.addEventListener('replaceState', function() {
        if (time) {
          clearTimeout(time)
        }
        time = setTimeout(() => {
          callback()
        }, 100)
      });

      window.addEventListener('pushState', function() {
        if (time) {
          clearTimeout(time)
        }
        time = setTimeout(() => {
          callback()
        }, 100)
      });

      window.addEventListener('popstate', function() {
        if (time) {
          clearTimeout(time)
        }
        time = setTimeout(() => {
          callback()
        }, 100)
      })
  }

  let startHref = w.location.href
  urlChange(() => {
    setTimeout(function() {
      startHref = w.location.href
    }, 400)
  })

  // w.addEventListener('click', () => {
  //   setTimeout(function() {
  //     let nowHref = w.location.href
  //     if (nowHref !== startHref) {
  //       startHref = nowHref
  //     }
  //   }, 400)
  // });

  let config = {
    ua: navigator.userAgent,
    un: data.userName || '',
    pt: data.pageTitle || ''
  }
  let request = function(params) {
    let args = '';
    for (let i in params) {
        if (args != '') {
            args += '&';
        }
        if (typeof params[i] === 'object') {
          args += i + '=' + encodeURIComponent(JSON.stringify(params[i]));
        } else {
          args += i + '=' + encodeURIComponent(params[i]);
        }
    }
    if (data.url) {
      let img = new Image();
      img.src = data.url + '?' + args;
      let timeout = data.timeout || 1000
      let timer = setTimeout(function() {
        if (!img.complete) {
          img.src = ''
        }
        clearTimeout(timer)
      }, timeout)
    }

  }

  let trackEvent = function(eventId, eventLabel, attrs, callback) {
    let params = {
      lt: 1,
      e: eventId,
      el: eventLabel || '',
      attrs: attrs || '',
      ct: Date.now(),

      // traceId: Date.now() * Math.random() * 10000,
      v: startHref,
      r: '',
      ...config
    }
    if (callback && typeof callback === 'function') {
      callback()
    }

    // console.log(params);
    request(params)
  }
  let pageInit = function(pageId, eventLabel, attrs, callback) {

    let params = {
      lt: 2,
      e: pageId || '',
      el: eventLabel || '',
      attrs: attrs || '',
      v: window.location.href,
      r: startHref === window.location.href ? '' : startHref,
      ct: Date.now(),

      // traceId: Date.now() * Math.random() * 10000,
      ...config
    }
    if (callback && typeof callback === 'function') {
      callback()
    }

    // console.log(params);
    request(params)
  }
  if (typeof data.autoSendPageView === 'undefined' ? true : data.autoSendPageView) {
      try {
        pageInit()
      } catch (error) {
        console.log(error);
      }

      urlChange(function() {
        try {
          pageInit()
        } catch (error) {
          console.log(error);
        }
      })
  }

  let enableClickAutoTracker = function(filters) {
    if (filters && typeof filters === 'object') {
      d.addEventListener('click', (e) => {
        let dataAuto = filters.attr
        let dataTarget = e.target.getAttribute(dataAuto)
        if (dataTarget) {
          let params = {
            lt: 1,
            v: startHref,
            ct: Date.now(),
            r: '',

            // traceId: Date.now() * Math.random() * 10000,
            ...JSON.parse(dataTarget),
            ...config
          }

          // console.log(params);
          request(params)
        }
      });
    } else {
      w.addEventListener('click', () => {
          let params = {
            lt: 1,
            v: startHref,
            ct: Date.now(),
            r: '',

            // traceId: Date.now() * Math.random() * 10000,
            ...config
          }

          // console.log(params);
          request(params)
      });
    }
  }
  // eslint-disable-next-line
  return JZbury = {
    trackEvent, pageInit, enableClickAutoTracker
  }
})(window, document)
