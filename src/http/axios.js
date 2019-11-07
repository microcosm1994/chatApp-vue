import axios from 'axios'
import Config from './config'
import cookies from 'js-cookie'
import router from '../router'

export default function $axios (options) {
  return new Promise((resolve, reject) => {
    // 创建axios实例
    const instance = axios.create({
      baseURL: Config.baseUrl,
      headers: Config.headers,
      timeout: Config.timeout,
      withCredentials: Config.withCredentials
    })
    // 请求拦截
    instance.interceptors.request.use(
      config => {
        // 获取token
        let t = cookies.get('t')
        // 携带token
        if (t) {
          config.headers.t = t
        } else {
          // 如果没有token，重定向到登陆页
          router.push('/login')
        }
        // 根据请求方法，序列化传来的参数（根据后端需求是否序列化）
        if (config.method === 'post') {
          config.data = config.data
        }
        return config
      },
      error => {
        if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== 1) {
          console.log('请求超时')
        }
        const errorInfo = error.response
        // 重定向到错误的页面
        if (errorInfo) {
          error = errorInfo.data
          const errorStatus = errorInfo.status
          router.push({
            path: `/error/${errorStatus}`
          })
        }
        // 在catch中可以拿到错误信息
        return reject(error)
      }
    )
    // 响应拦截
    instance.interceptors.response.use(
      response => {
        let data
        if (response.data === undefined) {
          data = JSON.parse(response.request.responseText)
        } else {
          data = response.data
        }
        // 根据返回的错误码做不同的处理
        switch (data.status) {
          case 1:
            break
          case 2:
            break
          default:
            break
        }
        // 返回响应
        return data
      },
      error => {
        if (error && error.response.status) {
          switch (error.response.status) {
            case 400:
              error.message = '请求错误'
              break
            default:
              break
          }
        }
        return reject(error)
      }
    )
    instance(options).then(res => {
      resolve(res)
      return false
    }).catch(error => {
      reject(error)
    })
  })
}
