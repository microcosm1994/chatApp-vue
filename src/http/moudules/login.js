import axios from '../axios'

// 登陆方法
export const login = (data) => {
  return axios({
    url: '',
    method: 'post',
    data
  })
}
