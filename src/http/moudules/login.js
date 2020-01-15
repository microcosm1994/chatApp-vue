import axios from '../axios'

// 登陆方法
export const login = (data) => {
  return axios({
    url: '/api/user/login',
    method: 'post',
    data
  })
}
