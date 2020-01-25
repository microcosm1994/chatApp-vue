import axios from 'axios'
import Config from './config'
import utils from '../utils'
import router from '../router'
import {Message} from 'element-ui'

export default function $axios (options) {
  return new Promise((resolve, reject) => {
    // 创建axios实例
    const instance = axios.create({
      headers: Config.headers,
      timeout: Config.timeout,
      withCredentials: Config.withCredentials
    })
    // 请求拦截
    instance.interceptors.request.use(
      config => {
        config.baseURL = Config.baseURL
        // 获取token
        let t = utils.cookie.get('t')
        // 携带token
        if (t) {
          config.headers.t = t
        } else {
          // 如果没有token，重定向到登陆页
          router.push('/')
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
        if (response.data) {
          data = response.data
        } else {
          data = JSON.parse(response.request.responseText)
        }
        // 根据返回的错误码做不同的处理
        switch (data.status) {
          case 0:
            Message.error(data.msg)
            break
          case 1:
            Message.success(data.msg)
            break
          default:
            Message.info(data.msg)
            break
        }
        // 返回响应
        return data
      },
      error => {
        let data = error.response.data
        console.log(error.response)
        if (error && error.response.status) {
          switch (error.response.status) {
            case 400:
              error.message = '请求错误'
              break
            case 401:
              Message.error(data.msg)
              error.message = 'token验证错误'
              router.push('/')
              break
            default:
              break
          }
        }
        return reject(error)
      }
    )
    // 请求处理
    instance(options).then(res => {
      return resolve(res)
    }).catch(error => {
      return reject(error)
    })
  })
}
