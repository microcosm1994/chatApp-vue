import db from './db'

export default {
  cookies: () => {
    let cookies = {}
    document.cookie.split(';').forEach(function (res) {
      if (res) {
        let arr = res.split('=')
        cookies[db.trim(arr[0])] = db.trim(arr[1])
      }
    })
    return cookies
  },
  get: (name) => {
    let cookies = this.a.cookies()
    console.log(cookies)
    let cookie = cookies[name]
    return decodeURIComponent(cookie)
  },
  set: (key, value, options) => {
    if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) {
      return false
    }
    if (!value) {
      return false
    }
    let sExpires = ''
    if (options) {
      if (options.expires) {
        if (typeof options.expires === 'number') {
          sExpires = '; expires=' + new Date(Date.now() + options.expires * 864e5)
        } else {
          sExpires = ';expires=' + options.expires
        }
      } else {
        sExpires = ';expires=' + new Date()
      }
      document.cookie = encodeURIComponent(key) + '=' + value + sExpires + (options.domain ? '; domain=' + options.domain : '') + (options.path ? '; path=' + options.path : '') + (options.secure ? '; secure' : '')
    } else {
      document.cookie = encodeURIComponent(key) + '=' + encodeURIComponent(value)
    }
  },
  remove: (key) => {
    if (!this.a.hasCookie(key)) {
      return false
    }
    document.cookie = encodeURIComponent(key) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  },
  hasCookie: (key) => {
    return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(key).replace(/[-.+*]/g, '\\$&') + '\\s*\\=')).test(document.cookie)
  }
}
