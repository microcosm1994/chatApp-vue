import axios from '../axios'

// 登陆方法
export const getUserList = (data) => {
  return axios({
    url: '/user/getUserList',
    method: 'post',
    data
  })
}
