import axios from '../axios'

// 登陆方法
export const login = (data) => {
  return axios({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 验证验证码
export const checkCode = (data) => {
  return axios({
    url: '/user/checkCode',
    method: 'post',
    data
  })
}
