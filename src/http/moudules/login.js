import axios from '../axios'

// 登陆方法
export const getMessageCode = (data) => {
  return axios({
    url: '/api/user/getMessageCode',
    method: 'post',
    data
  })
}

// 验证短信验证码
export const checkingCode = (data) => {
  return axios({
    url: '/api/user/checkingCode',
    method: 'post',
    data
  })
}
